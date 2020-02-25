layui.config({
    version: true
}).use(['form','layer','jquery'],function() {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : parent.layer;

    $(function(){
        var html = '';
        $.ajax({
            url: '../../../../sys/role/select',

            type:'post',
            dataType:'json',
            contentType: 'application/json',
            success: function(data){
                if (layui.resResult(data)){
                    html += '<ul id="roleLt" >';

                    for(var i = 0 ; i < data.data.length ; i++){

                        html += '<li class="userPer">' +

                            '<input   value="' + data.data[i].id + '" type="checkbox" lay-skin="primary" title="'+ data.data[i].outName +'">' +
                            '</li>';
                    }

                    html += '</ul>';
                    $('#management').html(html);
                    form.render();
                }
            }
        });

    });

    

    $('#submit').on('click', function () {
        var account = $("#userAcount").val();
        var userName = $("#userName").val();
        var passWord = "123456";

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
        var sysRole = '[';
        $("input[type=checkbox]:checked").each(function (i) {
            arr[i] = $(this).val();

            sysRole = sysRole + '{"id":"' + arr[i] + '"},';

        });

        if (arr.length == 0) {

            layer.alert('请选择角色');

            return false;
        }
        sysRole = sysRole.substring(0, sysRole.length - 1) + ']';

        sysRole = $.parseJSON(sysRole);

        if (account != "" && userName != "") {
            $.ajax({
                url: '../../../../sys/user/insert',
                type: 'post',
                data: JSON.stringify({username: account, password: passWord, name: userName, sysRoleList: sysRole}),
                dataType: 'json',
                contentType: "application/json",
                success: function (data) {
                    if (layui.resResult(data)){
                        layer.alert('添加成功', function (index) {
                            layer.close(index);
                            window.location.href = "userList.html";
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

