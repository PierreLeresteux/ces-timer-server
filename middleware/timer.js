const request = require('request');

var id=0;
const delayCalltimer=3000;
const blacklistError=3;
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

    setRoom(id,room){
        id=Number(id);
        var timer = this.getTimer(id);
        timer.room=room;
        var index=this.timers.findIndex(function(e){return e.id===id})
        this.timers[index]=timer;
        setTimeout(()=>{this.callTimer(index)},delayCalltimer);
        return timer;
    },
    callTimer(index){
        var timer=this.timers[index];
        console.log(timer.room)
        request('http://'+timer.ip+":3001/ruok", { json: true }, (err, res, body) => {
            if (err || body!=='ok'){
                timer.error+=1
                this.timers[index]=timer
            }
            if (timer.error>=blacklistError){
                console.log("Remove "+timer.room)
                this.timers.splice(index, 1);
            }else{
                console.log(JSON.stringify(body));
                setTimeout(()=>{this.callTimer(index)},delayCalltimer);
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
    this.room=null;
}


module.exports = timer;