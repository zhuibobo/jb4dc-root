package com.jb4dc.code.generate.webserver.rest;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/9
 * To change this template use File | Settings | File Templates.
 */

@RestController
@RequestMapping(value = "/Rest/Login")
public class LoginRest {

    @RequestMapping(value = "/ValidateAccount", method = RequestMethod.POST)
    public JBuild4DCResponseVo validateAccount(String accountName,String password) {
        if(accountName.equals("Alex")&&password.equals("4D")){
            JB4DCSession jB4DCSession = new JB4DCSession();
            jB4DCSession.setOrganName("4D");
            jB4DCSession.setOrganId("OrganIdForAlex");
            jB4DCSession.setUserName("Alex");
            jB4DCSession.setUserId("UserIdForAlex");
            JB4DCSessionUtility.addSessionAttr(JB4DCSessionUtility.UserLoginSessionKey, jB4DCSession);
            return JBuild4DCResponseVo.success("验证成功!");
        }
        return JBuild4DCResponseVo.error("验证失败");
    }
}
