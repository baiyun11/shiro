package com.cn.global.security.controller;

import com.cn.global.common.utils.UserHelper;
import com.cn.global.security.entity.SysUser;
import com.cn.global.security.entity.SysUserBo;
import com.cn.global.security.service.SubjectService;
import com.cn.global.security.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;

@RestController
@RequestMapping("sys/subject")
public class SubjectController {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    UserService userService;

    @Autowired
    SubjectService subjectService;


    @PostMapping("login")
    @Transactional
    public SysUserBo login() {

        return subjectService.login();
    }

    @PostMapping("logout")
    @Transactional
    public String logout() {

        return "logout OK!";
    }




    @PostMapping("getCurrentUserInfo")
    public SysUser getCurrentUserInfo() {

        SysUser sysUser = UserHelper.getCurrentUser();

        return userService.findOne(sysUser.getId());
    }

    @PostMapping("updateCurrentUserInfo")
    public void updateCurrentUserInfo(@RequestBody SysUser sysUser) {
        userService.updateCurrentUserInfo(sysUser);
    }

}
