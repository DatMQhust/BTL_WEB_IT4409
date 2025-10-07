const testService = require('../services/test.service');
const catchAsync = require('../utils/catchAsync');
const getTestText = catchAsync(async (req, res) => {
  const testText = await testService.getTestText();
  res.send({ text: testText });
});
module.exports = {
  getTestText,
};
