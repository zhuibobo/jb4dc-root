package com.jb4dc.core.base.ymls;

import com.jb4dc.core.base.tools.FileUtility;
import org.yaml.snakeyaml.Yaml;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/8
 * To change this template use File | Settings | File Templates.
 */
public class JBuild4DCYaml extends YamlUtility {
    private static Yaml yaml;
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
    }

    public static String getValue(String key) {
        return YamlUtility.getValue(yamlMap,key);
    }

    public static String getWarningOperationCode(){
        return getValue("warning:operationCode");
    }

    public static String getClientSystemTitle(){
        return getValue("client:systemTitle");
    }
}
