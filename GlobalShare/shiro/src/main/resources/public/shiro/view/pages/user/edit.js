
layui.config({
    version: true
}).use(['form','layer','jquery'],function() {
    var form = layui.form,
        $$ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : parent.layer;

    //接收地址栏参数
    var url = window.location.search;
    var request = new Object();

    var password;
    var createdDate;
    var createdSysUser;

    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            request[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    var id = request["id"]

    $(function(){
        var html = '';
        $.ajax({
            url: '../../../../sys/role/select',
            type:'post',
            dataType:'json',
            async: false,
            contentType: 'application/json',
            success: function(data){
                if (layui.resResult(data)){
                    html += '<ul id="roleLt" >';

                    for(var i = 0 ; i < data.data.length ; i++){

                        html += '<li class="userPer">' +

                            '<input name="'+ data.data[i].inName +'" value="' + data.data[i].id + '" type="checkbox" lay-skin="primary" title="'+ data.data[i].outName +'">' +
                            '</li>';
                    }

                    html += '</ul>';
                    $('#management').html(html);
                    form.render();
                }
            }
        });


        var val;

        $.ajax({
            url: '../../../../sys/user/getOne',
            data: JSON.stringify({id: id}),
            type:'post',
            dataType:'json',
            async: false,
            contentType: 'application/json',
            success: function(data){
                if (layui.resResult(data)){

                    password = data.data.password;
                    createdDate = data.data.createdDate;
                    createdSysUser = data.data.createdSysUser;

                    val = {
                        "account": data.data.username,
                        "username": data.data.name,
                    }

                    for (var i = 0 ; i < data.data.sysRoleList.length ; i ++){

                        val[data.data.sysRoleList[i].inName] = true;
                    }
                    form.val("edit-form", val);
                    console.log(val);
                    form.render();

                }
            }
        })

    });



    $('#submit').on('click', function () {
        var account = $("#userAcount").val();
        var userName = $("#userName").val();

        if (account == "") {
            layer.alert('登录账号不能为空，请输入登录账号！', function (index) {
                layer.close(index);
            });
            return false;
        }

        if (userName == "") {
            layer.alert('姓名不能为空，请输入姓名！', function (index) {
                layer.close(index);
            });
            return false;
        }

        var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!reg.test(account)) {
            layer.alert('登录账号格式不正确，请重新输入！', function (index) {
                layer.close(index);
            });
            return false;
        }
        var arr = new Array();
        var sysRole = [];
        $("input[type=checkbox]:checked").each(function (i) {
            arr[i] = $(this).val();
            sysRole.push({
                id: arr[i],
            })
        });

        if (account != "" && userName != "") {
            $.ajax({
                url: '../../../../sys/user/update',
                type: 'post',
                data: JSON.stringify({
                    id: id,
                    username: account,
                    password: password,
                    name: userName,
                    createdDate: createdDate,
                    createdSysUser: createdSysUser,
                    sysRoleList: sysRole
                }),
                dataType: 'json',
                contentType: "application/json",
                success: function (data) {
                    if (layui.resResult(data)){
                        layer.alert('添加成功', function (index) {
                            layer.close(index);
                            location.href = "userList.html";
                        });
                    }
                }
            })

        }
    })


    $('#reset').on('click', function () {
        $("#userAcount").val('');
        $("#userName").val('');
        $(".layui-unselect").removeClass('layui-form-checked');
    });

})