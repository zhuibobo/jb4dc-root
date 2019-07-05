package com.jb4dc.code.generate.service;

import com.jb4dc.code.generate.vo.DataSourceConfigVo;

import javax.xml.bind.JAXBException;
import java.io.FileNotFoundException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/4
 * To change this template use File | Settings | File Templates.
 */
public interface IDataSourceService {
    DataSourceConfigVo getConfig() throws FileNotFoundException, JAXBException;
}
