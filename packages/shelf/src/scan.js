import template from './template/index'

export default function (store) {

    function getCmpt(name) { return store.find(function (v) { return v.name === name }) }
    // 将 url 信息添加到组件
    $('script').get().filter(function (v) {
        return /^shelf-/.test(v.className)
    }).map(function (v) {
        var src = v.src
        var name = v.className.match(/^shelf-(\w*)/)[1]
        if (getCmpt(name)) { getCmpt(name).url = src }
    })

    // 通过 ajax 获取外部的组件模板
    return new Promise(function (res) {
        Promise.all(
            store.filter(function (v) {
                return v.path
            }).map(function (v) {
                return {
                    name: v.name,
                    url: path_resolve(v.url, v.path)
                }
            }).map(function (v) {
                return new Promise(function (res, rej) {
                    template.get(v.url).then(function (data) {
                        getCmpt(v.name).template = template.parse(data)
                        res()
                    })['catch'](function (e) {
                        rej('shelf load error' + e ? (':' + e) : '!')
                    })
                })
            })
        )['finally'](function () {
            res()
        })
    })

}


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