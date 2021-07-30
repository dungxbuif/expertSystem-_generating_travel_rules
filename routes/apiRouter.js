const express = require('express');
const router = express.Router();
const controllers = require('../controllers/');

const handleAPI = (req, res, next, method) => {
   spreadsheet = req.params.spreadsheet;
   controllers[spreadsheet][method](req, res, next);
};

router.get('/spreadsheets/:spreadsheet/', (req, res, next) =>
   handleAPI(req, res, next, 'get')
);
router.post('/spreadsheets/:spreadsheet/', (req, res, next) =>
   handleAPI(req, res, next, 'post')
);
router.put('/spreadsheets/:spreadsheet/', (req, res, next) =>
   handleAPI(req, res, next, 'put')
);
router.delete('/spreadsheets/:spreadsheet/', (req, res, next) =>
   handleAPI(req, res, next, 'delete')
);

module.exports = router;
