/*
* @Author: zhang.wei121
* @Date:   2018-08-03 08:50:22
* @Last Modified by:   zhang.wei121
* @Last Modified time: 2018-08-03 08:50:22
*/

'use strict';

//获取被点击地址栏里的参数值
var val_id=$.getUrlParam('id');
var val_issue=$.getUrlParam('issue');
$("#edition_word").val(val_id);
var val_id,val_page;

//页面右部分的列表数据的获取和呈现及分页
function getData(params,callback){
	val_page=params.page-1;
	$.ajax({
		url:'../word/findByWordVersionEntity',
		type:'POST',
		data:JSON.stringify({object:{wordVersionEntity:{version:val_id}},page:val_page,size:10}),
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
var newType,newAnswer,newServiceId;

function render(d){
	skip_page=="" ? currPage=currPage : currPage=d;
	getData({
		page: currPage,
		size: 10
	},function(data){
		$("#wordsList").html("");
		var html2="";
		var dataVal = data.data;
		if(dataVal.content==undefined){
            $('.page_navigation').css('display','none');
			return false;
		}
		for(var j=0; j<dataVal.content.length;j++){
			var val_wordType=dataVal.content[j].wordBean.wordType;
			var val_question=dataVal.content[j].wordBean.question;
			var val_answer=dataVal.content[j].wordBean.answer;
			var val_serviceId=dataVal.content[j].wordBean.serviceId;
			if (val_serviceId == undefined)
                val_serviceId = "";
			var val_version2=dataVal.content[j].wordVersionEntity.version;
			var val_updateTime=changeDateFormat(dataVal.content[j].lastModifiedDate);
			var username=dataVal.content[j].lastModifiedSysUser;
			var val_id=dataVal.content[j].id;
			html2=html2+'<tr>' +
				'<td><div class="version_1">'+val_version2+'</div></td>' +
				'<td><div class="wordType">'+val_wordType+'</div></td>' +
				'<td><div class="question" title="'+val_question+'">'+val_question+'</div></td>' +
				'<td><div class="anwser" title="'+val_answer+'">'+val_answer+'</div></td>' +
				'<td><div class="service_id">'+val_serviceId+'</div></td>' +
				'<td><div class="username">'+username+'</div></td>' +
				'<td><div class="date_time">'+val_updateTime+'</div></td>' +
				'<td class="operationBox"><div class="operation">' +
				'<a id="revise" href="#identifier2" data-toggle="modal"><span class="label label-info">修改</span></a>' +
                '<a id="del" href="javascript:;"><span class="label label-warning">删除</span></a>' +
				'<input type="hidden" value="'+val_id+'"/>' +
				'</div></td></tr>'
		}
		
		var num_p=dataVal.totalPages;
		var num_l=dataVal.totalElements;
		
		if(val_page===0){
			newType=dataVal.content[0].wordBean.wordType;
			newAnswer=dataVal.content[0].wordBean.answer;
			newServiceId=dataVal.content[0].wordBean.serviceId;
		}
		
		$("#num_pages").html("共 "+num_p+" 页");
		$("#num_lists").html("共 "+num_l+" 条数据");
		
		num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
		
		$("#wordsList").append(html2);
		
		if(val_issue!="test"){
			$("#addLexicon").attr("disabled","disabled");
			$(".operationBox").css("display","none");
		}
		
		setPaginator(currPage, dataVal.totalPages , render);
	})
	skip_page="";
	$("#skipPage").val("");
}
render(currPage);


$(function(){	
	
	//select里的三个文本类型
	$.ajax({
		url:'../word/getWordType',
		type:'POST',
		data:'',
		dataType:'json',
		contentType:"application/json",
		success:function(data){
            requestOk(data,'',function(){
                for(var k=0;k<data.data.length;k++){
                    $(".selectpicker").append('<option value="'+data.data[k]+'">'+data.data[k]+'</option>')
                }
                $('.selectpicker').selectpicker('refresh');
                $('.selectpicker').selectpicker('render');
            },customCodeError);
		},
		error:function(data){
		}
	})
	$(".selectpicker").selectpicker({noneSelectedText:'请选择'});

	$("#textType").change(function(){
		if(this.value === 'Tip'){
			$("#question-label").html('话术提示：');
            $("#answer-label").html('服务类型：');
            $("#answer").val("云端配置");
            $("#answer").attr("disabled","disabled");
		}else{
            $("#question-label").html('问题：');
            $("#answer-label").html('答案：');
            $("#answer").val("");
            $("#answer").removeAttr("disabled");
		}
	});

})



$("#addLexicon").click(function(){
    $(".addAlert").animate({opacity:0},100);
    $("#question").val('');
	var listNum=$("#wordsList").has("tr").length;
	if(listNum!=0){
		$("#textType").selectpicker("val",newType);
		$("#answer").val(newAnswer);
		if(newServiceId===undefined){
			$("#wordSviceId").val("");
		}else{
			$("#wordSviceId").val(newServiceId);
		}
	}
})


function getResult(){
	var typeChange = $("#textType").val();
	if(typeChange!=newType){
		$("#answer").val("");
		$("#wordSviceId").val("");
		$("#addwordsBtn").removeAttr("disabled","disabled");
	}
}


//添加话术的form表单提交

var reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g;
$("#addwordsBtn").click(function(){
	var val_textType = $("#textType").val();
    var val_question = $("#question").val();
    val_question = val_question.replace(reg,"");
	var val_answer = $("#answer").val();
	var val_wordSviceId =$("#wordSviceId").val();
	var statusCode='{\"errorCode\":5,\"errorDescription\":\"无效请求参数\"}';
	if(val_textType!="" && val_question!="" && val_answer!=""){
		$.ajax({
			url:'../word/add',
			type:'POST',
			dataType:'json',
			data:JSON.stringify({wordBean:{wordType:val_textType,question:val_question,answer:val_answer,serviceId:val_wordSviceId},wordVersionEntity:{version:val_id}}),
			contentType : "application/json",
			success:function(data){

                requestOk(data,'',function(){
                    $('#identifier1').modal('hide');
                    changeSuccess("添加成功！");
                    currPage=1;
                    render(currPage);
				},customCodeError);
			},
			error:function(data){
                // if(data.responseJSON){
					// if(data.responseJSON.errorCode===5){
					// 	$(".addAlert").html("<strong>该问题已存在！</strong>请重新输入。").animate({opacity:1},100);
					// }
                // }
			}
		});
	}else if(val_textType==""){
		$(".addAlert").html("<strong>文本类型不能为空，</strong>请选择文本类型！").animate({opacity:1},100);
	}else if(val_question==""){
		$(".addAlert").html("<strong>问题不能为空，</strong>请输入问题！").animate({opacity:1},100);
	}else if(val_answer==""){
		$(".addAlert").html("<strong>答案不能为空，</strong>请输入答案！").animate({opacity:1},100);
	}
	return false;
})


//点击删除指定数据
$(document).on("click","#del",function(){
	var val_id2=$(this).next().val();
	var tf=confirm("确定要删除这条数据吗？");
	if(tf==true){
		$.ajax({
			url:"../word/delete",
			type:"POST",
			data:JSON.stringify({id:val_id2}),
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

//修改某条数据
var xg_id,val_select;
$(document).on("click","#revise",function(){
	$("#edition_word_xg").val(val_id);
	val_select=$(this).parents("tr").find(".wordType").html();
	$("#textType_xg").selectpicker("val",val_select).attr("disabled","disabled");
	$(".bootstrap-select button").attr("disabled","disabled");
	$("#question_xg").val($(this).parents("tr").find(".question").html()).attr("disabled","disabled");
	$("#answer_xg").val($(this).parents("tr").find(".anwser").html());
	var valSId = $(this).parents("tr").find(".service_id").html();
	if(valSId==="undefined"){
		$("#wordSviceId_xg").val("");
	}else{
		$("#wordSviceId_xg").val(valSId);
	}
	xg_id=$(this).next().next().val();
	var xg_wordSviceId =$("#wordSviceId").val();
	
})

$("#addwordsBtn_xg").click(function(){
	
	var val_textType = $("#textType_xg").val();
	var val_question = $("#question_xg").val();
    val_question = val_question.replace(reg,"");
	var val_answer = $("#answer_xg").val();
	var xg_wordSviceId=$("#wordSviceId_xg").val();
	if(val_question != "" && val_answer != ""){
		$.ajax({
			url:'../word/add',
			type:'POST',
			dataType:'json',
			data:JSON.stringify({id:xg_id,wordBean:{wordType:val_textType,question:val_question,answer:val_answer,serviceId:xg_wordSviceId},wordVersionEntity:{version:val_id}}),
			contentType : "application/json",
			success:function(data){
                $('#identifier2').modal('hide');
                requestOk(data,'',function(){
                    changeSuccess("修改成功！");
                    currPage=1;
                    render(currPage);
				},customCodeError);
			},
			error:function(data){
			}
		})
	}else if(val_question==""){
		$(".xgAlert").html("<strong>问题不能为空，</strong>请输入问题！").animate({opacity:1},100);
	}else if(val_answer==""){
		$(".xgAlert").html("<strong>答案不能为空，</strong>请输入答案！").animate({opacity:1},100);
	}

})

//答案对话框的模糊检索
var searchText="";
var answer="";
$(".answerTxt").on({
    keyup : function(e){        
        var flag = e.target.isNeedPrevent;
        if(flag)  return;     
        txtCount(this) ;
        e.target.keyEvent = false ;
        
    },
    keydown : function(e){
        e.target.keyEvent = true ; 
    },
    input : function(e){
        if(!e.target.keyEvent){
        	txtCount(this);
        }        
    },
    compositionstart : function(e){
        e.target.isNeedPrevent = true ;
    },
    compositionend : function(e){
        e.target.isNeedPrevent = false;
        
    }
})


function txtCount(a) { 
	answer=$(a);
	var val_wordType=answer.parents("form").find("select").val();
	if(val_wordType === "Command"){ 
		console.log(answer.val());
		var val_word=answer.val();
		answer.next().find("ul").html("");
		answer.parent().parent().next().find("input").val("");
		var syHtml="";
		$.ajax({
			url:'../ServicesId/findByLike',
			type:'POST',
			async:false,
			data:JSON.stringify({object:{serviceDescription:val_word},page:0,size:10}),
			dataType:"json",
			contentType: "application/json",
			success:function(data){
                requestOk(data,'',function(){
                	var dataText = data.data;
                    if(dataText.totalElements!=0){
                        for(var i=0;i<dataText.content.length;i++){
                            var answerDescript=dataText.content[i].serviceDescription;
                            var val_serviceId=dataText.content[i].serviceId;
                            syHtml=syHtml+'<li>'+answerDescript+'<input type="hidden" value="'+val_serviceId+'"/></li>';
                        }
                        answer.next().find("ul").html(syHtml);
                        answer.next().show();
                        answer.next().find("li").each(function(){
                            var val_listWord = $(this).text();
                            if(val_word===val_listWord){
                                answer.parents(".change_group").next().find("input").val($(this).find("input").val());
                                answer.parents(".modal-body").next().find("button").removeAttr("disabled","disabled");
                                return false;
                            }else{
                                answer.parents(".change_group").next().find("input").val("");
                                answer.parents(".modal-body").next().find("button").attr("disabled","disabled");
                            }
                        })
                    }else{
                        answer.parents(".change_group").next().find("input").val("");
                        answer.parents(".modal-body").next().find("button").attr("disabled","disabled");
                        answer.next().hide();
                    }
				},customCodeError);
			},
			error:function(data){
			}
		})  
	}
}
 
//点击某一条模糊检索出来的数据，获取它的值，并赋值给textarea
$(document).on("click",".retrieval ul li",function(){

	searchText=$(this).text();
	var searchServiceId=$(this).find('input').val();
	answer.parents(".change_group").next().find("input").val(searchServiceId);
	answer.val(searchText);
	answer.parents(".modal-body").next().find("button").removeAttr("disabled","disabled");
	$(".retrieval").hide()

})
//点击网页任何空白地，检索弹框消失
$(document).click(function (event) {
	event.stopPropagation(); //阻止事件冒泡
	if (!$(this).hasClass("retrieval")){
		$(".retrieval").hide();
	}
});

