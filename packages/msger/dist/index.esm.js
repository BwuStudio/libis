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

export default Msger;
