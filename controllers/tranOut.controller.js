const Transaction = require('../models/tranOut.model');
const CustomError = require('../utils/CustomError');
const mongoose = require('mongoose');
const Anbar = require('../models/anbar.model');

// #info => Get all the outer transaction
// @des  => GET method + private Access
const getAllTransactions = async (req, res, next) => {
  try {
    const outputes = await Transaction.find().sort({ date: -1 });
    const allMonth = outputes.map((item) => {
      return item.date.split('-')[1] + '-' + item.date.split('-')[0];
    });
    const uniqueMonth = [...new Set(allMonth)];
    for (let i = 0; i < uniqueMonth.length; i++) {
      const year = uniqueMonth[i].split('-')[1];
      const month = uniqueMonth[i].split('-')[0];
      let entry = 0;
      outputes.map((item) => {
        let exp = item.date.split('-')[1] + '-' + item.date.split('-')[0];
        if (exp === uniqueMonth[i]) {
          entry += 1;
        }
      });
      uniqueMonth[i] = { year, month, number: entry };
    }

    res.status(200).json(uniqueMonth);
  } catch (error) {
    next(error);
  }
};

// #info => Get all the transactions data in a specific month
// @des  => GET method + private Access
const getTransactionsByMonth = async (req, res, next) => {
  try {
    const { date } = req.params;
    const transactions = await Transaction.find().sort({ date: 1 });
    const monthlyData = transactions.filter((item) => {
      const x = item.date.split('-')[0] + '-' + item.date.split('-')[1];
      if (x === date) {
        return item;
      }
    });
    const allDays = monthlyData.map((item) => {
      return item.date;
    });

    const uniqueDays = [...new Set(allDays)];

    for (let i = 0; i < uniqueDays.length; i++) {
      let newdate = uniqueDays[i];
      let counter = 0;
      let status = true;
      monthlyData.map((item) => {
        if (item.date === uniqueDays[i]) {
          counter += 1;
          if (item.status !== 'تایید') {
            status = false;
          }
        }
      });
      uniqueDays[i] = { date: newdate, counter, status };
    }
    res.status(200).json(uniqueDays);
  } catch (error) {
    next(error);
  }
};

// #info => Get transactions by date
// @des  => GET method + private Access
const getTransactionsByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    if (!date) {
      throw new CustomError(`No date, please provide a valid date`, 400);
    }
    const transaction = await Transaction.find({ date });
    if (!transaction) {
      throw new CustomError(`No worker with Date: ${date}`, 404);
    }
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

// #info => Create an outer transaction
// @des  => POST method + private Access
const createTransaction = async (req, res, next) => {
  try {
    const { name, type, outer, reason, productId } = req.body;
    if (req.body.name) {
      req.body.name = req.body.name.trim();
    }
    if (req.body.type) {
      req.body.type = req.body.type.trim();
    }

    if (req.body.outer) {
      req.body.outer = req.body.outer.trim();
    }
    if (req.body.reason) {
      req.body.reason = req.body.reason.trim();
    }
    const anbar = await Anbar.findById(productId);
    if (!anbar) {
      throw new CustomError(
        'Product is not existed in anbar, please add it',
        404
      );
    }
    const x = anbar.amount - req.body.amount;
    if (x < 0) {
      throw new CustomError('Product amount insuffucient in anbar', 404);
    }
    const out = await Transaction.create(req.body);
    anbar.amount = x;
    await anbar.save();
    res.status(200).json(out);
  } catch (error) {
    next(error);
  }
};

// #info => Update  the outer Transaction
// @des  => PATCH method + private Access + admingOnly
const updateTransaction = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (req.body.name) {
      req.body.name = req.body.name.trim();
    }
    if (req.body.type) {
      req.body.type = req.body.type.trim();
    }
    if (req.body.reason) {
      req.body.reason = req.body.reason.trim();
    }
    if (req.body.outer) {
      req.body.outer = req.body.outer.trim();
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }

    const out = await Transaction.findById(req.params.id);
    if (!out) {
      throw new CustomError(`No Transaction with ID: ${req.params.id}`, 404);
    }
    const anbar = await Anbar.findById(out.productId);
    if (!anbar) {
      throw new CustomError('No product is found, please add it first', 404);
    }
    let finalAmount = anbar.amount;
    if (amount !== out.amount) {
      if (amount > out.amount) {
        finalAmount -= amount - out.amount;
      } else {
        finalAmount += out.amount - amount;
      }
    }

    const updatedOter = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    anbar.amount = parseInt(finalAmount);
    await anbar.save();
    res.status(200).json(updatedOter);
  } catch (error) {
    next(error);
  }
};

// #info => Delete  the outer transaction
// @des  => Delete method + private Access + admingOnly
const deleteTransaction = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const outer = await Transaction.findById(req.params.id);
    if (!outer) {
      throw new CustomError(`No Transaction with ID: ${req.params.id}`, 404);
    }
    const product = await Anbar.findById(outer.productId);
    if (!product) {
      throw new CustomError(`این محصول در انبار موجود نیست`, 404);
    }
    product.amount += outer.amount;
    await outer.remove();
    await product.save();
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
// #info => Get  the outer transaction
// @des  => Get method + private Access + admingOnly
const getTransactionById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const outer = await Transaction.findById(req.params.id);
    if (!outer) {
      throw new CustomError(`No Transaction with ID: ${req.params.id}`, 404);
    }
    res.status(200).json(outer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactionsByMonth,
  getTransactionsByDate,
};
