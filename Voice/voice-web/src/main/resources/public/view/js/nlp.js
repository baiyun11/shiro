//通用的错误码内容
$(function(){
    $.ajax({
        url:'../nlp/fingByErrorPattern',
        type:'POST',
        dataType:'json',
        contentType:'application/json',
        success:function(data) {
            requestOk(data,'',function(){
                var errorOptionHtml="";
                $("#errorCodeData").append('<option value="">全部</option>')
                for(var j=0; j<data.data.length; j++){
                    var errorPatternVal=data.data[j].errorPattern;
                    var patternCodingVal=data.data[j].patternCoding;
                    $("#errorCodeData").append('<option value="'+patternCodingVal+'">'+errorPatternVal+'</option>');
                }
                $('#errorCodeData').selectpicker('refresh');
                $('#errorCodeData').selectpicker('render');
            },customCodeError);
        },
        error:function(data) {
        }
    });
})

//分页
var statusVal = '';
var changeData ="";
function getData(params,callback) {
    var val_page = params.page - 1;
    if(statusVal==""){
        if(changeData=="")
            var data =JSON.stringify({object:{},page:val_page,size:10});
        else
            var data =JSON.stringify({object:{errorCode:changeData},page:val_page,size:10});
    }else{
        if(changeData=="")
            var data =JSON.stringify({object:{status:statusVal},page:val_page,size:10});
        else
            var data =JSON.stringify({object:{status:statusVal,errorCode:changeData},page:val_page,size:10});
    }
    $.ajax({
        url:'../nlp/findAll',
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
var currPage = 1;
var skip_page="";
var dataArr="";
var warning="";
var statusError ="";
var changeData="";
var allChangeStatus=""
function render(d){
    skip_page=="" ? currPage=currPage : currPage=d;
    getData({
        page: currPage,
        size: 10
    },function(data){
        $("#allStatus").html("");
        var WSHtml = "";
        var toExamine ="";
        dataArr=data.data.content;
        if(dataArr==undefined){
            $("#allStatus").html(warning);
            $('.page_navigation').css('display','none');
            return false;
        }
        toExamine= '<div class="selectBox examine"><span class="label label-info">修改</span><select>'+
            '<option value="">请选择</option>' +
            '<option value="solved">待解决</option>' +
            '<option value="closed">已关闭</option>'+
            '<option value="resolved">已解决</option>'+
            '<option value="acceptance">已验收</option>'+
            '</select></div>';
        for(var i=0; i< dataArr.length; i++){
            var oderNum=(currPage-1)*10+i+1;
            WSHtml= WSHtml+ '<tr>' +
                '<td><div class="oderNum">'+oderNum+'</div></td>' +
                '<td><div class="rawTextDA" title="'+dataArr[i].rawText+'">'+dataArr[i].rawText+'</div></td>' +
                '<td><div class="serviceDA">'+dataArr[i].errorCode+'</div></td>' +
                '<td><div class="serviceDA">'+dataArr[i].corrrectFiled+'</div></td>' +
                '<td><div class="serviceDA">'+dataArr[i].errorFiled+'</div></td>' +
                '<td><div class="statusTBS">'+dataArr[i].status+'</div></td>' +
                // '<td><div class="AutoVINDA">'+dataArr[i].lastModifiedSysUser+'</div></td>' +
                // '<td><div class="date_time">'+changeDateFormat(dataArr[i].lastModifiedDate)+'</div></td>' +
                '<td><div class="operation">' +
                '<a class="look_all" href="#lookAll" onclick="viewAll('+i+')" data-toggle="modal"><span class="label label-success">查看全部</span></a>' +
                toExamine+'<input type="hidden" value="'+dataArr[i].id+'"/>'+
                '</div></td>'+
                '</tr>'
        }
        var num_p=data.data.totalPages;
        var num_l=data.data.totalElements;
        $("#num_pages").html("共 "+num_p+" 页");
        $("#num_lists").html("共 "+num_l+" 条数据");
        num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
        $("#allStatus").append(WSHtml);
        $('#allStatus tr td').each(function(){
            if($(this).text()==='undefined'){
                $(this).text('');
            };
        })
        $('[data-toggle="popover"]').popover();
        setPaginator(currPage, data.data.totalPages , render);
    })
    skip_page="";
    $("#skipPage").val("");
}
render(currPage);

$(function(){
    //导出excel表格
    $("#exportData").click(function(){
        var codeVal = $("#errorCodeData").val();
        var errorStr = '../nlp/nlpExport?';
        if(statusVal!=""){
            if(codeVal!=""){
                errorStr=errorStr+'status='+statusVal+'&errorCode='+codeVal;
            }else{
                errorStr=errorStr+'status='+statusVal;
            }
        };
        window.location.href=errorStr;
    });

    //导入excel表格文件
    $("#importData").click(function(){
        var formdata = new FormData();
        var excelVal = $(".solvedBtn input[type=file]")[0].files[0];
        if(excelVal == undefined){
            $(".warnWord").html('请选择需要上传的文件！').show();
            return false;
        }else{
            formdata.append('file',excelVal);
            $(".warnWord").html('').hide();
        }
        $.ajax({
            url:'../nlp/nlpImport',
            type:'POST',
            data:formdata,
            processData: false,
            contentType: false,
            success:function(data){
                requestOk(data,'',function(){
                    $(".solvedBtn input[type=text]").val('');
                    $('body').append('<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" id="alertSuccess">' +
                        '<div class="modal-dialog modal-sm" role="document">' +
                        '<div class="modal-content">' +
                        '<div class="modal-body">' +
                        '</div></div></div></div>');
                    changeSuccess("导入成功!");
                },customCodeError);
            },
            error:function(data){
            }
        });
    })

})

$("#statusData").change(function(){
    statusVal = $(this).val();
    allChangeStatus="allStatus";
    // changeData ="";
    currPage=1;
    render(currPage);
});

//审核按钮事件
$(document).on("change",".examine select",function(){
    var checkVal = $(this).val();
    var checkIdVal = $(this).parent().next().val();
    $.ajax({
        url:'../nlp/update',
        type:'POST',
        data:JSON.stringify({id:checkIdVal,status:checkVal}),
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            requestOk(data,'',function(){
                $('body').append('<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" id="alertSuccess">' +
                    '<div class="modal-dialog modal-sm" role="document">' +
                    '<div class="modal-content">' +
                    '<div class="modal-body">' +
                    '</div></div></div></div>');
                changeSuccess("操作已成功!");
                currPage=1;
                render(currPage);
            },customCodeError);
        },
        error:function(data){
        }
    });
});

//查看全部
function viewAll(i){
    $("#nlpWord").html('');
    var allHtml="";
    allHtml = allHtml+
        '<tr><td><span>id:</span></td><td>'+dataArr[i].id+'</td></tr>' +
        '<tr><td><span>rawText:</span></td><td>'+dataArr[i].rawText+'</td></tr>' +
        '<tr><td><span>status:</span></td><td>'+dataArr[i].status+'</td></tr>'+
        '<tr><td><span>errorCode:</span></td><td>'+dataArr[i].errorCode+'</td></tr>'+
        '<tr><td><span>corrrectFiled:</span></td><td>'+dataArr[i].corrrectFiled+'</td></tr>'+
        '<tr><td><span>errorFiled:</span></td><td>'+dataArr[i].errorFiled+'</td></tr>'+
        '<tr><td><span>rawJson:</span></td><td>'+dataArr[i].rawJson+'</td></tr>'+
        '<tr><td><span>remarks:</span></td><td>'+dataArr[i].remarks+'</td></tr>'+
        '<tr><td><span>SysUser:</span></td><td>'+dataArr[i].lastModifiedSysUser+'</td></tr>'+
        '<tr><td><span>Date:</span></td><td>'+changeDateFormat(dataArr[i].lastModifiedDate)+'</td></tr>';
    $("#nlpWord").html(allHtml);

    $('#nlpWord tr td').each(function(){
        if($(this).text()==='undefined'){
            $(this).text('');
        };
    })

}

// 按错误码查询
$(function(){
    $("#errorCodeData").change(function(){
        changeData = $(this).val();
        currPage=1;
        render(currPage);
    });
});

// 选择文件后名称显示在输入框内
function showText(){
    var nameVal = $(".solvedBtn input[type=file]").val();
    $(".solvedBtn input[type=text]").val(nameVal);
}


