const mongoose = require('mongoose');
const reservationSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, 'Date of Party is required'],
    },
    requestName: {
      type: String,
      required: [true, 'Name of person who request the party is required'],
    },
    guestNum: {
      type: Number,
      required: [true, 'the number of guests is required'],
    },
    partyKind: {
      type: String,
      required: [true, 'Kind of party is required'],
    },
    time: {
      type: String,
      required: [true, 'Time of party is required'],
    },
    phoneNumber: {
      type: String,
    },

    status: {
      type: String,
      enum: ['نامشخص', 'رزرو'],
      default: 'رزرو',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('reservation', reservationSchema);
