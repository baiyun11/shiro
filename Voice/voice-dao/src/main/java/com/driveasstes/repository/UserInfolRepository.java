package com.driveasstes.repository;

import com.driveasstes.data.model.po.UserInfol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * @InterfaceName UserInfoRepository
 * @Description
 * @Author lin.tianwen
 * @Date 2019/9/11 12:09
 */
public interface UserInfolRepository extends
        JpaRepository<UserInfol, Integer>
        , JpaSpecificationExecutor<UserInfol> {
}
