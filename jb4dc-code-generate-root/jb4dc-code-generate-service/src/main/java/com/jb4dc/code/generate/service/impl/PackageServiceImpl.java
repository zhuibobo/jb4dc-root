package com.jb4dc.code.generate.service.impl;

import com.jb4dc.core.base.tools.FileUtility;
import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.code.generate.bo.PackageConfigBO;
import com.jb4dc.code.generate.bo.PackageSingleBO;
import com.jb4dc.code.generate.service.IPackageService;
import org.springframework.stereotype.Service;

import javax.xml.bind.JAXBException;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.net.URISyntaxException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/6
 * To change this template use File | Settings | File Templates.
 */
@Service
public class PackageServiceImpl implements IPackageService {

    @Override
    public PackageConfigBO getConfig() throws FileNotFoundException, JAXBException, URISyntaxException {
        InputStream is = FileUtility.getStreamByLevel("/config/package-name.xml");
        PackageConfigBO configVo= XMLUtility.toObject(is, PackageConfigBO.class);
        return configVo;
    }

    @Override
    public PackageSingleBO getPackageSingleBO(String name) throws FileNotFoundException, JAXBException, URISyntaxException {
        return getConfig().getPackageSingleBOList().parallelStream().filter(vo->vo.getName().equals(name)).findAny().orElse(null);
    }
}
