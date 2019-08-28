
export default function(str, fn) {
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

