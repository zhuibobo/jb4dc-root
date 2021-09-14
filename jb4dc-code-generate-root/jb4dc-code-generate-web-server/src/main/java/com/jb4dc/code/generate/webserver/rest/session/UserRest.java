package com.jb4dc.code.generate.webserver.rest.session;

import com.jb4dc.base.service.general.JB4DCSessionCenter;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/9
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Session/User")
public class UserRest {
    @RequestMapping(value = "GetMySessionUser")
    public JBuild4DCResponseVo getMySessionUser() throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getTempSession("0","0","0","零");
        return JBuild4DCResponseVo.success(JBuild4DCResponseVo.GETDATASUCCESSMSG,jb4DCSession);
    }
}
