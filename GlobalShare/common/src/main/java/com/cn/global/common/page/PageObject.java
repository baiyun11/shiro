package com.cn.global.common.page;

public class PageObject<T> extends PageNoObject {

    T object;

    public T getObject() {
        return object;
    }

    public void setObject(T object) {
        this.object = object;
    }
}
