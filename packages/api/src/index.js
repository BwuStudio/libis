import ajax from './ajax'

function Api(func) {
    var res = {}
    var reg = function (name, call) { res[name] = call }
    var a = func(ajax, reg)
    if(a){
        $.extend(res,a)
    }
    return res
}

Api.create = function (f) { return Api(f) }

// Api(function (ajax,reg) {
//     reg('name',function(){retrun ajax({})})
// })

export default Api