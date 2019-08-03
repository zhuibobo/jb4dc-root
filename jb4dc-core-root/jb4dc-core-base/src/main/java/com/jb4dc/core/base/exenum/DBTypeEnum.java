package com.jb4dc.core.base.exenum;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/26
 * To change this template use File | Settings | File Templates.
 */
public enum DBTypeEnum implements BaseEnum<DBTypeEnum, Integer> {

    mysql(1,"mysql"),
    sqlserver(0,"sqlserver"),
    oracle(2,"oracle");

    private Integer value;
    private String displayName;

    static Map<String,DBTypeEnum> enumMap=new HashMap<String, DBTypeEnum>();
    static{
        for(DBTypeEnum type: DBTypeEnum.values()){
            enumMap.put(type.getDisplayName(), type);
        }
    }

    private DBTypeEnum(int value,String displayName) {
        this.value=value;
        this.displayName=displayName;
    }

    public Integer getValue() {
        return value;
    }
    public void setValue(int value) {
        this.value = value;
    }
    public String getDisplayName() {
        return displayName;
    }
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public static DBTypeEnum getEnum(Integer value) {
        return enumMap.get(value);
    }

    public static DBTypeEnum getEnum(String name) throws JBuild4DCGenerallyException {
        if(name.equals("mysql")){
            return DBTypeEnum.mysql;
        }
        else if(name.equals("sqlserver")){
            return DBTypeEnum.sqlserver;
        }
        else if(name.equals("oracle")){
            return DBTypeEnum.oracle;
        }
        else
        {
            throw  JBuild4DCGenerallyException.getNotSupportDBException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE);
        }
    }
}
