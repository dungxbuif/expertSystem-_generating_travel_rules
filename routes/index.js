const express = require('express');
const apiRouter = require('./apiRouter');
let router = express.Router();

module.exports = (app) => {
   app.get('/', (req, res) => {
      res.send('Hello World!!!');
   });
   app.use('/api', apiRouter);
};
