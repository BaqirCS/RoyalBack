const router = require('express').Router();
const { Authenticated } = require('../middlewares/auth');
const {
  getAllReserves,
  createReserve,
  updateReserve,
  deleteReserve,
  getReservationsByMonth,
  getReservationByID,
} = require('../controllers/reservation.controller');

router
  .route('/')
  .get(Authenticated, getAllReserves)
  .post(Authenticated, createReserve);
router.route('/singlereserve').get(Authenticated, getReservationByID);
router
  .route('/:id')
  .patch(Authenticated, updateReserve)
  .delete(Authenticated, deleteReserve)
  .get(Authenticated, getReservationsByMonth);
module.exports = router;
