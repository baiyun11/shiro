package com.cn.global.security.listener;

import com.cn.global.security.configuration.ShiroFilerChainManager;
import com.cn.global.security.entity.SysMethod;
import com.cn.global.security.entity.SysRole;
import com.cn.global.security.entity.SysUrl;
import com.cn.global.security.entity.SysUser;
import com.cn.global.security.repository.MethodRepository;
import com.cn.global.security.repository.RoleRepository;
import com.cn.global.security.repository.UrlRepository;
import com.cn.global.security.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class SysInitListener implements ServletContextListener {

    private static final String defaultPassword = "123456";
    private static final String[] roleInName = {SysRole.RootRoleInName,SysRole.FeatureRoleInName};
    private static final String[] roleOutName = {"超级管理员","功能管理员"};

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserService userService;

    @Autowired
    RequestMappingHandlerMapping handlerMapping;

    @Autowired
    UrlRepository urlRepository;

    @Autowired
    MethodRepository methodRepository;

    @Autowired
    ShiroFilerChainManager shiroFilerChainManager;

    @Override
    public void contextInitialized(ServletContextEvent sce) {

        try {

            logger.info("正在初始化超级管理员角色...");

            /**
             * 自动注册超级管理员角色
             */

            List<SysRole> sysRoleList = new ArrayList<>();

            for(int i = 0 ; i < roleInName.length ; i ++ ){

                SysRole sysRole = roleRepository.findByInName(roleInName[i]);

                if(sysRole == null){

                    sysRole = new SysRole();
                    sysRole.setInName(roleInName[i]);
                    sysRole.setOutName(roleOutName[i]);
                    roleRepository.save(sysRole);

                }

                if (roleInName[i].equals("superAdmin"))
                    sysRoleList.add(sysRole);

            }

            logger.info("正在初始化超级管理员用户...");

            /**
             * 自动注册超级管理员
             */

            SysUser rootUser = userService.findByUsername(roleInName[0]);

            if(rootUser == null){

                rootUser = new SysUser();
                rootUser.setUsername(roleInName[0]);
                rootUser.setPassword(defaultPassword);
                rootUser.setName(roleOutName[0]);
                rootUser.setSysRoleList(sysRoleList);

                userService.insertOrChangePassword(rootUser);

            }

            /*
             *   自动扫描存在@RequestMappping的接口
             *
             * */

            Map<String, Object> map = handlerMapping.getApplicationContext().getBeansWithAnnotation(RequestMapping.class);

            //Map<String, Object> apiMap = handlerMapping.getApplicationContext().getBeansWithAnnotation(Api.class);

            for(int i = 0 ; i < map.size() ; i++){

                String str = map.get(map.keySet().toArray()[i]).toString().split("@")[0];

                Class<?> clazz = Class.forName(str);

                /*
                *   如果存在筛选出url存到数据库中
                *
                * */

                // 判断该类中是否存在@RequestMapping 注解
                // 如果有继续，没有就结束本次循环
                if(!clazz.isAnnotationPresent(RequestMapping.class)){
                    continue;
                }

                String[] val = clazz.getAnnotation(RequestMapping.class).value();

                if(val[0].matches("^sys.*") || val[0].contains("swagger")){
                    continue;
                }

                SysUrl sysUrl = urlRepository.findByUrl(val[0]);

                // 判断该url是否已经存在数据库中
                // 如果不存在继续，存在就结束本次循环
                if (sysUrl == null){

                    sysUrl = new SysUrl();

                }

                sysUrl.setUrl(val[0]);

                // 判断该类中是否存在@Api 注解
                // 如果有找到@Api中tags值放到setApiTags()中，
                // 没有就将找到的类名放到setApiTags()中
                if (clazz.isAnnotationPresent(Api.class)){

                    String[] apiVal = clazz.getDeclaredAnnotation(Api.class).tags();

                    sysUrl.setApiTags(apiVal[0]);
                }else{

                    sysUrl.setApiTags("");
                }

                urlRepository.save(sysUrl);

                Method[] methods = clazz.getDeclaredMethods();

                for (Method method : methods) {

                    PostMapping postRequestMothed = method.getAnnotation(PostMapping.class);

                    if (postRequestMothed == null){
                        continue;
                    }

                    String[] value3 = postRequestMothed.value();

                    SysMethod sysMethod = methodRepository.findByNameAndSysUrl(value3[0], sysUrl);

                    if(sysMethod == null){

                        sysMethod = new SysMethod();

                    }

                    sysMethod.setName(value3[0]);

                    if( method.getAnnotation(ApiOperation.class) != null ){

                        sysMethod.setApiOperation(method.getAnnotation(ApiOperation.class).value());
                    }


                    sysMethod.setSysUrl(sysUrl);

                    methodRepository.save(sysMethod);

                }
            }

            shiroFilerChainManager.initFilterChains();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {

    }
}