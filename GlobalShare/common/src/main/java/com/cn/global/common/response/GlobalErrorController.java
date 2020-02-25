package com.cn.global.common.response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.web.BasicErrorController;
import org.springframework.boot.autoconfigure.web.DefaultErrorAttributes;
import org.springframework.boot.autoconfigure.web.ErrorProperties;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
public class GlobalErrorController extends BasicErrorController {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    public GlobalErrorController() {
        super(new DefaultErrorAttributes(), new ErrorProperties());
    }

    @Override
    @RequestMapping
    public ResponseEntity error(HttpServletRequest request) {

        Map<String, Object> body = this.getErrorAttributes(request, this.isIncludeStackTrace(request, MediaType.ALL));
        logger.info("报错日志={}",body);
        String message = (String) body.get("message");
        Integer status = (Integer) body.get("status");
        String error = (String) body.get("error");
        if (message != null) {

            if (message.contains(CodeConstant.CLIENT_AUTHENTICATED_FAILURE.getMsg())) {
                return ResponseEntity.ok(new ResponseResult(CodeConstant.CLIENT_AUTHENTICATED_FAILURE, body));
            } else if (message.contains(CodeConstant.CLIENT_UNAUTHENTICATED.getMsg())) {
                return ResponseEntity.ok(new ResponseResult(CodeConstant.CLIENT_UNAUTHENTICATED, body));
            } else if (message.contains(CodeConstant.CLIENT_UNAUTHORIZATED.getMsg())) {
                return ResponseEntity.ok(new ResponseResult(CodeConstant.CLIENT_UNAUTHORIZATED, body));
            } else if (status == 401 && error.contains("Unauthorized")) {
                return ResponseEntity.ok(new ResponseResult(CodeConstant.CLIENT_UNAUTHORIZATED, body));
            }
        }

        //body

        return ResponseEntity.ok(new ResponseResult(CodeConstant.SERVER_UNKNOWN_EXCEPTION, body));
    }
}
