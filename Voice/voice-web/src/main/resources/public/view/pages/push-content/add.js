//修改需要传的id
var revisePushId="",
    accessid = '',
    host = '',
    policyBase64 = '',
    signature = '',
    key = '',
    expire = 0,
    g_object_name = '',
    fileName = '';
var init_filters = {};


$(function(){
    // 接收地址栏传参
    var pushVersion = $.getUrlParam('pushVersion');
    var pushType = $.getUrlParam('pushType');
    var stateDescription=$.getUrlParam('stateDescription');
    var realTime = $.getUrlParam('realTime');

    // 表单特殊需求预加载时候的处理
    if (pushType == '1'){
        $('#input-push-type').val('节目');
        $('#form-jx').show();
        $('#form-jx').append($('#push-common').html() + $('#push-region').html() + $('#push-version-common').html());

    }else if(pushType == '2'){
        $('#input-push-type').val('app');
        $('#form-app').show();
        $('#form-app').append($('#push-region').html() +$('#push-version-common').html());
    }else if(pushType == '3'){
        $('#input-push-type').val('资讯');
        $('#form-zx').show();
        $('#form-zx').append($('#push-common').html() +$('#push-region').html() + $('#push-version-common').html());
    }
    $('#input-push-version').val(pushVersion);
    $('#input-push-frequency').attr('disabled','disabled');
    $('#input-push-frequency').val('1');

    if(realTime == "true"){
        $('#radio-realTime').prop('disabled','disabled');
        $('#radio-timing').prop('checked','checked');
        $('#input-push-frequency').removeAttr('disabled');
    }else{
        $('#radio-realTime').prop('checked','checked');
    }

    $('#input-command').val('无');


    var uploader, count = 0;
    $('input[type=radio][name=radio-theme-type]').change(function () {
        $('#input-theme').show();
        $('#button-theme').hide();
        $('#div-file-name').hide();
        if (this.value != "考拉FM电台" && this.value != "words"){
            $('#input-theme').hide();
            $('#button-theme').show();
            $('#div-file-name').hide();

            // 根据选择的图片、音频和视频动态修改plupload的filters
            if (this.value == 'picture') {
                init_filters = {
                    mime_types: [{title: "Image files", extensions: "png"}],
                    max_file_size: '500kb', //最大只能上传10mb的文件
                    prevent_duplicates: true //不允许选取重复文件
                };
            } else if (this.value == 'audio') {
                init_filters = {
                    mime_types: [{title: "Music files", extensions: "mp3"}],
                    max_file_size: '1mb', //最大只能上传10mb的文件
                    prevent_duplicates: true //不允许选取重复文件

                };
            } else if (this.value == 'video') {
                init_filters = {
                    mime_types: [{title: "Video files", extensions: "mp4"}],
                    max_file_size: '5mb', //最大只能上传10mb的文件
                    prevent_duplicates: true //不允许选取重复文件

                };
            };
            if (count >= 1){
                uploader.destroy();
            }
            uploader = new plupload.Uploader({
                runtimes : 'html5,flash,silverlight,html4',
                browse_button : 'button-theme',
                flash_swf_url : 'plupload-2.1.2/js/Moxie.swf',
                silverlight_xap_url : 'plupload-2.1.2/js/Moxie.xap',
                url : 'http://oss.aliyuncs.com',
                multi_selection: false,
                filters: init_filters,
                init: {
                    PostInit: function() {
                        $.ajax({
                            url: '../../../PushType/getOSSConfigOption',
                            type: 'POST',
                            contentType: 'application/json',
                            async:false,
                            success: function (data) {
                                if (resResult(data)){
                                    // 服务器返回oss对象存储配置参数
                                    host = data.data.host;
                                    policyBase64 = data.data.policy;
                                    accessid = data.data.accessid;
                                    signature = data.data.signature;
                                    expire = data.data.expire;
                                    key = data.data.dir;
                                }
                            }
                        });


                    },
                    FilesAdded: function(up,files){

                        plupload.each(files, function(file) {
                            fileName = file.name;
                            var suffixName = fileName.split(".")[1];
                            if(suffixName == 'png' && file.size >= 500 * 1024){
                                alert("该图片文件超过500KB,请重新上传!!");
                                // 移除该文件
                                up.removeFile(file);
                            }else if(suffixName == 'mp3' && file.size >= 1* 1024 * 1024){
                                alert("该音频文件超过1MB,请重新上传!!");
                                // 移除该文件
                                up.removeFile(file);
                            }else if(suffixName == 'mp4' && file.size >= 5 * 1024 * 1024){
                                alert("该音频文件超过5MB,请重新上传!!");
                                // 移除该文件
                                up.removeFile(file);
                            }else{
                                fileName = file.id + '.' + suffixName;
                                $('#div-file-name').html(fileName);
                                $('#div-file-name').show();
                            }

                            g_object_name = key;
                            new_multipart_params = {
                                'key' : g_object_name + fileName,
                                'policy': policyBase64,
                                'OSSAccessKeyId': accessid,
                                'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
                                'signature': signature,
                            };

                            uploader.setOption({
                                'url': host,
                                'multipart_params': new_multipart_params
                            });

                        });
                    },
                    UploadProgress: function(up, file) {
                        $('#div-progress').show();
                        $('#div-progress-bar').html('<span>' + file.percent + '%</span>');
                        $('#div-progress-bar').css('width', file.percent+'%');
                        $('#div-progress-bar').attr('aria-valuenow', file.percent);
                    },
                    FileUploaded: function(up, file, info) {

                        if (info.status == 200){
                            $('#exampleInputFileName').html('');
                        }
                        else if (info.status == 203)
                        {
                            alert('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response);
                        }
                        else
                        {
                            alert(info.response);
                        }
                    },

                    Error: function(up, err) {
                        if (err.code == -600) {
                            alert("选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小");
                        }
                        else if (err.code == -601) {
                            alert("选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型");
                        }
                        else if (err.code == -602) {
                            alert("这个文件已经上传过一遍了");
                        }
                        else
                        {
                            alert("Error xml:" + err.response);
                        }
                    }

                }

            });

            uploader.init();
            count ++;
        }
    })


    // 执行内容文本框逻辑
    var executiveContentUrl;
    $('#input-command').on('input',function () {
        var url = $('#input-command').val();
        var reg = /^[\w]*:\/\/[\w]*/;
        executiveContentUrl = reg.test(url);
        if(executiveContentUrl){
            var urlHead = url.split('://')[0];
            if( urlHead.toLocaleLowerCase() === 'https' ||
                urlHead.toLocaleLowerCase() === 'http' ||
                urlHead.toLocaleLowerCase() === 'ftp' ||
                urlHead.toLocaleLowerCase() === 'tcp' ||
                urlHead.toLocaleLowerCase() === 'ip' ||
                urlHead.toLocaleLowerCase() === 'udp' ||
                urlHead.toLocaleLowerCase() === 'icmp' ||
                urlHead.toLocaleLowerCase() === 'rip' ||
                urlHead.toLocaleLowerCase() === 'tftp' ||
                urlHead.toLocaleLowerCase() === 'dns' ||
                urlHead.toLocaleLowerCase() === 'smtp' ||
                urlHead.toLocaleLowerCase() === 'nfs' ||
                urlHead.toLocaleLowerCase() === 'telnet'){
                executiveContentUrl = false;
                $('#div-urlAppName').hide();
                $('#div-urlPackageName').hide();
            }else{
                $('#div-urlAppName').show();
                $('#div-urlPackageName').show();
                $.ajax({
                    url:"../../../PushContentUrlInfo/findOne",
                    type:"POST",
                    data:JSON.stringify({urlHead: urlHead}),
                    dataType:"json",
                    contentType : "application/json",
                    success: function (data) {
                        if(data.data == undefined || data.data == null){
                            $('#input-urlAppName').val('');
                            $('#input-urlPackageName').val('');

                            $("#input-urlAppName").removeAttr("disabled");
                            $("#input-urlPackageName").removeAttr("disabled");
                        }else{
                            $('#input-urlAppName').val(data.data.appName);
                            $('#input-urlPackageName').val(data.data.packageName);

                            $("#input-urlAppName").attr("disabled","disabled");
                            $("#input-urlPackageName").attr("disabled","disabled");
                        }
                    }
                });
            }
        }else{
            $('#div-urlAppName').hide();
            $('#div-urlPackageName').hide();
        }
    })


    //目标选择单选按钮逻辑
    $('input[type=radio][name=radio-target-user][value="all"]').attr("checked",true);
    $('input[type=radio][name=radio-target-user]').change(function () {
        if(this.value == "all"){
            $('#div-region').hide();
            $('#div-specific').hide();
            $('#div-specific-input').hide();
            $('#div-specific-file').hide();
        }else if(this.value == "region"){
            $('#div-region').show();
            $('#div-specific').hide();
            $('#div-specific-file').hide();
            $('#div-specific-input').hide();
        }else if(this.value == "vin"){
            $('input[type=radio][name=radio-target-specific]:checked').prop("checked", false);
            $('#div-region').hide();
            $('#div-specific').show();
            $('#div-specific-input').hide();
            $('#div-specific-file').hide();
        }
    })
    $('input[type=radio][name=radio-target-specific]').change(function () {
        if(this.value == "fileChange"){
            $('#div-specific-input').hide();
            $('#div-specific-file').show();
        }else if(this.value == "inputVIN"){
            $('#div-specific-file').hide();
            $('#div-specific-input').show();
        }
    })

    // 推送时间类型单选按钮逻辑
    $('input[type=radio][name=radio-push-time]').change(function () {
        $('#div-push-time').hide();
        if (this.value == "1"){
            $('#input-push-frequency').attr('disabled','disabled');
        }else if (this.value == "2"){
            $('#div-push-time').show();
            $('#input-push-frequency').removeAttr('disabled');

        }else if(this.value == "3"){
            $('#input-push-frequency').removeAttr('disabled');
        }
    });

    // 消息有效期单选按钮
    $('.validityChange input[type=radio]').change(function(){
        var validityVal = $(this).val();
        if(validityVal!=0)
            $('.effectiveInput').removeAttr('disabled','disabled');
        else{
            $('.effectiveInput').attr('disabled','disabled');

        }
    });

    $('#save').click(function(){
        // 获取主题类型的被选中的单选按钮值
        var themeTypeVal = $('input[type=radio][name=radio-theme-type]:checked').val();
        // 获取目标用户的被选中的单选按钮值
        var pushTargetVal = $('input[type=radio][name=radio-target-user]:checked').val();
        // 获取特定用户的被选中的单选按钮值
        var pushDesignationVal = $('input[type=radio][name=radio-target-specific]:checked').val();
        var effectiveUpload="";
        var foreverUpload = $('.validityChange input:checked').val();
        if(foreverUpload==0)
            effectiveUpload = foreverUpload;
        else
            effectiveUpload = $(".effectiveInput").val();

        var theme = $('#input-theme').val();
        theme = theme.replace(/\"/g, '\\"');
        theme = theme.replace(/\n/g, '\\\n');

        var content , dataPush;
        if (pushType == '1'){
            // input非空验证
            // 验证播报内容
            if($('#textarea-explain').val() == ''){
                alert('播报内容不能为空');
                $('#div-textarea-explain').addClass('has-error');
                return false;
            }else{
                $('#div-textarea-explain').removeClass('has-error');
            }
            // 验证主题类别
            if($('input[type=radio][name=radio-theme-type]:checked').val() == undefined){
                alert('请选择主题类别');
                $('#div-radio-theme-type').addClass('has-error');
                return false;
            }else{
                $('#div-radio-theme-type').removeClass('has-error');
            }
            // 验证主题
            if($('#input-theme').val() == ''){
                alert('主题不能为空');
                $('#div-input-theme').addClass('has-error');
                return false;
            }else{
                $('#div-input-theme').removeClass('has-error');
            }

            if($('#input-push-time').val() == ''){
                $('#input-push-time').val('0');
            }

            content = {
                explain: $('#textarea-explain').val(),
                category: themeTypeVal,
                command: $('#input-command').val(),
                priority: $('input[type=radio][name=radio-push-time]').val(),
                delayNumber: $('#input-push-time').val(),
                pullNumber: $('#input-push-frequency').val()

            };
            if(executiveContentUrl){
                content["appName"] = $('#input-urlAppName').val();
                content["appPackageName"] = $('#input-urlPackageName').val();

                $.ajax({
                    url:"../../../PushContentUrlInfo/save",
                    type:"POST",
                    data:JSON.stringify({
                        urlHead: content.command,
                        appName: content.appName,
                        packageName: content.appPackageName
                    }),
                    dataType:"json",
                    contentType : "application/json",
                    async:false,
                    success: function (data) {

                    }
                });
            }

            if(themeTypeVal == 'picture' || themeTypeVal == 'audio' || themeTypeVal == 'video'){
                content['theme'] = host + '/' + key + fileName;
                uploader.start();
                setTimeout(function(){
                    $('#div-progress').hide();
                },100);
            }else{

                content['theme'] = theme;
            }
            dataPush = {
                pushVersionEntity:{
                    pushVersion: pushVersion
                },
                type: pushType,
                expiryDate: effectiveUpload,
                stateDescription: stateDescription,
                content: JSON.stringify(content),
            };

            // 添加目标用户的属性
            if (pushTargetVal == "region"){
                var arr = [];
                $('.aui-titlespan').each(function(i){
                    arr[i] = $(this).text();
                })

                dataPush['pushTargetEntity'] = {
                    type: pushTargetVal,
                    targerList: arr,
                }

            }else if(pushTargetVal == "vin"){
                // 判断是不是通过按照手动输入和上传Vin的excel表格方式
                // 手动输入
                if(pushDesignationVal == "inputVIN"){
                    var arr = $('#specific-input').val().split('\n');
                    var size = arr.length;
                    // 遍历数组判断，不合适的alert
                    for(var i=0;i < size; i++ ){
                        if(arr[i].length != 17){
                            var h=i+1;
                            alert('第'+h+'个非17位有效Vin码');
                            return false;
                        }
                    }
                    dataPush['pushTargetEntity'] = {
                        type: pushTargetVal,
                        targerList: arr,
                    }
                }
                // 上传Vin的excel表格
                else if (pushDesignationVal == "fileChange"){
                    var formData = new FormData();
                    // json对象转formData对象
                    Object.keys(dataPush).forEach(function(key) {
                        if(key == 'pushVersionEntity'){
                            var key1 = key + '.pushVersion'
                            formData.append(key1, dataPush[key].pushVersion);
                        }else
                            formData.append(key, dataPush[key]);
                    });

                    formData.append("multipartFile", $('#specific-file')[0].files[0]);

                    $.ajax({
                        url: '../../../PushType/saveWithVinFile',
                        type: 'post',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            if(resResult(data)){
                                alert('添加成功');
                                return false;
                            }
                        }
                    })

                    return false;
                }
            }

            dataPush = JSON.stringify(dataPush);

        }
        else if(pushType == '2'){
            $('#input-push-type').val('app');
            //$('#form-app').show();
            //$('#form-app').append($('#push-version-common').html());
            //判断App名称不能为空
            if($('#input-app-name').val() == ''){
                alert('App名称不能为空');
                $('#div-input-app-name').addClass('has-error');
                return false;
            }else{
                $('#div-input-app-name').removeClass('has-error');
            }
            //判断App包名不能为空
            if($('#input-app-package').val() == ''){
                alert('App包名不能为空');
                $('#div-input-app-package').addClass('has-error');
                return false;
            }else{
                $('#div-input-app-package').removeClass('has-error');
            }
            //判断App介绍说明不能为空
            if($('#textarea-app-introduce').val() == ''){
                alert('App介绍说明不能为空');
                $('#div-textarea-app-introduce').addClass('has-error');
                return false;
            }else{
                $('#div-textarea-app-introduce').removeClass('has-error');
            }

            content = {
                appName: $('#input-app-name').val(),
                appPackageName: $('#input-app-package').val(),
                appIntroduce: $('#textarea-app-introduce').val(),
            };

            dataPush = JSON.stringify({
                pushVersionEntity:{
                    pushVersion:pushVersion
                },
                type: pushType,
                stateDescription:stateDescription,
                content:JSON.stringify(content),
            });
        }
        else if(pushType == '3'){
            $('#input-push-type').val('资讯');
            //$('#form-zx').show();
            //$('#form-zx').append($('#push-common').html() + $('#push-version-common').html());
            //判断资讯主题不能为空
            if($('#topicInformation').val() == ''){
                alert('资讯主题不能为空');
                $('#div-topicInformation').addClass('has-error');
                return false;
            }else{
                $('#div-topicInformation').removeClass('has-error');
            }
            //判断资讯详情不能为空
            if($('#detailsInformation').val() == ''){
                alert('资讯详情不能为空');
                $('#div-detailsInformation').addClass('has-error');
                return false;
            }else{
                $('#div-detailsInformation').removeClass('has-error');
            }
            content = {
                topicInformation: $('#topicInformation').val(),
                detailsInformation: $('#detailsInformation').val(),
                appIntroduce: $('#textarea-app-introduce').val(),
                priority: $('input[type=radio][name=radio-push-time]').val(),
                delayNumber: $('#input-push-time').val(),
                pullNumber: $('#input-push-frequency').val()
            };
            dataPush = JSON.stringify({
                pushVersionEntity:{
                    pushVersion:pushVersion
                },
                type: pushType,
                expiryDate:effectiveUpload,
                stateDescription:stateDescription,
                content:JSON.stringify(content),
            });

        }
        //判断有效天数不能为空
        if($('.validityChange input[type=radio]').val() != 0){
            if($('#validityDay').val() == ''){
                alert('有效天数不能为空');
                $('#div-validityDay').addClass('has-error');
                return false;
            }else{
                $('#div-validityDay').removeClass('has-error');
            }
        }
        $.ajax({
            url: '../../../PushType/upLoadFileOSS',
            type: 'POST',
            data: dataPush,
            dataType: 'json',
            contentType: 'application/json',
            async:false,
            success: function (data) {
                if(resResult(data)){
                    alert('保存成功');
                    window.location.href='../push-content/index.html?pushVersion='+ pushVersion +'&stateDescription='+ stateDescription;
                }
            }
        });
    });


    $('#reset').click(function(){
        location.reload();
    });

    $('#reback').click(function(){
        location.href = 'index.html?pushVersion=' + pushVersion + '&stateDescription=' + stateDescription;
    });

});
