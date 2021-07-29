var express = require('express');
var router = express.Router();
const EventController = require("../controllers/eventController");
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 1000,
  max: 3,
  message: "Too many request, please slowly"
});

router.post('/address', EventController.Event)

module.exports = router;
