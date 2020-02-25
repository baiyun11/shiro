
layui.config({
    version: true
}).define(['jquery','layer'],function (exports) {
    var $ = layui.jquery;
    var layer = layui.layer;

    exports('resetInitPassword',function (obj) {

    	var html = '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300; font-size: 18px" id="div-desc">'
            + '重置初始密码<br><br>'
            + '<div class="layui-form-item">'
            +   '<div class="layui-inline" style="margin-left: 16px;">'
            +       '<label class="layui-form-label" style="font-size: 16px">输入新密码</label>'
            +       '<div class="layui-input-inline" style="width:237px;text-align:center">'
            +           '<input type="password" name="password" class="layui-input">'
            +       '</div>'
            +   '</div>'
            + '</div>'
            + '</div>';


        layer.open({
            type: 1
            , title: false //不显示标题栏
            , closeBtn: false
            , shade: 0.8
            , area: ['500px',]
            , id: 'LAY_layuipro' //设定一个id，防止重复弹出
            , btn: ['确定', '返回']
            , btnAlign: 'c'
            , moveType: 1 //拖拽模式，0或者1
            , content: html
            , yes: function (index, layero) {
                var newPassword = $(layero).find('input[name=password]').val();
                if(newPassword === '123456'){
                    layer.msg('填入的为初始密码，请确认!!');
                }else{
                    $.ajax({
                        url:'../../../../sys/subject/updateCurrentUserInfo',
                        type:'POST',
                        data:JSON.stringify({id: obj.data.id,
                            username: obj.data.username,
                            password: newPassword,
                            name:obj.data.name,
                            SysRole:obj.data.SysRole
                        }),
                        dataType:'json',
                        contentType:'application/json',
                        success:function(data){
                            if(layui.resResult(data)){

                                window.location.href='../../index.html';
                            }
                        }
                    })
                }
            },
            btn2: function(index, layero){
                $.ajax({
                    url: "../../../../sys/subject/logout",
                    type: "post",
                    dataType:'json',
                    contentType:'application/json',
                    success: function(data){
                        window.location.reload();
                    }
                });
            }
        });
    });

}).use(['form'],function(){
    var $ = layui.jquery;

    //登录页
	$("#loginBtn").click(function(){
		var val_user=$("#loginUser").val();

		var val_password=$("#loginPassword").val();
		if(val_user=="" || val_user==null || val_user==undefined){
			$("#loginUser").attr("data-content","用户名不能为空！")
			$("#loginUser").popover('show');
			$("#loginUser").focus(function(){
				$("#loginUser").popover('destroy');
			})
			return false;
		}else if(val_password=="" || val_password==null || val_password==undefined){
			$("#loginPassword").attr("data-content","密码不能为空！")
			$("#loginPassword").popover('show');
			$("#loginPassword").focus(function(){
				$("#loginPassword").popover('destroy');
			})
			return false;
		}else{

            var ip = $("#loginBtn").attr("data-ip");
		    
			$.ajax({
				url:'../../../../sys/subject/login',
				type:'POST',
				data: {username: val_user ,password: val_password},
                headers: {ip: ip},
				dataType:'json',
				success:function(data){
				    if(layui.resResult(data)){
                        sessionStorage.obj = JSON.stringify(data);
                        console.log(sessionStorage.obj);
                        if(data.data.resetRootPassword){
                            layui.resetInitPassword(data);
                        }
                        else
                            location.href='../../index.html';
                    }
				}
			})
		}
	})
});







