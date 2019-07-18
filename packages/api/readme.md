# Api

## 介绍
Api.js 是一个金额口

## 引入
通过 `/libis/packages/api/dist/index.umd.js` 加载
如果引入了 `/libis/packages/bundle/dist/index.umd`，则不需要单独引用此 js 文件

## 概览
### 生成实例
`Api` 为构造函数，接受一个回调函数，其入参为 ajax 工具类（api 结构类似于 jQery $.ajax）,返回值为一个 Map 结构的对象，其值为调用 ajax 的函数。
```
 var api = Api(function (ajax) {
    return {
        getPersonList: function () {
            return ajax({
                type: 'get',
                url: '/gbrm/api/getPersonList'
            })
        },
        getPersonDetail: function (id) {
            return ajax({
                type: 'get',
                data: { id: id }
                url: '/gbrm/api/getPersonList'
            })
        }
    }
})
```
### 调用接口
通过调用 `api` 实例上的函数，访问后台接口，其返回值为一个包含返回结果的 Promise 对象。
```
ajax.getPersonDetail('bwuning')
    .then(function(data){console.log(data.name)}) 
```

## Promise 对象
Q1：什么是 Promise？

A1：Promise 为 JavaScript 标准库所提供的一套用于异步流程管理的 Api，详细情况可参考文档   [Promise - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Q2：为什么返回 Promise ，而非 jQuery 回调函数的方式？

A2：Promise 是一套专门关于异步控制的 Api，相比传统的回调函数，能有效控制多个异步任务。
```
var api = Api(function (ajax) {
    return {
        api1: function () {
            return ajax({type: 'get',url: '/api1'})
        },
        api2: function () {
            return ajax({type: 'get',url: '/api2'})
        },
        // 同时调用 api1,api2,等两个 ajax 都完成后，返回结果
        api3: function(){
            return Promise.all([
                this.api1(),
                this.api2()
            ])
        },
        // 先调用 api1,完成后再调用 api2，相比回调的方式避免嵌套结构
        api4:function(){
            return api.api1().then(function(data){
                return api.api2()
            })
        },
        // 不仅可以处理异步任务，同样可以处理同步任务（比如数据结构的转换）
        api5:function(){
            return  ajax({type: 'get',url: '/api2'}).then(function(v){
                return v.username
            })
        }
    }
})
```

Q3：使用 Promise 的时候有什么主意事项？ 

A3：由于 `Promise` 的两个方法 `catch` `finally` 使用到了 ie8 的关键字，所以当使用这两个方法的时候，需要用字面量的方式
```
// 不兼容 ie8
promise().catch(function(err){alert(err)})
// 兼容 ie8 的方式
promise()['catch'](function(err){alert(err)})
```
