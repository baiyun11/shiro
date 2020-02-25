package com.cn.global.security.entity;


import com.cn.global.common.entity.IdEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import java.util.Set;

@Entity
public class SysMethod extends IdEntity {

    private String name;

    private String apiOperation;

    @ManyToOne
    @JsonIgnoreProperties("sysMethodSet")
    private SysUrl sysUrl;

    @ManyToMany(fetch = FetchType.EAGER,mappedBy = "sysMethodSet")
    private Set<SysRole> sysRoleSet;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getApiOperation() {
        return apiOperation;
    }

    public void setApiOperation(String apiOperation) {
        this.apiOperation = apiOperation;
    }

    public SysUrl getSysUrl() {
        return sysUrl;
    }

    public void setSysUrl(SysUrl sysUrl) {
        this.sysUrl = sysUrl;
    }

    public Set<SysRole> getSysRoleSet() {
        return sysRoleSet;
    }

    public void setSysRoleSet(Set<SysRole> sysRoleSet) {
        this.sysRoleSet = sysRoleSet;
    }
}
