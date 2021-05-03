package com.jb4dc.base.service.general;

import com.jb4dc.core.base.session.JB4DCSession;

public class JB4DCUnitSessionSessionUtility {

    public static void mockLogin(JB4DCSession mockSession){
        JB4DCSessionUtility.isUnitTest=true;
        JB4DCSessionUtility.setUnitTestMockSession(mockSession);
    }
}
