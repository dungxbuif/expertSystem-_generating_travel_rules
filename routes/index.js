const express = require('express');
let router = express.Router();

const route = (app) => {
   router.get('/', (req, res) => {
      res.send('Hello World!!!');
   });

   return app.use('/', router);
};

module.exports = route;
