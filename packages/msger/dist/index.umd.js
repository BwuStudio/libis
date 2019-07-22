(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Msger = factory());
}(this, function () { 'use strict';

    var obj = {};

    var outer = {
        regist: function (name, cb) {
            obj[name] = cb;
            return this
        },
        emit: function (name, args) {
            if (!obj[name]) return console.warn("can't find method named '" + name + '" !')
            return obj[name].apply(null, args || [])

        },
        cancel: function (name) {
            obj[name] = null;
            return this
        }
    };

    function Msger(win) {
        var w = win ? win.contentWindow ? win.contentWindow : win : null;
        
        return w ? w.Msger() : outer
    }

    return Msger;

}));
