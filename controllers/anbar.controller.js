const Anbar = require('../models/anbar.model');
const CustomError = require('../utils/CustomError');
const mongoose = require('mongoose');

// #info => Get all the products in anbar
// @des  => GET method + private Access
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Anbar.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// #info => Get Single product in anbar
// @des  => GET method + private Access
const getSingleProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }

    const product = await Anbar.findById(req.params.id);
    if (!product) {
      throw new CustomError(`No Product with ID: ${req.params.id}`, 404);
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// #info => Create product to add to anbar
// @des  => POST method + private Access
const createProduct = async (req, res, next) => {
  try {
    req.body.name = req.body.name.trim();
    req.body.type = req.body.type.trim();
    req.body.category = req.body.category.trim();
    const exist = await Anbar.findOne({ name: req.body.name });
    if (exist) {
      throw new CustomError(
        'این محصول با این نام در سیتسم موجود است, لطفا اسم جدیدی انتخاب کنید',
        400
      );
    }
    const product = await Anbar.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// #info => Update  the product
// @des  => PATCH method + private Access + admingOnly
const updateProduct = async (req, res, next) => {
  try {
    if (req.body.name) {
      req.body.name = req.body.name.trim();
    }
    if (req.body.type) {
      req.body.type = req.body.type.trim();
    }
    if (req.body.category) {
      req.body.category = req.body.category.trim();
    }
    if (req.body.description) {
      req.body.description = req.body.description.trim();
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }

    const product = await Anbar.findById(req.params.id);
    if (!product) {
      throw new CustomError(`No Product with ID: ${req.params.id}`, 404);
    }

    if (product.name !== req.body.name) {
      const exist = await Anbar.findOne({ name: req.body.name });
      if (exist) {
        throw new CustomError(
          'این محصول با این نام در سیتسم موجود است, لطفا اسم دیگری انتخاب کنید',
          400
        );
      }
    }

    const updatedProduct = await Anbar.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// #info => Delete  the product
// @des  => Delete method + private Access + admingOnly
const deleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const product = await Anbar.findById(req.params.id);
    if (!product) {
      throw new CustomError(`No Product with ID: ${req.params.id}`, 404);
    }

    await product.remove();
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
};
