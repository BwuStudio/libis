'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Msger = _interopDefault(require('msger'));

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var polyfill_esm = createCommonjsModule(function (module, exports) {
// Array.prototype polifill
(function (window, Array) {
    if (!Array.prototype.map) {
      Array.prototype.map = function (call, thisArg) {
        if (typeof call !== 'function') throw new TypeError("not a function")
  
        var _this = thisArg === undefined ? window : thisArg;
        var res = [];
        for (var i = 0; i < this.length; i++) {
          var e = this[i];
          res.push(call.call(_this, e, i, this));
        }
        return res
      }; 
    }
  
    if (!Array.prototype.forEach) {
      Array.prototype.forEach = function (call, thisArg) {
        this.map(call, thisArg);
      };
    }
  
    if (!Array.prototype.filter) {
  
      Array.prototype.filter = function (call, thisArg) {
        if (typeof call !== 'function') throw new TypeError("not a function")
  
        var _this = thisArg === undefined ? window : thisArg;
        var res = [];
        for (var i = 0; i < this.length; i++) {
          var e = this[i];
          if (call.call(_this, e, i, this)) {
            res.push(e);
          }
        }
        return res
      };
    }
  
    if (!Array.prototype.find) {
      Array.prototype.find = function (call, thisArg) {
        if (typeof call !== 'function') throw new TypeError("not a function")
  
        var _this = thisArg === undefined ? window : thisArg;
        var res = undefined;
  
        for (var i = 0; i < this.length; i++) {
          var e = this[i];
          if (call.call(_this, e, i, this)) {
            res = e;
            break
          }
        }
        return res
      };
    }
  
    if (!Array.prototype.every) {
      Array.prototype.every = function (call, thisArg) {
        if (typeof call !== 'function') throw new TypeError("not a function")
  
        var _this = thisArg === undefined ? window : thisArg;
        var res = true;
  
        for (var i = 0; i < this.length; i++) {
          var e = this[i];
          if (!call.call(_this, e, i, this)) {
            res = false;
            break
          }
        }
        return res
      };
    }
  
    if (!Array.prototype.some) {
      Array.prototype.some = function (call, thisArg) {
        if (typeof call !== 'function') throw new TypeError("not a function")
  
        var _this = thisArg === undefined ? window : thisArg;
        var res = false;
  
        for (var i = 0; i < this.length; i++) {
          var e = this[i];
          if (call.call(_this, e, i, this)) {
            res = true;
            break
          }
        }
        return res
      };
    }
  
    if (!Array.prototype.flat) {
  
      Array.prototype.flat = function (depth) {
  
        if (depth && typeof depth !== 'number') throw 'type error : flat need number'
        return flat(this, depth ? depth : 1)
      };
  
      function flat(arr, depth) {
        if (depth <= 0) return arr
        if (!arr.some(function (a) { return a instanceof Array })) return arr
  
        var res = [];
  
        arr.forEach(function (a) {
          if (a instanceof Array) {
            a.forEach(function (v) { res.push(v); });
          } else {
            res.push(a);
          }
        });
  
        return flat(res, depth--)
      }
    }
  
    if (!Array.prototype.reduce) {
  
      Array.prototype.reduce = function (call, init) {
        if (typeof call !== 'function') throw new TypeError("not a function")
  
        if (arguments.length > 1) {
          var res = init;
          for (var i = 0; i < this.length; i++) {
            var e = this[i];
            res = call(res, e, i, this);
          }
          return res
        } else {
          if (this.length < 1) throw 'Reduce of empty array with no initial value'
          var res = this[0];
          for (var i = 1; i < this.length; i++) {
            var e = this[i];
            res = call(res, e, i, this);
          }
          return res
        }
      };
    }
  
    if (!Array.prototype.fill) {
  
      Array.prototype.fill = function (value) {
        for (var i = 0; i < this.length; i++) {
          this[i] = value;
        }
        return this
      };
  
    }
  })(window||{}, Array||{});

(function (global, factory) {
     factory() ;
  }(null, (function () {
  
    /**
     * @this {Promise}
     */
    function finallyConstructor(callback) {
      var constructor = this.constructor;
      return this.then(
        function (value) {
          return constructor.resolve(callback()).then(function () {
            return value;
          });
        },
        function (reason) {
          return constructor.resolve(callback()).then(function () {
            return constructor.reject(reason);
          });
        }
      );
    }
  
    // Store setTimeout reference so promise-polyfill will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var setTimeoutFunc = setTimeout;
  
    function noop() { }
  
    // Polyfill for Function.prototype.bind
    function bind(fn, thisArg) {
      return function () {
        fn.apply(thisArg, arguments);
      };
    }
  
    /**
     * @constructor
     * @param {Function} fn
     */
    function Promise(fn) {
      if (!(this instanceof Promise))
        throw new TypeError('Promises must be constructed via new');
      if (typeof fn !== 'function') throw new TypeError('not a function');
      /** @type {!number} */
      this._state = 0;
      /** @type {!boolean} */
      this._handled = false;
      /** @type {Promise|undefined} */
      this._value = undefined;
      /** @type {!Array<!Function>} */
      this._deferreds = [];
  
      doResolve(fn, this);
    }
  
    function handle(self, deferred) {
      while (self._state === 3) {
        self = self._value;
      }
      if (self._state === 0) {
        self._deferreds.push(deferred);
        return;
      }
      self._handled = true;
      Promise._immediateFn(function () {
        var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
          (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
          return;
        }
        var ret;
        try {
          ret = cb(self._value);
        } catch (e) {
          reject(deferred.promise, e);
          return;
        }
        resolve(deferred.promise, ret);
      });
    }
  
    function resolve(self, newValue) {
      try {
        // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === self)
          throw new TypeError('A promise cannot be resolved with itself.');
        if (
          newValue &&
          (typeof newValue === 'object' || typeof newValue === 'function')
        ) {
          var then = newValue.then;
          if (newValue instanceof Promise) {
            self._state = 3;
            self._value = newValue;
            finale(self);
            return;
          } else if (typeof then === 'function') {
            doResolve(bind(then, newValue), self);
            return;
          }
        }
        self._state = 1;
        self._value = newValue;
        finale(self);
      } catch (e) {
        reject(self, e);
      }
    }
  
    function reject(self, newValue) {
      self._state = 2;
      self._value = newValue;
      finale(self);
    }
  
    function finale(self) {
      if (self._state === 2 && self._deferreds.length === 0) {
        Promise._immediateFn(function () {
          if (!self._handled) {
            Promise._unhandledRejectionFn(self._value);
          }
        });
      }
  
      for (var i = 0, len = self._deferreds.length; i < len; i++) {
        handle(self, self._deferreds[i]);
      }
      self._deferreds = null;
    }
  
    /**
     * @constructor
     */
    function Handler(onFulfilled, onRejected, promise) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.promise = promise;
    }
  
    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */
    function doResolve(fn, self) {
      var done = false;
      try {
        fn(
          function (value) {
            if (done) return;
            done = true;
            resolve(self, value);
          },
          function (reason) {
            if (done) return;
            done = true;
            reject(self, reason);
          }
        );
      } catch (ex) {
        if (done) return;
        done = true;
        reject(self, ex);
      }
    }
  
    Promise.prototype['catch'] = function (onRejected) {
      return this.then(null, onRejected);
    };
  
    Promise.prototype.then = function (onFulfilled, onRejected) {
      // @ts-ignore
      var prom = new this.constructor(noop);
  
      handle(this, new Handler(onFulfilled, onRejected, prom));
      return prom;
    };
  
    Promise.prototype['finally'] = finallyConstructor;
  
    Promise.all = function (arr) {
      return new Promise(function (resolve, reject) {
        if (!arr || typeof arr.length === 'undefined')
          throw new TypeError('Promise.all accepts an array');
        var args = Array.prototype.slice.call(arr);
        if (args.length === 0) return resolve([]);
        var remaining = args.length;
  
        function res(i, val) {
          try {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
              var then = val.then;
              if (typeof then === 'function') {
                then.call(
                  val,
                  function (val) {
                    res(i, val);
                  },
                  reject
                );
                return;
              }
            }
            args[i] = val;
            if (--remaining === 0) {
              resolve(args);
            }
          } catch (ex) {
            reject(ex);
          }
        }
  
        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };
  
    Promise.resolve = function (value) {
      if (value && typeof value === 'object' && value.constructor === Promise) {
        return value;
      }
  
      return new Promise(function (resolve) {
        resolve(value);
      });
    };
  
    Promise.reject = function (value) {
      return new Promise(function (resolve, reject) {
        reject(value);
      });
    };
  
    Promise.race = function (values) {
      return new Promise(function (resolve, reject) {
        for (var i = 0, len = values.length; i < len; i++) {
          values[i].then(resolve, reject);
        }
      });
    };
  
    // Use polyfill for setImmediate for performance gains
    Promise._immediateFn =
      (typeof setImmediate === 'function' &&
        function (fn) {
          setImmediate(fn);
        }) ||
      function (fn) {
        setTimeoutFunc(fn, 0);
      };
  
    Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
      if (typeof console !== 'undefined' && console) {
        console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
      }
    };
  
    /** @suppress {undefinedVars} */
    var globalNS = (function () {
      // the only reliable means to get the global object is
      // `Function('return this')()`
      // However, this causes CSP violations in Chrome apps.
      if (typeof self !== 'undefined') {
        return self;
      }
      if (typeof window !== 'undefined') {
        return window;
      }
      if (typeof commonjsGlobal !== 'undefined') {
        return commonjsGlobal;
      }
      throw new Error('unable to locate global object');
    })();
  
    if (!('Promise' in globalNS)) {
      globalNS['Promise'] = Promise;
    } else if (!globalNS.Promise.prototype['finally']) {
      globalNS.Promise.prototype['finally'] = finallyConstructor;
    }
  
  })));
});

var defCheck = [
    {
        name: 'noBlank', fn: function (v) {
            var value = $.trim(v);
            return typeof value === 'string' ? $.trim(value) === '' : true
        }
    },
    {
        name: 'maxLen', fn: function (v, len) {
            var value = $.trim(v);
            return value ? value.length > len : false
        }
    },
    {
        name: 'noSpecialLetter', fn: function (v) {
            var value = $.trim(v);
            if (value.indexOf("'") >= 0) {
                return true
            }
            if (value.indexOf('"') >= 0) {
                return true
            }
            if (value.indexOf('?') >= 0) {
                return true
            }
            if (value.indexOf('&') >= 0) {
                return true
            }
        }
    }, {
        name: 'noSpecialLetter2', fn: function (v) {
            var value = $.trim(v);
            return new RegExp("[`~!@#$^&*()=|{}':;'\\[\\]<>/?~！@#￥……&*——|{}【】‘；：”“'。、？]").test(value)
        }
    },
    {
        name: 'beforeDate', fn: function (va1, va2) {

            var v1 = $.trim(va1);
            var v2 = $.trim(va2);
            if (!v1 || !v2) return false

            var d1 = new Date(v1.split('-').join('/').split('.').join('/')).getTime();
            var d2 = new Date(v2.split('-').join('/').split('.').join('/')).getTime();

            if ((d1 || d1 === 0) && (d2 || d2 === 0)) {
                return d1 >= d2
            } else {
                return false
            }
        }
    },
    {
        name: 'beforeNow', fn: function (v) {
            var value = $.trim(v);
            if (!value) return false

            var d1 = new Date(value.split('-').join('/').split('.').join('/')).getTime();
            var d2 = new Date().getTime();

            if ((d1 || d1 === 0) && (d2 || d2 === 0)) {
                return d1 >= d2
            } else {
                return false
            }
        }
    },
    {
        name: 'phone', fn: function (v) {
            var value = $.trim(v);
            return value ? !(/^(1[3,4,5,7,8])\d{9}$/.test(value)) : false
        }
    },
    {
        name: 'email', fn: function (v) {
            var value = $.trim(v);
            return value ? !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value) : false
        }
    },
    {
        name: 'noBr', fn: function (v) {
            var value = $.trim(v);
            return typeof value === 'string' ? value.indexOf('\n') > 0 : false
        }
    },
    {
        name: 'idCard', fn: function (sfz, birth, isMale) {
            function isTrueValidateCodeBy18IdCard(idCard) {
                var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];// 加权因子 
                var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];// 身份证验证位值.10代表X 
                var sum = 0; // 声明加权求和变量 
                for (var i = 0; i < 17; i++) {
                    var tempnum = idCard.substring(i, i + 1);
                    if (tempnum == 'x' || tempnum == 'X') {
                        tempnum = 10;// 将最后位为x的验证码替换为10方便后续操作 
                    }
                    sum += Wi[i] * tempnum;// 加权求和 
                }
                valCodePosition = sum % 11;// 得到验证码所位置 
                var a_idCard_num = idCard[17];
                if (a_idCard_num == 'x' || a_idCard_num == 'X') {
                    a_idCard_num = 10;
                }
                if (a_idCard_num == ValideCode[valCodePosition]) {
                    return true;
                } else {
                    return false;
                }
            }
            function isValidityBrithBy18IdCard(idCard18) {
                var year = idCard18.substring(6, 10);
                var month = idCard18.substring(10, 12);
                var day = idCard18.substring(12, 14);
                var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
                // 这里用getFullYear()获取年份，避免千年虫问题   
                if (temp_date.getFullYear() != parseFloat(year)
                    || temp_date.getMonth() != parseFloat(month) - 1
                    || temp_date.getDate() != parseFloat(day)) {
                    return false;
                } else {
                    return true;
                }
            }
            var value = sfz;
            if (value.length !== 15 && value.length !== 18) return '身份证长度不符合要求'

            if (value.length === 18) {
                // 验证效验码
                if (!isTrueValidateCodeBy18IdCard(value)) return '身份证校验码验证错误'
            } else {
                // 将15位补全为18位
                value = value.substring(0, 6) + '19' + value.substring(6, 15) + 'X';
            }
            // 验证数字
            if (!(
                /^[0-9]*$/.test(value.substring(0, 17)) &&
                /[0-9]|[x|X]/.test(value.substring(17, 18))
            )) return '身份证号应为数字'

            // 18位数身份证号码中的生日是否是有效生日
            if (!isValidityBrithBy18IdCard(value)) return '身份证号码中的生日不是有效日期'
            // 验证生日
            if (birth) {
                var nyr = birth.split('-');
                if (!(
                    (
                        (!nyr[0]) && (nyr[0] === value.substring(6, 10))
                    ) &&
                    (
                        (!nyr[1]) && (parseInt(nyr[1]) === parseInt(value.substring(10, 12)))
                    ) &&
                    (
                        (!nyr[2]) && (parseInt(nyr[2]) === parseInt(value.substring(12, 14)))
                    )
                )) {
                    return '身份证号与出生日期不符'
                }
            }
            // 验证性别
            if (isMale === false || isMale === true) {
                if (
                    (
                        (isMale === true) &&
                        (parseInt(value.substring(16, 17) % 2 === 0))
                    ) ||
                    (
                        (isMale === false) &&
                        (parseInt(value.substring(16, 17) % 2 === 1))
                    )
                ) return '身份证号与性别不符'
            }
            return false
        }
    },
    {
        name: 'onlyChineseWord', fn: function (value, birth, isMale) {
            var txt = /^[\u4e00-\u9fa5\s|.]+$/;
            while (value.indexOf('　') != -1) //将全角空格替换成半角空格
            {
                value = value.replace('　', ' ');
            }
            if (txt.test(value)) {
                return false;
            }
            return true;
        }
    }];

var defTable = defCheck.reduce(function (t, v) {
    t[v.name] = v.fn;
    return t
}, {});

var logic = {
    and: function (fn) {
        // 上一级返回 true 时进行判断
        var a = this();
        if (a) return fn
        else return function (msg) { return false }
    },
    or: function () {
        // 上一级返回 false 时进行判断
        var a = this();
        if (a) return function (msg) { return msg }
        else return fn
    },
    not: function (msg) {
        var res = this();
        return res ? false : msg
    }
};

function Validate(op) {
    var option = op || {};
    var use = option.use || 'all';
    var custom = option.custom || {};

    if (use === 'all') use = defCheck.map(function (v) { return v.name });

    var mTable = use.reduce(function (t, name) {
        t[name] = defTable[name];
        return t
    }, {});

    mTable = $.extend(mTable, custom);

    var result = this;

    for (var key in mTable) {
        if (!mTable.hasOwnProperty(key)) continue
        (function (key) {
            result[key] = function () {
                var args = arguments;
                return $.extend(function (msg) {
                    var res = mTable[key].apply(null, args);
                    //处理异步结果
                    if (res && res.then) {
                        return res.then(function (v) {
                            return v && (msg || v)
                        })
                    }
                    return res && (msg || res) // 没有 msg 返回 res，存在 msg ，如果 res 为 true 返回 msg
                }, logic)
            };
        })(key);
    }

    return result
}

Validate.prototype = {
    and: function (fn) {
        // 上一级返回 true 时进行判断
        var a = this();
        if (a) return fn
        else return function (msg) { return false }
    },
    or: function () {
        // 上一级返回 false 时进行判断
        var a = this();
        if (a) return function (msg) { return msg }
        else return fn
    },
    not: function (msg) {
        var res = this();
        return res ? false : msg
    }
};

// 静态方法
Validate.create = function (op) { return new this(op) };
Validate.$async = function (arr) {


    return new Promise(function (res) {
        var i = arr.length;
        function check(value) {
            if (value) res(value);
            else if (i === 0) res(false);
        }

        if (arr.length === 0) return res(false)
        arr.forEach(function (v) {
            if (v && v.then) v.then(function (value) {
                i--;
                check(value);
            })['catch'](function () { i--; check(); });
            else {
                i--;
                check(false);
            }
        });
    })
};

function Dom(str) {
    var v = document.createElement('div');
    v.innerHTML = $.trim(str);
    return v.firstChild
}

if (!$('#loading_bar').get(0)) {
    $(function () {
        $('body').get(0).appendChild(Dom('<div style="display:none" id = "loading_bar"><div></div></div>'));
    });
}
// 通用的 ajax 方法，添加了异常处理逻辑
var task = 0;
function ajax(op) {
    task += 1;
    $('#loading_bar').get(0).style.top = 0;
    return new Promise(function (res, rej) {
        $.ajax($.extend({
            type: "get",
            url: '',
            async: true,
            success: function (data) {
                try {
                    var ms = typeof data == 'string' ? JSON.parse(data) : data;
                    if (ms.Code === 0 || ms.Code === "0" || ms.code === 0 || ms.code === "0") {
                        res(ms.Data || ms.data);
                    } else {
                        rej(ms.Desc || ms.msg || ms.Msg);
                    }
                }
                catch (e) { rej(data); }
            },
            error: function (data) {
                rej(data);
            },
            complete: function () {
                if (task <= 1) {
                    task = 0;
                    $('#loading_bar').get(0).style.top = '-2px';
                } else {
                    task--;
                }
            }
        }, op));
    })
}

function Api(func) {
    var res = {};
    var reg = function (name, call) { res[name] = call; };
    var a = func(ajax, reg);
    if(a){
        $.extend(res,a);
    }
    return res
}

Api.create = function (f) { return Api(f) };

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
    var tree = createTree(words);
    var content = translateTree(tree);
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

    var name = option.name;
    var path = option.path;
    var template = option.template;
    var $static = option.static || {};

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
var task$1 = [];
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
        if (task$1) {
            if(cb) task$1.push(cb);
            
            return new Promise(function(res,rej){
                task$1.push(res);
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
        task:function(){return task$1}
    }
};

$(function () {
    scan(store).then(function () {
        // 加载完成则调用 task 上所有挂载的任务 
        if (task$1) task$1.forEach(function (cb) { cb(); });
        // 不需要 task 去存储任务
        task$1 = null;
    });
});

function Dom$1(str) {
    var v = document.createElement('div');
    v.innerHTML = $.trim(str);
    return v.firstChild || document.createElement('span')
}


window.Entry = function (arr, obj) {
    var array = arr || [];
    var target = obj || window;

    array.forEach(function (v) {
        switch (v) {
            case 'Validate': target.Validate = Validate;
                break
            case 'Api': target.Api = Api;
                break
            case 'Shelf': target.Shelf = Shelf;
                break
            case 'Msger': target.Msger = Msger;
                break
            case 'Dom': target.Dom = Dom$1;
                break
        }

    });

    return target
};

exports.Msger = Msger;
exports.Api = Api;
exports.Dom = Dom$1;
exports.Shelf = Shelf;
exports.Validate = Validate;
