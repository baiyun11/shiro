package com.cn.global.common.response;

import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 全局异常处理.
 *
 * @author hzwanglin1
 * @date 2017/6/21
 * @since 1.0
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private static final String ERROR_LOG_TEMPLATE = "request url error {}";

    @ExceptionHandler(AbnormalException.class)
    public ModelAndView handleException(AbnormalException ex, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        logger.error(ERROR_LOG_TEMPLATE, request.getRequestURI(), ex.getMessage());
        ResponseResult responseResult = new ResponseResult(ex.getCodeConstant(), ex.getMessage());
        return boxingReturnModelMap(responseResult, request, response);
    }

    @ExceptionHandler(Exception.class)
    public ModelAndView handleException(Exception ex, HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        logger.error(ERROR_LOG_TEMPLATE + request.getRequestURI(), ex);
        ResponseResult responseResult = new ResponseResult(CodeConstant.SERVER_UNKNOWN_EXCEPTION, ex.getMessage());
        return boxingReturnModelMap(responseResult, request, response);
    }

    private ModelAndView boxingReturnModelMap(ResponseResult responseResult, HttpServletRequest request,
                                              HttpServletResponse response) throws IOException {
        response.setCharacterEncoding("UTF-8");
//        if (HttpUtil.isAjaxRequest(request) || HttpUtil.isAcceptJsonResponse(request)) {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(JSON.toJSONString(responseResult));
        logger.debug("boxing request {} to application/json", request.getRequestURI());
        return new ModelAndView();
//        } else {
//            response.setContentType(MediaType.APPLICATION_XHTML_XML_VALUE);
//            // TODO: 2017/6/21 add view resolver
//            logger.debug("boxing request {} to application/xhtml with view name {}", request.getRequestURI(), "");
//        }
//        return new ModelAndView("","", responseResult);
    }
}