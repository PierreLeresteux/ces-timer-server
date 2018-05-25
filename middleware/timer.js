const request = require('request');

var id=0;
const blacklist= {
    timer:3000,
    nbErrorMax:3,
    wemosHttpPort:3001
}
const timer = {
    
    timers:[],

    getAllTimers() {
        return this.timers;
    },

    addTimer(ip){
        var id=this.nextId()
        this.timers.push(new Timer(id,ip));
        return this.getTimer(id);
    },

    getTimer(id){
        id=Number(id);
        return this.timers.find(function(e){return e.id===id});

    },

    startTimer(id){
        var timer = this.getTimer(id)
        request.post('http://'+timer.ip+":"+blacklist.wemosHttpPort+"/start", { json: true }, (err, res, body) => {
            if (err){return err}
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
    callTimer(index){
        var timer=this.timers[index];
        console.log(timer.room)
        request('http://'+timer.ip+":"+blacklist.wemosHttpPort+"/ruok", { json: true }, (err, res, body) => {
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
                    console.log(body);
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
    this.status=null;
    this.time= {
        left: 0,
        total: 40
    };
    this.room=null;
}


module.exports = timer;