package com.jb4dc.feb.dist.webserver.rest.frame;

import com.jb4dc.base.service.extend.IFrameMenu;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
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
@RequestMapping(value = "/Rest/Frame/JBuild4DCYaml")
public class MenuRest {
    @Autowired
    IFrameMenu frameMenu;

    public JBuild4DCResponseVo getClientSystemTitle() {
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        return frameMenu.getMyFrameMenu(jb4DCSession);
    }
}
