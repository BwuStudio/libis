(function (window, $) {
    Shelf = {
        // 注册组件方法
        define: function (name, option) { },
        // 获取组件构造函数
        get: function (name) {
            return Shelf._store[name].creator
        },
        scan: function () {

            // 将 url 信息添加到组件
            $('script').get().filter(function (v) {
                return /^shelf-/.test(v.className)
            }).map(function (v) {
                var src = v.src
                var name = v.className.match(/^shelf-(\w*)/)[1]
                if (Shelf._store[name]) {
                    Shelf._store[name].url = src
                }
            })

            // 通过 ajax 获取外部的组件模板
            Promise.all(
                Shelf._store_arr.filter(function (v) {
                    return v.templatePath
                }).map(function (v) {
                    return {
                        name: v.name,
                        t_url: path_resolve(v.url, v.templatePath)
                    }
                }).map(function (v) {
                    return new Promise(function (res, rej) {
                        $.ajax({
                            type: "get",
                            url: v.t_url, //需要获取的页面内容
                            async: true,
                            success: function (data) {
                                var t = $.trim(data).match((/^<[^>]*id\s*=\s*"\s*(\w*)\s*"[^>]*>([\s\S]*)<\/div>$/))
                                if (Shelf._store[t[1]]) {
                                    Shelf._store[t[1]].template = t[2]
                                }
                                // if (Shelf._store[v.name]) Shelf._store[v.name].template = data
                                res()
                            },
                            error: function (data) {
                                console.warn('shelf load error: ' + data)
                                rej()
                            }
                        });

                    })
                })
            )['finally'](function () {
                window.Shelf._done.forEach(function (v) { v() })
            })


        },
        _hasBeenDone: false,
        done: function () {
            return new Promise(function (res, rej) {
                if (window.Shelf._hasBeenDone) res()
                else { window.Shelf._done.push(res) }
            })
        },
        _done: [],
        // 内部存储组件的属性
        _store: {},
        _store_arr: []
    }
    $(function () {
        Shelf.scan(Shelf._done)
    })
    window.Shelf = Shelf
}(window, jQuery));



// 注册方法实现
(function (window, $, Shelf) {
    var _store = Shelf._store
    var _store_arr = Shelf._store_arr

    function def(name, op) {

        var opFunc = typeof op === 'function' ? op : null
        var _option = typeof op === 'function' ? op() : op
        var templatePath = _option.templatePath || ""
        var template = _option.template || ""

        _store[name] = {
            templatePath: templatePath,
            template: template,
            url: './',
            creator: function (cont, props) {
                var container = cont ? cont : tNode('<div></div>')
                var option = opFunc ? opFunc() : _option
                var render = option.render || function (props) { return props || {} }
                var init = option.init || function () { }

                var data = render(props)
                var html = insertData(_store[name].template, data)
                var outer = option.outer ? option.outer : {}

                container.innerHTML = html



                // var words = createWords(_store[name].template)
                // console.log(words)
                // var tree = createTree(words)
                // console.log(tree)
                // var content = translateTree(tree)
                // console.log(content)

                var obj = {
                    name: name,
                    template: _store[name].template,
                    data: data,
                    root: container,
                    update: throttle(function () {
                        container.innerHTML = insertData(obj.template, obj.data)
                        init.call(obj, container)
                    }, 100),
                    emit: function (name, argus) {
                        if (typeof outer[name] === 'function') {
                            return outer[name].apply(obj, argus ? argus : [])
                        }
                    },
                    distroy: function () {
                        $(obj.root).remove()
                        delete obj.template
                        delete obj.data
                        delete obj.name
                        delete obj.root
                        delete obj.update
                        delete obj.distroy
                        delete obj.emit
                    }
                }
                init.call(obj, container)
                return obj
            }
        }

        _store_arr.push(_store[name])
    }

    Shelf.define = def
})(window, jQuery, Shelf)








// 只能解析路径，不可以用于解析 url
function path_resolve(from, to) {
    var to_arr = $.trim(to).split('/')
    // 绝对路径的情况
    if (to_arr[0] === '') return to
    if (to_arr[0] === 'http') return to
    if (to_arr[0] === 'https') return to

    var back = 1
    while (to_arr[0] === '..' || to_arr[0] === '.') {
        if (to_arr[0] === '.') {
            to_arr.shift()
            break
        }
        if (to_arr[0] === '..') {
            back++
            to_arr.shift()
        }
    }

    var from_arr = $.trim(from).split('/')

    for (var i = 0; i < back; i++) {
        if (from_arr.length === 0) from_arr.push('..')
        else if (from_arr[from_arr.length - 1] === '..') from_arr.push('..')
        else if (from_arr[from_arr.length - 1] === '.') {
            from_arr.pop()
            from_arr.push('..')
        } else { from_arr.pop() }
    }

    return from_arr.concat(to_arr).join('/')
}

function insertData(template, data) {
    var t = template

    var begin = -1

    t = dealLoop(template, data)
    t = dealIfElse(t, data)
    t = dealAttr(t)
    t = dealStyle(t)

    while ((begin = t.indexOf('${', begin)) >= 0) {
        var end = begin + 2
        var cas = 0
        while (t[end]) {
            if (t[end] === '{') cas++
            if (t[end] === '}' && cas === 0) { break }
            if (t[end] === '}' && cas !== 0) { cas-- }

            end++
        }

        if (end === (t.length - 1)) end = -1
        else end++

        var str = t.substring(begin, end)
        var res = dealDataWithEval(str, data)

        t = t.replace(str, res)
    }

    return t
}

function evalData(__str__, data) {
    try {
        with (data) {
            return eval(__str__.replace(/\&amp\;/g, '&').replace(/\&gt\;/, '>'))
        }
    } catch (e) {
        console.warn('err:' + __str__)
    }
}

function dealDataWithEval(str, data) {
    var t = $.trim(str).replace("${", '')
    var t = t.substr(0,t.length-1)
    return evalData(t, data)
}

// 根据签入的字符串，找到对应的值
function dealData(str, data) {

    var t = $.trim(str).replace("${", '').replace("}", '')

    var val = ''
    var caclu = ''

    // 存在简单的计算表达式
    if (t.indexOf("@eval[") >= 0) {
        var b = t.indexOf("@eval[")
        var e = t.indexOf(']', b)
        var s = t.substring(b, e + 1)
        t = t.replace(s, '')
        caclu = s.slice("@eval[".length, -1)
    }


    // 不存在判断
    if (t.indexOf('?') < 0) val = t.split(".").reduce(function (a, b) { return a[b] }, data)
    // 存在判断
    else {
        var i = t.indexOf('?')
        var condition = t.substring(0, i).split(".").reduce(function (a, b) { return a[b] }, data)
        var res = t.substring(i + 1)
        var ii = res.indexOf(':')
        //不存在 else 情况
        if (ii < 0) val = condition ? res : ''
        //存在 else 情况
        else {
            var tr = res.substring(0, ii)
            var fa = res.substring(ii + 1)
            val = condition ? tr : fa
        }
    }


    // 处理表达式
    if (caclu) {
        if (typeof val === 'string' && /\d+/) { val = parseInt(val) }

        val = eval(caclu)
    }
    return val
}

// 处理循环注释 <!--loop(）-->
function dealLoop(str, data) {
    var t = str
    var headbegin = -1
    while ((headbegin = t.indexOf('<!--loop(', headbegin)) >= 0) {

        headbegin = t.indexOf('<!--loop(', headbegin)

        var headEnd = t.indexOf(')-->', headbegin)
        var tailBegin = t.indexOf('<!--end-->')
        var tailEnd = tailBegin + '<!--end-->'.length

        var head = t.substring(headbegin + 9 /*'<!--loop('.length*/, headEnd)
        var body = t.substring(headEnd + 4 /*')-->'.length*/, tailBegin)
        var all = t.substring(headbegin, tailEnd)

        var target = head.split('.').reduce(function (a, b) { return a[b] }, data)

        var res = target.map(function (v, i) {
            // return body.replace(/\${\s*/g, '${' + head + "." + i).replace(/\$index/g, i).replace(/\$\$index/g, '$index')
            return body
                // .replace(/\${\s*/g, '${' + head + "[" + i + "]")
                .replace(/#item/g, head + "[" + i + "]")
                .replace(/#index/g, i).replace(/##index/g, '#index')
                .replace(/#array/g, head).replace(/##array/g, '#array')

        }).reduce(function (a, b) { return a + b }, '')

        var t = t.replace(all, res)
    }

    return t
}

// 处理条件判断注释 <!--if()-->
function dealIfElse(str, data) {
    // return str
    var t = str
    var headbegin = -1

    while ((headbegin = t.indexOf('<!--if(', headbegin)) >= 0) {

        headbegin = t.indexOf('<!--if(', headbegin)

        var headEnd = t.indexOf(')-->')
        var tailBegin = t.indexOf('<!--finish-->')
        var tailEnd = tailBegin + '<!--finish-->'.length

        var head = t.substring(headbegin + 7 /*'<!--loop('.length*/, headEnd)
        var all = t.substring(headbegin, tailEnd)

        var res = ''
        while (head) {

            if (!evalData(head, data)) {
                var a = t.indexOf('<!--else(', headEnd)
                if (a < 0 || a > tailBegin) {
                    // 所有条件均不满足
                    res = ''
                    break
                } else {
                    // 存在下一个判断
                    headbegin = a
                    headEnd = t.indexOf(')-->', headbegin)
                    var head = t.substring(headbegin + 9 /*'<!--loop('.length*/, headEnd)
                    continue
                }
            } else {
                var ed = t.indexOf('<!--else(', headEnd)
                if (ed < 0 || ed > tailBegin) {
                    // 不存在下个判断
                    ed = tailBegin
                }

                res = t.substring(headEnd + 4 /*')-->'.length*/, ed)

                break
            }
        }
        t = t.replace(all, res)
    }
    return t
}
// 处理 $attr 属性
function dealAttr(str) {
    return str.replace(/\$attr\s*=\s*"--/g, '').replace(/--"/g, '')
}
// 处理 $attr 属性
function dealStyle(str) {
    return str.replace(/\$style\s*=\s*"/g, 'style="')
}
// 节流函数，用于监听滚动
function throttle(fn, delay) {
    var timeout = null
    var PromiseRes = []
    return function () {
        return new Promise(function (res) {
            var _this = this
            PromiseRes.push(res)

            if (timeout) clearTimeout(timeout)

            timeout = setTimeout(function () {
                fn.call(_this, arguments)
                PromiseRes.forEach(function (v) { if (v) v() })
                PromiseRes = []
                timeout = null
            }, delay)
        })
    }
}