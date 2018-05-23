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
module.exports = router;
