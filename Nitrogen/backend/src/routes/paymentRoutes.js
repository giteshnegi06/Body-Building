const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // Ensure user is logged in for payment generation

router.post('/razorpay/order', paymentController.createRazorpayOrder);

module.exports = router;
