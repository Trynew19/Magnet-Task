const User = require('../models/User');
const jwt = require('jsonwebtoken');
const catchAsync = require('../error/catchAsync');
const AppError = require('../error/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Exports ko aise likho
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Please provide all fields', 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('User already exists.', 400));
  }

  const newUser = await User.create({ name, email, password });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: { user: { id: newUser._id, name: newUser.name, email: newUser.email } }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Provide email and password', 400));

  const user = await User.findOne({ email }).select('+password');
  
  // Iske liye User Model mein correctPassword method add karna zaroori hai (pichle message wala)
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id);
  res.status(200).json({ status: 'success', token });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ status: 'success', data: user });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('name _id');
  res.status(200).json({ status: 'success', data: users });
});