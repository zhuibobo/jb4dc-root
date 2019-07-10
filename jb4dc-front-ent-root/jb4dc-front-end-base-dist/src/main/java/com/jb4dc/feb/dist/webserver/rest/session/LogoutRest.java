package com.jb4dc.feb.dist.webserver.rest.session;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/9
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Session")
public class LogoutRest {
    @RequestMapping(value = "Logout")
    public JBuild4DCResponseVo logout() throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSessionToClientStore();
        return JBuild4DCResponseVo.success(JBuild4DCResponseVo.GETDATASUCCESSMSG,jb4DCSession);
    }
}
