
var defaultOpts = {
    stage: '.stage', //舞台
    itemClass: 'resize-item', //可缩放的类名
};



function zResize(el) {

    $(".resize-panel").remove();
    /**
     * 定义类
     */

    // this.options = $.extend({}, defaultOpts, options);
    init(el);

}

function init(el) {

    initResizeBox(el);
}

function initResizeBox(el) {

        /* 创建面板 */
        var width = el.width();
        var height = el.height();
        var resizePanel = $('<div class="resize-panel"></div>');
        resizePanel.css({
            width: width,
            height: height,
            top: 0,
            left: 0,
            position: 'absolute',
            'background-color': 'rgba(0,0,0,0.5)',
            cursor: 'move',
            display: 'none'
        });
        appendHandler(resizePanel, el);
        /**
         * 创建控制点
         */
        // var n = $('<div class="n"></div>');//北
        // var s = $('<div class="s"></div>');//南
        // var w = $('<div class="w"></div>');//西
        // var e = $('<div class="e"></div>');//东
        // var ne = $('<div class="ne"></div>');//东北
        // var nw = $('<div class="nw"></div>');//西北
        var se = $('<div class="se"></div>');//东南
        // var sw = $('<div class="sw"></div>');//西南

        //添加公共样式
        addHandlerCss([se]);
        //添加各自样式

        se.css({
            'bottom': '-4px',
            'right': '-4px',
            'cursor': 'se-resize'
        });


        // 添加项目
        appendHandler([se], resizePanel);

        //绑定拖拽缩放事件
        bindResizeEvent(resizePanel, el);

        //绑定触发事件
        bindTrigger(el);

        bindHidePanel(el);

}

function addHandlerCss(els) {
    for(var i = 0; i < els.length; i++) {
        el = els[i];
        el.css({
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: '#ff6600',
            margin: '0',
            'border-radius': '2px',
            border: '1px solid #dd5500',
        });
    }
}
/**
 *  插入容器
 */
function appendHandler(handlers, target) {
    for(var i = 0; i < handlers.length; i++) {
        el = handlers[i];
        target.append(el);
    }
}

/**
 *  显示拖拽面板
 */
function triggerResize(el) {

    el.siblings('.' + defaultOpts.itemClass).children('.resize-panel').css({
        display: 'none'
    });
    el.children('div').css({
        display: 'block'
    });
}

/**
 * 拖拽事件控制 包含8个缩放点  和一个拖拽位置
 */
function bindResizeEvent(el) {

    var initTop = el.parent().css("top");
    var initLeft = el.parent().css("left");
    var initWidth = el.parent().css("width");
    var initHeight = el.parent().css("height");

    var self = this;
    var ox = 0; //原始事件x位置
    var oy = 0; //原始事件y位置
    var ow = 0; //原始宽度
    var oh = 0; //原始高度

    var oleft = 0; //原始元素位置
    var otop = 0;
    var org = el.parent('div');

    //东
    var emove = false;
    el.on('mousedown','.e', function(e) {
        //用e.pageX就可以查看鼠标相对于文档边缘的X轴位置
        ox = e.pageX;//原始x位置
        ow = el.width();
        emove = true;
    });

    //南
    var smove = false;
    el.on('mousedown','.s', function(e) {
        oy = e.pageY;//原始x位置
        oh = el.height();
        smove = true;
    });

    //西
    var wmove = false;
    el.on('mousedown','.w', function(e) {
        ox = e.pageX;//原始x位置
        ow = el.width();
        wmove = true;
        oleft = parseInt(org.css('left').replace('px', ''));
    });

    //北
    var nmove = false;
    el.on('mousedown','.n', function(e) {
        oy = e.pageY;//原始x位置
        oh = el.height();
        nmove = true;
        otop = parseInt(org.css('top').replace('px', ''));
    });

    //东北
    var nemove = false;
    el.on('mousedown','.ne', function(e) {
        ox = e.pageX;//原始x位置
        oy = e.pageY;
        ow = el.width();
        oh = el.height();
        nemove = true;
        otop = parseInt(org.css('top').replace('px', ''));
    });

    //西北
    var nwmove = false;
    el.on('mousedown','.nw', function(e) {
        ox = e.pageX;//原始x位置
        oy = e.pageY;
        ow = el.width();
        oh = el.height();
        otop = parseInt(org.css('top').replace('px', ''));
        oleft = parseInt(org.css('left').replace('px', ''));
        nwmove = true;
    });

    //东南
    var semove = false;
    el.on('mousedown','.se', function(e) {
        ox = e.pageX;//原始x位置
        oy = e.pageY;
        ow = el.width();
        oh = el.height();
        semove = true;
    });

    //西南
    var swmove = false;
    el.on('mousedown','.sw', function(e) {
        ox = e.pageX;//原始x位置
        oy = e.pageY;
        ow = el.width();
        oh = el.height();
        swmove = true;
        oleft = parseInt(org.css('left').replace('px', ''));
    });

    //拖拽
    var drag = false;
    el.on('mousedown', function(e) {
        ox = e.pageX;//原始x位置
        oy = e.pageY;
        otop = parseInt(org.css('top').replace('px', ''));
        oleft = parseInt(org.css('left').replace('px', ''));
        drag = true;
    });

    $(defaultOpts.stage).on('mousemove', function(e) {

        if(emove) {
            var x = (e.pageX - ox);
            el.css({
                width: ow + x
            });
            org.css({
                width: ow + x
            });
        } else if(smove) {
            var y = (e.pageY - oy);
            el.css({
                height: oh + y
            });
            org.css({
                height: oh + y
            });
        } else if(wmove) {
            var x = (e.pageX - ox);
            el.css({
                width: ow - x,
                // left: oleft + x
            });
            org.css({
                width: ow - x,
                left: oleft + x
            });
        } else if(nmove) {
            var y = (e.pageY - oy);
            el.css({
                height: oh - y,
                // top: otop + y
            });
            org.css({
                height: oh - y,
                top: otop + y
            });
        } else if(nemove) {
            var x = e.pageX - ox;
            var y = e.pageY - oy;
            el.css({
                height: oh - y,
                // top: otop + y,
                width: ow + x
            });
            org.css({
                height: oh - y,
                top: otop + y,
                width: ow + x
            });
        } else if(nwmove) {
            var x = e.pageX - ox;
            var y = e.pageY - oy;
            el.css({
                height: oh - y,
                // top: otop + y,
                width: ow - x,
                // left: oleft + x
            });
            org.css({
                height: oh - y,
                top: otop + y,
                width: ow - x,
                left: oleft + x
            });
        } else if(semove) {
            var x = e.pageX - ox;
            var y = e.pageY - oy;

            // if ( x == 0 || y == 0){
            //     alert("只能向右下拖动哦");
            //     return false;
            // }
            el.css({
                width: ow + x,
                height: oh + y
            });
            org.css({
                width: ow + x,
                height: oh + y
            });
        } else if(swmove) {
            var x = e.pageX - ox;
            var y = e.pageY - oy;
            el.css({
                width: ow - x,
                // left: oleft + x,
                height: oh + y
            });
            org.css({
                width: ow - x,
                left: oleft + x,
                height: oh + y
            });
        } else if(drag) {
            var x = e.pageX - ox;
            var y = e.pageY - oy;


            org.css({
                left: oleft + x,
                top: otop + y
            });
        }
    }).on('mouseup', function(e) {
        emove = false;
        smove = false;
        wmove = false;
        nmove = false;
        nemove = false;
        nwmove = false;
        swmove = false;
        semove = false;
        drag = false;

        var rowToItemClassLeft = el.offset().left - $('.row').offset().left - parseInt($('.row').css("padding-left").replace('px', ''));
        // 单元格宽度
        var colWidth = parseInt($('.col-md-1').css("width").replace('px', ''));
        // 单元格margin-right的值
        var marginRightWidth = parseInt($('.col-md-1').css("margin-right").replace('px', ''));
        if ( rowToItemClassLeft % ( colWidth + marginRightWidth ) != 0 ){

            var finalLeft = el.offset().left - rowToItemClassLeft % ( colWidth + marginRightWidth )
                            + parseInt(rowToItemClassLeft / ( colWidth + marginRightWidth ));

            if ( finalLeft < marginRightWidth + $('.row').offset().left ){

                finalLeft = $('.row').offset().left;
            }

            el.parent().css("left", finalLeft + "px");
        }


        // 自动调整位置高度
        var rowToItemClassTop = el.offset().top - $('.row').offset().top;
        var colHeight = parseInt($('.col-md-1').css("height").replace('px', ''));
        // 单元格margin-bottom的值
        var marginBottomHeight = parseInt($('.col-md-1').css("margin-bottom").replace('px', ''));

        if ( rowToItemClassTop % ( colHeight + marginBottomHeight ) != 0 ){

            var finalTop = el.offset().top - rowToItemClassTop % ( colHeight + marginBottomHeight )
                + parseInt(rowToItemClassTop / ( colHeight + marginBottomHeight ));

            if (finalTop < $('.row').offset().top){

                finalTop = $('.row').offset().top;
            }

            el.parent().css("top", finalTop + "px");

        }

        // 自动调整宽度
        // 拖放类宽度
        var itemClassWidth = el.width();

        if ( itemClassWidth % ( colWidth + marginRightWidth ) != 0 ){

            var finalWidth = colWidth - itemClassWidth % ( colWidth + marginRightWidth ) + itemClassWidth + itemClassWidth / ( colWidth + marginRightWidth ) - 2 + "px";

            el.parent().width(finalWidth);

            el.width(finalWidth);

        }

        // 自动调整高度
        var itemClassHeight = el.parent().height();

        if ( itemClassHeight % ( colHeight + marginBottomHeight ) != 0 ){

            var finalHeight = colHeight - itemClassHeight % ( colHeight + marginBottomHeight ) + itemClassHeight + itemClassHeight / ( colHeight + marginBottomHeight ) - 2 + "px";
            el.parent().height(finalHeight);
            el.height(finalHeight);

        }


        // 判断是否重叠
        var obj = el.parent().siblings('.resize-div');

        for(var i = 0 ; i < obj.length ; i ++){
            // alert("i: " + i)

            var thisNode = obj[i];

            var thisLeft = thisNode.offsetLeft;
            var thisTop = thisNode.offsetTop;

            var thisWidth = thisNode.offsetWidth;
            var thisHeight = thisNode.offsetHeight;

            var elLeft = el.offset().left;
            var elTop = el.offset().top;

            var elWidth = el.width();
            var elHeight = el.height();


            if(Math.abs(thisLeft - elLeft) < elWidth && Math.abs(thisTop - elTop) <= elHeight){
                // alert(thisLeft - elLeft)
                // alert(elWidth)

                if((elLeft - thisLeft) >= thisWidth && Math.abs(thisTop - elTop) >= thisHeight){
                    // alert(1111)
                    return false;
                }

                if(initWidth == el.parent().width() + 2 + "px"){

                    // 拖拽
                    el.parent().css({
                        top: initTop,
                        left: initLeft,
                    })
                }else{

                    // 缩放
                    el.parent().css({
                        width: initWidth,
                        height: initHeight
                    })

                    el.css({
                        width: initWidth,
                        height: initHeight
                    })
                }
            }

            if(Math.abs(thisLeft - elLeft) <= thisWidth && Math.abs(thisTop - elTop) <= thisHeight){

                // 拖拽
                el.parent().css({
                    top: initTop,
                    left: initLeft,
                })
                // el.css({
                //     top: initTop,
                //     left: initLeft,
                // })
            }
        }
    });
}


/**
 *  点击item显示拖拽面板
 */
function bindTrigger(el) {
    el.on('click', function(e) {
        e.stopPropagation();
        triggerResize(el);
    });
}
/**
 *  点击舞台空闲区域 隐藏缩放面板
 */
function bindHidePanel(el) {
    var stage = defaultOpts.stage;
    $(stage).bind('click', function() {
        $('.resize-panel').remove();
    })
}
