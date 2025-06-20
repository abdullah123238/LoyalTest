const express = require('express');
const router = express.Router();

const { createReward,
        getAllUsers ,
        promoteUserToAdmin,
        getAllTransactions
      }
      = require('../controllers/adminController');
const { protect,
        adminOnly 
      } = require('../middleware/authMiddleware');



router.post('/rewards', protect, adminOnly, createReward);
router.get('/users', protect, adminOnly, getAllUsers);
router.patch('/users/:id/promote', protect, adminOnly, promoteUserToAdmin);
router.get('/transactions', protect, adminOnly, getAllTransactions);



module.exports = router;
