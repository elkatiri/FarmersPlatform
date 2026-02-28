const { validationResult } = require('express-validator');
const ContactMessage = require('../models/ContactMessage');

const createContactMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await ContactMessage.create(req.body);
    return res.status(201).json({ message: 'Message sent', contact });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to send message' });
  }
};

module.exports = { createContactMessage };
