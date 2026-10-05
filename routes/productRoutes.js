const express = require('express');
const {
  getPublicProducts,
  getPublicProductBySlug,
  getAdminInventory,
  adjustStockAtomic,
  createProduct,
} = require('../controllers/productController');
const { requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Catalog Endpoints (Projection excludes costPrice)
router.get('/', getPublicProducts);
router.get('/:slug', getPublicProductBySlug);

// Admin & CEO Inventory Management Endpoints
router.get('/admin/inventory', ...requireAdmin, getAdminInventory);
router.patch('/admin/inventory/:id/stock', ...requireAdmin, adjustStockAtomic);
router.post('/admin/products', ...requireAdmin, createProduct);

module.exports = router;
