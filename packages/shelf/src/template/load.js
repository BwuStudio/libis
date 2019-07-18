



var _CONTENT_ = '_CONTENT_'
var _DATA_ = '_DATA_'


var _QUEUE_ = '_QUEUE_'
var _IF_BLOCK_ = '_IF_BLOCK_'
var _IF_CASE_ = '_IF_CASE_'
var _LOOP_CASE_ = '_LOOP_TREE_'


// 解决严格模式不能用 with 语句的问题
var evalData = new Function('__str__', 'data',
    'try {' +
    'with (data) {' +
    'return eval(__str__.replace(/\\&amp\\;/g, "&").replace(/\\&gt\\;/, ">"))' +
    '}' +
    '} catch (e) {' +
    'console.warn("err:" + __str__)' +
    '}'
)

window.evalData = evalData

function load(v, data) {

    if (!v) return ''

    if (typeof v === 'string') return v

    if (v instanceof Array) return v.map(function (v) { return load(v, data) }).join('')

    switch (v.type) {

        case _CONTENT_: return load(v.queue, data)

        case _QUEUE_: return load(v.queue, data)

        case _DATA_: return evalData(v.data, data)

        case _IF_BLOCK_:
            var r = v.ifCaseArr.find(function (cas) {
                if (cas.type !== _IF_CASE_) throw new Error('shelf parse error')
                if (evalData(cas.condition, data)) return true
                else return false;
            })

            if (r) return load(r.queue, data)
            else return ''

        case _LOOP_CASE_:
            var arr = evalData(v.array, data)
            if (!(arr instanceof Array)) throw new Error('shelf parse error')

            return arr.map(function (item, index, array) {
                return load(v.queue, $.extend({}, data, { _index: index, _item: item, _array: array }))
            }).join('')
    }
}

export default load

