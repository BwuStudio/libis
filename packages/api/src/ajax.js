function Dom(str) {
    var v = document.createElement('div')
    v.innerHTML = $.trim(str)
    return v.firstChild
}

if (!$('#loading_bar').get(0)) {
    $(function () {
        $('body').get(0).appendChild(Dom('<div style="display:none" id = "loading_bar"><div></div></div>'))
    })
}
// 通用的 ajax 方法，添加了异常处理逻辑
var task = 0
export default function ajax(op) {
    task += 1
    $('#loading_bar').get(0).style.top = 0
    return new Promise(function (res, rej) {
        $.ajax($.extend({
            type: "get",
            url: '',
            async: true,
            success: function (data) {
                try {
                    var ms = JSON.parse(data)
                    if (ms.Code === 0 || ms.Code === "0") {
                        res(ms.Data)
                    } else {
                        rej(ms.Desc)
                    }
                }
                catch (e) { rej(data) }
            },
            error: function (data) {
                rej(data)
            },
            complete: function () {
                if (task <= 1) {
                    task = 0
                    $('#loading_bar').get(0).style.top = '-2px'
                } else {
                    task--
                }
            }
        }, op));
    })
}