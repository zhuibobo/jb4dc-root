package com.jb4dc.base.service.exenum;

import com.jb4dc.core.base.exenum.BaseEnum;

import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/17
 * To change this template use File | Settings | File Templates.
 */
public enum MenuTypeEnum implements BaseEnum<EnableTypeEnum, Integer> {
    Root(0,"根菜单"),
    LinkMenu(1,"超链接菜单"),
    ModuleWebListMenu(2,"Web模块列表菜单"),
    ModuleWebFormMenu(3,"Web模块窗体菜单");

    private Integer value;
    private String displayName;

    static Map<Integer,MenuTypeEnum> enumMap=new HashMap<Integer, MenuTypeEnum>();
    static{
        for(MenuTypeEnum type: MenuTypeEnum.values()){
            enumMap.put(type.getValue(), type);
        }
    }

    private MenuTypeEnum(int value,String displayName) {
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

    public static MenuTypeEnum getEnum(Integer value) {
        return enumMap.get(value);
    }
}
