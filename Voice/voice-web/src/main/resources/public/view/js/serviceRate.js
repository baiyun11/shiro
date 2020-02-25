
function serviceRateChart(f){
    $.ajax({
        url:'../UserTalk/findByService',
        type:'POST',
        data:f,
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            requestOk(data,'',function(){
                var myChart = echarts.init(document.getElementById('serviceRate'));
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
serviceRateChart('{}');

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

