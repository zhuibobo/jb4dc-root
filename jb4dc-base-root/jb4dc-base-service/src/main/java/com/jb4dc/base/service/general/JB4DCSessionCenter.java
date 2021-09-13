package com.jb4dc.base.service.general;

import com.jb4dc.base.tools.RedisUtility;
import com.jb4dc.core.base.exception.JBuild4DCSessionTimeoutException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class JB4DCSessionCenter {

    public static String WebClientCookieSessionKeyName="JB4DC-Session-Cookie-Id";
    public static String WebClientHeaderSessionKeyName="JB4DC-Session-Header-Id";

    static RedisUtility redisUtility;

    public JB4DCSessionCenter(RedisUtility redisUtility) {
        this.redisUtility = redisUtility;
    }

    public static String newCookieSessionId(){
        return redisUtility.buildKey("JB4DC-SSO","JB4DCSessionCenter","Center", UUID.randomUUID().toString());
    }

    public static boolean existSession(String cookieSessionId){
        return redisUtility.hasKey(cookieSessionId);
    }

    public static JB4DCSession getSession(String cookieSessionId) throws JBuild4DCSessionTimeoutException {
        JB4DCSession session= (JB4DCSession) redisUtility.get(cookieSessionId);
        return session;
    }

    public static boolean saveSession(String cookieSessionId,JB4DCSession session) throws JBuild4DCSessionTimeoutException {
        return redisUtility.set(cookieSessionId,session,72000);
    }

    public static boolean saveSession(String cookieSessionId,JB4DCSession session,int time) throws JBuild4DCSessionTimeoutException {
        return redisUtility.set(cookieSessionId,session,time);
    }

    public static boolean saveTempSession(String tempId,JB4DCSession session) throws JBuild4DCSessionTimeoutException {
        return redisUtility.set(tempId,session,10);
    }

    public static boolean removeSession(String cookieSessionId){
        redisUtility.del(cookieSessionId);
        return true;
    }

    public static boolean saveUserSessionWithUserId(String userId,JB4DCSession session) {
        return saveUserSessionWithUserId(userId,session,-1);
    }

    public static boolean saveUserSessionWithUserId(String userId,JB4DCSession session,int time) {
        String key = redisUtility.buildKey("JB4DC-SSO", "JB4DCSessionCenter", "UserInfo", userId);
        return redisUtility.set(key, session,time);
    }

    public static JB4DCSession getUserSessionByUserId(String userId) {
        String key = redisUtility.buildKey("JB4DC-SSO", "JB4DCSessionCenter", "UserInfo", userId);
        JB4DCSession session = (JB4DCSession) redisUtility.get(key);
        return session;
    }
}
