package com.cn.global.common.data.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel("配置状态")
public enum AuditorStatus {

    @ApiModelProperty("未上线/未发布")
    UNCOMMIT,

    @ApiModelProperty("上线")
    ONLINE,

    @ApiModelProperty("锁定/下线")
    OFFLINE,

    @ApiModelProperty("删除")
    DELETE,
}
