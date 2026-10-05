const express = require('express');
const { generateQuotationPDF } = require('../controllers/quoteController');
const { requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// PDF Quotation Generation (Admin & CEO Level)
router.post('/generate', ...requireAdmin, generateQuotationPDF);

module.exports = router;
