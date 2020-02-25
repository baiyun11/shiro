var initTable;
$(function () {
    var formSelectHtml = '<option value="on"> -- 请选择 -- </option>';
    $.ajax({
        url: '../../../precisePush/findTableName',
        type: 'post',
        dataType: 'json',
        contentType: "application/json",
        success: function (val) {
            if (resResult(val)) {
                for (var i = 0; i < val.data.length; i++) {
                    formSelectHtml += '<option value="' + val.data[i] + '">' + val.data[i] + '</option>'
                }
                $('#select-form-name').html(formSelectHtml);
            }
        }
    });
    $('#select-form-insearch').click(function () {
        var column = [];
        var formName = $('#select-form-name').val();
        if(formName =='on'){
            alert('请选择正确的表名');
            return false;
        }
        $.ajax({
            url: '../../../precisePush/findTableColumns',
            type: 'post',
            dataType: 'json',
            contentType: "application/json",
            async: false,
            data: JSON.stringify({
                tableName: formName
            }),
            success: function (res) {
                column.push({
                    title: '序号',
                    align: 'center',
                    halign: 'center',
                    width:10,
                    formatter: function (value, row, index) {
                        var options = $("#table").bootstrapTable('getOptions');
                        return options.pageSize * (options.pageNumber - 1) + index + 1;
                    }
                });
                if (resResult(res))
                    var list = res.data;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].tableColumn == 'created_date' || list[i].tableColumn == 'time') {
                        column.push({
                            title: list[i].tableColumn,
                            field: list[i].entityVariableName,
                            align: 'center',
                            halign: 'center',
                            formatter: function (value, row, index) {
                                return changeDateFormat(value);
                            }
                        })
                    } else {
                        column.push({
                            title: list[i].tableColumn,
                            field: list[i].entityVariableName,
                            align: 'center',
                            halign: 'center'
                        })
                    }
                }
            }
        });
        $("#table").bootstrapTable('removeAll');
        $('#table').bootstrapTable('refreshOptions', {
            queryParams: function (params) { //设置查询参数
                var param = {
                    object: {
                        tableName: formName
                    },
                    size: params.limit,
                    page: params.offset / params.limit
                };
                return param;
            },
            columns: column
        });
    });
    $('#table').bootstrapTable({
        silent: 'true',
        method: 'post',
        url: '../../../precisePush/findTableData',
        pagination: true, // 在表格底部显示分页组件，默认false
        pageList: [10, 20, 30], // 设置页面可以显示的数据条数
        pageSize: 10, // 页面数据条数
        pageNumber: 1, // 首页页码
        sidePagination: 'server', // 设置为服务器端分页
        dataType: 'json',
        contentType: 'application/json',
        undefinedText: '<font style="color: #9c9c9c">(空)</font>',
        queryParams: function (params) { //设置查询参数
            var param = {
                object: {
                    tableName: 'precise_push_app_entity'
                },
                size: params.limit,
                page: params.offset / params.limit
            };
            return param;
        },
        columns: [],
        responseHandler: function (res) {
            if (resResult(res)) {
                if (res.data == undefined) {
                    return {
                        "total": 0,
                        "rows": 0
                    };
                }
                return {
                    "total": res.data.totalElements,
                    "rows": res.data.content
                };
            }
        }
    })
})

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