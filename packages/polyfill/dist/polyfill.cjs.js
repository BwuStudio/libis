'use strict';

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
    
    if (!Array.prototype.flat) {
  
      Array.prototype.flat = function (depth) {
  
        if (depth && typeof depth !== 'number') throw 'type error : flat need number'
        return flat(this, depth ? depth : 1)
      };
  
      
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
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
      typeof define === 'function' && define.amd ? define(factory) :
        (factory());
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
      if (typeof global !== 'undefined') {
        return global;
      }
      throw new Error('unable to locate global object');
    })();
  
    if (!('Promise' in globalNS)) {
      globalNS['Promise'] = Promise;
    } else if (!globalNS.Promise.prototype['finally']) {
      globalNS.Promise.prototype['finally'] = finallyConstructor;
    }
  
  })));

if (!Object.keys) {
    Object.keys = (function () {
      var hasOwnProperty = Object.prototype.hasOwnProperty,
          hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
          dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
          ],
          dontEnumsLength = dontEnums.length;
  
      return function (obj) {
        if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');
  
        var result = [];
  
        for (var prop in obj) {
          if (hasOwnProperty.call(obj, prop)) result.push(prop);
        }
  
        if (hasDontEnumBug) {
          for (var i=0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
          }
        }
        return result;
      }
    })();
  }
