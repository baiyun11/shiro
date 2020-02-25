package com.cn.global.common.utils;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @ClassName PageBean
 * @Description
 * @Author lin.tianwen
 * @Date 2019/1/10 9:51
 */
@Data
@NoArgsConstructor
public class PageBean<T> {

    // 当前页
    private Integer currentPage = 1;
    // 每页显示的总条数
    private Integer pageSize = 10;
    // 总条数
    private Integer totalElements;
    // 是否有下一页
    private Integer isMore;
    // 总页数
    private Integer totalPage;
    // 开始索引
    private Integer startIndex;
    // 分页结果
    private List<T> items;

    public PageBean(Integer currentPage, Integer pageSize, Integer totalElements) {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPage = (this.totalElements + this.pageSize - 1) / this.pageSize;
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.isMore = this.currentPage >= this.totalPage ? 0 : 1;
    }

}
