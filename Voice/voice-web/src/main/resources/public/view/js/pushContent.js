//获取被点击地址栏里的参数值
var valPushNumber=$.getUrlParam('id');
var valPushState=$.getUrlParam('state');
$("#specifiedVersion").val(valPushNumber);
var pushStatus="";
if(valPushState!='test'){
    $("#addPushContent").attr("disabled","disabled");
}else{
    pushStatus = valPushState;
}

//获取推送类型列表(app)
var currPage = 1;
var skip_page="";
function appPush(){
    $('#pushType').val('App');
    $('.typeProgram').hide();
    $('.typeInformation').hide();
    $('.timeValidity').hide();
    $('.typeApp').show();
    var val_page="";
    function getData(params,callback){
        val_page=params.page-1;
        $.ajax({
            url:'../PushType/getPage',
            type:'POST',
            data:JSON.stringify({object:{type:"2", pushVersionEntity:{pushVersion:valPushNumber}},page:val_page,size:10}),
            dataType:'json',
            contentType : "application/json",
            success:function(response){
                requestOk(response,'',callback,customCodeError);
            },
            error:function(response){
            }
        })
    }

    function render(d){
        $("#application").html("");
        skip_page=="" ? currPage=currPage : currPage=d;
        getData({
            page: currPage,
            size: 10
        },function(data){
            // $("#application").html("");
            var pushHtml = "";
            var dataVal = data.data;
            var push = dataVal.content;
            var reg = /^[\'\"]+|[\'\"]+$/g;
            var issueDetele = '';
            var valContent, valAppName, valIntroduce, appPackageVal;
            if(push==undefined){
                $('.page_navigation').css('display','none');
                return false;
            };
            for(var i = 0 ; i < push.length ; i++){
                var contentId = push[i].id;
                valContent=push[i].content;
                if(valContent!=undefined){
                    valContent = eval('('+valContent.replace(reg,"")+')');
                    valAppName = valContent.appName;
                    appPackageVal = valContent.appPackageName;
                    valIntroduce = valContent.appIntroduce;
                }else{
                    valAppName='';
                    valIntroduce='';
                }
                var valDateTime=changeDateFormat(push[i].lastModifiedDate);
                pushStatus=push[i].pushVersionEntity.stateDescription;
                issueDetele = push[i].stateDescription;
                var oderNum=(currPage-1)*10+i+1;
                if(issueDetele==="deleted"){
                    var issueDeteleHtml='<td class="operationBox"><div class="operation">已删除</div></td>';
                }else{
                    var issueDeteleHtml='<td class="operationBox"><div class="operation">' +
                        '<a class="revise" href="#identifier2" data-toggle="modal"><span class="label label-info">修改</span></a>' +
                        '<a class="del" href="javascript:;"><span class="label label-warning">删除</span></a>' +
                        '<input type="hidden" value="'+contentId+'"/></div></td>'
                }
                pushHtml=pushHtml+'<tr>' +
                    '<td><div class="oderNum">'+oderNum+'</div></td>' +
                    '<td><div class="type">APP</div></td>' +
                    '<td><div class="appName" >'+valAppName+'</div></td>' +
                    '<td><div class="appPackage">'+appPackageVal+'</div></td>' +
                    '<td><div class="introduction" ><a tabindex="0" role="button" data-toggle="popover" data-trigger="focus" data-content="'+valIntroduce+'">'+valIntroduce+'</a></div></td>' +
                    '<td><div class="versionNumber">'+valPushNumber+'</div></td>' +
                    '<td><div class="date_time">'+valDateTime+'</div></td>'+issueDeteleHtml+
                    '</tr>'
            }
            var num_p=dataVal.totalPages;
            var num_l=dataVal.totalElements;
            $("#num_pages").html("共 "+num_p+" 页");
            $("#num_lists").html("共 "+num_l+" 条数据");
            num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
            $("#application").append(pushHtml);
            if(pushStatus!="test"){
                $(".revise").css("display","none");
            }
            $("#application").find("tr").each(function(){
                var valIssueWord = $(this).find(".operation").text();
                if(valIssueWord==='已删除'){
                    $(this).css("background","#f8f8f8");
                    $(this).find("div").css("color","#8e8b8b");
                    $(this).find("a").css("color","#8e8b8b");
                }
            })
            // $('[data-toggle="popover"]').popover();
            setPaginator(currPage, dataVal.totalPages , render);
        })
        skip_page="";
        $("#skipPage").val("");
    }
    currPage=1;
    render(currPage);
}


//获取推送类型列表(节目)
function programPush() {
    $('#pushType').val('节目');
    $('.typeApp').hide();
    $('.typeInformation').hide();
    $('.typeProgram').show();
    $('.timeValidity').show();
    var val_page="";
    function getData(params,callback){
        val_page=params.page-1;
        $.ajax({
            url:'../PushType/getPage',
            type:'POST',
            data:JSON.stringify({object:{type:"1", pushVersionEntity:{pushVersion:valPushNumber}},page:val_page,size:10}),
            dataType:'json',
            contentType : "application/json",
            success:function(response){
                requestOk(response,'',callback,customCodeError);
            },
            error:function(response){
            }
        })
    }
    function render(d){
        $("#show").html("");
        skip_page=="" ? currPage=currPage : currPage=d;
        getData({
            page: currPage,
            size: 10
        },function(data){
            var pushHtml = "";
            var dataVal = data.data;
            var push = dataVal.content;
            var reg = /^[\'\"]+|[\'\"]+$/g;
            var issueDetele = '';
            // console.log(data.data);
            var valContent, valInstructions, valTheme, valCategory, valCommand, valPushTime, valFrequency;
            var valRealTime = "";
            if(push==undefined){
                $('.page_navigation').css('display','none');
                checkMessage();
                return false;
            };
            for(var i = 0 ; i < push.length ; i++){
                var contentId = push[i].id;
                valContent=push[i].content;
                if(valContent!=undefined){
                    valContent = eval('('+valContent.replace(reg,"")+')');
                    valInstructions = valContent.explain;
                    valTheme=valContent.theme;
                    valCategory=valContent.category;
                    valCommand=valContent.command;
                    valPushTime = valContent.priority;
                    valFrequency = valContent.pullNumber+'次';
                    if(valPushTime==2)
                        valPushTime= valContent.delayNumber+'分钟';
                    else if(valPushTime==1) {
                        valPushTime = "实时";
                        valRealTime = 1;
                        $(".timeTypeChange input[type=radio]:first").attr("disabled","disabled");
                        $(".timeTypeChange input[type=radio]:first").prop("checked",false);
                        $(".timeTypeChange input[type=radio]").eq(2).prop("checked",true);
                    }else if(valPushTime==3)
                        valPushTime = "定时";
                }else{
                    valInstructions = '';
                    valTheme='';
                    valCategory='';
                    valCommand='';
                    valPushTime='';
                    valFrequency='';
                }
                var valExpiryDate = push[i].expiryDate;
                if(valExpiryDate==0) {
                    var expiryVal = "永久有效";
                }else {
                    var expiryVal = valExpiryDate+'天';
                }
                var valDateTime=changeDateFormat(push[i].lastModifiedDate);
                pushStatus=push[i].pushVersionEntity.stateDescription;
                issueDetele = push[i].stateDescription;
                var oderNum=(currPage-1)*10+i+1;
                if(issueDetele==="deleted"){
                    var issueDeteleHtml='<td class="operationBox"><div class="operation">已删除</div></td>';
                }else{
                    var issueDeteleHtml='<td class="operationBox"><div class="operation">' +
                        //'<a class="revise" href="#identifier2" data-toggle="modal"><span class="label label-info">修改</span></a>' +
                        '<a class="del" href="javascript:;"><span class="label label-warning">删除</span></a>' +
                        '<input type="hidden" value="'+contentId+'"/></div></td>'
                }
                if(valCategory == '考拉FM电台' || valCategory == 'words'){
                    var typeTheme ='<a class="showBox" data-container="body" data-toggle="popover" data-content="'+valTheme+'">'+valTheme+'</a>';
                }else{
                    var typeTheme = '<a href="'+valTheme+'" title="'+valTheme+'">'+valTheme+'</a>';
                }
                pushHtml=pushHtml+'<tr>' +
                    '<td><div class="oderNum">'+oderNum+'</div></td>' +
                    '<td><div class="category" >'+valCategory+'</div></td>' +
                    "<td><div class='instructions'><a class='showBox' data-container='body' data-toggle='popover' data-content='"+valInstructions+"'>"+valInstructions+"</a></div></td>" +
                    '<td><div class="theme">'+typeTheme+'</div></td>' +
                    '<td><div class="type">节目</div></td>' +
                    "<td><div class='contentExecuted'><a class='showBox' data-container='body' data-toggle='popover'  data-content='"+valCommand+"'>"+valCommand+"</a></div></td>" +
                    '<td><div class="pushTime">'+valPushTime+'</div></td>' +
                    '<td><div class="pushFrequency">'+valFrequency+'</div></td>' +
                    '<td><div class="messageValidity">'+expiryVal+'</div></td>' +
                    '<td><div class="versionNumber">'+valPushNumber+'</div></td>' +
                    '<td><div class="date_time">'+valDateTime+'</div></td>'+issueDeteleHtml+
                    '</tr>'
            }
            if(valRealTime!=1){
                checkMessage();
            }
            var num_p=dataVal.totalPages;
            var num_l=dataVal.totalElements;
            $("#num_pages").html("共 "+num_p+" 页");
            $("#num_lists").html("共 "+num_l+" 条数据");
            num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
            $("#show").append(pushHtml);
            if(pushStatus!="test"){
                $(".revise").css("display","none");
            }
            $("#show").find("tr").each(function(){
                var valIssueWord = $(this).find(".operation").text();
                if(valIssueWord==='已删除'){
                    $(this).css("background","#f8f8f8");
                    $(this).find("div").css("color","#8e8b8b");
                    $(this).find("a").css("color","#8e8b8b");
                }
            })
            boxPopover();
            setPaginator(currPage, dataVal.totalPages , render);
        })
        skip_page="";
        $("#skipPage").val("");
    }
    currPage=1;
    render(currPage);
}

//获取推送类型列表(资讯)
function messagePush() {
    $('#pushType').val('资讯');
    $('.typeApp').hide();
    $('.typeProgram').hide();
    $('.typeInformation').show();
    $('.timeValidity').show();
    var val_page="";
    function getData(params,callback){
        val_page=params.page-1;
        $.ajax({
            url:'../PushType/getPage',
            type:'POST',
            data:JSON.stringify({object:{type:"3", pushVersionEntity:{pushVersion:valPushNumber}},page:val_page,size:10}),
            dataType:'json',
            contentType : "application/json",
            success:function(response){
                requestOk(response,'',callback,customCodeError);
            },
            error:function(response){
            }
        })
    }
    function render(d){
        $("#information").html("");
        skip_page=="" ? currPage=currPage : currPage=d;
        getData({
            page: currPage,
            size: 10
        },function(data){
            // $("#information").html("");
            console.log(data.data);
            var dataVal = data.data;
            var pushHtml = "";
            var push = dataVal.content;
            var reg = /^[\'\"]+|[\'\"]+$/g;
            var issueDetele = '';
            var valContent,valInstructions, valTheme, valPushTime, valFrequency;
            if(push==undefined){
                $('.page_navigation').css('display','none');
                return false;

            };
            for(var i = 0 ; i < push.length ; i++){
                var contentId = push[i].id;
                valContent=push[i].content;
                if(valContent!=undefined){
                    valContent = eval('('+valContent.replace(reg,"")+')');
                    valTheme=valContent.topicInformation;
                    valInstructions=valContent.detailsInformation;
                    valPushTime = valContent.priority;
                    valFrequency = valContent.pullNumber+'次';
                    if(valPushTime==2)
                        valPushTime= valContent.delayNumber+'分钟';
                    else if(valPushTime==1){
                        valPushTime = "实时";
                        $(".timeTypeChange input[type=radio]:first").attr("disabled","disabled");
                        $(".timeTypeChange input[type=radio]:first").prop("checked",false);
                        $(".timeTypeChange input[type=radio]").eq(2).prop("checked",true);
                    }
                    else if(valPushTime==3)
                        valPushTime = "定时";
                }else{
                    valTheme='';
                    valInstructions='';
                    valPushTime='';
                    valFrequency='';
                }
                var valExpiryDate = push[i].expiryDate;
                if(valExpiryDate==0) {
                    var expiryVal = "永久有效";
                }else {
                    var expiryVal = valExpiryDate+'天';
                }
                var valDateTime=changeDateFormat(push[i].lastModifiedDate);
                pushStatus=push[i].pushVersionEntity.stateDescription;
                issueDetele = push[i].stateDescription;
                var oderNum=(currPage-1)*10+i+1;
                if(issueDetele==="deleted"){
                    var issueDeteleHtml='<td class="operationBox"><div class="operation">已删除</div></td>';
                }else{
                    var issueDeteleHtml='<td class="operationBox"><div class="operation">' +
                        '<a class="revise" href="#identifier2" data-toggle="modal"><span class="label label-info">修改</span></a>' +
                        '<a class="del" href="javascript:;"><span class="label label-warning">删除</span></a>' +
                        '<input type="hidden" value="'+contentId+'"/></div></td>'
                }
                pushHtml=pushHtml+'<tr>' +
                    '<td><div class="oderNum">'+oderNum+'</div></td>' +
                    '<td><div class="type">资讯</div></td>' +
                    "<td><div class='theme'><a class='showBox' data-container='body' data-toggle='popover' data-content='"+valTheme+"'>"+valTheme+"</a></div></td>" +
                    "<td><div class='particulars' ><a  class='showBox' data-container='body' data-toggle='popover' data-content='"+valInstructions+"'>"+valInstructions+"</a></div></td>" +
                    '<td><div class="pushTime">'+valPushTime+'</div></td>' +
                    '<td><div class="pushFrequency">'+valFrequency+'</div></td>' +
                    '<td><div class="messageValidity">'+expiryVal+'</div></td>' +
                    '<td><div class="versionNumber">'+valPushNumber+'</div></td>' +
                    '<td><div class="date_time">'+valDateTime+'</div></td>'+issueDeteleHtml+
                    '</tr>'
            }

            var num_p=dataVal.totalPages;
            var num_l=dataVal.totalElements;
            $("#num_pages").html("共 "+num_p+" 页");
            $("#num_lists").html("共 "+num_l+" 条数据");
            num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
            $("#information").append(pushHtml);

            if(pushStatus!="test"){
                $(".revise").css("display","none");
            }
            $("#information").find("tr").each(function(){
                var valIssueWord = $(this).find(".operation").text();
                if(valIssueWord==='已删除'){
                    $(this).css("background","#f8f8f8");
                    $(this).find("div").css("color","#8e8b8b");
                    $(this).find("a").css("color","#8e8b8b");
                }
            })
            boxPopover();
            setPaginator(currPage, dataVal.totalPages , render);
        })
        skip_page="";
        $("#skipPage").val("");
    }
    currPage=1;
    render(currPage);
}

//获取推送类型列表(节目)
var val_page="";
function getData(params,callback){
    val_page=params.page-1;
    $.ajax({
        url:'../PushType/getPage',
        type:'POST',
        data:JSON.stringify({object:{type:"1", pushVersionEntity:{pushVersion:valPushNumber}},page:val_page,size:10}),
        dataType:'json',
        contentType : "application/json",
        success:function(response){
            requestOk(response,'',callback,customCodeError);
        },
        error:function(response){
        }
    })
}

function render(d){
    $('#pushType').val('节目');
    $('.typeProgram').show();
    $('.timeValidity').show();
    $("#show").html("");
    skip_page=="" ? currPage=currPage : currPage=d;
    getData({
        page: currPage,
        size: 10
    },function(data){
        if(data.code=='0'){
            var pushHtml = "";
            var dataVal = data.data;
            var push = dataVal.content;
            var reg = /^[\'\"]+|[\'\"]+$/g;
            var issueDetele = '';
            var valContent, valInstructions, valTheme, valCategory, valCommand, valPushTime, valFrequency;
            var valRealTime = "";
            if(push==undefined){
                $('.page_navigation').css('display','none');
                checkMessage();
                return false;
            };
            for(var i = 0 ; i < push.length ; i++){
                var contentId = push[i].id;
                valContent=push[i].content;
                // if (valContent.indexOf("\n") >= 0) {
                //     valContent = valContent.replace("\n","");
                //     alert(valContent + " 中有\n");
                // }
                if(valContent!=undefined){
                    valContent = eval('('+valContent.replace(reg,"")+')');

                    // console.log(valContent.replace(reg,""));
                    // valContent = JSON.parse(valContent.replace(reg,""));
                    valInstructions = valContent.explain;
                    // valInstructions = valInstructions.replace("\n",'123');
                    valTheme=valContent.theme;
                    valCategory=valContent.category;
                    valCommand=valContent.command;
                    valPushTime = valContent.priority;
                    valFrequency = valContent.pullNumber+'次';
                    if(valPushTime==2)
                        valPushTime= valContent.delayNumber+'分钟';
                    else if(valPushTime==1){
                        valPushTime = "实时";
                        valRealTime = 1;
                        $(".timeTypeChange input[type=radio]:first").attr("disabled","disabled");
                        $(".timeTypeChange input[type=radio]:first").prop("checked",false);
                        $(".timeTypeChange input[type=radio]").eq(2).prop("checked",true);
                    }
                    else if(valPushTime==3)
                        valPushTime = "定时";
                }else{
                    valInstructions = '';
                    valTheme='';
                    valCategory='';
                    valCommand='';
                    valPushTime='';
                    valFrequency='';
                }
                var valExpiryDate = push[i].expiryDate;
                if(valExpiryDate==0) {
                    var expiryVal = "永久有效";
                }else {
                    var expiryVal = valExpiryDate+'天';
                }
                var valDateTime=changeDateFormat(push[i].lastModifiedDate);
                pushStatus=push[i].pushVersionEntity.stateDescription;
                issueDetele = push[i].stateDescription;
                var oderNum=(currPage-1)*10+i+1;
                if(issueDetele==="deleted"){
                    var issueDeteleHtml='<td class="operationBox"><div class="operation">已删除</div></td>';
                }else{
                    var issueDeteleHtml='<td class="operationBox"><div class="operation">' +
                        //'<a class="revise" href="#identifier2" data-toggle="modal"><span class="label label-info">修改</span></a>' +
                        '<a class="del" href="javascript:;"><span class="label label-warning">删除</span></a>' +
                        '<input type="hidden" value="'+contentId+'"/></div></td>'
                }
                if(valCategory == '考拉FM电台' || valCategory == 'words'){
                    var typeTheme ='<a class="showBox" data-container="body" data-toggle="popover" data-content="'+valTheme+'">'+valTheme+'</a>';
                }else{
                    var typeTheme = '<a href="'+valTheme+'" title="'+valTheme+'">'+valTheme+'</a>';
                }
                pushHtml=pushHtml+'<tr>' +
                    '<td><div class="oderNum">'+oderNum+'</div></td>' +
                    '<td><div class="category" >'+valCategory+'</div></td>' +
                    "<td><div class='instructions'><a class='showBox' data-container='body' data-toggle='popover' data-content='"+valInstructions+"'>"+valInstructions+"</a></div></td>" +
                    '<td><div class="theme">'+typeTheme+'</div></td>' +
                    '<td><div class="type">节目</div></td>' +
                    "<td><div class='contentExecuted'><a class='showBox' data-container='body' data-toggle='popover'  data-content='"+valCommand+"'>"+valCommand+"</a></div></td>" +
                    '<td><div class="pushTime">'+valPushTime+'</div></td>' +
                    '<td><div class="pushFrequency">'+valFrequency+'</div></td>' +
                    '<td><div class="messageValidity">'+expiryVal+'</div></td>' +
                    '<td><div class="versionNumber">'+valPushNumber+'</div></td>' +
                    '<td><div class="date_time">'+valDateTime+'</div></td>'+issueDeteleHtml+
                    '</tr>'
            }
            if(valRealTime!=1){
                checkMessage();
            }
            var num_p=dataVal.totalPages;
            var num_l=dataVal.totalElements;
            $("#num_pages").html("共 "+num_p+" 页");
            $("#num_lists").html("共 "+num_l+" 条数据");
            num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
            $("#show").append(pushHtml);
            if(pushStatus!="test"){
                $(".revise").css("display","none");
            }
            $("#show").find("tr").each(function(){
                var valIssueWord = $(this).find(".operation").text();
                if(valIssueWord==='已删除'){
                    $(this).css("background","#f8f8f8");
                    $(this).find("div").css("color","#8e8b8b");
                    $(this).find("a").css("color","#8e8b8b");
                }
            })
            boxPopover();
            setPaginator(currPage, dataVal.totalPages , render);
        }
    })
    skip_page="";
    $("#skipPage").val("");
}
render(currPage);

//点击删除指定数据
$(document).on("click",".del",function(){
    var val_id2=$(this).next().val();
    var valType=$(this).parents("tr").find(".type").text();
    var valTime = $(this).parents("tr").find(".pushTime").text();
    var tf=confirm("确定要删除这条数据吗？");
    if(tf==true){
        $.ajax({
            url:"../PushType/delete",
            type:"POST",
            data:JSON.stringify({id:val_id2}),
            dataType:"json",
            contentType : "application/json",
            success:function(data){
                requestOk(data,'',function(){
                    if(valTime == "实时"){
                        $(".timeTypeChange input[type=radio]:first").removeAttr("disabled","disabled");
                        $(".timeTypeChange input[type=radio]:first").prop("checked",true);
                        $(".timeTypeChange input[type=radio]").eq(2).prop("checked",false);
                    }
                    changeSuccess('删除成功！');
                    if(valType=="节目"){
                        $('#myTabs li:first a').tab('show');
                        programPush();
                    }
                    if(valType=="APP"){
                        $('#myTabs li:eq(1) a').tab('show');
                        appPush();
                    }
                    if(valType=="资讯"){
                        $('#myTabs li:last a').tab('show');
                        messagePush();
                    }
                },customCodeError);
            },
            error:function(data){
            }
        })
    }
})

//修改需要传的id
var revisePushId="",
    accessid = '',
    host = '',
    policyBase64 = '',
    signature = '',
    key = '',
    expire = 0,
    g_object_name = '',
    fileName = '';
    now = timestamp = Date.parse(new Date()) / 1000;


function set_upload_param(up, filename, ret){
    if (ret){
        g_object_name = key;

        new_multipart_params = {
            'key' : g_object_name + filename,
            'policy': policyBase64,
            'OSSAccessKeyId': accessid,
            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
            'signature': signature,
        };

        up.setOption({
            'url': host,
            'multipart_params': new_multipart_params
        });

    }
}

var init_filters = {};



var uploader = new plupload.Uploader({
    runtimes : 'html5,flash,silverlight,html4',
    browse_button : 'exampleInputFile',
    container: document.getElementById('container'),
    flash_swf_url : 'plupload-2.1.2/js/Moxie.swf',
    silverlight_xap_url : 'plupload-2.1.2/js/Moxie.xap',
    url : 'http://oss.aliyuncs.com',
    multi_selection: false,
    // filters: init_filters,

    init: {
        Init: function () {
            $('input[type=radio][name=inlineRadioOptions]').click(function () {
                $('#exampleInputFileName').html("");
                uploader.destroy();
                if (this.value == 'picture') {
                    init_filters = {
                        mime_types: [{title: "Image files", extensions: "png"}],
                        max_file_size: '500kb', //最大只能上传10mb的文件
                        prevent_duplicates: true //不允许选取重复文件
                    };
                } else if (this.value == 'audio') {
                    init_filters = {
                        mime_types: [{title: "Music files", extensions: "mp3"}],
                        max_file_size: '1mb', //最大只能上传10mb的文件
                        prevent_duplicates: true //不允许选取重复文件

                    };
                } else if (this.value == 'video') {
                    init_filters = {
                        mime_types: [{title: "Video files", extensions: "mp4"}],
                        max_file_size: '5mb', //最大只能上传10mb的文件
                        prevent_duplicates: true //不允许选取重复文件

                    };
                };

                uploader = new plupload.Uploader({
                    runtimes: 'html5,flash,silverlight,html4',
                    browse_button: 'exampleInputFile',
                    container: document.getElementById('container'),
                    flash_swf_url: 'plupload-2.1.2/js/Moxie.swf',
                    silverlight_xap_url: 'plupload-2.1.2/js/Moxie.xap',
                    url: 'http://oss.aliyuncs.com',
                    multi_selection: false,
                    filters: init_filters,
                    init: {
                        PostInit: function() {

                        },
                        FilesAdded: function(up,files){

                            plupload.each(files, function(file) {
                                fileName = file.name;
                                var suffixName = fileName.split(".")[1];
                                if(suffixName == 'png' && file.size >= 500 * 1024){
                                    alert("该图片文件超过500KB,请重新上传!!");
                                    // 移除该文件
                                    up.removeFile(file);
                                }else if(suffixName == 'mp3' && file.size >= 1* 1024 * 1024){
                                    alert("该音频文件超过1MB,请重新上传!!");
                                    // 移除该文件
                                    up.removeFile(file);
                                }else if(suffixName == 'mp4' && file.size >= 5 * 1024 * 1024){
                                    alert("该音频文件超过5MB,请重新上传!!");
                                    // 移除该文件
                                    up.removeFile(file);
                                }else{
                                    fileName = file.id + '.' + suffixName;
                                    $('#exampleInputFileName').html(fileName);
                                }
                            });
                        },

                        BeforeUpload: function(up, file) {
                            set_upload_param(up, fileName, true);
                        },


                        FileUploaded: function(up, file, info) {

                            if (info.status == 200){
                                $('#exampleInputFileName').html('');
                            }
                            else if (info.status == 203)
                            {
                                alert('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response);
                            }
                            else
                            {
                                alert(info.response);
                            }
                        },

                        Error: function(up, err) {
                            if (err.code == -600) {
                                alert("选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小");
                            }
                            else if (err.code == -601) {
                                alert("选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型");
                            }
                            else if (err.code == -602) {
                                alert("这个文件已经上传过一遍了");
                            }
                            else
                            {
                                alert("Error xml:" + err.response);
                            }
                        }
                    }
                });
                console.log(uploader.getOption('filters'));
                uploader.init();
            });

            document.getElementById('addPushEditionBtn').onclick = function() {
                var gv=$("#pushType").val();
                var timeTypeUpload = $('.timeTypeChange input:checked').val();
                var timeUpload = $('#pushTimeWord').val();
                var frequencyUpload = $('#PushFrequency').val();
                var effectiveUpload="";
                var foreverUpload = $('.validityChange input:checked').val();
                if(foreverUpload==0)
                    effectiveUpload = foreverUpload;
                else effectiveUpload = $(".effectiveInput").val();
                var reg = /^(([1-9])|(1\d)|(2[0-4]))$/;
                var regNum = /^\+?[1-9]\d*$/;
                if(gv=='节目'){
                    gv = 1;
                    var recommendationVal = $('#recommendation').val();
                    var categoryRadioVal = $('.categoryRadio input[type=radio]:checked').val();
                    var executiveContentVal = $('#executiveContent').val();
                    executiveContentVal = executiveContentVal.replace(/\"/g,'\\\"');
                    executiveContentVal = executiveContentVal.replace(/\n/g, '\\\n');
                    recommendationVal = recommendationVal.replace(/\"/g, '\\\"');
                    recommendationVal = recommendationVal.replace(/\n/g, '\\\n');

                    var urlHead =  $('#executiveContent').val().split('://')[0];
                    var urlAppName = $('#urlAppName').val();
                    var urlPackageName = $('#urlPackageName').val();

                    if(recommendationVal==""){
                        $(".alert").html('<strong>说明不能为空，</strong>请输入说明...').animate({opacity:1},100);
                        return false;
                    }else if(executiveContentVal==""){
                        $(".alert").html('<strong>执行的内容不能为空，</strong>请输入执行的内容...').animate({opacity:1},100);
                        return false;
                    }
                    if(timeTypeUpload==2){
                        if(!reg.test(timeUpload)){
                            $(".alert").html("<strong>推送时间只能输入1-24的整数。</strong>").animate({opacity:1},100);
                            return false;
                        }
                    }else{
                        timeUpload=0;
                        $(".alert").animate({opacity:0},100);
                    }
                    if(!regNum.test(frequencyUpload)){
                        $(".alert").html('<strong>推送的频率只能输入大于0的数字，</strong>请重新输入。').animate({opacity: 1}, 100);
                        return false;
                    }
                    if(foreverUpload==5){
                        if(!regNum.test(effectiveUpload)){
                            $(".alert").html("<strong>有效期只能输入大于0的数字，</strong>请重新输入。").animate({opacity: 1}, 100);
                            return false;
                        }
                    }
                    var formData = new FormData();

                    $.ajax({
                        url:"../PushContentUrlInfo/save",
                        type:"POST",
                        data:JSON.stringify({urlHead: urlHead,appName: urlAppName, packageName: urlPackageName}),
                        dataType:"json",
                        contentType : "application/json",
                        async:false,
                        success: function (data) {

                        }
                    });
                    if(categoryRadioVal=='考拉FM电台' || categoryRadioVal=='words'){
                        var topicVal = $('#topic').val();
                        topicVal = topicVal.replace(/\"/g, '\\"');
                        topicVal = topicVal.replace(/\n/g, '\\\n');
                        if(topicVal=="") {
                            $(".alert").html('<strong>主题不能为空，</strong>请输入主题...').animate({opacity:1},100);
                            return false;
                        }else{
                            if (executiveContentUrl){
                                var data='{\"explain\":\"'+recommendationVal+'\",' +
                                    '\"category\":\"'+categoryRadioVal+'\",' +
                                    '\"theme\":\"'+topicVal+'\",\"command\":\"'+executiveContentVal+'\",' +
                                    '\"appName\":\"'+ urlAppName +'\",\"appPackageName\":\"'+ urlPackageName +'\",'+
                                    '\"priority\":\"'+timeTypeUpload+'\",\"delayNumber\":\"'+timeUpload+'\",\"pullNumber\":\"'+frequencyUpload+'\"}';

                            }else{
                                var data='{\"explain\":\"'+recommendationVal+'\",' +
                                    '\"category\":\"'+categoryRadioVal+'\",' +
                                    '\"theme\":\"'+topicVal+'\",\"command\":\"'+executiveContentVal+'\",' +
                                    '\"priority\":\"'+timeTypeUpload+'\",\"delayNumber\":\"'+timeUpload+'\",\"pullNumber\":\"'+frequencyUpload+'\"}';

                            }
                            var dataPush=JSON.stringify({pushVersionEntity:{pushVersion:valPushNumber},type:gv,expiryDate:effectiveUpload,stateDescription:pushStatus,content:data});
                        }
                    }else if(categoryRadioVal=='picture' || categoryRadioVal=='audio' || categoryRadioVal=='video'){

                        if(fileName=="" || fileName==null || fileName==undefined){
                            $(".alert").html('<strong>主题不能为空，</strong>请上传文件...').animate({opacity:1},100);
                            return false;
                        }else{
                            formData.append('pushVersion',valPushNumber);
                            formData.append('stateDescription',pushStatus);
                            formData.append('expiryDate',effectiveUpload);
                            formData.append('type',gv);
                            formData.append('content',data);
                        }
                        var topicContent ="";
                        var topicId = "";

                        $("#addPushEditionBtn").attr("disabled","disabled");
                        $.ajax({
                            url: '../PushType/upLoadFileOSS',
                            type: 'POST',
                            data:formData,
                            processData: false,
                            contentType: false,
                            async:false,
                            success: function (data) {
                                requestOk(data,'',function(){
                                    if(data.code==0){

                                        // 服务器返回oss对象存储配置参数
                                        host = data.data.host;
                                        policyBase64 = data.data.policy;
                                        accessid = data.data.accessid;
                                        signature = data.data.signature;
                                        expire = data.data.expire;
                                        key = data.data.dir;

                                        topicContent= host + '/' + key + fileName;
                                        //alert(topicContent);
                                        topicId = data.data.id;
                                    }
                                },function(){
                                    if(data.code!=0){
                                        $(".alert").html('<strong>'+data.data+'</strong>').animate({opacity:1},100);
                                        topicContent="";
                                        topicId="";
                                    }
                                });
                            },
                            error: function (data) {
                            }
                        });
                        if(topicContent!=""){
                            if (executiveContentUrl)
                                var data='{\"explain\":\"'+recommendationVal+'\",\"category\":\"'+categoryRadioVal+'\",\"theme\":\"'+topicContent+'\",\"command\":\"'+executiveContentVal+'\",\"appName\":\"'+ urlAppName +'\",\"appPackageName\":\"'+ urlPackageName +'\",\"priority\":\"'+timeTypeUpload+'\",\"delayNumber\":\"'+timeUpload+'\",\"pullNumber\":\"'+frequencyUpload+'\"}';
                            else
                                var data='{\"explain\":\"'+recommendationVal+'\",\"category\":\"'+categoryRadioVal+'\",\"theme\":\"'+topicContent+'\",\"command\":\"'+executiveContentVal+'\",\"priority\":\"'+timeTypeUpload+'\",\"delayNumber\":\"'+timeUpload+'\",\"pullNumber\":\"'+frequencyUpload+'\"}';

                            var dataPush=JSON.stringify({pushVersionEntity:{pushVersion:valPushNumber},type:gv,expiryDate:effectiveUpload,stateDescription:pushStatus,content:data,id:topicId});
                        }else{
                            return false;
                        }
                    }
                }else if(gv=='App'){
                    gv = 2;
                    var appNameVal = $('#AppName').val();
                    var appPackageVal = $('#appPackage').val();
                    var appIntroduceVal =$('#AppIntroduce').val();
                    if(appNameVal==""){
                        $(".alert").html('<strong>App名称不能为空，</strong>请输入App名称...').animate({opacity:1},100);
                        return false;
                    }else if(appPackageVal==""){
                        $(".alert").html('<strong>App包名不能为空，</strong>请输入App包名...').animate({opacity:1},100);
                        return false;
                    }else if(appIntroduceVal==""){
                        $(".alert").html('<strong>App介绍说明不能为空，</strong>请输入App介绍说明...').animate({opacity:1},100);
                        return false;
                    }else{
                        var data='{\"appName\":\"'+appNameVal+'\",\"appPackageName\":\"'+appPackageVal+'\",\"appIntroduce\":\"'+appIntroduceVal+'\"}';
                        dataPush=JSON.stringify({id:revisePushId,pushVersionEntity:{pushVersion:valPushNumber},type:gv,stateDescription:pushStatus,content:data});
                    }
                }else if(gv=='资讯'){
                    gv = 3;
                    var topicInformationVal = $('#topicInformation').val();
                    var detailsInformationVal = $('#detailsInformation').val();
                    topicInformationVal = topicInformationVal.replace(/\"/g, '\\\"');
                    topicInformationVal = topicInformationVal.replace(/\n/g, '\\\n');
                    detailsInformationVal = detailsInformationVal.replace(/\"/g, '\\\"');
                    detailsInformationVal = detailsInformationVal.replace(/\n/g, '\\\n');
                    if(topicInformationVal==''){
                        $(".alert").html('<strong>资讯主题不能为空，</strong>请输入资讯主题...').animate({opacity:1},100);
                        return false;
                    }else if(detailsInformationVal==''){
                        $(".alert").html('<strong>资讯详情不能为空，</strong>请输入资讯详情...').animate({opacity:1},100);
                        return false;
                    }
                    if(timeTypeUpload==2){
                        if(!reg.test(timeUpload)){
                            $(".alert").html("<strong>推送时间只能输入1-24的整数。</strong>").animate({opacity:1},100);
                            return false;
                        }
                    }else{
                        timeUpload=0;
                        $(".alert").animate({opacity:0},100);
                    }
                    if(!regNum.test(frequencyUpload)){
                        $(".alert").html('<strong>推送的频率只能输入整数，</strong>请重新输入。').animate({opacity: 1}, 100);
                        return false;
                    }
                    if(foreverUpload==5){
                        if(!regNum.test(effectiveUpload)) {
                            $(".alert").html("<strong>有效期只能输入整数，</strong>请重新输入。").animate({opacity: 1}, 100);
                            return false;
                        }
                    }
                    var data='{\"topicInformation\":\"'+topicInformationVal+'\",\"detailsInformation\":\"'+detailsInformationVal+'\",\"priority\":\"'+timeTypeUpload+'\",\"delayNumber\":\"'+timeUpload+'\",\"pullNumber\":\"'+frequencyUpload+'\"}';
                    dataPush=JSON.stringify({id:revisePushId,pushVersionEntity:{pushVersion:valPushNumber},type:gv,expiryDate:effectiveUpload,stateDescription:pushStatus,content:data});
                }
                $("#addPushEditionBtn").attr("disabled","disabled");
                console.log(dataPush);
                $.ajax({
                    url: '../PushType/add',
                    type: 'POST',
                    dataType: 'json',
                    data:dataPush,
                    contentType: "application/json",
                    success: function (data) {
                        requestOk(data,'',function(){
                            $('#identifier1').modal('hide');
                            changeSuccess('添加成功！');
                            if(gv=="1"){
                                $('#myTabs li:first a').tab('show');
                                programPush();
                            }
                            if(gv=="2"){
                                $('#myTabs li:eq(1) a').tab('show');
                                appPush();
                            }
                            if(gv=="3"){
                                $('#myTabs li:last a').tab('show');
                                messagePush();
                            }
                            revisePushId="";
                        },customCodeError);
                    },
                    error: function (data) {
                    }
                });

                uploader.start();
            };
        },
    }

});

uploader.init();

//点击修改推送内容
$(document).on("click",".revise",function(){
    $('#identifier1').modal('show');
    var valPushType = $(this).parents("tr").find(".type").text();
    revisePushId = $(this).parents("tr").find("input").val();
    $('#pushType').selectpicker("val",valPushType);
    $('#recommendation').val($(this).parents("tr").find('.instructions').text());
    $('#topic').val($(this).parents("tr").find('.theme').text());
    $('#pushCategory').val($(this).parents("tr").find('.category').text());
    $('#executiveContent').val($(this).parents("tr").find('.contentExecuted').text());
    $('#AppName').val($(this).parents("tr").find('.appName').text());
    $('#AppIntroduce').val($(this).parents("tr").find('.introduction').text());
    $('#topicInformation').val($(this).parents("tr").find('.theme').text());
    $('#detailsInformation').val($(this).parents("tr").find('.particulars').text());
    $('#appPackage').val($(this).parents("tr").find('.appPackage').text());
    $(".alert").animate({opacity:0},100);
    $("#addPushEditionBtn").removeAttr("disabled","disabled");
});


//根据推送类别选择输入框或上传文件
$('.categoryRadio input[type=radio]').change(function(){
    var valRadio = $(this).val();
    if(valRadio=='考拉FM电台' || valRadio=='words'){
        $('.topicText').val('');
        $('.topicText').css('display','block');
        $('.topicFile').css('display','none');
        $('#exampleInputFileName').css('display','none');
    }else if(valRadio=='picture' || valRadio=='audio' || valRadio=='video'){
        $('.topicFile').val('');
        $('.topicFile').css('display','block');
        $('#exampleInputFileName').css('display','block');
        $('.topicText').css('display','none');
        if(valRadio=='picture') $('.topicFile').attr('accept','image/png');
        if(valRadio=='audio') $('.topicFile').attr('accept','audio/mp3');
        if(valRadio=='video') $('.topicFile').attr('accept','video/mp4');
    }
});


$('.categoryRadio input[type=radio]').change(function(){
    $(".alert").animate({opacity:0},100);
})

$('.timeTypeChange input[type=radio]').change(function(){

})

$('.timeTypeChange input[type=radio]').change(function(){
    var realTime = $(this).val();
    realTime==1? $('#PushFrequency').val("1").attr('disabled','disabled'):$('#PushFrequency').removeAttr('disabled','disabled');
    $(".alert").animate({opacity:0},100);
    if(realTime==2)
        $('.pushHour').show();
    else
        $('.pushHour').hide();

});

$('.validityChange input[type=radio]').change(function(){
    var validityVal = $(this).val();
    if(validityVal!=0)
        $('.effectiveInput').removeAttr('disabled','disabled');
    else
        $('.effectiveInput').attr('disabled','disabled');
});

$("#addPushContent").click(function (){
    $("[name='inlineRadioOptions']").removeAttr("checked");//取消全选
    $("#topic").show();
    $('#exampleInputFile').css('display','none');
    $('#exampleInputFileName').css('display','none');
    $(".typeApp input[type=text],textarea").val("");
    $(".typeInformation input[type=text],textarea").val("");
    $("#exampleInputFile").val("");
    $(".typeProgram input[type=text],textarea").val("");
    $(".alert").animate({opacity:0},100);
    $('#PushFrequency').val("1");
    if($('.validityChange input[checked=checked]').val() == 0){
        $('#PushFrequency').attr("disabled","disabled");
    };
    $("#executiveContent").val("无");
    $("#addPushEditionBtn").removeAttr("disabled","disabled");

    $('#div-urlAppName').hide();
    $('#div-urlPackageName').hide();
})

var executiveContentUrl;

$('#executiveContent').on('input',function () {
    var url = $('#executiveContent').val();
    var reg = /^[\w]*:\/\/[\w]*/;

    executiveContentUrl = reg.test(url);
    if(executiveContentUrl){
        var urlHead = url.split('://')[0];
        if( urlHead.toLocaleLowerCase() === 'https' ||
            urlHead.toLocaleLowerCase() === 'http' ||
            urlHead.toLocaleLowerCase() === 'ftp' ||
            urlHead.toLocaleLowerCase() === 'tcp' ||
            urlHead.toLocaleLowerCase() === 'ip' ||
            urlHead.toLocaleLowerCase() === 'udp' ||
            urlHead.toLocaleLowerCase() === 'icmp' ||
            urlHead.toLocaleLowerCase() === 'rip' ||
            urlHead.toLocaleLowerCase() === 'tftp' ||
            urlHead.toLocaleLowerCase() === 'dns' ||
            urlHead.toLocaleLowerCase() === 'smtp' ||
            urlHead.toLocaleLowerCase() === 'nfs' ||
            urlHead.toLocaleLowerCase() === 'telnet'){
                executiveContentUrl = false;
                $('#div-urlAppName').hide();
                $('#div-urlPackageName').hide();
        }else{
            $('#div-urlAppName').show();
            $('#div-urlPackageName').show();
            $.ajax({
                url:"../PushContentUrlInfo/findOne",
                type:"POST",
                data:JSON.stringify({urlHead: urlHead}),
                dataType:"json",
                contentType : "application/json",
                success: function (data) {
                    if(data.data == undefined || data.data == null){
                        $('#urlAppName').val('');
                        $('#urlPackageName').val('');

                        $("#urlAppName").removeAttr("disabled");
                        $("#urlPackageName").removeAttr("disabled");
                    }else{
                        $('#urlAppName').val(data.data.appName);
                        $('#urlPackageName').val(data.data.packageName);

                        $("#urlAppName").attr("disabled","disabled");
                        $("#urlPackageName").attr("disabled","disabled");
                    }
                }
            });
        }
    }else{
        $('#div-urlAppName').hide();
        $('#div-urlPackageName').hide();
    }
})

function boxPopover(){
    $(".showBox").popover({
        container: "body",
        trigger: " manual" //手动触发
    }).on('show.bs.popover', function () {
        $(this).addClass("popover_open");
    }).on('hide.bs.popover', function () {
        $(this).removeClass("popover_open");
    });
    $(".showBox").click(function (event) {
        if ($(this).hasClass("popover_open")) {
            $(this).popover("hide")
        } else {
            $(".popover_open").popover("hide");
            $(this).popover("show");
        }
        event.stopPropagation();
    });
    $(document).on("click",".popover",function(){
        return false;
    });
    $(document).click(function (event) {
        event.stopPropagation();
        $('.showBox').popover("hide");
    });
}

function checkMessage(){
    var regM = /^[\'\"]+|[\'\"]+$/g;
    $.ajax({
        async:false,
        url:'../PushType/getPage',
        type:'POST',
        data:JSON.stringify({object:{type:"3", pushVersionEntity:{pushVersion:valPushNumber}},page:val_page,size:10}),
        dataType:'json',
        contentType:'application/json',
        success:function(result){
            requestOk(result,'',function(){
                var pushZX = result.data.content;
                if(pushZX==undefined){
                    isNaN();
                }else{
                    for(var k = 0 ; k < pushZX.length ; k++) {
                        var valZX = pushZX[k].content;
                        if (valZX != undefined) {
                            valZX = eval('(' + valZX.replace(regM, "") + ')');
                            var pRealTime = valZX.priority;
                            if (pRealTime == 1){
                                $(".timeTypeChange input[type=radio]:first").attr("disabled","disabled");
                                $(".timeTypeChange input[type=radio]:first").prop("checked",false);
                                $(".timeTypeChange input[type=radio]").eq(2).prop("checked",true);
                                return false;
                            }
                        }
                    }
                };
            },customCodeError);
        },
        error:function(data){
        }
    })
}