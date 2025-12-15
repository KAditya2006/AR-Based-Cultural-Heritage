const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { submitQuiz } = require('../controllers/quizController');


router.post('/submit', auth, submitQuiz);
module.exports = router;