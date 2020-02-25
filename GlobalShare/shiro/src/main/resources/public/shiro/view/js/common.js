layui.use('element', function() {
    var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
    //监听导航点击
    element.on('nav(demo)', function (elem) {
        //console.log(elem)
        layer.msg(elem.text());
    });



});

layui.config({
    version: true
}).define(['jquery'],function (exports) {
    var $ = layui.jquery;

    exports('formatTime',function (_time) {
        var date = new Date(_time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return year + "-" + month + "-" + day + " " + hour + ":" + minute;
    });

})

