const { errorResponse } = require('../utils/responseHelper');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    errorResponse(res, 'Not authorized as an admin', 403);
  }
};

module.exports = { adminOnly };
