const sanitizeError = (err) => {
  // Invalid ObjectId format (e.g. GET /api/batches/not-a-real-id)
  if (err.name === 'CastError') {
    return { statusCode: 400, message: 'Invalid ID format' };
  }

  // Mongo duplicate key (e.g. unique email) — name the field, not the
  // internal index/collection details in the raw driver message.
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return { statusCode: 400, message: `${field} already in use` };
  }

  // Raw Mongoose schema validation (distinct from Joi's validate.middleware,
  // which already handles most input validation before this is reached).
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors || {})
      .map((e) => e.message)
      .join(', ') || 'Validation failed';
    return { statusCode: 400, message };
  }

  return null;
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

   const known = sanitizeError(err);
  if (known) {
    return res.status(known.statusCode).json({
      success: false,
      data: null,
      message: known.message,
    });
  }

  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';
  const message =
    statusCode >= 500 && isProd
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    data: null,
    message,
  });
};


module.exports = errorHandler;