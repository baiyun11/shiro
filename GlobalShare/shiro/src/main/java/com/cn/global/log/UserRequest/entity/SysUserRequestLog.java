package com.cn.global.log.UserRequest.entity;


import com.cn.global.common.entity.IdEntity;

import javax.persistence.Entity;
import java.util.Date;

@Entity
public class SysUserRequestLog extends IdEntity {

    private String commandName;
    private Date commandTime;
    private String commandUserName;
    private String ipAddress;

    private String param;

    private SysUserRequestStatusEnum sysUserRequestStatus;

    public String getParam() {
        return param;
    }

    public void setParam(String param) {
        this.param = param;
    }

    public String getCommandName() {
        return commandName;
    }

    public void setCommandName(String commandName) {
        this.commandName = commandName;
    }

    public Date getCommandTime() {
        return commandTime;
    }

    public void setCommandTime(Date commandTime) {
        this.commandTime = commandTime;
    }

    public String getCommandUserName() {
        return commandUserName;
    }

    public void setCommandUserName(String commandUserName) {
        this.commandUserName = commandUserName;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public SysUserRequestStatusEnum getSysUserRequestStatus() {
        return sysUserRequestStatus;
    }

    public void setSysUserRequestStatus(SysUserRequestStatusEnum sysUserRequestStatus) {
        this.sysUserRequestStatus = sysUserRequestStatus;
    }
}