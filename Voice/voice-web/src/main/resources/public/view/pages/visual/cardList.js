var initTable;
$(function(){
    $('#table').bootstrapTable({
        url:'../../../card/findAllByPage',
        method:'post',
        silent:true,
        pagination:true,// 在表格底部显示分页组件，默认false
        pageList:[10,20,30],// 设置页面可以显示的数据条数
        pageSize:10,
        pageNumber:1,
        sidePagination:'server',// 设置为服务器端分页
        dataType:'json',
        contentType:'application/json',
        undefinedText:'<font style="color:#9c9c9c">(空)</font>',
        queryParams:function (val) {
            var param={
                    page:val.limit/val.offset,
                    size:val.limit
                };
            return param;
        },
        responseHandler:function (res) {
            if(resResult(res)){
                if(res.data==''){
                    return{
                        "total":0,
                        "rows":0
                    }
                }
                return{
                    "rows":res.data.content,
                    "total":res.data.totalElements
                }
            }
        },
        columns:[
            {
                title:"序号",
                align:'center',
                halign:'center',
                formatter:function (value,row,index) {
                    var option=$('#table').bootstrapTable('getOptions');
                    return option.pageSize*(option.pageNumber -1)+index+1;
                }
            },{
                title: '卡片名称',
                field: 'name',
                align: 'center',
                halign: 'center'
            },{
                title:'类型',
                field:'description',
                align:'center',
                halign:'center',
                formatter:function (value,row,index) {
                    
                }
            },{
                title:'所有者',
                field:'lastModifiedSysUser',
                align:'center',
                halign:'center'
            }, {
                title: '创建时间',
                field: 'lastModifiedDate',
                align: 'center',
                halign: 'center',
                formatter: function (value, row, index) {
                    return changeDateFormat(value)
                }
            }, {
                title: '操作',
                align: 'center',
                halign: 'center',
                events: operateEvents,
                formatter: function (value, row, index) {
                    return'<a class="updateCard" href="javascript:;"><span class="label label-info">查看</span></a>&nbsp;&nbsp;' +
                        '<a class="deleteCard" href="javascript:;"><span class="label label-warning">删除</span></a>';
                }
            }
        ]
    });
    $('#addCardList').click(function () {
        location.href='newCard.html';
    });

});
window.operateEvents = {
    'click .deleteCard': function (e, value, row, index) {
        var dashConfirm = confirm("请您确定是否要删除该推送内容？");
        if(dashConfirm){
            $.ajax({
                url:'../../../card/delete',
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
    'click .updateCard':function () {
        location.href='detail-cardList.html';
    }
};
// window.parent = {
//     'click .updateCard':function () {
//
//     }
// };
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