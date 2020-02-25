package com.cn.global.security.entity;


import com.cn.global.common.entity.AuditEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import java.util.List;

@Entity
public class SysUser extends AuditEntity {

    @Column(unique = true)
    private String username;//帐号

    private String password; //密码;

    private String name;

    @ManyToMany
    List<SysRole> sysRoleList;


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<SysRole> getSysRoleList() {
        return sysRoleList;
    }

    public void setSysRoleList(List<SysRole> sysRoleList) {
        this.sysRoleList = sysRoleList;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}