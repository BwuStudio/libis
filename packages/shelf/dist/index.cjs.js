'use strict';

function get (src) {
    return new Promise(function (res, rej) {
        $.ajax({
            type: "get",
            url: src, //需要获取的页面内容
            async: true,
            success: function (data) {
                res(data);
            },
            error: function (data) {
                console.warn('shelf load error: ' + data);
                rej();
            }
        });
    })
}

/**
 *  一个简单的解析模板的词法分析器，用正则实现
 *  输出为一个词数组 
 *  */
var _END_ = '_END_';
var _FINISH_ = '_FINISH_';
var _LOOP_ = '_LOOP_';
var _IF_ = '_IF_';
var _ELSE_ = '_ELSE_';

function createWords(str) {

    var words = [str];
    // deal '<!--end-->' word
    words = words.reduce(function (arr, v) {
        if (typeof v === 'object') arr.push(v);
        else {
            var theWords = v.split('<!--end-->').reduce(function (a, b) {
                if (b !== '') a.push(b);
                a.push({ type: _END_, value: '' });
                return a
            }, []);
            if (theWords.length > 0) theWords.pop();

            arr = arr.concat(theWords);
        }
        return arr
    }, []);
    // deal '<!--finish-->' word
    words = words.reduce(function (arr, v) {
        if (typeof v === 'object') arr.push(v);
        else {
            var theWords = v.split('<!--finish-->').reduce(function (a, b) {
                if (b !== '') a.push(b);
                a.push({ type: _FINISH_, value: '' });
                return a
            }, []);
            if (theWords.length > 0) theWords.pop();

            arr = arr.concat(theWords);
        }
        return arr
    }, []);
    // deal '<!--loop(case)-->' word
    words = words.reduce(function (arr, v) {
        if (typeof v === 'object') arr.push(v);
        else {
            var s = v;
            var headbegin;
            while (s.indexOf('<!--loop(', headbegin) >= 0) {
                var headbegin = s.indexOf('<!--loop(', headbegin);
                var headEnd = s.indexOf(')-->');
                var head = s.substring(headbegin + 9 /*'<!--loop('.length*/, headEnd);
                arr.push(s.substring(0, headbegin));
                arr.push({ type: _LOOP_, value: head });
                s = s.substring(headEnd + 4);
            }
            arr.push(s);
        }
        return arr
    }, []);

    // deal '<!--if(case)-->' word
    words = words.reduce(function (arr, v) {
        if (typeof v === 'object') arr.push(v);
        else {
            var s = v;
            var headbegin;
            while (s.indexOf('<!--if(', headbegin) >= 0) {
                var headbegin = s.indexOf('<!--if(', headbegin);
                var headEnd = s.indexOf(')-->');
                var head = s.substring(headbegin + 7 /*'<!--if('.length*/, headEnd);
                arr.push(s.substring(0, headbegin));
                arr.push({ type: _IF_, value: head });
                s = s.substring(headEnd + 4);
            }
            arr.push(s);
        }
        return arr
    }, []);

    // deal '<!--else(case)-->' word
    words = words.reduce(function (arr, v) {
        if (typeof v === 'object') arr.push(v);
        else {
            var s = v;
            while (s.indexOf('<!--else(', headbegin) >= 0) {
                var headbegin = s.indexOf('<!--else(', headbegin);
                var headEnd = s.indexOf(')-->');
                var head = s.substring(headbegin + 9 /*'<!--else('.length*/, headEnd);
                arr.push(s.substring(0, headbegin));
                arr.push({ type: _ELSE_, value: head });
                s = s.substring(headEnd + 4);
            }
            arr.push(s);
        }
        return arr
    }, []);

    return words
}

/**
 *  一个简单的解析模板的语法分析器
 *  */
var _END_$1 = '_END_';
var _FINISH_$1 = '_FINISH_';
var _LOOP_$1 = '_LOOP_';
var _IF_$1 = '_IF_';
var _ELSE_$1 = '_ELSE_';

var _QUEUE_ = '_QUEUE_';
var _IF_BLOCK_ = '_IF_BLOCK_';
var _IF_CASE_ = '_IF_CASE_';
var _LOOP_CASE_ = '_LOOP_TREE_';

function createTree(words) {
    function newQueue() { return { type: _QUEUE_, queue: [] } }
    function newIf() { return { type: _IF_BLOCK_, ifCaseArr: [] } }
    function newIf_case(condition) { return { type: _IF_CASE_, condition: condition, queue: [] } }
    function newLoop(array) { return { type: _LOOP_CASE_, array: array, queue: [] } }

    var main = newQueue();
    var stack = {
        _arr: [main],
        top: main,
        push: function (item) {
            this._arr.push(item);
            this.top = item;
        },
        pop: function () {
            this._arr.pop();
            this.top = this._arr[this._arr.length - 1];
        }
    };

    var err = '';

    words.find(function (v) {
        if (typeof v === 'string') {
            if (!stack.top || !stack.top.queue) {
                return err = '解析模板错误'
            } else {
                stack.top.queue.push(v);
            }
        } else if (v && v.type === _IF_$1) {
            var a = newIf();
            var b = newIf_case(v.value);

            a.ifCaseArr.push(b);

            if (!stack.top || !stack.top.queue) {
                return err = '解析模板错误'
            } else {
                stack.top.queue.push(a);
                stack.push(a);
                stack.push(b);
            }
        } else if (v && v.type === _ELSE_$1) {
            var b = newIf_case(v.value);

            stack.pop();
            if (!stack.top || !stack.top.ifCaseArr) {
                return err = '解析模板错误'
            } else {
                stack.top.ifCaseArr.push(b);
                stack.push(b);
            }
        } else if (v && v.type === _FINISH_$1) {
            if (stack.top.type !== _IF_CASE_) return err = '解析模板错误'
            stack.pop();
            if (stack.top.type !== _IF_BLOCK_) return err = '解析模板错误'
            stack.pop();
        } else if (v && v.type === _LOOP_$1) {
            var b = newLoop(v.value);

            if (!stack.top || !stack.top.queue) {
                return err = '解析模板错误'
            } else {
                stack.top.queue.push(b);
                stack.push(b);
            }
        } else if (v && v.type === _END_$1) {
            if (!stack.top || (stack.top.type !== _LOOP_CASE_)) {
                return err = '解析模板错误'
            } else {
                stack.pop();
            }
        }
    });

    if (err) console.warn(err);

    else return main
}

function translateTree(item) {
    if (item && item.type === _QUEUE_) {
        item.queue = item.queue.map(function (v) {
            return translateTree(v)
        });
        return item
    } else if (item && item.type === _IF_BLOCK_) {
        item.ifCaseArr = item.ifCaseArr.map(function (v) {
            return translateTree(v)
        });
        return item
    } else if (item && item.type === _IF_CASE_) {
        item.queue = item.queue.map(function (v) {
            return translateTree(v)
        });
        return item
    } else if (item && item.type === _LOOP_CASE_) {
        item.queue = item.queue.map(function (v) {
            return translateTree(v)
        });
        return item
    } else if (typeof item === 'string') {
        return createContent(item)
    }
}


/**
 *  从语法树中取去模板字符串
 *  */
var _CONTENT_ = '_CONTENT_';
var _DATA_ = '_DATA_';

function createContent(str) {
    function newData(data) {
        return {
            type: _DATA_,
            data: data
        }
    }
    var content = {
        type: _CONTENT_,
        queue: []
    };

    var s = str;
    var begin = -1;
    while ((begin = s.indexOf('${')) >= 0) {
        content.queue.push(s.substring(0, begin));
        var rest = s.substring(begin);
        var end = rest.indexOf('}');
        if (end < 0) {
            content.queue.push(rest);
            break
        }
        var data = rest.substring(2, end);
        content.queue.push(newData(data));
        s = rest.substring(end + 1);
    }
    content.queue.push(s);

    return content
}

function parse (str) {
    var words = createWords(str);
    // console.log(words)
    var tree = createTree(words);
    // console.log(tree)
    var content = translateTree(tree);
    // console.log(content)
    return content
}

var _CONTENT_$1 = '_CONTENT_';
var _DATA_$1 = '_DATA_';


var _QUEUE_$1 = '_QUEUE_';
var _IF_BLOCK_$1 = '_IF_BLOCK_';
var _IF_CASE_$1 = '_IF_CASE_';
var _LOOP_CASE_$1 = '_LOOP_TREE_';


// 解决严格模式不能用 with 语句的问题
var evalData = new Function('__str__', 'data',
    'try {' +
    'with (data) {' +
    'return eval(__str__.replace(/\\&amp\\;/g, "&").replace(/\\&gt\\;/, ">"))' +
    '}' +
    '} catch (e) {' +
    'console.warn("err:" + __str__)' +
    '}'
);

window.evalData = evalData;

function load(v, data) {

    if (!v) return ''

    if (typeof v === 'string') return v

    if (v instanceof Array) return v.map(function (v) { return load(v, data) }).join('')

    switch (v.type) {

        case _CONTENT_$1: return load(v.queue, data)

        case _QUEUE_$1: return load(v.queue, data)

        case _DATA_$1: return evalData(v.data, data)

        case _IF_BLOCK_$1:
            var r = v.ifCaseArr.find(function (cas) {
                if (cas.type !== _IF_CASE_$1) throw new Error('shelf parse error')
                if (evalData(cas.condition, data)) return true
                else return false;
            });

            if (r) return load(r.queue, data)
            else return ''

        case _LOOP_CASE_$1:
            var arr = evalData(v.array, data);
            if (!(arr instanceof Array)) throw new Error('shelf parse error')

            return arr.map(function (item, index, array) {
                return load(v.queue, $.extend({}, data, { _index: index, _item: item, _array: array }))
            }).join('')
    }
}

var template = {
    get:get,
    parse:parse,
    load:load
};

function scan (store) {

    function getCmpt(name) { return store.find(function (v) { return v.name === name }) }
    // 将 url 信息添加到组件
    $('script').get().filter(function (v) {
        return /^shelf-/.test(v.className)
    }).map(function (v) {
        var src = v.src;
        var name = v.className.match(/^shelf-(\w*)/)[1];
        if (getCmpt(name)) { getCmpt(name).url = src; }
    });

    // 通过 ajax 获取外部的组件模板
    return new Promise(function (res) {
        Promise.all(
            store.filter(function (v) {
                return v.path
            }).map(function (v) {
                return {
                    name: v.name,
                    url: path_resolve(v.url, v.path)
                }
            }).map(function (v) {
                return new Promise(function (res, rej) {
                    template.get(v.url).then(function (data) {
                        getCmpt(v.name).template = template.parse(data);
                        res();
                    })['catch'](function (e) {
                        rej('shelf load error' + e ? (':' + e) : '!');
                    });
                })
            })
        )['finally'](function () {
            res();
        });
    })

}


// 只能解析路径，不可以用于解析 url
function path_resolve(from, to) {
    var to_arr = $.trim(to).split('/');
    // 绝对路径的情况
    if (to_arr[0] === '') return to
    if (to_arr[0] === 'http') return to
    if (to_arr[0] === 'https') return to

    var back = 1;
    while (to_arr[0] === '..' || to_arr[0] === '.') {
        if (to_arr[0] === '.') {
            to_arr.shift();
            break
        }
        if (to_arr[0] === '..') {
            back++;
            to_arr.shift();
        }
    }

    var from_arr = $.trim(from).split('/');

    for (var i = 0; i < back; i++) {
        if (from_arr.length === 0) from_arr.push('..');
        else if (from_arr[from_arr.length - 1] === '..') from_arr.push('..');
        else if (from_arr[from_arr.length - 1] === '.') {
            from_arr.pop();
            from_arr.push('..');
        } else { from_arr.pop(); }
    }

    return from_arr.concat(to_arr).join('/')
}

var load$1 = template.load;

function dom(str) {
    var v = document.createElement('div');
    v.innerHTML = $.trim(str);
    return v.firstChild
}
// 节流函数，用于监听滚动
function throttle(fn, delay) {
    var timeout = null;
    var PromiseRes = [];
    return function () {
        return new Promise(function (res) {
            var _this = this;
            PromiseRes.push(res);

            if (timeout) clearTimeout(timeout);

            timeout = setTimeout(function () {
                fn.call(_this, arguments);
                PromiseRes.forEach(function (v) { if (v) v(); });
                PromiseRes = [];
                timeout = null;
            }, delay);
        })
    }
}

function common(op, component, store) {
    var option = $.extend({}, op);

    console.log(option);

    var name = option.name;
    var path = option.path;
    var template = option.template;
    var $static = option.static || {};

    console.log($static);

    var cmptClass = component;

    if (!name) return
    if (!template && !path) return
    if (!(typeof cmptClass === 'function')) return

    return {
        name: name,
        path: path,
        creator: $.extend(
            function (container, props) {
                var cntr = container || dom('<div></div>');
                var option = cmptClass() || {};
                var cmpt = store.find(function (v) { return v.name === name });
                var template = cmpt ? cmpt.template ? cmpt.template : [] : [];

                var render = option.render || function (props) { return props || {} };
                var init = option.init || function () { };

                var data = render(props);
                var html = load$1(template, data);
                var outer = option.outer || {};

                var obj = {
                    name: name,
                    data: data,
                    root: cntr,
                    template: template,
                    update: throttle(function () {
                        $(cntr).children().get().forEach(function (v) {
                            cntr.removeChild(v);
                        });
                        cntr.innerHTML = load$1(obj.template, obj.data);
                        init.call(obj, cntr);
                    }, 100),
                    emit: function (name, argus) {
                        if (typeof outer[name] === 'function') {
                            return outer[name].apply(obj, argus ? argus : [])
                        }
                    },
                    destroy: function () {
                        $(obj.root).remove();
                        delete obj.template;
                        delete obj.data;
                        delete obj.name;
                        delete obj.root;
                        delete obj.update;
                        delete obj.destroy;
                        delete obj.emit;
                    }
                };
                $(cntr).children().get().forEach(function (v) {
                    cntr.removeChild(v);
                });
                cntr.innerHTML = html;
                init.call(obj, cntr);
                return obj
            },
            $static
        )
    }
}

function define (store) {
    return {
        defineWithPath: function (name, path, cmptClass) {
            var cmpt = common({ name: name, path: path }, cmptClass, store);
            if (cmpt) store.push(cmpt);
        },
        defineWithStaticAttr: function (cmptClass) {
            var cmpt = common({ name: cmptClass.name, path: cmptClass.path, template: cmptClass.template }, cmptClass, store);
            if (cmpt) store.push(cmpt);
        },
        defineCommon: function (op, component) {
            var cmpt = common(op, component, store);
            if (cmpt) store.push(cmpt);
        }
    }
}

var store = [];
var task = [];
var defFunc = define(store);


var Shelf = {
    template: template,

    define: defFunc.defineCommon,

    get: function (name) { 
        var cmpt = store.find(function (v) { return v.name === name });
        if(cmpt) return cmpt.creator
        else throw new Error("Can't find the component named '"+name+"'!")
    },

    done: function (cb) {
        if (task) {
            if(cb) task.push(cb);
            
            return new Promise(function(res,rej){
                task.push(res);
            })
        }
        else {
            if(cb) cb();
            return new Promise(function(res,rej){
                res();
            })
        }
        
    },

    _:{
        store:function(){return store},
        task:function(){return task}
    }
};

$(function () {
    scan(store).then(function () {
        // 加载完成则调用 task 上所有挂载的任务 
        if (task) task.forEach(function (cb) { cb(); });
        // 不需要 task 去存储任务
        task = null;
    });
});

module.exports = Shelf;
//# sourceMappingURL=index.cjs.js.map
