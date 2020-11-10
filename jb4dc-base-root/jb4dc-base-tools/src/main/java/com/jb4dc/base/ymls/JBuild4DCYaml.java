package com.jb4dc.base.ymls;

import com.jb4dc.core.base.ymls.YamlUtility;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/8
 * To change this template use File | Settings | File Templates.
 */
@Component
public class JBuild4DCYaml extends YamlUtility {

    /*private static Yaml yaml;
    private static Map yamlMap;
    private static final String filePath = "/config/jbuild4dc.yml";
    static{
        yaml = new Yaml();
        InputStream resourceStream = null;
        try {
            resourceStream = FileUtility.getStreamByLevel(filePath);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        yamlMap=yaml.load(resourceStream);
    }*/



    /*public static String getValue(String key) {
        return YamlUtility.getValue(yamlMap,key);
    }*/



    @Value("${jb4dc.system-title}")
    public void setSystemTitle(String systemTitle) {
        JBuild4DCYaml.systemTitle = systemTitle;
    }

    @Value("${jb4dc.warning-operation-code}")
    public void setOperationCode(String operationCode) {
        JBuild4DCYaml.operationCode = operationCode;
    }

    @Value("${jb4dc.system-caption}")
    public void setSystemCaption(String systemCaption) {
        JBuild4DCYaml.systemCaption = systemCaption;
    }

    @Value("${jb4dc.is-debug}")
    public void setIsDebug(boolean isDebug) {
        JBuild4DCYaml.debug = isDebug;
    }
    /*@Value("${jb4dc.is-debug}")
    public void setSystemCaption(String systemCaption) {
        JBuild4DCYaml.systemCaption = systemCaption;
    }*/

    private static String systemTitle;

    private static String systemCaption;

    private static String operationCode;

    private static boolean debug;

    private static String baiduMapJs;

    public static String getWarningOperationCode(){

        return operationCode;
        //return getValue("warning:operationCode");
    }

    public static String getClientSystemTitle(){
        return systemTitle;
        //return getValue("client:systemTitle");
    }

    public static String getSystemCaption() {
        return systemCaption;
    }

    public static boolean isDebug() {
        return debug;
    }

    public String getBaiduMapJs() {
        return baiduMapJs;
    }

    @Value("${jb4dc.baidu-map-js:未设置}")
    public void setBaiduMapJs(String baiduMapJs) {
        JBuild4DCYaml.baiduMapJs = baiduMapJs;
    }
}
