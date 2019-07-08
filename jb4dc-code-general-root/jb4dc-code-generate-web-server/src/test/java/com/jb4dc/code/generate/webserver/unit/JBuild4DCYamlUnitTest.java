package com.jb4dc.code.generate.webserver.unit;

import com.jb4dc.base.ymls.JBuild4DCYaml;
import org.junit.Test;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/8
 * To change this template use File | Settings | File Templates.
 */
public class JBuild4DCYamlUnitTest {

    @Test
    public void getTableGenerateCodeTest() throws Exception {
        System.out.println(JBuild4DCYaml.getValue("client:systemTitle"));
    }

}
