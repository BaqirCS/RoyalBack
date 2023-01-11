const mongoose = require('mongoose');
const tranOutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name of product is required'],
    },
    type: {
      type: String,
      required: [true, 'type of product is required'],
    },
    amount: {
      type: Number,
      required: [true, 'amount of product is required'],
    },
    date: {
      type: String,
      required: [true, 'date of production is required'],
    },
    outer: {
      type: String,
      required: [true, 'the doer person is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason of Operation is required'],
    },
    status: {
      type: String,
      enum: ['تایید', 'نیاز به بررسی'],
      default: 'نیاز به بررسی',
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: 'anbar',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('transactionOut', tranOutSchema);
