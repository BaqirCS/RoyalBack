const mongoose = require('mongoose');
const tranInSchema = new mongoose.Schema(
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
    receiver: {
      type: String,
      required: [true, 'the receiver person is required'],
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: 'anbar',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('transactionIn', tranInSchema);
