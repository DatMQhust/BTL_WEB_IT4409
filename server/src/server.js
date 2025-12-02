const path = require('path');
const dotenv = require('dotenv');

// Chỉ định đường dẫn đến file .env ở thư mục gốc của dự án
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const app = require('./app.js');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
