const Coupon = require('../models/Coupon');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllCoupons = catchAsync(async (req, res, next) => {
  const coupons = await Coupon.find();

  res.status(200).json({
    status: 'success',
    results: coupons.length,
    data: {
      coupons
    }
  });
});

exports.createCoupon = catchAsync(async (req, res, next) => {
  const newCoupon = await Coupon.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      coupon: newCoupon
    }
  });
});

exports.validateCoupon = catchAsync(async (req, res, next) => {
  const { code, orderAmount } = req.body;

  if (!code) {
    return next(new AppError('Please provide a coupon code', 400));
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon || !coupon.isValid) {
    return next(new AppError('Coupon is invalid or has expired', 400));
  }

  if (orderAmount < coupon.minimumOrder) {
    return next(new AppError(`Minimum order amount of $${coupon.minimumOrder} required for this coupon`, 400));
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (orderAmount * coupon.discountValue) / 100;
  } else if (coupon.discountType === 'flat') {
    discountAmount = coupon.discountValue;
  }

  res.status(200).json({
    status: 'success',
    data: {
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      },
      discountAmount
    }
  });
});

exports.deleteCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);

  if (!coupon) {
    return next(new AppError('No coupon found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
