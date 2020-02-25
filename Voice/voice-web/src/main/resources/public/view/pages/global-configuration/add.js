$(function(){
    var selectHtml = '';
    $.ajax({
        url: '../../../globalConfig/listGroup',
        type: 'post',
        dataType:'json',
        contentType: "application/json",
        success: function(data){
            for(var i = 0 ; i < data.data.length; i ++)
                selectHtml += '<option value="'+ data.data[i] +'">'+ data.data[i] +'</option>';
            $('#group-select').append(selectHtml);
        }
    });

    $('#group-select').change(function(){
        $('#group-input-div').show();
        $('#option-desc-input-div').show();
        $('#option-enName-input-div').show();
        $('#option-value-input-div').show();
        $('#type-select-div').show();
        $('#desc-input-div').show();
        $('#enName-input-div').show();
        $('#group-input').val('');
        $('#group-input').removeAttr('disabled');
        if (this.value == 'on')
            alert('请选择组类型');
        else if (this.value == 'newGroup'){
            $('#group-input-div').attr('disable','true');
        }else{
            $('#group-input').val(this.value);
            $('#group-input').attr('disabled','disabled');
        }

    });

    $('#group-select-2').change(function(){
        $('#group-enName-input-2').val($('#group-select-2').find("option:selected").attr("data-enName"));
        $('#group-enName-input-2').attr('disabled','disabled');
    })

    $('#group-select-3').change(function(){
        var selectOldSwitchHtml = '<option value="on"> -- 请选择 -- </option>';
        $.ajax({
            url: '../../../globalConfig/listSwitch',
            data: JSON.stringify({groupId: $('#group-select-3').val()}),
            type: 'post',
            dataType:'json',
            contentType: "application/json",
            success: function(data){
                for(var i = 0 ; i < data.data.length ; i ++)
                    selectOldSwitchHtml += '<option value="' + data.data[i].id + '" data-enName="'+ data.data[i].enName +'" data-value="'+ data.data[i].value +'">' + data.data[i].cnName + '</option>'

                $('#switch-cnName-select-3').html(selectOldSwitchHtml);
                $('#group-enName-input-3').val($('#group-select-3').find("option:selected").attr("data-enName"));
                $('#group-enName-input-3').attr('disabled','disabled');
            }
        })
    })

    $('#switch-cnName-select-3').change(function(){
        $('#switch-enName-input-3').val($('#switch-cnName-select-3').find("option:selected").attr("data-enName"));
        $('#switch-enName-input-3').attr('disabled','disabled');
        $('#switch-value-input-3').val($('#switch-cnName-select-3').find("option:selected").attr("data-value"));
        $('#switch-value-input-3').attr('disabled','disabled');
    })

    $('#submit').click(function(){
        var data = {
            groupName: $('#group-input').val(),
            enName: $('#enName-input').val(),
            description: $('#desc-input').val(),
            status: 'UNCOMMIT',
            valueType: $('#type-select').val(),
            testValue: $('#value-input').val(),
        };
        $.ajax({
            url: '../../../globalConfig/save',
            data: JSON.stringify(data),
            type: 'post',
            dataType:'json',
            contentType: "application/json",
            success: function(data){
                if(resResult(data)){
                    alert('添加成功');
                }
            }
        })
    })
})