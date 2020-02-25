package com.cn.global.security.configuration;

import com.cn.global.common.response.AbnormalException;
import com.cn.global.common.response.CodeConstant;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authz.RolesAuthorizationFilter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.IOException;

public class SysRolesAuthorizationFilter extends RolesAuthorizationFilter {

    @Override
    public boolean isAccessAllowed(ServletRequest request, ServletResponse response,

                                   Object mappedValue) throws IOException {


        final Subject subject = getSubject(request, response);

        final String[] rolesArray = (String[]) mappedValue;


        if (rolesArray == null || rolesArray.length == 0) {

            //no roles specified, so nothing to check - allow access.

            return true;

        }


        for (String roleName : rolesArray) {

            if (subject.hasRole(roleName)) {

                return true;

            }

        }

        throw new AbnormalException(CodeConstant.CLIENT_UNAUTHORIZATED.getMsg(), CodeConstant.CLIENT_UNAUTHORIZATED);
        //throw new AbnormalException(CodeConstant.UNAUTHENTICATED.getMsg(),CodeConstant.UNAUTHENTICATED);

    }
}
