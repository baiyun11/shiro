package com.cn.global.common.data.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.persistence.MappedSuperclass;

@Data
@MappedSuperclass
@ApiModel("配置基础类")
public abstract class BaseConfig extends Auditor {

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("配置值")
    private String value;

    @ApiModelProperty("描述")
    private String description;

    @ApiModelProperty("分类")
    private String groupName;

    @ApiModelProperty("配置值的类型")
    private GlobalValueType valueType;
}
