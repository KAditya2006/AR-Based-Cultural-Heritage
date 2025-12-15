const mongoose = require('mongoose');


const quizSchema = new mongoose.Schema({
userId: mongoose.Schema.Types.ObjectId,
score: Number,
date: { type: Date, default: Date.now }
});


module.exports = mongoose.model('QuizResult', quizSchema);