package com.jb4dc.code.generate.service;

import com.jb4dc.code.generate.bo.PackageConfigBO;
import com.jb4dc.code.generate.bo.PackageSingleBO;

import javax.xml.bind.JAXBException;
import java.io.FileNotFoundException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/6
 * To change this template use File | Settings | File Templates.
 */
public interface IPackageService {
    PackageConfigBO getConfig() throws FileNotFoundException, JAXBException;

    PackageSingleBO getPackageSingleBO(String name) throws FileNotFoundException, JAXBException;
}
