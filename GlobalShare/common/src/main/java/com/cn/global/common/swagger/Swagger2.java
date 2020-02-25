package com.cn.global.common.swagger;

import com.google.common.base.Function;
import com.google.common.base.Optional;
import com.google.common.base.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.RequestMethod;
import springfox.documentation.RequestHandler;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.ResponseMessage;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.ArrayList;
import java.util.List;

@Configuration
@Profile({"dev", "test"})
@EnableSwagger2
public class Swagger2 {

    public Logger logger = LoggerFactory.getLogger(Long.class);

    // 读取引入该模块的项目包package
    @Value("${swagger.resourcePackage:}")
    public String resourcePackage;

    // 读取引入该模块的swagger接口文档标题
    @Value("${swagger.title:}")
    public String title;

    // 读取引入该模块的swagger接口版本
    @Value("${swagger.version:}")
    public String version;

    public String securityPackage = "com.cn.com.cn.global.security.controller";

    public String logPackage = "com.cn.com.cn.global.log.UserRequest.controller";

    @Bean
    public Docket createRestApi() {

        List<ResponseMessage> responseMessageList = new ArrayList<>();

        // 配置多个扫描路径
        String packageUrl = resourcePackage + ";" + securityPackage + ";" + logPackage;

        logger.error(packageUrl);

        return new Docket(DocumentationType.SWAGGER_2)
                .useDefaultResponseMessages(false)
                .globalResponseMessage(RequestMethod.POST, responseMessageList)
                .globalResponseMessage(RequestMethod.GET, responseMessageList)
                .apiInfo(apiInfo())
                .select()
                .apis(basePackage(packageUrl))
                .paths(PathSelectors.any())
                .build();
    }

    public ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title(title)
                .description("传输采用HTTP协议，使用POST方式提交。\n" +
                                "请求参数缺省以JSON格式传输， \n" +
                                "响应参数缺省以JSON格式传输。\n"
                )
                .termsOfServiceUrl("")
                .contact(new Contact("struggling_rong", "", ""))
                .version(version)
                .build();
    }


    public static Predicate<RequestHandler> basePackage(final String basePackage) {
        return input -> declaringClass(input).transform(handlerPackage(basePackage)).or(true);
    }

    public static Function<Class<?>, Boolean> handlerPackage(final String basePackage) {
        return input -> {
            // 循环判断匹配
            for (String strPackage : basePackage.split(";")) {
                boolean isMatch = input.getPackage().getName().startsWith(strPackage);
                if (isMatch) {
                    return true;
                }
            }
            return false;
        };
    }

    public static Optional<? extends Class<?>> declaringClass(RequestHandler input) {
        return Optional.fromNullable(input.declaringClass());
    }


}