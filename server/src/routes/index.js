const express = require('express');
const router = express.Router();

// Danh sách các route
const test = require('./test.route');

const listRoutes = [
  {
    path: '/test',
    route: test,
  },
  // Thêm các route khác tại đây
];

listRoutes.forEach(route => {
  router.use(route.path, route.route);
});

module.exports = router;
