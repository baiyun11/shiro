package com.cn.global.log.UserRequest.interceptor;

import com.alibaba.fastjson.JSON;
import com.cn.global.common.utils.IPHelper;
import com.cn.global.common.utils.UserHelper;
import com.cn.global.log.UserRequest.entity.SysUserRequestLog;
import com.cn.global.log.UserRequest.service.UserRequestLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Time;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * 日志拦截器
 */
@Component
// @Transactional
public class UserRequestLogInterceptor extends HandlerInterceptorAdapter {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    UserRequestLogService userRequestLogService;

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        try {

            SysUserRequestLog sysUserRequestLog = new SysUserRequestLog();

            String requestURI = request.getRequestURI();

            sysUserRequestLog.setCommandName(requestURI);

            sysUserRequestLog.setCommandTime(new Time(System.currentTimeMillis()));

            if(requestURI.contains("login")){

                String ip =  request.getHeader("ip");

                sysUserRequestLog.setIpAddress(ip);

            }else{

                sysUserRequestLog.setIpAddress(new IPHelper().getIpAddr(request));

            }

            String userName = UserHelper.getCurrentUserName();

            sysUserRequestLog.setCommandUserName(userName);

            MultipartResolver resolver = new CommonsMultipartResolver(request.getSession().getServletContext());

            String param;

            // 判断该请求是否是上传文件的请求，如果是将文件名写到setParam()里
            if(resolver.isMultipart(request)){
                MultipartHttpServletRequest  multipartRequest=(MultipartHttpServletRequest) request;

                Map<String, MultipartFile> files= multipartRequest.getFileMap();

                Map<String,String[]> map = new HashMap<>();

                if (files.size() != 0) {

                    Iterator<String> iterator = files.keySet().iterator();

                    String fileNames = "";

                    while (iterator.hasNext()) {

                        MultipartFile multipartFile = multipartRequest.getFile(iterator.next());

                        fileNames += multipartFile.getOriginalFilename() + ",";
                    }

                    map.put("fileNames", fileNames.substring(0,fileNames.length()-1).split(","));
                }

                map.putAll(request.getParameterMap());

                param = JSON.toJSON(map).toString();

            }else {

                param = HttpHelper.getBodyString(new RequestReaderHttpServletRequestWrapper(request));

            }

            if (param.length() > 250) {

                sysUserRequestLog.setParam(param.substring(0, 250) + "...");

                logger.info(sysUserRequestLog.getParam());

            } else
                sysUserRequestLog.setParam(param);

            userRequestLogService.insert(sysUserRequestLog);

        } catch (Exception e) {
            logger.error("UserRequestLogInterceptor error: " + e.getMessage());
        }

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

        String param = HttpHelper.getBodyString(new RequestReaderHttpServletRequestWrapper(request));

        logger.error(param);
    }
}
