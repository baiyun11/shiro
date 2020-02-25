'use strict';

$(function(){
    $(".headerTop").load("header.html");
    // $(".headerTop").load("../../header.html");
})

// $('body').append('<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" id="alertSuccess">' +
//     '<div class="modal-dialog modal-sm" role="document">' +
//     '<div class="modal-content">' +
//     '<div class="modal-body">' +
//     '</div>' +
//     '</div>' +
//     '</div>' +
//     '</div>');

// function examineEvent (statusVal,idval){
//     var idData = $(idval).next().val();
//     $('body').append('<div class="modal fade bs-example-modal-sm" id="delcfmModel">' +
//         '<div class="modal-dialog modal-sm">' +
//         '<div class="modal-content">' +
//         '<div class="modal-header">' +
//         '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>' +
//         '<h4 class="modal-title">提示信息</h4>' +
//         '</div>' +
//         '<div class="modal-body">' +
//         '<p>您确认要删除吗？</p>' +
//         '</div>' +
//         '<div class="modal-footer">' +
//         '<input type="hidden" id="url"/>' +
//         '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>' +
//         '<a  onclick="determine()" class="btn btn-success" data-dismiss="modal">确定</a>' +
//         '</div>' +
//         '</div>' +
//         '</div>' +
//         '</div>');
//     $('#delcfmModel').modal();
//     determine(statusVal,idData);
// }



$(".navbar-toggle").click(function(){
	$(".yY_top_left").addClass("yY_top_left_bg");
})


//左侧导航
$(".yY_left li").click(function(){
	
	//通用导航
	$(this).addClass('left_nav_choose').siblings().removeClass('left_nav_choose');
	$(this).children().eq(0).addClass('left_nav_choose_ys');
	$(this).siblings().children().eq(0).removeClass('left_nav_choose_ys');
})

//话术分析二级导航
$(".twoMenu li").click(function(){
	$(this).addClass("twoMenuBG").removeClass("left_nav_choose");
	$(this).siblings().removeClass("twoMenuBG");
	$(this).children().eq(0).addClass('menuColor').removeClass('left_nav_choose_ys ');
	$(this).siblings().find('a').removeClass('menuColor');
})

$(function(){
	//提示框不透明
	$(".alert").css("opacity","0");
})

//添加、删除、修改后的成功提示
function changeSuccess(a){
	$("#alertSuccess").modal('show');
	$("#alertSuccess").find(".modal-body").text(a);
	$("#alertSuccess").on("shown.bs.modal",function(){
		setTimeout(function(){
			$("#alertSuccess").modal('hide');
		},400);
	});
}

//时间戳转换
function changeDateFormat(d){
	var date=new Date(parseInt(d,10));
	var month = date.getMonth()+1 <10 ? "0"+ (date.getMonth()+1):date.getMonth()+1;
	var day = date.getDate() <10 ? "0"+date.getDate():date.getDate();
	var hour=date.getHours() <10 ? "0"+date.getHours():date.getHours();
	var minutes=date.getMinutes() <10 ? "0"+date.getMinutes():date.getMinutes();
	var seconds=date.getSeconds() <10 ? "0"+date.getSeconds():date.getSeconds();
	return date.getFullYear()+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds;
}

//分页
$("#skipBtn").click(function(){
	skip_page=$("#skipPage").val();
	$('#page').bootstrapPaginator("show",skip_page);
	render(skip_page);
})

function setPaginator(pageCurr,pageSum,callback){
	$("#page").bootstrapPaginator({
		bootstrapMajorVersion: 3,  //当前使用的是bootstrap的3版本
		currentPage: pageCurr,            //设置当前页
		numberOfPages:5,          //设置控件显示的页码数
		totalPages: pageSum,			   //设置总页数
		itemTexts:function(type,page,current){
			switch(type){
				case "first":
					return "第一页";
				case "prev":
					return "上一页";
				case "next":
					return "下一页";
				case "last":
					return "最后一页";
				case "page":
					return page;	
			} 
		},
	    onPageClicked:function(event,originalEvent,type,page){
	    	currPage=page;
	    	callback && callback();
	    },
	});
}

//请求成功处理
function requestOk(data,errMsg,callback,callbackError){
    if(data==undefined){
        changeSuccess("无法从服务器获取详细数据，请联系管理员!");
    }else if(data.code==0){
        callback(data);
    }else{
        callbackError(data,errMsg);
        return false;
    }
}

function customCodeError(data,errMsg){
    // var message=errMsg==''?'错误':errMsg+'发生错误';
    // message = message + ",错误码为：" + data.code;
    // console.log(message);
    var errCode = data.code;
    if(errCode == 7000) {
        if(data.msg=='未认证') window.location.href="login.html";
	}
    if(errCode == 7002) {
        if(data.msg=='未授权'){
            if($('#alertSuccess').length>0){
                changeSuccess("未授权，请联系管理员。");
                $('.row input,.row button').attr('disabled','disabled');
            }else{
                $('body').append('<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" id="alertSuccess">' +
                    '<div class="modal-dialog modal-sm" role="document">' +
                    '<div class="modal-content">' +
                    '<div class="modal-body">' +
                    '</div></div></div></div>');
                changeSuccess("未授权，请联系管理员。");
                $('.row input,.row button').attr('disabled','disabled');
                return false;
            }
        }
    }
    if(errCode == 6002){
        if(data.data=='模块类型不能重复！') $(".alert").html("<strong>模块类型不能重复，</strong>请重新输入。").animate({opacity:1},100);
        if(data.data=='当前车型模块配置名或配置码重复!') $(".alert").html("<strong>当前车型模块配置名或配置码重复，</strong>请重新输入。").animate({opacity:1},100);
    }
	if(errCode==7007){
        $(".alert").html("<strong>已存在！</strong>请重新输入。").animate({opacity:1},100);
	}
    if(errCode==7008){
        $(".warnWord").html(data.data).show();
    }
}

