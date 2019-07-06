package com.jb4dc.code.generate.service;

import com.github.pagehelper.PageInfo;
import com.jb4dc.code.generate.bo.SimpleTableFieldBO;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import org.mybatis.generatorex.api.IntrospectedTable;
import org.xml.sax.SAXException;

import javax.xml.bind.JAXBException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.beans.PropertyVetoException;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/25
 * To change this template use File | Settings | File Templates.
 */
public interface ICodeGenerateService {
    PageInfo<List<Map<String, Object>>> getTables(String dataSourceId,String searchTableName,Integer pageNum, Integer pageSize) throws JBuild4DCGenerallyException, FileNotFoundException, PropertyVetoException, JAXBException;

    List<SimpleTableFieldBO> getTableFields(String dataSourceId, String tableName) throws JBuild4DCGenerallyException, FileNotFoundException, PropertyVetoException, JAXBException;

    //String getTableComment(JB4DSession jb4DSession, String tableName) throws JBuild4DGenerallyException;

    //IntrospectedTable getTableInfo(String tableName);

    Map<String,String> getTableGenerateCode(String dataSourceId, String tableName, String orderFieldName, String statusFieldName, String packageType, String packageLevel2Name) throws IOException, ParserConfigurationException, SAXException, XPathExpressionException, JAXBException;
}
