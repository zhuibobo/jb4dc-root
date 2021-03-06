package com.jb4dc.base.dbaccess.anno;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSessionTimeoutException;

import java.lang.reflect.Field;

public class DBAnnoUtility {
    public static String getIdValue(Object object) throws Exception {
        //class a=DictionaryGroupEntity.class.;
        Field[] fields=object.getClass().getDeclaredFields();
        //Field[] fields=DictionaryGroupEntity.class.getDeclaredFields();
        for (Field field : fields) {
            //System.out.println(field.getName());
            boolean idkey=field.isAnnotationPresent(DBKeyField.class);
            if(idkey) {
                field.setAccessible(true);
                String value= (String) field.get(object);
                return value;
            }
        }
        if(object.getClass().getSuperclass()!=null) {
            fields=object.getClass().getSuperclass().getDeclaredFields();
            for (Field field : fields) {
                //System.out.println(field.getName());
                boolean idkey=field.isAnnotationPresent(DBKeyField.class);
                if(idkey) {
                    field.setAccessible(true);
                    String value= (String) field.get(object);
                    return value;
                }
            }
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"类型"+object.getClass().getName()+"中找不到标记了注解DBKeyField,设定为主键的字段！");
    }

    public static void setIdValue(Object object, Object value) throws IllegalAccessException, JBuild4DCGenerallyException, InstantiationException {
        Field[] fields=object.getClass().getDeclaredFields();
        //Field[] fields=DictionaryGroupEntity.class.getDeclaredFields();
        for (Field field : fields) {
            //System.out.println(field.getName());
            boolean idkey=field.isAnnotationPresent(DBKeyField.class);
            if(idkey) {
                field.setAccessible(true);
                field.set(object,value);
                return;
            }
        }
        //尝试查询父类
        if(object.getClass().getSuperclass()!=null) {
            fields=object.getClass().getSuperclass().getDeclaredFields();
            for (Field field : fields) {
                //System.out.println(field.getName());
                boolean idkey=field.isAnnotationPresent(DBKeyField.class);
                if(idkey) {
                    field.setAccessible(true);
                    field.set(object,value);
                    return;
                }
            }
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"类型"+object.getClass().getName()+"中找不到标记了注解DBKeyField,设定为主键的字段！");
    }
}
