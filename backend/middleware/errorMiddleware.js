export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const isDatabaseConfigError = error.message?.includes('client password must be a string');

  if (process.env.NODE_ENV !== 'test') {
    console.error(error);
  }

  res.status(statusCode).json({
    message: isDatabaseConfigError
      ? 'Database connection is not configured. Set DATABASE_URL in backend/.env and restart the API.'
      : error.message || 'Internal server error'
  });
};
