const mongoose = require('mongoose');
const anbarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name of product is required'],
      unique: true,
    },
    type: {
      type: String,
      required: [true, 'type of product is required'],
    },
    amount: {
      type: Number,
      required: [true, 'amount of product is required'],
    },
    category: {
      type: String,
      required: [true, 'category of product is required'],
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('anbar', anbarSchema);
