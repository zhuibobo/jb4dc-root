package com.jb4dc.base.ymls;

import com.jb4dc.core.base.tools.FileUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exenum.DBTypeEnum;
import com.jb4dc.core.base.ymls.YamlUtility;
import org.yaml.snakeyaml.Yaml;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/8
 * To change this template use File | Settings | File Templates.
 */
public class DBYaml extends YamlUtility {
    private static Yaml yaml;
    private static Map yamlMap;
    private static final String filePath = "/config/db.yml";
    static{
        yaml = new Yaml();
        InputStream resourceStream = null;
        try {
            resourceStream = FileUtility.getStreamByLevel(filePath);
        } catch (FileNotFoundException | URISyntaxException e) {
            e.printStackTrace();
        }
        yamlMap=yaml.load(resourceStream);
    }

    public static String getValue(String key) {
        return YamlUtility.getValue(yamlMap,key);
    }

    public static boolean isSqlServer(){
        return getDBType()== DBTypeEnum.sqlserver;
    }

    public static boolean isMySql(){
        return getDBType()==DBTypeEnum.mysql;
    }

    public static boolean isOracle(){
        return getDBType()==DBTypeEnum.oracle;
    }

    public static DBTypeEnum getDBType(){
        if(getValue("DBType").toLowerCase().equals("sqlserver")){
            return DBTypeEnum.sqlserver;
        }
        else if(getValue("DBType").toLowerCase().equals("oracle")){
            return DBTypeEnum.oracle;
        }
        else if(getValue("DBType").toLowerCase().equals("mysql")){
            return DBTypeEnum.mysql;
        }
        return DBTypeEnum.sqlserver;
    }

    public static String getDriverName(){
        return getValue("DriverName");
    }

    public static String getDatabaseName(){
        return getValue("DatabaseName");
    }

    public static String getUrl(){
        return getValue("Url");
    }

    public static String getUser(){
        return getValue("User");
    }

    public static String getPassword(){
        return getValue("Password");
    }

    public static void validateConfig() throws JBuild4DCGenerallyException {
        if(getDBType().equals("")){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"DB.properties中的DBType不能为空!");
        }
        if(getDriverName().equals("")){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"DB.properties中的DriverName不能为空!");
        }
        if(getDatabaseName().equals("")){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"DB.properties中的DatabaseName不能为空!");
        }
        if(getUrl().equals("")){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"DB.properties中的Url不能为空!");
        }
        if(getUser().equals("")){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"DB.properties中的User不能为空!");
        }
        if(getPassword().equals("")){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"DB.properties中的Password不能为空!");
        }
        if (getUrl().toLowerCase().indexOf(getDatabaseName().toLowerCase())<0){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"请检查DB.properties中的DatabaseName与Url中配置的是否相同!");
        }
    }
}
