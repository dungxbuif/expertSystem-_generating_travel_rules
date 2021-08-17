const express = require('express');
const app = express();
const chalk = require('chalk');
const route = require('./routes');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true }));
app.use('/', express.static(path.join(__dirname, 'build')));

const PORT = process.env.PORT || 4000;

//Routers
route(app);

app.listen(PORT, () => {
   console.log(chalk.bold.cyan(`server is running at http://localhost:${PORT}`));
});
