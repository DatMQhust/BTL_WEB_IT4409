const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes/index.js');

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors({}));
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', routes);

module.exports = app;
