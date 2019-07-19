# Msger.js

## 介绍
`Msger.js` 是用于全局事件管理的库，主要用于规范跨页面的数据通讯方式。

## 引用
通过 `/libis/packages/msger/dist/index.umd.js` 加载

如果引入了 `/libis/packages/bundle/dist/index.umd`，则不需要单独引用此 js 文件

## 起步

### 注册事件
调用全局的 `Msger` 函数，获取当前页面的对象实例，调用其 `regist` 方法进行注册，需要的参数为事件名称以及对应的回调函数。

由于 `regist` 方法的返回结果为此对象实例本身，所以可以通过链式调用注册多个事件。
``` javaScript
Msger()
    .regist('init', function () {})
    .regist('loadPersonInfo', function (name) {
        // do some thing ...
    })
    .regist('getPersonInfo', function (name) {
        // do some thing ...
        return 'some info'
    })
```
### 销毁事件
调用全局的 `Msger` 函数，获取当前页面的对象实例，调用其 `cancel` 方法进行注册，所需要的参数为所需要销毁的事件名称。

同样 `cancel` 方法的返回结果也是此对象实例本身。

### 触发事件
调用全局的 `Msger` 函数，获取当前页面的对象实例，调用其 `emit` 方法并传入事件名以及对应的参数数组，触发相应的事件，并返回所注册的回调函数的执行结果。
``` javaScript
// 触发事件
Msger().emit('init')
// 触发事件，传入参数并得到执行结果
var infor = Msger().emit('getPersonInfo',['张三'])
```

### 跨页面触发事件
当调用 `Msger` 函数时传入其他页面（比如父页面，或者其他 iframe 页面）的 window 对象或 iframe 元素，可以获取相应页面的对象实例，并触发其已注册的事件。

``` javaScript
// 触发父页面的事件
Msger(window.top).emit('reloadPersonData',['张三'])

// 触发子页面的事件
var a = document.getElementById('children_iframe1').contentWindow
Msger(a).emit('reloadPersonData',['张三'])

// 直接将 iframe 元素作为参数也是可行的 
var b = document.getElementById('children_iframe2')
```
> 注意事项：
> 1. 对应的页面需要与当前在同一个域下
> 2. 对应页面必须同样引用 Msger.js
> 3. 只能触发其他页面的事件，而不能对其他页面进行注册/销毁事件的操作
