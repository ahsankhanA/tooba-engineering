const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'CCTV_CAMERA',
        'DVR_NVR',
        'STORAGE_HDD',
        'NETWORKING_CABLE',
        'POWER_SUPPLY',
        'BIOMETRIC_ATTENDANCE',
        'COMPLETE_PACKAGE',
      ],
      index: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    specifications: {
      resolution: String, // e.g. "5MP ColorVu", "4K Ultra"
      channels: Number,   // e.g. 4, 8, 16, 32
      storageCapacity: String, // e.g. "2TB Surveillance Grade"
      cableLengthMeters: Number,
      indoorOutdoor: {
        type: String,
        enum: ['INDOOR', 'OUTDOOR', 'BOTH'],
      },
    },
    costPrice: {
      type: Number,
      required: [true, 'Wholesale cost price is mandatory for profit calculations'],
      min: [0, 'Cost price cannot be negative'],
      select: false, // SECURITY: Never returned by default to prevent leakage to public or frontend
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is mandatory'],
      min: [0, 'Selling price cannot be negative'],
    },
    discountedPrice: {
      type: Number,
      min: [0, 'Discounted price cannot be negative'],
      validate: {
        validator: function (val) {
          return !val || val <= this.sellingPrice;
        },
        message: 'Discounted price cannot be higher than regular selling price',
      },
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: [0, 'Stock quantity cannot be negative'],
      default: 0,
      index: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    warrantyMonths: {
      type: Number,
      default: 12,
      min: 0,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for high-speed catalog browsing and filtering
ProductSchema.index({ category: 1, isActive: 1, sellingPrice: 1 });
ProductSchema.index({ title: 'text', description: 'text', brand: 'text' });

/**
 * Atomic Inventory Decrement Helper:
 * Ensures stock decrement passes atomically only if stockQuantity >= requestedQty.
 * Returns null if inventory is insufficient (preventing race condition overselling).
 */
ProductSchema.statics.decrementStockAtomic = async function (productId, quantity) {
  return this.findOneAndUpdate(
    {
      _id: productId,
      stockQuantity: { $gte: quantity },
      isActive: true,
    },
    {
      $inc: { stockQuantity: -quantity },
    },
    { new: true }
  );
};

/**
 * Atomic Inventory Increment Helper (Restock or Order Cancellation Rollback)
 */
ProductSchema.statics.incrementStockAtomic = async function (productId, quantity) {
  return this.findByIdAndUpdate(
    productId,
    {
      $inc: { stockQuantity: quantity },
    },
    { new: true }
  );
};

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

module.exports = Product;
