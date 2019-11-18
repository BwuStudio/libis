import 'polyfill'
import 'style'

import Validate from 'validate'
import Api from 'api'
import Shelf from 'shelf'
import Msger from 'msger'


function Dom(str, fn) {
    var v = null // parentNode
    var e = null // resultNode
    if (/^\s*<\s*tr\s*/.test(str)) {
        v = document.createElement('table')
        v.innerHTML = $.trim(str)
        e = $(v).find('tr').get(0) || document.createElement('tr')
    } else if (/^\s*<\s*td\s*/.test(str)) {
        v = document.createElement('tr')
        v.innerHTML = $.trim(str)
        e = $(v).find('td').get(0) || document.createElement('td')
    } else if (/^\s*<\s*li\s*/.test(str)) {
        v = document.createElement('ul')
        v.innerHTML = $.trim(str)
        e = $(v).find('li').get(0) || document.createElement('li')
    } else if (/^\s*<\s*option\s*/.test(str)) {
        v = document.createElement('select')
        v.innerHTML = $.trim(str)
        e = $(v).find('option').get(0) || document.createElement('option')
    } else{
        v = document.createElement('div')
        v.innerHTML = $.trim(str)
        e = v.firstChild || document.createElement('span')
    }
    if (fn) { fn(e) }
    return e
}

var Tool = {
    newId: function (prefix, format) {
        var p = prefix || ''
        var f = format || '550e8400-e29b-41d4-a716-446655440000'
        var a = '0123456789ABCDEF'
        return p + f.split('').map(function (v) { return v === '-' ? '-' : a[Math.floor(Math.random() * a.length)] }).join('')
    },
    getUrlParam: function (name) {//封装方法
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return window.decodeURIComponent(r[2]);
        return null; //返回参数值
    }
}

export {
    Validate, // 验证工具
    Api, // ajax 工具
    Shelf,// 组件框架
    Msger,
    Dom,
    Tool
}


window.Validate = Validate
window.Api = Api
window.Shelf = Shelf
window.Msger = Msger
window.Dom = Dom
window.Tool = Tool