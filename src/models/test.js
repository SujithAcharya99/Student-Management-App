const mongoose = require('mongoose');
const validator = require('validator')

// const Test = mongoose.model('Test', {
const testSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    teacherName: {
        type: String,
        required: true,
        trim: true
    },score: {
        type: Number,
        required: true,
        default: 00
    },
    questions: [{
        mcq_question: {
            type: String,
            required: true
        },
        options: {
            type: String,
            required: true
        }
    }],
    answer: {
        type: String,
        required: true
    }
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;