import template from './template/index'

var load = template.load

function dom(str) {
    var v = document.createElement('div')
    v.innerHTML = $.trim(str)
    return v.firstChild
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

function common(op, component, store) {
    var option = $.extend({}, op)

    console.log(option)

    var name = option.name
    var path = option.path
    var template = option.template
    var $static = option.static || {}

    console.log($static)

    var cmptClass = component

    if (!name) return
    if (!template && !path) return
    if (!(typeof cmptClass === 'function')) return

    return {
        name: name,
        path: path,
        creator: $.extend(
            function (container, props) {
                var cntr = container || dom('<div></div>')
                var option = cmptClass() || {}
                var cmpt = store.find(function (v) { return v.name === name })
                var template = cmpt ? cmpt.template ? cmpt.template : [] : []

                var render = option.render || function (props) { return props || {} }
                var init = option.init || function () { }

                var data = render(props)
                var html = load(template, data)
                var outer = option.outer || {}

                var obj = {
                    name: name,
                    data: data,
                    root: cntr,
                    template: template,
                    update: throttle(function () {
                        $(cntr).children().get().forEach(function (v) {
                            cntr.removeChild(v)
                        })
                        cntr.innerHTML = load(obj.template, obj.data)
                        init.call(obj, cntr)
                    }, 100),
                    emit: function (name, argus) {
                        if (typeof outer[name] === 'function') {
                            return outer[name].apply(obj, argus ? argus : [])
                        }
                    },
                    destroy: function () {
                        $(obj.root).remove()
                        delete obj.template
                        delete obj.data
                        delete obj.name
                        delete obj.root
                        delete obj.update
                        delete obj.destroy
                        delete obj.emit
                    }
                }
                $(cntr).children().get().forEach(function (v) {
                    cntr.removeChild(v)
                })
                cntr.innerHTML = html
                init.call(obj, cntr)
                return obj
            },
            $static
        )
    }
}

export default function (store) {
    return {
        defineWithPath: function (name, path, cmptClass) {
            var cmpt = common({ name: name, path: path }, cmptClass, store)
            if (cmpt) store.push(cmpt)
        },
        defineWithStaticAttr: function (cmptClass) {
            var cmpt = common({ name: cmptClass.name, path: cmptClass.path, template: cmptClass.template }, cmptClass, store)
            if (cmpt) store.push(cmpt)
        },
        defineCommon: function (op, component) {
            var cmpt = common(op, component, store)
            if (cmpt) store.push(cmpt)
        }
    }
}