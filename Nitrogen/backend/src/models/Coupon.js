const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide a coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'flat'],
    required: true
  },
  discountValue: {
    type: Number,
    required: [true, 'Please provide discount value']
  },
  minimumOrder: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please provide expiry date']
  },
  usageLimit: {
    type: Number,
    default: 100
  },
  usedCount: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual property to check if coupon is valid based on expiry date
couponSchema.virtual('isValid').get(function() {
  return this.active && this.expiryDate > Date.now() && this.usedCount < this.usageLimit;
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
