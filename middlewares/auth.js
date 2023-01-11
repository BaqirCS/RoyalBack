const jwt = require('jsonwebtoken');
const CustomError = require('../utils/CustomError');

const GenerateJWT = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRETE, {
    expiresIn: '1d',
  });
  return token;
};

const Authenticated = (req, res, next) => {
  if (!req.headers) {
    return next(new CustomError('Bad Authorizatoin, please log in first', 401));
  }
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer')) {
    return next(new CustomError('Bad Authorizatoin, please log in first', 401));
  }
  const token = header.split(' ')[1];
  if (!token) {
    return next(new CustomError('Bad Authorizatoin, please log in first', 401));
  }
  try {
    const decode = jwt.decode(token);
    req.user = {
      userId: decode.userId,
      name: decode.name,
      email: decode.email,
      status: decode.status,
    };
    next();
  } catch (error) {
    return next(new CustomError('Bad Authorizatoin, please log in first', 401));
  }
};
const isAdmin = (req, res, next) => {
  if (req.user.status === 'owner') {
    return next();
  }
  if (req.user.status !== 'admin') {
    return next(
      new CustomError(
        'Authorization Error, you are not allowed to do admin operation'
      ),
      401
    );
  }
  next();
};

module.exports = { GenerateJWT, Authenticated, isAdmin };
