const { spreadsheetsServices } = require('../services');
const SPREADSHEETS = require('../configs/spreadsheets');
const get = async (req, res, next) => {
   console.log('HERE');
   const data = await spreadsheetsServices.getTable(SPREADSHEETS.EVENT_TYPES);
   res.send(data);
};

module.exports = {
   get,
};
