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
});

function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

___$insertStyle("/* http://meyerweb.com/eric/tools/css/reset/ \r\n   v2.0 | 20110126\r\n   License: none (public domain)\r\n*/\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed,\nfigure, figcaption, footer, header, hgroup,\nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline;\n}\n\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure,\nfooter, header, hgroup, menu, nav, section {\n  display: block;\n}\n\nbody {\n  line-height: 1;\n}\n\nol, ul {\n  list-style: none;\n}\n\nblockquote, q {\n  quotes: none;\n}\n\nblockquote:before, blockquote:after,\nq:before, q:after {\n  content: \"\";\n  content: none;\n}\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\n#searchResult {\n  display: none;\n}\n\n/* common style */\n* {\n  box-sizing: border-box;\n}\n\na {\n  text-decoration: none;\n}\n\nhtml, html body {\n  height: 100%;\n  width: 100%;\n  position: relative;\n  font-size: 14px;\n}\n\n.globe, .panel {\n  height: 100%;\n  width: auto;\n  display: block;\n  position: relative;\n}\n\n.globe,\n.panel {\n  height: 100%;\n  width: auto;\n  display: block;\n  position: relative;\n  /* input-hook */\n  /* grid hook*/\n}\n.globe > .body,\n.panel > .body {\n  height: 100%;\n  width: 100%;\n  padding: 8px 8px;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.globe.with_head,\n.panel.with_head {\n  padding-top: 33px;\n}\n.globe.with_head > .head,\n.panel.with_head > .head {\n  height: 33px;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  border-bottom: 1px solid #ccc;\n  padding: 0 8px;\n}\n.globe.with_head > .head > .row,\n.panel.with_head > .head > .row {\n  display: block;\n  position: relative;\n  height: 32px;\n  padding: 3px 0;\n}\n.globe.with_head_row_1,\n.panel.with_head_row_1 {\n  padding-top: 33px;\n}\n.globe.with_head_row_1 > .head,\n.panel.with_head_row_1 > .head {\n  height: 33px;\n}\n.globe.with_head_row_2,\n.panel.with_head_row_2 {\n  padding-top: 65px;\n}\n.globe.with_head_row_2 > .head,\n.panel.with_head_row_2 > .head {\n  height: 65px;\n}\n.globe.with_head_row_3,\n.panel.with_head_row_3 {\n  padding-top: 97px;\n}\n.globe.with_head_row_3 > .head,\n.panel.with_head_row_3 > .head {\n  height: 97px;\n}\n.globe.with_foot,\n.panel.with_foot {\n  padding-bottom: 32px;\n}\n.globe.with_foot > .foot,\n.panel.with_foot > .foot {\n  height: 32px;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  padding: 0 8px;\n}\n.globe.with_sider,\n.panel.with_sider {\n  margin-left: 240px;\n}\n.globe > .sider,\n.panel > .sider {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: -240px;\n  width: 240px;\n  background-color: #eff5fa;\n  border-right: 1px solid #aab6d0;\n}\n.globe .mini-datepicker,\n.panel .mini-datepicker {\n  width: 100%;\n  height: 26px;\n  line-height: 26px;\n}\n.globe .mini-buttonedit-border,\n.panel .mini-buttonedit-border {\n  height: 24px;\n  border: 1px solid #ccc;\n  border-radius: 3px;\n}\n.globe .mini-buttonedit-border > input,\n.panel .mini-buttonedit-border > input {\n  line-height: 24px;\n  height: 24px;\n  font-size: 14px;\n}\n.globe .mini-buttonedit-button,\n.globe .mini-buttonedit-close,\n.panel .mini-buttonedit-button,\n.panel .mini-buttonedit-close {\n  height: 20px;\n}\n.globe .mini-buttonedit,\n.panel .mini-buttonedit {\n  display: inline-block;\n  height: 26px;\n  width: 100%;\n  /* float: left; */\n}\n.globe .mini-grid-headerCell,\n.panel .mini-grid-headerCell {\n  background: #eff5fa;\n}\n.globe .mini-grid-pager,\n.panel .mini-grid-pager {\n  background: #eff5fa;\n}\n.globe .mini-grid-headerCell,\n.panel .mini-grid-headerCell {\n  vertical-align: middle;\n}\n.globe .mini-panel-border,\n.panel .mini-panel-border {\n  border: 1px solid #ccc;\n}\n.globe .mini-grid-headerCell,\n.panel .mini-grid-headerCell {\n  border-color: #ccc;\n}\n.globe .mini-grid-cell,\n.panel .mini-grid-cell {\n  vertical-align: middle;\n}\n.globe .mini-grid-table.mini-grid-rowstable,\n.panel .mini-grid-table.mini-grid-rowstable {\n  overflow: hidden;\n}\n.globe .mini-grid-table.mini-grid-rowstable,\n.globe .mini-grid-table.mini-grid-rowstable,\n.panel .mini-grid-table.mini-grid-rowstable,\n.panel .mini-grid-table.mini-grid-rowstable {\n  overflow: visible;\n}\n.globe .mini-grid-table.mini-grid-rowstable .mini-grid-row > td:last-child,\n.globe .mini-grid-table.mini-grid-rowstable.mini-grid-row > td:last-child,\n.panel .mini-grid-table.mini-grid-rowstable .mini-grid-row > td:last-child,\n.panel .mini-grid-table.mini-grid-rowstable.mini-grid-row > td:last-child {\n  border-right-width: 0;\n}\n.globe .row,\n.panel .row {\n  line-height: 26px;\n  padding: 3px 6px;\n  overflow: hidden;\n  width: 100%;\n  position: relative;\n}\n.globe .row > label,\n.panel .row > label {\n  display: block;\n  text-align: right;\n}\n.globe .row > div > input,\n.panel .row > div > input {\n  height: 26px;\n  width: 100%;\n  display: block;\n  line-height: 26px;\n  padding: 0 0 0 6px;\n  border-radius: 3px;\n  border: 1px solid #ccc;\n  float: left;\n  outline: none;\n}\n.globe .row > div > input:focus,\n.panel .row > div > input:focus {\n  border-color: #808891;\n}\n.globe .row > *,\n.panel .row > * {\n  overflow: hidden;\n}\n.globe .row > .col-1,\n.panel .row > .col-1 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-1,\n.panel .row > .row.col-1 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-1,\n.panel .row > .mini-datepicker.col-1 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-1,\n.panel .row > .mini-datepicker.col-1 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-1,\n.panel .row > .mini-buttonedit.col-1 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-1,\n.panel .row > .mini-autocomplete.col-1 {\n  padding: 0;\n}\n.globe .row > .col-1,\n.panel .row > .col-1 {\n  width: 8.3333333333%;\n}\n.globe .row > .offset-1,\n.panel .row > .offset-1 {\n  margin-left: 8.3333333333%;\n}\n.globe .row > .col-2,\n.panel .row > .col-2 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-2,\n.panel .row > .row.col-2 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-2,\n.panel .row > .mini-datepicker.col-2 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-2,\n.panel .row > .mini-datepicker.col-2 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-2,\n.panel .row > .mini-buttonedit.col-2 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-2,\n.panel .row > .mini-autocomplete.col-2 {\n  padding: 0;\n}\n.globe .row > .col-2,\n.panel .row > .col-2 {\n  width: 16.6666666667%;\n}\n.globe .row > .offset-2,\n.panel .row > .offset-2 {\n  margin-left: 16.6666666667%;\n}\n.globe .row > .col-3,\n.panel .row > .col-3 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-3,\n.panel .row > .row.col-3 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-3,\n.panel .row > .mini-datepicker.col-3 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-3,\n.panel .row > .mini-datepicker.col-3 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-3,\n.panel .row > .mini-buttonedit.col-3 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-3,\n.panel .row > .mini-autocomplete.col-3 {\n  padding: 0;\n}\n.globe .row > .col-3,\n.panel .row > .col-3 {\n  width: 25%;\n}\n.globe .row > .offset-3,\n.panel .row > .offset-3 {\n  margin-left: 25%;\n}\n.globe .row > .col-4,\n.panel .row > .col-4 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-4,\n.panel .row > .row.col-4 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-4,\n.panel .row > .mini-datepicker.col-4 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-4,\n.panel .row > .mini-datepicker.col-4 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-4,\n.panel .row > .mini-buttonedit.col-4 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-4,\n.panel .row > .mini-autocomplete.col-4 {\n  padding: 0;\n}\n.globe .row > .col-4,\n.panel .row > .col-4 {\n  width: 33.3333333333%;\n}\n.globe .row > .offset-4,\n.panel .row > .offset-4 {\n  margin-left: 33.3333333333%;\n}\n.globe .row > .col-5,\n.panel .row > .col-5 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-5,\n.panel .row > .row.col-5 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-5,\n.panel .row > .mini-datepicker.col-5 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-5,\n.panel .row > .mini-datepicker.col-5 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-5,\n.panel .row > .mini-buttonedit.col-5 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-5,\n.panel .row > .mini-autocomplete.col-5 {\n  padding: 0;\n}\n.globe .row > .col-5,\n.panel .row > .col-5 {\n  width: 41.6666666667%;\n}\n.globe .row > .offset-5,\n.panel .row > .offset-5 {\n  margin-left: 41.6666666667%;\n}\n.globe .row > .col-6,\n.panel .row > .col-6 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-6,\n.panel .row > .row.col-6 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-6,\n.panel .row > .mini-datepicker.col-6 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-6,\n.panel .row > .mini-datepicker.col-6 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-6,\n.panel .row > .mini-buttonedit.col-6 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-6,\n.panel .row > .mini-autocomplete.col-6 {\n  padding: 0;\n}\n.globe .row > .col-6,\n.panel .row > .col-6 {\n  width: 50%;\n}\n.globe .row > .offset-6,\n.panel .row > .offset-6 {\n  margin-left: 50%;\n}\n.globe .row > .col-7,\n.panel .row > .col-7 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-7,\n.panel .row > .row.col-7 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-7,\n.panel .row > .mini-datepicker.col-7 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-7,\n.panel .row > .mini-datepicker.col-7 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-7,\n.panel .row > .mini-buttonedit.col-7 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-7,\n.panel .row > .mini-autocomplete.col-7 {\n  padding: 0;\n}\n.globe .row > .col-7,\n.panel .row > .col-7 {\n  width: 58.3333333333%;\n}\n.globe .row > .offset-7,\n.panel .row > .offset-7 {\n  margin-left: 58.3333333333%;\n}\n.globe .row > .col-8,\n.panel .row > .col-8 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-8,\n.panel .row > .row.col-8 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-8,\n.panel .row > .mini-datepicker.col-8 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-8,\n.panel .row > .mini-datepicker.col-8 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-8,\n.panel .row > .mini-buttonedit.col-8 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-8,\n.panel .row > .mini-autocomplete.col-8 {\n  padding: 0;\n}\n.globe .row > .col-8,\n.panel .row > .col-8 {\n  width: 66.6666666667%;\n}\n.globe .row > .offset-8,\n.panel .row > .offset-8 {\n  margin-left: 66.6666666667%;\n}\n.globe .row > .col-9,\n.panel .row > .col-9 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-9,\n.panel .row > .row.col-9 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-9,\n.panel .row > .mini-datepicker.col-9 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-9,\n.panel .row > .mini-datepicker.col-9 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-9,\n.panel .row > .mini-buttonedit.col-9 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-9,\n.panel .row > .mini-autocomplete.col-9 {\n  padding: 0;\n}\n.globe .row > .col-9,\n.panel .row > .col-9 {\n  width: 75%;\n}\n.globe .row > .offset-9,\n.panel .row > .offset-9 {\n  margin-left: 75%;\n}\n.globe .row > .col-10,\n.panel .row > .col-10 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-10,\n.panel .row > .row.col-10 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-10,\n.panel .row > .mini-datepicker.col-10 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-10,\n.panel .row > .mini-datepicker.col-10 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-10,\n.panel .row > .mini-buttonedit.col-10 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-10,\n.panel .row > .mini-autocomplete.col-10 {\n  padding: 0;\n}\n.globe .row > .col-10,\n.panel .row > .col-10 {\n  width: 83.3333333333%;\n}\n.globe .row > .offset-10,\n.panel .row > .offset-10 {\n  margin-left: 83.3333333333%;\n}\n.globe .row > .col-11,\n.panel .row > .col-11 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-11,\n.panel .row > .row.col-11 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-11,\n.panel .row > .mini-datepicker.col-11 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-11,\n.panel .row > .mini-datepicker.col-11 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-11,\n.panel .row > .mini-buttonedit.col-11 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-11,\n.panel .row > .mini-autocomplete.col-11 {\n  padding: 0;\n}\n.globe .row > .col-11,\n.panel .row > .col-11 {\n  width: 91.6666666667%;\n}\n.globe .row > .offset-11,\n.panel .row > .offset-11 {\n  margin-left: 91.6666666667%;\n}\n.globe .row > .col-12,\n.panel .row > .col-12 {\n  line-height: 26px;\n  padding: 0 6px;\n  float: left;\n  position: relative;\n}\n.globe .row > .row.col-12,\n.panel .row > .row.col-12 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-12,\n.panel .row > .mini-datepicker.col-12 {\n  padding: 0;\n}\n.globe .row > .mini-datepicker.col-12,\n.panel .row > .mini-datepicker.col-12 {\n  padding: 0;\n}\n.globe .row > .mini-buttonedit.col-12,\n.panel .row > .mini-buttonedit.col-12 {\n  padding: 0;\n}\n.globe .row > .mini-autocomplete.col-12,\n.panel .row > .mini-autocomplete.col-12 {\n  padding: 0;\n}\n.globe .row > .col-12,\n.panel .row > .col-12 {\n  width: 100%;\n}\n.globe .row > .offset-12,\n.panel .row > .offset-12 {\n  margin-left: 100%;\n}\n.globe .list_table,\n.panel .list_table {\n  table-layout: fixed;\n  width: 100%;\n  border-top: 1px solid #e0e0e0;\n  border-left: 1px solid #e0e0e0;\n  /* margin-left: -1px; */\n}\n.globe .list_table td,\n.globe .list_table th,\n.panel .list_table td,\n.panel .list_table th {\n  border-right: 1px solid #ededed;\n  border-bottom: 1px solid #ededed;\n  vertical-align: middle;\n}\n.globe .list_table .control_width,\n.panel .list_table .control_width {\n  height: 0;\n}\n.globe .list_table .control_width td,\n.panel .list_table .control_width td {\n  border-width: 0 !important;\n  padding: 0 !important;\n}\n.globe .list_table tr.name td,\n.panel .list_table tr.name td {\n  text-align: left;\n  padding-left: 60px !important;\n  font-size: 16px;\n  font-weight: bold;\n  padding: 8px 0;\n  line-height: 18px;\n}\n.globe .list_table td.list_table-title,\n.globe .list_table th,\n.panel .list_table td.list_table-title,\n.panel .list_table th {\n  background-color: #f6f5fb;\n  text-align: center;\n  padding: 8px 0;\n  line-height: 18px;\n}\n.globe .list_table td.list_table-content,\n.globe .list_table td,\n.panel .list_table td.list_table-content,\n.panel .list_table td {\n  padding: 3px;\n}\n.globe .list_table td.list_table-content > .row,\n.globe .list_table td > .row,\n.panel .list_table td.list_table-content > .row,\n.panel .list_table td > .row {\n  padding: 3px 0;\n}\n\n/* body style */\n.body {\n  height: 100%;\n  width: 100%;\n  padding: 8px 8px;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n\n/* btn style*/\n.btn_group {\n  overflow: hidden;\n}\n\n.btn_group.right {\n  float: right;\n}\n\n.btn_group.left {\n  float: left;\n}\n\n.btn_group > a.block_btn, .btn_group > a.white_btn {\n  margin: 2px 0 2px 8px;\n  float: left;\n}\n\n.row .btn_group > a.block_btn, .row .btn_group > a.white_btn {\n  margin: 0 0 0 8px;\n}\n\na.block_btn, a.white_btn {\n  vertical-align: top;\n  display: inline-block;\n  height: 26px;\n  background-color: #0B70C1;\n  border: 1px solid #0B70C1;\n  line-height: 24px;\n  font-size: 14px;\n  color: #fff;\n  padding: 0 8px;\n  border-radius: 3px;\n  cursor: pointer;\n  text-align: center;\n  transition: all 0.3 ease-out;\n}\n\na.white_btn {\n  background-color: #fff;\n  color: #0B70C1;\n}\n\na.block_btn:hover {\n  opacity: 0.9;\n}\n\na.white_btn:hover {\n  background: #efefef;\n}\n\n/* Input */\n.globe input.gb_form, select.gb_form {\n  vertical-align: top;\n  height: 26px;\n  min-width: 100px;\n  display: inline-block;\n  line-height: 24px;\n  padding: 0 0 0 6px;\n  border-radius: 3px;\n  border: 1px solid #ccc;\n  outline: none;\n  background-color: #fff;\n}\n\n.globe label.gb_form {\n  vertical-align: top;\n  display: inline-block;\n  padding: 0 3px 0 6px;\n  line-height: 26px;\n  height: 26px;\n}\n\n.globe input.gb_form:focus, .globe select.gb_form:focus {\n  border-color: #808891;\n}\n\n/* form */\n.legend {\n  height: 26px;\n  position: relative;\n  line-height: 26px;\n  display: block;\n  border-bottom: 2px solid #0B70C1;\n  margin: 4px;\n  padding: 0 6px;\n  color: #0B70C1;\n}\n\nfieldset .row {\n  width: 100%;\n  height: 32px;\n  padding: 3px 6px;\n  line-height: 26px;\n}\n\n/* grid system */\nlabel {\n  white-space: nowrap;\n  word-wrap: normal;\n  word-break: keep-all;\n  padding: 0 6px;\n}\n\n/* textarea */\ntextarea.gb_form {\n  width: 100%;\n  line-height: 18px;\n  padding: 4px 8px;\n  resize: none;\n  height: 100%;\n  min-height: 72px;\n  border-radius: 3px;\n  border: 1px solid #ccc;\n}\n\n.globe textarea.gb_form:focus {\n  border-color: #808891;\n}");

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

                var obj = {};

                var data = render.call(obj, props);
                var html = load$1(template, data);
                var outer = option.outer || {};
                var events = option.events || [];
                var inner = events.reduce(function (res, name) {
                    res[name] = function () { };
                    return res
                }, {});

                $.extend(obj, {
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
                    regist: function (name, fn) {
                        if (!events.find(function (v) { return v === name })) {
                            console.warn('This component does not support the Event named ' + name);
                        } else {
                            inner[name] = fn || function () {};
                        }
                        return obj
                    },
                    send: function (name, argus) {
                        if (typeof inner[name] === 'function') {
                            return inner[name].apply(obj, argus ? argus : [])
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
                });
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

var MsgEvent = function (func) {

    var fn = func || function () { };
    var hook = null;

    var o = {
        _TYPE_: "MSGER_EVENT",

        hook: function (func) { hook = func; },

        use: function (func) { fn = func; },

        emit: function (args) {

            if (hook) {
                return hook(fn, args || [])
            } else {
                return fn.apply(null, args)
            }
        }

    };
    return o
};


var MsgCell = function () {

    var table = {}; // Map[MsgEvent]

    return {
        _TYPE_: "MSGER_CELL",


        regist: function (name, fn) {
            if (table[name]) table[name].use(fn);
            else {
                table[name] = MsgEvent(fn);
            }

            return this
        },
        hook: function (name, fn) {
            if (table[name]) table[name].hook(fn);
            else {
                table[name] = MsgEvent(function () { });
                table[name].hook(fn);
            }
        },
        cancel: function (name) {
            if (table[name]) table[name] = null;
        },
        emit: function (name, args) {
            if (table[name]) return table[name].emit(args)
            else console.warn("Can't find method named ${name}".replace('${name}', name));
        }
    }
};


var MsgPairClient = function () {
    var cell1 = MsgCell();
    var cell2 = MsgCell();

    var client1 = {
        _TYPE_: "MSGER_PAIRCLIENT",
        regist: cell1.regist,
        cancel: cell1.cancel,
        hook: cell1.hook,

        emit: cell2.emit
    };

    var clinet2 = {
        _TYPE_: "MSGER_PAIRCLIENT",
        regist: cell2.regist,
        cancel: cell2.cancel,
        hook: cell2.hook,

        emit: cell1.emit
    };

    return [client1, clinet2]
};



var outer = MsgCell();

function Msger(win) {
    var w = win ? win.contentWindow ? win.contentWindow : win : null;

    return w ? w.Msger() : outer
}


var staticFn = {
    pair: MsgPairClient
};

$.extend(Msger, staticFn);

function Dom$1(str, fn) {
    var v = null; // parentNode
    var e = null; // resultNode
    if (/^\s*<\s*tr\s*/.test(str)) {
        v = document.createElement('table');
        v.innerHTML = $.trim(str);
        e = $(v).find('tr').get(0) || document.createElement('tr');
    } else {
        v = document.createElement('div');
        v.innerHTML = $.trim(str);
        e = v.firstChild || document.createElement('span');
    }
    if (fn) { fn(e); }
    return e
}

var Tool = {
    newId: function (prefix, format) {
        var p = prefix || '';
        var f = format || '550e8400-e29b-41d4-a716-446655440000';
        var a = '0123456789ABCDEF';
        return p + f.split('').map(function (v) { return v === '-' ? '-' : a[Math.floor(Math.random() * a.length)] }).join('')
    },
    getUrlParam: function (name) {//封装方法
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
};


window.Validate = Validate;
window.Api = Api;
window.Shelf = Shelf;
window.Msger = Msger;
window.Dom = Dom$1;
window.Tool = Tool;

export { Api, Dom$1 as Dom, Msger, Shelf, Tool, Validate };
//# sourceMappingURL=index.esm.js.map
