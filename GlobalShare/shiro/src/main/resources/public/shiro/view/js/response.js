layui.config({
    version: true
}).define(['jquery','layer'],function (exports) {
    var $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : parent.layer;

    exports('resResult',function (obj) {

        if(obj.code == 0){
            return true;
        }else if(obj.code == 6002){

            if (obj.data === undefined) {

                layer.alert(obj.msg);
            } else {

                layer.alert(obj.data);
            }

            return false;
        }else if(obj.code == 7002){
            layer.alert('您暂无该模块权限，请联系管理员');
            return false;
        }else if(obj.code == 7000){
            top.location.href = 'http://' + window.location.host + '/background/shiro/view/pages/login/login.html';
            return false;
        }else if(obj.code == 7001){
            layer.alert('账号或密码错误，请重新输入!!');
            return false;
        }else if(obj.code == 7007){
            if (obj.data === undefined) {

                layer.alert("请求参数错误");
            } else {

                layer.alert(obj.data);
            }
            return false;
        }else {

            layer.alert(obj.data);
            return false;
        }
    });
})