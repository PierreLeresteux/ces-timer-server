const request = require('request');
const ip = require('ip');

var id=0;
const blacklist= {
    timer:3000,
    nbErrorMax:3,
    wemosHttpPort:80
}
const timer = {
    
    timers:[],

    getAllTimers() {
        return this.timers;
    },

    addTimer(ip){
        var existingTimer = this.getTimerByIp(ip);
        if (existingTimer){
            console.log("Timer already exists");
            return existingTimer;
        }
        var id=this.nextId()
        console.log("Create Timer "+ip+"[id : "+id+"]");
        this.timers.push(new Timer(id,ip));
        return this.getTimer(id);
    },

    getTimer(id){
        id=Number(id);
        return this.timers.find(function(e){return e.id===id});
    },

    getTimerByIp(ip){
        return this.timers.find(function(e){return e.ip===ip});
    },

    startTimer(id,time_total){
        var timer = this.getTimer(id);        
        request.post('http://'+timer.ip+":"+blacklist.wemosHttpPort+"/start", { json: true }, (err, res, body) => {
            if (err){return err}
            var index=this.timers.findIndex(function(e){return e.id===id})
            timer.canbestop=true;
            this.timers[index]=timer;
        }).form({time_total:time_total});
    },

    stopTimer(id){
        var timer = this.getTimer(id)
        request.post('http://'+timer.ip+":"+blacklist.wemosHttpPort+"/stop", { json: true }, (err, res, body) => {
            if (err){return err}
            var index=this.timers.findIndex(function(e){return e.id===id})
            timer.canbestop=false;
            this.timers[index]=timer;
        });
    },

    setRoom(id,room){
        id=Number(id);
        var timer = this.getTimer(id);
        timer.room=room;
        var index=this.timers.findIndex(function(e){return e.id===id})
        this.timers[index]=timer;
        setTimeout(()=>{this.callTimer(index)},blacklist.timer);
        return timer;
    },

    sendServerIpToTimer(timerIp){
        request.post('http://'+timerIp+":"+blacklist.wemosHttpPort+"/server", { json: true, timeout:2000 }, (err, res, body) => {
            if (err){return err}
        }).form({serverIP:ip.address()});
    },

    callTimer(index){
        var timer=this.timers[index];

        request('http://'+timer.ip+":"+blacklist.wemosHttpPort+"/ruok?room="+timer.room, { json: true,timeout: 3300 }, (err, res, body) => {
            if (err || !body.ok){
                timer.error+=1
                this.timers[index]=timer
            }else{
                timer.error=0
                this.timers[index]=timer
            }
            if (timer.error>=blacklist.nbErrorMax){
                console.log("Remove "+timer.room)
                this.timers.splice(index, 1);
            }else{
                if (body){
                    timer.status=body.status;
                    timer.time=body.time;
                    this.timers[index]=timer;
                }
                setTimeout(()=>{this.callTimer(index)},blacklist.timer);
            }
        });  
    },
    nextId(){   
        id+=1;
        return id;
    }
}

var Timer = function(id,ip){
    this.id=id;
    this.ip=ip;
    this.error=0;
    this.intensity=4;
    this.canbestop=false;
    this.status=null;
    this.time= {
        left: 0,
        total: 0
    };
    this.room=null;
}


module.exports = timer;