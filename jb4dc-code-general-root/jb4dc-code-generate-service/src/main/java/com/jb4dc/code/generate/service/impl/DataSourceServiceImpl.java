package com.jb4dc.code.generate.service.impl;

import com.jb4dc.base.tools.FileUtility;
import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.code.generate.service.IDataSourceService;
import com.jb4dc.code.generate.vo.DataSourceConfigVo;
import com.jb4dc.code.generate.vo.DataSourceSingleVo;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.xml.bind.JAXBException;
import java.io.FileNotFoundException;
import java.io.InputStream;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/4
 * To change this template use File | Settings | File Templates.
 */

public class DataSourceServiceImpl implements IDataSourceService {

    @Override
    public DataSourceConfigVo getConfig() throws FileNotFoundException, JAXBException {
        InputStream is = FileUtility.getStreamByLevel("/config/db-source.xml");
        DataSourceConfigVo configVo= XMLUtility.toObject(is, DataSourceConfigVo.class);
        return configVo;
    }

    @Override
    public DataSourceConfigVo getSimpleConfig() throws FileNotFoundException, JAXBException {
        DataSourceConfigVo configVo= getConfig();
        configVo.getDataSourceSingleVoList().forEach(vo->{vo.setUrl("");vo.setUser("");vo.setPassword("");vo.setDriverName("");});
        return configVo;
    }

    @Override
    public DataSourceSingleVo getSingleDataSourceConfig(String dataSourceId) throws FileNotFoundException, JAXBException {
        return getConfig().getDataSourceSingleVoList().parallelStream().filter(vo->vo.getId().equals(dataSourceId)).findAny().orElse(null);
    }
}
