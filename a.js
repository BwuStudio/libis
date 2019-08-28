


var table0 = Dom.UI('./table.ui.js')({
  title: '',
  name: ''
}, ['loadData', 'getSelected'])


var table1 = Dom.create()
  .state({
    title: 'test-table',
    option: {},
    list: [
      { id: 'w' },
      { id: 'w' },
      { id: 'w' },
      { id: 'w' },
    ]
  })
  .loadTemplate('./table.template.html')
  .render(function (template, state) {
    return template
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

function self(fn, outer, inner) {
  return function () {
    fn.apply(inner, [outer, arguments])
    return obj
  }
}

function $state(outer, args) {
  var state = args[0] || {}
  this.state = state
}

function $loadTemplate(outer, args) {
  var url = args[0]
}

function $render(outer, args) {
  var url = args[0]
}

function Template(str) {
  var html = str
  var render

  return function (state) {

  }
}

function create() {
  var inner = {
    state: {},
    template: {},
  }

  var outer = {
    state: function () { },
    loadTemplate: function () { },
    render: function () { },
  }

}


/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param head The linked list's head.
        Note that the head is guaranteed to be not null, so it contains at least one node.
 * @param {ListNode} head
 */
var Solution = function (head) {
  this.head = head
};

/**
* Returns a random node's value.
* @return {number}
*/
Solution.prototype.getRandom = function () {
  var i = 0
  var target = head
  while (true) {

  }
};

function rand(n) {
  return (Math.random() < (1 / n))
}

/**
* Your Solution object will be instantiated and called as such:
* var obj = new Solution(head)
* var param_1 = obj.getRandom()
*/



