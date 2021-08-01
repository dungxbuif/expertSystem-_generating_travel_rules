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
         const eventTypesArr = [...res1.data];
         const eventTypesObj = Object.fromEntries(
            eventTypesArr.map((item) => [
               item[0],
               { label: item[1], options: [] },
            ])
         );
         const eventsArr = [...res2.data];
         eventsArr.forEach((ele) => {
            eventTypesObj[ele[1]].options.push({
               label: ele[2],
               value: `${ele[0]}:${ele[2]}`,
            });
         });
         const data = Object.values(eventTypesObj);

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

const getAllRules = async (req, res, next) => {
   try {
      const [res1, res2, res3] = await Promise.all([
         spreadsheetsServices.getTable(SPREADSHEETS.RESULTS),
         spreadsheetsServices.getTable(SPREADSHEETS.EVENTS),
         spreadsheetsServices.getTable(SPREADSHEETS.RULES),
      ]);
      if (res1.code === 1 && res2.code === 1 && res3.code === 1) {
         console.log(log.succeed('getAllRules succeed!!!'));

         const resultsObj = Object.fromEntries([...res1.data]);
         let eventsArr = res2.data.map((item) => [item[0], item[2]]);
         const eventsObj = Object.fromEntries(eventsArr);
         let rulesArr = [...res3.data];
         const rulesObj = rulesArr.reduce(function (obj, item) {
            let RULE_ID = item[0];
            let RULE_VALUE = item[1];
            obj[RULE_ID] = obj[RULE_ID] || { id: '', result: '', events: [] };

            if (obj[RULE_ID]['id'] === '') obj[RULE_ID]['id'] = RULE_ID;

            if (obj[RULE_ID]['result'] === '') {
               let EVENT_KEY_FROM_RESULT = resultsObj[RULE_ID];
               let EVENT_VALUE = eventsObj[EVENT_KEY_FROM_RESULT];
               obj[RULE_ID][
                  'result'
               ] = `${EVENT_KEY_FROM_RESULT}:${EVENT_VALUE}`;
            }

            obj[RULE_ID]['events'].push(
               `${RULE_VALUE}:${eventsObj[RULE_VALUE]}`
            );

            return obj;
         }, {});

         const data = Object.values(rulesObj);

         res.send({
            code: 1,
            message: `Get select box data succeed`,
            data,
         });
      }
   } catch (e) {
      console.log(log.error(`getAllRules failed: ${e.message}`));
      res.send({
         code: 0,
         message: `getAllRules failed !!!`,
      });
   }
};

const createNewRule = async (req, res, next) => {
   try {
      const size = await spreadsheetsServices.getSize(SPREADSHEETS.RESULTS);
      const { result, events } = req.body;
      const result_event_id = result.split(':')[0];
      const rules_event_id = events.map((item) => {
         return [size + 1, item.split(':')[0]];
      });
      const value = [[size + 1, result_event_id]];
      const [saveResult, saveRules] = await Promise.all([
         spreadsheetsServices.append(SPREADSHEETS.RESULTS, value),
         spreadsheetsServices.append(SPREADSHEETS.RULES, rules_event_id),
      ]);

      if (saveResult.code == 1 && saveRules.code == 1) {
         res.send({
            code: 1,
            message: `createNewRule succeed`,
         });
      } else {
         res.send({
            code: 0,
            message: `createNewRule failed !!!`,
         });
      }
   } catch (e) {
      console.log(log.error(`createNewRule failed: ${e.message}`));
      res.send({
         code: 0,
         message: `createNewRule failed !!!`,
      });
   }
};

module.exports = {
   eventTypesController: {
      get: getEventType,
      append: appendEventType,
   },
   getGroupEvents,
   getAllRules,
   createNewRule,
};
