const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const Reward = require('../models/Reward');





const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  
  const isFirstUser = (await User.countDocuments()) === 0;

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isAdmin: isFirstUser, 
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});



const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});


const buyItem = asyncHandler(async (req, res) => {
  const { amount, description } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Amount must be positive');
  }

  const pointsEarned = amount * 10; // Example: 10 points per $1

  const user = await User.findById(req.user._id);
  user.points += pointsEarned;
  user.transactions.push({
    type: 'earn',
    amount: pointsEarned,
    description: description || `Earned from buying`,
  });

  await user.save();

  res.json({ message: `You earned ${pointsEarned} points`, currentPoints: user.points });
});



const redeemReward = asyncHandler(async (req, res) => {
  const { rewardId } = req.body;

  const reward = await Reward.findById(rewardId);
  if (!reward) {
    res.status(404);
    throw new Error('Reward not found');
  }

  const user = await User.findById(req.user._id);

  if (user.points < reward.pointsRequired) {
    res.status(400);
    throw new Error('Not enough points to redeem');
  }

  user.points -= reward.pointsRequired;
  user.transactions.push({
    type: 'redeem',
    amount: reward.pointsRequired,
    description: `Redeemed reward: ${reward.name}`,
  });

  await user.save();

  res.json({ message: `You redeemed ${reward.name}`, currentPoints: user.points });
});


const getUserTransactions = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user.transactions);
});



module.exports = { 
  registerUser,
  loginUser, 
  buyItem, 
  redeemReward,
  getUserTransactions };
