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

const getContactMessages = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load messages' });
  }
};

const deleteContactMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    return res.json({ message: 'Message deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete message' });
  }
};

const deleteAllContactMessages = async (req, res) => {
  try {
    await ContactMessage.deleteMany({});
    return res.json({ message: 'All messages deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete messages' });
  }
};

module.exports = { createContactMessage, getContactMessages, deleteContactMessage, deleteAllContactMessages };
