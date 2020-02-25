//分页
$(function () {
    $('[data-toggle="popover"]').popover();   //数据里表里的弹出提示框的初始化
})
var val_page="";
function getData(params,callback){
    val_page=params.page-1;  //要查询的页数
    $.ajax({
        url:'../PushVersion/getPage',
        type:'POST',
        data: JSON.stringify({page:val_page,size:10,property:"pushVersion",direction:"DESC"}),
        dataType:'json',
        contentType : "application/json",
        success:function(data){
            requestOk(data,'',callback,customCodeError);  //统一code后，对返回数据进行处理的函数，callback当code为200时执行，customCodeError当code不是200时执行。
        },
        error:function(response){
        }
    })
}
var currPage = 1;       //当页面初次加载时，默认为第一页
var skip_page="";       //声明变量，跳转页面时
var lastData="";
function render(d){
    skip_page=="" ? currPage=currPage : currPage=d;  //判断是否输入了跳转页面
    getData({
        page: currPage,
        size: 10
    },function(data){
        $("#pushEdtion").html("");      //清空表格，防止数据累加显示
        var dataVal = data.data;
        var arrPush = dataVal.content;
        var pushHtml = "";
        if(arrPush==undefined){
            $('.page_navigation').css('display','none');  //当没有数据的时候，隐藏分页，并不往下执行
            return false;
        };
        for(var i = 0 ; i < arrPush.length; i ++){
            var idPush=arrPush[i].id;
            var pushVersion = arrPush[i].pushVersion;
            var createdDate=changeDateFormat(arrPush[i].createdDate);
            var val_username=arrPush[i].lastModifiedSysUser;
            var pushIssue=arrPush[i].stateDescription;                    //获取发布状态
            // var pushDelete = arrPush[i].deleteStatus;
            if(pushIssue==="publish"){               //判断版本是否为“发布”的状态
                var issueStatus='已发布 | '+'<a class="deletePush" href="javascript:;"><span class="label label-warning">删除</span></a>';
            }else if(pushIssue==="deleted"){
                var issueStatus='已删除';
            }else if(pushIssue==="test"){
                var issueStatus='<a class="issuePush" href="javascript:;"><span class="label label-danger">发布</span></a>';
                $("#addPushEdtion").attr("disabled","disabled");
            }
            // <td><div class="decription_1">永久有效 </div></td>
            pushHtml = pushHtml + '<tr><td><div class="version_1"><a id="text_version" href="pushContent.html?id='+pushVersion+'&state='+pushIssue+'">' + pushVersion + '</a></div></td><td><div class="issue_1">'+issueStatus+'</div><input type="hidden" value="'+idPush+'"/></td><td><div class="username">'+val_username+'</div></td><td><div class="date_time">'+createdDate+'</div></td></tr>';
        }
        var num_p=dataVal.totalPages;
        var num_l=dataVal.totalElements;
        if(val_page===0){
            lastData=dataVal.content[0].pushVersion;
        }
        $("#num_pages").html("共 "+num_p+" 页");
        $("#num_lists").html("共 "+num_l+" 条数据");
        num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
        $("#pushEdtion").append(pushHtml);
        $("#pushEdtion").find("tr").each(function(){
            var valIssueWord = $(this).find(".issue_1").text();
            if(valIssueWord==='已删除'){
                $(this).css("background","#f8f8f8");
                $(this).find("div").css("color","#8e8b8b");
                $(this).find("a").css("color","#8e8b8b");
            }
        })
        setPaginator(currPage, dataVal.totalPages , render);
    })
    skip_page="";
    $("#skipPage").val("");
}
render(currPage);

$(function(){
    //点击“添加推送版本” ，如果第一个版本号则为20001，以后再新增版本号时在20001的基础上加1，无需手动添加
    var valPush="";
    $("#addPushEdtion").click(function(){
        var num=$("#pushEdtion").has("tr").length;
        if(num!=0){
            valPush=parseInt(lastData)+1;
            $("#pushEditionVal").val(valPush);
        }else{
            $("#pushEditionVal").val("20001");
        }
    });
    //点击添加新的推送版本
    $("#addPushEditionBtn").click(function(){
        var pushEditionVal = $("#pushEditionVal").val();
        // var pushTermVal = $("#pushTerm").val();
        // if(pushTermVal!="" || pushTermVal!=null || pushTermVal!=undefined){
            $.ajax({
                url:'../PushVersion/add',
                type:'POST',
                data:JSON.stringify({pushVersion:pushEditionVal}),
                dataType:'json',
                contentType:'application/json',
                success:function(data){
                    requestOk(data,'',function(){
                        $('#modalEdition').modal('hide');
                        changeSuccess("添加成功！");
                        currPage=1;
                        render(currPage);
                    },customCodeError);
                },
                error:function(data){
                }
            });
        // }else{
        //     $(".alert").html("<strong>推送有效期不能为空，</strong>请输入推送有效期！").animate({opacity:1},100);
        // }
    })

    //点击发布
    $(document).on("click",".issuePush",function(){
        var issueEdition=$(this).parents("tr").find("td").eq(0).text();
        var issuePush = confirm("确定要发布吗？")
        if(issuePush==true){
            $.ajax({
                async: false,
                url:'../PushVersion/update',
                type:'POST',
                data:JSON.stringify({pushVersion:issueEdition}),
                dataType:'json',
                contentType : "application/json",
                success:function(data){
                    requestOk(data,'',function(){
                        $("#addPushEdtion").removeAttr("disabled","disabled");
                        changeSuccess("发布成功！");
                        render(currPage);
                    },function(){
                        changeSuccess(data.data);
                    });
                },
                error:function(data){
                }
            })
        }
    })

    //点击删除
    $(document).on("click",".deletePush",function(){
        var delPushVal = $(this).parents("tr").find("td:first").text();
        var pushConfirm = confirm("请您确定是否要删除该版本？");
        if(pushConfirm){
            $.ajax({
                url:'../PushVersion/delete',
                type:'POST',
                data:JSON.stringify({pushVersion:delPushVal}),
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
            });
        }
    })
})
