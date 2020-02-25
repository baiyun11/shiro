layui.use('table', function(){
    var table = layui.table;
    $=layui.jquery;

    var rizhiButton = '<a class="layui-btn layui-btn-xs" lay-event="rizhi">日志</a>';
    var editButton = '<a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="edit">修改</a>';
    var resetPasswordButton = '<a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="resetPassword">重置密码</a>';
    var delButton = '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" >删除</a>';

    table.render({
        elem: '#userList',
        url:'../../../../sys/user/select',
        method: 'post',
        request: {
            pageName: 'page', //页码的参数名称，默认：page
            limitName: 'size'
        },
        width:1310,
        contentType: 'application/json',
        page: true,
        limits: [10,20],
        //全局定义常规单元格的最小宽度，layui 2.2.1 新增
        cellMinWidth: 80 ,
        toolbar: '#customizeToolbar',
        // defaultToolbar: ['filter', 'exports', 'print'],
        cols: [[
            {fixed:'left',type:'numbers',width:'5%',align : 'center',title: '序号'},
            {field:'username', width:'20%', align : 'center',title: '登录账号'},
            {field:'name', width:'10%', align : 'center', title: '姓名'},
            {field:'sysRoleList', width:'31%', align : 'center', title: '用户权限',
                templet: function (res) {
                    var sysRole = '';
                    for(var i = 0 ; i < res.sysRoleList.length ; i++)
                        sysRole += ',' + res.sysRoleList[i].outName;
                    return sysRole.substring(1,sysRole.length);
                }
            },
            {field:'createdSysUser', width:'10%', align : 'center', title: '创建人'},
            {field:'createdDate', width:'15%', align : 'center', title: '创建时间',
                templet: function(res){
                    return layui.formatTime(res.createdDate);
                }
            },
            {fixed:'right', width:'20%', align : 'center', title: '操作' ,
                templet: function (res) {
                    if(res.username === 'superAdmin'){
                        return rizhiButton + resetPasswordButton;
                    }
                    return rizhiButton + editButton + resetPasswordButton + delButton;
                }
            },

        ]],
        parseData: function(res){
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
    table.on('tool()', function(obj) {
        if (obj.event == 'rizhi') {
            location.href = 'userLog.html?username=' + obj.data.username;
        }else if(obj.event == 'edit'){
            location.href = 'edit.html?id=' + obj.data.id + '&username=' + obj.data.username;
        }else if (obj.event == 'del') {
            layer.confirm('真的删除么', function (index) {
                console.log(obj.data);
                var data = obj.data;
                // console.log()
                $.ajax({
                    url: "../../../../sys/user/delete",
                    type: "POST",
                    data:JSON.stringify({id: data.id,username: data.username}),
                    dataType: 'json',
                    contentType:'application/json',
                    success: function (msg) {
                        if (layui.resResult(msg)){
                            //删除这一行
                            obj.del();
                            //关闭弹框
                            layer.close(index);
                            layer.msg("删除成功", {icon: 6});
                            window.location.reload();
                        }
                    }
                });
                return false;
            });




        } else if (obj.event == 'resetPassword') {

            var data = obj.data;
            var tf=confirm("确定要为这条数据重置密码吗？");
            if(tf==true){
                $.ajax({
                    url:"../../../../sys/user/resetPassword",
                    type:"POST",
                    data:JSON.stringify({id:data.id,username:data.username}),
                    dataType:"json",
                    contentType : "application/json",
                    success:function(data){
                        if(layui.resResult(data)){
                            layer.alert('密码重置成功')
                        }
                    }
                })

            }
        }
    });
});



