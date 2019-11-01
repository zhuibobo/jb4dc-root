package com.jb4dc.core.base.tools;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/1
 * To change this template use File | Settings | File Templates.
 */
public class BaseUtility {
    public static String getViewOperationName(){
        return "view";
    }

    public static boolean isViewOperation(String name){
        return name.equals(getViewOperationName());
    }

    public static String getAddOperationName(){
        return "add";
    }

    public static boolean isAddOperation(String name){
        return name.equals(getAddOperationName());
    }

    public static String getUpdateOperationName(){
        return "update";
    }

    public static boolean isUpdateOperation(String name){
        return name.equals(getUpdateOperationName());
    }

    public static String getDeleteOperationName(){
        return "delete";
    }

    public static boolean isDeleteOperation(String name){
        return name.equals(getDeleteOperationName());
    }
}
