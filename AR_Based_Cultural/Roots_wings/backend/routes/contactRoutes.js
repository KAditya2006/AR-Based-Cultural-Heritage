const router = require('express').Router();
const { sendMessage } = require('../controllers/contactController');


router.post('/send', sendMessage);
module.exports = router;