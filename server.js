// 引入koa
const koa = require('koa');
const path = require('path')
const static = require('koa-static');


const app = new koa();


var cors = require('koa2-cors');
app.use(cors());

// 配置静态web服务的中间件
app.use(static(path.resolve(__dirname, './')));
// 监听端口
app.listen(3001, function () {
    console.log('启动成功');
})


function transfrom(array) {
    array.forEach(function (v) {
        if (v.BZ && v.BZ.indexOf('老工勤')>= 0) {
            v.Order = 0
            return
        }
        if (v.BZ && v.BZ.indexOf('职工') >= 0) {
            v.Order = 1
            return
        }
        if (v.BZ && v.BZ.indexOf('公务员') >= 0) {
            v.Order = 2
            return
        }
        if (v.Text && v.Text.indexOf('下属事业单位') >= 0) {
            v.Order = 3
            return
        }
        if (v.Text && v.Text.indexOf('下设单位') >= 0) {
            v.Order = 4
            return
        }
        if (v.Text && v.Text.indexOf('本级人员') >= 0) {
            v.Order = 5
            return
        }
    
        v.Order = 6
    })

    var map = {}

    var arr = []

    array.forEach(function (v) {
        
        if (v.PidStr && map[v.PidStr])
            map[v.PidStr].children.push(v)
        else if (v.PidStr) map[v.PidStr] = { children: [v] }
        else arr.push(v)
        
        if (map[v.BidStr]) {
            v.children = map[v.BidStr].children
            map[v.BidStr] = v
        } else {
            map[v.BidStr] = v
            map[v.BidStr].children = []
        }

    })

    arr = map['00000000-0000-0000-0000-000000000000'].children.concat(arr)

    function sort(arr){
        
        arr.forEach(function(v){
            if(v.children) v.children = sort(v.children)
        })

        return arr.sort(function(a,b){ return b.Order - a.Order })
    }

    return sort(arr)
}
var a = new FormData()
a.append('data', JSON.stringify({ "BZ": "1,6,7" }))

fetch('/RSGL/Report/GetOrgBianZhiList.do', {
    method: "post",
    body: a
}).then(function (d) {
    return d.json()
}).then(function (v) {
    var m = transfrom(v)
    console.log(m)
    mini.get('TreeGrid').loadData(m)
})


