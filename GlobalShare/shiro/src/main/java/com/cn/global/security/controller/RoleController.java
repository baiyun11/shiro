package com.cn.global.security.controller;

import com.cn.global.common.page.PageNoObject;
import com.cn.global.security.entity.SysRole;
import com.cn.global.security.repository.RoleRepository;
import com.cn.global.security.service.RoleService;
import com.cn.global.security.service.UrlService;
import org.hibernate.Session;
import org.hibernate.jpa.HibernateEntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;


@RestController
@RequestMapping("sys/role")
public class RoleController {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    RoleService roleService;

    @Autowired
    UrlService urlService;

    @PersistenceContext
    private EntityManager entityManager;

    @PostMapping("selectByPage")
    public Page<SysRole> selectByPage(@RequestBody PageNoObject pageNoObject) {

        return roleService.select(pageNoObject);
    }

    @PostMapping("select")
    public List<SysRole> select() {

        return roleRepository.findAll();
    }

    @PostMapping("findOne")
    public SysRole findOne(@RequestBody SysRole sysRole) {

        return roleRepository.findOne(sysRole.getId());
    }

    @PostMapping("add")
    public void add(@RequestBody SysRole sysRole) {

        roleService.save(sysRole);

        urlService.updateUrlFilter();

    }

    @PostMapping("delete")
    public void delete(@RequestBody SysRole sysRole) {

        roleRepository.delete(sysRole.getId());

        urlService.updateUrlFilter();
    }

    @PostMapping("edit")
    public void edit(@RequestBody SysRole sysRole) {

        roleService.save(sysRole);

        HibernateEntityManager hEntityManager = (HibernateEntityManager) entityManager;

        Session session = hEntityManager.getSession();

        session.clear();

        urlService.updateUrlFilter();

    }

}
