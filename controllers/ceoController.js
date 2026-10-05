const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * GET /api/ceo/financials/overview
 * Executive Financial Analytics (Strictly protected by requireCEO):
 * Uses high-performance MongoDB aggregation pipelines.
 */
const getFinancialOverview = async (req, res, next) => {
  try {
    // 1. Pipeline for Gross Revenue & Net Profit from Completed/Installed orders
    const installedFinancialsPromise = Order.aggregate([
      {
        $match: {
          status: 'Installed',
        },
      },
      {
        $group: {
          _id: null,
          totalGrossRevenue: { $sum: '$grossTotal' },
          totalCostOfGoods: { $sum: '$totalCostOfGoods' },
          totalNetProfit: { $sum: '$netProfit' },
          installedOrdersCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalGrossRevenue: 1,
          totalCostOfGoods: 1,
          totalNetProfit: 1,
          installedOrdersCount: 1,
          netProfitMarginPercent: {
            $cond: [
              { $gt: ['$totalGrossRevenue', 0] },
              { $multiply: [{ $divide: ['$totalNetProfit', '$totalGrossRevenue'] }, 100] },
              0,
            ],
          },
        },
      },
    ]);

    // 2. Pipeline for Outstanding Receivables:
    // Work completed ('Installed') but payment not verified ('Pending')
    const receivablesPromise = Order.aggregate([
      {
        $match: {
          status: 'Installed',
          paymentStatus: 'Pending',
        },
      },
      {
        $group: {
          _id: null,
          outstandingReceivablesAmount: { $sum: '$grossTotal' },
          pendingCollectionsCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          outstandingReceivablesAmount: 1,
          pendingCollectionsCount: 1,
        },
      },
    ]);

    // 3. Pipeline for Active Pipeline Value (Orders in Pending/Survey/Quoted status)
    const pipelinePromise = Order.aggregate([
      {
        $match: {
          status: { $in: ['Pending', 'Survey_Scheduled', 'Quoted'] },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          potentialRevenue: { $sum: '$grossTotal' },
        },
      },
    ]);

    // 4. Inventory Valuation (Wholesale investment vs retail value)
    const inventoryValuationPromise = Product.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $project: {
          stockQuantity: 1,
          costPrice: 1,
          sellingPrice: 1,
          totalCostValuation: { $multiply: ['$stockQuantity', '$costPrice'] },
          totalRetailValuation: { $multiply: ['$stockQuantity', '$sellingPrice'] },
        },
      },
      {
        $group: {
          _id: null,
          warehouseCostValuation: { $sum: '$totalCostValuation' },
          warehouseRetailValuation: { $sum: '$totalRetailValuation' },
          totalUnitsInStock: { $sum: '$stockQuantity' },
        },
      },
      {
        $project: {
          _id: 0,
          warehouseCostValuation: 1,
          warehouseRetailValuation: 1,
          totalUnitsInStock: 1,
          projectedUnrealizedMargin: {
            $subtract: ['$warehouseRetailValuation', '$warehouseCostValuation'],
          },
        },
      },
    ]);

    // Execute aggregations concurrently
    const [installedResult, receivablesResult, pipelineResult, inventoryResult] = await Promise.all([
      installedFinancialsPromise,
      receivablesPromise,
      pipelinePromise,
      inventoryValuationPromise,
    ]);

    const installedData = installedResult[0] || {
      totalGrossRevenue: 0,
      totalCostOfGoods: 0,
      totalNetProfit: 0,
      installedOrdersCount: 0,
      netProfitMarginPercent: 0,
    };

    const receivablesData = receivablesResult[0] || {
      outstandingReceivablesAmount: 0,
      pendingCollectionsCount: 0,
    };

    const inventoryData = inventoryResult[0] || {
      warehouseCostValuation: 0,
      warehouseRetailValuation: 0,
      totalUnitsInStock: 0,
      projectedUnrealizedMargin: 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        executiveFinancials: {
          currency: 'PKR',
          totalGrossRevenue: installedData.totalGrossRevenue,
          totalCostOfGoods: installedData.totalCostOfGoods,
          totalNetProfit: installedData.totalNetProfit,
          netProfitMarginPercent: Number(installedData.netProfitMarginPercent.toFixed(2)),
          installedOrdersCount: installedData.installedOrdersCount,
          outstandingReceivables: receivablesData.outstandingReceivablesAmount,
          pendingCollectionsCount: receivablesData.pendingCollectionsCount,
        },
        pipelineBreakdown: pipelineResult,
        warehouseValuation: inventoryData,
        auditTimestamp: new Date().toISOString(),
        reviewedBy: req.user.fullName,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/ceo/orders/audit-trail
 * Review all high-value transactions and margin breakdowns
 */
const getExecutiveOrderAudits = async (req, res, next) => {
  try {
    const { page = 1, limit = 25 } = req.query;
    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(50, parseInt(limit, 10));
    const pageSize = Math.min(50, parseInt(limit, 10));

    // Notice: explicitly selects totalCostOfGoods and netProfit for CEO view
    const [orders, total] = await Promise.all([
      Order.find()
        .select('+totalCostOfGoods +netProfit +items.unitCostPrice +items.subtotalCostPrice')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Order.countDocuments(),
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

module.exports = {
  getFinancialOverview,
  getExecutiveOrderAudits,
};
