package com.cn.global;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
//自动设置创建时间等
@EnableJpaAuditing
public class ShiroApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShiroApplication.class, args);
    }
}
