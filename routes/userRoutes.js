const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  buyItem,
  redeemReward,
  getUserTransactions
} = require('../controllers/userController');
const { protect , adminOnly} = require('../middleware/authMiddleware');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/buy', protect, buyItem);
router.post('/redeem', protect, redeemReward);
router.get('/transactions', protect, adminOnly, getUserTransactions);


module.exports = router;
