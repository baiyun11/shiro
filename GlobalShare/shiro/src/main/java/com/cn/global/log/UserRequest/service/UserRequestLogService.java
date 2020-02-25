package com.cn.global.log.UserRequest.service;


import com.cn.global.log.UserRequest.entity.SysUserRequestLog;
import com.cn.global.log.UserRequest.repository.UserRequestLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class UserRequestLogService {

    @Autowired
    UserRequestLogRepository userRequestLogRepository;

    @Async
    public SysUserRequestLog insert(SysUserRequestLog sysUserRequestLog) {

        return userRequestLogRepository.save(sysUserRequestLog);
    }

    public Page<SysUserRequestLog> findByUsername(String username, Pageable pageable) {

        return userRequestLogRepository.findByCommandUserName(username, pageable);
    }
}
