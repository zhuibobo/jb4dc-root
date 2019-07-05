package com.jb4dc.core.base.exception;

public class JBuild4DCRunTimeException extends RuntimeException  {

    /**
     * 错误码
     */
    private Integer errorCode;

    public JBuild4DCRunTimeException(String message) {
        super(message);
    }

    public JBuild4DCRunTimeException(Integer errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public JBuild4DCRunTimeException(String message, Throwable cause) {
        super(message, cause);
    }

    public JBuild4DCRunTimeException(Integer errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public Integer getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(Integer errorCode) {
        this.errorCode = errorCode;
    }

    @Override
    public String toString() {
        return (errorCode != null ? "errorCode: " + errorCode + ", " : "") + super.toString();
    }


}
