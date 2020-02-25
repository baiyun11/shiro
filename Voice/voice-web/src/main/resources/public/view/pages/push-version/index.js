$(function(){
    $("#table").bootstrapTable({
        url: '../../../PushVersion/getPage',
        method: 'post',
        pagination: true, // 在表格底部显示分页组件，默认false
        pageList: [10,20,30], // 设置页面可以显示的数据条数
        pageSize: 10, // 页面数据条数
        pageNumber: 1, // 首页页码
        sidePagination: 'server', // 设置为服务器端分页
        dataType: 'json',
        contentType: 'application/json',
        undefinedText: '<font style="color: #9c9c9c">(空)</font>',
        toolbar: '#toolbar',
        queryParams:function(params) { //设置查询参数
            var param = {
                property: 'pushVersion',
                direction: 'DESC',
                size: params.limit,
                page: params.offset/params.limit
            };
            return param;
        },
        responseHandler: function (res) {
            if(resResult(res)){
                return {
                    "total": res.data.totalElements,
                    "rows": res.data.content
                };
            }
        },
        columns: [
            {
                title: '序号',
                align: 'center',
                halign: 'center',
                formatter: function (value, row, index) {
                    var options = $("#table").bootstrapTable('getOptions');
                    return options.pageSize * (options.pageNumber - 1) + index + 1;
                }
            },
            {
                title: '推送版本号',
                field: 'pushVersion',
                align: 'center',
                halign: 'center',
                formatter: function (value, row, index) {
                    if(index == 0)
                        $("#pushVersionInput").val(value + 1);
                    return '<a href="../push-content/index.html?pushVersion='+ value +'&stateDescription='+ row.stateDescription +'"><b>'+ value +'</b></a>';
                }
            },
            {
                title: '最后编辑人',
                field: 'lastModifiedSysUser',
                align: 'center',
                halign: 'center',
            },
            {
                title: '创建时间',
                field: 'createdDate',
                align: 'center',
                halign: 'center',
                formatter: function(value){
                    return changeDateFormat(value);
                }
            },
            {
                title: '操作',
                align: 'center',
                halign: 'center',
                events: operateEvents,
                formatter: function (value, row, index) {
                    if (row.stateDescription == 'test'){
                        $('#add').attr('disabled','disabled');
                        return '<a class="issuePush" href="javascript:;"><span class="label label-danger">发布</span></a>';
                    }
                    else if (row.stateDescription == 'publish'){
                        return '已发布 | <a class="deletePush" href="javascript:;"><span class="label label-warning">删除</span></a>';
                    }
                    else if(row.stateDescription == 'deleted'){
                        return '<font style="color: #9c9c9c">已删除</font>';
                    }
                }
            }
        ],
        onLoadSuccess: function(data){
            // 如果获取到的数据为0时，默认从20001开始
            if (data.total == 0)
                $("#pushVersionInput").val(20001);
        }
    });

    $('#addPushVersionBtn').click(function(){
        $.ajax({
            url:'../../../PushVersion/add',
            type:'POST',
            data:JSON.stringify({pushVersion: $("#pushVersionInput").val()}),
            dataType:'json',
            contentType:'application/json',
            success:function(data){
                if(resResult(data)){
                    $('#modalEdition').modal('hide');
                    changeSuccess("添加成功！");
                    $("#table").bootstrapTable('refresh');
                }
            }
        });
    });
});

window.operateEvents = {
    'click .issuePush': function (e, value, row, index) {
        var issuePush = confirm("确定要发布吗？")
        if(issuePush){
            $.ajax({
                url:'../../../PushVersion/update',
                type:'POST',
                data:JSON.stringify({pushVersion:row.pushVersion}),
                dataType:'json',
                contentType : "application/json",
                success:function(data){
                    if (resResult(data)){
                        changeSuccess("发布成功！");
                        $('#add').removeAttr('disabled');
                        $("#table").bootstrapTable('refresh');
                    }
                }
            })
        }
    },
    'click .deletePush': function (e, value, row, index) {
        var pushConfirm = confirm("请您确定是否要删除该版本？");
        if(pushConfirm){
            $.ajax({
                url:'../../../PushVersion/delete',
                type:'POST',
                data:JSON.stringify({pushVersion:row.pushVersion}),
                dataType:'json',
                contentType:'application/json',
                success:function(data){
                    if (resResult(data)){
                        changeSuccess("删除成功！");
                        $("#table").bootstrapTable('refresh');
                    }
                }
            });
        }
    }
};

//时间戳转换
function changeDateFormat(d){
    var date=new Date(parseInt(d,10));
    var month = date.getMonth()+1 <10 ? "0"+ (date.getMonth()+1):date.getMonth()+1;
    var day = date.getDate() <10 ? "0"+date.getDate():date.getDate();
    var hour=date.getHours() <10 ? "0"+date.getHours():date.getHours();
    var minutes=date.getMinutes() <10 ? "0"+date.getMinutes():date.getMinutes();
    var seconds=date.getSeconds() <10 ? "0"+date.getSeconds():date.getSeconds();
    return date.getFullYear()+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds;
}

//添加、删除、修改后的成功提示
function changeSuccess(a){
    $("#alertSuccess").modal('show');
    $("#alertSuccess").find(".modal-body").text(a);
    $("#alertSuccess").on("shown.bs.modal",function(){
        setTimeout(function(){
            $("#alertSuccess").modal('hide');
        },400);
    });
}

