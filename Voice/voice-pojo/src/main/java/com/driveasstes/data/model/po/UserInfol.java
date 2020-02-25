package com.driveasstes.data.model.po;

import com.cn.global.common.entity.IdEntity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.OneToOne;

/**
 * @ClassName UserInfo
 * @Description
 * @Author lin.tianwen
 * @Date 2019/9/11 11:59
 */
@ApiModel(value = "用户信息")
@Entity
@Data
public class UserInfol extends IdEntity {

    @OneToOne
    @ApiModelProperty(value = "关联用户")
    private Userl userl;

    @ApiModelProperty(value = "用户昵称")
    private String userName;

    @ApiModelProperty(value = "性别")
    private String sex;

    @ApiModelProperty(value = "个性签名")
    private String signature;

    @ApiModelProperty(value = "用户头像")
    private String avator;

    @ApiModelProperty(value = "年龄")
    private Integer age;

    @ApiModelProperty(value = "地理位置")
    private String location;

    @ApiModelProperty(value = "视频数量")
    private Long videoSum;

    @ApiModelProperty(value = "关注人数")
    private Long follers;

    @ApiModelProperty(value = "粉丝数量")
    private Long fans;

}
