/*
* @Author: sun.qi7
* @Date:   2018-11-12 08:50:22
* @Last Modified by:   sun.qi7
* @Last Modified time: 2018-11-17 17:32:22
*/

'use strict';
//获取用户列表及分页
var val_page="";
function getData(params,callback){
    val_page=params.page-1;
    $.ajax({
        url:'../sys/role/selectByPage',
        type:'POST',
        data: JSON.stringify({"page": currPage,"size": 10}),
        dataType:'json',
        contentType : "application/json",
        success:function(data){
            requestOk(data,'',callback,customCodeError);
        },
        error:function(response){
        }
    })
}
var currPage = 1;
var skip_page="";
function render(d){
    skip_page=="" ? currPage=currPage : currPage=d;
    getData({
        page: currPage,
        size: 10
    },function(data){
        $("#roleList").html("");
        var role = data.data.content;
        var roleHtml = "";
        if(role==undefined) {
            $('.page_navigation').css('display','none');
            return false;
        }
        for(var i = 0 ; i < role.length ; i ++){
            var val_roleId=role[i].id;
            var val_account=role[i].outName;
            var val_roleName=role[i].name;
            var oderNum=(currPage-1)*10+i+1;
            if(currPage==1&&i<=1){
                roleHtml = roleHtml + '<tr><td><div class="oderNum">'+oderNum+'</div><input type="hidden" value="'+val_roleId+'" />' +
                    '</td><td><div class="addName">'+val_account+'</div></td><td><div class="fullName">' +
                    '</div></td><td><div class="fullName"></div></td><td><div class="operation2">'
            }
            else
                roleHtml = roleHtml + '<tr><td><div class="oderNum">'+oderNum+'</div><input type="hidden" value="'+val_roleId+'" />' +
                    '</td><td><div class="addName">'+val_account+'</div></td><td><div class="fullName">' +
                    '</div></td><td><div class="fullName"></div></td><td><div class="operation2">' +
                    '<a class="label label-primary " id="alter" href="editRole.html?id=' + val_roleId + '" type="click">修改</a>&nbsp;&nbsp;' +
                    '<a class="label label-warning" id="del" type="click">删除</a></a></div></td></tr>'
        }
        var num_p=data.data.totalPages;
        var num_l=data.data.totalElements;
        $("#num_pages").html("共 "+num_p+" 页");
        $("#num_lists").html("共 "+num_l+" 条数据");
        num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
        $("#roleList").append(roleHtml);
        setPaginator(currPage, data.data.totalPages , render);
    })
    skip_page="";
    $("#skipPage").val("");
}
render(currPage);

//点击删除指定用户
$(document).on("click","#del",function(){
    var val_delId=$(this).parents("tr").find(".oderNum").next().val();
    var tconfirm = confirm("确定要删除吗？");
    if(tconfirm == true) {
        $.ajax({
            url: "../sys/role/delete",
            type: "POST",
            data: JSON.stringify({id: val_delId}),
            dataType: "text",
            contentType: "application/json",
            success: function (data) {
                requestOk(data,'',function(){
                    changeSuccess('删除成功！');
                    render(currPage);
                },customCodeError);
            },
            error: function (data) {
            }
        })
    }
})