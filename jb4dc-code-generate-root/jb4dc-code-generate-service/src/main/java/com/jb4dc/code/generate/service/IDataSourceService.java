package com.jb4dc.code.generate.service;

import com.jb4dc.code.generate.bo.DataSourceConfigBO;
import com.jb4dc.code.generate.bo.DataSourceSingleBO;

import javax.xml.bind.JAXBException;
import java.io.FileNotFoundException;
import java.net.URISyntaxException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/4
 * To change this template use File | Settings | File Templates.
 */
public interface IDataSourceService {
    DataSourceConfigBO getConfig() throws FileNotFoundException, JAXBException, URISyntaxException;

    DataSourceConfigBO getSimpleConfig() throws FileNotFoundException, JAXBException, URISyntaxException;

    DataSourceSingleBO getDataSourceSingleConfig(String dataSourceId) throws FileNotFoundException, JAXBException, URISyntaxException;
}
