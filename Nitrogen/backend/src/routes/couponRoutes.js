const express = require('express');
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/validate', couponController.validateCoupon);

// Restrict all below to admin
router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'));

router.route('/')
  .get(couponController.getAllCoupons)
  .post(couponController.createCoupon);

router.route('/:id')
  .delete(couponController.deleteCoupon);

module.exports = router;
