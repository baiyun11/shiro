package com.cn.global.security.configuration;


import com.cn.global.log.UserRequest.interceptor.HttpServletRequestReplacedFilter;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.DelegatingFilterProxy;

import java.util.LinkedHashMap;
import java.util.Map;

@Configuration
public class ShiroConfiguration {

    private Map<String, String> getfilterChainDefinitionMap() {

        Map<String, String> filterChainDefinitionMap = new LinkedHashMap<>();
        filterChainDefinitionMap.put("/shiro/view/**", "anon");
        filterChainDefinitionMap.put("/view/**", "anon");
        filterChainDefinitionMap.put("/index.html", "anon");
        filterChainDefinitionMap.put("/", "anon");
        filterChainDefinitionMap.put("/error/**", "anon");
        filterChainDefinitionMap.put("/sys/subject/login", "authc");
        filterChainDefinitionMap.put("/sys/subject/logout", "logout");
        filterChainDefinitionMap.put("/sys/subject/**", "anon");

        // swagger 资源开放
        filterChainDefinitionMap.put("/v2/**", "anon");
        filterChainDefinitionMap.put("/webjars/**", "anon");
        filterChainDefinitionMap.put("/swagger-ui.html", "anon");
        filterChainDefinitionMap.put("/swagger-resources/**", "anon");
        filterChainDefinitionMap.put("/csrf", "anon");

        return filterChainDefinitionMap;
    }


    SysFormAuthenticationFilter sysFormAuthenticationFilter = new SysFormAuthenticationFilter();
    SysLogoutFilter sysLogoutFilter = new SysLogoutFilter();
    SysRolesAuthorizationFilter sysRolesAuthorizationFilter = new SysRolesAuthorizationFilter();

    private void setFilters(ShiroFilterFactoryBean shiroFilterFactoryBean) {

        /*
        FormAuthenticationFilter::pathsMatch(this.getLoginUrl(), request)
         */
        shiroFilterFactoryBean.setLoginUrl("/sys/subject/login");
        shiroFilterFactoryBean.getFilters().put("authc", sysFormAuthenticationFilter);

        shiroFilterFactoryBean.getFilters().put("logout", sysLogoutFilter);

        shiroFilterFactoryBean.getFilters().put("hasAnyRoles",sysRolesAuthorizationFilter);
    }

    //权限管理，配置主要是Realm的管理认证
    @Bean
    public SecurityManager securityManager(SysAuthorizingRealm myShiroRealm) {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        securityManager.setRealm(myShiroRealm);
        return securityManager;
    }

    //Filter工厂，设置对应的过滤条件和跳转条件
    @Bean("shiroFilter")
    public ShiroFilterFactoryBean shiroFilterFactoryBean(SecurityManager securityManager) {

        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();

        setFilters(shiroFilterFactoryBean);

        shiroFilterFactoryBean.setFilterChainDefinitionMap(getfilterChainDefinitionMap());

        shiroFilterFactoryBean.setSecurityManager(securityManager);

        return shiroFilterFactoryBean;
    }


    @Bean
    public FilterRegistrationBean delegatingFilterProxy() {

        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();
        DelegatingFilterProxy proxy = new DelegatingFilterProxy();
        proxy.setTargetFilterLifecycle(true);
        proxy.setTargetBeanName("shiroFilter");
        filterRegistrationBean.setFilter(proxy);
        return filterRegistrationBean;
    }

    //加入注解的使用，不加入这个注解不生效
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(SecurityManager securityManager) {

        AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(securityManager);
        return authorizationAttributeSourceAdvisor;
    }

    //获取日志请求body拦截器
    @Bean
    public FilterRegistrationBean httpServletRequestReplacedRegistration() {

        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(new HttpServletRequestReplacedFilter());
        registration.addUrlPatterns("/*");
        registration.addInitParameter("paramName", "paramValue");
        registration.setName("httpServletRequestReplacedFilter");
        registration.setOrder(1);
        return registration;
    }
}