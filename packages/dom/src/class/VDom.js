

/**
 * 
 * @param {state:{*},template:Template,} unit 
 */
export default function LazyDom(unit) {
  var _template = function () {
    return unit.template(unit.state, unit.callback)
  }

  var _before = function () { }
  var _done = function () { }
  var _slot = []//{name:lazyDom[],vDoms}

  var lazy = $.extent(function () {
    var dom = _template

    _before(dom)

    _slot.map(function (v) {
      return [$(dom).find('.slot-' + v.name).get(0), v.vDoms]
    }).forEach(function (m) {
      m[1].forEach(function (c) {
        if (c && m) m.appendChild(v)
      })
    })

    _done(dom)
    
    return dom
  }, {
      slot: function (_name, _vDoms) {
        var name = _name || ''
        var vDoms = _vDoms instanceof Array ? _vDoms : [_vDoms]
        return lazy
      },
      callback: function (fn) {
        _before = fn || function () { }
        return lazy
      },
      done: function (fn) {
        _done = fn || function () { }
        return lazy
      }
    }
  )
  return lazy
}



var table1 = Dom.create()
  .state({
    title: 'test-table',
    option: {},
    list: [
      { id: 'w' }
    ]
  })
  .loadTemplate('./table.template.html')
  .render(function (doms, state) {
    return doms
      .main({ title: 'daffsdfasd' })
      .slot('tbody', function () {
        return state.list.map(function (v, i) {
          return (
            template.tr({
              index: i + 1
            })
          )
        })
      })
      .callback(function (dom) {
        dom.get().onclick = function () { alert('this is main') }
        dom.find('.name').forEach(function (v) {
          v.$().hide()
        })
      })
  })