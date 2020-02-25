/*
* @Author: zhang.wei121
* @Date:   2018-08-03 08:50:22
* @Last Modified by:   zhang.wei121
* @Last Modified time: 2018-08-03 08:50:22
*/

'use strict';

//分页

var val_page="";
function getData(params,callback){
	val_page=params.page-1;
	$.ajax({
		url:'../WordVersionEntity/find',
		type:'POST',
		data: JSON.stringify({page:val_page,size:10,property:"version",direction:"DESC"}),
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
		$("#edtion").html("");
		var dataVal = data.data;
		var arr = dataVal.content;
        if(arr==undefined){
            return false;
        }
		var html = "";
		for(var i = 0 ; i < arr.length ; i ++){
			var val_id=arr[i].id;
			var val_version = arr[i].version;
			var val_updateDescription = arr[i].updateDescription;
			var val_creatTime=changeDateFormat(arr[i].lastModifiedDate);
			var val_username=arr[i].lastModifiedSysUser;
			var val_issue=arr[i].issue;
			if(val_issue==="publish"){
				var issueStatus='已发布 | '+'<a class="issuePush" href="javascript:;"><span class="label label-warning">删除</span></a>';
			}else if(val_issue==="deleted"){
				var issueStatus='已删除';
			}else if(val_issue==="test"){
				var issueStatus='<a class="issuePush" href="javascript:;"><span class="label label-danger">发布</span></a>';
				$("#addEdtion").attr("disabled","disabled");
			}
			html = html + '<tr><td><div class="version_1"><a id="text_version" href="wordMannagement.html?id='+val_version+'&issue='+val_issue+'">' + val_version + '</a></div></td><td><div class="decription_1" title="'+val_updateDescription+'">' + val_updateDescription + '</div></td><td><div class="issue_1">'+issueStatus+'</div><input type="hidden" value="'+val_issue+'"/><input type="hidden" value="'+val_id+'"/></td><td><div class="username">'+val_username+'</div></td><td><div class="date_time">'+val_creatTime+'</div></td></tr>';
		}

		var num_p=dataVal.totalPages;
		var num_l=dataVal.totalElements;

		if(val_page===0){
			lastData=dataVal.content[0].version;
		}

		$("#num_pages").html("共 "+num_p+" 页");
		$("#num_lists").html("共 "+num_l+" 条数据");

		num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");

		$("#edtion").append(html);

		$("#edtion").find("tr").each(function(){
			var valIssueWord = $(this).find(".issue_1").text();
			if(valIssueWord==='已删除'){
				$(this).css("background","#f8f8f8");
				$(this).find("div").css("color","#8e8b8b");
				$(this).find("a").css("color","#8e8b8b");
			}
		})
		setPaginator(currPage, dataVal.totalPages , render);
	})
	
	skip_page="";
	$("#skipPage").val("");
}

render(currPage);



$(function(){
	//添加版本的form表单提交
	var valEdtion="";
	$("#addEdtion").click(function(){
		var num=$("#edtion").has("tr").length;
		if(num!=0){
			valEdtion=parseInt(lastData)+1;
			$("#edition").attr("disabled","disabled");
			$("#edition").val(valEdtion);
		}else{
			$("#edition").removeAttr("disabled","disabled");
			$("#edition").val("");
			$(".alert").html("<strong>提示：输入的版本号不得小于10001。</strong>").animate({opacity:1},100);
		}
		
	})
	
	
	$("#addEditionBtn").click(function() {
		valEdtion=$("#edition").val();
		if(valEdtion > 1001){
			if(valEdtion!="" || valEdtion!=null || valEdtion!=undefined){
				var val_version =valEdtion;
			}else{
				var val_version = $("#edition").val();
			}
			var reg = /^[0-9]+.?[0-9]*$/;
			if(!reg.test(val_version)){
				$(".alert").html("<strong>版本号只能为数字，</strong>请重新输入版本号！").animate({opacity:1},100);
				return false;
			}
			var val_updateDescription=$("#updateDectription").val();
			if(val_version!="" && val_updateDescription!=""){
				$.ajax({
					url:'../WordVersionEntity/add',
					type:'POST',
					dataType:'json',
					data:JSON.stringify({version:val_version,updateDescription:val_updateDescription}),
					contentType : "application/json",
					success:function(data){
                        requestOk(data,'',function(){
                            $('#modalEdition').modal('hide');
                            changeSuccess("添加成功！");
                                currPage=1;
                                render(currPage);
						},customCodeError);
					},
					error:function(data){
					}
				})
			}else{
				if(val_version==""){
					$(".alert").html("<strong>版本号不能为空，</strong>请输入版本号！").animate({opacity:1},100);
				}else if(val_updateDescription==""){
					$(".alert").html("<strong>版本更新说明不能为空，</strong>请输入版本更新说明！").animate({opacity:1},100);
				}
				return false;
			}
		}else{
			$(".alert").html("<strong>输入的版本号不得小于1001，</strong>请重新输入。").animate({opacity:1},100);
		}
		
	})

	//点击发布
	$(document).on("click",".issuePush",function(){
		var issueId=$(this).parent().next().next().val();
		var issueStatus=$(this).parent().next().val();
		var issueVersion=$(this).parents("tr").find("#text_version").text();
		var me=this;
		var status,valIssue;
		if(issueStatus==="test"){
			$.ajax({
				async: false,
				url:'../word/findByWordVersionEntity',
				type:'POST',
				data:JSON.stringify({object:{wordVersionEntity:{version:issueVersion}},page:val_page,size:10}),
				dataType:'json',
				contentType : "application/json",
				success:function(data){
                    requestOk(data,'',function(){
                        if(data.data.totalElements!=0){
                            status="发布";
                        }
					},customCodeError);
				},
				error:function(result){
				}
			})
			if(status=="发布"){
				valIssue="publish";
				var tf=confirm("确定要发布吗？");
			}else{
				$("#alertSuccess").modal('show');
				$("#alertSuccess").find(".modal-body").text("该词库版本内容为空，不能发布。");
				$("#alertSuccess").on("shown.bs.modal",function(){
					setTimeout(function(){
						$("#alertSuccess").find(".modal-body").text("");
						$("#alertSuccess").modal('hide');
					},400);
				});
				return;
			}
		}else if(issueStatus==="publish"){
			status="删除";
			valIssue="deleted";
			var tf=confirm("确定要删除吗？");
		}
		if(tf==true){
			$.ajax({
				url:'../WordVersionEntity/markIssue',
				type:'POST',
				data:JSON.stringify({id:issueId,issue:valIssue}),
				dataType:'json',
				contentType : "application/json",
				success:function(data){
                    requestOk(data,'',function(){
                        changeSuccess(status+"成功！");
                        $("#addEdtion").removeAttr("disabled","disabled");
						render(currPage);
					},customCodeError);
				},
				error:function(data){
				}
			})
		}
	})
})



