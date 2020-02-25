package com.cn.global.common.entity;

import javax.persistence.MappedSuperclass;
import java.io.Serializable;

@MappedSuperclass
public abstract class NameEntity implements Serializable {

    private static final long serialVersionUID = -2736414933996725173L;

    private String name;//主键

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
