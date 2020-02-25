package com.cn.global.log.UserRequest.controller;


import com.cn.global.common.page.PageObject;
import com.cn.global.log.UserRequest.entity.SysUserRequestLog;
import com.cn.global.log.UserRequest.service.UserRequestLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("common/UserRequestLog")
public class UserRequestLogController {

    @Autowired
    UserRequestLogService userRequestLogService;

    @PostMapping("get")
    public Page<SysUserRequestLog> get(@RequestBody PageObject<SysUserRequestLog> pageObject) {

        Sort sort = new Sort(Sort.Direction.DESC,"commandTime");

        Pageable pageable = new PageRequest(pageObject.getPage() - 1 , pageObject.getSize(),sort);
        SysUserRequestLog sysUserRequestLog = pageObject.getObject();

        return userRequestLogService.findByUsername(sysUserRequestLog.getCommandUserName(), pageable);
    }
}
