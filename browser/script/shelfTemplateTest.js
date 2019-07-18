document.write('<script src="./static/popList.shelf.js" class="shelf-popList"></script>')


Shelf.done(function () {
    var popList = Shelf.get('popList')()

    var h = document.getElementsByTagName('h1')[0]

    h.onclick = function () {
        popList.emit('open',[
            [
                { id: "dsf12312321", text: '案说法' },
                { id: "fds12312321", text: '范德萨' },
                { id: "asd12312321", text: '格勒恩' }
            ],this,{size:{width:100}}
        ])
    }


})