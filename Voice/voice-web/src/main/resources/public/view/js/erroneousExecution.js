/*
* @Author: zhang.wei121
* @Date:   2018-08-03 08:50:22
* @Last Modified by:   zhang.wei121
* @Last Modified time: 2018-08-03 08:50:22
*/

'use strict';

//分页

function getData(params,callback,f){
	
	var val_page=params.page-1;
	$.ajax({
		url:'../ErrorTalk/findByExample',
		type:'POST',
		data: JSON.stringify({object:f,page:val_page,size:10}),
		dataType:'json',
		contentType : "application/json",
		success:function(data){
            requestOk(data,'',callback,customCodeError);
			console.log(callback);
		},
		error:function(response){
		}
	})
}

var ESearchIdData="";
ESearchIdData={};
var currPage = 1;
var skip_page="";
var warning="";
function render(d){
	skip_page=="" ? currPage=currPage : currPage=d;
	getData({
		page: currPage,
		size: 10
	},function(data){
		var dataVal = data.data;
		console.log(dataVal.content);
		var EE=dataVal.content;
		$("#erroneous").html("");
		var htmlEE="";
        if(EE==undefined){
            $("#erroneous").html(warning);
            $('.page_navigation').css('display','none');
            return false;
        }
		for(var i=0;i<EE.length;i++){
			var valRaxText = EE[i].rawText;
			var valServiceId = EE[i].serviceId;
			var valUserTalkEntityId = EE[i].userTalkEntityId;
			var valServiceDescription = EE[i].serviceDescription;
			htmlEE=htmlEE+'<tr><td><div class="rawTextDA"><a tabindex="0" role="button" data-toggle="popover" data-trigger="focus" data-content="'+valRaxText+'">'+valRaxText+'</a></div></td><td><div class="serviceDA">'+valUserTalkEntityId+'</div></td><td><div class="serviceIdDA">'+valServiceId+'</div></td><td><div class="AutoVINDA">'+valServiceDescription+'</div></td></tr>';
		}
		var num_p=dataVal.totalPages;
		var num_l=dataVal.totalElements;
		$("#num_pages").html("共 "+num_p+" 页");
		$("#num_lists").html("共 "+num_l+" 条数据");
		num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
		$("#erroneous").append(htmlEE);
        $('[data-toggle="popover"]').popover();
		setPaginator(currPage, dataVal.totalPages , render);
	},ESearchIdData)
	skip_page="";
	$("#skipPage").val("");
}
render(currPage);

//模糊检索服务类型
var errorServiceId="";
$("#EServiceIdBtn").click(function(){
	errorServiceId=$("#EServiceId").val();
	ESearchIdData={serviceId:errorServiceId};
	warning='<tr><td colspan="5"><div style="width:100%; height:40px; line-height:40px; text-align:center;">没有找到要查询的内容！</div></td></tr>';
    currPage=1;
	render(currPage);
})



