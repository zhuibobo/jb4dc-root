package com.jb4dc.base.ymls;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/8
 * To change this template use File | Settings | File Templates.
 */
public class YamlUtility {
    public static String getValue(Map yamlMap,String fullKey){
        String[] keys=fullKey.split(":");
        Map tempMap=yamlMap;
        for (String key : keys) {
            if(tempMap.containsKey(key)){
                if(tempMap.get(key) instanceof LinkedHashMap){
                    tempMap=(Map)tempMap.get(key);
                }
                else{
                    return (String) tempMap.get(key);
                }
                //System.out.println(tempMap.get(key));
                //if(tempMap.)
                //tempMap=tempMap.get()
            }
        }
        return "";
    }
}
