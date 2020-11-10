package com.jb4dc.feb.dist.webserver.rest.props;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/11/10
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Rest/Props/SystemProperties")
public class SystemProperties {

    @Autowired
    JBuild4DCYaml jBuild4DCYaml;

    @RequestMapping(value = "GetBaiduMapJsUrl")
    public JBuild4DCResponseVo getBaiduMapJsUrl() throws JBuild4DCGenerallyException {
        return JBuild4DCResponseVo.getDataSuccess(jBuild4DCYaml.getBaiduMapJs());
    }
}
