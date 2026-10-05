const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * Generates human-readable, collision-resistant Order Number
 * Format: TE-YYYYMMDD-XXXX
 */
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `TE-${dateStr}-${randomSuffix}`;
};

/**
 * POST /api/public/orders/checkout
 * Atomic Checkout & Order Placement Engine:
 * - Completely ignores client prices/totals
 * - Queries DB for active sellingPrice and costPrice
 * - Atomically decrements stock to prevent race condition overselling
 * - Automatically rolls back prior decrements if subsequent items are out of stock
 */
const checkout = async (req, res, next) => {
  try {
    const { customer, items, paymentMethod = 'CASH_ON_DELIVERY', customerNotes } = req.body;

    // 1. Validate Customer Information
    if (!customer || !customer.fullName || !customer.phoneNumber || !customer.address) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Customer fullName, phoneNumber, and address are mandatory for checkout.',
          statusCode: 400,
        },
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Order items array cannot be empty.',
          statusCode: 400,
        },
      });
    }

    // 2. Fetch all products from DB including costPrice
    const productIds = items.map((item) => item.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds }, isActive: true })
      .select('+costPrice')
      .lean();

    const productMap = new Map();
    dbProducts.forEach((p) => productMap.set(p._id.toString(), p));

    // 3. Pre-validate stock availability
    for (const item of items) {
      const dbProduct = productMap.get(String(item.productId));
      if (!dbProduct) {
        return res.status(400).json({
          success: false,
          error: {
            message: `Product with ID ${item.productId} is invalid or inactive.`,
            statusCode: 400,
          },
        });
      }

      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          error: {
            message: `Invalid quantity for product ${dbProduct.title}. Must be >= 1.`,
            statusCode: 400,
          },
        });
      }

      if (dbProduct.stockQuantity < qty) {
        return res.status(409).json({
          success: false,
          error: {
            message: `Insufficient inventory for ${dbProduct.title}. Requested: ${qty}, In Stock: ${dbProduct.stockQuantity}.`,
            statusCode: 409,
          },
        });
      }
    }

    // 4. ATOMIC STOCK DECREMENT with Rollback Guard
    const decrementedItems = [];
    const verifiedOrderItems = [];
    let grossTotal = 0;
    let totalCostOfGoods = 0;

    for (const item of items) {
      const qty = parseInt(item.quantity, 10);
      const dbProduct = productMap.get(String(item.productId));

      // Atomic conditional decrement
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: dbProduct._id,
          stockQuantity: { $gte: qty },
          isActive: true,
        },
        {
          $inc: { stockQuantity: -qty },
        },
        { new: true }
      );

      // Race condition occurred: Someone purchased the remaining stock simultaneously
      if (!updatedProduct) {
        console.warn(`[CHECKOUT CONFLICT] Race condition detected on product: ${dbProduct.title}. Initiating rollback.`);
        // Rollback previous successful decrements
        for (const rolledItem of decrementedItems) {
          await Product.findByIdAndUpdate(rolledItem.productId, {
            $inc: { stockQuantity: rolledItem.quantity },
          });
        }

        return res.status(409).json({
          success: false,
          error: {
            message: `Item '${dbProduct.title}' went out of stock during checkout. Transaction cancelled safely without partial deduction.`,
            statusCode: 409,
          },
        });
      }

      decrementedItems.push({ productId: dbProduct._id, quantity: qty });

      // Server-side calculation of authoritative prices
      const unitSelling = dbProduct.discountedPrice || dbProduct.sellingPrice;
      const unitCost = dbProduct.costPrice;
      const subtotalSelling = unitSelling * qty;
      const subtotalCost = unitCost * qty;

      grossTotal += subtotalSelling;
      totalCostOfGoods += subtotalCost;

      verifiedOrderItems.push({
        product: dbProduct._id,
        sku: dbProduct.sku,
        title: dbProduct.title,
        quantity: qty,
        unitSellingPrice: unitSelling,
        unitCostPrice: unitCost,
        subtotalSellingPrice: subtotalSelling,
        subtotalCostPrice: subtotalCost,
      });
    }

    // 5. Add Standard Shipping or Service Charges
    const shippingFee = grossTotal > 50000 ? 0 : 500; // Free delivery for orders over 50,000 PKR
    const finalGrossTotal = grossTotal + shippingFee;
    const netProfit = finalGrossTotal - totalCostOfGoods - shippingFee;

    // 6. Create Order in Database
    const orderNumber = generateOrderNumber();
    const newOrder = await Order.create({
      orderNumber,
      customer: {
        fullName: customer.fullName.trim(),
        phoneNumber: customer.phoneNumber.trim(),
        email: customer.email ? customer.email.trim().toLowerCase() : undefined,
        address: customer.address.trim(),
        city: customer.city ? customer.city.trim() : 'Lahore',
        siteType: customer.siteType || 'Commercial',
      },
      items: verifiedOrderItems,
      laborAndInstallationFee: 0,
      shippingFee,
      grossTotal: finalGrossTotal,
      totalCostOfGoods,
      netProfit,
      status: 'Pending',
      paymentMethod,
      paymentStatus: 'Pending',
      customerNotes: customerNotes ? String(customerNotes).slice(0, 500) : '',
    });

    // 7. Return Sanitized Public Response (Never leak costPrice or netProfit)
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully. Our dispatch engineer will call you for verification.',
      data: {
        orderNumber: newOrder.orderNumber,
        status: newOrder.status,
        customer: {
          fullName: newOrder.customer.fullName,
          city: newOrder.customer.city,
        },
        items: newOrder.items.map((i) => ({
          sku: i.sku,
          title: i.title,
          quantity: i.quantity,
          unitSellingPrice: i.unitSellingPrice,
          subtotalSellingPrice: i.subtotalSellingPrice,
        })),
        shippingFee: newOrder.shippingFee,
        grossTotal: newOrder.grossTotal,
        paymentMethod: newOrder.paymentMethod,
        createdAt: newOrder.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/public/orders/track/:orderNumber
 * Public order tracking with anti-IDOR verification via phone query
 */
const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const { phone } = req.query;

    if (!orderNumber || !phone) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Both Order Number and Customer Phone Number are required for verification.',
          statusCode: 400,
        },
      });
    }

    const order = await Order.findOne({
      orderNumber: orderNumber.trim().toUpperCase(),
      'customer.phoneNumber': String(phone).trim(),
    })
      .select('-totalCostOfGoods -netProfit -items.unitCostPrice -items.subtotalCostPrice')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'No matching order found for the provided details.',
          statusCode: 404,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/orders
 * Operations list for Admin & CEO
 */
const getAdminOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { orderNumber: new RegExp(String(search), 'i') },
        { 'customer.fullName': new RegExp(String(search), 'i') },
        { 'customer.phoneNumber': new RegExp(String(search), 'i') },
      ];
    }

    const isCEO = req.user && req.user.role === 'CEO';
    const query = Order.find(filter).sort({ createdAt: -1 });

    if (isCEO) {
      query.select('+totalCostOfGoods +netProfit');
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(50, parseInt(limit, 10));
    const pageSize = Math.min(50, parseInt(limit, 10));

    const [orders, total] = await Promise.all([
      query.skip(skip).limit(pageSize).lean(),
      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page, 10),
          pages: Math.ceil(total / pageSize),
          limit: pageSize,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/orders/:id/status
 * Update order lifecycle status
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const allowedStatuses = ['Pending', 'Survey_Scheduled', 'Quoted', 'Installed', 'Cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
          statusCode: 400,
        },
      });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Order not found.',
          statusCode: 404,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order ${order.orderNumber} status updated to ${order.status}.`,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/orders/:id/dispatch
 * Assign technician to order (Admin / CEO)
 */
const dispatchTechnician = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { technicianName, technicianPhone, scheduledDate, notes } = req.body;

    if (!technicianName || !technicianPhone) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Technician name and phone number are required.',
          statusCode: 400,
        },
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'Survey_Scheduled',
          assignedTechnician: {
            name: technicianName.trim(),
            phone: technicianPhone.trim(),
            scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
            notes: notes ? notes.trim() : '',
          },
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Order not found.',
          statusCode: 404,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Technician ${technicianName} dispatched successfully for order ${order.orderNumber}.`,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkout,
  trackOrder,
  getAdminOrders,
  updateOrderStatus,
  dispatchTechnician,
};
