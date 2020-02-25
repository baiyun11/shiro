var $;

layui.config({
    version: true
}).use(['form','layer','jquery'],function() {
    var form = layui.form,
        $ = layui.jquery;

    $(function () {

        var html = '';
        $.ajax({
            url: '../../../../sys/url/all',
            type:'post',
            dataType:'json',
            contentType: 'application/json',
            success: function(data){
                if(layui.resResult(data)){
                    html += '<ul class="count" style="overflow:auto">';

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

    })


    $('#submit1').on('click', function () {
        var roleName=$("#roleName").val();
        var arr= new Array();
        var sysRole= '[';
        $("input[type=checkbox]:checked").each(function(i){
            arr[i]=$(this).val();

            if(arr[i]!="on"){
                sysRole = sysRole + '{"id":"' + arr[i] + '"},';
            }
            // alert(arr[i]);
        });
        sysRole = sysRole.substring(0,sysRole.length-1) + ']';

        sysRole = $.parseJSON(sysRole);

        if(roleName!=""){
            $.ajax({
                url:"../../../../sys/role/add",
                data:JSON.stringify({inName: roleName, outName:roleName,sysMethodSet:sysRole}),
                type:'post',
                dataType:'json',
                contentType:'application/json',
                success:function(data){
                    if(layui.resResult(data)){
                        layer.msg("添加成功");
                        location.href = "roleList.html";
                    }

                }
            });
        }
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
});

