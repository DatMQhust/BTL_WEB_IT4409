const express = require('express');
const router = express.Router();

// Danh sách các route
const test = require('./test.route');
const auth = require('./auth.route');
const product = require('./product.route');
const review = require('./review.route');
const author = require('./author.route');
const category = require('./category.route');
const cart = require('./cart.route');
const order = require('./order.route');
const admin = require('./admin.route');

const listRoutes = [
  {
    path: '/test',
    route: test,
  },
  {
    path: '/auth',
    route: auth,
  },
  {
    path: '/product',
    route: product,
  },
  {
    path: '/reviews',
    route: review,
  },
  {
    path: '/author',
    route: author,
  },
  {
    path: '/category',
    route: category,
  },
  {
    path: '/cart',
    route: cart,
  },
  {
    path: '/orders',
    route: order,
  },
  {
    path: '/admin',
    route: admin,
  },
];

listRoutes.forEach(route => {
  router.use(route.path, route.route);
});

module.exports = router;
