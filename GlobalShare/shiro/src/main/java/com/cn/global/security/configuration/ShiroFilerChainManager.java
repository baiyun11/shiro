package com.cn.global.security.configuration;

import com.cn.global.security.entity.SysMethod;
import com.cn.global.security.entity.SysRole;
import com.cn.global.security.repository.MethodRepository;
import com.cn.global.security.repository.RoleRepository;
import com.cn.global.security.repository.UrlRepository;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.filter.mgt.DefaultFilterChainManager;
import org.apache.shiro.web.filter.mgt.PathMatchingFilterChainResolver;
import org.apache.shiro.web.servlet.AbstractShiroFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class ShiroFilerChainManager {

    @Resource
    private ShiroFilterFactoryBean shiroFilterFactoryBean;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UrlRepository urlRepository;

    @Autowired
    MethodRepository methodRepository;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    public synchronized void initFilterChains() {

        try {

            AbstractShiroFilter shiroFilter = (AbstractShiroFilter) shiroFilterFactoryBean.getObject();

            PathMatchingFilterChainResolver filterChainResolver = (PathMatchingFilterChainResolver)
                    shiroFilter.getFilterChainResolver();

            DefaultFilterChainManager manager = (DefaultFilterChainManager) filterChainResolver
                    .getFilterChainManager();

            // 重新构建生成
            Map<String, String> chains = shiroFilterFactoryBean.getFilterChainDefinitionMap();

            Sort sort = new Sort(Sort.Direction.ASC,"id");

            List<SysMethod> sysMethodList = methodRepository.findAll(sort);

            for (SysMethod sysMethod: sysMethodList) {

                String url = sysMethod.getSysUrl().getUrl() + "/" + sysMethod.getName();

                String roles = SysRole.RootRoleInName;

                if(!url.equals("sys/subject"))
                    roles += "," + SysRole.FeatureRoleInName;

                for(SysRole sysRole: sysMethod.getSysRoleSet()){

                    roles += "," + sysRole.getInName();

                }

                chains.put( "/" + url , "authc,hasAnyRoles[" + roles + "]");


            }

            chains.put("/**","authc,roles[" + SysRole.RootRoleInName +"]");

            for (Map.Entry<String, String> entry : chains.entrySet()) {
                String url = entry.getKey();

                String chainDefinition = entry.getValue().trim().replace(" ", "");
                logger.info(url+ " , " + chainDefinition);
                manager.createChain(url, chainDefinition);
            }


        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
