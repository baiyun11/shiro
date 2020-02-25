package com.cn.global.common.page;

import org.springframework.data.domain.Sort;

public class PageNoObject {
    private int page;
    private int size;

    private String property; //排序字段

    private Sort.Direction direction; //排序方式 DESC ASC

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public Sort.Direction getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        if (direction.equals(Sort.Direction.ASC.toString())){
            this.direction = Sort.Direction.ASC;
        }
        if (direction.equals(Sort.Direction.DESC.toString())){
            this.direction = Sort.Direction.DESC;
        }
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

}
