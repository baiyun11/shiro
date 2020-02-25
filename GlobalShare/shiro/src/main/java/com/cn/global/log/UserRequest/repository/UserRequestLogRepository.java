package com.cn.global.log.UserRequest.repository;

import com.cn.global.log.UserRequest.entity.SysUserRequestLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface UserRequestLogRepository extends
        JpaRepository<SysUserRequestLog, Integer>
        , JpaSpecificationExecutor {

    Page<SysUserRequestLog> findByCommandUserName(String username, Pageable pageable);
}
