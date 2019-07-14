package com.jb4dc.code.generate.webserver.rest;

import com.jb4dc.code.generate.bo.PackageConfigBO;
import com.jb4dc.code.generate.service.IPackageService;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.bind.JAXBException;
import java.io.FileNotFoundException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/6
 * To change this template use File | Settings | File Templates.
 */

@RestController
@RequestMapping(value = "/Rest/Package")
public class PackageRest {

    @Autowired
    IPackageService packageService;

    @RequestMapping(value = "/GetConfig", method = RequestMethod.GET)
    public JBuild4DCResponseVo getConfig() throws FileNotFoundException, JAXBException {
        PackageConfigBO config = packageService.getConfig();
        return JBuild4DCResponseVo.getDataSuccess(config);
    }
}
