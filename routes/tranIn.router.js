const router = require('express').Router();
const { Authenticated, isAdmin } = require('../middlewares/auth');
const {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByMonth,
  getTransactionById,
} = require('../controllers/tranIn.controller');

router
  .route('/')
  .get(Authenticated, getAllTransactions)
  .post(Authenticated, createTransaction);
router.route('/month/:id').get(Authenticated, getTransactionsByMonth);
router
  .route('/:id')
  .patch(Authenticated, isAdmin, updateTransaction)
  .delete(Authenticated, isAdmin, deleteTransaction)
  .get(Authenticated, getTransactionById);
module.exports = router;
