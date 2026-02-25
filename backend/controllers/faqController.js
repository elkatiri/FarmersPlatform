const { validationResult } = require('express-validator');
const FAQ = require('../models/FAQ');

const getFAQs = async (_req, res) => {
  const faqs = await FAQ.find().sort({ createdAt: -1 });
  return res.json(faqs);
};

const createFAQ = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const faq = await FAQ.create(req.body);
  return res.status(201).json(faq);
};

const updateFAQ = async (req, res) => {
  const { id } = req.params;
  const faq = await FAQ.findByIdAndUpdate(id, req.body, { new: true });
  if (!faq) {
    return res.status(404).json({ message: 'FAQ not found' });
  }
  return res.json(faq);
};

const deleteFAQ = async (req, res) => {
  const { id } = req.params;
  const deleted = await FAQ.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ message: 'FAQ not found' });
  }
  return res.json({ message: 'FAQ deleted' });
};

module.exports = {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
};
