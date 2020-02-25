package com.driveasstes.service;

import com.driveasstes.data.model.po.UserInfol;
import com.driveasstes.repository.UserInfolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

/**
 * @ClassName UserInfoService
 * @Description
 * @Author lin.tianwen
 * @Date 2019/9/11 12:13
 */
@Service
public class UserInfo1Service {

    @Autowired
    UserInfolRepository userInfolRepository;

    public void save(UserInfol userInfol) {
        userInfolRepository.save(userInfol);
    }

    public UserInfol findByUser(UserInfol userInfol) {
        return userInfolRepository.findOne(Example.of(userInfol));
    }

}
