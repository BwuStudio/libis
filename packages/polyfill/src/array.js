// Array.prototype polifill
(function (window, Array) {
    if (!Array.prototype.map) {
      Array.prototype.map = function (call, thisArg) {
        if (typeof call !== 'function') throw new TypeError("not a function")
  
        var _this = thisArg === undefined ? window : thisArg
        var res = []
        for (var i = 0; i < this.length; i++) {
          var e = this[i];
          res.push(call.call(_this, e, i, this))
        }
        return res
      } 
    }
  
    if (!Array.prototype.forEach) {
      Array.prototype.forEach = function (call, thisArg) {
        this.map(call, thisArg)
      }
    }
  
    if (!Array.prototype.filter) {
  
      Array.prototype.filter = function (call, thisArg) {
        if (typeof call !== 'function') throw new TypeError("not a function")
  
        var _this = thisArg === undefined ? window : thisArg
        var res = []
        for (var i = 0; i < this.length; i++) {
          var e = this[i];
          if (call.call(_this, e, i, this)) {
            res.push(e)
          }
        }
        return res
      }
    }
  
    if (!Array.prototype.find) {
      Array.prototype.find = function (call, thisArg) {
        if (typeof call !== 'function') throw new TypeError("not a function")
  
        var _this = thisArg === undefined ? window : thisArg
        var res = undefined
  
        for (var i = 0; i < this.length; i++) {
          var e = this[i];
          if (call.call(_this, e, i, this)) {
            res = e
            break
          }
        }
        return res
      }
    }
  
    if (!Array.prototype.every) {
      Array.prototype.every = function (call, thisArg) {
        if (typeof call !== 'function') throw new TypeError("not a function")
  
        var _this = thisArg === undefined ? window : thisArg
        var res = true
  
        for (var i = 0; i < this.length; i++) {
          var e = this[i];
          if (!call.call(_this, e, i, this)) {
            res = false
            break
          }
        }
        return res
      }
    }
  
    if (!Array.prototype.some) {
      Array.prototype.some = function (call, thisArg) {
        if (typeof call !== 'function') throw new TypeError("not a function")
  
        var _this = thisArg === undefined ? window : thisArg
        var res = false
  
        for (var i = 0; i < this.length; i++) {
          var e = this[i];
          if (call.call(_this, e, i, this)) {
            res = true
            break
          }
        }
        return res
      }
    }
  
    if (!Array.prototype.flat) {
  
      Array.prototype.flat = function (depth) {
  
        if (depth && typeof depth !== 'number') throw 'type error : flat need number'
        return flat(this, depth ? depth : 1)
      }
  
      function flat(arr, depth) {
        if (depth <= 0) return arr
        if (!arr.some(function (a) { return a instanceof Array })) return arr
  
        var res = []
  
        arr.forEach(function (a) {
          if (a instanceof Array) {
            a.forEach(function (v) { res.push(v) })
          } else {
            res.push(a)
          }
        })
  
        return flat(res, depth--)
      }
    }
  
    if (!Array.prototype.reduce) {
  
      Array.prototype.reduce = function (call, init) {
        if (typeof call !== 'function') throw new TypeError("not a function")
  
        if (arguments.length > 1) {
          var res = init
          for (var i = 0; i < this.length; i++) {
            var e = this[i];
            res = call(res, e, i, this)
          }
          return res
        } else {
          if (this.length < 1) throw 'Reduce of empty array with no initial value'
          var res = this[0]
          for (var i = 1; i < this.length; i++) {
            var e = this[i];
            res = call(res, e, i, this)
          }
          return res
        }
      }
    }
  
    if (!Array.prototype.fill) {
  
      Array.prototype.fill = function (value) {
        for (var i = 0; i < this.length; i++) {
          this[i] = value
        }
        return this
      }
  
    }
  })(window||{}, Array||{});
  
