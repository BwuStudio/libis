/**
 *  一个简单的解析模板的词法分析器，用正则实现
 *  输出为一个词数组 
 *  */
var _END_ = '_END_'
var _FINISH_ = '_FINISH_'
var _LOOP_ = '_LOOP_'
var _IF_ = '_IF_'
var _ELSE_ = '_ELSE_'

function createWords(str) {

    var words = [str]
    // deal '<!--end-->' word
    words = words.reduce(function (arr, v) {
        if (typeof v === 'object') arr.push(v)
        else {
            var theWords = v.split('<!--end-->').reduce(function (a, b) {
                if (b !== '') a.push(b)
                a.push({ type: _END_, value: '' })
                return a
            }, [])
            if (theWords.length > 0) theWords.pop()

            arr = arr.concat(theWords)
        }
        return arr
    }, [])
    // deal '<!--finish-->' word
    words = words.reduce(function (arr, v) {
        if (typeof v === 'object') arr.push(v)
        else {
            var theWords = v.split('<!--finish-->').reduce(function (a, b) {
                if (b !== '') a.push(b)
                a.push({ type: _FINISH_, value: '' })
                return a
            }, [])
            if (theWords.length > 0) theWords.pop()

            arr = arr.concat(theWords)
        }
        return arr
    }, [])
    // deal '<!--loop(case)-->' word
    words = words.reduce(function (arr, v) {
        if (typeof v === 'object') arr.push(v)
        else {
            var s = v
            var headbegin
            while (s.indexOf('<!--loop(', headbegin) >= 0) {
                var headbegin = s.indexOf('<!--loop(', headbegin)
                var headEnd = s.indexOf(')-->')
                var head = s.substring(headbegin + 9 /*'<!--loop('.length*/, headEnd)
                arr.push(s.substring(0, headbegin))
                arr.push({ type: _LOOP_, value: head })
                s = s.substring(headEnd + 4)
            }
            arr.push(s)
        }
        return arr
    }, [])

    // deal '<!--if(case)-->' word
    words = words.reduce(function (arr, v) {
        if (typeof v === 'object') arr.push(v)
        else {
            var s = v
            var headbegin
            while (s.indexOf('<!--if(', headbegin) >= 0) {
                var headbegin = s.indexOf('<!--if(', headbegin)
                var headEnd = s.indexOf(')-->')
                var head = s.substring(headbegin + 7 /*'<!--if('.length*/, headEnd)
                arr.push(s.substring(0, headbegin))
                arr.push({ type: _IF_, value: head })
                s = s.substring(headEnd + 4)
            }
            arr.push(s)
        }
        return arr
    }, [])

    // deal '<!--else(case)-->' word
    words = words.reduce(function (arr, v) {
        if (typeof v === 'object') arr.push(v)
        else {
            var s = v
            while (s.indexOf('<!--else(', headbegin) >= 0) {
                var headbegin = s.indexOf('<!--else(', headbegin)
                var headEnd = s.indexOf(')-->')
                var head = s.substring(headbegin + 9 /*'<!--else('.length*/, headEnd)
                arr.push(s.substring(0, headbegin))
                arr.push({ type: _ELSE_, value: head })
                s = s.substring(headEnd + 4)
            }
            arr.push(s)
        }
        return arr
    }, [])

    return words
}

export default createWords