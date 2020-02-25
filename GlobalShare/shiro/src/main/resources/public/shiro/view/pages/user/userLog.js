layui.use('table', function(){
    var table = layui.table;

    //接收地址栏参数
    var url = window.location.search;
    var request = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            request[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    var username = request["username"];

    table.render({
        elem: '#userLog',
        url:'../../../../common/UserRequestLog/get',
        method: 'post',
        request: {
            pageName: 'page', //页码的参数名称，默认：page
            limitName: 'size'
        },
        where: {
            object: {
                "commandUserName": username
            }

        },
        width:1310,
        contentType: 'application/json',
        page: true,
        limits: [10],
        //全局定义常规单元格的最小宽度，layui 2.2.1 新增
        cellMinWidth: 80 ,
        toolbar: '#customizeToolbar',
        cols: [[
            {fixed: 'left',width:'8%',type:'numbers', align : 'center',title: '序号'},
            {field:'commandUserName', width:'15%', minWidth: 140,align : 'center',title: '命令执行者'},
            {field:'commandName', width:'20%', minWidth: 100,align : 'center', title: '命令名称'},
            {field:'param', width:'25%', minWidth: 100,align : 'center', title: '请求参数'},
            {field:'commandTime', width:'15%',minWidth: 140,align : 'center', title: '命令执行时间',
                templet: function(res){

                    return layui.formatTime(res.commandTime);

                }
            },
            {field: 'ipAddress',width:'17%',align : 'center', title: 'IP地址'},
        ]],
        parseData: function(res){
            console.log(res);
            if (layui.resResult(res)) {
                return {
                    "code": 0, //解析接口状态
                    "msg": res.msg, //解析提示文本
                    "count": res.data.totalElements, //解析数据长度
                    "data": res.data.content //解析数据列表
                };
            }
        }
    });
});

