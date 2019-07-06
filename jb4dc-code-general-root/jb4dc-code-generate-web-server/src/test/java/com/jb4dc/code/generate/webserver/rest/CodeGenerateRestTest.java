package com.jb4dc.code.generate.webserver.rest;

import com.github.pagehelper.PageInfo;
import com.jb4dc.code.generate.bo.SimpleTableFieldBO;
import com.jb4dc.code.generate.service.ICodeGenerateService;
import com.jb4dc.code.generate.webserver.RestTestBase;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;
import org.xml.sax.SAXException;

import javax.xml.bind.JAXBException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.beans.PropertyVetoException;
import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/5
 * To change this template use File | Settings | File Templates.
 */


public class CodeGenerateRestTest extends RestTestBase {
    MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Before
    public void setupMock() throws Exception {
        mockMvc = webAppContextSetup(context).build();
        /*MockHttpServletRequestBuilder requestBuilder =post("/ValidateAccount.do");
        requestBuilder.param("account","1");
        requestBuilder.param("password","1");
        mockMvc.perform(requestBuilder);*/
    }

    @Test
    public void getTableGenerateCodeTest() throws Exception {
        String path=context.getServletContext().getContextPath();

        MockHttpServletRequestBuilder requestBuilder =post("/Rest/CodeGenerate/GetTableGenerateCode");
        requestBuilder.param("tableName","TBUILD_DATASET");
        requestBuilder.param("packageType","SSO");
        requestBuilder.param("packageLevel2Name","");
        requestBuilder.param("orderFieldName","DS_ORDER_NUM");
        requestBuilder.param("statusFieldName","DS_STATUS");
        requestBuilder.param("dataSourceId","DataSource0001");
        MvcResult result=mockMvc.perform(requestBuilder).andReturn();
    }
}
