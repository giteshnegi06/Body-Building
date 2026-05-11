const Razorpay = require('razorpay');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createRazorpayOrder = catchAsync(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) {
    return next(new AppError('Amount is required', 400));
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  if (!order) {
    return next(new AppError('Error creating Razorpay order', 500));
  }

  res.status(200).json({
    status: 'success',
    data: {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    },
  });
});
