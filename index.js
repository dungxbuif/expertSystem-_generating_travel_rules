const express = require('express');
const app = express();
const chalk = require('chalk');
const route = require('./routes');
require('dotenv').config();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 4000;

//Routers
route(app);

app.listen(PORT, () => {
   console.log(
      chalk.bold.cyan(`server is running at http://dungxbuif-localhost:${PORT}`)
   );
});
