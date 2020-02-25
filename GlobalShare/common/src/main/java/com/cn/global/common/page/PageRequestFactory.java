package com.cn.global.common.page;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

/**
 * @ClassName PageRequestFactory
 * @Description
 * @Author lin.tianwen
 * @Date 2018/8/15 14:56
 */
public class PageRequestFactory {
    public static PageRequest create(PageObject pageObject) {
        //排序条件
        Sort sort = null;
        if (pageObject.getProperty() == null) {
            try {
                //如果存在lastModifiedDate字段，则使用这个字段排序并默认倒序
                if (pageObject.getObject().getClass().getField("lastModifiedDate") != null) {
                    pageObject.setProperty("lastModifiedDate");
                }
                if (pageObject.getDirection() == null) {
                    pageObject.setDirection("DESC");
                }
            } catch (Exception e) {

            }
        }
        try {
            sort = new Sort(pageObject.getDirection(), pageObject.getProperty());
        } catch (Exception e) {

        }
        return new PageRequest(pageObject.getPage(), pageObject.getSize(), sort);
    }
}
