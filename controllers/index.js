const SPREADSHEETS = require('../configs/spreadsheets');
const eventTypesController = require('./eventTypesController');

const obj = {};

module.exports = {
   [`${SPREADSHEETS.EVENT_TYPES}`]: eventTypesController,
};
