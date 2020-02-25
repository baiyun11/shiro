/*
* @Author: zhang.wei121
* @Date:   2018-08-03 08:50:22
* @Last Modified by:   zhang.wei121
* @Last Modified time: 2018-08-03 08:50:22
*/

'use strict';

var val_type=$.getUrlParam('Stype');
$("#service_type2").val(val_type);

//页面右部分的列表数据的获取和呈现及分页
function getData(params,callback,f){
	var val_page=params.page-1;
	var val_size=params.size;
	$.ajax({
		url:'../ServicesId/findByLike',
		type:'POST',
		data:JSON.stringify({object:f,page:val_page,size:val_size}),
		dataType:'json',
		contentType: "application/json",
		success:function(data){
            requestOk(data,'',callback,customCodeError);
		},
		error:function(response){
		}
	})
}
var searchIdData="";
searchIdData={servicesType:{type:val_type}};
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
		$("#serviceId").html("");
		var html_id="";
        if(dataVal.content==undefined) {
            $("#serviceId").html(warning);
            $('.page_navigation').css('display','none');
            return false;
        }
		for(var j=0;j<dataVal.content.length;j++){
			var time=changeDateFormat(dataVal.content[j].lastModifiedDate);
			html_id=html_id+'<tr><td><div class="wordType">'+val_type+'</div></td><td><div class="service_id">'+dataVal.content[j].serviceId+'</div></td><td><div class="decription_service" title="'+dataVal.content[j].serviceDescription+'">'+dataVal.content[j].serviceDescription+'</div></td><td><div class="username">'+dataVal.content[j].lastModifiedSysUser+'</div></td><td><div class="date_time">'+time+'</div></td><td><div class="operation"><a id="del" href="javascript:;"><span class="label label-warning">删除</span></a></div></td></tr>';
		}
		var num_p=dataVal.totalPages;
		var num_l=dataVal.totalElements;
		$("#num_pages").html("共 "+num_p+" 页");
		$("#num_lists").html("共 "+num_l+" 条数据");
		num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
		$("#serviceId").append(html_id);
		
		setPaginator(currPage, dataVal.totalPages, render);
	},searchIdData)
	skip_page="";
	$("#skipPage").val("");
}
render(currPage);

$(function(){
	var val_serviceId="";
	$("#service_id").blur(function(){
		val_serviceId=$(this).val();
		var reg = /^[0-9]+.?[0-9]*$/;
		if(!reg.test(val_serviceId)){
			$(".alert").html("<strong>服务码只能为数字，</strong>请重新输入服务码！").animate({opacity:1},100);
			$("#addserviceID").attr("disabled","disabled");
			return false;
		}else{
			$("#addserviceID").removeAttr("disabled","disabled");
		}
	})

	//添加服务码
	$("#addserviceID").click(function(){
		var val_serviceId=$("#service_id").val();
		var val_serviceDst=$("#service_description").val();
		if(val_serviceId!="" && val_serviceDst!=""){
			$.ajax({
				url:'../ServicesId/add',
				type:'POST',
				data:JSON.stringify({serviceId:val_serviceId,serviceDescription:val_serviceDst,servicesType:{type:val_type}}),
				dataType:'json',
				contentType: "application/json",
				success:function(data){
                    requestOk(data,'',function(){
                        $('#identifier1').modal('hide');
                        changeSuccess("添加成功！");
                        currPage=1;
                        render(currPage);
					},customCodeError);
				},
				error:function(data){
				}
			})
		}else if(val_serviceId==""){
			$(".alert").html("<strong>服务码不能为空，</strong>请输入服务码！").animate({opacity:1},100);
			return false;
		}else if(val_serviceDst==""){
			$(".alert").html("<strong>服务说明不能为空，</strong>请输入服务说明！").animate({opacity:1},100);
			return false;
		}
	})

	//删除指定数据
	$(document).on('click',"#del",function(){
		var val_svId=$(this).parents("tr").find(".service_id").html();
		var val_svDpt=$(this).parents("tr").find(".decription_service").html();
		var val_svType=$(this).parents("tr").find(".wordType").html();
		var tf=confirm("确定要删除这条数据吗？");
		if(tf==true){
			$.ajax({
				url:'../ServicesId/delete',
				type:'POST',
				data:JSON.stringify({serviceId:val_svId,serviceDescription:val_svDpt,servicesType:{type:val_svType}}),
				dataType:'json',
				contentType: "application/json",
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

//去掉输入框里的回显
$("#addserviceCode").click(function(){
    $(".alert").animate({opacity:0},100);
	$("#service_id").val('');
	$("#service_description").val('');
})

//模糊检索服务码
var val_word="";
$("#search_btn").click(function(){
	val_word=$("#search_word").val();
	warning='<tr><td colspan="6"><div style="width:100%; height:40px; line-height:40px; text-align:center;">没有找到要查询的内容！</div></td></tr>';
	searchIdData={serviceDescription:val_word,servicesType:{type:val_type}};
    currPage=1;
	render(currPage);
})
		
