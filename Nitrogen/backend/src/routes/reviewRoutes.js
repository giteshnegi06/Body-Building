const express = require('express');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true }); // Allow nested route from product

router.route('/')
  .get(reviewController.getAllReviews)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('user'),
    reviewController.setProductUserIds,
    reviewController.createReview
  );

router.route('/:id')
  .delete(
    authMiddleware.protect,
    reviewController.deleteReview
  );

module.exports = router;
