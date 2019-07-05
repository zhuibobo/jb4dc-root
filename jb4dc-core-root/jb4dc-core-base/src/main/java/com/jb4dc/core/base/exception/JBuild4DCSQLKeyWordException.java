package com.jb4dc.core.base.exception;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/2
 * To change this template use File | Settings | File Templates.
 */
public class JBuild4DCSQLKeyWordException extends JBuild4DCBaseException {

    static int defaultCode=100001;

    public JBuild4DCSQLKeyWordException(String message) {
        super(defaultCode, message);
    }

    public JBuild4DCSQLKeyWordException(int errorCode, String message) {
        super(errorCode, message);
    }

    public JBuild4DCSQLKeyWordException(int errorCode, String message, Throwable cause) {
        super(errorCode, message, cause);
    }
}
