package com.driveasstes.service;

import com.cn.global.common.response.AbnormalException;
import com.cn.global.common.response.CodeConstant;
import com.driveasstes.data.model.po.Userl;
import com.driveasstes.repository.UserlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @ClassName UserService
 * @Description
 * @Author lin.tianwen
 * @Date 2019/9/11 12:12
 */
@Service
public class User1Service {

    @Autowired
    UserlRepository userlRepository;

    public void createDemoUser(Userl userl) {
        //  如果账户存在
        if (userlRepository.exists(userl.getAccount())) {
            throw new AbnormalException("账号已存在！", CodeConstant.CLIENT_INVALID_PARAMETER);
        }
        userlRepository.save(userl);
    }

    public Userl findOne(String account) {
        return userlRepository.findOne(account);
    }

    public void save(Userl userl) {
        userlRepository.save(userl);
    }
}
