layui.config({
    version: true,
}).use('table', function() {
    var table = layui.table;
    $=layui.jquery;

    var edit = '<a class="layui-btn layui-btn-xs" lay-event="edit">角色修改</a>';
    var del = '<a class="layui-btn layui-btn-xs" lay-event="delect">删除</a>';

    table.render({
        elem: '#roleList',
        url: '../../../../sys/role/selectByPage',
        method: 'post',
        request: {
            pageName: 'page', //页码的参数名称，默认：page
            limitName: 'size'
        },
        contentType: 'application/json',
        page: true,
        limits: [10,20,50],
        // width: 1200,
        //全局定义常规单元格的最小宽度，layui 2.2.1 新增
        cellMinWidth: 80,
        toolbar: '#customizeToolbar',
        cols: [[
            {fixed: 'left', type: 'numbers', width: '5%', align : 'center', title: '序号'},
            {field: 'outName',fixed: 'left',  width: '16%', minWidth: 140, align : 'center', title: '角色名称'},
            {field: 'createdSysUser', width: '15%', minWidth: 100, align : 'center', title: '创建姓名'},
            {field: 'createdDate', width: '15%', minWidth: 100, align : 'center', title: '创建时间',
                templet: function(res){
                    return layui.formatTime(res.createdDate);
                }
            },
            {field: 'lastModifiedSysUser', width: '15%', minWidth: 100, align : 'center', title: '修改姓名'},
            {field: 'lastModifiedDate', width: '15%', minWidth: 100, align : 'center', title: '修改时间',
                templet: function(res){
                    return layui.formatTime(res.lastModifiedDate);
                }
            },
            {fixed: 'right', width: '20%', minWidth: 90, align : 'center', title: '操作',
                templet: function (res) {
                    if(res.inName === 'superAdmin' || res.inName === 'featureAdmin'){
                        return '此权限禁止操作';
                    }
                    return edit + del;
                }
            },
        ]],
        parseData: function (res) {
            if (layui.resResult(res)){
                return {
                    "code": 0, //解析接口状态
                    "msg": res.msg, //解析提示文本
                    "count": res.data.totalElements, //解析数据长度
                    "data": res.data.content //解析数据列表
                };
            }
        }

    });

    //监听工具条
    table.on('tool()', function (obj) {
        var data = obj.data;
        if (obj.event == 'delect') {
            layer.confirm('真的删除么', function (index) {
                $.ajax({
                    url: "../../../../sys/role/delete",
                    type: "POST",
                    data: JSON.stringify({id: data.id}),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (res) {
                        if (layui.resResult(res)){
                            //关闭弹框
                            layer.close(index);
                            layer.alert("删除成功");
                            window.location.reload();
                        }else
                            layer.alert("删除失败");
                    }
                });
                return false;
            });
        }
        else if(obj.event=='edit'){
            location.href = 'editRole.html?id=' + data.id + '';
        }

    });


});