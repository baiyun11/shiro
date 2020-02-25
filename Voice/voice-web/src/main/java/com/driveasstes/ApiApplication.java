package com.driveasstes;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import springfox.documentation.swagger2.annotations.EnableSwagger2;


@EnableSwagger2
@EnableAsync
//自动设置创建时间等
@EnableJpaAuditing
@ComponentScan({"com.cn","com.driveasstes"})
@SpringBootApplication
public class ApiApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        // 注意这里要指向原先用main方法执行的Application启动类
        return builder.sources(ApiApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}
