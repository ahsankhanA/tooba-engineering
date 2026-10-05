const Product = require('../models/Product');

/**
 * GET /api/public/products
 * Public catalog: Strict projection excludes costPrice
 */
const getPublicProducts = async (req, res, next) => {
  try {
    const { category, brand, search, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (brand) {
      filter.brand = new RegExp(`^${brand}$`, 'i');
    }

    if (search) {
      filter.$text = { $search: String(search) };
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(50, parseInt(limit, 10));
    const pageSize = Math.min(50, parseInt(limit, 10));

    // Notice: costPrice is excluded automatically by schema { select: false }
    const [products, total] = await Promise.all([
      Product.find(filter)
        .select('-__v')
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        products,
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
 * GET /api/public/products/:slug
 * Retrieve specific product details
 */
const getPublicProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, isActive: true }).select('-__v').lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Product not found or currently unavailable.',
          statusCode: 404,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/inventory
 * Operations inventory view (accessible by ADMIN and CEO)
 */
const getAdminInventory = async (req, res, next) => {
  try {
    const { lowStockOnly, category } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (lowStockOnly === 'true') {
      filter.$expr = { $lte: ['$stockQuantity', '$lowStockThreshold'] };
    }

    // Role-sensitive projection: Include costPrice if CEO is querying
    const isCEO = req.user && req.user.role === 'CEO';
    const query = Product.find(filter).sort({ stockQuantity: 1 });

    if (isCEO) {
      query.select('+costPrice');
    }

    const inventory = await query.lean();

    const lowStockCount = inventory.filter((item) => item.stockQuantity <= item.lowStockThreshold).length;

    return res.status(200).json({
      success: true,
      data: {
        totalItems: inventory.length,
        lowStockAlertCount: lowStockCount,
        inventory,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/inventory/:id/stock
 * Atomic stock adjustment (+/- count)
 */
const adjustStockAtomic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adjustment, reason } = req.body;

    const parsedAdjustment = parseInt(adjustment, 10);
    if (isNaN(parsedAdjustment) || parsedAdjustment === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Adjustment value must be a non-zero integer.',
          statusCode: 400,
        },
      });
    }

    if (!reason || String(reason).trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'A valid audit reason (minimum 5 characters) is required for stock adjustments.',
          statusCode: 400,
        },
      });
    }

    let updatedProduct;

    if (parsedAdjustment < 0) {
      // Atomic condition: Ensure stock does not drop below zero
      updatedProduct = await Product.findOneAndUpdate(
        {
          _id: id,
          stockQuantity: { $gte: Math.abs(parsedAdjustment) },
        },
        {
          $inc: { stockQuantity: parsedAdjustment },
        },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(409).json({
          success: false,
          error: {
            message: 'Stock adjustment rejected: Insufficient quantity on hand to fulfill reduction.',
            statusCode: 409,
          },
        });
      }
    } else {
      // Restock addition
      updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          $inc: { stockQuantity: parsedAdjustment },
        },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Product not found.',
            statusCode: 404,
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Stock adjusted successfully by ${parsedAdjustment > 0 ? '+' : ''}${parsedAdjustment} units.`,
      data: {
        productId: updatedProduct._id,
        title: updatedProduct.title,
        sku: updatedProduct.sku,
        newStockQuantity: updatedProduct.stockQuantity,
        lowStockAlert: updatedProduct.stockQuantity <= updatedProduct.lowStockThreshold,
        reason: reason.trim(),
        adjustedBy: req.user.fullName,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/products
 * Create a new catalog product (ADMIN & CEO)
 */
const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      category,
      brand,
      description,
      specifications,
      costPrice,
      sellingPrice,
      discountedPrice,
      stockQuantity,
      lowStockThreshold,
      sku,
      isFeatured,
      warrantyMonths,
      imageUrl,
    } = req.body;

    const newProduct = await Product.create({
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category,
      brand,
      description,
      specifications,
      costPrice,
      sellingPrice,
      discountedPrice,
      stockQuantity,
      lowStockThreshold: lowStockThreshold || 5,
      sku: sku.toUpperCase(),
      isFeatured: Boolean(isFeatured),
      warrantyMonths: warrantyMonths || 12,
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: {
        product: newProduct,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicProducts,
  getPublicProductBySlug,
  getAdminInventory,
  adjustStockAtomic,
  createProduct,
};
