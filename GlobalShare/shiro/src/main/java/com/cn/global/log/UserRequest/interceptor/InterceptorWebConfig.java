package com.cn.global.log.UserRequest.interceptor;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
//@EnableWebMvc
public class InterceptorWebConfig extends WebMvcConfigurerAdapter {

    @Autowired
    UserRequestLogInterceptor userRequestLogInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        registry.addInterceptor(userRequestLogInterceptor).excludePathPatterns("/error");
//        registry.addInterceptor(userRequestLogInterceptor);
    }
}