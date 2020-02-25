
$(function(){
    //获取当前系统时间
    var show=document.getElementById("date_now");
    setInterval(function(){
        var timenow=new Date();
        var tYear=timenow.getFullYear();
        var tMonth=timenow.getMonth()+1 <10 ? "0"+(timenow.getMonth()+1):timenow.getMonth()+1;
        var tDate=timenow.getDate() <10 ? "0"+timenow.getDate():timenow.getDate();
        var tHour=timenow.getHours()<10 ? "0"+timenow.getHours():timenow.getHours();
        var tMinutes=timenow.getMinutes()<10 ? "0"+timenow.getMinutes():timenow.getMinutes();
        var tSeconds=timenow.getSeconds()<10 ? "0"+timenow.getSeconds():timenow.getSeconds();
        var t=tYear+"-"+tMonth+"-"+tDate+" "+tHour+":"+tMinutes+":"+tSeconds;
        show.innerHTML=t;
    },1000)

    //当前用户
    var str="";
    str = sessionStorage.obj;
    if(str==null){
        window.location.href="login.html";
    }else{
        var obj = $.parseJSON(str);
        console.log(obj);
        if(obj.springProfilesActiveEnum === "product"){
            $('#springProfilesActiveEnum').text("正式版");
        }else if(obj.springProfilesActiveEnum === "test"){
            $('#springProfilesActiveEnum').text("测试版");
        }else if(obj.springProfilesActiveEnum === "development"){
            $('#springProfilesActiveEnum').text("开发版");
        };
        $("#loginUserName").html(obj.name+'<span class="caret"></span>');
    }

})

//退出
$("#loginOut").click(function(){
    $.ajax({
        url: "../sys/subject/logout",
        type: "post",
        dataType:'json',
        contentType:'application/json',
        success: function(data){
            requestOk(data,'',function(){
                window.location.href="login.html";
            },customCodeError);
        },
        error:function(data){
        }
    });
});

//顶部导航
// $(".yY_top_nav li").click(function(){
//     $(this).addClass('nav_choose').siblings().removeClass('nav_choose');
//     $(this).find("a").addClass('ys_choose');
//     $(this).siblings().find('a').removeClass('ys_choose');
// })

//顶部导航和用户名的排序
var val_width;
var navbarToggle=$(".navbar-toggle");
$(function(){
    val_width=$('.container').width();
    if(val_width<1000){
        $(".yY_top_right").css("float","left");
    }else{
        $(".yY_top_right").css("float","right");
    }
    if(navbarToggle.is(":hidden")){
        $(".yY_top_left").removeClass("yY_top_left_bg");
    }else{
        $(".yY_top_left").addClass("yY_top_left_bg");
    }

    //获取侧导航class为left_nav的name值，截取最后一位数字，通过数字为顶部导航添加样式，
    // name值的结构为name="topNavBasis_数字，没添加一个页面都要添加一个对应的name属性，
    // name值后的数字代表对应的每个模块在顶部导航里的位置（从0开始）"
    var topNavVal = $('.left_nav').attr('name');
    topNavVal = topNavVal.substr(topNavVal.length-1,1);
    $('.yY_top_nav li').eq(topNavVal).addClass('nav_choose');
    $('.yY_top_nav li').eq(topNavVal).find("a").addClass('ys_choose');

})

$(window).resize(function() {
    val_width=$('.container').width();
    if(val_width<1000){
        $(".yY_top_right").css("float","left");
    }else{
        $(".yY_top_right").css("float","right");

    }
    if(navbarToggle.is(":hidden")){
        $(".yY_top_left").removeClass("yY_top_left_bg");
    }else{
        $(".yY_top_left").addClass("yY_top_left_bg");
    }
})



