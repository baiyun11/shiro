'use strict';

	//获取用户列表及分页
	var val_name=$.getUrlParam('name');
	var val_page="";
	function getData(params,callback){
		val_page=params.page;
		
		$.ajax({
			url:'../common/UserRequestLog/get',
			type:'POST',
			data: JSON.stringify({page:val_page,size:params.size,object:{commandUserName:val_name}}),
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
	var lastData="";
	function render(d){
		skip_page=="" ? currPage=currPage : currPage=d;
		getData({
			page: currPage,
			size: 10
		},function(data){
			$("#logLsit").html("");
			var userLog = data.data.content;
			var logHtml = "";
            if(userLog==undefined) {
                $('.page_navigation').css('display','none');
                return false;
            }
			for(var i = 0 ; i < userLog.length ; i ++){
//				var val_ID=userLog[i].id;
				var val_commandUserName=userLog[i].commandUserName;
				var val_commandNamet=userLog[i].commandName;
				var val_commandTime=changeDateFormat(userLog[i].commandTime);
				var val_ipAddress=userLog[i].ipAddress;
				var oderNum=(currPage-1)*10+i+1;
				logHtml = logHtml + '<tr><td><div class="oderNum">'+oderNum+'</div></td><td><div class="commandUser">'+val_commandUserName+'</div></td><td><div class="commandName">'+val_commandNamet+'</div></td><td><div class="date_time">'+val_commandTime+'</div></td><td><div class="ipAdress">'+val_ipAddress+'</div></td></tr>'
			}
			var num_p=data.data.totalPages;
			var num_l=data.data.totalElements;
			$("#num_pages").html("共 "+num_p+" 页");
			$("#num_lists").html("共 "+num_l+" 条数据");
			num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
			$("#logLsit").append(logHtml);
			setPaginator(currPage, data.data.totalPages , render);
		})
		
		skip_page="";
		$("#skipPage").val("");
	}
	render(currPage);