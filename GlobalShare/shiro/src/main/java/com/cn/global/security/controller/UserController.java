package com.cn.global.security.controller;


import com.cn.global.common.page.PageNoObject;
import com.cn.global.common.response.AbnormalException;
import com.cn.global.common.response.CodeConstant;
import com.cn.global.common.utils.UserHelper;
import com.cn.global.security.configuration.PasswordHelper;
import com.cn.global.security.entity.SysUser;
import com.cn.global.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;

@RestController
@RequestMapping("sys/user")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("insert")
    public void insert(@RequestBody SysUser sysUser) {
    	
        userService.insertOrChangePassword(sysUser);
    }
    @PostMapping("update")
    public void update(@RequestBody SysUser sysUser) {

        userService.update(sysUser);
    }


    @PostMapping("delete")
    public void delete(@RequestBody SysUser sysUser) {
        userService.delete(sysUser);
    }

    @PostMapping("select")
    public Page<SysUser> select(@RequestBody PageNoObject pageObject) {

        Pageable pageable = new PageRequest(pageObject.getPage()-1, pageObject.getSize());

        return userService.findAll(pageable);
    }


    @PostMapping("getOne")
    public SysUser getOne(@RequestBody SysUser sysUser) {
        return userService.findOne(sysUser.getId());
    }

    @PostMapping("updatePassword")
    @Transactional
    public String updatePassword(@RequestBody SysUser sysUser) {

        SysUser sysUserOld = UserHelper.getCurrentUser();

        if (sysUserOld.getId() == sysUser.getId()) {

            if (sysUserOld.getPassword()
                    == PasswordHelper.entryptPassword(sysUser.getUsername())) {

                sysUserOld.setPassword(sysUser.getPassword());
                userService.insertOrChangePassword(sysUserOld);

                return "updatePassword OK!";
            }
        }

        throw new AbnormalException(CodeConstant.CLIENT_REQUEST_REFUSED);
    }

    @PostMapping("resetPassword")
    @Transactional
    public void resetPassword(@RequestBody SysUser sysUser) {
        sysUser.setPassword(PasswordHelper.entryptPassword("123456"));
        userService.resetPassword(sysUser);
    }

}
