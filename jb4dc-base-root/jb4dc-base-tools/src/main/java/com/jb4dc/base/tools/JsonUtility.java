package com.jb4dc.base.tools;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.type.TypeFactory;
import sun.util.resources.cldr.chr.TimeZoneNames_chr;

import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.TimeZone;

public class JsonUtility {
    public static JavaType getJavaType(Type type) {
        //判断是否带有泛型
        if (type instanceof ParameterizedType) {
            Type[] actualTypeArguments = ((ParameterizedType) type).getActualTypeArguments();
            //获取泛型类型
            Class rowClass = (Class) ((ParameterizedType) type).getRawType();
            JavaType[] javaTypes = new JavaType[actualTypeArguments.length];
            for (int i = 0; i < actualTypeArguments.length; i++) {
                //泛型也可能带有泛型，递归获取
                javaTypes[i] = getJavaType(actualTypeArguments[i]);
            }
            return TypeFactory.defaultInstance().constructParametricType(rowClass, javaTypes);
        } else {
            //简单类型直接用该类构建JavaType
            Class cla = (Class) type;
            return TypeFactory.defaultInstance().constructParametricType(cla, new JavaType[0]);
        }
    }

    public static String toObjectString(Object vo) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        //去掉默认的时间戳格式
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        //设置为中国上海时区
        objectMapper.setTimeZone(TimeZone.getTimeZone("GMT+8"));
        //序列化时，日期的统一格式
        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));

        String jsonString=objectMapper.writeValueAsString(vo);
        return jsonString;
    }

    public static <T> T toObject(String str,JavaType javaType) throws IOException {
        //JsonUtil

        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(str,javaType);
    }

    public static <T> T toObject(String str,Class<T> _class) throws IOException {
        //JsonUtil

        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(str,_class);
    }

    public static <T> T toObjectIgnoreProp(String str,Class<T> _class) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();

        //去掉默认的时间戳格式
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        //设置为中国上海时区
        objectMapper.setTimeZone(TimeZone.getTimeZone("GMT+8"));
        //序列化时，日期的统一格式
        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));

        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,false);
        return objectMapper.readValue(str,_class);
    }

    public static <T> List<T> toObjectListIgnoreProp(String str, Class<T> _class) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        //去掉默认的时间戳格式
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        //设置为中国上海时区
        objectMapper.setTimeZone(TimeZone.getTimeZone("GMT+8"));
        //序列化时，日期的统一格式
        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));

        List<T> objList = null;
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,false);
        JavaType t = objectMapper.getTypeFactory().constructParametricType(
                List.class, _class);
        objList = objectMapper.readValue(str, t);

        return objList;
        /*List<_class> listT = mapper.readValue(str,new TypeReference<List<_class>>() { });
        return listT;*/
    }

    public static <T> List<T> toObjectList(String str, Class<T> _class) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        List<T> objList = null;
        JavaType t = mapper.getTypeFactory().constructParametricType(
                List.class, _class);
        objList = mapper.readValue(str, t);

        return objList;
    }

    public static <T,K> T parseEntityToPO(K source,Class<T> _class) throws IOException {
        String jsonStr= JsonUtility.toObjectString(source);
        return JsonUtility.toObjectIgnoreProp(jsonStr, _class);
    }

    public static  <T,K> List<T> parseEntityListToPOList(List<K> entityList,Class<T> _class) throws IOException {
        if(entityList==null){
            return new ArrayList<>();
        }
        String jsonStr= JsonUtility.toObjectString(entityList);
        return JsonUtility.toObjectListIgnoreProp(jsonStr, _class);
    }
    /*public static <T> Map<String,T> toMapT(String jsonString,T obj) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
        TypeReference<HashMap<String,T>> typeRef
                = new TypeReference<HashMap<String,T>>() {};
        Map<String,T> mapResult=objectMapper.readValue(jsonString,typeRef);
        return mapResult;
    }*/
}
