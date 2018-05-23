var express = require('express');
var router = express.Router();
var timerMiddleware = require('../middleware/timer');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CodeursEnSeine Timers', timers: timerMiddleware.getAllTimers() });
});

module.exports = router;
