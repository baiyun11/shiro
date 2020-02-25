/*
* @Author: zhang.wei121
* @Date:   2018-08-03 08:50:22
* @Last Modified by:   zhang.wei121
* @Last Modified time: 2018-08-03 08:50:22
*/

'use strict';

//分页

function getData(params,callback){
	var val_page=params.page-1;
	$.ajax({
		url:'../poi/findAll',
		type:'POST',
		data: JSON.stringify({page:val_page,size:10,property:'poiBean.time',direction:'DESC'}),
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
var poiDataArr="";

function render(d){
	skip_page=="" ? currPage=currPage : currPage=d;
	getData({
		page: currPage,
		size: 10
	},function(data){
		poiDataArr=data.data.content;
		if(poiDataArr==undefined) {
            $('.page_navigation').css('display','none');
			return false;
		}
		$('#positionAnalysis').html('');
		var poiHtml="";
		for(var i=0;i<poiDataArr.length;i++){
			var val_poiId=poiDataArr[i].id;
			var val_power=poiDataArr[i].poiBean.power;
			var val_lon=poiDataArr[i].poiBean.lon;
			var val_lat=poiDataArr[i].poiBean.lat;
			var val_speed=poiDataArr[i].poiBean.speed;
			var val_time=changeDateFormat(poiDataArr[i].poiBean.time);
			poiHtml=poiHtml+'<tr><td><div class="powerDA">'+val_power+'</div></td><td><div class="lonDA">'+val_lon+'</div></td></td><td><div class="latDA">'+val_lat+'</div></td><td><div class="speedDA">'+val_speed+'</div></td><td><div class="date_time">'+val_time+'</div></td><td><div class="operation"><a id="look_all" onclick="poiViewAll('+i+')" href="#poi" data-toggle="modal"><span class="label label-success">查看全部</span></a></div></td></tr>';
		}
		var num_p=data.data.totalPages;
		var num_l=data.data.totalElements;
		$("#num_pages").html("共 "+num_p+" 页");
		$("#num_lists").html("共 "+num_l+" 条数据");
		num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
		$('#positionAnalysis').append(poiHtml);
		setPaginator(currPage, data.data.totalPages , render);
        skip_page="";
        $("#skipPage").val("");
	})
}

render(currPage);


function poiViewAll(i){
	$("#poiData").html("");
	var poiAllHtml="";
	
	// var valPoiCarModel = poiDataArr[i].uploadHeader.carModel;
	// var valPoiImei = poiDataArr[i].uploadHeader.imei;
	var valPoiappVersio = poiDataArr[i].uploadHeader.appVersion;
	var valPoiautoVIN = poiDataArr[i].uploadHeader.vin;
	var valPoiPower = poiDataArr[i].poiBean.power;
	var valPoiLon = poiDataArr[i].poiBean.lon;
	var valPoiLat = poiDataArr[i].poiBean.lat;
	var valPoiTime = changeDateFormat(poiDataArr[i].poiBean.time);
	var valPoiSpeed = poiDataArr[i].poiBean.speed;
	var valPoiCity = poiDataArr[i].poiBean.cityName;
	
	poiAllHtml=poiAllHtml+ '<tr><td><span>vin:</span></td><td>'+valPoiautoVIN+'</td></tr>' +
		// '<tr><td><span>imei:</span></td><td>'+valPoiImei+'</td></tr>' +
		'<tr><td><span>appVersion:</span></td><td>'+valPoiappVersio+'</td></tr>' +
		'<tr><td><span>power:</span></td><td>'+valPoiPower+'</td></tr>' +
		'<tr><td><span>lon:</span></td><td>'+valPoiLon+'</td></tr>' +
		'<tr><td><span>lat:</span></td><td>'+valPoiLat+'</td></tr>' +
		'<tr><td><span>time:</span></td><td>'+valPoiTime+'</td></tr>' +
		'<tr><td><span>speed:</span></td><td>'+valPoiSpeed+'</td></tr>' +
		'<tr><td><span>cityName:</span></td><td>'+valPoiCity+'</td></tr>';
	$("#poiData").append(poiAllHtml);
	
}



