const { google } = require('googleapis');
const log = require('../configs/log');
const path = require('path');
require('dotenv').config();
const spreadsheetId = process.env.SPEADSHEETID;
const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const auth = new google.auth.GoogleAuth({
   keyFile: path.resolve(GOOGLE_APPLICATION_CREDENTIALS),
   scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const googleSheets = async () => {
   const client = await auth.getClient();
   return google.sheets({ version: 'v4', auth: client });
};

const getTable = (table) => {
   return new Promise(async (resolve, rejects) => {
      try {
         const sheets = await googleSheets();
         const res = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: table,
         });

         let data = [...res.data.values];
         data.shift();

         console.log(log.succeed(`Get spreadsheet ${table} succeed`));
         resolve({
            code: 1,
            message: `Get spreadsheet ${table} succeed`,
            data,
         });
      } catch (e) {
         rejects({
            code: 0,
            message: `Get spreadsheet ${table} failed: ${e.message}`,
         });
         console.log(log.error(`Get spreadsheet ${table} failed: ${e.message}`));
      }
   });
};

const append = (table, values = []) => {
   return new Promise(async (resolve, rejects) => {
      try {
         const sheets = await googleSheets();
         const res = await sheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: table,
            valueInputOption: 'USER_ENTERED',
            resource: {
               values,
            },
         });

         console.log(log.succeed(`Append data into spreadsheet ${table} succeed`));

         resolve({
            code: 1,
            message: `Append data into spreadsheet ${table} succeed`,
         });
      } catch (e) {
         rejects({
            code: 0,
            message: `Append data into spreadsheet ${table} failed: ${e.message}`,
         });
         console.log(log.error(`Append data into spreadsheet ${table} failed: ${e.message}`));
      }
   });
};

const getSize = (table) => {
   return new Promise(async (resolve, rejects) => {
      try {
         const sheets = await googleSheets();
         const res = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: table,
         });
         console.log(log.succeed(`Get spreadsheet ${table} length succeed`));

         let data = [...res.data.values];
         data.shift();

         resolve(data.length);
      } catch (e) {
         rejects({ code: 0, message: e.message });
      }
   });
};

const addRow = (table, table_num, index, values = []) => {
   return new Promise(async (resolve, rejects) => {
      try {
         const sheets = await googleSheets();
         await sheets.spreadsheets
            .batchUpdate({
               auth,
               spreadsheetId,
               resource: {
                  requests: {
                     insertDimension: {
                        range: {
                           sheetId: table_num,
                           dimension: 'ROWS',
                           startIndex: index - 1,
                           endIndex: index,
                        },
                        inheritFromBefore: true,
                     },
                  },
               },
            })
            .then(async () => {
               await sheets.spreadsheets.values.update({
                  auth,
                  spreadsheetId,
                  range: `${table}!A${index}:C${index}`,
                  valueInputOption: 'USER_ENTERED',
                  resource: {
                     values,
                  },
               });
            });

         console.log(log.succeed(`Get spreadsheet ${table} length succeed`));

         resolve({ code: 1, message: 'succeed' });
      } catch (e) {
         rejects({ code: 0, message: e.message });
      }
   });
};

module.exports = { getTable, append, getSize, addRow };
