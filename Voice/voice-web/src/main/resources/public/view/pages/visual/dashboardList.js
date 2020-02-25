var initTable;
$(function(){
    $('#table').bootstrapTable({
        url:'../../../dashboard/findAllByPage',
        silent:true,
        method:'post',
        pagination:true,// 在表格底部显示分页组件，默认false
        pageList:[10,20,30],// 设置页面可以显示的数据条数
        pageSize:10,
        pageNumber:1,
        sidePagination:'server',// 设置为服务器端分页
        dataType:'json',
        contentType:'application/json',
        undefinedText:'<font style="color: #9c9c9c">(空)</font>',
        queryParams:function (val) {
            var content={
                size: val.limit,
                page: val.offset / val.limit
            };
            return content;
        },
        responseHandler:function (res) {
            if (resResult(res)) {
                if (res.data == '') {
                    return {
                        'rows': 0,
                        'total': 0
                    }
                }
                return {
                    "rows": res.data.content,//BootStrap Table默认使用后端传递来json的rows作为结果集
                    "total": res.data.totalElements
                }
            }
        },
        columns:[
            {
                title: '序号',
                align: 'center',
                halign: 'center',
                width:10,
                formatter: function (value, row, index) {
                    var options = $("#table").bootstrapTable('getOptions');
                    return options.pageSize * (options.pageNumber - 1) + index + 1;
                }
            },{
                title: '名称',
                field: 'name',
                align: 'center',
                halign: 'center'
            },{
                title: '描述',
                field: 'description',
                align: 'center',
                halign: 'center'
            },{
                title: '所有者',
                field: 'lastModifiedSysUser',
                align: 'center',
                halign: 'center'
            },{
                title: '创建时间',
                field: 'lastModifiedDate',
                align: 'center',
                halign: 'center',
                formatter:function (value,row,index) {
                    return changeDateFormat(value)
                }
            },{
                title: '操作',
                align: 'center',
                halign: 'center',
                events: operateEvents,
                formatter: function (value, row, index) {
                    return'<a class="updateDash" href="javascript:;"><span class="label label-info">查看</span></a>&nbsp;&nbsp;' +
                        '<a class="deleteDash" href="javascript:;"><span class="label label-warning">删除</span></a>';
                }
            }
        ]
    });
    $('#addDash').click(function () {
        $.ajax({
            url:'../../../dashboard/save',
            type:'post',
            dataType:'json',
            contentType:'application/json',
            data:JSON.stringify({
                "name": $('#inputDash').val(),
                "description": $('#inputDescribe').val()
            }),
            success:function (res) {
                if(resResult(res))
                    $('#myModal').modal('hide');
                    $('#table').bootstrapTable('refresh');
            }
        })
    })
});
window.operateEvents = {
    'click .deleteDash': function (e, value, row, index) {
        var dashConfirm = confirm("请您确定是否要删除该推送内容？");
        if(dashConfirm){
            $.ajax({
                url:'../../../dashboard/delete',
                type:'POST',
                data:JSON.stringify({id:row.id}),
                dataType:'json',
                contentType:'application/json',
                success:function(data){
                    if (resResult(data)){
                        changeSuccess("删除成功！");
                        $("#table").bootstrapTable('removeAll');
                        $("#table").bootstrapTable('refresh');
                    }
                }
            });
        }
    },
    'click .updateDash':function (e,value,row,index) {
        location.href='../visual-dashbroad/add.html?'+row.id;
    }
};
//时间戳转换
function changeDateFormat(d) {
    var date = new Date(parseInt(d, 10));
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
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