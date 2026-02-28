const rateLimit = require('express-rate-limit');

// General API limiter to prevent abuse
const globalRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 600, // max requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for public POST endpoints (forms)
const publicPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { message: 'Too many submissions. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth-specific limiter to slow brute force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  globalRateLimiter,
  publicPostLimiter,
  authLimiter,
};
