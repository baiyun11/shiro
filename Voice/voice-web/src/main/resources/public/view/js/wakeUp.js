//分页
var wakeSVal = "";
function getData(params,callback){
    var val_page=params.page-1;
    if(wakeSVal=="")
        var data=JSON.stringify({object:{},page:val_page,size:10,property:"wakeUpInfo.time",direction:"DESC"});
    else var data=JSON.stringify({object:{vin:wakeSVal},page:val_page,size:10,property:"wakeUpInfo.time",direction:"DESC"});
    $.ajax({
        url:'../WakeUpInfo/getPage',
        type:'POST',
        data:data,
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
var wakeArr="";
function render(d){
    skip_page=="" ? currPage=currPage : currPage=d;
    getData({
        page: currPage,
        size: 10
    },function(data){
        console.log(data)
        wakeArr=data.data.content;
        if(wakeArr==undefined) {
            $('#wakeUpBox').html(warning);
            $('.page_navigation').css('display','none');
            return false;
        }
        $('#wakeUpBox').html('');
        var wakeHtml="";
        for(var i=0;i<wakeArr.length;i++){
            var oderNum=(currPage-1)*10+i+1;
            wakeHtml=wakeHtml+'<tr>' +
                '<td><div class="oderNum">'+oderNum+'</div></td>' +
                '<td><div class="AutoVINDA">'+wakeArr[i].uploadHeader.vin+'</div></td>' +
                '<td><div class="wordType">'+wakeArr[i].wakeUpInfo.wakeUpType+'</div></td>' +
                '<td><div class="rawTextDA">'+wakeArr[i].wakeUpInfo.wakeUpWord+'</div></td>' +
                '<td><div class="date_time">'+changeDateFormat(wakeArr[i].wakeUpInfo.time)+'</div></td>';
        }
        var num_p=data.data.totalPages;
        var num_l=data.data.totalElements;
        $("#num_pages").html("共 "+num_p+" 页");
        $("#num_lists").html("共 "+num_l+" 条数据");
        num_l<=10 ? $(".page_navigation").css("display","none"):$(".page_navigation").css("display","block");
        $('#wakeUpBox').append(wakeHtml);
        setPaginator(currPage, data.data.totalPages , render);
        skip_page="";
        $("#skipPage").val("");
    })
}
render(currPage);

$(function(){
    $("#searchwakeUpBtn").click(function(){
        wakeSVal=$("#wakeUpVinVal").val();
        warning='<tr><td colspan="5"><div style="width:100%; height:40px; line-height:40px; text-align:center;">没有找到要查询的内容！</div></td></tr>';
        currPage=1;
        render(currPage);
    });
})



