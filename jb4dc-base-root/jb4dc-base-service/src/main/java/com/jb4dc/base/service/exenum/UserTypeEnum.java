package com.jb4dc.base.service.exenum;

import com.jb4dc.core.base.exenum.BaseEnum;

import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/7
 * To change this template use File | Settings | File Templates.
 */
public enum UserTypeEnum  implements BaseEnum<EnableTypeEnum, Integer> {
    manager(1,"平台管理员"),
    organAdmin(2,"组织机构管理员"),
    normalUser(3,"一般用户");

    private Integer value;
    private String displayName;

    static Map<Integer,UserTypeEnum> enumMap=new HashMap<Integer, UserTypeEnum>();
    static{
        for(UserTypeEnum type: UserTypeEnum.values()){
            enumMap.put(type.getValue(), type);
        }
    }

    private UserTypeEnum(int value,String displayName) {
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

    public static UserTypeEnum getEnum(Integer value) {
        return enumMap.get(value);
    }
}
