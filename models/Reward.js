const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pointsRequired: {
    type: Number,
    required: true,
  },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
