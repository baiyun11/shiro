package com.cn.global.common.entity;

import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.util.Date;

@Data
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public abstract class AuditEntity extends IdEntity {

    @CreatedBy
    private String createdSysUser;

    @CreatedDate
    private Date createdDate;

    @LastModifiedBy
    private String lastModifiedSysUser;

    @LastModifiedDate
    private Date lastModifiedDate;

    private boolean used = true;                                        // 可用标记（0：正常；1：删除；）
    private boolean deleted = false;                                        // 删除标记（0：正常；1：删除；）

}