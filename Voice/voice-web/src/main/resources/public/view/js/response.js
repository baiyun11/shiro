function resResult(obj){
    if(obj.code == 0){
        return true;
    }else if(obj.code == 6002){
        alert(obj.msg);
        return false;
    }else if(obj.code == 7002){
        alert('您暂无该模块权限，请联系管理员');
        return false;
    }else if(obj.code == 7000){
        top.location.href = '../../login.html';
        return false;
    }else if(obj.code == 7001){
        alert('账号或密码错误，请重新输入!!');
        return false;
    }else if(obj.code == 7007){
        alert('非法参数');
        return false;
    }else if(obj.code == 7006){
        if(obj.data == '版本中没有类型子项，无法发布！'){
            alert(obj.data);
        }
        return false;
    }
}