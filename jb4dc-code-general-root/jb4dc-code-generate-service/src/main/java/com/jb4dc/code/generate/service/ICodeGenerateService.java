package com.jb4dc.code.generate.service;

import com.github.pagehelper.PageInfo;
import com.jb4dc.code.generate.vo.SimpleTableFieldVo;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.mybatis.generatorex.api.IntrospectedTable;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
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
    PageInfo<List<Map<String, Object>>> getTables(JB4DCSession jb4DSession, Integer pageNum, Integer pageSize, Map<String, Object> searchMap) throws JBuild4DCGenerallyException;

    List<SimpleTableFieldVo> getTableFields(JB4DCSession jb4DSession, String tableName) throws JBuild4DCGenerallyException;

    //String getTableComment(JB4DSession jb4DSession, String tableName) throws JBuild4DGenerallyException;

    IntrospectedTable getTableInfo(String tableName);

    Map<String,String> getTableGenerateCode(JB4DCSession jb4DSession, String tableName, String orderFieldName, String statusFieldName, String packageType, String packageLevel2Name) throws IOException, ParserConfigurationException, SAXException, XPathExpressionException;
}
