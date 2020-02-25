/*
* @Author: zhang.wei121
* @Date:   2018-07-25 15:04:01
* @Last Modified by:   zhang.wei121
* @Last Modified time: 2018-08-01 15:43:08
*/

'use strict';
$(function(){
	var listUserName,listName,listCenterId;
	$(".centerTitle h4").html("");
	$(".listUserName").html("");
	$(".listName").html("");
	$(".listRoot").html("");
	$(".listCreateUser").html("");
	$(".listCreateDate").html("");


	var personRoleList;
	//获取个人账户信息
	$.ajax({
		url:'../sys/subject/getCurrentUserInfo',
		type:'POST',
		dataType:'json',
		contentType : "application/json",
		success:function(data){
            requestOk(data,'',function(){
            	var dataVal = data.data;
                listCenterId=dataVal.id;
                listUserName=dataVal.username;
                listName=dataVal.name;
                //用户权限，后边可能会修改

                var listRoot=dataVal.sysRoleList[0].outName;
                personRoleList = dataVal.sysRoleList;
                var listCreateUser=dataVal.createdSysUser;
                var listCreateDate=changeDateFormat(dataVal.createdDate);
                $(".head2 p").html(listName);
                $(".listUserName").html(listUserName);
                $(".listName").html(listName);
                $(".listRoot").html(listRoot);
                $(".listCreateUser").html(listCreateUser);
                $(".listCreateDate").html(listCreateDate);
			},customCodeError)
		},
		error:function(data){
		}
	})
	
	
	//修改个人账户信息
	$(".alert").css("opacity","0");
	
	//点击修改按钮，为输入框添加原来的数据
	$("#xgCenterUser").click(function(){
		$("#xgAccount").val(listUserName);
		$("#xgUserName").val(listName);
	})
	
	$("#xgUserBtn").click(function(){
		var xgUser=$("#xgAccount").val();
		var xgName=$("#xgUserName").val();
		var xgPW=$("#xgUserPassword").val();
//		var reg= /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
//		if(!reg.test(xgUser)){
//			$(".alert").html("<strong>登录账号格式不正确，</strong>请重新输入！").animate({opacity:1},100);
//			return false;
//		}
		if(xgUser!="" && xgName!="" && xgPW!=""){
			$.ajax({
				url:'../sys/subject/updateCurrentUserInfo',
				type:'POST',
				data:JSON.stringify({id:listCenterId,username:xgUser,password:xgPW,name:xgName,SysRole:personRoleList}),
				dataType:'json',
				contentType:"application/json",
				success:function(data){
                    $('#modalCenter').modal('hide');
                    requestOk(data,'',function(){
                        $.ajax({
                            url: "../sys/subject/logout",
                            type: "POST",
							dataType:'json',
                            contentType:"application/json",
                            success: function(data){
                                requestOk(data,'',function(){
                                    window.location.href="login.html";
                                },customCodeError);
                            },
                            error:function(data){
                            }
                        });
					},customCodeError);
				},
				error:function(data){	
				}
			})
		}else if(xgName==""){
			$(".alert").html("<strong>姓名不能为空，</strong>请输入姓名！").animate({opacity:1},100);
		}else if(xgPW==""){
			$(".alert").html("<strong>密码不能为空，</strong>请输入密码！").animate({opacity:1},100);
		}
	})
	
	//退出
	$("#loginOut").click(function(){
		$.ajax({
			url: "../sys/subject/logout",
			type: "post",
			dataType:'json',
			success: function(data){
                requestOk(data,'',function(){
                    window.location.href="login.html";
                },customCodeError);
			},
			error:function(data){
			}
		});
	});
	
	$(".yY_left li").click(function(){
		$(this).addClass('left_nav_choose').siblings().removeClass('left_nav_choose');
		$(this).find("a").addClass('left_nav_choose_ys');
		$(this).siblings().find('a').removeClass('left_nav_choose_ys');
	})
	
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

function changeDateFormat(d){
	var date=new Date(parseInt(d,10));
	var month = date.getMonth()+1 <10 ? "0"+ (date.getMonth()+1):date.getMonth()+1;
	var day = date.getDate() <10 ? "0"+date.getDate():date.getDate();
	var hour=date.getHours() <10 ? "0"+date.getHours():date.getHours();
	var minutes=date.getMinutes() <10 ? "0"+date.getMinutes():date.getMinutes();
	var seconds=date.getSeconds() <10 ? "0"+date.getSeconds():date.getSeconds();
	return date.getFullYear()+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds;
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

function customCodeError(data){
    var errCode = data.code;
    if(errCode == 7000){
        if(data.data.message=='未认证') window.location.href="login.html";
    }
}
