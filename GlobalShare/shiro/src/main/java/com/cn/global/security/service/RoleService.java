package com.cn.global.security.service;

import com.cn.global.common.page.PageNoObject;
import com.cn.global.security.entity.SysRole;
import com.cn.global.security.repository.RoleRepository;
import com.cn.global.security.repository.UrlRepository;
import com.cn.global.security.util.PinYinUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;


@Service
public class RoleService {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UrlRepository urlRepository;

    @Autowired
    UrlService urlService;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Transactional
    public void save(SysRole sysRole){

        PinYinUtil pinYinUtil = new PinYinUtil();

        sysRole.setInName(pinYinUtil.ToPinyin(sysRole.getInName()));

        roleRepository.save(sysRole);

    }

    public Page<SysRole> select(PageNoObject pageNoObject){

        Pageable pageable = new PageRequest(pageNoObject.getPage()-1 , pageNoObject.getSize());

        return roleRepository.findAll(pageable);

    }

}
