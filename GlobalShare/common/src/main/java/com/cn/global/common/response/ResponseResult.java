package com.cn.global.common.response;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @ClassName ResponseResult
 * @Description
 * @Author lin.tianwen
 * @Date 2018/10/30 14:26
 */
@Data
@NoArgsConstructor
public class ResponseResult {

    private Integer code;

    private String msg;

    private Object data;

    public ResponseResult(CodeConstant codeConstant) {
        this(codeConstant, null);
    }

    public ResponseResult(CodeConstant codeConstant, Object data) {
        this(codeConstant.getCode(), codeConstant.getMsg(), data);
    }

    public ResponseResult(Integer code, String msg, Object data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

}
