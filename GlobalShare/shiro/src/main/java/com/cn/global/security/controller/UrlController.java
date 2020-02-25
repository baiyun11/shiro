package com.cn.global.security.controller;

import com.cn.global.security.entity.SysUrl;
import com.cn.global.security.service.UrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("sys/url")
public class UrlController {

    @Autowired
    UrlService urlService;

    @PostMapping("all")
    public List<SysUrl> all(){

        return urlService.findAll();

    }
}
