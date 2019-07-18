Shelf.define(
    { name: 'popList', path: './popList.shelf.html' },
    function () {
        function containerStyleInit(cont, position, size, offset) {
            var p = position || {}
            var s = size || {}
            var o = offset || {}

            cont.style.position = 'fixed'
            cont.style.zIndex = '999'
            cont.style.overflow = 'auto'
            cont.style.background = '#fff'
            cont.style.border = '1px solid #ddd'
            cont.style.display = 'none'
            cont.style.boxShadow = '0 2px 4px 0 #ccc'
            cont.style.boderRadius = '3px'

            cont.style.top = p.top ? (o.top ? (p.top + o.top) : p.top) + 'px' : 'auto'
            cont.style.bottom = p.bottom ? (o.bottom ? (p.bottom + o.bottom) : p.bottom) + 'px' : 'auto'
            cont.style.left = p.left ? (o.left ? (p.left + o.left) : p.left) + 'px' : 'auto'
            cont.style.right = p.right ? (o.right ? (p.right + o.right) : p.right) + 'px' : 'auto'

            cont.style.width = s.width ? s.width + 'px' : 'auto'
            cont.style.height = s.height ? s.height + 'px' : 'auto'
        }
        function hide() {
            if (main) main.style.display = 'none'
            $(document.body).off('click', hide)
            $(document.body).off('mousewheel', hide)
        }
        var main = null

        return {
            render: function (props) {
                return { val: [], itemClick: function () { } }
            },
            init: function (cont) {
                main = cont
                var _this = this
                $(cont).on('mousewheel', function (event) {
                    event.stopPropagation();
                })

                $(cont).find('.pop-list-li').get().forEach(function (v) {
                    var i = v.className.match(/item_index_(\d*)/)[1]
                    v.onclick = function () { _this.data.itemClick(_this.data.val[i]) }
                });
            },
            outer: {
                open: function (list, el, option) {
                    document.body.appendChild(this.root)

                    var _this = this
                    this.data.val = list
                    this.data.itemClick = option.itemClick || function () { }

                    _this.update()
                    var bc = el.getBoundingClientRect()

                    containerStyleInit(
                        _this.root,
                        { top: bc.bottom, right: $(window).width() - bc.right },
                        option.size,
                        option.offset
                    )

                    setTimeout(function () {
                        $(document.body).on('click', hide)
                        $(document.body).on('mousewheel', hide)
                        _this.root.style.display = 'block'
                    });
                },
                close: function () {
                    main.style.display = 'none'
                }
            }
        }
    })