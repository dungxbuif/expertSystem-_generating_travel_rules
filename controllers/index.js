const SPREADSHEETS = require('../configs/spreadsheets');
const {
   eventTypesController,
   getGroupEvents,
   getAllRules,
   createNewRule,
   getAllEvents,
   createEvent,
   createEventType,
} = require('./spreadSheetsController');

module.exports = {
   [`${SPREADSHEETS.EVENT_TYPES}`]: eventTypesController,
   getGroupEvents,
   getAllRules,
   createNewRule,
   getAllEvents,
   createEvent,
   createEventType,
};
