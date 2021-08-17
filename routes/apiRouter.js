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

   if (spreadsheet === 'create-new-rule' && method === 'post')
      return spreadSheetsController.createNewRule(req, res, next);

   if (spreadsheet === 'create-event' && method === 'post')
      return spreadSheetsController.createEvent(req, res, next);

   if (spreadsheet === 'create-event-type' && method === 'post')
      return spreadSheetsController.createEventType(req, res, next);

   controllers[spreadsheet][method](req, res, next);
};

//[] /api/

router.get('/:spreadsheet/', (req, res, next) => handleAPI(req, res, next, 'get'));
router.post('/:spreadsheet/', (req, res, next) => handleAPI(req, res, next, 'post'));
router.put('/:spreadsheet/', (req, res, next) => handleAPI(req, res, next, 'put'));
router.delete('/:spreadsheet/', (req, res, next) => handleAPI(req, res, next, 'delete'));

module.exports = router;
