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
    Shelf,// 组件框架
    Msger,
    Dom
}


window.Entry = function (arr, obj) {
    var array = arr || []
    var target = obj || window

    array.forEach(function (v) {
        switch (v) {
            case 'Validate': target.Validate = Validate
                break
            case 'Api': target.Api = Api
                break
            case 'Shelf': target.Shelf = Shelf
                break
            case 'Msger': target.Msger = Msger
                break
            case 'Dom': target.Dom = Dom
                break
        }

    })

    return target
}