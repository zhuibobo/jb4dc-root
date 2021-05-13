package com.jb4dc.base.service.aspect;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.cache.JB4DCCacheManagerV2;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.base.tools.RedisUtility;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Arrays;

@Aspect
@Component
public class ClientCallRemoteCacheAspect {
    final static Logger logger = LoggerFactory.getLogger(CalculationRunTimeAspect.class);

    //ThreadLocal<Long> beginTime = new ThreadLocal<>();
    @Autowired
    RedisUtility redisUtility;

    @Pointcut("@annotation(clientCallRemoteCache)")
    public void serviceStatistics(ClientCallRemoteCache clientCallRemoteCache) {
    }

    @Around("serviceStatistics(clientCallRemoteCache)")
    public Object doAround(ProceedingJoinPoint joinPoint, ClientCallRemoteCache clientCallRemoteCache) {
        Object result=null;
        Long defExpirationTimeSeconds= Long.valueOf(clientCallRemoteCache.expirationTimeSeconds());

        String packageName = joinPoint.getSignature().getDeclaringTypeName();
        String moduleName=packageName.substring(packageName.lastIndexOf(".")+1);
        String methodName = StringUtility.firstCharUpper(joinPoint.getSignature().getName());

        String sysName="JB4DC-General";
        if(packageName.toUpperCase().indexOf("COM.JB4DC.SSO.CLIENT.REMOTE")==0){
            sysName= JB4DCCacheManagerV2.Jb4dPlatformSSOClientCacheName;//"JB4DC-SSO-Client";
        }
        else if(packageName.toUpperCase().indexOf("COM.JB4DC.BUILDER.CLIENT.REMOTE")==0){
            sysName=JB4DCCacheManagerV2.Jb4dPlatformBuilderClientCacheName;//"JB4DC-Builder-Client";
        }
        else if(packageName.toUpperCase().indexOf("COM.JB4DC.WORKFLOW.CLIENT.REMOTE")==0){
            sysName=JB4DCCacheManagerV2.Jb4dPlatformWorkFlowClientCacheName;//"JB4DC-WorkFlow-Client";
        }

        //String moduleName="";
        //String groupName="";

        //拼接redis存储数据的key
        Object[] args=joinPoint.getArgs();
        String key= redisUtility.buildKey(sysName,moduleName,methodName,Arrays.toString(args));
        if(redisUtility.hasKey(key)){
            String json = redisUtility.getString(key);
            //动态获取方法的返回值类型  向上转型  向下转型
            MethodSignature methodSignature=(MethodSignature)joinPoint
                    .getSignature();
            //表示客户端传来什么类型就返回什么类型
            //Class returnType = methodSignature.getReturnType();
            Type gType=((MethodSignature) joinPoint.getSignature()).getMethod().getGenericReturnType();
            //Class returnType =  gType.getClass();
            //需要将json串转化为对象
            try {
                //result= JsonUtility.toObject(json, returnType);
                //ObjectMapper objectMapper = new ObjectMapper();
                //return objectMapper.readValue(json, JsonUtility.getJavaType(gType));
                result= JsonUtility.toObject(json, JsonUtility.getJavaType(gType));
            } catch (IOException e) {
                e.printStackTrace();
            }
            logger.info(key+"从redis缓存中的数据");
            //System.out.println("redis缓存中的数据");
        }
        else{
            //表示数据不存在，需要在数据库中查询
            try {
                result=joinPoint.proceed();//执行目标方法和通知
            } catch (Throwable throwable) {
                throwable.printStackTrace();
            }

            JBuild4DCResponseVo jBuild4DCResponseVo= (JBuild4DCResponseVo) result;
            if(jBuild4DCResponseVo.isSuccess()){
                //将查询的数据存储到redis缓存中
                String json = null;
                try {
                    json = JsonUtility.toObjectString(result);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
                if(StringUtility.isNotEmpty(json)) {
                    redisUtility.setString(key, json, defExpirationTimeSeconds);
                }
            }

            logger.info(key+"从远程接口中获取数据");
            //System.out.println("aop执行目标方法查询数据库");
        }
        return result;
        //log.info("计算信息:{}", clientCallRemoteCache.expirationTimeSeconds());

        /*JBuild4DCResponseVo<List<MenuPO>> jBuild4DCResponseVo =jb4DCCacheManagerV2.autoGetFromCacheWithJBuild4DCResponseVo(JB4DCCacheManagerV2.Jb4dPlatformSSOClientCacheName,
                "Proxy",
                this.getClass(),
                "1", () -> joinPoint., MenuPO.class,JB4DCCacheManagerV2.DefExpirationTimeSeconds);
        return jBuild4DCResponseVo;*/
    }

    @After("serviceStatistics(clientCallRemoteCache)")
    public void doAfter(ClientCallRemoteCache clientCallRemoteCache) {
        //log.info("Note:{}/Time:{}", clientCallRemoteCache.expirationTimeSeconds(), System.currentTimeMillis() - beginTime.get());
    }
}