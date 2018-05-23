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