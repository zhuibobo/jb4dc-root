package com.jb4dc.base.service.cache;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.base.tools.RedisUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.ehcache.Cache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sun.rmi.runtime.Log;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2021/04/27
 * To change this template use File | Settings | File Templates.
 */
@Service
public class JB4DCCacheManagerV2 {

    public static String Jb4dPlatformBuilderServerCacheName="JB4DC-Builder-Server";
    public static String Jb4dPlatformBuilderClientCacheName="JB4DC-Builder-Client";
    public static String Jb4dPlatformSSOServerCacheName="JB4DC-SSO-Server";
    public static String Jb4dPlatformSSOClientCacheName="JB4DC-SSO-Client";
    public static Long DefExpirationTimeSeconds=300L;

    Logger logger= LoggerFactory.getLogger(this.getClass());

    @Autowired
    RedisUtility redisUtility;

    public String builderCacheKey(String sysName,String moduleName,Class aClass,String classInnerSingleKey) {
       return redisUtility.buildKey(sysName,moduleName,aClass.getCanonicalName(),classInnerSingleKey);
    }

    public <T> T autoGetFromCache(String sysName,String moduleName,Class aClass,String classInnerSingleKey, IBuildGeneralObj<T> builder,Class<T> valueType,long expirationTimeSeconds) throws IOException, JBuild4DCGenerallyException {
        T obj;
        String cacheKey = this.builderCacheKey(sysName, moduleName, aClass, classInnerSingleKey);
        if (redisUtility.hasKey(cacheKey)) {
            logger.info("从缓存中获取数据" + cacheKey);
            String cacheValue = redisUtility.getString(cacheKey);
            return JsonUtility.toObject(cacheValue, valueType);
        } else {
            logger.info("不从缓存中获取数据" + cacheKey);
            obj = builder.BuildObj();
            if (obj == null) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE, "不能将Null存入缓存,Key:" + cacheKey);
            }
            String json = JsonUtility.toObjectString(obj);
            redisUtility.setString(cacheKey, json, expirationTimeSeconds);
        }
        return obj;
    }

    public <T> JBuild4DCResponseVo<List<T>> autoGetFromCacheWithJBuild4DCResponseVo(String sysName,String moduleName,Class aClass,String classInnerSingleKey, IBuildGeneralObj<JBuild4DCResponseVo<List<T>>> builder, Class<T> valueType,
                                                                                    long expirationTimeSeconds) throws JBuild4DCGenerallyException {

        try {
            String cacheKey = this.builderCacheKey(sysName, moduleName, aClass, classInnerSingleKey);
            if (redisUtility.hasKey(cacheKey)) {
                logger.info("从缓存中获取数据" + cacheKey);
                String cacheValue = redisUtility.getString(cacheKey);
                List<T> listData = null;

                listData = JsonUtility.toObjectList(cacheValue, valueType);

                JBuild4DCResponseVo<List<T>> catchResult = JBuild4DCResponseVo.getDataSuccess(listData);
                return catchResult;
            } else {
                JBuild4DCResponseVo<List<T>> obj = builder.BuildObj();
                if (obj == null) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_BUILDER_CODE, "不能将Null存入缓存,Key:" + cacheKey);
                }

                List<T> listData = obj.getData();
                String json = JsonUtility.toObjectString(listData);
                redisUtility.setString(cacheKey, json, expirationTimeSeconds);

                JBuild4DCResponseVo<List<T>> catchResult = JBuild4DCResponseVo.getDataSuccess(listData);
                return catchResult;
            }
        } catch (IOException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,e.getMessage(),e.getCause(),e.getStackTrace());
        }
    }

    public <T> List<T> autoGetFromCacheList(String sysName,String moduleName,Class aClass,String classInnerSingleKey,IBuildGeneralObj<List<T>> builder,Class<T> valueType,long expirationTimeSeconds) throws JBuild4DCGenerallyException, IOException {
        List<T> objList;
        String cacheKey = this.builderCacheKey(sysName, moduleName, aClass, classInnerSingleKey);
        if (redisUtility.hasKey(cacheKey)) {
            logger.info("从缓存中获取数据" + cacheKey);
            String cacheValue = redisUtility.getString(cacheKey);
            return JsonUtility.toObjectList(cacheValue, valueType);
        } else {
            logger.info("不从缓存中获取数据" + cacheKey);
            objList = builder.BuildObj();
            if (objList == null) {
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE, "不能将Null存入缓存,Key:" + cacheKey);
            }
            String json = JsonUtility.toObjectString(objList);
            redisUtility.setString(cacheKey, json, expirationTimeSeconds);
        }
        return objList;
    }

    public void put(String sysName,String moduleName,Class aClass,String classInnerSingleKey, String value,long expirationTimeSeconds){
        String cacheKey = this.builderCacheKey(sysName, moduleName, aClass, classInnerSingleKey);
        redisUtility.setString(cacheKey,value,expirationTimeSeconds);
    }

    public <T> void putT(String sysName,String moduleName,Class aClass,String classInnerSingleKey,T value,long expirationTimeSeconds) throws JsonProcessingException {
        String cacheKey = this.builderCacheKey(sysName, moduleName, aClass, classInnerSingleKey);
        String json = JsonUtility.toObjectString(value);
        redisUtility.setString(cacheKey,json,expirationTimeSeconds);
    }

    public String getString(String sysName,String moduleName,Class aClass,String classInnerSingleKey){
        String cacheKey = this.builderCacheKey(sysName, moduleName, aClass, classInnerSingleKey);
        return redisUtility.getString(cacheKey);
    }

    public <T> T getT(Class<T> valueType,String sysName,String moduleName,Class aClass,String classInnerSingleKey) throws IOException {
        String cacheKey = this.builderCacheKey(sysName, moduleName, aClass, classInnerSingleKey);
        String cacheValue = redisUtility.getString(cacheKey);
        return JsonUtility.toObject(cacheValue, valueType);
    }

    public boolean exist(String sysName,String moduleName,Class aClass,String classInnerSingleKey) {
        String cacheKey = this.builderCacheKey(sysName, moduleName, aClass, classInnerSingleKey);
        return redisUtility.hasKey(cacheKey);
    }
}
