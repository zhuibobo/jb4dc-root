package com.jb4dc.code.generate.webserver.rest;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.code.generate.service.ICodeGenerateService;
import com.jb4dc.code.generate.bo.SimpleTableFieldBO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

import javax.xml.bind.JAXBException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.beans.PropertyVetoException;
import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/5
 * To change this template use File | Settings | File Templates.
 */

@RestController
@RequestMapping(value = "/Rest/CodeGenerate")
public class CodeGenerateRest {
    @Autowired
    ICodeGenerateService codeGenerateService;

    @RequestMapping(value = "/GetListData", method = RequestMethod.POST)
    public JBuild4DCResponseVo getListData(Integer pageSize, Integer pageNum,String dataSourceId, String searchTableName) throws IOException, ParseException, JBuild4DCGenerallyException, PropertyVetoException, JAXBException {
        //JB4DCSession JB4DCSession = JB4DCSessionUtility.getSession();
        //Map<String,Object> searchMap= GeneralSearchUtility.deserializationToMap(searchCondition);
        System.out.println(JBuild4DCYaml.isDebug());
        if(dataSourceId==null||dataSourceId.equals("")){
            return JBuild4DCResponseVo.error("请设置数据源!");
        }
        PageInfo<List<Map<String, Object>>> proOrganPageInfo=codeGenerateService.getTables(dataSourceId,searchTableName,pageNum,pageSize);
        return JBuild4DCResponseVo.success("获取成功",proOrganPageInfo);
    }

    @RequestMapping(value = "/GetTableGenerateCode", method = RequestMethod.POST)
    public JBuild4DCResponseVo getTableGenerateCode(String dataSourceId,String tableName,String packageType,String packageLevel2Name,String orderFieldName,String statusFieldName) throws IOException, ParseException, XPathExpressionException, SAXException, ParserConfigurationException, JAXBException {
        //JB4DCSession JB4DCSession = JB4DCSessionUtility.getSession();
        Map<String,String> result=codeGenerateService.getTableGenerateCode(dataSourceId,tableName,orderFieldName,statusFieldName,packageType,packageLevel2Name);
        return JBuild4DCResponseVo.success("获取成功",result);
    }

    @RequestMapping(value = "/GetTableFields", method = RequestMethod.POST)
    public JBuild4DCResponseVo getTableFields(String dataSourceId,String tableName) throws IOException, ParseException, JBuild4DCGenerallyException, PropertyVetoException, JAXBException {
        //JB4DCSession JB4DCSession = JB4DCSessionUtility.getSession();
        List<SimpleTableFieldBO> result=codeGenerateService.getTableFields(dataSourceId,tableName);
        return JBuild4DCResponseVo.success("获取成功",result);
    }
}
