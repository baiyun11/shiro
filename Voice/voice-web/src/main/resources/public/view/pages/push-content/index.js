

$(function(){
    var pushVersion=$.getUrlParam('pushVersion');
    var stateDescription=$.getUrlParam('stateDescription');

    // 定义推送类型默认为节目类型
    var pushType = '1';
    // 定义是否存在有实时记录的参数默认为没有
    var realTime = false;

    if (stateDescription == 'publish')
        $('#add').attr('disabled','disabled');

    $("#table").bootstrapTable({
        url: '../../../PushType/getPage',
        method: 'post',
        cache: false,
        silent: true,
        pagination: true, // 在表格底部显示分页组件，默认false
        pageList: [10,20,30], // 设置页面可以显示的数据条数
        pageSize: 10, // 页面数据条数
        pageNumber: 1, // 首页页码
        sidePagination: 'server', // 设置为服务器端分页
        dataType: 'json',
        contentType: 'application/json',
        undefinedText: '<font style="color: #9c9c9c">(空)</font>',
        toolbar: '#toolbar',
        queryParams:function(params) { //设置查询参数
            var param = {
                object:{
                    pushVersionEntity: {
                        pushVersion: pushVersion
                    },
                    type: 1
                },
                size: params.limit,
                page: params.offset/params.limit
            };
            return param;
        },
        responseHandler: function (res) {
            if(resResult(res)){
                return {
                    "total": res.data.totalElements,
                    "rows": res.data.content
                };
            }
        },
        columns: [
            {
                title: '序号',
                align: 'center',
                halign: 'center',
                formatter: function (value, row, index) {
                    var options = $("#table").bootstrapTable('getOptions');
                    return options.pageSize * (options.pageNumber - 1) + index + 1;
                }
            },
            {
                title: '推送类型',
                field: 'type',
                align: 'center',
                halign: 'center',
                formatter: function (value) {
                    if(value == 1)
                        return "节目";
                    else if(value == 2)
                        return "app";
                    else if(value == 3)
                        return "资讯";
                }
            },
            {
                title: '主题类别',
                field: 'content',
                align: 'center',
                halign: 'center',
                formatter: function (value) {
                    return JSON.parse(value).category;
                }
            },
            {
                title: '播报内容',
                field: 'content',
                align: 'center',
                halign: 'center',
                class: 'table-col',
                formatter: function (value) {
                    return JSON.parse(value).explain;
                }
            },
            {
                title: '主题',
                field: 'content',
                align: 'center',
                halign: 'center',
                class: 'table-col',
                maxWidth:'100px',
                formatter: function (value) {
                    var reg = /(http)|(https):\/\/[\w]*/;
                    if (reg.test(value)){
                        return '<a href="' + JSON.parse(value).theme + '" target="_blank" title="'+ JSON.parse(value).theme +'">'+ JSON.parse(value).theme +'</a>';
                    }

                    return JSON.parse(value).theme;
                }
            },
            {
                title: '执行的内容',
                field: 'content',
                align: 'center',
                halign: 'center',
                class: 'table-col',
                formatter: function (value) {
                    return JSON.parse(value).command;
                }
            },
            {
                title: '推送时间',
                field: 'content',
                align: 'center',
                halign: 'center',
                formatter: function (value,row) {
                    var pushTime = JSON.parse(value).priority;
                    if(pushTime == 1){
                        realTime = true;
                        return "实时";
                    }else if(pushTime == 2){

                        return JSON.parse(value).delayNumber + "分钟";
                    }else if(pushTime == 3){realTime = true;
                        realTime = false;
                        return "定时";
                    }
                }
            },
            {
                title: '推送频率',
                field: 'content',
                align: 'center',
                halign: 'center',
                formatter: function (value) {
                    return JSON.parse(value).pullNumber + "次";
                }
            },
            {
                title: '消息有效期',
                field: 'expiryDate',
                align: 'center',
                halign: 'center',
                formatter: function (value) {
                    if (value == 0)
                        return "永久有效";
                    else{
                        return value + "天";
                    }
                }
            },
            {
                title: '版本号',
                field: 'pushVersionEntity',
                align: 'center',
                halign: 'center',
                formatter: function (value) {
                    return value.pushVersion;
                }
            },
            {
                title: '创建时间',
                field: 'lastModifiedDate',
                align: 'center',
                halign: 'center',
                formatter: function (value) {
                    return changeDateFormat(value);
                }
            },
            {
                title: '创建人',
                field: 'lastModifiedSysUser',
                align: 'center',
                halign: 'center',
                formatter: function (value) {
                    return value;
                }
            },
            {
                title: '操作',
                align: 'center',
                halign: 'center',
                events: operateEvents,
                formatter: function(value,row){
                    if(row.stateDescription == 'deleted'){
                        return '<font style="color: #9c9c9c">已删除</font>';
                    }
                    return '<a class="deletePush" href="javascript:;"><span class="label label-warning">删除</span></a>';
                }
            }
        ],
        onLoadSuccess: function(data){
            // 如果获取到的数据为0时，默认从20001开始
            if (data.total == 0)
                realTime = false;
        }
    });

    $('[data-toggle="tooltip"]').tooltip();

    $('#add').click(function () {
        location.href = 'add.html?pushVersion=' + pushVersion +
                                '&pushType=' + pushType +
                                '&stateDescription=' + stateDescription +
                                '&realTime=' + realTime;
    });

    // 点击节目类型
    $('#jmType').click(function () {
        location.reload();
    });

    // 点击APP类型，重新加载bootstrap-table
    $('#appType').click(function () {
        pushType = '2';
        $("#table").bootstrapTable('removeAll');
        $("#table").bootstrapTable('refreshOptions',{
            queryParams:function(params) { //设置查询参数
                var param = {
                    object:{
                        pushVersionEntity: {
                            pushVersion: pushVersion
                        },
                        type: 2
                    },
                    size: params.limit,
                    page: params.offset/params.limit
                };
                return param;
            },
            responseHandler: function (res) {
                if(resResult(res)){
                    return {
                        "total": res.data.totalElements,
                        "rows": res.data.content
                    };
                }
            },
            columns: [
                {
                    title: '序号',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value, row, index) {
                        var options = $("#table").bootstrapTable('getOptions');
                        return options.pageSize * (options.pageNumber - 1) + index + 1;
                    }
                },
                {
                    title: '推送类型',
                    field: 'type',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        if(value == 1)
                            return "节目";
                        else if(value == 2)
                            return "app";
                        else if(value == 3)
                            return "资讯";
                    }
                },
                {
                    title: 'app名称',
                    field: 'content',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        return JSON.parse(value).appName;
                    }
                },
                {
                    title: 'app包名',
                    field: 'content',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        return JSON.parse(value).appPackageName;
                    }
                },
                {
                    title: 'app介绍说明',
                    field: 'content',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        return JSON.parse(value).appIntroduce;
                    }
                },
                {
                    title: '版本号',
                    field: 'pushVersionEntity',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        return value.pushVersion;
                    }
                },
                {
                    title: '创建时间',
                    field: 'pushVersionEntity',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        return changeDateFormat(value.createdDate);
                    }
                },
                {
                    title: '创建人',
                    field: 'pushVersionEntity',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        return value.lastModifiedSysUser;
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    halign: 'center',
                    events: operateEvents,
                    formatter: function(value,row){
                        if(row.stateDescription == 'deleted'){
                            return '<font style="color: #9c9c9c">已删除</font>';
                        }
                        return '<a class="deletePush" href="javascript:;"><span class="label label-warning">删除</span></a>';
                    }
                }
            ]
        });
    });

    // 点击资讯类型，重新加载bootstrap-table
    $('#zxType').click(function () {
        pushType = '3';
        $("#table").bootstrapTable('removeAll');
        $("#table").bootstrapTable('refreshOptions',{
            queryParams:function(params) { //设置查询参数
                var param = {
                    object:{
                        pushVersionEntity: {
                            pushVersion: pushVersion
                        },
                        type: 3
                    },
                    size: params.limit,
                    page: params.offset/params.limit
                };
                return param;
            },
            columns: [
                {
                    title: '序号',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value, row, index) {
                        var options = $("#table").bootstrapTable('getOptions');
                        return options.pageSize * (options.pageNumber - 1) + index + 1;
                    }
                },
                {
                    title: '推送类型',
                    field: 'type',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        if(value == 1)
                            return "节目";
                        else if(value == 2)
                            return "app";
                        else if(value == 3)
                            return "资讯";
                    }
                },
                {
                    title: '资讯主题',
                    field: 'content',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        return JSON.parse(value).topicInformation;
                    }
                },
                {
                    title: '资讯详情',
                    field: 'content',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        return JSON.parse(value).detailsInformation;
                    }
                },
                {
                    title: '推送时间',
                    field: 'content',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value,row) {
                        var pushTime = JSON.parse(value).priority;
                        if(pushTime == 1){
                            realTime = true;
                            return "实时";
                        }else if(pushTime == 2){
                            return JSON.parse(value).delayNumber + "分钟";
                        }else if(pushTime == 3){
                            realTime = false;
                            return "定时";
                        }else{
                            realTime = false;
                        }
                    }
                },
                {
                    title: '推送频率',
                    field: 'content',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        return JSON.parse(value).pullNumber + "次";
                    }
                },
                {
                    title: '消息有效期',
                    field: 'expiryDate',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        if (value == 0)
                            return "永久有效";
                        else{
                            return value + "天";
                        }
                    }
                },
                {
                    title: '版本号',
                    field: 'pushVersionEntity',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        return value.pushVersion;
                    }
                },
                {
                    title: '创建时间',
                    field: 'pushVersionEntity',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        return changeDateFormat(value.createdDate);
                    }
                },
                {
                    title: '创建人',
                    field: 'pushVersionEntity',
                    align: 'center',
                    halign: 'center',
                    formatter: function (value) {
                        return value.lastModifiedSysUser;
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    halign: 'center',
                    events: operateEvents,
                    formatter: function(value,row){
                        if(row.stateDescription == 'deleted'){
                            return '<font style="color: #9c9c9c">已删除</font>';
                        }
                        return '<a class="updatePush" href="javascript:;"><span class="label label-info">修改</span></a>&nbsp;&nbsp;' +
                               '<a class="deletePush" href="javascript:;"><span class="label label-warning">删除</span></a>';
                    }
                }
            ],
            onLoadSuccess: function(data){
                // 如果获取到的数据为0时，默认从20001开始
                if (data.total == 0)
                    realTime = false;
            }
        });
    });

});

window.operateEvents = {
    //  修改代做
    // 'click .deletePush': function (e, value, row, index) {
    //     var pushConfirm = confirm("请您确定是否要删除该推送内容？");
    //     if(pushConfirm){
    //         $.ajax({
    //             url:'../../../PushType/delete',
    //             type:'POST',
    //             data:JSON.stringify({id:row.id}),
    //             dataType:'json',
    //             contentType:'application/json',
    //             success:function(data){
    //                 if (resResult(data)){
    //                     changeSuccess("删除成功！");
    //                     $("#table").bootstrapTable('refresh');
    //                 }
    //             }
    //         });
    //     }
    // },
    'click .deletePush': function (e, value, row, index) {
        var pushConfirm = confirm("请您确定是否要删除该推送内容？");
        if(pushConfirm){
            $.ajax({
                url:'../../../PushType/delete',
                type:'POST',
                data:JSON.stringify({id:row.id}),
                dataType:'json',
                contentType:'application/json',
                success:function(data){
                    if (resResult(data)){
                        changeSuccess("删除成功！");
                        $("#table").bootstrapTable('removeAll');
                        $("#table").bootstrapTable('refresh');
                    }
                }
            });
        }
    }
};


//时间戳转换
function changeDateFormat(d){
    var date=new Date(parseInt(d,10));
    var month = date.getMonth()+1 <10 ? "0"+ (date.getMonth()+1):date.getMonth()+1;
    var day = date.getDate() <10 ? "0"+date.getDate():date.getDate();
    var hour=date.getHours() <10 ? "0"+date.getHours():date.getHours();
    var minutes=date.getMinutes() <10 ? "0"+date.getMinutes():date.getMinutes();
    var seconds=date.getSeconds() <10 ? "0"+date.getSeconds():date.getSeconds();
    return date.getFullYear()+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds;
}

//添加、删除、修改后的成功提示
function changeSuccess(a){
    $("#alertSuccess").modal('show');
    $("#alertSuccess").find(".modal-body").text(a);
    $("#alertSuccess").on("shown.bs.modal",function(){
        setTimeout(function(){
            $("#alertSuccess").modal('hide');
        },400);
    });
}