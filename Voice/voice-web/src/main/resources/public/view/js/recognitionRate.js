$(function(){
    $.ajax({
        url:'../ServicesType/findByType',
        type:'post',
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            requestOk(data,'',function(){
                for(var j=0; j<data.data.length; j++){
                    var typeVal=data.data[j].type;
                    $("#conditionService").append('<option value="'+typeVal+'">'+typeVal+'</option>');
                }
                $('#conditionService').selectpicker('refresh');
                $('#conditionService').selectpicker('render');
            },customCodeError);
        },
        error:function(data){
        }
    });
});

//点击查询
$(function(){
    $("#queryRate").click(function(){
        var vinVal = $("#conditionVin").val();
        var startTimeVal = $("#conditiontimeStart").val();
        var endTimeVal = $("#conditiontimeEnd").val();
        var serviceValArr = new Array();
        var strVal = "";
        var queryCondition = "";
        $(".serviceList li.selected").each(function(g){
            serviceValArr[g]=$(this).find(".text").text();
        });
        if (vinVal!="")
            strVal = strVal + '"vin":"' + vinVal + '",';

        if (startTimeVal!="")
            strVal = strVal + '"startTime":"' + Date.parse(startTimeVal) + '",';

        if (endTimeVal!="")
            strVal = strVal + '"endTime":"' + Date.parse(endTimeVal) + '",';

        if (serviceValArr.length != 0){
            var serviceStr = JSON.stringify({service: serviceValArr});
            strVal = strVal + serviceStr.substring(1,serviceStr.length-1)+ ',';
        }
        queryCondition ="{" + strVal.substring(0,strVal.length-1) + "}";
        console.log(queryCondition);
        recognitionRatePie(queryCondition);
    })
});


recognitionRatePie('{}');
function recognitionRatePie(a){
    $.ajax({
        url:'../UserTalk/finByExecuteStatus',
        type:'post',
        data:a,
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            console.log(data.data)
            requestOk(data,'',function(){
                $("#totalNum tr").html("");
                var dataVal=data.data;
                var totalRate = parseFloat(dataVal.totalNumberOfWords);
                var tureNum = parseFloat(dataVal.numberOfCorrectWords);
                var errorNum = parseFloat(dataVal.numberOfErrorSpeeches);
                if(totalRate==0){
                    $("#totalNum tr").append('<td>0</td><td>0</td><td>0</td>');
                    $("#mainRate").hide();
                }else{
                    $("#mainRate").show();
                    $("#totalNum tr").eq(0).append('' +
                        '<td>'+tureNum+'</td>' +
                        '<td>'+errorNum+'</td>' +
                        '<td>'+totalRate+'</td>');
                    $("#totalNum tr").eq(1).append('' +
                        '<td>'+Math.round(tureNum/totalRate*10000)/100.00+'%'+'</td>' +
                        '<td>'+Math.round(errorNum/totalRate*10000)/100.00+'%'+'</td>' +
                        '<td>100%</td>');
                }
                // 基于准备好的dom，初始化echarts
                var myChart = echarts.init(document.getElementById('mainRate'));
                var dataVal=data.data;
                option = {
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        bottom: 10,
                        left: 'center',
                        data: ['正确话术', '错误话术']
                    },
                    series : [
                        {
                            name:'识别率',
                            type: 'pie',
                            radius : '65%',
                            center: ['50%', '50%'],
                            selectedMode: 'single',
                            data:[
                                {value:dataVal.numberOfCorrectWords,name: '正确话术'},
                                {value:dataVal.numberOfErrorSpeeches,name: '错误话术'},
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
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


