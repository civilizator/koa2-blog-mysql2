function pagination(data, callback) {

    // css style
    if (!document.getElementById('pageStyle')) {
        let style = document.createElement('style')
        style.id = 'pageStyle'
        style.innerHTML = '.pagination{text-align:center;margin-top:100px}.pagination a,.pagination span{margin:0 2px;padding:4px 8px;color:#428bca;background:#fff;text-decoration:none;border:1px solid #ddd;border-radius:4px;user-select:none;cursor:pointer}.pagination a:hover,.pagination span:hover{color:#fff;background:#428bca}.pagination .active{color:#fff;background:#428bca;cursor:default;}.pagination input{width:40px;padding:7px 0;border:none;outline:0;border:1px solid #ddd;border-radius:4px;text-align:center;margin:0 5px}.pagination i{font-style: normal;margin:0 5px;color:#999}.pagination input:focus{border:1px solid #428bca}'
        document.getElementsByTagName('head')[0].appendChild(style)
    }

    let page = document.getElementById(data.selector.slice(1)),
        nextPage = document.getElementById('nextPage'),
        prevPage = document.getElementById('prevPage'),
        inputGo = document.getElementById('inputGo'),
        currentPage = data.currentPage,
        nowPage = currentPage ? currentPage : 1,
        visiblePage = Math.ceil(data.visiblePage / 2),
        i_html = '',
        pageOneLoad = data.pageOneLoad ? false : true

    // initialization
    pageAction(nowPage)

    function pageAction(dataPage) {
        nowPage = dataPage;
        i_html = '';

        let count = data.count <= 1 ? 1 : data.count ? data.count : 2,
            startPage = dataPage - data.count <= 1 ? 1 : dataPage - data.count,
            endPage = dataPage + data.count >= data.totalPage ? data.totalPage : dataPage + data.count,
            prevPage = data.prev ? data.prev : '<',
            nextPage = data.next ? data.next : '>';

        if (dataPage > 1) {
            i_html += '<span id=\"prevPage\">' + prevPage + '</span>'
            if (data.first) {
                i_html += '<a data-page="1" href=\"javascript:void(0);\">Home</a>'
            }
        }

        if (dataPage >= 5) {
            for (let i = 1; i <= 2; i++) {
                i_html += '<a data-page="' + i + '" href=\"javascript:void(0);\">' + i + '</a>'
            }
            i_html += '<span>...</span>'
        }

        for (let j = startPage; j <= endPage; j++) {
            i_html += '<a data-page="' + j + '" href=\"javascript:void(0);\">' + j + '</a>'
        }

        if (endPage + 1 < data.totalPage) {
            i_html += '<span>...</span>'

            for (let i = (endPage > data.totalPage - 2 ? data.totalPage : data.totalPage - 1); i <= data.totalPage; i++) {
                i_html += '<a data-page="' + i + '" href=\"javascript:void(0);\">' + i + '</a>'
            }

            if (data.last) {
                i_html += '<a data-page="' + data.totalPage + '" href=\"javascript:void(0);\">last page</a>'
            }
            i_html += '<span id=\"nextPage\">' + nextPage + '</span>'
        }

        if (data.showTotalPage && data.totalPage >= 1) {
            i_html += '<i>' + nowPage + '/' + data.totalPage + '</i>'
        }

        if (data.jumpBtn && data.totalPage >= 1) {
            i_html += 'Go to<input id="pageInput" type="text" />page <span id="inputGo">determine</span>'
        }

        page.innerHTML = i_html;

        let pageA = page.getElementsByTagName('a');

        for (let i = 0, pageALength = pageA.length; i < pageALength; i++) {
            pageA[i].className = ''
            if (pageA[i].getAttribute('data-page') == dataPage) {
                pageA[i].className = "active"
            }
        }

        // first page does not request
        if (!pageOneLoad) {
            callback && callback.call(null, dataPage)
        }
    }

    page.onclick = function (event) {
        let events = event || window.event,
            target = events.target || events.srcElement,
            dataPage = parseInt(target.getAttribute('data-page'))

        pageOneLoad = false;

        if (target.className == 'active') return

        if (target.nodeName.toLowerCase() == 'a') {
            pageAction(dataPage)
        }

        if (target.id == 'nextPage') {
            nowPage++
            pageAction(nowPage)
        }

        if (target.id == 'prevPage') {
            nowPage--
            pageAction(nowPage)
        }

        if (target.id == 'inputGo') {
            let pageInput = document.getElementById('pageInput'),
                goPage = pageInput.value > data.totalPage ? 1 : /[1-9]+/g.test(pageInput.value) ? pageInput.value : 1;
            pageAction(parseInt(goPage))
        }
    }
}