package com.cn.global.common.response;

/**
 * @EnumName CodeConstant
 * @Description
 * @Author lin.tianwen
 * @Date 2018/10/30 14:33
 */
public enum CodeConstant {


    /***
     * 1)  0：成功
     */
    SUCCESS(0,"ok"),

    /***
     * 2)  响应码以6开头：服务器错误
     */
//响应数据要求携带SQL异常具体描述信息
    SERVER_SQL_ACCESS_FAIL(6000,"SQL execution error"),
    //响应数据要求携带未知异常具体描述信息
    SERVER_UNKNOWN_EXCEPTION(6002,"server exception"),



    /***
     * 3)  响应码以7开头：客户端错误
     */
    CLIENT_UNAUTHENTICATED(7000,"未认证"),
    CLIENT_AUTHENTICATED_FAILURE(7001,"认证失败"),
    CLIENT_UNAUTHORIZATED(7002, "未授权"),

    CLIENT_INVALID_SIGNATURE(7003,"invalid signature"),

    CLIENT_EXPIRED_TOKEN(7004,"expired token"),
    CLIENT_INVALID_TOKEN(7005,"invalid token"),

    CLIENT_REQUEST_REFUSED(7006,"请求被拒绝"),

    CLIENT_INVALID_PARAMETER(7007,"invalid request parameter"),

    /***
     * 4)  响应码以8开头：引用项目错误
     */
    PROJECT_INVALID_CONFIGURATION_PARAMETER(8000, "invalid configuration parameter");

    private int code;
    private String msg;

    public int getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }

    CodeConstant(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }
}
