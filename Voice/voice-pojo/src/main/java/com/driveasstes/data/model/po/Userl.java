package com.driveasstes.data.model.po;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * @ClassName User
 * @Description
 * @Author lin.tianwen
 * @Date 2019/9/11 11:53
 */
@ApiModel(value = "用户")
@Entity
@Data
public class Userl {

    @Id
    @ApiModelProperty(value = "号码或者三方的openId")
    private String account;

    @ApiModelProperty(value = "密码")
    private String  password;

}
