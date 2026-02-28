// Centralized error handler to keep responses consistent
module.exports = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Avoid leaking stack traces in production
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    message,
    ...(err.errors ? { errors: err.errors } : {}),
  });
};
