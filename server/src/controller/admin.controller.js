const adminService = require('../services/admin.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getDashboardStats = catchAsync(async (req, res) => {
  const stats = await adminService.getDashboardStats();

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getRevenueStats = catchAsync(async (req, res, next) => {
  const { period = 'month', year, month } = req.query;

  if (!['week', 'month', 'year'].includes(period)) {
    return next(new AppError('Period phải là week, month, hoặc year', 400));
  }

  const stats = await adminService.getRevenueStats(
    period,
    year ? parseInt(year) : undefined,
    month ? parseInt(month) : undefined
  );

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getInventoryReport = catchAsync(async (req, res) => {
  const report = await adminService.getInventoryReport();

  res.status(200).json({
    status: 'success',
    data: {
      report,
    },
  });
});

exports.getBestSellingProducts = catchAsync(async (req, res, next) => {
  const { limit = 10, period = 'all' } = req.query;

  if (!['all', 'month', 'year'].includes(period)) {
    return next(new AppError('Period phải là all, month, hoặc year', 400));
  }

  const products = await adminService.getBestSellingProducts(
    parseInt(limit),
    period
  );

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getSalesByCategory = catchAsync(async (req, res, next) => {
  const { period = 'all' } = req.query;

  if (!['all', 'month', 'year'].includes(period)) {
    return next(new AppError('Period phải là all, month, hoặc year', 400));
  }

  const sales = await adminService.getSalesByCategory(period);

  res.status(200).json({
    status: 'success',
    results: sales.length,
    data: {
      sales,
    },
  });
});

exports.getCustomerStats = catchAsync(async (req, res) => {
  const stats = await adminService.getCustomerStats();

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
