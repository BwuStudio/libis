export default function (src) {
    return new Promise(function (res, rej) {
        $.ajax({
            type: "get",
            url: src, //需要获取的页面内容
            async: true,
            success: function (data) {
                res(data)
            },
            error: function (data) {
                console.warn('shelf load error: ' + data)
                rej()
            }
        })
    })
}