const router = require('express').Router();
const { Authenticated, isAdmin } = require('../middlewares/auth');

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  logout,
  getCurrentUser,
} = require('../controllers/user.controller');

router.route('/login').post(login);

router.route('/').get(Authenticated, isAdmin, getAllUsers).post(createUser);
router.route('/currentUser').get(Authenticated, getCurrentUser);
router.route('/logout').get(logout);

router
  .route('/:id')
  .get(Authenticated, isAdmin, getUserById)
  .delete(Authenticated, isAdmin, deleteUser)
  .patch(Authenticated, updateUser);

module.exports = router;
