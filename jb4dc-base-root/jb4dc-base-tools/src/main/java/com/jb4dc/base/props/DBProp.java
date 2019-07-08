package com.jb4dc.base.props;

import com.jb4dc.base.tools.FileUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exenum.DBTypeEnum;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class DBProp {
    private static Properties propertie;
    private static final String filePath = "/config/DB.properties";

    static{
        propertie = new Properties();
        try {
            /*ClassLoader loader = Thread.currentThread().getContextClassLoader();
            try(InputStream resourceStream = loader.getResourceAsStream(filePath)) {
                propertie.load(resourceStream);
            }*/
            InputStream resourceStream =FileUtility.getStreamByLevel(filePath);
            propertie.load(resourceStream);
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
            throw new JBuild4DCGenerallyException("DB.properties中的DBType不能为空!");
        }
        if(getDriverName().equals("")){
            throw new JBuild4DCGenerallyException("DB.properties中的DriverName不能为空!");
        }
        if(getDatabaseName().equals("")){
            throw new JBuild4DCGenerallyException("DB.properties中的DatabaseName不能为空!");
        }
        if(getUrl().equals("")){
            throw new JBuild4DCGenerallyException("DB.properties中的Url不能为空!");
        }
        if(getUser().equals("")){
            throw new JBuild4DCGenerallyException("DB.properties中的User不能为空!");
        }
        if(getPassword().equals("")){
            throw new JBuild4DCGenerallyException("DB.properties中的Password不能为空!");
        }
        if (getUrl().toLowerCase().indexOf(getDatabaseName().toLowerCase())<0){
            throw new JBuild4DCGenerallyException("请检查DB.properties中的DatabaseName与Url中配置的是否相同!");
        }
    }
}
