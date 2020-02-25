package com.cn.global.security.exception;

import com.cn.global.common.response.CodeConstant;
import com.cn.global.common.response.ResponseResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * @ClassName MyResponseBodyAdvice
 * @Description 返回数据统一在此处使用ResponseResult进行包装
 * @Author lin.tianwen
 * @Date 2018/10/30 11:07
 */
@ControllerAdvice
public class MyResponseBodyAdvice implements ResponseBodyAdvice {

    @Override
    public boolean supports(MethodParameter methodParameter, Class aClass) {

        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter methodParameter,
                                  MediaType mediaType,
                                  Class aClass,
                                  ServerHttpRequest serverHttpRequest,
                                  ServerHttpResponse serverHttpResponse) {
        //如遇404类错误或访问swagger直接返回，不进行包装
        if (methodParameter.getMethod().getName().equals("error")
                || methodParameter.getMethod().getName().equals("uiConfiguration")
                || methodParameter.getMethod().getName().equals("securityConfiguration")
                || methodParameter.getMethod().getName().equals("swaggerResources")
                || methodParameter.getMethod().getName().equals("getDocumentation")) {

            return body;
        }
        ObjectMapper objectMapper = new ObjectMapper();
        //响应体
        Object object = null;
        //给所有的controller的返回使用ResponseResult包装
        if (!(body instanceof ResponseResult)) {

            object = new ResponseResult(CodeConstant.SUCCESS, body);

            try {
                //若body为字符串
                if (body instanceof String) {
                    /**
                     * controller层中返回的类型是String,但是在这里,我们把响应的类型修改成了
                     * ResponseResult。这就导致了,上面的这段代码在选择处理MessageConverter的
                     * 时候,依旧根据之前的String类型选择对应String类型的StringMessageConverter。
                     * 而在StringMessageConverter类型,他只接受String类型的返回类型,我们在
                     * ResponseBodyAdvice中将返回值从String类型改成 ResponseResult类型之后,调用
                     * StringMessageConverter方法发生类型强转。ReponseResult无法转换成String,
                     * 发生类型转换异常。所以我们需要将ReponseResult自行转换为json
                     *
                     **/
                    object = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(object);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return object;
    }
}