const express = require('express');
const router = express.Router();
const { requestLogger } = require('../middlewares/test');
const testController = require('../controller/test.controller');
// Apply the requestLogger middleware to all routes in this router
router.use(requestLogger);

/*
// Code base để test mẫu
router.get('/', requestLogger, testController.getTestText);
*/

//test protect auth middleware
router.get('/', testController.getTestText);
module.exports = router;
