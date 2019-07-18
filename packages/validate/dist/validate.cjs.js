'use strict';

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

module.exports = Validate;
