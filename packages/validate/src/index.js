import defCheck from './defCheck'

var defTable = defCheck.reduce(function (t, v) {
    t[v.name] = v.fn
    return t
}, {})

var logic = {
    and: function (fn) {
        // 上一级返回 true 时进行判断
        var a = this()
        if (a) return fn
        else return function (msg) { return false }
    },
    or: function () {
        // 上一级返回 false 时进行判断
        var a = this()
        if (a) return function (msg) { return msg }
        else return fn
    },
    not: function (msg) {
        var res = this()
        return res ? false : msg
    }
}

function Validate(op) {
    var option = op || {}
    var use = option.use || 'all'
    var custom = option.custom || {}

    if (use === 'all') use = defCheck.map(function (v) { return v.name })

    var mTable = use.reduce(function (t, name) {
        t[name] = defTable[name]
        return t
    }, {})

    mTable = $.extend(mTable, custom)

    var result = this

    for (var key in mTable) {
        if (!mTable.hasOwnProperty(key)) continue
        (function (key) {
            result[key] = function () {
                var args = arguments
                return $.extend(function (msg) {
                    var res = mTable[key].apply(null, args)
                    //处理异步结果
                    if (res && res.then) {
                        return res.then(function (v) {
                            return v && (msg || v)
                        })
                    }
                    return res && (msg || res) // 没有 msg 返回 res，存在 msg ，如果 res 为 true 返回 msg
                }, logic)
            }
        })(key)
    }

    return result
}

Validate.prototype = {
    and: function (fn) {
        // 上一级返回 true 时进行判断
        var a = this()
        if (a) return fn
        else return function (msg) { return false }
    },
    or: function () {
        // 上一级返回 false 时进行判断
        var a = this()
        if (a) return function (msg) { return msg }
        else return fn
    },
    not: function (msg) {
        var res = this()
        return res ? false : msg
    }
}

// 静态方法
Validate.create = function (op) { return new this(op) }
Validate.$async = function (arr) {


    return new Promise(function (res) {
        var i = arr.length
        function check(value) {
            if (value) res(value)
            else if (i === 0) res(false)
        }

        if (arr.length === 0) return res(false)
        arr.forEach(function (v) {
            if (v && v.then) v.then(function (value) {
                i--;
                check(value)
            })['catch'](function () { i--; check() })
            else {
                i--;
                check(false)
            }
        });
    })
}


export default Validate