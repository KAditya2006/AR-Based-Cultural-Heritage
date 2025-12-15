const Contact = require('../models/Contact');


exports.sendMessage = async (req, res) => {
const msg = await Contact.create(req.body);
res.json({ success: true, msg });
};