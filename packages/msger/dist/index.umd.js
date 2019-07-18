(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Event = factory());
}(this, function () { 'use strict';

    function Event(){
        var obj = {};

        return {
            regist:function(name,cb){
                obj[name] = cb;
                return this
            },
            emit:function(name,args){
                if(!obj[name]) return console.warn("can't find method named '"+name+'" !')
                return obj[name].apply(null,args || [])
            
            }
        }
    }

    return Event;

}));
