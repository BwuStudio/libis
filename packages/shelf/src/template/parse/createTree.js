/**
 *  一个简单的解析模板的语法分析器
 *  */
var _END_ = '_END_'
var _FINISH_ = '_FINISH_'
var _LOOP_ = '_LOOP_'
var _IF_ = '_IF_'
var _ELSE_ = '_ELSE_'

var _QUEUE_ = '_QUEUE_'
var _IF_BLOCK_ = '_IF_BLOCK_'
var _IF_CASE_ = '_IF_CASE_'
var _LOOP_CASE_ = '_LOOP_TREE_'

export function createTree(words) {
    function newQueue() { return { type: _QUEUE_, queue: [] } }
    function newIf() { return { type: _IF_BLOCK_, ifCaseArr: [] } }
    function newIf_case(condition) { return { type: _IF_CASE_, condition: condition, queue: [] } }
    function newLoop(array) { return { type: _LOOP_CASE_, array: array, queue: [] } }

    var main = newQueue()
    var stack = {
        _arr: [main],
        top: main,
        push: function (item) {
            this._arr.push(item)
            this.top = item
        },
        pop: function () {
            this._arr.pop()
            this.top = this._arr[this._arr.length - 1]
        }
    }

    var err = ''

    words.find(function (v) {
        if (typeof v === 'string') {
            if (!stack.top || !stack.top.queue) {
                return err = '解析模板错误'
            } else {
                stack.top.queue.push(v)
            }
        } else if (v && v.type === _IF_) {
            var a = newIf()
            var b = newIf_case(v.value)

            a.ifCaseArr.push(b)

            if (!stack.top || !stack.top.queue) {
                return err = '解析模板错误'
            } else {
                stack.top.queue.push(a)
                stack.push(a)
                stack.push(b)
            }
        } else if (v && v.type === _ELSE_) {
            var b = newIf_case(v.value)

            stack.pop()
            if (!stack.top || !stack.top.ifCaseArr) {
                return err = '解析模板错误'
            } else {
                stack.top.ifCaseArr.push(b)
                stack.push(b)
            }
        } else if (v && v.type === _FINISH_) {
            if (stack.top.type !== _IF_CASE_) return err = '解析模板错误'
            stack.pop()
            if (stack.top.type !== _IF_BLOCK_) return err = '解析模板错误'
            stack.pop()
        } else if (v && v.type === _LOOP_) {
            var b = newLoop(v.value)

            if (!stack.top || !stack.top.queue) {
                return err = '解析模板错误'
            } else {
                stack.top.queue.push(b)
                stack.push(b)
            }
        } else if (v && v.type === _END_) {
            if (!stack.top || (stack.top.type !== _LOOP_CASE_)) {
                return err = '解析模板错误'
            } else {
                stack.pop()
            }
        }
    })

    if (err) console.warn(err)

    else return main
}

export function translateTree(item) {
    if (item && item.type === _QUEUE_) {
        item.queue = item.queue.map(function (v) {
            return translateTree(v)
        })
        return item
    } else if (item && item.type === _IF_BLOCK_) {
        item.ifCaseArr = item.ifCaseArr.map(function (v) {
            return translateTree(v)
        })
        return item
    } else if (item && item.type === _IF_CASE_) {
        item.queue = item.queue.map(function (v) {
            return translateTree(v)
        })
        return item
    } else if (item && item.type === _LOOP_CASE_) {
        item.queue = item.queue.map(function (v) {
            return translateTree(v)
        })
        return item
    } else if (typeof item === 'string') {
        return createContent(item)
    }
}


/**
 *  从语法树中取去模板字符串
 *  */
var _CONTENT_ = '_CONTENT_'
var _DATA_ = '_DATA_'

export function createContent(str) {
    function newData(data) {
        return {
            type: _DATA_,
            data: data
        }
    }
    var content = {
        type: _CONTENT_,
        queue: []
    }

    var s = str
    var begin = -1
    while ((begin = s.indexOf('${')) >= 0) {
        content.queue.push(s.substring(0, begin))
        var rest = s.substring(begin)
        var end = rest.indexOf('}')
        if (end < 0) {
            content.queue.push(rest)
            break
        }
        var data = rest.substring(2, end)
        content.queue.push(newData(data))
        s = rest.substring(end + 1)
    }
    content.queue.push(s)

    return content
}