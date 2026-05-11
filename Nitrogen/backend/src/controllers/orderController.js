const Order = require('../models/Order');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createOrder = catchAsync(async (req, res, next) => {
  const {
    products,
    shippingAddress,
    billingAddress,
    paymentMethod,
    shippingFee,
    taxPrice,
    discountAmount
  } = req.body;

  if (products && products.length === 0) {
    return next(new AppError('No order items found', 400));
  }

  // Calculate total price based on products
  let itemsPrice = 0;
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new AppError(`Product not found: ${item.product}`, 404));
    }
    itemsPrice += product.price * item.quantity;
  }

  const totalPrice = itemsPrice + shippingFee + taxPrice - discountAmount;

  const order = new Order({
    user: req.user._id,
    products,
    shippingAddress,
    billingAddress,
    paymentMethod,
    shippingFee,
    taxPrice,
    discountAmount,
    totalPrice
  });

  const createdOrder = await order.save();

  res.status(201).json({
    status: 'success',
    data: {
      order: createdOrder
    }
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  ).populate('products.product');

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Ensure user only sees their own orders, unless admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view this order', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate('user', 'id name').sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  order.orderStatus = req.body.status;
  
  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
    order.paymentStatus = 'Completed';
  }

  await order.save();

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});
