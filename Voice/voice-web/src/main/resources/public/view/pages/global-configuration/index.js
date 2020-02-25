//var editButton = '<button id="editButton" type="button" class="btn btn-info btn-xs" title="修改" ><i class="glyphicon glyphicon-pencil"></i></button>';
var deleteButton = '<button id="deleteButton" type="button" class="btn btn-danger btn-xs" style="margin-left: 10px" title="删除"><i class="glyphicon glyphicon-remove"></i></button>';
var onlineStatus = '<div style="color: #1abc9c;font-size: 14px">上线</div>';
var unCommitStatus = '<div style="color: #b92c28;font-size: 14px">未提交</div>';

$(function(){

    $("#tree-table").bootstrapTable({
        url: '../../../globalConfig/listglobalConfigByPage',
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
                size: params.limit,
                page: params.offset/params.limit
            };
            return param;
        },
        responseHandler: function (res) {
            console.log(res)
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
                    var options = $("#tree-table").bootstrapTable('getOptions');
                    return options.pageSize * (options.pageNumber - 1) + index + 1;
                }
            },
            {
                title: '中文名称',
                field: 'description',
                align: 'center',
                halign: 'center',
            },
            {
                title: '英文名称',
                field: 'enName',
                align: 'center',
                halign: 'center',
            },
            {
                title: '已发布配置值',
                field: 'value',
                align: 'center',
                halign: 'center',
            },
            {
                title: '待发布配置值',
                field: 'testValue',
                align: 'center',
                halign: 'center',
                editable: {
                    type:"text",
                    title: "修改配置值",
                    placement: "right",
                }
            },
            {
                title: '状态',
                field: 'status',
                align: 'center',
                halign: 'center',
                formatter: function (value) {
                    if (value === 'ONLINE')
                        return onlineStatus;
                    else if(value === 'UNCOMMIT')
                        return unCommitStatus;
                }
            },
            {
                title: '组',
                field: 'groupName',
                align: 'center',
                halign: 'center',
            },
            {
                title: '修改人',
                field: 'lastModifiedSysUser',
                align: 'center',
                halign: 'center',
            },
            {
                title: '修改时间',
                field: 'lastModifiedDate',
                align: 'center',
                halign: 'center',
                formatter: function(value, row, index){
                    return changeDateFormat(value);
                }
            },
            {
                title: '操作',
                align: 'center',
                halign: 'center',
                formatter: function (value, row, index) {
                    return deleteButton;
                }
            }
        ],
        onEditableSave: function (field, row, oldValue, $el) {

            if(validateTestValue(row)){
                $.ajax({
                    url: '../../../globalConfig/update',
                    type: 'post',
                    data:JSON.stringify({id:row.id,
                        testValue: row.testValue,
                    }),
                    dataType:'json',
                    contentType: "application/json",
                    success: function(data){
                        if(resResult(data)){
                            alert("修改成功");
                            loadData(groupName)
                        }
                    }
                });
            }else{
                loadData(groupName)
            }
        }
    })

    $("#find").click(function(){
        $(".grid").show();
        var gridSelectHtml = '<option value="on"> -- 请选择 -- </option>';
        $.ajax({
            url: '../../../globalConfig/listGroup',
            type: 'post',
            dataType:'json',
            contentType: "application/json",
            success: function(data){
                if(resResult(data)){
                    for(var i = 0 ; i < data.data.length; i ++)
                        gridSelectHtml += '<option value="'+ data.data[i] +'">'+ data.data[i]  +'</option>'
                    $('#grid-group-select').html(gridSelectHtml);
                }
            }
        });
    })

    // 点击查询
    var groupName = '';
    $("#grid-select-button").click(function () {
        groupName = $("#grid-group-select").val();
        if(groupName == "on")
            alert("请选择全局配置所属组");
        else{
            $('#tree-table').bootstrapTable('refresh', {
                silent: true,
                url: '../../../globalConfig/listglobalConfigByGroupName',
                query: {
                    object: {
                        groupName: groupName
                    },
                    page: 0,
                    size: $("#tree-table").bootstrapTable('getOptions').pageSize,
                }
            })
        }
    });

    // 点击重置按钮
    $("#grid-reset-button").click(function(){
        $('#grid-group-select').val('on');
        $('#tree-table').bootstrapTable('refresh',{
            url: '../../../globalConfig/listglobalConfigByPage'
        });
    });

    // 点击取消按钮
    $("#grid-cancel-button").click(function(){
        $(".grid").hide();
        $('#tree-table').bootstrapTable('refresh',{
            url: '../../../globalConfig/listglobalConfigByPage'
        });
    });

    // 点击添加配置项按钮
    $("#add").click(function(){
        location.href = "add.html";
    });

    // 发布修改数据
    $("#syncData").click(function(){
        $.ajax({
            url: '../../../globalConfig/syncValue',
            type: 'post',
            dataType:'json',
            contentType: "application/json",
            success: function(data){
                if(resResult(data)){
                    alert("发布成功");
                    loadData(groupName)
                }
            }
        });
    });

})

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

function validateTestValue(row){
    if(row.valueType == 'BOOLEAN'){
        if(row.testValue != 0 && row.testValue != 1) {
            alert("填写有误，该配置项的值为0或者是1");
            return false;
        }
    }
    return true;
}

function loadData(groupName){
    if(groupName != ''){
        $('#tree-table').bootstrapTable('refresh', {
            silent: true,
            url: '../../../globalConfig/listglobalConfigByGroupName',
            query: {
                object: {
                    groupName: groupName
                },
                page: $("#tree-table").bootstrapTable('getOptions').pageNumber - 1,
                size: $("#tree-table").bootstrapTable('getOptions').pageSize,
            }
        })
    }else{
        $('#tree-table').bootstrapTable('refresh',{
            url: '../../../globalConfig/listglobalConfigByPage',
            query: {

            }
        });
    }
}