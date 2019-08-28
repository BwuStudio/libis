// 从页面中获取模板
function scanHTML(win) {
    return (win || window).$('[class^="template-"],[class*=" template-"]').get().map(function (v) {
        return {
            target: v,
            name: v.className.split(' ').filter(function (v) { return /^template-/.test(v) })
        }
    }).filter(function (v) {
        return v.name.length > 0
    }).map(function (v) {
        v.target.style.display = 'none'
        return {
            html: v.target.innerHTML,
            name: v.name
        }
    })
}

// 从字符串中获取模板
function scanStr(str) {
    str.split('<!--template(').map(function (v) {
        var i = -1
        var name = ''
        var html = ''
        if ((i = v.indexOf(')-->')) < 0) return null

        name = v.substring(0, i)
        html = v.substring(i + 4) // ')-->'.length === 4

        return {
            html: html,
            name: [name.split(',').map(function (v) { return $.trim(v) })]
        }
    }).filter(function (v) {
        return v ? false : true
    }).filter(function (v) {
        return v.name.length > 0
    })
}

// 将模板字符串编译成 VDom 的构造函数
function dealHtml(html) {
    var queue = parseHtml(html).queue
    function createVDom(state) {
        return Dom(queue.map(function (v) {
            return v.type === _DATA_ ? evalData(v.data, state) : v
        }))
    }


    return function (state) {
        var vdom = {
            dom: createVDom(state)
        }
        return vdom
    }
}

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



/**
 *  将字符串编译为中间格式方便插值
 *  */
var _CONTENT_ = '_CONTENT_'
var _DATA_ = '_DATA_'

function parseHtml(str) {
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