package com.cn.global.common.response;

public class AbnormalException extends RuntimeException {

    private CodeConstant codeConstant;

    public AbnormalException(CodeConstant codeConstant) {
        this(null, codeConstant);
    }

    public AbnormalException(String message, CodeConstant codeConstant) {
        super(message);
        this.codeConstant = codeConstant;
    }

    public CodeConstant getCodeConstant() {
        return codeConstant;
    }

}
