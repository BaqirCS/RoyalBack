const router = require('express').Router();
const { Authenticated, isAdmin } = require('../middlewares/auth');
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} = require('../controllers/anbar.controller');

router
  .route('/')
  .get(Authenticated, getAllProducts)
  .post(Authenticated, createProduct);
router
  .route('/:id')
  .get(Authenticated, getSingleProduct)
  .patch(Authenticated, isAdmin, updateProduct)
  .delete(Authenticated, isAdmin, deleteProduct);
module.exports = router;
