var $;

layui.config({
    version: true
}).use(['form','layer','jquery'],function() {
    var form = layui.form,
        $ = layui.jquery;

    var url = window.location.search;
    var request = new Object();
    var sum;
    var methodSum = 0;

    var createdSysUser = '';
    var createdDate;

    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            request[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }

    var id=request["id"];

    var html = '';
    $.ajax({
        url: '../../../sys/url/all',
        type:'post',
        dataType:'json',
        contentType: 'application/json',
        async:false,
        success: function(data){
            if(layui.resResult(data)){
                sum = data.data.length;

                html += '<ul class="count">';

                for(var i = 0 ; i < data.data.length ; i++){

                    html += '<li class="count1">';
                    html += '<input type="checkbox" lay-filter="url" class="'+i+'" lay-skin="primary" title="'+ data.data[i].url +'" />' ;
                    if( data.data[i].sysMethodSet != undefined){
                        html += '<ul class="count2">';
                        for (var j = 0 ; j < data.data[i].sysMethodSet.length ; j++){
                            html += '<li>' +
                                '<input value="'+  data.data[i].sysMethodSet[j].id +'" lay-filter="method" type="checkbox" name="' +  data.data[i].sysMethodSet[j].name + '" class="'+i+'" lay-skin="primary" title="'+ data.data[i].sysMethodSet[j].name +'">'
                                + '</li>';
                        }
                        html += '</ul>';
                    }

                    html += '</li>';

                }

                html += '</ul>';

                $('#list').html(html);
                form.render();
            }
        }
    });



    $.ajax({
        url:"../../../sys/role/findOne",
        type:"POST",
        async:false,
        data:JSON.stringify({id:id}),
        dataType:"json",
        contentType : "application/json",
        async:false,
        success:function(data){
            if(layui.resResult(data)){
                createdSysUser = data.data.createdSysUser;
                createdDate = data.data.createdDate;

                $('#roleName').val(data.data.outName);
                if(data.data.sysMethodSet != null){

                    for(var i=0; i < data.data.sysMethodSet.length; i++){
                        $("input:checkbox[value='" + data.data.sysMethodSet[i].id +"']").attr('checked','true');
                    }

                    for(var i = 1 ; i < sum ; i++){
                        var arr= new Array();
                        $('input:checkbox[class="'+ i +'"]').each(function (a) {

                            if(!$(this).attr('checked'))
                                arr[a] = $(this).val();

                        })
                        if(arr.length == 1){
                            $('input:checkbox[class="'+ i +'"]').attr('checked','true');

                        }else{

                        }
                    }

                }else {
                    isNaN();
                }

                var arr= new Array();
                $('input:checkbox').each(function(a){

                    if(!$(this).attr('checked'))
                        arr[a] = $(this).val();
                })

                if(arr.length == 1)
                    $('input:checkbox').attr('checked','true');

                form.render();
            }

        },

    })

    //修改角色

    $("#save").click(function(){
        var rolesName=$("#roleName").val();

        var arr= new Array();
        var sysRole= '[';
        $("input[type=checkbox]:checked").each(function(i){
            arr[i]=$(this).val();
            if(arr[i]!="on"){
                sysRole = sysRole + '{"id":"' + arr[i] + '"},';
            }
        });
        console.log()
        sysRole = sysRole.substring(0,sysRole.length-1) + ']';
        sysRole = $.parseJSON(sysRole);

        console.log(sysRole);
        $.ajax({
            url:"../../../sys/role/edit",
            data:JSON.stringify({id: id,
                                 inName: rolesName,
                                 outName:rolesName,
                                 createdSysUser:createdSysUser,
                                 createdDate: createdDate,
                                 sysMethodSet:sysRole
            }),
            type:'post',
            dataType:'json',
            contentType:'application/json',
            success:function(data){
                if(layui.resResult(data)){
                    layer.alert('修改成功', function (index) {
                        layer.close(index);
                        location.href = "roleList.html";
                    });
                }
            }
        });

    });

    form.on('checkbox(url)',function (data) {
        if (data.elem.checked){
            $('.'+data.elem.className).prop('checked','true');
        }
        else{
            $('.'+data.elem.className).removeAttr('checked');
        }
        form.render();
    });

    form.on('checkbox(method)',function (data) {

        var arr= new Array();

        $('input:checkbox[class="'+ data.elem.className +'"]').each(function (a) {

            console.log($(this).prop('checked'));

            if($(this).prop('checked'))
                arr[a] = $(this).val();
        })
        var methodStr = '';
        for (var i = 0 ; i < arr.length ; i++ ){
            if(arr[i] != null ){
                methodStr += arr[i] + ','
            }
        }
        methodStr = methodStr.substr(0,methodStr.length-1);

        var methodArr = methodStr.split(',');

        if (data.elem.checked){

            if(methodArr.length == $('.'+data.elem.className).length - 1 )
                $('.'+data.elem.className).prop('checked','true');

        }
        else{

            $('.'+data.elem.className).eq(0).removeAttr('checked');
        }
        form.render();
    })

    $('#reset').on('click', function () {
        $("#roleName").val('');
        $(".layui-unselect").removeClass('layui-form-checked');
    });


})
