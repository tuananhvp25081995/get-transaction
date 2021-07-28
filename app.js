const express = require("express");
const bodyParser = require('body-parser');
require('dotenv').config()
const cors = require('cors')
const rateLimit = require("express-rate-limit");
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const apiLimiter = rateLimit({
    windowMs: 10 * 1000,
    max: 1,
    message: "Too many request, please slowly"
});

require("./bot")

// app.use(cors())
//     app.listen(5000, function () {
//     console.log('CORS-enabled web server listening on port 5000')
// })

require("./services/ws.service").connect(process.env.WS_PORT)

module.exports = app