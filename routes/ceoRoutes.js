const express = require('express');
const { getFinancialOverview, getExecutiveOrderAudits } = require('../controllers/ceoController');
const { requireCEO } = require('../middleware/authMiddleware');

const router = express.Router();

// Enforce CEO Role Guard on all endpoints in this router
router.use(...requireCEO);

router.get('/financials/overview', getFinancialOverview);
router.get('/orders/audit-trail', getExecutiveOrderAudits);

module.exports = router;
