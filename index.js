const express = require('express');
const app = express();
const chalk = require('chalk');
const route = require('./routes');
const cors = require('cors');
require('dotenv').config();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true }));
// app.use(function (req, res, next) {
//    console.log(req);
//    res.setHeader('Access-Control-Allow-Origin', '*');
//    res.setHeader(
//       'Access-Control-Allow-Methods',
//       'GET, POST, OPTIONS, PUT, PATCH, DELETE'
//    );
//    res.setHeader(
//       'Access-Control-Allow-Headers',
//       'X-Requested-With,content-type'
//    );
//    res.setHeader('Access-Control-Allow-Credentials', true);

//    next();
// });
// app.use(function (req, res, next) {
//    if (req.headers.origin === 'http://localhost:3000') next();
//    else
//       res.json({
//          code: 3,
//          message: 'You do not have permission to access this url',
//       });
// });

const PORT = process.env.PORT || 4000;

//Routers
route(app);

app.listen(PORT, () => {
   console.log(
      chalk.bold.cyan(`server is running at http://dungxbuif-localhost:${PORT}`)
   );
});
