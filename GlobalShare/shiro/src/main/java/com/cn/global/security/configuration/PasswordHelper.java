package com.cn.global.security.configuration;

import com.cn.global.common.utils.Digests;
import com.cn.global.common.utils.Encodes;
import org.apache.shiro.codec.Hex;


public class PasswordHelper {
    /**
     * 生成安全的密码，生成随机的16位salt并经过1024次 sha-1 hash
     */
    public static String entryptPassword(String plainPassword) {

        byte[] salt = Digests.generateSalt(SysAuthorizingRealm.SALT_SIZE);
        byte[] hashPassword = Digests.sha1(plainPassword.getBytes(), salt, SysAuthorizingRealm.HASH_INTERATIONS);
        return Encodes.encodeHex(salt) + Encodes.encodeHex(hashPassword);
    }

    public static String decryptPassword(String password,String ciphertext) {

        byte[] salt = Hex.decode(password.substring(0, SysAuthorizingRealm.SALT_SIZE*2));
        byte[] hashPassword = Digests.sha1(ciphertext.getBytes(), salt, SysAuthorizingRealm.HASH_INTERATIONS);
        return Encodes.encodeHex(hashPassword);
    }

}
