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
    LinkMenu(1,"超链接"),
    ModuleWebListMenu(2,"Web模块列表"),
    ModuleWebFormMenu(3,"Web模块窗体"),
    ModuleFlowGroupMenu(4,"流程分组"),
    ModuleFlowInstanceMenu(5,"流程实例"),
    ModuleStaticListMenu(6,"统计列表"),
    ModulePortalMenu(7,"工作桌面"),
    EmptyMenu(100,"空");

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
