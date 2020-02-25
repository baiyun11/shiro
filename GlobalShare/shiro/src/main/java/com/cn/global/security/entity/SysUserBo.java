package com.cn.global.security.entity;

import com.cn.global.common.entity.IdEntity;
import lombok.Data;

@Data
public class SysUserBo extends IdEntity {


    private String username;//帐号

    private String name;

    private String springProfilesActiveEnum;

    private boolean resetRootPassword;

    private String projectName;

    private String projectVersion;

    private String packageTime;

    public SysUserBo(SysUser sysUser,
                     String springProfilesActiveEnum,
                     boolean resetRootPassword,
                     String projectName,
                     String projectVersion,
                     String packageTime){
        this.setId(sysUser.getId());
        this.username = sysUser.getUsername();
        this.name = sysUser.getName();
        this.springProfilesActiveEnum = springProfilesActiveEnum;
        this.resetRootPassword = resetRootPassword;
        this.projectName = projectName;
        this.projectVersion = projectVersion;
        this.packageTime = packageTime;
    }

    public SysUserBo(SysUser sysUser,
                     String springProfilesActiveEnum,
                     String projectName,
                     String projectVersion,
                     String packageTime){
        this.setId(sysUser.getId());
        this.username = sysUser.getUsername();
        this.name = sysUser.getName();
        this.springProfilesActiveEnum = springProfilesActiveEnum;
        this.projectName = projectName;
        this.projectVersion = projectVersion;
        this.packageTime = packageTime;

    }


}
