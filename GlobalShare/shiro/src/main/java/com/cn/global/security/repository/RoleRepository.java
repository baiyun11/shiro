package com.cn.global.security.repository;

import com.cn.global.security.entity.SysRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RoleRepository extends
        JpaRepository<SysRole, Integer>
        , JpaSpecificationExecutor {

    SysRole findByInName(String inName);
}
