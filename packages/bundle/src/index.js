import 'polyfill'

import Validate from 'validate'
import Api from 'api'
import Shelf from 'shelf'
import Msger from 'msger'


function Dom(str) {
    var v = document.createElement('div')
    v.innerHTML = $.trim(str)
    return v.firstChild || document.createElement('span')
}

export {
    Validate, // 验证工具
    Api, // ajax 工具
    Shelf ,// 组件框架
    Msger,
    Dom
}


window.Validate = Validate
window.Api = Api
window.Shelf = Shelf
window.Msger = Msger
window.Dom = Dom