package com.cn.global.security.repository;


import com.cn.global.security.entity.SysMethod;
import com.cn.global.security.entity.SysUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MethodRepository extends
        JpaRepository<SysMethod, Integer>
        , JpaSpecificationExecutor {

    SysMethod findByName(String s);

    SysMethod findByNameAndSysUrl(String s, SysUrl sysUrl);
}
