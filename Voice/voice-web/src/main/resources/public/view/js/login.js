'use strict';
$(function(){
	
	//提示框不透明
	$(".alert").css({"opacity":"0","display":"none"});
	
	//背景图片
	$("body").css({"background":"url(images/login_bg.jpg) fixed center","background-size":"cover"});
	
	$("#loginUser,#loginPassword").focus(function(){
		$(".alert").css("display","none");
	})
	
	//登录页
	$(".loginBtn").click(function(){
		var val_user=$("#loginUser").val();
//		var reg= /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
//		if(!reg.test(xgUser)){
//			$(".alert").html("<strong>登录账号格式不正确，</strong>请重新输入！").animate({opacity:1},100);
//			return false;
//		}
		var val_password=$("#loginPassword").val();
		if(val_user=="" || val_user==null || val_user==undefined){
			$("#loginUser").attr("data-content","用户名不能为空！")
			$("#loginUser").popover('show');
			$("#loginUser").focus(function(){
				$("#loginUser").popover('destroy');
			})
			return false;
		}else if(val_password=="" || val_password==null || val_password==undefined){
			$("#loginPassword").attr("data-content","密码不能为空！")
			$("#loginPassword").popover('show');
			$("#loginPassword").focus(function(){
				$("#loginPassword").popover('destroy');
			})
			return false;
		}else{
			$.ajax({
				url:'../sys/subject/login',
				type:'POST',
				data: {username: val_user ,password: val_password},
				dataType:'json',
				success:function(data){
                    requestOk(data,'',function(){
                        sessionStorage.obj = JSON.stringify(data.data);
						var resetStatus = data.data.resetRootPassword;
                        if(resetStatus == true)
                        	$('#modalLogin').modal('show');
                        else
                        	location.href='index.html';
					},function(){
                        if(data.code==7001){
                            $(".alert").css("display","block").html("<strong>用户名或密码错误！</strong>").animate({opacity:1},100);
                        }
					});
				},
				error:function(data){
				}
			})
		}
	})
})
var loginId,loginName,loginUserName,sysRoleList;
$('#modalLogin').on('shown.bs.modal',function(e){
	$.ajax({
		url:'../sys/subject/getCurrentUserInfo',
		type:'POST',
		dataType:'json',
		contentType:'application/json',
		success:function(data){
            requestOk(data,'',function(){
                loginId = data.data.id;
                loginName = data.data.name;
                loginUserName = data.data.username;
                sysRoleList = data.data.sysRoleList;
                console.log(sysRoleList);
			},customCodeError);
		},
		error:function(data){
		}
	})
})

//修改密码
$('#addReviseBtn').click(function(){
	var newLoginPW = $('#newPassWord').val();
	var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,}$/;
	if(!reg.test(newLoginPW)){
		$('.alertPW').css('display','block').html("<strong>密码格式不正确</strong>").animate({opacity:1},100);
		return false;
	}
	$.ajax({
		url:'../sys/subject/updateCurrentUserInfo',
		type:'POST',
        data:JSON.stringify({id:loginId,username:loginUserName,password:newLoginPW,name:loginName,SysRole:sysRoleList}),
		dataType:'json',
		contentType:'application/json',
		success:function(data){
            requestOk(data,'',function(){
                $.ajax({
                    url: "../sys/subject/logout",
                    type: "post",
					dataType:'json',
					contentType:'application/json',
                    success: function(data){
                        window.location.href="login.html";
                    },
                    error:function(data){
                    }
                });
			},customCodeError);
		},
		error:function(data){
		}
	})
});


//取消修改并退出登录
$("#cancelLogin,#closeBox").click(function(){
	$.ajax({
		url:'../sys/subject/logout',
		type:'POST',
		dataType:'json',
        contentType:'application/json',
        success: function(data){
            window.location.href="login.html";
        },
		error:function(data){
		}
	})
})

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
    if(errCode == 7000) {
        if(data.msg=='未认证') window.location.href="login.html";
    }
}


