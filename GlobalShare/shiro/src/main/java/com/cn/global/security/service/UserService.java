package com.cn.global.security.service;

import com.cn.global.common.response.AbnormalException;
import com.cn.global.common.response.CodeConstant;
import com.cn.global.common.utils.UserHelper;
import com.cn.global.security.configuration.PasswordHelper;
import com.cn.global.security.entity.SysRole;
import com.cn.global.security.entity.SysUser;
import com.cn.global.security.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;
    
    private  final Logger logger = LoggerFactory.getLogger(Logger.class);

    @Transactional
    public SysUser findByUsernameAndDeleted(String username, boolean deleted) {

        SysUser sysUser = userRepository.findByUsernameAndDeleted(username, deleted);
        if (sysUser != null) {

            //sysUser.setPassword(null);
            int roleListSize = sysUser.getSysRoleList().size();
            ++roleListSize;
        }
        return sysUser;
    }


    @Transactional
    public SysUser findByUsername(String username) {
    	
        return findByUsernameAndDeleted(username, false);
    }

    public Page<SysUser> findAll(Pageable pageable) {
        Page<SysUser> sysUserPage = userRepository.findByDeleted(false, pageable);
        for (SysUser sysUser : sysUserPage.getContent()) {

            //sysUser.setPassword(null);
        }

        return sysUserPage;
    }

    public SysUser findOne(Integer integer) {

        SysUser sysUser = userRepository.findOne(integer);
        
        return sysUser;
    }

    public void insertOrChangePassword(SysUser sysUser) {
    	
    	//logger.info(sysUser.getSysRoleList().toString());

        if (sysUser.getId() != null){

            if (sysUser.getId() == 1){
                throw new AbnormalException("不能修改该用户", CodeConstant.CLIENT_INVALID_SIGNATURE);
            }

        }

        sysUser.setPassword(PasswordHelper.entryptPassword(sysUser.getPassword()));

        SysUser user = userRepository.findByUsername(sysUser.getUsername());

        if (user != null) {

            userRepository.resetUser(user.getId(), sysUser.getName(), PasswordHelper.entryptPassword(sysUser.getPassword()));
        } else {

            userRepository.save(sysUser);
        }
    }

    @Modifying
    @Transactional
    public SysUser update(SysUser sysUser) {
        logger.error(sysUser.getCreatedSysUser());


        if (sysUser.getId() != null){

            if (sysUser.getId() == 1){
                throw new AbnormalException("不能修改该用户", CodeConstant.CLIENT_INVALID_SIGNATURE);
            }

        }

        return userRepository.save(sysUser);
    }


    public void delete(SysUser sysUser) {

        if (sysUser.getUsername().equals(SysRole.RootRoleInName)) {
            throw new AbnormalException(CodeConstant.SERVER_SQL_ACCESS_FAIL.getMsg(), CodeConstant.SERVER_SQL_ACCESS_FAIL);
        }

        if (sysUser.getId() == 1){
            throw new AbnormalException("不能删除该用户", CodeConstant.CLIENT_INVALID_PARAMETER);
        }

        userRepository.delete(sysUser.getId());
    }

    @Transactional
    public void resetPassword(SysUser sysUser) {
    	userRepository.resetPassword(sysUser.getId(), sysUser.getPassword());
    }


	public void updateCurrentUserInfo(SysUser sysUser) {
		
		SysUser sysUserOld = UserHelper.getCurrentUser();
		
		if(sysUser.getPassword() != sysUserOld.getPassword())
			sysUser.setPassword(PasswordHelper.entryptPassword(sysUser.getPassword()));
			
		userRepository.updateCurrentUserInfo(sysUser.getId(),sysUser.getName(),sysUser.getUsername(),sysUser.getPassword());
		
		
		

	}
}
