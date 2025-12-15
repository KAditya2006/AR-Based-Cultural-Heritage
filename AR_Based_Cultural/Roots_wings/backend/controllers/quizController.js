const Quiz = require('../models/QuizResult');


exports.submitQuiz = async (req, res) => {
const quiz = await Quiz.create({
userId: req.user.id,
score: req.body.score
});
res.json(quiz);
};