package com.jb4dc.code.generate.service.impl;

import com.jb4dc.core.base.tools.FileUtility;
import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.code.generate.service.IDataSourceService;
import com.jb4dc.code.generate.bo.DataSourceConfigBO;
import com.jb4dc.code.generate.bo.DataSourceSingleBO;
import org.springframework.stereotype.Service;

import javax.xml.bind.JAXBException;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.net.URISyntaxException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/4
 * To change this template use File | Settings | File Templates.
 */

@Service
public class DataSourceServiceImpl implements IDataSourceService {

    @Override
    public DataSourceConfigBO getConfig() throws FileNotFoundException, JAXBException, URISyntaxException {
        InputStream is = FileUtility.getStreamByLevel("/config/db-source.xml");
        DataSourceConfigBO configVo= XMLUtility.toObject(is, DataSourceConfigBO.class);
        return configVo;
    }

    @Override
    public DataSourceConfigBO getSimpleConfig() throws FileNotFoundException, JAXBException, URISyntaxException {
        DataSourceConfigBO configVo= getConfig();
        configVo.getDataSourceSingleVoList().forEach(vo->{vo.setUrl("");vo.setUser("");vo.setPassword("");vo.setDriverName("");});
        return configVo;
    }

    @Override
    public DataSourceSingleBO getDataSourceSingleConfig(String dataSourceId) throws FileNotFoundException, JAXBException, URISyntaxException {
        return getConfig().getDataSourceSingleVoList().parallelStream().filter(vo->vo.getId().equals(dataSourceId)).findAny().orElse(null);
    }
}
