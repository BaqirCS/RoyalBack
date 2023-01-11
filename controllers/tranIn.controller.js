const Transaction = require('../models/tranIn.model');
const CustomError = require('../utils/CustomError');
const mongoose = require('mongoose');
const Anbar = require('../models/anbar.model');

// #info => Get all the input transaction
// @des  => GET method + private Access
const getAllTransactions = async (req, res, next) => {
  try {
    const inputs = await Transaction.find().sort({ date: -1 });
    const allMonth = inputs.map((item) => {
      return item.date.split('-')[1] + '-' + item.date.split('-')[0];
    });
    const uniqueMonth = [...new Set(allMonth)];
    for (let i = 0; i < uniqueMonth.length; i++) {
      const year = uniqueMonth[i].split('-')[0];
      const month = uniqueMonth[i].split('-')[1];
      let entry = 0;
      inputs.map((item) => {
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

// #info => Get all the unique inputs by month
// @des  => GET method + private Access
const getTransactionsByMonth = async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = await Transaction.find().sort({ date: 1 });
    const monthlyData = products.filter((item) => {
      const x = item.date.split('-')[1] + '-' + item.date.split('-')[0];
      if (x === id) {
        return item;
      }
    });
    res.status(200).json(monthlyData);
  } catch (error) {
    next(error);
  }
};

// #info => Create an input transaction
// @des  => POST method + private Access
const createTransaction = async (req, res, next) => {
  try {
    const { productId, amount } = req.body;
    if (req.body.name) {
      req.body.name = req.body.name.trim();
    }
    if (req.body.type) {
      req.body.type = req.body.type.trim();
    }
    if (req.body.receiver) {
      req.body.receiver = req.body.receiver.trim();
    }
    if (req.body.date) {
      req.body.date = req.body.date.trim();
    }
    const anbar = await Anbar.findById(productId);
    if (!anbar) {
      throw new CustomError(
        'Product is not existed in anbar, please add it first',
        404
      );
    }
    const x = anbar.amount + parseInt(amount);

    const input = await Transaction.create(req.body);
    anbar.amount = x;
    await anbar.save();
    res.status(200).json(input);
  } catch (error) {
    next(error);
  }
};

// #info => Update  the iner Transaction
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

    if (req.body.receiver) {
      req.body.receiver = req.body.receiver.trim();
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }

    const input = await Transaction.findById(req.params.id);
    if (!input) {
      throw new CustomError(`No Transaction with ID: ${req.params.id}`, 404);
    }
    const anbar = await Anbar.findById(input.productId);
    if (!anbar) {
      throw new CustomError('No product is found, please add it first', 404);
    }
    let finalAmount = anbar.amount;
    if (amount !== input.amount) {
      if (amount > input.amount) {
        finalAmount += amount - input.amount;
      } else {
        finalAmount -= input.amount - amount;
      }
    }
    const updatedInput = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    anbar.amount = parseInt(finalAmount);
    await anbar.save();
    res.status(200).json(updatedInput);
  } catch (error) {
    next(error);
  }
};

// #info => Delete  the Iner transaction
// @des  => Delete method + private Access + admingOnly
const deleteTransaction = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const input = await Transaction.findById(req.params.id);
    if (!input) {
      throw new CustomError(`No Transaction with ID: ${req.params.id}`, 404);
    }
    const product = await Anbar.findById(input.productId);
    if (!product) {
      throw new CustomError(`این محصول در انبار موجود نیست`, 404);
    }
    const finalAmount = product.amount - input.amount;
    product.amount = finalAmount;
    await input.remove();
    await product.save();
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
// #info => Get  the Iner transaction
// @des  => Get method + private Access + admingOnly
const getTransactionById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const input = await Transaction.findById(req.params.id);
    if (!input) {
      throw new CustomError(`No Transaction with ID: ${req.params.id}`, 404);
    }

    res.status(200).json(input);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByMonth,
  getTransactionById,
};
