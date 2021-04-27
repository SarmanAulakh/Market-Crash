const functions = require('firebase-functions'); //59K (gzipped: 17.9K)
const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');

const app = express();
app.use(cors())
app.options('*', cors())

//uses "/api" path since its defined in export below
app.use("/", routes);  

exports.api = functions.https.onRequest(app);
exports.triggers = require('./triggers/index');
