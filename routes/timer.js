var express = require('express');
var router = express.Router();
const requestIp = require('request-ip');

var timerMiddleware = require('../middleware/timer');


router.get('/', function(req, res, next) {
  res.send(timerMiddleware.getAllTimers());
});

router.post('/', function(req, res, next) {
  var ip = requestIp.getClientIp(req);
  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7)
  }
  res.send(timerMiddleware.addTimer(ip));
});

router.get('/:id', function(req,res,next){
  res.send(timerMiddleware.getTimer(req.params.id))
});

router.get('/:id/info', function(req,res,next){
  const timer = timerMiddleware.getTimer(req.params.id)
  res.render('timerInfo', { timer: timer });
});

router.get('/:id/room', function(req,res,next){
  const timer = timerMiddleware.getTimer(req.params.id)
  res.render('timerRoom', { timer: timer });
});

router.post('/:id/room', function(req,res,next){
  var room = req.body.room;
  timerMiddleware.setRoom(req.params.id,room)
  res.redirect('/');
});

router.post('/:id/start', function(req,res,next){
  res.send(timerMiddleware.startTimer(req.params.id))
});
module.exports = router;
