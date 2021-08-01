const { spreadsheetsServices } = require('../services');
const SPREADSHEETS = require('../configs/spreadsheets');
const log = require('../configs/log');

const getEventType = async (req, res, next) => {
   const data = await spreadsheetsServices.getTable(SPREADSHEETS.EVENT_TYPES);
   res.send(data);
};

const appendEventType = async (req, res, next) => {
   const values = req.body.values;
   const data = await spreadsheetsServices.append(
      SPREADSHEETS.EVENT_TYPES,
      values
   );
   res.send(data);
};

const getGroupEvents = async (req, res, next) => {
   try {
      const [res1, res2] = await Promise.all([
         spreadsheetsServices.getTable(SPREADSHEETS.EVENT_TYPES),
         spreadsheetsServices.getTable(SPREADSHEETS.EVENTS),
      ]);
      if (res1.code === 1 && res2.code === 1) {
         console.log(log.succeed('getGroupEvents succeed!!!'));

         const data = [res1.data, res2.data];

         res.send({
            code: 1,
            message: `Get select box data succeed`,
            data,
         });
      }
   } catch (e) {
      console.log(log.error(`getGroupEvents failed: ${e.message}`));
      res.send({
         code: 0,
         message: `getGroupEvents failed !!!`,
      });
   }
};
module.exports = {
   eventTypesController: {
      get: getEventType,
      append: appendEventType,
   },
   getGroupEvents,
};
