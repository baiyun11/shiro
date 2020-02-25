
//数据呈现和分页
var deployId=$.getUrlParam('id');
function getData(params,callback){
    val_page=params.page-1;
    $.ajax({
        url:'../Module/find',
        type:'POST',
        data: JSON.stringify({id:deployId}),
        dataType:'json',
        contentType : "application/json",
        success:function(data){
            requestOk(data,'',callback,customCodeError);
        },
        error:function(response){
        }
    })
}
var funcData="";
funcData={};
var currPage = 1;
var skip_page="";
var idCar="";
function render(d){
    skip_page=="" ? currPage=currPage : currPage=d;
    getData({
        page: currPage,
        size: 10
    },function(data){
        $("#deployList").html("");
        var deployHtml="";
        var dataVal = data.data;
        var moduleDeploy = dataVal[0].moduleName;
        var AuthorDeploy = dataVal[0].lastModifiedSysUser;
        var deployData = dataVal[0].vehicleModuleConfigurationList;
        if(deployData == undefined){
            $('.page_navigation').css('display','none');
            return false;
        }else{
            for(var i=0;i<deployData.length;i++){
                var idValDeploy = deployData[i].id;
                var supportDeploy = deployData[i].supportedConfiguration;
                var codeDeploy = deployData[i].configurationCode;
                var timeDeploy = changeDateFormat(deployData[i].lastModifiedDate);
                deployHtml = deployHtml +'<tr>' +
                    '<td><div class="deploy" title="'+supportDeploy+'">'+supportDeploy+'</div></td>' +
                    '<td><div class="deployCode">'+codeDeploy+'</div></td>' +
                    '<td><div class="funcType">'+moduleDeploy+'</div></td>' +
                    '<td><div class="username">'+AuthorDeploy+'</div></td>' +
                    '<td><div class="date_time">'+timeDeploy+'</div></td>' +
                    '<td class="operationBox">' +
                    '<div class="operation">' +
                    '<a class="revise" href="javascript:;"><span class="label label-info">修改</span></a>' +
                    '<a class="del" href="javascript:;"><span class="label label-warning">删除</span></a>' +
                    '<input class="idDeploy" type="hidden" value="'+idValDeploy+'"/>' +
                    '</div>' +
                    '</td>' +
                    '</tr>'
            }
        }
        // var num_p=data.totalPages;
        // var num_l=data.totalElements;
        // $("#num_pages").html("共 "+num_p+" 页");
        // $("#num_lists").html("共 "+num_l+" 条数据");
        // num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
        $("#deployList").append(deployHtml);
        setPaginator(currPage, dataVal.totalPages , render);
    })
    skip_page="";
    $("#skipPage").val("");
}
render(currPage);

$(function(){
//添加新功能
    //点击添加模块按钮清空输入框
    $("#addConfig").click(function(){
        idCar="";
        $("#addDeployBtn").removeAttr("disabled","disabled");
        $("#configFunc").val("");
        $("#configCode").val("");
        $(".alert").animate({opacity:0},100);
    });

    $("#addDeployBtn").click(function(){
        var deployText = $("#configFunc").val();
        var deployCode = $("#configCode").val();
        if(deployText=="" || deployText ==null || deployText==undefined){
            $(".alert").html("<strong>模块配置不能为空，</strong>请重新输入。").animate({opacity:1},100);
        }else if(deployCode== "" || deployCode==null || deployCode==undefined){
            $(".alert").html("<strong>模块配置码不能为空，</strong>请重新输入。").animate({opacity:1},100);
        }else if(idCar=="") {
            addModifyConfig({
                supportedConfiguration: deployText,
                configurationCode: deployCode,
                vehicleModule: {id: deployId}
            });
        }else {
            addModifyConfig({
                id: idCar,
                supportedConfiguration: deployText,
                configurationCode: deployCode,
                vehicleModule: {id: deployId}
            });
        }
    })

//修改数据
    $(document).on("click",".revise",function(){
        $(".alert").animate({opacity:0},100);
        $("#addDeployBtn").removeAttr("disabled","disabled");
        $('#identifier1').modal('show');
        idCar = $(this).next().next().val();
        var funcName=$(this).parents("tr").find(".deploy").text();
        var codeName=$(this).parents("tr").find(".deployCode").text();
        $("#configFunc").val(funcName);
        $("#configCode").val(codeName);

    })

    //删除模块配置
    $(document).on("click",".del",function(){
        var delIdValDeploy = $(this).next().val();
        var func = confirm("确定要删除这个模块吗?");
        if(func==true){
            $.ajax({
                url:'../TotalConfiguration/delete',
                type:'POST',
                data:JSON.stringify({id:delIdValDeploy}),
                dataType:'json',
                contentType:'application/json',
                success:function(data){
                    requestOk(data,'',function(){
                        changeSuccess("删除成功！");
                        render(currPage);
                    },customCodeError);
                },
                error:function(data){
                }
            })
        }
    })
})

//添加或修改的ajax请求
function addModifyConfig(f){
    $.ajax({
        url:'../TotalConfiguration/update',
        type:'POST',
        data:JSON.stringify(f),
        dataType:'json',
        contentType:'application/json',
        success:function(data){
            requestOk(data,'',function(){
                $('#identifier1').modal('hide');
                changeSuccess("保存成功！");
                currPage=1;
                render(currPage);
            },customCodeError);
        },
        error:function(data){
        }
    })
}



//查询模块配置
// var funcWord='';
// $("#searchFuncBtn").click(function(){
//     funcWord = $("#searchFunc").val();
//     warning='<tr><td colspan="6"><div style="width:100%; height:40px; line-height:40px; text-align:center;">没有找到要查询的内容！</div></td></tr>';
//     funcWord!="" ? funcData={moduleName:funcWord} : funcData={};
//     currPage=1;
//     render(currPage);
// })