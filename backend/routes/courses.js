const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
let Course = require('../models/course.model');

// --- Gemini API Setup ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function callGeminiAPI(prompt) {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate content from AI.");
    }
}

// @route   POST /courses/generate-objective
router.post('/generate-objective', async (req, res) => {
    try {
        const { topic, experienceLevel, language } = req.body;
        const prompt = `Act as a curriculum designer. For a course titled "${topic}" aimed at a "${experienceLevel}" audience, write a single, clear, and concise learning objective in ${language}.`;
        const objectiveText = await callGeminiAPI(prompt);
        res.json({ objective: objectiveText });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /courses/generate-outcome
router.post('/generate-outcome', async (req, res) => {
    try {
        const { objective, experienceLevel, language } = req.body;
        const prompt = `Based on the course objective "${objective}" for a "${experienceLevel}" audience, list three key learning outcomes in ${language}.`;
        const outcomeText = await callGeminiAPI(prompt);
        res.json({ outcome: outcomeText });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /courses/generate-index
router.post('/generate-index', async (req, res) => {
    try {
        const { topic, subTopicCount, language } = req.body;
        const prompt = `Create a course outline in ${language} for a course on "${topic}". Break it down into exactly ${subTopicCount} sub-topics. For each sub-topic, list 3 lesson titles. Your response must be in JSON format. The structure should be an array of objects, where each object has a "title" (for the sub-topic) and a "lessons" array (an array of objects, each with a "title" for the lesson).`;
        const jsonString = await callGeminiAPI(prompt);
        const cleanedJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        const generatedIndex = JSON.parse(cleanedJson);
        res.json({ index: generatedIndex });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate a valid course index from AI.' });
    }
});

// @route   POST /courses/generate-lesson-content
router.post('/generate-lesson-content', async (req, res) => {
    try {
        const { lessonTitle, topic, language } = req.body;
        const prompt = `You are an expert instructor. For a course on "${topic}", write the theory content in ${language} for the lesson titled "${lessonTitle}". The content should be a detailed explanation of at least 300 words. Format the response as clean text, with paragraphs separated by a double newline character. Do not use markdown like asterisks or hashtags.`;
        const content = await callGeminiAPI(prompt);
        res.json({ content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /courses/generate-lesson-media
router.post('/generate-lesson-media', async (req, res) => {
    try {
        const { lessonTitle, topic, format, pageToken } = req.body;
        let videoUrl = null, imageUrl = null, channelTitle = null, channelUrl = null, nextPageToken = null, prevPageToken = null;

        if (format === 'Video and Theory') {
            const searchQuery = encodeURIComponent(`${lessonTitle} ${topic} tutorial`);
            const apiKey = process.env.YOUTUBE_API_KEY;
            if (apiKey) {
                let youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=1&key=${apiKey}`;
                if (pageToken) youtubeApiUrl += `&pageToken=${pageToken}`;
                const response = await axios.get(youtubeApiUrl);
                nextPageToken = response.data.nextPageToken || null;
                prevPageToken = response.data.prevPageToken || null;
                if (response.data.items && response.data.items.length > 0) {
                    const item = response.data.items[0];
                    videoUrl = `https://www.youtube.com/embed/${item.id.videoId}`;
                    channelTitle = item.snippet.channelTitle;
                    channelUrl = `https://www.youtube.com/channel/${item.snippet.channelId}`;
                }
            }
        } else {
            const searchQuery = encodeURIComponent(`${lessonTitle} ${topic}`);
            const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
            if (unsplashKey) {
                const response = await axios.get(`https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=1&client_id=${unsplashKey}`);
                if (response.data.results && response.data.results.length > 0) {
                    imageUrl = response.data.results[0].urls.regular;
                }
            } else {
                imageUrl = `https://source.unsplash.com/1280x720/?${searchQuery}&sig=${Math.random()}`;
            }
        }
        res.json({ videoUrl, imageUrl, channelTitle, channelUrl, nextPageToken, prevPageToken });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch media." });
    }
});

// @route   POST /courses/ask-tanisi
router.post('/ask-tanisi', async (req, res) => {
    try {
        const { question, courseContext } = req.body;
        if (!question || !courseContext) {
            return res.status(400).json({ msg: 'A question and course context are required.' });
        }
        const prompt = `You are TANISI, an expert AI teacher for a course on "${courseContext.topic}". A student asks: "${question}". Based on the course context (Objective: ${courseContext.objective}, Lessons: ${courseContext.index.map(s => s.title).join(', ')}), provide a clear, helpful, and encouraging answer.`;
        const answer = await callGeminiAPI(prompt);
        res.json({ answer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /courses/generate-quiz
// @desc    Generate a quiz for the course
router.post('/generate-quiz', async (req, res) => {
    try {
        const { courseContext } = req.body;
        if (!courseContext) {
            return res.status(400).json({ msg: 'Course context is required.' });
        }

        const prompt = `Based on the course content for "${courseContext.topic}", generate a 20-question multiple-choice quiz. The questions should cover the key objectives and outcomes. For each question, provide 4 options and indicate the correct answer. Respond ONLY with a valid JSON array of objects. Each object must have these keys: "question" (string), "options" (an array of 4 strings), and "correctAnswer" (a string that exactly matches one of the options).`;
        
        const jsonString = await callGeminiAPI(prompt);
        const cleanedJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        const quizData = JSON.parse(cleanedJson);
        res.json(quizData);

    } catch (err) {
        console.error("Error generating quiz:", err);
        res.status(500).json({ error: 'Failed to generate a valid quiz from AI.' });
    }
});

// @route   POST /courses/save
router.post('/save', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        const savedCourse = await newCourse.save();
        res.status(201).json({ msg: 'Course saved successfully!', courseId: savedCourse._id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save the course to the database.' });
    }
});

// @route   GET /courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
