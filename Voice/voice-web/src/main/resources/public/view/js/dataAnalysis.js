'use strict';

//分页
var dataExport = '';
function getData(params,callback,g) {
    var val_page = params.page - 1;
    var data = '';
    if (g == '') {
        data = '{"page": ' + val_page + ',"size": 10,"property":"talkOriginal.time","direction":"DESC"}';
        dataExport ='{}';
    } else {
		data = '{"object": {' + g + '},"page": ' + val_page + ',"size": 10,"property":"talkOriginal.time","direction":"DESC"}';
		dataExport ='{"{' + g + '}"}';
	}
	$.ajax({
		url:'../UserTalk/findByExample',
		type:'POST',
		data:data,
		dataType:'json',
		contentType : "application/json",
		success:function(data){
            requestOk(data,'',callback,customCodeError);
		},
		error:function(response){
		}
	})
}

var queryCondition="";
var currPage = 1;
var skip_page="";
var dataArr="";
var warning="";
function render(d){
	skip_page=="" ? currPage=currPage : currPage=d;
	getData({
		page: currPage,
		size: 10
	},function(data){
        $("#upload_header").html("");
        var html = "";
		dataArr=data.data.content;
        if(dataArr==undefined){
            $("#upload_header").html(warning);
            $('.page_navigation').css('display','none');
            return false;
        }
		for(var i = 0 ; i < dataArr.length ; i ++){
			var val_hidId= dataArr[i].id;
			var val_rawText= dataArr[i].talkOriginal.rawText;
			var val_service= dataArr[i].talkOriginal.service;
			var val_serviceId= dataArr[i].talkOriginal.serviceId;
			var val_time=changeDateFormat(dataArr[i].talkOriginal.time);
			var val_autoVIN = dataArr[i].uploadHeader.vin;
			html = html + '<tr><td><div class="rawTextDA"><a tabindex="0" role="button" data-toggle="popover" data-trigger="focus" data-content="'+val_rawText+'">'+val_rawText+'</a></div></td><td><div class="serviceDA">'+val_service+'</div></td><td><div class="serviceIdDA">'+val_serviceId+'</div></td><td><div class="date_time">'+val_time+'</div></td><td><div class="AutoVINDA">'+val_autoVIN+'</div></td><td><div class="operation"><a id="look_all" href="#foo" onclick="viewAll('+i+')" data-toggle="modal"><span class="label label-success">查看全部</span></a></div></td></tr>';
		}
		var num_p=data.data.totalPages;
		var num_l=data.data.totalElements;
		$("#num_pages").html("共 "+num_p+" 页");
		$("#num_lists").html("共 "+num_l+" 条数据");
		num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
		$("#upload_header").append(html);
        $('[data-toggle="popover"]').popover();
		setPaginator(currPage, data.data.totalPages , render);
	},queryCondition)
	skip_page="";
	$("#skipPage").val("");
}
render(currPage);


function viewAll(c){
	var leftHtml="";

	$("#userTalk").html("");
	// var val_carModel = dataArr[c].uploadHeader.carModel;
	// var val_imei=dataArr[c].uploadHeader.imei;
	var val_autoVIN=dataArr[c].uploadHeader.vin;
	var val_appVersion=dataArr[c].uploadHeader.appVersion;
	var val_rawText=dataArr[c].talkOriginal.rawText;
	var val_time=changeDateFormat(dataArr[c].talkOriginal.time);
	var val_service=dataArr[c].talkOriginal.service;
	var val_serviceId=dataArr[c].talkOriginal.serviceId;
	// var val_versionDBNumber=dataArr[c].userTalk.versionDBNumber;
	var val_slotJson=dataArr[c].talkOriginal.slotJson;
	var val_slotType=dataArr[c].talkOriginal.slotType;
	var val_lon=dataArr[c].talkOriginal.lon;
	var val_lat=dataArr[c].talkOriginal.lat;
	var val_cityName=dataArr[c].talkOriginal.cityName;
	var val_wstext=dataArr[c].talkOriginal.wstext;

	if (val_wstext === undefined)
        val_wstext = '<font style="color: #9d9d9d">（空）</font>';

	leftHtml=leftHtml+
		// '<tr><td><span>carModel:</span></td><td>'+val_carModel+'</td></tr>' +
		// '<tr><td><span>imei:</span></td><td>'+val_imei+'</td></tr>' +
		'<tr><td><span>vin:</span></td><td>'+val_autoVIN+'</td></tr>' +
		'<tr><td><span>appVersion:</span></td><td>'+val_appVersion+'</td></tr>' +
		'<tr><td><span>rawText:</span></td><td>'+val_rawText+'</td></tr>' +
		'<tr><td><span>time:</span></td><td>'+val_time+'</td></tr>' +
		'<tr><td><span>service:</span></td><td>'+val_service+'</td></tr>' +
		'<tr><td><span>serviceId:</span></td><td>'+val_serviceId+'</td></tr>' +
		'<tr><td><span>slotJson:</span></td><td>'+val_slotJson+'</td></tr>' +
		'<tr><td><span>slotType:</span></td><td>'+val_slotType+'</td></tr>' +
		'<tr><td><span>lon:</span></td><td>'+val_lon+'</td></tr>' +
		'<tr><td><span>lat:</span></td><td>'+val_lat+'</td></tr>' +
		'<tr><td><span>cityName:</span></td><td>'+val_cityName+'</td></tr>'+
		// '<tr><td><span>versionDBNumber:</span></td><td>'+val_versionDBNumber+'</td></tr>' +
		'<tr><td><span>wstext:</span></td><td>'+val_wstext+'</td></tr>';
	$("#userTalk").append(leftHtml);
}
$(function(){
	$.ajax({
		url:'../ServicesType/findByType',
		type:'post',
		dataType:'json',
		contentType:'application/json',
		success:function(data){
            requestOk(data,'',function(){
                var typeOptionHtml="";
                for(var j=0; j<data.data.length; j++){
                    var typeVal=data.data[j].type;
                    $("#originalService").append('<option value="'+typeVal+'">'+typeVal+'</option>');
                }
                $('#originalService').selectpicker('refresh');
                $('#originalService').selectpicker('render');
			},customCodeError);
        },
		error:function(data){
		}
	});

    //导出数据功能
    $("#export").click(function(){
        var exFrameNumberVal=$("#originalFrameNumber").val();
        var exRawTextVal=$("#rawTextWord").val();
        var exTimeStartVal=$("#datetimeStart").val();
        var exTimeEndVal=$("#datetimeEnd").val();
        var exImplementVal=$("#originalImplement").val();
        var exSelectedArr = new Array();
        var exstr="";
        $(".serviceList li.selected").each(function(j){
            exSelectedArr[j]= $(this).find(".text").text();
        })

        if (exTimeStartVal!="")
            exstr = exstr + 'startTime=' + Date.parse(exTimeStartVal) +'&';

        if (exTimeEndVal!="")
            exstr = exstr + 'endTime=' + Date.parse(exTimeEndVal) +'&';

        if (exFrameNumberVal!="")
            exstr = exstr + 'vin=' + exFrameNumberVal + '&';

        if (exRawTextVal!="")
            exstr = exstr + 'rawText=' + exRawTextVal + '&';

        if (exSelectedArr.length != 0){
            var exServiceStr = 'service='+exSelectedArr.toString();
            exstr = exstr + exServiceStr + '&';

        }
        if (exImplementVal!="")
            exstr = exstr + 'executeStatus=' + exImplementVal + '&';
        exstr = exstr.substring(0,exstr.length-1);
        var exUrl = "../UserTalk/export?"+exstr;
        window.location.href=exUrl;

    })

	//条件过滤查询（五个可选择条件）
	$("#query").click(function(){
		var FrameNumberVal=$("#originalFrameNumber").val();
        var rawTextVal=$("#rawTextWord").val();
		var TimeStartVal=$("#datetimeStart").val();
        // TimeStartVal = TimeStartVal.getTime();
		var TimeEndVal=$("#datetimeEnd").val();
        // TimeEndVal = TimeEndVal.getTime();
        var implementVal=$("#originalImplement").val();
		var selectedArr = new Array();
        //var service="";
		$(".serviceList li.selected").each(function(k){
            selectedArr[k]= $(this).find(".text").text();
		})
        warning='<tr><td colspan="6"><div style="width:100%; height:40px; line-height:40px; text-align:center;">没有找到要查询的内容！</div></td></tr>';
		var str = '';
        // if (CarModelVal != "")
			// str = str + '"carModel":"' + CarModelVal + '",';

		if (FrameNumberVal!="")
            str = str + '"vin":"' + FrameNumberVal + '",';

		if (rawTextVal!="")
            str = str + '"rawText":"' + rawTextVal + '",';

        if (TimeStartVal!="")
            str = str + '"startTime":"' + Date.parse(TimeStartVal) + '",';

        if (TimeEndVal!="")
            str = str + '"endTime":"' + Date.parse(TimeEndVal) + '",';

        if (selectedArr.length != 0){

            var serviceStr = JSON.stringify({service: selectedArr});

        	str = str + serviceStr.substring(1,serviceStr.length-1)+ ',';

        }
		if (implementVal!="")
            str = str + '"executeStatus":"' + implementVal + '",';

        queryCondition = str.substring(0,str.length-1);
        currPage=1;
        render(currPage);
	})

})

//日期选择器日期时间选择范围
$("#datetimeStart").datetimepicker({
    language : 'zh-CN',
	weekStart : 1,
	autoclose : true,
    startView : 2,
    minView : 0,
    todayBtn : 'linked',
    endDate : new Date(),
    keyboardNavigation : true,
    forceParse : 0
}).on('hide',function(event){
    event.preventDefault();
    event.stopPropagation();
    $("#datetimeEnd").datetimepicker('setStartDate',$("#datetimeStart").val());
});
$("#datetimeEnd").datetimepicker({
    language : 'zh-CN',
    weekStart : 1,
    autoclose : true,
    startView : 2,
    minView : 0,
    todayBtn : 'linked',
    endDate : new Date(),
    keyboardNavigation : true,
    forceParse : 0
}).on('hide',function(event){
    event.preventDefault();
    event.stopPropagation();
    var endTime = event.data;
    $("#datetimeStart").datetimepicker('setEndDate',$("#datetimeEnd").val());
})

