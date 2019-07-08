package com.jb4dc.base.props;

import com.jb4dc.base.tools.FileUtility;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Properties;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */
/*
public class JBuild4DCProp {
    private static Properties propertie;
    private static final String filePath = "/config/jbuild4dc.properties";
    static{
        propertie = new Properties();
        try {
           */
/* ClassLoader loader = Thread.currentThread().getContextClassLoader();
            try(InputStream resourceStream = loader.getResourceAsStream("JBuild4DC.properties")) {
                propertie.load(resourceStream);
            }*//*

            InputStream resourceStream = FileUtility.getStreamByLevel(filePath);
            propertie.load(new InputStreamReader(resourceStream, "utf-8"));
        } catch (FileNotFoundException ex) {
            ex.printStackTrace();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public static String getValue(String key) {
        if (propertie.containsKey(key)) {
            String value = propertie.getProperty(key);
            return value;
        } else
            return "";
    }

    public static String getHostOperationSystem(){
        return getValue("HostOperationSystem");
    }

    public static boolean hostOperationSystemIsWindow(){
        return getHostOperationSystem().toLowerCase().equals("window");
    }

    public static String getWarningOperationCode(){
        return getValue("WarningOperationCode");
    }
}
*/
