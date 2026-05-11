const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.route('/')
  .post(orderController.createOrder)
  .get(
    authMiddleware.restrictTo('admin'),
    orderController.getAllOrders
  );

router.route('/myorders')
  .get(orderController.getMyOrders);

// Alias for frontend
router.route('/my-orders')
  .get(orderController.getMyOrders);

router.route('/:id')
  .get(orderController.getOrder);

router.route('/:id/status')
  .patch(
    authMiddleware.restrictTo('admin'),
    orderController.updateOrderStatus
  );

module.exports = router;
