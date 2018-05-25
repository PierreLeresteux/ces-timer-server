var express = require('express');
var router = express.Router();

var timerMiddleware = require('../middleware/timer');


router.get('/', function(req, res, next) {
  res.send(timerMiddleware.getAllTimers());
});

router.post('/', function(req, res, next) {
  var ip = req.body.ip
  res.send(timerMiddleware.addTimer(ip));
});

router.get('/:id', function(req,res,next){
  res.send(timerMiddleware.getTimer(req.params.id))
});

router.get('/:id/info', function(req,res,next){
  const timer = timerMiddleware.getTimer(req.params.id)
  res.render('timerInfo', { timer: timer });
});

router.put('/:id', function(req,res,next){
  var room = req.body.room;
  res.send(timerMiddleware.setRoom(req.params.id,room));
});

router.post('/:id/start', function(req,res,next){
  res.send(timerMiddleware.startTimer(req.params.id))
});
module.exports = router;
