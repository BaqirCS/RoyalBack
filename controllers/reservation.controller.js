const Reserve = require('../models/reservation.model');
const CustomError = require('../utils/CustomError');
const mongoose = require('mongoose');

// #info => Get all the reservation dates
// @des  => GET method + private Access
const getAllReserves = async (req, res, next) => {
  try {
    const reserves = await Reserve.find().sort({ date: -1 });
    const allMonth = reserves.map((item) => {
      return item.date.split('-')[1] + '-' + item.date.split('-')[0];
    });
    const uniqueMonth = [...new Set(allMonth)];

    for (let i = 0; i < uniqueMonth.length; i++) {
      const year = uniqueMonth[i].split('-')[0];
      const month = uniqueMonth[i].split('-')[1];
      let entry = 0;
      let guest = 0;
      reserves.map((item) => {
        let exp = item.date.split('-')[1] + '-' + item.date.split('-')[0];
        if (exp === uniqueMonth[i]) {
          entry += 1;
          guest += item.guestNum;
        }
      });
      uniqueMonth[i] = { year, month, allReserve: entry, guestNum: guest };
    }

    res.status(200).json(uniqueMonth);
  } catch (error) {
    next(error);
  }
};

// #info => Get reservation by id
// @des  => GET method + private Access
const getReservationByID = async (req, res, next) => {
  try {
    const { id } = req.query;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const reserve = await Reserve.findById(id);
    if (!reserve) {
      throw new CustomError(`No Reservation with ID: ${id}`, 404);
    }
    res.status(200).json(reserve);
  } catch (error) {
    next(error);
  }
};

// #info => Get all the unique reservation by month
// @des  => GET method + private Access
const getReservationsByMonth = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reserves = await Reserve.find().sort({ date: 1 });
    const monthlyData = reserves.filter((item) => {
      const x = item.date.split('-')[0] + '-' + item.date.split('-')[1];
      if (x === id) {
        return item;
      }
    });
    res.status(200).json(monthlyData);
  } catch (error) {
    next(error);
  }
};

// #info => Create Reservation
// @des  => POST method + private Access
const createReserve = async (req, res, next) => {
  try {
    const { requestName, date, time } = req.body;
    if (requestName) {
      req.body.requestName = requestName.trim();
    }
    if (date) {
      req.body.date = date.trim();
    }
    if (time) {
      req.body.time = time.trim();
    }
    const exist = await Reserve.findOne({ date });
    if (exist) {
      if (exist.time === req.body.time) {
        throw new CustomError('این تاریخ قبلا رزرو شده است', 400);
      }
    }
    const reserve = await Reserve.create(req.body);
    res.status(200).json(reserve);
  } catch (error) {
    next(error);
  }
};

// #info => Update  the reserve date
// @des  => PATCH method + private Access + admingOnly
const updateReserve = async (req, res, next) => {
  try {
    if (req.body.requestName) {
      req.body.requestName = req.body.requestName.trim();
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }

    const reserve = await Reserve.findById(req.params.id);
    if (!reserve) {
      throw new CustomError(`No Reservation with ID: ${req.params.id}`, 404);
    }
    if (reserve.date !== req.body.date) {
      const exist = await Reserve.findOne({ date: req.body.date });
      if (exist) {
        if (req.body.time.trim === reserve.time) {
          throw new CustomError('این تاریخ قبلا رزرو شده است', 400);
        }
      }
    }
    const updatedReserve = await Reserve.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updatedReserve);
  } catch (error) {
    next(error);
  }
};

// #info => Delete  the Reservation
// @des  => Delete method + private Access + admingOnly
const deleteReserve = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const reserve = await Reserve.findById(req.params.id);
    if (!reserve) {
      throw new CustomError(`No Reservation with ID: ${req.params.id}`, 404);
    }

    await reserve.remove();
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReserves,
  createReserve,
  updateReserve,
  deleteReserve,
  getReservationsByMonth,
  getReservationByID,
};
