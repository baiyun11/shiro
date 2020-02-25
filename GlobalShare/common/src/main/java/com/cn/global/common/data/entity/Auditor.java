package com.cn.global.common.data.entity;

import com.cn.global.common.entity.IdEntity;
import io.swagger.annotations.ApiModelProperty;
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
public abstract class Auditor extends IdEntity {

    @CreatedBy
    @ApiModelProperty("创建者")
    private String createdBy;

    @CreatedDate
    @ApiModelProperty("创建时间")
    private Date createdDate;

    @LastModifiedBy
    @ApiModelProperty("更新者")
    private String lastModifiedBy;

    @LastModifiedDate
    @ApiModelProperty("更新时间")
    public Date lastModifiedDate;

    @ApiModelProperty("状态")
    private AuditorStatus status;
}