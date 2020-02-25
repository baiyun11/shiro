
//数据呈现和分页

function getData(params,callback,f){
    val_page=params.page-1;

    $.ajax({
        url:'../Module/findByModuleName',
        type:'POST',
        data: JSON.stringify({object:f,page:val_page,size:params.size}),
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
var carType = '';
var carTypeVal = '';
function render(d){
    skip_page=="" ? currPage=currPage : currPage=d;
    getData({
        page: currPage,
        size: 10
    },function(data){
        $("#functionList").html("");
        var dataVal = data.data;
        var funcData = dataVal.content;
        var funcHtml = "";
        if(funcData==undefined){
            $("#functionList").html(warning);
            $('.page_navigation').css('display','none');
            return false;
        };
        for(var i = 0 ; i < funcData.length ; i ++){
            var val_ID=funcData[i].id;
            var val_moduleName=funcData[i].moduleName;
            var carAuthor = funcData[i].lastModifiedSysUser;
            var carTime = changeDateFormat(funcData[i].lastModifiedDate);
            funcHtml = funcHtml + '<tr>' +
                '<td>' +
                '<div class="funcType"><a href="funcDeploy.html?id='+val_ID+'">'+val_moduleName+'</a></div>' +
                '</td>' +
                '<td><div class="username">'+carAuthor+'</div></td>' +
                '<td><div class="date_time">'+carTime+'</div></td>'+
                '<td class="operationBox">' +
                    '<div class="operation">' +
                        '<a class="revise" href="javascript:;"><span class="label label-info">修改</span></a>' +
                        '<a class="carConfig" href="javascript:;" data-toggle="modal" data-target="#config"><span class="label label-primary">汽车配置</span></a>' +
                        '<a class="del" href="javascript:;"><span class="label label-warning">删除</span></a>' +
                        '<input type="hidden" value="'+val_ID+'"/>' +
                    '</div>' +
                '</td>' +
                '</tr>'
        }
        var num_p=dataVal.totalPages;
        var num_l=dataVal.totalElements;
        $("#num_pages").html("共 "+num_p+" 页");
        $("#num_lists").html("共 "+num_l+" 条数据");
        num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
        $("#functionList").append(funcHtml);
        $('[data-toggle="popover"]').popover();
        setPaginator(currPage, dataVal.totalPages , render);
    },funcData)
    skip_page="";
    $("#skipPage").val("");
}
render(currPage);

//车型表的车型编码列表
//声明变量创建数组
var len ='';   //创建变量len，左侧select的option的个数
var valArr = new Array();                 //创建数组，存储左侧的option的value值
var textArr = new Array();                //创建数组，存储左侧的option的text值
function leftOption(){
    valArr.splice(0,valArr.length);
    textArr.splice(0,textArr.length);
    len = '';
    //汽车类型
    $.ajax({
        url:'../CarModel/findByExample',
        type:'POST',
        data:{},
        async:false,
        dataType:"json",
        contentType : "application/json",
        success:function(data){
            requestOk(data,'',function(){
                var dataLeftCar = data.data;
                for(var k=0; k<dataLeftCar.length; k++){
                    var carVal = dataLeftCar[k].modelCode;
                    var carData = dataLeftCar[k].modelName;
                    valArr.push(carVal);
                    textArr.push(carData);
                }
                len =valArr.length;
            },customCodeError);
        },
        error:function(data){
        }
    })
}
carType=carType.split(',');
carTypeVal=carTypeVal.split(',');
for(var j = 0; j<carType.length; j++){
    valArr.splice($.inArray(carTypeVal[j], valArr), 1);
    textArr.splice($.inArray(carType[j], textArr), 1);
    len=len-1;
}

//当汽车类型文本框的内的内容发生改变时会触发txtCount()这个函数
$("#textSearch").on({
    keyup : function(e){
        var flag = e.target.isNeedPrevent;
        if(flag)  return;
        txtCount(this) ;
        e.target.keyEvent = false ;
    },
    keydown : function(e){
        e.target.keyEvent = true ;
    },
    input : function(e){
        if(!e.target.keyEvent){
            txtCount(this);
        }
    },
    compositionstart : function(e){
        e.target.isNeedPrevent = true ;
    },
    compositionend : function(e){
        e.target.isNeedPrevent = false;
    }
})
function txtCount(a) {
    var words = $(a).val();
    var optionHtml="";
    var allOptionHtml="";
    for(var i=0;i<len;i++){
        if(words!=""){
            if(textArr[i].indexOf(words)>=0){   //遍历数组并判断数组中的值是否包含输入的值
                optionHtml=optionHtml+'<option value="'+valArr[i]+'">'+textArr[i]+'</option>';
            }
        }else{
            if(textArr[i] === "全部车型"){
                allOptionHtml = '<option value="'+valArr[i]+'">'+textArr[i]+'</option>'
            }else{
                optionHtml=optionHtml+'<option value="'+valArr[i]+'">'+textArr[i]+'</option>';
            }

        }
    }
    $(a).next().html(allOptionHtml+optionHtml);
}
//当点击左侧option的时候触发的事件

$("#leftList").change(function(){
    $('#leftList option:selected').each(function(){
        var chooseVal = $(this).val();
        var chooseTxt =  $(this).text();
        if(chooseVal!="" && chooseTxt!=""){
            if(chooseTxt==="全部车型"){
                $("#rightList").find('option').each(function(){
                    $("#leftList").append('<option value="'+$(this).val()+'">'+$(this).text()+'</option>');
                    $(this).remove();
                    valArr.splice($(this).val(),0,$(this).val());
                    textArr.splice($(this).val(),0,$(this).text());
                    $(".carList").text('');
                    len=len+1;
                });
                $("#rightList").append('<option value="'+chooseVal+'">'+chooseTxt+'</option>');
                $(".carList").append('<span>'+chooseTxt+'</span>');
                $("#leftList option").attr('disabled','disabled');
                $("#textSearch").attr('disabled','disabled');
            }else{
                $("#rightList").append('<option value="'+chooseVal+'">'+chooseTxt+'</option>');
                $(".carList").append('<span>'+chooseTxt+'</span>');
            }
        }
        $(this).remove();
        valArr.splice($.inArray(chooseVal, valArr), 1);
        textArr.splice($.inArray(chooseTxt, textArr), 1);
        len=len-1;
    });
});
//当点击右侧option的时候触发的事件
$("#rightList").change(function(){
    $('#rightList option:selected').each(function(){
        var chooseVal = $(this).val();
        var chooseTxt = $(this).text();
        var searchWord;
        searchWord = $("#textSearch").val();
        if(searchWord===""){
            if(chooseVal!="" && chooseTxt!=""){
                $("#leftList").prepend('<option value="'+chooseVal+'">'+chooseTxt+'</option>');
            }
            $(this).remove();
        }else{
            if(chooseTxt.indexOf(searchWord)>=0){
                $("#leftList").prepend('<option value="'+chooseVal+'">'+chooseTxt+'</option>');
                $(this).remove();
                
            }else{
                $(this).remove();
            }
        }
        if(chooseTxt==="全部车型"){
            $('#leftList option').removeAttr("disabled","disabled");
            $("#textSearch").removeAttr("disabled","disabled");
        }
        $(".carList").find("span").each(function(){
            var spanWord = $(this).text();
            if(spanWord===chooseTxt){
                $(this).remove();
            }
        })
        valArr.splice(chooseVal,0,chooseVal);
        textArr.splice(chooseVal,0,chooseTxt);
        len=len+1;
    });

});

$(function(){

//添加功能
    //点击添加模块按钮，清空输入框
    $("#addFunc").click(function(){
        idCar="";
        $("#addwordsBtn").removeAttr("disabled","disabled");
        $("#ftcType").val("");
        $(".alert").animate({opacity:0},100);

    })

    //当模块类型输入框时失焦的状态时，判断是否输入了值
    $("#ftcType").blur(function(){
        var funcBlur = $(this).val();
        if(funcBlur=="" || funcBlur==null || funcBlur==undefined){
            $(".funcAlert").html("<strong>模块类型不能为空，</strong>请重新输入。").animate({opacity:1},100);
            $("#addwordsBtn").attr("disabled","disabled");
        }
    })
    $("#ftcType").focus(function(){
        $(".alert").animate({opacity:0},100);
        $("#addwordsBtn").removeAttr("disabled","disabled");
    })

    var idCar="";
    var data="";
    //点击添加按钮，添加模块类型
    $("#addwordsBtn").click(function(){
        var valFunc = $("#ftcType").val();

        if(valFunc!="" || valFunc!=null || valFunc!=undefined){
            if(idCar==""){
                data = JSON.stringify({moduleName:valFunc});
            }else{
                data = JSON.stringify({id:idCar,moduleName:valFunc});
            }
            $.ajax({
                url:'../Module/updateModule',
                type:'POST',
                data:data,
                dataType:'json',
                async:false,
                contentType:'application/json',
                success:function(data){
                    requestOk(data,'',function(){
                        idCar="";
                        $('#identifier1').modal('hide');
                        changeSuccess("添加成功！");
                        currPage=1;
                        render(currPage);
                    },customCodeError);
                },
                error:function(data){
                }
            });
            idCar="";
        }
    })

    //汽车类型配置
    var carIdVal="";
    $(document).on('click','.carConfig',function(){
        leftOption();
        carIdVal = $(this).next().next().val();
        $("#rightList").html('');
        $('#leftList').html('');
        $(".carList").html('');
        $('#textSearch').val('');
        var selectCarOption = "";
        var waitCarOption = '';
        var allCarType = '';
        $.ajax({
            url:'../Module/find',
            type:'POST',
            data:JSON.stringify({id:carIdVal}),
            dataType:'json',
            contentType:'application/json',
            success:function(data){
                var selectCarText='';
                requestOk(data,'',function(){
                    var dataCar = data.data;
                    // console.log(dataCar);
                    if(dataCar[0].vehicleTypeList==undefined){
                        isNaN();
                    }else{
                        for(var j = 0 ; j<dataCar[0].vehicleTypeList.length ; j++){
                            var selectCarVal = dataCar[0].vehicleTypeList[j].modelCode;
                            selectCarText = dataCar[0].vehicleTypeList[j].modelName;
                            selectCarOption = selectCarOption+'<option value="'+selectCarVal+'">'+selectCarText+'</option>'
                            valArr.splice($.inArray(selectCarVal, valArr), 1);
                            textArr.splice($.inArray(selectCarText, textArr), 1);
                            len=len-1;
                            $(".carList").append('<span>'+selectCarText+'</span>');
                        }
                    }
                    $("#rightList").append(selectCarOption);
                    for(var n=0; n<textArr.length;n++){
                        if(textArr[n] === "全部车型"){
                            allCarType = '<option value="'+valArr[n]+'">'+textArr[n]+'</option>';
                        }else{
                            waitCarOption= waitCarOption+'<option value="'+valArr[n]+'">'+textArr[n]+'</option>';
                        }
                    }
                    $('#leftList').append(allCarType+waitCarOption);
                    if(selectCarText==="全部车型" ){
                        $("#leftList option").attr('disabled','disabled');
                        $("#textSearch").attr('disabled','disabled');
                    }else{
                        $("#textSearch").removeAttr('disabled','disabled');
                    }
                },customCodeError);
            },
            error:function(data){
            }
        })
    });

    //修改汽车类型
    $("#addCarBtn").click(function(){
        var XGCarArr = new Array();
        var vehicleTypeList = "";
        $("#rightList option").each(function(m){
            XGCarArr[m]=$(this).text();
            vehicleTypeList = vehicleTypeList+'{"modelName":"'+XGCarArr[m]+'"},';
        })
        // console.log(XGCarArr)
        vehicleTypeList = '['+vehicleTypeList.substring(0,vehicleTypeList.length-1) + ']';
        vehicleTypeList = $.parseJSON(vehicleTypeList);
        console.log(vehicleTypeList);
        $.ajax({
            url:'../Module/updateCarModel',
            type:'post',
            data:JSON.stringify({id:carIdVal,vehicleTypeList:vehicleTypeList}),
            dataType:'json',
            contentType:'application/json',
            success:function(data){
                requestOk(data,'',function(){
                    $('#config').modal('hide');
                    changeSuccess("保存成功！");
                    currPage=1;
                    render(currPage);
                },customCodeError);
            },
            error:function(data){
            }
        });
    })

    //修改数据
    $(document).on("click",".revise",function(){
        $(".funcAlert").animate({opacity:0},100);
        $("#addwordsBtn").removeAttr("disabled","disabled");
        $('#identifier1').modal('show');
        idCar = $(this).next().next().next().val();
        var funcName=$(this).parents("tr").find(".funcType").text();
        $("#ftcType").val(funcName);
    })

    //删除功能模块
    $(document).on("click",".del",function(){
        var delIdVal = $(this).next().val();
        var func = confirm("确定要删除这个功能吗?");
        // if(var i === undefined)
        if(func==true){
            $.ajax({
                url:'../Module/delete',
                type:'POST',
                data:JSON.stringify({id:delIdVal}),
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

//查询功能类型
var funcWord='';
$("#searchFuncBtn").click(function(){
    funcWord = $("#searchFunc").val();
    warning='<tr><td colspan="6"><div style="width:100%; height:40px; line-height:40px; text-align:center;">没有找到要查询的内容！</div></td></tr>';
    funcWord!="" ? funcData={moduleName:funcWord} : funcData={};
    currPage=1;
    render(currPage);
})