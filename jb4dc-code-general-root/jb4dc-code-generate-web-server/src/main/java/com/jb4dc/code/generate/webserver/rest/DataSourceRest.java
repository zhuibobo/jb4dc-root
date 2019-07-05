package com.jb4dc.code.generate.webserver.rest;

import com.jb4dc.base.tools.FileUtility;
import com.jb4dc.code.generate.service.IDataSourceService;
import com.jb4dc.code.generate.vo.DataSourceConfigVo;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.bind.JAXBException;
import java.io.FileNotFoundException;
import java.io.InputStream;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/5
 * To change this template use File | Settings | File Templates.
 */

@RestController
@RequestMapping(value = "/DataSource")
public class DataSourceRest {

    @Autowired
    IDataSourceService dataSourceService;

    @RequestMapping(value = "/GetConfig", method = RequestMethod.GET)
    public JBuild4DCResponseVo getConfig() throws FileNotFoundException, JAXBException {
        //List<TableGroupEntity> tableGroupEntityList=tableGroupService.getALLASC(JB4DSessionUtility.getSession());
        DataSourceConfigVo config = dataSourceService.getConfig();
        return JBuild4DCResponseVo.getDataSuccess(config);
    }
}
