package com.cn.global.security.repository;

import com.cn.global.security.entity.SysUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;

public interface UrlRepository extends
        JpaRepository<SysUrl, Integer>
        , JpaSpecificationExecutor {




    SysUrl findByUrl(String s);


    @Modifying
    @Transactional
    @Query("update SysUrl set roles=?2 where id=?1")
    void updateRoles(Integer id, String roles);

    SysUrl findById(Integer id);

}
