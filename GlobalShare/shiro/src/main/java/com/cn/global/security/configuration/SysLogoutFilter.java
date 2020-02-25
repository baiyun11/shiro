
package com.cn.global.security.configuration;

import org.apache.shiro.web.filter.authc.LogoutFilter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

public class SysLogoutFilter extends LogoutFilter {

    @Override
    protected boolean preHandle(ServletRequest request, ServletResponse response) throws Exception {
        return true;
    }

    @Override
    protected void postHandle(ServletRequest request, ServletResponse response) throws Exception {
        super.preHandle(request, response);
    }

    @Override
    protected void issueRedirect(ServletRequest request, ServletResponse response, String redirectUrl) throws Exception {
    }
}