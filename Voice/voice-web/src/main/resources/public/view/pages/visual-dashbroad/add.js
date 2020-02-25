$(function () {
    //面板的表格（小框框）
    var a = '<div class=\"col-md-1\"></div>';
    for (var i = 0; i < 333; i++) {
        a = a + "<div class=\"col-md-1\"></div>";
    }
    document.getElementById('rows').innerHTML = a;
    //页面数据加载
    var desc = '';
    var getInfo = window.location.search.slice(window.location.search.lastIndexOf("?") + 1);
    console.log(getInfo);
    var alreadyExistCard = [];
    var detailsAlreadyExistCard = [];
    var dashName;
    var dashDesc;
    $.ajax({
        url: '../../../dashboard/findOne',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            id: getInfo
        }),
        success: function (data) {
            if (resResult(data)) {
                console.log(data);
                // 拿到该仪表盘数据
                dashName = data.data.name;
                dashDesc = data.data.description;
                desc = dashDesc;
                // 拿到该仪表盘内存有的卡片（个数）
                alreadyExistCard = data.data.dataVisualCardEntityList;
                if (alreadyExistCard == undefined) {
                    alert("仪表盘暂无卡片")
                } else {
                    console.log(alreadyExistCard);
                    //卡片显示在面板上
                    var displayCard = '';
                    for (var i = 0; i < alreadyExistCard.length; i++) {
                        //detailsAlreadyExistCard 例：卡片1在不同仪表盘内都包含
                        detailsAlreadyExistCard = alreadyExistCard[i].locationEntityList;
                        // console.log(detailsAlreadyExistCard);
                        for(var h = 0;h<detailsAlreadyExistCard.length;h++){
                            //console.log(detailsAlreadyExistCard[h].dashboardId);
                            //判断卡片是否是该仪表内的卡片，也可能该卡片在其他仪表盘也存在
                            if(detailsAlreadyExistCard[h].dashboardId == getInfo){
                                //console.log(detailsAlreadyExistCard);
                                displayCard =
                                    '<div id="showCard-'+i+'' + h + '"  class="dashShowCard resize-item">' +
                                    '<div class="div-card-title">筛选Subtotal>41,计数, 以Created At (day),Created At</div>' +
                                    '<div class="div-card-delete"><span class="glyphicon glyphicon-remove"></span></div>' +
                                    '<div class="div-card-content"></div>' +
                                    '<div class="div-card-zoom"><span class="glyphicon glyphicon-fullscreen"></span></div>' +
                                    '<div class="div-card-x-title">Created At</div>' +
                                    '</div>';
                                $('#rows').append(displayCard);
                                $("#showCard-"+i+"" + h + "").css({
                                    width: detailsAlreadyExistCard[h].cardWidth,
                                    height: detailsAlreadyExistCard[h].cardHeight,
                                    left: detailsAlreadyExistCard[h].cardLeft,
                                    top: detailsAlreadyExistCard[h].cardTop
                                });
                            }
                        }
                    }
                }
                $('.div-card-zoom').click(function () {
                    $("div").removeClass("resize-item");
                    $(this).parent().addClass("resize-item");
                    zResize($(this).parent());
                });
            }
        }
    });

    //zResize的入口
    $('.div-card-zoom').click(function (ev) {
        $("div").removeClass("resize-item");
        $(this).parent().addClass("resize-item");
        zResize($(this).parent());
    });
    //卡片右上角的×
    $('.div-card-delete').on('click', '#cards', function () {
        $(this).remove()
    });
    //添加按钮
    var idCard;
    var cards = [];//没有添加到仪表盘
    // var addcards = [];//所有
    var card;
    var dashCardId;
    $('#addCard').click(function () {
        if (alreadyExistCard == undefined) {
            $.ajax({
                url: '../../../card/findAll',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(),
                success: function (data) {
                    if (resResult(data)) {
                        var card;
                        var val = '';
                        for (var i = 0; i < data.data.length; i++) {
                            idCard = data.data[i];
                            dashCardId = idCard.id;
                            val = val + '<button type="button" value="' + dashCardId + '" class="cardNameBtn" data-dismiss="modal">' + idCard.name + '</button>';
                            card = new Card(idCard.name, dashCardId, "select * from data_visual_card_entity", 'desc', 'table', '260px', '180px', 0, 0);
                            if (!hasCard(dashCardId))
                                cards.push(card);
                        }
                        $('#cardNameTable').html(val);
                    }
                }
            });
        } else {
            $.ajax({
                url: '../../../card/findCardsNotInDashboard',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    dataVisualCardEntityList: alreadyExistCard
                }),
                success: function (data) {
                    console.log(data);
                    if (resResult(data)) {
                        var val = '';
                        cards = [];
                        for (var i = 0; i < data.data.length; i++) {
                            idCard = data.data[i];
                            dashCardId = idCard.id;
                            val = val + '<button type="button" value="' + dashCardId + '" class="cardNameBtn" data-dismiss="modal">' + idCard.name + '</button>';
                            card = new Card(idCard.name, dashCardId, "select * from data_visual_card_entity", 'desc', 'table', '260px', '180px', 0, 0);
                            if (!hasCard(dashCardId))
                                cards.push(card);
                        }
                        $('#cardNameTable').html(val);
                    }
                }
            });
        }
    });
    //点击模态框
    //从模态框添加到页面的卡片
    $('#cardNameTable').on('click', '.cardNameBtn', function () {
        var addResizeDiv = '<div id="card' + $(this).val() + '" class="resize-div">' +
            '<div class="div-card-title">筛选Subtotal>41,计数, 以Created At (day),Created At</div>' +
            '<div class="div-card-delete"><span class="glyphicon glyphicon-remove"></span></div>' +
            '<div class="div-card-content"></div>' +
            '<div class="div-card-zoom"><span class="glyphicon glyphicon-fullscreen"></span></div>' +
            '<div class="div-card-x-title">Created At</div>' + '</div>';
        $.ajax({
            url: '../../../card/findOne',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({id: $(this).val()}),
            success: function (data) {
                console.log(data);
                $('.resize').append(addResizeDiv);
                //新添加的卡片可拖拽
                $('.div-card-zoom').click(function () {
                    $("div").removeClass("resize-item");
                    $(this).parent().addClass("resize-item");
                    zResize($(this).parent());
                });
            }
        });
    });
    //保存按钮
    // desc = document.getElementById(descrip).value;
    $('#saveCard').click(function () {
        if (alreadyExistCard == undefined)
            alreadyExistCard = [];
        console.log(cards);
        for (var i = 0; i < cards.length; i++) {
            console.log(cards[i].name + ' ' + $("#card" + cards[i].id).css('width') + ' ' + $("#card" + cards[i].id).css('height'));
            if ($("#card" + cards[i].id).css('width') != undefined || $("#card" + cards[i].id).css('height') != undefined) {
                var newCard = {
                    name: cards[i].name,
                    id: cards[i].id,
                    sqlStr: cards[i].sqlStr,
                    description: cards[i].description,
                    cardType: cards[i].cardType,
                    locationEntityList: [{
                        cardWidth: $("#card" + cards[i].id).css('width'),
                        cardHeight: $("#card" + cards[i].id).css('height'),
                        cardLeft: $("#card" + cards[i].id).css('left'),
                        cardTop: $("#card" + cards[i].id).css('top'),
                        dashboardId: getInfo
                    }]
                };
                console.log(newCard);
                alreadyExistCard.push(newCard);
                // console.log(alreadyExistCard);
                $.ajax({
                    url: '../../../card/save',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        name: cards[i].name,
                        id: cards[i].id,
                        sqlStr: cards[i].sqlStr,
                        description: cards[i].description,
                        locationEntityList: [{
                            cardWidth: $("#card" + cards[i].id).css('width'),
                            cardHeight: $("#card" + cards[i].id).css('height'),
                            cardLeft: $("#card" + cards[i].id).css('left'),
                            cardTop: $("#card" + cards[i].id).css('top'),
                            dashboardId: getInfo
                        }]
                    }),
                    success: function (res) {
                        alert("保存到面板成功！")
                    }
                });
                $.ajax({
                    url: '../../../dashboard/save',
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        name: dashName,
                        description: dashDesc,
                        // description:desc,
                        id: getInfo,
                        dataVisualCardEntityList: alreadyExistCard
                    }),
                    success: function (res) {
                        alert("保存到数据库成功！")
                    }
                })
            } else {
                // alert("没有获取到卡片坐标")
            }
        }
    });

    /**
     * 创建卡片对象
     * @param name 卡片名
     * @param id 卡片id
     * @param sqlStr 卡片sql
     * @param desc 卡片描述
     * @param cardType 卡片类型
     * @param width 卡片宽度
     * @param height 卡片高度
     * @param left 卡片左侧位置
     * @param top 卡片上部位置
     * @param dashboardId 卡片所在仪表盘的id
     * @constructor
     */
    function Card(name, id, sqlStr, desc, cardType, width, height, left, top, dashboardId) {
        this.name = name;
        this.id = id;
        this.sqlStr = sqlStr;
        this.desc = desc;
        this.cardType = cardType;
        this.width = width;
        this.height = height;
        this.left = left;
        this.top = top;
        this.dashboardId = dashboardId;
    }

    function hasCard(id) {
        if (cards.length == 0)
            return false;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].id == id)
                return true;
        }
        return false;
    }
});