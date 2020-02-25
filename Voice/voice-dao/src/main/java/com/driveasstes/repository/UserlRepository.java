package com.driveasstes.repository;

import com.driveasstes.data.model.po.Userl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * @InterfaceName UserRepository
 * @Description
 * @Author lin.tianwen
 * @Date 2019/9/11 12:09
 */
public interface UserlRepository extends
        JpaRepository<Userl, String>
        , JpaSpecificationExecutor<Userl> {
}
