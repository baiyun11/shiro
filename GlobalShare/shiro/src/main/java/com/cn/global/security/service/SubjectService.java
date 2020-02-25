package com.cn.global.security.service;

import com.cn.global.common.response.AbnormalException;
import com.cn.global.common.response.CodeConstant;
import com.cn.global.common.utils.UserHelper;
import com.cn.global.security.configuration.PasswordHelper;
import com.cn.global.security.configuration.SysAuthorizingRealm;
import com.cn.global.security.entity.SysUser;
import com.cn.global.security.entity.SysUserBo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

@Service
public class SubjectService {

    @Value("${project.name}")
    private String projectName;

    @Value("${project.version}")
    private String projectVersion;

    @Value("${project.packageTime}")
    private String packageTime;

    @Autowired
    private Environment environment;

    public SysUserBo login() {

        if (projectName == null || projectName.equals("")) {
            throw new AbnormalException("权限模块未读取到projectName", CodeConstant.PROJECT_INVALID_CONFIGURATION_PARAMETER);
        }

        if (projectVersion == null || projectVersion.equals("")) {
            throw new AbnormalException("权限模块未读取到projectVersion", CodeConstant.PROJECT_INVALID_CONFIGURATION_PARAMETER);
        }

        if (packageTime == null || packageTime.equals("")) {
            throw new AbnormalException("权限模块未读取到packageTime", CodeConstant.PROJECT_INVALID_CONFIGURATION_PARAMETER);
        }


        SysUser currentUser = UserHelper.getCurrentUser();

        String springProfilesActive;

        if (environment.getProperty("spring.profiles.active").equals("product"))
            springProfilesActive = "product";
        else if (environment.getProperty("spring.profiles.active").equals("test"))
            springProfilesActive = "test";
        else
            springProfilesActive = "development";

        String encodeHexStr = PasswordHelper.decryptPassword(currentUser.getPassword(), "123456");

        if (encodeHexStr.equals(currentUser.getPassword().substring(SysAuthorizingRealm.SALT_SIZE * 2)))
            return new SysUserBo(currentUser,
                    springProfilesActive,
                    true,
                    projectName,
                    projectVersion,
                    packageTime);
        else
            return new SysUserBo(currentUser,
                    springProfilesActive,
                    projectName,
                    projectVersion,
                    packageTime);
    }
}
