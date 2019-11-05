package com.jb4dc.core.base.exception;

public class JBuild4DCBaseException extends Exception {
    /**
     * 错误码
     */
    private Integer errorCode;

    public JBuild4DCBaseException(int errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public JBuild4DCBaseException(int errorCode, String message, Throwable cause,StackTraceElement[] stackTraceElements) {
        super(message, cause);
        this.setStackTrace(stackTraceElements);
        this.errorCode = errorCode;
    }

    public int getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

    @Override
    public String toString() {
        return "errorCode: " + errorCode + ", " + super.toString();
    }
}
