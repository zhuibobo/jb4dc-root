package com.jb4dc.feb.dist.webserver.rest.frame;

import com.jb4dc.base.service.provide.IFramePageProvide;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/9
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Frame/MyFrame")
public class FrameRest {
    Logger logger= LoggerFactory.getLogger(FrameRest.class);

    @Autowired(required = false)
    IFramePageProvide frameMenu;

    @RequestMapping(value = "GetMyMenu")
    public JBuild4DCResponseVo getMyMenu() throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        if(frameMenu==null){
            //logger.error("请在项目中提供IFrameMenu的实现类,并声明为bean!");
            //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,)
            throw JBuild4DCGenerallyException.getInterfaceNotBeanException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"com.jb4dc.base.service.extend.IFramePageProvide");
        }
        return JBuild4DCResponseVo.success(JBuild4DCResponseVo.GETDATASUCCESSMSG,frameMenu.getMyFrameMenu(jb4DCSession));
    }

    @RequestMapping(value = "GetMyAuthorityApp")
    public JBuild4DCResponseVo getMyAuthorityApp() throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        if(frameMenu==null){
            //logger.error("请在项目中提供IFrameMenu的实现类,并声明为bean!");
            //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,)
            throw JBuild4DCGenerallyException.getInterfaceNotBeanException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"com.jb4dc.base.service.extend.IFramePageProvide");
        }
        return JBuild4DCResponseVo.success(JBuild4DCResponseVo.GETDATASUCCESSMSG,frameMenu.getMyFrameAuthorityApp(jb4DCSession.getUserId()));
    }

    @RequestMapping(value = "GetMyFrameLogoutUrl")
    public JBuild4DCResponseVo getMyFrameLogoutUrl() throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        if(frameMenu==null){
            //logger.error("请在项目中提供IFrameMenu的实现类,并声明为bean!");
            //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,)
            throw JBuild4DCGenerallyException.getInterfaceNotBeanException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"com.jb4dc.base.service.extend.IFramePageProvide");
        }
        return JBuild4DCResponseVo.success(JBuild4DCResponseVo.GETDATASUCCESSMSG,frameMenu.getMyFrameLogoutUrl(jb4DCSession.getUserId()));
    }
}
