const express = require('express');
const router = express.Router();
const controllers = require('../controllers/');
const spreadSheetsController = require('../controllers');

const handleAPI = (req, res, next, method) => {
   spreadsheet = req.params.spreadsheet;

   if (spreadsheet === 'get-group-events' && method === 'get')
      return spreadSheetsController.getGroupEvents(req, res, next);

   if (spreadsheet === 'get-all-rules' && method === 'get')
      return spreadSheetsController.getAllRules(req, res, next);

   if (spreadsheet === 'get-all-events' && method === 'get')
      return spreadSheetsController.getAllEvents(req, res, next);

   if (spreadsheet === 'create-event' && method === 'post')
      return spreadSheetsController.createEvent(req, res, next);

   if (spreadsheet === 'create-event-type' && method === 'post')
      return spreadSheetsController.createEventType(req, res, next);

   controllers[spreadsheet][method](req, res, next);
};

//[] /api/

router.get('/spreadsheets/:spreadsheet/', (req, res, next) =>
   handleAPI(req, res, next, 'get')
);
router.post('/spreadsheets/:spreadsheet/', (req, res, next) =>
   handleAPI(req, res, next, 'post')
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

router.post('/create-new-rule/', spreadSheetsController.createNewRule);

module.exports = router;
