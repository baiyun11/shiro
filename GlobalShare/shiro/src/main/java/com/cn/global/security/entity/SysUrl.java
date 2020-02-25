package com.cn.global.security.entity;


import com.cn.global.common.entity.IdEntity;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.Set;


@Entity
public class SysUrl extends IdEntity {


    private String url;

    private String ApiTags;

    @OneToMany(mappedBy = "sysUrl")
    private Set<SysMethod> sysMethodSet;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getApiTags() {
        return ApiTags;
    }

    public void setApiTags(String apiTags) {
        ApiTags = apiTags;
    }

    public Set<SysMethod> getSysMethodSet() {
        return sysMethodSet;
    }

    public void setSysMethodSet(Set<SysMethod> sysMethodSet) {
        this.sysMethodSet = sysMethodSet;
    }
}
