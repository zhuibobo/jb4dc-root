package com.jb4dc.code.generate.webserver.rest;

import com.jb4dc.code.generate.service.IDataSourceService;
import com.jb4dc.code.generate.bo.DataSourceConfigBO;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.bind.JAXBException;
import java.io.FileNotFoundException;
import java.net.URISyntaxException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/5
 * To change this template use File | Settings | File Templates.
 */

@RestController
@RequestMapping(value = "/Rest/DataSource")
public class DataSourceRest {

    @Autowired
    IDataSourceService dataSourceService;

    @RequestMapping(value = "/GetConfig", method = RequestMethod.GET)
    public JBuild4DCResponseVo getConfig() throws FileNotFoundException, JAXBException, URISyntaxException {
        //List<TableGroupEntity> tableGroupEntityList=tableGroupService.getALLASC(JB4DCSessionUtility.getSession());
        DataSourceConfigBO config = dataSourceService.getSimpleConfig();
        //config.getDataSourceSingleVoList().forEach(vo->{vo.setUrl("");vo.setUser("");vo.setPassword("");vo.setDriverName("");});
        //config.getDataSourceSingleVoList().forEach(vo->(vo.setUser(""));
        //config.
        return JBuild4DCResponseVo.getDataSuccess(config);
    }
}
