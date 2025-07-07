const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
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
// --- End of Gemini API Setup ---

// @route   POST /courses/generate-objective
// @desc    Generate a course objective using the topic and experience level
router.post('/generate-objective', async (req, res) => {
    try {
        const { topic, experienceLevel } = req.body; // <-- Added experienceLevel
        if (!topic || !experienceLevel) {
            return res.status(400).json({ msg: 'Topic and experience level are required.' });
        }
        // Updated prompt to include experience level
        const prompt = `Act as a curriculum designer. For a course titled "${topic}" aimed at a "${experienceLevel}" audience, write a single, clear, and concise learning objective. The objective should state what the learner will be able to do upon completion. Start with "Upon completing this course, you will be able to...".`;
        const objectiveText = await callGeminiAPI(prompt);
        res.json({ objective: objectiveText });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /courses/generate-outcome
// @desc    Generate a course outcome using the objective and experience level
router.post('/generate-outcome', async (req, res) => {
    try {
        const { objective, experienceLevel } = req.body; // <-- Added experienceLevel
        if (!objective || !experienceLevel) {
            return res.status(400).json({ msg: 'Objective and experience level are required.' });
        }
        // Updated prompt to include experience level
        const prompt = `Based on the course objective "${objective}" for a "${experienceLevel}" audience, list three key learning outcomes. These should be specific, measurable skills or knowledge the learner will acquire. Format the response as a simple, unnumbered list with each outcome on a new line.`;
        const outcomeText = await callGeminiAPI(prompt);
        res.json({ outcome: outcomeText });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- Other routes remain the same ---

// @route   POST /courses/generate-index
router.post('/generate-index', async (req, res) => {
    try {
        const { topic, subTopicCount } = req.body;
        const prompt = `Create a course outline for a course on "${topic}". Break it down into exactly ${subTopicCount} sub-topics. For each sub-topic, list 3 lesson titles. Your response must be in JSON format. The structure should be an array of objects, where each object has a "title" (for the sub-topic) and a "lessons" array (an array of objects, each with a "title" for the lesson). Example: [{"title": "Sub-Topic 1", "lessons": [{"title": "Lesson 1.1"}, {"title": "Lesson 1.2"}]}]`;
        const jsonString = await callGeminiAPI(prompt);
        const cleanedJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        const generatedIndex = JSON.parse(cleanedJson);
        res.json({ index: generatedIndex });
    } catch (err) {
        console.error("Error parsing AI response for index:", err);
        res.status(500).json({ error: 'Failed to generate a valid course index from AI.' });
    }
});

// @route   POST /courses/generate-lesson-content
router.post('/generate-lesson-content', async (req, res) => {
    try {
        const { lessonTitle, topic, format, language } = req.body;
        const prompt = `You are an expert instructor. For a course on "${topic}", write the theory content for the lesson titled "${lessonTitle}". The content should be a detailed explanation of at least 300 words, written in ${language}. Make it engaging and easy to understand.`;
        const content = await callGeminiAPI(prompt);
        let videoUrl = null;
        let imageUrl = null;
        if (format === 'Video and Theory') {
            videoUrl = `https://placehold.co/600x400/007bff/FFFFFF?text=Video+for+${lessonTitle.replace(/\s/g, '+')}`;
        } else if (format === 'Image and Theory') {
            imageUrl = `https://placehold.co/600x400/28a745/FFFFFF?text=Image+for+${lessonTitle.replace(/\s/g, '+')}`;
        }
        res.json({ content, videoUrl, imageUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /courses/save
router.post('/save', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        const savedCourse = await newCourse.save();
        res.status(201).json({ msg: 'Course saved successfully!', courseId: savedCourse._id });
    } catch (err) {
        console.error("Error saving course:", err);
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
