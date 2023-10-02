// Middleware function to validate request body length
const validateBodyLength = (req, res, next) => {
  const maxLength = 300; // Maximum allowed length

  if (req.body.description && req.body.description.length > maxLength) {
    return res.status(400).json({
      message: `Description should not exceed ${maxLength} characters`,
    });
  }

  // If everything is fine, proceed to the next middleware or route handler
  next();
};
