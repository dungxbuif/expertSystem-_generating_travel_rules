const { google } = require('googleapis');
const log = require('../configs/log');
require('dotenv').config();
const spreadsheetId = process.env.SPEADSHEETID;

const auth = new google.auth.GoogleAuth({
   keyFile: 'credentials.json',
   scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const client = await auth.getClient();

const googleSheets = google.sheets({ version: 'v4', auth: client });

const getTable = (table) => {
   return new Promise(async (resolve, rejects) => {
      try {
         const res = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: table,
         });
         console.log(log.succeed(`Get spreadsheet ${table} succeed`));

         let data = [...res.data];
         data.shift();

         resolve({
            code: 1,
            message: `Get spreadsheet ${table} succeed`,
            data,
         });
      } catch (e) {
         rejects({ code: 0, message: e.message });
         console.log(log.error(e.message));
      }
   });
};

const append = (table, values = []) => {
   return new Promise(async (resolve, rejects) => {
      try {
         const res = await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: table,
            valueInputOption: 'USER_ENTERED',
            resource: {
               values,
            },
         });

         console.log(
            log.succeed(`Append data into spreadsheet ${table} succeed`)
         );

         resolve({
            code: 1,
            message: `Append data into spreadsheet ${table} succeed`,
         });
      } catch (e) {
         rejects({ code: 0, message: e.message });
         console.log(log.error(e.message));
      }
   });
};

module.exports = { getTable, append };
