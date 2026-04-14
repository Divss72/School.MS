const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/responseHelper');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return errorResponse(res, 'Not authorized, no token', 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return errorResponse(res, 'Not authorized, user not found', 401);
    }
    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized, token failed', 401);
  }
};

module.exports = { protect };
