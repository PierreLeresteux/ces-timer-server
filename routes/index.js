var express = require('express');
var router = express.Router();
var timerMiddleware = require('../middleware/timer');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CodeursEnSeine Timers', timers: timerMiddleware.getAllTimers() });
});

router.get('/setserver', function(req, res, next) {
  res.render('setServer', {});
});

router.post('/sendserverip', function(req, res, next) {
  var ip = req.body.ip;
  var room = req.body.room;
  timerMiddleware.sendServerIpToTimer(ip);
  var timer = timerMiddleware.addTimer(ip);
  timerMiddleware.setRoom(timer.id,room);
  res.redirect('/');
});


module.exports = router;
