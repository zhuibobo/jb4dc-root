package com.jb4dc.core.base.exception;

public class JBuild4DCSessionTimeoutException extends JBuild4DCRunTimeException {

    public JBuild4DCSessionTimeoutException() {
        super(JBuild4DCErrorCode.SESSION_TIMEOUT_CODE, JBuild4DCErrorCode.SESSION_TIMEOUT_MESSAGE);
    }

}
