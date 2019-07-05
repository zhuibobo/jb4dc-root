package com.jb4dc.code.generate.service.impl;

import com.jb4dc.base.tools.FileUtility;
import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.code.generate.service.IDataSourceService;
import com.jb4dc.code.generate.vo.DataSourceConfigVo;
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

@Service()
public class DataSourceServiceImpl implements IDataSourceService {

    @Override
    public DataSourceConfigVo getConfig() throws FileNotFoundException, JAXBException {
        InputStream is = FileUtility.getStreamByLevel("/config/db-source.xml");
        DataSourceConfigVo configVo= XMLUtility.toObject(is, DataSourceConfigVo.class);
        return configVo;
    }
}
