package com.cn.global.security.repository;


import com.cn.global.security.entity.SysUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;

public interface UserRepository extends
        JpaRepository<SysUser, Integer>
        , JpaSpecificationExecutor {

//    SysUser findByUsername(String username);

    SysUser findByUsernameAndDeleted(String username, boolean deleted);

    Page<SysUser> findByDeleted(boolean deleted, Pageable pageable);


    @Modifying
    @Transactional
    @Query("update SysUser set deleted=true where id=?1")
    void delete(Integer id);
    
    @Modifying
    @Transactional
    @Query("update SysUser set password=?2 where id=?1")
    void resetPassword(Integer id, String password);

    
    @Modifying
    @Transactional
    @Query("update SysUser set name=?2,username=?3,password=?4 where id=?1")
	void updateCurrentUserInfo(Integer id, String name, String username, String password);

    @Modifying
    @Transactional
    @Query("update SysUser set deleted=false, name=?2, password=?3 where id=?1")
    void resetUser(Integer b, String name, String password);

    SysUser findByUsername(String username);
}
