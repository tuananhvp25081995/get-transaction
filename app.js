const express = require("express");
const bodyParser = require('body-parser');
require('dotenv').config()
const cors = require('cors')
const rateLimit = require("express-rate-limit");
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
require('./models/addressModel');
require("./models/database").connect();
const eventRouter = require("./routes/event")
const apiLimiter = rateLimit({
    windowMs: 10 * 1000,
    max: 1,
    message: "Too many request, please slowly"
});
require("./bot")

app.use(cors({
    origin: '*'
}));

require("./services/ws.service").connect(process.env.WS_PORT)
// app.use('/api', eventRouter);

module.exports = app