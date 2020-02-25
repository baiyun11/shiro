'use strict';

var dataId="";
function renderUpdata(){
    //获取全局配置
    $.ajax({
        url:'../GlobalConfig/find',
        type:'POST',
        dataType:'json',
        contentType : "application/json",
        success:function(data){
            requestOk(data,'',function(){
                var valData=data.data;
                // console.log(valData);
                dataId=data.data.id;
                var canDataUpload=valData.switchConfig.isCanDataUpload;
                var isUploadUserTalk=valData.switchConfig.isUploadUserTalk;
                var isUploadPoiBean=valData.switchConfig.isUploadPoiBean;
                var isUploadUserInfo=valData.switchConfig.isUploadUserInfo;
                var isChat = valData.switchConfig.isChat;
                var isConfigRemind = valData.switchConfig.isConfigRemind;
                var poiUploadTime=valData.timeConfig.poiUploadTime;
                var pushUpperLimit = valData.timeConfig.pushUpperLimit;
                var pushSwitch = valData.switchConfig.isPushSwitch;
                var pushInterval = valData.timeConfig.pushInterval;
                var requestInterval = valData.timeConfig.requestInterval;
                var configRemindQuantity = valData.timeConfig.configRemindQuantity;
                $(".dataUp input").val(canDataUpload);
                Number(canDataUpload)==1 ? $(".dataUp input").attr("checked",true) : $(".dataUp input").attr("checked",false);
                $(".dataUser input").val(isUploadUserTalk);
                Number(isUploadUserTalk)==1 ? $(".dataUser input").attr("checked",true) : $(".dataUser input").attr("checked",false);
                $(".dataPoi input").val(isUploadPoiBean);
                Number(isUploadPoiBean)==1 ? $(".dataPoi input").attr("checked",true): $(".dataPoi input").attr("checked",false);
                $(".dataVoice input").val(isUploadUserInfo);
                Number(isUploadUserInfo)==1 ? $(".dataVoice input").attr("checked",true) : $(".dataVoice input").attr("checked",false);
                $(".dataPush input").val(pushSwitch);
                Number(pushSwitch)==1 ? $(".dataPush input").attr("checked",true) : $(".dataPush input").attr("checked",false);
                Number(isChat)==1 ? $(".triangularBeast input").attr("checked",true) : $(".triangularBeast input").attr("checked",false);
                $(".dataConfigRemindQuantity input").val(isConfigRemind);
                Number(isConfigRemind)==1 ? $(".dataConfigRemindQuantity input").attr("checked",true) : $(".dataConfigRemindQuantity input").attr("checked",false);
                $("#dataTime").val(poiUploadTime);
                $("#messadeNum").val(pushUpperLimit);
                $("#timeInterval").val(pushInterval);
                $("#netWork").val(requestInterval);
                $("#configRemindQuantity").val(configRemindQuantity);

            },customCodeError);
        },
        error:function(data){
        }
    })
}
renderUpdata();

$(function(){
	$(".buttonsize input[type='checkbox']").change(function(){
		if($(this).is(':checked')){
			$(this).val("1");
		}else{
			$(this).val("0");
		}
	})
	
	$(".buttonsize input[type='text']").blur(function(){
		var vlatime = $(this).val();

		var idVal = $(this).attr("id");
		// var reg=/^[3-9]|([1-9][0-9]+)$/;
        var regAll=/^[+]{0,1}(\d+)$/;
        if(idVal=='dataTime'){
            if(!regAll.test(vlatime) || vlatime<3){
                $(".warning").html("<strong>请输入大于或等于3的整数数字。</strong>");
                $(".warning").show();
                $(".buttonsize button").attr("disabled","disabled");
                return false;
            }
        }else if(idVal=='messadeNum'){
            if(!regAll.test(vlatime)){
                $(".warning").html("<strong>只能输入整数数字。</strong>");
                $(".warning").show();
                $(".buttonsize button").attr("disabled","disabled");
                return false;
            }
        }else if(idVal=='timeInterval' || idVal=='netWork'){
            if(!regAll.test(vlatime) || vlatime>1000){
                $(".warning").html("<strong>只能输入小于1000整数数字。</strong>");
                $(".warning").show();
                $(".buttonsize button").attr("disabled","disabled");
                return false;
            }
        }

	})

	$("#dataTime,#messadeNum,#timeInterval").focus(function(){
		$(".warning").html("");
		$(".warning").hide();
		$(".buttonsize button").removeAttr("disabled","disabled");
	})

	$(".buttonsize button").click(function(){
		var valdataUP = $(".dataUp input").val();
		var valdataUser = $(".dataUser input").val();
		var valdataPoi = $(".dataPoi input").val();
		var valdataVoice = $(".dataVoice input").val();
		var valDataPush = $('.dataPush input').val();
        var valDataConfigRemindQuantity = $('.dataConfigRemindQuantity input').val();
		var vallabelsize = $("#dataTime").val();
		var valPushNum = $('#messadeNum').val();
        var valIntervalNum = $('#timeInterval').val();
        var valNetWork = $("#netWork").val();
        var valIsChat = $(".triangularBeast input").val();
        var valConfigRemindQuantity = $("#configRemindQuantity").val();
		$.ajax({
			url:'../GlobalConfig/update',
			type:'POST',
			data:JSON.stringify({
                id:dataId,
                switchConfig: {
                    isCanDataUpload: valdataUP,
                    isUploadUserTalk: valdataUser,
                    isUploadPoiBean: valdataPoi,
                    isUploadUserInfo: valdataVoice,
                    isPushSwitch: valDataPush,
                    isChat:valIsChat,
                    isConfigRemind: valDataConfigRemindQuantity,
                },
                timeConfig: {
                    poiUploadTime: vallabelsize,
                    pushUpperLimit: valPushNum,
                    pushInterval: valIntervalNum,
                    requestInterval: valNetWork,
                    configRemindQuantity: valConfigRemindQuantity
                }
			}),
			dataType:'json',
			contentType : "application/json",
			success:function(data){
                requestOk(data,'',function(){
                    changeSuccess('提交成功！');
                    renderUpdata();
				},customCodeError);
			},
			error:function(data){
			}
		})
	})
})