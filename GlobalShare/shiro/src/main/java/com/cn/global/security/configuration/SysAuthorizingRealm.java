package com.cn.global.security.configuration;


import com.cn.global.common.utils.Encodes;
import com.cn.global.security.entity.SysRole;
import com.cn.global.security.entity.SysUser;
import com.cn.global.security.service.UserService;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;

/**
 * 系统安全认证实现类
 */
@Service
public class SysAuthorizingRealm extends AuthorizingRealm {

    public static final String HASH_ALGORITHM = "SHA-1";
    public static final int HASH_INTERATIONS = 1;
    public static final int SALT_SIZE = 8;

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    UserService userService;

    /**
     * 认证回调函数, 登录时调用
     */
    @Override
//    @Transactional
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) {

        String username = (String) token.getPrincipal(); //得到用户名

        logger.info("doGetAuthenticationInfo sysUser: {}", username);

        // 校验用户名密码
        SysUser sysUser = userService.findByUsername(username);
        if (sysUser != null) {

            byte[] salt = Encodes.decodeHex(sysUser.getPassword().substring(0, SALT_SIZE * 2));

//            int roleListSize=sysUser.getSysRoleList().size();
//            ++roleListSize;

            return new SimpleAuthenticationInfo(sysUser,
                    sysUser.getPassword().substring(SALT_SIZE * 2),
                    ByteSource.Util.bytes(salt),
//                    sysUser.getPassword(),
//                    null,
                    getName());
        } else {
            return null;
        }
    }

    /**
     * 授权查询回调函数, 进行鉴权但缓存中无用户的授权信息时调用
     */
    @Override
    @Transactional
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {

        SysUser sysUser = (SysUser) principals.getPrimaryPrincipal(); //得到用户名
        String username = sysUser.getUsername();
        logger.info("doGetAuthenticationInfo sysUser: {}", username);

        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        for (SysRole sysRole : sysUser.getSysRoleList()) {
            authorizationInfo.addRole(sysRole.getInName());
        }
        logger.debug("authorizationInfo: {}", authorizationInfo);

        return authorizationInfo;
    }

    /**
     * 设定密码校验的Hash算法与迭代次数
     */
    @PostConstruct
    public void initCredentialsMatcher() {

        HashedCredentialsMatcher matcher = new HashedCredentialsMatcher();

        matcher.setHashAlgorithmName(SysAuthorizingRealm.HASH_ALGORITHM);
        matcher.setHashIterations(HASH_INTERATIONS);

        matcher.setHashSalted(true);
        matcher.setStoredCredentialsHexEncoded(true);

        setCredentialsMatcher(matcher);
    }
}
