$(function(){
    var topNavs = '';
    var id = '';
    // 请求topNavs.json获取一级导航
    $.ajax({
        url: '../json/topNavs.json',
        dataType: "json",
        type: "get",
        async:false,
        success:function (data) {
            // <li><a href="dataAnalysis.html">数据报表</a></li>
            for (var i = 0 ; i < data.length ; i ++){
                if (i != 0)
                    topNavs += '<li><a href="javascript:;" data-id="'+ data[i].id +'">' + data[i].title + '</a></li>';
                else{
                    id = data[i].id;
                    topNavs += '<li class="nav_choose"><a class="ys_choose" href="javascript:;" data-id="'+ id +'">' + data[i].title + '</a></li>';
                }
            }
            $('#topNav').html(topNavs);
            requestLeftNavs(id)
        }
    });

    $("#topNav li").click(function () {
        var topNavId = this.firstChild.dataset.id

        // 移除topNav默认被选中的样式
        $("#topNav li").removeClass("nav_choose");
        $("#topNav li a").removeClass("ys_choose");

        // 点击topNav样式
        this.className = "nav_choose";
        this.children[0].className = "ys_choose";

        requestLeftNavs(topNavId);
        clickLeftNav();
    });
    clickLeftNav();


});

/*
* 点击左侧leftNav执行函数
*
* */
function clickLeftNav(){
    $("#leftNav ul li").click(function(){

        // 移除leftNav默认被选中的样式
        $("#leftNav ul li").removeClass("left_nav_choose");
        $("#leftNav ul li a").removeClass("left_nav_choose_ys");

        // 点击leftNav样式
        this.className = "left_nav_choose";
        this.children[0].className = "left_nav_choose_ys";

        // 渲染iframe
        var src = this.children[0].dataset.src;

        var iframe = '<iframe src="' + src + '" frameborder="0" style="margin-top: 5px;width: 100%;height: 100%"></iframe>';
        $('#main').html(iframe);
    });
}

/*
* 请求leftNavs.json 渲染二级导航和iframe。
*
* */
function requestLeftNavs(id){

    var iframe = '';
    // 请求leftNavs.json 渲染二级导航和iframe。
    $.ajax({
        url: '../json/leftNavs.json',
        dataType: "json",
        type: "get",
        async:false,
        success: function(data){

            var leftNavs = '<ul class="nav nav-sidebar yY_left">';

            for (var i = 0 ; i < data.length ; i ++){

                if(data[i].topNavId == id){

                    if (data[i].topping) {
                        iframe = '<iframe src="' + data[i].src + '" frameborder="0" style="margin-top: 5px;width: 100%;height: 100%"></iframe>';
                        leftNavs += '<li class="left_nav_choose">' +
                            '<a href="javascript:;" class="left_nav_choose_ys" data-src="' + data[i].src + '">' + data[i].title + '</a>' +
                            '</li>';
                    }else{
                        leftNavs += '<li>' +
                            '<a href="javascript:;" data-src="' + data[i].src + '">' + data[i].title + '</a>' +
                            '</li>';
                    }
                }
            }
            leftNavs += '</ul>';

            $('#leftNav').html(leftNavs);
            $('#main').html(iframe);
        }
    });

}
