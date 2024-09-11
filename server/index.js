'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config({ path: './.env' });

const mongodb = require('./config/db');

app.use(cors());

mongodb();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
  })
);

const UserRoutes = require('./routes/user.route');

app.get('/api', (req, res) => {
  var response = {
    success: 1,
    message: 'Welcome to new era of web',
  };
  res.status(200).json(response);
});

app.use('/api/user', UserRoutes);

/**
 * @description Page NOT FOUND Error
 */
app.use((req, res) => {
  return res.status(404).json({
    success: 0,
    message: `NOT FOUND ${req.originalUrl}`,
  });
});

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV;

app.listen(PORT, () => {
  console.log(`server is listing in ${NODE_ENV} on ${PORT} `);
});
