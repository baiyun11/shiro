package com.cn.global.security.entity;


import com.cn.global.common.entity.AuditEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import java.util.Set;


@Entity
public class SysRole extends AuditEntity {

    public static final String RootRoleInName = "superAdmin";
    public static final String FeatureRoleInName = "featureAdmin";


    @Column(unique = true)
    private String inName;

    private String outName;

    @ManyToMany(fetch= FetchType.EAGER)
    @JsonIgnoreProperties(value = { "sysRoleSet" })
    private Set<SysMethod> sysMethodSet;

    public Set<SysMethod> getSysMethodSet() {
        return sysMethodSet;
    }

    public void setSysMethodSet(Set<SysMethod> sysMethodSet) {
        this.sysMethodSet = sysMethodSet;
    }

    public String getInName() {
        return inName;
    }

    public void setInName(String inName) {
        this.inName = inName;
    }

    public String getOutName() {
        return outName;
    }

    public void setOutName(String outName) {
        this.outName = outName;
    }
}