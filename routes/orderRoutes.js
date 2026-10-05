const express = require('express');
const {
  checkout,
  trackOrder,
  getAdminOrders,
  updateOrderStatus,
  dispatchTechnician,
} = require('../controllers/orderController');
const { requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Marketplace & Client Routes
router.post('/checkout', checkout);
router.get('/track/:orderNumber', trackOrder);

// Admin & CEO Order Management Routes
router.get('/admin/all', ...requireAdmin, getAdminOrders);
router.patch('/admin/:id/status', ...requireAdmin, updateOrderStatus);
router.patch('/admin/:id/dispatch', ...requireAdmin, dispatchTechnician);

module.exports = router;
