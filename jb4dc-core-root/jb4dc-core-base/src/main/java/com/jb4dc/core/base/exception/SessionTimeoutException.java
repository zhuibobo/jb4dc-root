package com.jb4dc.core.base.exception;

public class SessionTimeoutException extends JBuild4DRunTimeException {

    public SessionTimeoutException() {
        super(JBuild4DErrorCode.SESSION_TIMEOUT_CODE, JBuild4DErrorCode.SESSION_TIMEOUT_MESSAGE);
    }

}
