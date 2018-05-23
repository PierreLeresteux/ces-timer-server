var id=0;
const timer = {
    
    timers:[],

    getAllTimers() {
        return this.timers;
    },

    addTimer(ip){
        this.timers.push(new Timer(this.nextId(),ip));
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