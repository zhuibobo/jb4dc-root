package com.jb4dc.feb.dist.webserver.rest;

import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/8
 * To change this template use File | Settings | File Templates.
 */

@RestController
@RequestMapping(value = "/Rest/JBuild4DCYaml")
public class JBuild4DCYamlRest {
    @RequestMapping(value = "/GetClientSystemTitle", method = RequestMethod.GET)
    public JBuild4DCResponseVo getClientSystemTitle() {
        String title= JBuild4DCYaml.getClientSystemTitle();
        return JBuild4DCResponseVo.getDataSuccess(title);
    }

    @RequestMapping(value = "/GetClientSystemCaption", method = RequestMethod.GET)
    public JBuild4DCResponseVo getClientSystemCaption() {
        String caption= JBuild4DCYaml.getSystemCaption();
        return JBuild4DCResponseVo.getDataSuccess(caption);
    }
}
