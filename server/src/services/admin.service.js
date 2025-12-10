const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

const getDashboardStats = async () => {
  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);

  const revenueToday = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfToday },
        status: { $ne: 'cancelled' },
      },
    },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);

  const revenueThisMonth = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth },
        status: { $ne: 'cancelled' },
      },
    },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);

  const revenueThisYear = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear },
        status: { $ne: 'cancelled' },
      },
    },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);

  const totalOrders = await Order.countDocuments();
  const ordersToday = await Order.countDocuments({
    createdAt: { $gte: startOfToday },
  });
  const ordersThisMonth = await Order.countDocuments({
    createdAt: { $gte: startOfMonth },
  });

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const totalCustomers = await User.countDocuments();
  const newCustomersToday = await User.countDocuments({
    createdAt: { $gte: startOfToday },
  });
  const newCustomersThisMonth = await User.countDocuments({
    createdAt: { $gte: startOfMonth },
  });

  const totalProducts = await Product.countDocuments();
  const lowStockProducts = await Product.countDocuments({
    inStock: { $lt: 10 },
  });
  const outOfStockProducts = await Product.countDocuments({ inStock: 0 });

  return {
    revenue: {
      total: totalRevenue[0]?.total || 0,
      today: revenueToday[0]?.total || 0,
      thisMonth: revenueThisMonth[0]?.total || 0,
      thisYear: revenueThisYear[0]?.total || 0,
    },
    orders: {
      total: totalOrders,
      today: ordersToday,
      thisMonth: ordersThisMonth,
      byStatus: ordersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    },
    customers: {
      total: totalCustomers,
      newToday: newCustomersToday,
      newThisMonth: newCustomersThisMonth,
    },
    products: {
      total: totalProducts,
      lowStock: lowStockProducts,
      outOfStock: outOfStockProducts,
    },
  };
};

const getRevenueStats = async (period = 'month', year, month) => {
  const currentYear = year || new Date().getFullYear();
  const currentMonth = month || new Date().getMonth() + 1;

  let groupBy, matchCondition;

  if (period === 'year') {
    groupBy = { $month: '$createdAt' };
    matchCondition = {
      createdAt: {
        $gte: new Date(currentYear, 0, 1),
        $lt: new Date(currentYear + 1, 0, 1),
      },
      status: { $ne: 'cancelled' },
    };
  } else if (period === 'month') {
    groupBy = { $dayOfMonth: '$createdAt' };
    matchCondition = {
      createdAt: {
        $gte: new Date(currentYear, currentMonth - 1, 1),
        $lt: new Date(currentYear, currentMonth, 1),
      },
      status: { $ne: 'cancelled' },
    };
  } else if (period === 'week') {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    groupBy = { $dayOfMonth: '$createdAt' };
    matchCondition = {
      createdAt: { $gte: startDate },
      status: { $ne: 'cancelled' },
    };
  }

  const revenueData = await Order.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: groupBy,
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    period,
    year: currentYear,
    month: period === 'month' ? currentMonth : undefined,
    data: revenueData.map(item => ({
      period: item._id,
      revenue: item.revenue,
      orders: item.orders,
    })),
  };
};

const getInventoryReport = async () => {
  const stockLevels = await Product.aggregate([
    {
      $bucket: {
        groupBy: '$inStock',
        boundaries: [0, 1, 10, 50, 100, 500, Infinity],
        default: 'Other',
        output: {
          count: { $sum: 1 },
          products: {
            $push: { name: '$name', inStock: '$inStock', _id: '$_id' },
          },
        },
      },
    },
  ]);

  const inventoryValue = await Product.aggregate([
    {
      $project: {
        value: { $multiply: ['$price', '$inStock'] },
      },
    },
    {
      $group: {
        _id: null,
        totalValue: { $sum: '$value' },
      },
    },
  ]);

  const lowStockProducts = await Product.find({ inStock: { $lt: 10, $gt: 0 } })
    .select('name inStock price categoryId')
    .populate('categoryId', 'name')
    .sort('inStock')
    .limit(20);

  const outOfStockProducts = await Product.find({ inStock: 0 })
    .select('name sold price categoryId')
    .populate('categoryId', 'name')
    .limit(20);

  const productsByCategory = await Product.aggregate([
    {
      $group: {
        _id: '$categoryId',
        count: { $sum: 1 },
        totalStock: { $sum: '$inStock' },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $project: {
        categoryName: '$category.name',
        count: 1,
        totalStock: 1,
      },
    },
  ]);

  return {
    totalInventoryValue: inventoryValue[0]?.totalValue || 0,
    stockLevels,
    lowStockProducts,
    outOfStockProducts,
    productsByCategory,
  };
};

const getBestSellingProducts = async (limit = 10, period = 'all') => {
  let matchCondition = {};

  if (period === 'month') {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    matchCondition = { createdAt: { $gte: startOfMonth } };
  } else if (period === 'year') {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    matchCondition = { createdAt: { $gte: startOfYear } };
  }

  const bestSelling = await Order.aggregate([
    {
      $match: Object.assign({}, matchCondition, {
        status: { $ne: 'cancelled' },
      }),
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        totalRevenue: {
          $sum: { $multiply: ['$items.price', '$items.quantity'] },
        },
        orderCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $project: {
        productId: '$_id',
        name: '$product.name',
        coverImageUrl: '$product.coverImageUrl',
        price: '$product.price',
        inStock: '$product.inStock',
        totalSold: 1,
        totalRevenue: 1,
        orderCount: 1,
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
  ]);

  return bestSelling;
};

const getSalesByCategory = async (period = 'all') => {
  let matchCondition = {};

  if (period === 'month') {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    matchCondition = { createdAt: { $gte: startOfMonth } };
  } else if (period === 'year') {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    matchCondition = { createdAt: { $gte: startOfYear } };
  }

  const salesByCategory = await Order.aggregate([
    {
      $match: Object.assign({}, matchCondition, {
        status: { $ne: 'cancelled' },
      }),
    },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$product.categoryId',
        totalRevenue: {
          $sum: { $multiply: ['$items.price', '$items.quantity'] },
        },
        totalSold: { $sum: '$items.quantity' },
        orderCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $project: {
        categoryId: '$_id',
        categoryName: '$category.name',
        totalRevenue: 1,
        totalSold: 1,
        orderCount: 1,
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);

  return salesByCategory;
};

const getCustomerStats = async () => {
  const topCustomers = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: '$user',
        totalSpent: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        userId: '$_id',
        name: '$user.name',
        email: '$user.email',
        totalSpent: 1,
        orderCount: 1,
      },
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 10 },
  ]);

  const currentYear = new Date().getFullYear();
  const customerGrowth = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    topCustomers,
    customerGrowth,
  };
};

module.exports = {
  getDashboardStats,
  getRevenueStats,
  getInventoryReport,
  getBestSellingProducts,
  getSalesByCategory,
  getCustomerStats,
};
