const CustomError = require('../utils/CustomError');

const checkPermission = (user, id) => {
  if (user.status == 'admin') return;
  if (user.status == 'owner') return;
  else if (user.userId == id) return;
  else
    throw new CustomError(
      'you do not have the permission to do this operation',
      403
    );
};
const checkIsAdmin = (user) => {
  if (user.status == 'admin') return;
  if (user.status == 'owner') return;
  else {
    throw new CustomError(
      'you do not have the permission to do this operation',
      403
    );
  }
};
module.exports = { checkPermission, checkIsAdmin };
