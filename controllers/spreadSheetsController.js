const { spreadsheetsServices } = require('../services');
const SPREADSHEETS = require('../configs/spreadsheets');
const log = require('../configs/log');
const _ = require('lodash');

const getEventType = async (req, res, next) => {
   const data = await spreadsheetsServices.getTable(SPREADSHEETS.EVENT_TYPES);
   res.send(data);
};

const appendEventType = async (req, res, next) => {
   const values = req.body.values;
   const data = await spreadsheetsServices.append(SPREADSHEETS.EVENT_TYPES, values);
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
            eventTypesArr.map((item) => [item[0], { label: item[1], value: item[0], options: [] }]),
         );
         const eventsArr = [...res2.data];
         eventsArr.forEach((ele) => {
            eventTypesObj[ele[1]].options.push({
               label: ele[2],
               value: `${ele[0]}: ${ele[2]}`,
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
         message: `getGroupEvents failed !!! ${e.message}`,
      });
   }
};

const getAllRulesCommon = () => {
   return new Promise(async (resolve, reject) => {
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
               obj[RULE_ID]['result'] = `${EVENT_KEY_FROM_RESULT}: ${EVENT_VALUE}`;
            }

            obj[RULE_ID]['events'].push(`${RULE_VALUE}: ${eventsObj[RULE_VALUE]}`);

            return obj;
         }, {});

         resolve(Object.values(rulesObj));
      }
   });
};

const getAllRules = async (req, res, next) => {
   try {
      const data = await getAllRulesCommon();
      res.send({
         code: 1,
         message: `Get select box data succeed`,
         data,
      });
   } catch (e) {
      console.log(log.error(`getAllRules failed: ${e.message}`));
      res.send({
         code: 0,
         message: `getAllRules failed !!!`,
      });
   }
};

const isExistInArray = (x, y) => {
   return _(x).differenceWith(y, _.isEqual).isEmpty() && x.length == y.length;
};
const checkExistRule = (rules, newRule) => {
   for (let i = 0; i < rules.length; i++) {
      if (rules[i].result === newRule.result && isExistInArray(rules[i].events, newRule.events))
         return true;
   }
   return false;
};

const createNewRule = async (req, res, next) => {
   try {
      const size = await spreadsheetsServices.getSize(SPREADSHEETS.RESULTS);
      const { result, events } = req.body;
      const rulesRes = await getAllRulesCommon();
      const allRules = rulesRes.map((item) => ({
         result: item.result,
         events: item.events,
      }));

      const checkRules = checkExistRule(allRules, { result, events });

      if (!checkRules) {
         const result_event_id = result.split(': ')[0];
         const rules_event_id = events.map((item) => {
            return [size + 1, item.split(': ')[0]];
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
      } else {
         res.send({
            code: 2,
            message: `Rule has already existed !!!`,
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

const getAllEvents = async (req, res, next) => {
   try {
      const eventsArr = await spreadsheetsServices.getTable(SPREADSHEETS.EVENTS);

      if (eventsArr.code === 1) {
         console.log(log.succeed('getAllEvents succeed!!!'));

         const data = eventsArr.data.map((item) => `${item[0]}: ${item[2]}`);

         res.send({
            code: 1,
            message: `Get all events succeed`,
            data,
         });
      }
   } catch (e) {
      console.log(log.error(`et all events failed: ${e.message}`));
      res.send({
         code: 0,
         message: `Get all events failed !!!`,
      });
   }
};

const createEventType = async (req, res, next) => {
   try {
      const size = await spreadsheetsServices.getSize(SPREADSHEETS.EVENT_TYPES);
      const ID = String.fromCharCode(65 + size) + '';

      const { eventType } = req.body;

      if (!eventType) {
         return res.status(404).send({
            code: 0,
            message: `Missing required parameters !!!`,
         });
      }

      const value = [[ID, eventType]];

      const saveResult = await spreadsheetsServices.append(SPREADSHEETS.EVENT_TYPES, value);

      if (saveResult.code === 1) {
         res.send({
            code: 1,
            message: `Create New EventType succeed`,
         });
      } else {
         res.send({
            code: 0,
            message: `Create New EventType failed !!!`,
         });
      }
   } catch (e) {
      console.log(log.error(`Create New EventType failed: ${e.message}`));
      res.send({
         code: 0,
         message: `Create New EventType failed !!!`,
      });
   }
};

const createEvent = async (req, res, next) => {
   const { ID, event } = req.body;
   try {
      var index;
      const eventsArr = (await spreadsheetsServices.getTable(SPREADSHEETS.EVENTS)).data;
      const value = [null, ID, event];
      for (let i = eventsArr.length - 1; i >= 0; i--) {
         if (eventsArr[i][1] === ID) {
            let eventID = eventsArr[i][0];
            eventID = parseInt(eventID.replace(ID, ''));
            eventID++;
            value[0] = `${ID}${eventID}`;
            index = i + 3;
            break;
         }
      }

      const saveResult = await spreadsheetsServices.addRow(
         SPREADSHEETS.EVENTS,
         SPREADSHEETS.EVENTS_NUM,
         +index,
         [value],
      );

      if (saveResult.code == 1) {
         res.send({
            code: 1,
            message: `Create New Event succeed`,
         });
      } else {
         res.send({
            code: 0,
            message: `Create New Event failed !!!`,
         });
      }
   } catch (e) {
      console.log(log.error(`Create New EventType failed: ${e.message}`));
      res.send({
         code: 0,
         message: `Create New EventType failed !!!`,
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
   getAllEvents,
   createEvent,
   createEventType,
};
