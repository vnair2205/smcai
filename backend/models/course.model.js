const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String }, // Will hold text content
    videoUrl: { type: String }, // URL for the generated video
    imageUrl: { type: String }  // URL for the generated image
}, { _id: false });

const subTopicSchema = new Schema({
    title: { type: String, required: true },
    lessons: [lessonSchema]
}, { _id: false });

const courseSchema = new Schema({
    topic: { type: String, required: true, trim: true },
    objective: { type: String, required: true },
    outcome: { type: String, required: true },
    subTopicCount: { type: Number, required: true, enum: [5, 10, 15] },
    format: { type: String, required: true, enum: ['Video and Theory', 'Image and Theory'] },
    language: { type: String, required: true },
    index: [subTopicSchema]
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
