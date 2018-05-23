var id=0;
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
        var timer = this.getTimer(id);
        timer.room=room;
        this.timers[this.timers.findIndex(function(e){return e.id===id})]=timer;
        return timer;
    },
    nextId(){   
        id+=1;
        return id;
    }
}

var Timer = function(id,ip){
    this.id=id;
    this.ip=ip;
    this.room=null;
}


module.exports = timer;