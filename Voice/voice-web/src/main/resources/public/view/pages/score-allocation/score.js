var onLine = '<button id="onLine" type="button" class="lineOn">上线</button>';
var noSubmit = '<button id="noSubmit" type="button" class="submitNo">未提交</button>';
var deleteButton = '<button id="deleteButton" type="button" class="btn btn-danger btn-xs" style="margin-left: 10px" title="删除"><i class="glyphicon glyphicon-remove"></i>&nbsp;清空分数</button>';
var change = '<input id="scoreChange" type="text" />';
$(function () {

    $("#tree-table").bootstrapTable({
        url: '../../../ServicesType/get',
        method: 'post',
        pagination: true, // 在表格底部显示分页组件，默认false
        pageList: [1, 10, 20, 30], // 设置页面可以显示的数据条数
        pageSize: 10, // 页面数据条数
        pageNumber: 1, // 首页页码
        sidePagination: 'server', // 设置为服务器端分页
        dataType: 'json',
        contentType: 'application/json',
        undefinedText: '<font style="color: #9c9c9c">(空)</font>',
        toolbar: '#toolbar',
        singleSelect: true, //开启单选
        clickToSelect: true,
        queryParams: function (params) { //设置查询参数
            var param = {
                size: params.limit,
                page: params.offset / params.limit
            };
            return param;
        },
        responseHandler: function (res) {
            if (resResult(res)){
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
                    var options = $("#tree-table").bootstrapTable('getOptions');
                    return options.pageSize * (options.pageNumber - 1) + index + 1;
                }
            },
            {
                title: '服务类型',
                field: 'type',
                align: 'center',
                halign: 'center'
            },
            {
                title: '已发布分数',
                field: 'score',
                align: 'center',
                halign: 'center',
                type:'text'
            },
            {
                title: '未发布分数',
                field: 'testScore',
                align: 'center',
                halign: 'center',
                type:'text',
                editable: {
                    type:"text",
                    title: "分数修改",
                    placement: "right"
                }
            },
            {
                title: '状态',
                field: 'status',
                align: 'center',
                halign: 'center',
                formatter: function (value, row, index) {
                    if (value == "ONLINE") {
                        return onLine;
                    } else if (value == "UNCOMMIT") {
                        return noSubmit;
                    }
                }
            },
            {
                title: '修改人',
                field: 'lastModifiedSysUser',
                align: 'center',
                halign: 'center'
            },
            {
                title: '修改时间',
                field: 'lastModifiedDate',
                align: 'center',
                halign: 'center',
                formatter: function (value, row, index) {
                    return changeDateFormat(value);
                }
            },
            {
                title: '操作',
                align: 'center',
                halign: 'center',
                events: operateEvents,
                formatter: function (value, row, index) {
                    return deleteButton;
                }
            }
        ],
        //未发布分数修改后自行提交
        onEditableSave:function (filed,row, oldValue, $el) {
            $.ajax({
                url:'../../../ServicesType/saveScore',
                type:'post',
                dataType:'json',
                data:JSON.stringify({
                    id:row.id,
                    score: row.testScore
                }),
                contentType:"application/json",
                success:function (data) {
                    if(resResult(data))
                        alert("修改成功");
                    $('#tree-table').bootstrapTable('refresh',{
                        query: {
                            page: $("#tree-table").bootstrapTable('getOptions').pageNumber - 1,
                            size: $("#tree-table").bootstrapTable('getOptions').pageSize,
                        }
                    });
                }
            })
        }
    })
    //查询按钮
    $("#searchWords").click(function () {
        var fuzzy_result = $("#fuzzySearch").val();
        $('#tree-table').bootstrapTable('refresh', {
            url: '../../../ServicesType/findByLikeType',
            query: {
                object: {
                    type: fuzzy_result
                },
                page: 0,
                size: $("#tree-table").bootstrapTable('getOptions').pageSize
            }
        })
    })

    //发布修改数据按钮
    $(".issueChange").click(function () {
        $.ajax({
            url:'../../../ServicesType/syncScore',
            type:'post',
            dataType:'json',
            contentType:"application/json",
            success:function (data) {
                if(resResult(data)){
                    alert("发布成功");
                    location.reload();
                }
            }
        })
    })
});


window.operateEvents = {
    'click #deleteButton': function (e, value, row, index) {
        var pushConfirm = confirm("请您确定是否删除清空该分数么？清空后的数据不会被下发");
        if(pushConfirm){
            $.ajax({
                url:'../../../ServicesType/resetScore',
                type:'POST',
                data:JSON.stringify({id:row.id}),
                dataType:'json',
                contentType:'application/json',
                success:function(data){
                    if (resResult(data)){
                        // changeSuccess("删除成功！");
                        $("#tree-table").bootstrapTable('refresh');
                    }
                }
            });
        }
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