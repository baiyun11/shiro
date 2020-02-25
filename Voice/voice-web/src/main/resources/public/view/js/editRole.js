/*
* @Author: sun.qi7
* @Date:   2018-11-12 08:50:22
* @Last Modified by:   sun.qi7
* @Last Modified time: 2018-11-17 17:32:22
*/


$(function(){
    //js获取url中传递的参数
    var id = window.location.search.match(new RegExp("[\?\&]"+"id"+"=([^\&]+)","i"))[1];
    var html='';
    var sum;
    $.ajax({
        url: '../sys/url/all',
        type: 'POST',
        dataType: 'json',
        async: false,
        contentType: "application/json",
        success: function (data) {
            requestOk(data,'',function(){
                var dataVal = data.data;
                sum = dataVal.length;
                html += '<ul class="count">';
                for (var i = 1; i < dataVal.length; i++) {
                    html += '<li class="count1">';
                    html += '<label><input type="checkbox" onclick="chkAll(' + i + ')" class="' + i + '">&nbsp;' + dataVal[i].url+'</label>';
                    if (dataVal[i].sysMethodSet != undefined) {
                        html += '<ul class="count2">';
                        for (var j = 0; j < dataVal[i].sysMethodSet.length; j++) {
                            html += '<li>' +
                                '<label><input value="' + dataVal[i].sysMethodSet[j].id + '" type="checkbox" name = "' +
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

    $.ajax({
        url: '../sys/role/findOne',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({id: id}),
        async: false,
        contentType: "application/json",
        success: function (data) {
            requestOk(data,'',function(){
                $('#account').val(data.data.outName);
                if(data.data.sysMethodSet != null){
                    for(var i = 0 ; i < data.data.sysMethodSet.length ; i++)
                        $("input:checkbox[value='"+ data.data.sysMethodSet[i].id +"']").attr('checked','true');
                    for(var i = 1 ; i < sum ; i++){
                        var arr= new Array();
                        $('input:checkbox[class="'+ i +'"]').each(function (a) {
                            if(!$(this).attr('checked'))
                                arr[a] = $(this).val();
                        })
                        if(arr.length == 1){
                            $('input:checkbox[class="'+ i +'"]').attr('checked','true');
                        }
                    }
                }else {
                    isNaN();
                }
                var arr= new Array();
                $('input:checkbox').each(function(a){
                    //alert($(this).val());
                    if(!$(this).attr('checked'))
                        arr[a] = $(this).val();
                })
                if(arr.length == 1)
                    $('input:checkbox').attr('checked','true');
            },customCodeError);
        },
        error:function(data){
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

    //修改角色
    $("#editRoleBtn").click(function(){
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
                url:'../sys/role/edit',
                type:'POST',
                data:JSON.stringify({id:id,inName:huoqu,outName:huoqu,sysMethodSet:sysRole}),
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




