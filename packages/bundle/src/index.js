import 'polyfill'
import 'style'

import Validate from 'validate'
import Api from 'api'
import Shelf from 'shelf'
import Msger from 'msger'


function Dom(str, fn) {
    var v = null // parentNode
    var e = null // resultNode
    if (/^\s*<\s*tr\s*/.test(str)){
        v = document.createElement('table')
        v.innerHTML = $.trim(str)
        e = $(v).find('tr').get(0) || document.createElement('tr')
    }else{
        v = document.createElement('div')
        v.innerHTML = $.trim(str)
        e = v.firstChild || document.createElement('span')
    }
    if (fn) { fn(e) }
    return e
}

export {
    Validate, // 验证工具
    Api, // ajax 工具
    Shelf,// 组件框架
    Msger,
    Dom
}


window.Validate = Validate
window.Api = Api
window.Shelf = Shelf
window.Msger = Msger
window.Dom = Dom