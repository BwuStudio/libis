import template from './template/index'
import scan from './scan'
import define from './define'

var store = []
var task = []
var defFunc = define(store)


var Shelf = {
    template: template,

    define: defFunc.defineCommon,

    get: function (name) { 
        var cmpt = store.find(function (v) { return v.name === name })
        if(cmpt) return cmpt.creator
        else throw new Error("Can't find the component named '"+name+"'!")
    },

    done: function (cb) {
        if (task) {
            if(cb) task.push(cb)
            
            return new Promise(function(res,rej){
                task.push(res)
            })
        }
        else {
            if(cb) cb()
            return new Promise(function(res,rej){
                res()
            })
        }
        
    },

    _:{
        store:function(){return store},
        task:function(){return task}
    }
}

$(function () {
    scan(store).then(function () {
        // 加载完成则调用 task 上所有挂载的任务 
        if (task) task.forEach(function (cb) { cb() })
        // 不需要 task 去存储任务
        task = null
    })
})

export default Shelf