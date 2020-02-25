package com.cn.global.security.service;

import com.cn.global.security.configuration.ShiroFilerChainManager;
import com.cn.global.security.entity.SysUrl;
import com.cn.global.security.repository.RoleRepository;
import com.cn.global.security.repository.UrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UrlService {

    @Autowired
    private ShiroFilerChainManager shiroFilerChainManager;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UrlRepository urlRepository;


    public void updateUrlFilter() {

        initFilterChain();

    }

    public synchronized void initFilterChain() {

        shiroFilerChainManager.initFilterChains();

    }

    public List<SysUrl> findAll() {

        Sort sort = new Sort(Sort.Direction.ASC, "id");
        List<SysUrl> sysUrlList = urlRepository.findAll(sort);

        return sysUrlList;
    }
}
