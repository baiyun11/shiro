package com.cn.global.security.configuration;

import com.cn.global.common.utils.UserHelper;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

@Configuration
public class UserAuditor implements AuditorAware<String> {

    @Override
    public String getCurrentAuditor() {

        String userName = UserHelper.getCurrentUserName();

        return userName;
    }
}