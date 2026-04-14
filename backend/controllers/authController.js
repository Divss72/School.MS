const asyncWrapper = require('../utils/asyncWrapper');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!user || !isMatch) {
    return errorResponse(res, 'Invalid credentials', 401);
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return successResponse(res, {
    _id: user._id,
    email: user.email,
    role: user.role,
  }, 'Logged in successfully');
});

const logout = asyncWrapper(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  return successResponse(res, {}, 'Logged out successfully');
});

const getMe = asyncWrapper(async (req, res) => {
  return successResponse(res, {
    _id: req.user._id,
    email: req.user.email,
    role: req.user.role,
  });
});

module.exports = { login, logout, getMe };
