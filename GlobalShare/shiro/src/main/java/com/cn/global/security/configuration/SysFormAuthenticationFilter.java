package com.cn.global.security.configuration;


import com.cn.global.common.response.AbnormalException;
import com.cn.global.common.response.CodeConstant;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;


//@Service
public class SysFormAuthenticationFilter extends FormAuthenticationFilter {

    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {

        if (this.isLoginRequest(request, response)) {
            return super.onAccessDenied(request, response);
        }else {

            throw new AbnormalException(CodeConstant.CLIENT_UNAUTHENTICATED.getMsg(), CodeConstant.CLIENT_UNAUTHENTICATED);
        }
    }

    @Override
    protected boolean onLoginFailure(AuthenticationToken token, AuthenticationException e, ServletRequest request, ServletResponse response) {

        throw new AbnormalException(CodeConstant.CLIENT_AUTHENTICATED_FAILURE.getMsg(), CodeConstant.CLIENT_AUTHENTICATED_FAILURE);

    }

    @Override
    protected boolean onLoginSuccess(AuthenticationToken token, Subject subject, ServletRequest request, ServletResponse response) throws Exception {


        return true;
    }

}