/*话术统计分析图形 start*/
$(function(){
    $.ajax({
        url:'../CarModel/findByExample',
        type:'POST',
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            requestOk(data,'',function(){
                $("#carTypeChart").append('<option value="">全部</option>');
                for(var j=0; j<data.data.length; j++){
                    var modelCodeVal=data.data[j].modelCode;
                    var modelNameVal=data.data[j].modelName;
                    $("#carTypeChart").append('<option value="'+modelCodeVal+'">'+modelNameVal+'</option>');
                }
                $('#carTypeChart').selectpicker('refresh');
                $('#carTypeChart').selectpicker('render');
            },customCodeError)
        },
        error:function(data){
        }
    });
});

$(function(){
    $.ajax({
        url:'../ServicesType/findByType',
        type:'post',
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            requestOk(data,'',function(){
                $("#rawTextService").append('<option value="">全部</option>');
                for(var j=0; j<data.data.length; j++){
                    var typeVal=data.data[j].type;
                    $("#rawTextService").append('<option value="'+typeVal+'">'+typeVal+'</option>');
                }
                $('#rawTextService').selectpicker('refresh');
                $('#rawTextService').selectpicker('render');
            },customCodeError);
        },
        error:function(data){
        }
    });
});

$(function(){
    $.ajax({
        url: '../Vehicle/findByUserStatistics',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        success:function(data){
            requestOk(data,'',function(){
                var dataVal = data.data;
                //为标题赋值(用户总数)
                $(".statistical h4 span").text(dataVal.totalNumberOfUsers);

                // 基于准备好的dom，初始化echarts
                var myChart = echarts.init(document.getElementById('addPerson'));

                //新增用户
                option = {
                    title: {
                        text: '新增用户',
                        x: 'left'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: dataVal.dailyAdditionOfUsersTime
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: dataVal.dailyAdditionOfUsers,
                        type: 'line'
                    }]
                };
                myChart.setOption(option,true);

                //用户活跃度
                var myChartUser = echarts.init(document.getElementById('userActive'));
                option = {
                    title: {
                        text: '用户活跃度(每天使用语音的用户数)',
                        x: 'left'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: dataVal.dayLiveUserTime
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: dataVal.dayLiveUser,
                        type: 'line'
                    }],
                    color:[
                        '#61a0a8'
                    ]
                };
                myChartUser.setOption(option,true);
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
            })
        },
        error:function(data){
        }
    });
})



//每月用户数量

$(function(){
    //第一加载
    monthlyData();
    //汽车类型过滤条件
    $("#carTypeChart").change(function(){
        var searchCar = $(this).val();
        monthlyData(searchCar);
    })
})

function monthlyData(d){
    var data="";
    d=="" ? data = JSON.stringify({}) : data = JSON.stringify({vehicleCode:d});
    $.ajax({
        url: '../Vehicle/findByMonthlyUser',
        type: 'POST',
        data:data,
        dataType: 'json',
        contentType: 'application/json',
        success:function(data){
            requestOk(data,'',function(){
                var dataMonthVal = data.data;

                // 基于准备好的dom，初始化echarts
                var myChartMonth = echarts.init(document.getElementById('userMonth'));

                //新增用户
                option = {
                    title: {
                        text: '每月新增用户数量',
                        x: 'left'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: dataMonthVal.Month
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: dataMonthVal.Total,
                        type: 'line'
                    }]
                };
                myChartMonth.setOption(option,true);
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
            })
        },
        error:function(data){
        }
    });
}

function rawServiceRebder(g) {
    $.ajax({
        url:'../UserTalk/findByMonthlyRawText',
        type:'POST',
        data:g,
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            requestOk(data,'',function(){
                var rawTextVal = data.data;
                // 基于准备好的dom，初始化echarts
                var myChart = echarts.init(document.getElementById('rawTextServiceChart'));

                //每月话术总数
                option = {
                    title: {
                        text: '每月话术总数',
                        x: 'left'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: rawTextVal.Month
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: rawTextVal.Total,
                        type: 'line'
                    }]
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
            })
        },
        error:function(data){
        }
    });
}
rawServiceRebder('{}');

$(function(){
    $("#rawTextService").change(function(){
        var serviceVal = $("#rawTextService").val();
        if(serviceVal==""){
            var rawTextData ="";
        }else{
            var rawTextData = JSON.stringify({userTalk:{service:serviceVal}});
        }
        rawServiceRebder(rawTextData);
    });
});





