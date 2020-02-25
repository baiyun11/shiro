package com.cn.global.common.entity;

import lombok.Data;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.util.Date;

/**
 * @ClassName LastModifiedEntity
 * @Description 带id的更新时间和更新名
 * @Author lin.tianwen
 * @Date 2018/8/9 13:49
 */
@Data
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class LastModifiedEntity extends IdEntity {

    @LastModifiedBy
    private String lastModifiedSysUser;

    @LastModifiedDate
    public Date lastModifiedDate;

}
