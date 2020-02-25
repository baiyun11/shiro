'use strict';
//获取用户列表及分页
var val_page="";
function getData(params,callback){
	val_page=params.page;
	
	$.ajax({
		url:'../sys/user/select',
		type:'POST',
		data: JSON.stringify({page:val_page,size:params.size}),
		dataType:'json',
		contentType : "application/json",
		success:function(data){
            requestOk(data,'',callback,customCodeError);
		},
		error:function(response){
		}
	})
}
var currPage = 1;
var skip_page="";

function render(d){
	skip_page=="" ? currPage=currPage : currPage=d;
	getData({
		page: currPage,
		size: 10
	},function(data){
		$("#userLsit").html("");
		var user =data.data.content;
		var userHtml = "";
        if(user==undefined) {
            $('.page_navigation').css('display','none');
            return false;
        }
		for(var i = 0 ; i < user.length ; i ++){
			var val_userId=user[i].id;
			var val_account=user[i].username;
			var val_userName=user[i].name;
			var sysRoot = user[i].sysRoleList;
			var oderNum=(currPage-1)*10+i+1;
			var delHtml="";
			val_account === "superAdmin" ? delHtml="":delHtml='<a id="del" href="javascript:;"><span class="label label-warning">删除</span></a>';
            var sn="";
            if(sysRoot==undefined){
            	return false;
			}else{
                for(var n=0;n<sysRoot.length;n++) {
                    sn += sysRoot[n].outName + '，';
                }
                sn = sn.substring(0,sn.length-1);
			}

            sn = sn.substring(0,sn.length-1);
			userHtml = userHtml + '<tr>' +
				'<td><div class="oderNum">'+oderNum+'</div><input type="hidden" value="'+val_userId+'" /></td>' +
				'<td><div class="addName">'+val_account+'</div></td>' +
				'<td><div class="fullName">'+val_userName+'</div></td>' +
                '<td><div class="rootName"><a tabindex="0" role="button" data-toggle="popover" data-trigger="focus" data-content="'+sn+'">'+sn+'</a></div></td>' +
				'<td><div class="operation2">' +
				'<a id="resetPW" href="javascript:;"><span class="label label-primary">重置密码</span></a>' +
				'<a id="userlog" href="userLog.html?name='+val_account+'"><span class="label label-success">日志</span></a>' +
                delHtml +
				'</div>' +
				'</td>' +
				'</tr>'
		}
		var num_p=data.data.totalPages;
		var num_l=data.data.totalElements;
		$("#num_pages").html("共 "+num_p+" 页");
		$("#num_lists").html("共 "+num_l+" 条数据");
		num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
		$("#userLsit").append(userHtml);
		$('[data-toggle="popover"]').popover();
		setPaginator(currPage, data.data.totalPages , render);
	})
	skip_page="";
	$("#skipPage").val("");
}
render(currPage);
	
$(function(){
	//点击添加新用户按钮，自动加载用户权限
	$("#addUser").click(function(){
		$.ajax({
			url:'../sys/role/select',
			type:'POST',
			dataType:'json',
			asncy:false,
			contentType:'application/json',
			success:function(data){
                requestOk(data,'',function(){
                    var roleHtml='';
                    var dataVal = data.data;
                    for(var k=0;k<dataVal.length;k++){
                        var roleVal=dataVal[k].id;
                        var roleName=dataVal[k].outName;
                        roleHtml+='<label class="checkbox-inline">' +
                            '<input type="checkbox" id="inlineCheckbox'+(k+1)+'" value="'+roleVal+'"> '+roleName+'</label>';
                    }
                    $(".userRoles").html(roleHtml);
                    //复选框样式
                    $('.userRoles input[type=checkbox]').on('ifCreated ifClicked ifChanged ifChecked ifUnchecked ifDisabled ifEnabled ifDestroyed', function(event){}).iCheck({
                        checkboxClass: 'icheckbox_minimal-aero',
                        increaseArea: '20%',
                    });
				},customCodeError);
			},
			error:function(data){
			}
		})
	});

	//添加新用户
	$("#addUserBtn").click(function(){
		var val_account=$("#account").val();
		var val_name=$("#userName").val();
		// var val_root=$("#userRoot").val();
		var reg= /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        var roleLength = $("input[type=checkbox]:checked").length;
		if(!reg.test(val_account)){
			$(".alert").html("<strong>登录账号格式不正确，</strong>请重新输入！").animate({opacity:1},100);
			return false;
		}else if(roleLength<1){
            $(".alert").html("<strong>至少选择一个用户角色，</strong>请选择！").animate({opacity:1},100);
            return false;
		}else{
            var arr= new Array();
            var sysRole= '[';
            $("input[type=checkbox]:checked").each(function(i){
                arr[i]=$(this).val();
                sysRole = sysRole + '{"id":"' + arr[i] + '"},';
            });
            sysRole = sysRole.substring(0,sysRole.length-1) + ']';
            sysRole = $.parseJSON(sysRole);
		}
		if(val_account!="" && val_name!=""){
			$.ajax({
				url:'../sys/user/insert',
				type:'POST',
				data:JSON.stringify({username:val_account,password:123456,name:val_name,sysRoleList:sysRole}),
				dataType:'json',
				contentType:"application/json",
				success:function(data){
                    requestOk(data,'',function(){
                        $('#modalUser').modal('hide');
                        changeSuccess("添加成功！");
                        currPage=1;
                        render(currPage);
					},customCodeError);
				},
				error:function(data){
				}
			})
		}else if(val_name==""){
				$(".alert").html("<strong>姓名不能为空，</strong>请输入姓名！").animate({opacity:1},100);
			}
	})

	//重置输入框
	$("#resetBtn").click(function(){
		$("#account").val("");
		$("#userName").val("");
		$("#userRoot").val("");
	})
	
	//为指定用户重置密码
	$(document).on("click","#resetPW",function(){
		var resetId=$(this).parents("tr").find("input").val();
		var resetUser=$(this).parents("tr").find(".addName").html();
		var tf=confirm("确定要为这条数据重置密码吗？");
		if(tf==true){
			$.ajax({
				url:"../sys/user/resetPassword",
				type:"POST",
				data:JSON.stringify({id:resetId,username:resetUser}),
				dataType:"json",
				contentType : "application/json",
				success:function(data){
                    requestOk(data,'',function(){
                        changeSuccess("重置密码成功！");
                    },customCodeError);
				},
				error:function(data){
				}
			})
		}
	})
	
	//点击删除指定用户
	$(document).on("click","#del",function(){
		var val_delId=$(this).parents("tr").find(".oderNum").next().val();
		var val_delUser=$(this).parents("tr").find(".addName").html();
		var tf=confirm("确定要删除这条数据吗？");
		if(tf==true){
			$.ajax({
				url:"../sys/user/delete",
				type:"POST",
				data:JSON.stringify({id:val_delId,username:val_delUser}),
				dataType:"json",
				contentType : "application/json",
				success:function(data){
                    requestOk(data,'',function(){
                        changeSuccess("删除成功！");
                        render(currPage);
                    },customCodeError);
				},
				error:function(data){
				}
			})
		}
	})
})