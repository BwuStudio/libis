function Events(){
    var obj = {}

    return {
        regist:function(name,cb){
            obj[name] = cb
            return this
        },
        emit:function(name,args){
            if(!obj[name]) return console.warn("can't find method named '"+name+'" !')
            return obj[name].apply(null,args || [])
        
        },
        cancel:function(name){
            obj[name] = null
            return this
        }
    }
}

export default Events