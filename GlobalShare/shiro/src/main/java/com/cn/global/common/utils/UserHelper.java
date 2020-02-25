package com.cn.global.common.utils;

import com.cn.global.security.entity.SysUser;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.UnavailableSecurityManagerException;
import org.apache.shiro.subject.Subject;

public class UserHelper {


    public static SysUser getCurrentUser() {

        try {

            Subject subject = SecurityUtils.getSubject();
            Object object = subject.getPrincipal();
            return (SysUser) object;
        } catch (UnavailableSecurityManagerException e) {

        }

        return null;
    }


    public static String  getCurrentUserName() {

        SysUser sysUser = getCurrentUser();

        return (null != sysUser) ? sysUser.getUsername() : "system";
    }

}