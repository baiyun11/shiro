/*话术统计分析图形 start*/

// 基于准备好的dom，初始化echarts
var myChart = echarts.init(document.getElementById('main'));
datagram('周的数据分析','../UserTalk/findByExampleType',{week:1});
$('.dataView button').click(function(){
    var aNumber = $(this).index();
    if(aNumber===0){
        $(".chooseDate").hide();
        datagram('周的数据分析','../UserTalk/findByExampleType',{week:1});
    }else if(aNumber===1){
        $(".chooseDate").hide();
        datagram('24小时的数据分析','../UserTalk/findByExampleType',{start:0,end:23});
    }
    $(this).attr("disabled","disabled").siblings().removeAttr("disabled","disabled");
})

function datagram(text,url,data) {
    myChart.clear();
    myChart.showLoading();
    var weekData = "";
    var lenType = new Array;
    $.ajax({
        url:url,
        type:'POST',
        data:JSON.stringify(data),
        async:false,
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            requestOk(data,'',function(){
                weekData=data.data;
                for(var i=0;i<weekData[0].length-1;i++){
                    lenType[i]={type: 'bar'};
                }
                myChart.hideLoading();
            },function(){
                if(data.code == 503) {
                    if(data.msg=='未认证') window.location.href="login.html";
                }
                if(data.code == 501) {
                    if(data.msg=='未授权'){
                        $('body').append('<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" id="alertSuccess">' +
                            '<div class="modal-dialog modal-sm" role="document">' +
                            '<div class="modal-content">' +
                            '<div class="modal-body">' +
                            '</div></div></div></div>');
                        $("#alertSuccess").modal('show');
                        $("#alertSuccess").find(".modal-body").text("未授权，请联系管理员。");
                        setTimeout(function(){
                            $("#alertSuccess").modal('hide');
                        },700);
                        $('.row input,.row button').attr('disabled','disabled');
                        myChart.hideLoading();
                        return false;
                    }
                }
            });
        },
        error:function(data){
        }
    });
    option = {
        title: {
            // text: '话术统计图形分析',
            subtext: text
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {
                    readOnly: true,
                    lang: ['数据视图', '关闭'],
                    optionToContent: function (opt) {
                        var axisData = opt.dataset[0].source;
                        console.log(axisData);
                        var table = '';
                        var tbodyHtml = '';
                        var tableHtml = '';
                        for (var i = 0; i < axisData[0].length; i++) {
                            tableHtml = '';
                            for (var j = 0; j < axisData.length; j++) {
                                tableHtml += '<td>&nbsp;&nbsp;' + axisData[j][i] + '&nbsp;&nbsp;</td>';
                            }
                            tbodyHtml += '<tr>' + tableHtml + '</tr>';
                        }
                        table='<table class="table table-bordered" style="border:1px solid #ddd; overflow:auto;"><tbody>' + tbodyHtml + '</tbody></table>';
                        return table;
                    }
                },
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        legend: {
            top: 500,
            height: 450,
            left: 'center',
        },
        //坐标轴位置尺寸
        grid: {
            //width: '750px',
            height: '400px',
            left: '40px',
            //right: '100px'
        },
        dataset: {
            source: weekData
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                'interval': 0,
                'rotate': -25
            },
            splitLine: {show: false}
        },
        yAxis: {},
        series: lenType,
        color: [
            '#c23531', '#2f4554', '#61a0a8',
            '#d48265', '#91c7ae', '#749f83',
            '#ca8622', '#bda29a', '#6e7074',
            '#546570', '#c4ccd3', '#dd6b66',
            '#759aa0', '#e69d87', '#8dc1a9',
            '#ea7e53', '#eedd78', '#73a373',
            '#73b9bc', '#7289ab', '#91ca8c',
            '#f49f42', '#37a2da', '#32c5e9',
            '#67e0e3', '#ffdb5c', '#ff9f7f',
            '#fb7293', '#e062ae', '#e690d1',
            '#e7bcf3', '#9d96f5', '#8378ea',
            '#96bfff', '#9fe6b8'
        ]
    };
// 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option,true);
}

/*话术统计分析图形 end*/

function serviceRateChart(f){
    $.ajax({
        url:'../UserTalk/findByService',
        type:'POST',
        data:f,
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            requestOk(data,'',function(){
                var myChart = echarts.init(document.getElementById('main'));
                var dataval = data.data;
                var leftData = "";
                if(dataval==undefined){
                    $("#serviceRate").hide();
                    return false;
                }else{
                    $("#serviceRate").show();
                }
                for(var i = 0; i<dataval.length;i++){
                    leftData = leftData+dataval[i].name+",";
                }
                leftData = leftData.substring(0,leftData.length-1);
                leftData = leftData.split(",")
                option = {
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        // orient: 'vertical',
                        top:'top',
                        data: leftData
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            selectedMode: 'single',
                            data: dataval,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ],
                    color: [
                        '#c23531', '#2f4554', '#61a0a8',
                        '#d48265', '#91c7ae', '#749f83',
                        '#ca8622', '#bda29a', '#6e7074',
                        '#546570', '#c4ccd3', '#dd6b66',
                        '#759aa0', '#e69d87', '#8dc1a9',
                        '#ea7e53', '#eedd78', '#73a373',
                        '#73b9bc', '#7289ab', '#91ca8c',
                        '#f49f42', '#37a2da', '#32c5e9',
                        '#67e0e3', '#ffdb5c', '#ff9f7f',
                        '#fb7293', '#e062ae', '#e690d1',
                        '#e7bcf3', '#9d96f5', '#8378ea',
                        '#96bfff', '#9fe6b8'
                    ]
                };
                myChart.setOption(option,true);
            },function(){
                if(data.code == 503) {
                    if(data.msg=='未认证') window.location.href="login.html";
                }
                if(data.code == 501) {
                    if(data.msg=='未授权'){
                        $('body').append('<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" id="alertSuccess">' +
                            '<div class="modal-dialog modal-sm" role="document">' +
                            '<div class="modal-content">' +
                            '<div class="modal-body">' +
                            '</div></div></div></div>');
                        $("#alertSuccess").modal('show');
                        $("#alertSuccess").find(".modal-body").text("未授权，请联系管理员。");
                        setTimeout(function(){
                            $("#alertSuccess").modal('hide');
                        },700);
                        $('.row input,.row button').attr('disabled','disabled');
                        myChart.hideLoading();
                        return false;
                    }
                }
            });
        },
        error:function(data){
        }
    });
}

$(".serviceBtnView").click(function(){
    $(".chooseDate").show();
    serviceRateChart('{}');
});
$(function(){
    $("#queryRate").click(function(){
        var startTimeVal = $("#conditiontimeStart").val();
        var endTimeVal = $("#conditiontimeEnd").val();
        var strVal = "";
        var queryCondition = "";
        if (startTimeVal!="" && endTimeVal!="")
            strVal = '"startTime":"' + Date.parse(startTimeVal) + '",'+ '"endTime":"' + Date.parse(endTimeVal) + '",';
        queryCondition ="{" + strVal.substring(0,strVal.length-1) + "}";
        console.log(queryCondition);
        serviceRateChart(queryCondition);
    })
});


//日期选择器日期时间选择范围
$("#conditiontimeStart").datetimepicker({
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
    $("#conditiontimeEnd").datetimepicker('setStartDate',$("#conditiontimeStart").val());
});
$("#conditiontimeEnd").datetimepicker({
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
    $("#conditiontimeStart").datetimepicker('setEndDate',$("#conditiontimeEnd").val());
})



