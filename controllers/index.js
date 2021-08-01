const SPREADSHEETS = require('../configs/spreadsheets');
const {
   eventTypesController,
   getGroupEvents,
} = require('./spreadSheetsController');

module.exports = {
   [`${SPREADSHEETS.EVENT_TYPES}`]: eventTypesController,
   getGroupEvents,
};
