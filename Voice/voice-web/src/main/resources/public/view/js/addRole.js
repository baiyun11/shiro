/*
* @Author: sun.qi7
* @Date:   2018-11-12 08:50:22
* @Last Modified by:   sun.qi7
* @Last Modified time: 2018-11-17 17:32:22
*/
$(function(){
    var html='';
    $.ajax({
        url: '../sys/url/all',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            requestOk(data,'',function(){
                var dataVal = data.data;
                html += '<ul class="count">';
                for (var i = 1; i < dataVal.length; i++) {
                    html += '<li class="count1">';
                    html += '<label><input type="checkbox" onclick="chkAll(' + i + ')" class="' + i + '">&nbsp;' + dataVal[i].url+'</label>';
                    if (dataVal[i].sysMethodSet != undefined) {
                        html += '<ul class="count2">';
                        for (var j = 0; j < dataVal[i].sysMethodSet.length; j++) {
                            html += '<li>' +
                                '<label><input value="' + dataVal[i].sysMethodSet[j].id + '" type="checkbox"name = "' +
                                dataVal[i].sysMethodSet[j].name + '" ' +
                                'class="' + i + '">&nbsp;' + dataVal[i].sysMethodSet[j].name + '</label></li>';
                        }
                        html += '</ul>'
                    }
                    html += '<li>';
                }
                html += '</ul>';
                $('#roleUl').html(html);
            },customCodeError);
        }
    });

    //点击全选所有复选框被选中
    $(document).on('click','input[id=chksAll]',function(){
        if(chksAll.checked){
            $(".count input").prop("checked",true);
        }else{
            $(".count input").prop("checked",false);
        }
    })

    //添加新角色
    $("#addRoleBtn").click(function(){
        //获取角色名称
        var huoqu=$("#account").val();
        var arr= new Array();  //创建数组
        var sysRole= '[';
        $("input[type=checkbox]:checked").each(function(i){
            arr[i]=$(this).val();
            if(arr[i] != "on")
            sysRole = sysRole + '{"id":"' + arr[i] + '"},';
        });
        sysRole = sysRole.substring(0,sysRole.length-1) + ']';
        sysRole = $.parseJSON(sysRole);

        //向后台传值
        if(getData&&huoqu!==""){
            $.ajax({
                url:'../sys/role/add',
                type:'POST',
                data:JSON.stringify({inName:huoqu,outName:huoqu,sysMethodSet:sysRole}),
                dataType:'json',
                contentType:"application/json",
                success:function(data){
                    requestOk(data,'',function(){
                        window.location.href=document.referrer;
                    },customCodeError);
                },
                error:function(data){
                }
            })
        }
    })

    //重置输入框
    $("#resetBtn").click(function(){
        $("#account").val("");
        $(".count input").prop("checked",false);
        $("#chksAll").prop("checked",false);
    })

    //重置
    // $(document).on("click","#resetPW",function(){
    //     var resetId=$(this).parents("tr").find("input").val();
    //     var resetRole=$(this).parents("tr").find(".addRole").html();
    //     var tf=confirm("确定要重置吗？");
    //     if(tf==true){
    //         $.ajax({
    //             url:"../sys/subject/resetPassword",
    //             type:"POST",
    //             data:JSON.stringify({id:resetId,rolename:resetRole}),
    //             dataType:"json",
    //             contentType : "application/json",
    //             success:function(data){
    //                 requestOk(data,'',function(){
    //                     changeSuccess("重置成功！");
    //
    //                 },customCodeError);
    //                 window.location.reload();
    //             },
    //             error:function(data){
    //             }
    //         })
    //     }
    // })

})


//复选框全选
function chkAll(chkAll){

    var selects = $('.'+ chkAll);

    for (var i = 0 ; i < selects.length ; i++){

        if(selects[0].checked == false)

            selects[i].checked = false;

        else if (selects[0].checked == true)

            selects[i].checked = true;

    }
}
