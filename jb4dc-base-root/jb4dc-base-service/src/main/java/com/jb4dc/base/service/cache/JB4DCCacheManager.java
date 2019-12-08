package com.jb4dc.base.service.cache;

import com.jb4dc.base.tools.BeanUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import org.ehcache.Cache;
import org.ehcache.CacheManager;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */
public abstract class JB4DCCacheManager {

    /*public static String jb4dPlatformBuilderCacheName="jb4dPlatformBuilder";
    public static String jb4dPlatformSSOCacheName="jb4dPlatformSSO";
    public static String jb4dPlatformSSOSessionStoreName="SSOSessionStore";

    public static String CACHE_KEY_USER_HEAD_IMG="JB4DCacheManager.CACHE_KEY_USER_HEAD_IMG";
    public static String CACHE_KEY_ORGAN_LOGO="JB4DCacheManager.CACHE_KEY_ORGAN_LOGO";
    public static String CACHE_KEY_PROCESS_MODEL_MAIN_IMAGE="JB4DCacheManager.CACHE_KEY_PROCESS_MODEL_MAIN_IMAGE";
    public static String CACHE_KEY_SSO_APP_LOGO="JB4DCacheManager.CACHE_KEY_SSO_APP_LOGO";*/

    private CacheManager cacheManager = null;

    public JB4DCCacheManager(CacheManager _cacheManager) {
        cacheManager=_cacheManager;
    }

    public <K, V> Cache<K,V> getCache(String keyGroup, Class<K> key, Class<V> value){
        return cacheManager.getCache(keyGroup,key,value);
    }

    public void put(String cacheName, String key, String value){
        cacheManager.getCache(cacheName,String.class,String.class).put(key,value);
    }

    public void put(String cacheName,String key,Object value){
        cacheManager.getCache(cacheName,String.class,Object.class).put(key,value);
    }

   /* public static <T> void putT(String cacheName,String key,T value){
        cacheManager.getCache(cacheName,String.class,value.getClass()).put(key,value);
    }*/

    public <T> T getString(String cacheName,String key){
        return (T) cacheManager.getCache(cacheName,String.class,String.class).get(key);
    }

    public <T> T getObject(String cacheName,String key){
        return (T) cacheManager.getCache(cacheName,String.class,Object.class).get(key);
    }

    public boolean exist(String cacheName, String key) throws JBuild4DCGenerallyException {
        Cache<String, Object> cache = cacheManager.getCache(cacheName, String.class, Object.class);
        if(cache==null){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"不存在名称为:"+cacheName+"的缓存配置!");
        }
        return cache.get(key) != null ? true : false;
    }

    public <T> T autoGetFromCache(String cacheName,boolean cancelCache,String key,IBuildGeneralObj<T> builder) throws JBuild4DCGenerallyException {
        T result=null;
        if(cancelCache){
            result=builder.BuildObj();
            return result;
        }
        else{
            result= this.getObject(cacheName,key);
            if(result==null){
                result=builder.BuildObj();
                this.put(cacheName,key,result);
                return result;
            }
            return result;
        }
    }
}
