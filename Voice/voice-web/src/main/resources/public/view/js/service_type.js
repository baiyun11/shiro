/*
* @Author: zhang.wei121
* @Date:   2018-08-03 08:50:22
* @Last Modified by:   zhang.wei121
* @Last Modified time: 2018-08-03 08:50:22
*/

'use strict';

//页面右部分的列表数据的获取和呈现及分页
function getData(params,callback,c){
	var val_page=params.page-1;
	var val_size=params.size;
	if(c==="../ServicesType/get"){
		var f=JSON.stringify({page:val_page,size:val_size});
	}else{
		var f=JSON.stringify({object:{type:searchText},page:val_page,size:val_size});
	}
	$.ajax({
		url:c,
		type:'POST',
		data:f,
		dataType:'json',
		contentType: "application/json",
		success:function(data){
			requestOk(data,'',callback,customCodeError);
		},
		error:function(response){
		}
	})
}

var searchUrl="";
searchUrl='../ServicesType/get';
var currPage = 1;
var skip_page="";
var warning="";
function render(d){
	skip_page=="" ? currPage=currPage : currPage=d;
	getData({
		page: currPage,
		size: 10
	},function(data){
		$("#serviceType").html("");
		var service_html1="";
		var dataVal = data.data;
        if(dataVal.content==undefined) {
            $("#serviceType").html(warning);
            $('.page_navigation').css('display','none');
            return false;
        }
		for(var i=0; i<dataVal.content.length; i++){
			var time=changeDateFormat(dataVal.content[i].lastModifiedDate);
			var username=dataVal.content[i].lastModifiedSysUser;
			var service_svId=dataVal.content[i].id;
			service_html1=service_html1+'<tr><td><input type="hidden" value="'+service_svId+'" /><div class="wordType"><a href="service_id.html?Stype='+dataVal.content[i].type+'">'+dataVal.content[i].type+'</a></div></td><td><div class="username">'+username+'</div></td><td><div class="date_time">'+time+'</div></td><td><div class="operation"><a id="del" href="javascript:;">删除</a></div></td></tr>';
		}
		var num_p=dataVal.totalPages;
		var num_l=dataVal.totalElements;
		$("#num_pages").html("共 "+num_p+" 页");
		$("#num_lists").html("共 "+num_l+" 条数据");
		num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
		$("#serviceType").append(service_html1);
		setPaginator(currPage, dataVal.totalPages , render);
	},searchUrl)
	skip_page="";
	$("#skipPage").val("");
}
render(currPage);

$(function(){
	//添加服务类型
	$("#addService").click(function(){
		var svType = $("#service_type").val();
		if(svType != ""){
			$.ajax({
				url:'../ServicesType/add',
				type:'POST',
				data:JSON.stringify({type:svType}),
				dataType:'json',
				contentType: "application/json",
				success:function(data){
                    requestOk(data,'',function(){
                        $('#modalST').modal('hide');
                        changeSuccess("添加成功！");
                        currPage=1;
                        render(currPage);
					},customCodeError);
				},
				error:function(data){
				}
			})
		}else if(svType=="" || svType==null || svType==undefined){
			$(".alert").html("<strong>服务类型不能为空，</strong>请输入服务类型！").animate({opacity:1},100);
		}
		return false;
	})
	
	//删除指定服务类型
	$(document).on("click","#del",function(){
		var scid = $(this).parents("tr").find("input").val();
		var tf=confirm("确定要删除这条数据吗?");
		if(tf==true){
			$.ajax({
				url:'../ServicesType/delete',
				type:'POST',
				data:JSON.stringify({id:scid}),
				dataType:'json',
				contentType: "application/json",
				success:function(data){
                    requestOk(data,'',function(){
                        changeSuccess("删除成功！");
                        render(currPage);
					},customCodeError);
				},
				error:function(XMLHttpRequest,textStatus,errorThrown){
				}
			})
		}
		
	})
	
})


//去掉输入框里的回显
$("#addServiceType").click(function(){
	$("#service_type").val('');
    $(".alert").animate({opacity:0},100);
})

//模糊检索服务类型
var searchText="";
$("#searchTypeBtn").click(function(){
	searchText=$("#searchType").val();
	searchUrl='../ServicesType/findByLikeType';
	warning='<tr><td colspan="4"><div style="width:100%; height:40px; line-height:40px; text-align:center;">没有找到要查询的内容！</div></td></tr>';
    currPage=1;
	render(currPage);
})




