const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be a whole integer',
      },
    },
    unitSellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    unitCostPrice: {
      type: Number,
      required: true,
      min: 0,
      select: false, // SECURITY: Hidden from general queries
    },
    subtotalSellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotalCostPrice: {
      type: Number,
      required: true,
      min: 0,
      select: false, // SECURITY: Hidden from general queries
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      fullName: {
        type: String,
        required: [true, 'Customer full name is required'],
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: [true, 'Contact phone number is required'],
        trim: true,
        match: [/^((\+92)|(0092)|(92)|(0))3\d{9}$/, 'Invalid Pakistani mobile number format'],
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      address: {
        type: String,
        required: [true, 'Site or installation address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: true,
        default: 'Lahore',
      },
      siteType: {
        type: String,
        enum: ['Residential', 'Commercial', 'Corporate_B2B', 'Industrial', 'Government_Education'],
        default: 'Commercial',
      },
    },
    items: [OrderItemSchema],
    laborAndInstallationFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    grossTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    totalCostOfGoods: {
      type: Number,
      required: true,
      min: 0,
      select: false, // SECURITY: Protected for CEO eyes only
    },
    netProfit: {
      type: Number,
      required: true,
      select: false, // SECURITY: Protected for CEO eyes only
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['Pending', 'Survey_Scheduled', 'Quoted', 'Installed', 'Cancelled'],
        message: '{VALUE} is not a valid order status',
      },
      default: 'Pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['CASH_ON_DELIVERY', 'MANUAL_BANK_TRANSFER', 'ON_SITE_COLLECTION'],
      default: 'CASH_ON_DELIVERY',
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Verified', 'Failed', 'Refunded'],
      default: 'Pending',
      index: true,
    },
    assignedTechnician: {
      technicianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      name: String,
      phone: String,
      scheduledDate: Date,
      notes: String,
    },
    customerNotes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ 'customer.phoneNumber': 1 });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

module.exports = Order;
