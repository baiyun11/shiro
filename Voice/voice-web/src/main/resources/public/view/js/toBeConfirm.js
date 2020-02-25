'use strict';

//分页和数据呈现


function getData(params,callback,f,g){
	var val_page=params.page-1;
	$.ajax({
		url:g,
		type:'POST',
		data: JSON.stringify({object:f,page:val_page,size:10}),
		dataType:'json',
		contentType : "application/json",
		success:function(data){
            requestOk(data,'',callback,customCodeError);
		},
		error:function(response){
		}
	})
}
var ESearchIdData;
ESearchIdData={};
var toBeSureUrl ='';
toBeSureUrl ='../UnconfirmedTalk/findByExample';
var warning="";
warning=function(){
    $("#toBeConfirm").html("");
}
var searchServiceId="";
var currPage = 1;
var skip_page="";

var confirmSuccess;
confirmSuccess=function(data){
    var dataVal = data.data;
    var EE=dataVal.content;
    $("#toBeConfirm").html("");
    var htmlEE="";
    if(EE==undefined) {
        warning();
        $('.page_navigation').css('display','none');
        return false;
    }
    for(var i=0;i<EE.length;i++){
        var valRaxText = EE[i].rawText;
        var valServiceId = EE[i].serviceId;
        var valUserTalkEntityId = EE[i].userTalkEntityId;
        var valServiceDescription = EE[i].serviceDescription;
        htmlEE=htmlEE+'<tr>' +
            '<td><div class="rawTextDA"><a tabindex="0" role="button" data-toggle="popover" data-trigger="focus" data-content="'+valRaxText+'">'+valRaxText+'</a></div></td>' +
            '<td><div class="serviceDA">'+valUserTalkEntityId+'</div></td>' +
            '<td><div class="serviceIdDA">'+valServiceId+'</div></td>' +
            '<td><div class="AutoVINDA">'+valServiceDescription+'</div></td>' +
            '<td class="operationBox">' +
            '<div class="operation">' +
            '<a class="turnTrue" href="javascript:;"><span class="label label-success">转正确库</span></a>' +
            '<a class="turnFalse" href="javascript:;"><span class="label label-danger">转错误库</span></a>' +
            '<input type="hidden" value="'+valRaxText+'"/>' +
            '</div></td></tr>';
    }
    var num_p=dataVal.totalPages;
    var num_l=dataVal.totalElements;
    $("#num_pages").html("共 "+num_p+" 页");
    $("#num_lists").html("共 "+num_l+" 条数据");
    num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
    $("#toBeConfirm").append(htmlEE);
    $('[data-toggle="popover"]').popover();
    setPaginator(currPage, data.data.totalPages , render);
}

function render(d){
	skip_page=="" ? currPage=currPage : currPage=d;
	getData({
		page: currPage,
		size: 10
	},function(data){
        confirmSuccess(data);

	},ESearchIdData,toBeSureUrl)
	skip_page="";
	$("#skipPage").val("");
}
render(currPage);

//待确认话术分析
$('#myTabs li:eq(0) a[data-toggle="tab"]').on('show.bs.tab', function () {
    toBeSureUrl ='../UnconfirmedTalk/findByExample';
    ESearchIdData={};
    currPage=1;
    render(currPage);
})

//待确定话术分析查询功能

$("#toBeConfirmServiceIdBtn").click(function(){
    toBeSureUrl ='../UnconfirmedTalk/findByExample';
    searchServiceId=$("#toBeConfirmServiceId").val();
	ESearchIdData= {serviceId:searchServiceId};
    warning=function(){
        $("#toBeConfirm").html('<tr><td colspan="5"><div style="width:100%; height:40px; line-height:40px; text-align:center;">没有找到要查询的内容！</div></td></tr>');
    }
    currPage=1;
	render(currPage);
})


//人工正确话术分析

    $('#myTabs li:eq(1) a[data-toggle="tab"]').on('shown.bs.tab', function () {
        toBeSureUrl='../ManualCorrectTalk/findByExample';
        ESearchIdData={};
        confirmSuccess=function(data){
            var AS=data.data.content;
            $("#artificialCorrect").html("");
            var htmlAS="";
            if(AS==undefined) {
                warning();
                $('.page_navigation').css('display','none');
                return false;
            }
            for(var i=0;i<AS.length;i++){
                var valRaxText = AS[i].rawText;
                var valServiceId = AS[i].serviceId;
                var valUserTalkEntityId = AS[i].userTalkEntityId;
                var valServiceDescription = AS[i].serviceDescription;
                var valLastModifiedSysUser = AS[i].lastModifiedSysUser;
                var valTime = changeDateFormat(AS[i].lastModifiedDate);
                htmlAS=htmlAS+'<tr>' +
                    '<td><div class="rawTextDA"><a tabindex="0" role="button" data-toggle="popover" data-trigger="focus" data-content="'+valRaxText+'">'+valRaxText+'</a></div></td>' +
                    '<td><div class="serviceDA">'+valUserTalkEntityId+'</div></td>' +
                    '<td><div class="serviceIdDA">'+valServiceId+'</div></td>' +
                    '<td><div class="AutoVINDA">'+valServiceDescription+'</div></td>' +
                    '<td><div class="AutoVINDA">'+valLastModifiedSysUser+'</div></td>' +
                    '<td><div class="date_time">'+valTime+'</div></td>' +
                    '</tr>';
            }
            var num_p=data.data.totalPages;
            var num_l=data.data.totalElements;
            $("#num_pages").html("共 "+num_p+" 页");
            $("#num_lists").html("共 "+num_l+" 条数据");
            num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
            $("#artificialCorrect").append(htmlAS);
            $('[data-toggle="popover"]').popover();
            setPaginator(currPage, data.data.totalPages , render);
        }
        warning=function(){
            $("#artificialCorrect").html('');
        }
        currPage=1;
        render(currPage);
    })


//人工正确话术分析查询功能
$("#AconfirmServiceIdBtn").click(function(){
    toBeSureUrl ='../ManualCorrectTalk/findByExample';
    searchServiceId=$("#AconfirmServiceId").val();
    ESearchIdData= {serviceId:searchServiceId};
    warning=function(){
        $("#artificialCorrect").html('<tr><td colspan="5"><div style="width:100%; height:40px; line-height:40px; text-align:center;">没有找到要查询的内容！</div></td></tr>');
    }
    currPage=1;
    render(currPage);
})



//人工错误话术分析
$('#myTabs li:eq(2) a[data-toggle="tab"]').on('shown.bs.tab', function () {
    toBeSureUrl='../ManualErrorTalkController/findByExample';
    ESearchIdData={};
    confirmSuccess=function(data){
        var AE=data.data.content;
        $("#artificialError").html("");
        var htmlAS="";
        if(AE==undefined) {
            warning();
            $('.page_navigation').css('display','none');
            return false;
        }
        for(var i=0;i<AE.length;i++){
            var valRaxText = AE[i].rawText;
            var valServiceId = AE[i].serviceId;
            var valUserTalkEntityId = AE[i].userTalkEntityId;
            var valServiceDescription = AE[i].serviceDescription;
            var valLastModifiedSysUser = AE[i].lastModifiedSysUser;
            var valTime = changeDateFormat(AE[i].lastModifiedDate);
            htmlAS=htmlAS+'<tr>' +
                '<td><div class="rawTextDA"><a tabindex="0" role="button" data-toggle="popover" data-trigger="focus" data-content="'+valRaxText+'">'+valRaxText+'</a></div></td>' +
                '<td><div class="serviceDA">'+valUserTalkEntityId+'</div></td>' +
                '<td><div class="serviceIdDA">'+valServiceId+'</div></td>' +
                '<td><div class="AutoVINDA">'+valServiceDescription+'</div></td>' +
                '<td><div class="AutoVINDA">'+valLastModifiedSysUser+'</div></td><' +
                'td><div class="date_time">'+valTime+'</div></td>' +
                '</tr>';
        }
        var num_p=data.data.totalPages;
        var num_l=data.data.totalElements;
        $("#num_pages").html("共 "+num_p+" 页");
        $("#num_lists").html("共 "+num_l+" 条数据");
        num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
        $("#artificialError").append(htmlAS);
        $('[data-toggle="popover"]').popover();
        setPaginator(currPage, data.data.totalPages , render);
    }
    warning=function(){
        $("#artificialError").html('');
    }
    currPage=1;
    render(currPage);
})

//人工错误话术分析查询功能
$("#AErrorServiceIdBtn").click(function(){
    toBeSureUrl ='../ManualErrorTalkController/findByExample';
    searchServiceId=$("#AErrorServiceId").val();
    ESearchIdData= {serviceId:searchServiceId};
    warning=function(){
        $("#artificialError").html('<tr><td colspan="5"><div style="width:100%; height:40px; line-height:40px; text-align:center;">没有找到要查询的内容！</div></td></tr>');
    }
    currPage=1;
    render(currPage);
})

//人工转正确或错误库
function artificialChange(speechId,url){
    var rawTextVal = $(speechId).parents('tr').find('.rawTextDA').text();
    var serviceIdVal = $(speechId).parents('tr').find('.serviceIdDA').text();
    var serviceDAVal = $(speechId).parents('tr').find('.serviceDA').text();
    $.ajax({
        url:url,
        type:'POST',
        data:JSON.stringify({rawText:rawTextVal,serviceId:serviceIdVal,userTalkEntityId:serviceDAVal}),
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            requestOk(data,'',function(){
                changeSuccess('转出成功！');
                render(currPage);
            },customCodeError);
        },
        error:function(data){
        }
    })
}
//点击转正确库将待确认话术人工转入正确库
$(document).on('click','.turnTrue',function(){
    var toBeconfirm = confirm('确定要将该数据转入正确库吗？');
    if(toBeconfirm===true) {
        artificialChange(this, '../UnconfirmedTalk/toCorrect');
        $(this).parents('tr').hide();
    }
})
//点击转错误库将待确认话术人工转入错误库
$(document).on('click','.turnFalse',function(){
    var toBeconfirmError = confirm('确定要将该数据转入错误库吗？');
    if(toBeconfirmError===true) {
        artificialChange(this, '../UnconfirmedTalk/toError');
        $(this).parents('tr').hide();
    }
})