const router = require('express').Router();
const { Authenticated, isAdmin } = require('../middlewares/auth');
const {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactionsByMonth,
  getTransactionsByDate,
} = require('../controllers/tranOut.controller');

router
  .route('/')
  .get(Authenticated, getAllTransactions)
  .post(Authenticated, createTransaction);
router.route('/month/:date').get(Authenticated, getTransactionsByMonth);
router.route('/day/:date').get(Authenticated, getTransactionsByDate);

router
  .route('/:id')
  .patch(Authenticated, isAdmin, updateTransaction)
  .delete(Authenticated, isAdmin, deleteTransaction)
  .get(Authenticated, getTransactionById);
module.exports = router;
