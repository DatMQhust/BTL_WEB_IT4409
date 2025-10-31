const TestModel = require('../models/test.model.js');
const getTestText = async () => {
  const text = await TestModel.find();
  return text;
};

module.exports = {
  getTestText,
};
