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
                        x: 'center'
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
    $("#rawTextServiceBtn").click(function(){
        var serviceVal = $("#rawTextService").val();
        var rawTextData = JSON.stringify({userTalk:{service:serviceVal}});
        rawServiceRebder(rawTextData);
    });
});
