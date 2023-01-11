const User = require('../models/user.model');
const CustomError = require('../utils/CustomError');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { GenerateJWT } = require('../middlewares/auth');
const {
  checkPermission,
  checkIsAdmin,
} = require('../middlewares/checkPermission');

//Create user => POST Met => PUBLIC Acc
const createUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      throw new CustomError(
        'ادرس ایمل در سیستم ثبت شده است, ایمیل دیگری وارد کنید',
        400
      );
    }
    const ex = await User.find();
    if (ex.length === 0) {
      req.body.status = 'owner';
    } else {
      req.body.status = 'pending';
    }
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

//Get single user => Get Met => Private Acc + ADMIN Only
const getUserById = async (req, res, next) => {
  try {
    checkPermission(req.user, req.params.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      throw new CustomError(`No user with ID: ${req.params.id}`, 404);
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//Get ALl users => GET Met => Private Acc + ADMIN Only
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

//Update single user => PATCH Met => Private Acc + ADMIN Only
const updateUser = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }

    console.log(req.user);
    checkPermission(req.user, req.params.id);
    console.log('hi');
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new CustomError(`No user with ID :${req.params.id}`, 404);
    }
    const { email, name, password, status } = req.body;
    if (email) {
      user.email = email;
    }
    if (name) {
      user.name = name;
    }
    if (password) {
      user.password = password;
    }
    if (status) {
      if (status !== user.status) {
        checkIsAdmin(req.user);
        user.status = status;
      }
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//Delete single user => DELETE Met => Private Acc + ADMIN Only
const deleteUser = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new CustomError(`No user with ID :${req.params.id}`, 404);
    }
    await user.remove();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

//Login  user => POST Met => PUBLIC
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      throw new CustomError('Email is Required', 400);
    }
    if (!password) {
      throw new CustomError('Password is Required', 400);
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError('این ایمیل در سیستم موجود نمی باشد', 404);
    }
    const match = await user.isPasswordEqual(password);
    if (!match) {
      throw new CustomError('رمز اشتباه است  ', 401);
    }
    if (user.status === 'pending') {
      throw new CustomError(
        'حالت حساب شما معلق است, لطفا با مدیر سیستم به تماس شوید',
        401
      );
    }

    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
    };
    const token = await GenerateJWT(payload);

    res.status(200).json({
      user: payload,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

//Logout  user => GET Met => Private Acc
const logout = async (req, res, next) => {
  try {
    await jwt.sign(req.user, process.env.JWT_SECRETE, {
      expiresIn: '1',
    });
    req.user = {};
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

//Get Current user=> GET Met=> private Acc
const getCurrentUser = async (req, res, next) => {
  console.log(req.user);
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  logout,
  getCurrentUser,
};
