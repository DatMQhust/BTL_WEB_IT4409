const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema(
  {
    text: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        default: 0,
    },
    active: {
        type: Boolean,
        default: true
    }
  },
  {
    timestamps: true
  }
);

const TestModel = mongoose.models.Test || mongoose.model('Test', TestSchema);

module.exports = TestModel;
