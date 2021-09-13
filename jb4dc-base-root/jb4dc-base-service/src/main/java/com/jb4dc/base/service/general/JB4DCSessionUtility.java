package com.jb4dc.base.service.general;

import com.jb4dc.base.service.provide.ISessionProvide;
import com.jb4dc.base.tools.BeanUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCRunTimeException;
import com.jb4dc.core.base.exception.JBuild4DCSessionTimeoutException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.CookieUtility;
import com.jb4dc.core.base.tools.StringUtility;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.server.reactive.ServerHttpRequest;

@Service
public class JB4DCSessionUtility {

    //@Autowired
    //static RedisUtility redisUtility;

    /*public JB4DCSessionUtility(RedisUtility redisUtility) {
        this.redisUtility = redisUtility;
    }*/

    public static String UserLoginSessionKey="JB4DCSession";
    public static String EXSessionKey1="EXSessionKey1";

    public static boolean isUnitTest=false;
    private static JB4DCSession unitTestMockSession=null;

    public static void setUnitTestMockSession(JB4DCSession unitTestMockSession) {
        String cookieSessionId= JB4DCSessionCenter.newCookieSessionId();
        unitTestMockSession.setCookieSessionId(cookieSessionId);
        JB4DCSessionUtility.unitTestMockSession = unitTestMockSession;
        JB4DCSessionCenter.saveSession(cookieSessionId,unitTestMockSession,60);
        JB4DCSessionCenter.saveUserSessionWithUserId(unitTestMockSession.getUserId(),unitTestMockSession,60);
    }

    //@Autowired(required = false)
    //static ISessionProvide sessionProvide;

    public static void setSessionToWebContext(JB4DCSession session) throws JBuild4DCSessionTimeoutException {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        ((HttpServletRequest) request).getSession().setAttribute(JB4DCSessionUtility.UserLoginSessionKey, session);
    }

    public static JB4DCSession getSessionForGateWay(ServerHttpRequest serverHttpRequest){
        String cookieSessionId=serverHttpRequest.getCookies().get(JB4DCSessionCenter.WebClientCookieSessionKeyName).get(0).getValue();
        return getSession(cookieSessionId);
    }

    public static JB4DCSession getSession(String sessionId) throws JBuild4DCSessionTimeoutException {
        if(isUnitTest){
            return unitTestMockSession;
        }

        if(StringUtils.isNotEmpty(sessionId)){
            return JB4DCSessionCenter.getSession(sessionId);
        }
        throw new JBuild4DCRunTimeException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"找不到对应的Session信息,SessionId:"+sessionId);
    }

    /**
     * 返回必须通过request请求调用
     * @return
     * @throws JBuild4DCSessionTimeoutException session超时时抛出
     */
    public static JB4DCSession getSession() throws JBuild4DCSessionTimeoutException {
        if(isUnitTest){
            return unitTestMockSession;
        }

        HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String sessionId= CookieUtility.get(req,JB4DCSessionCenter.WebClientCookieSessionKeyName)!=null?CookieUtility.get(req,JB4DCSessionCenter.WebClientCookieSessionKeyName).getValue():"";
        if(StringUtils.isEmpty(sessionId)&&StringUtility.isNotEmpty(req.getHeader(JB4DCSessionCenter.WebClientHeaderSessionKeyName))) {
            sessionId = req.getHeader(JB4DCSessionCenter.WebClientHeaderSessionKeyName);
        }
        if(!StringUtils.isEmpty(sessionId)){
            return JB4DCSessionCenter.getSession(sessionId);
        }
        JB4DCSession b4DSession = (JB4DCSession)req.getSession().getAttribute(UserLoginSessionKey);
        if(b4DSession == null) {
            throw new JBuild4DCSessionTimeoutException();
        }
        return b4DSession;
        /*HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        if(request == null) {
            throw new JBuild4DCRunTimeException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"HttpServletRequest对象为空,没有运行在Web容器中");
        }
        JB4DCSession b4DSession = (JB4DCSession)request.getSession().getAttribute(UserLoginSessionKey);
        if(b4DSession == null) {
            throw new JBuild4DCSessionTimeoutException();
        }
        return b4DSession;*/
        /*JB4DCSession session=getSessionNotException();
        if(session==null){
            throw new JBuild4DCSessionTimeoutException();
        }
        return session;*/
    }

    public static JB4DCSession getSessionAndCheck() throws JBuild4DCGenerallyException {
        HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        HttpServletResponse rep = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
        if(rep.isCommitted()){
            return null;
        }
        JB4DCSession jb4DCSession;
        try {
            jb4DCSession = getSession();
        }
        catch (JBuild4DCSessionTimeoutException timeoutException){
            return null;
        }
        if(jb4DCSession==null){
            return null;
        }

        if(jb4DCSession.getJaSessionId().equals(req.getSession().getId())){
            return jb4DCSession;
        }
        else{
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_SSO_CODE,"JSessionId不匹配!");
        }
    }

    public static String InitSystemSsoSessionToken="GoingMerry-DDDD-DDDD-DDDD-DDDD";
    public static JB4DCSession getInitSystemSession(){
        JB4DCSession session=new JB4DCSession();
        session.setOrganName("黄金梅丽号");
        session.setOrganId("GoingMerry");
        session.setUserName("ONE-PIECE");
        session.setUserId("DDDD-DDDD-DDDD-DDDD");
        session.setSsoSessionToken(InitSystemSsoSessionToken);
        return session;
    }

    public static JB4DCSession getSessionForClientPageStore(){
        JB4DCSession b4DSession = new JB4DCSession();
        JB4DCSession b4DSessionSource=getSession();
        b4DSession.setAccountId(b4DSessionSource.getAccountId());
        b4DSession.setOrganId(b4DSessionSource.getOrganId());
        b4DSession.setOrganName(b4DSessionSource.getOrganName());
        b4DSession.setUserId(b4DSessionSource.getUserId());
        b4DSession.setUserName(b4DSessionSource.getUserName());
        b4DSession.setMainDepartmentId(b4DSessionSource.getMainDepartmentId());
        b4DSession.setMainDepartmentName(b4DSessionSource.getMainDepartmentName());
        return b4DSession;
    }

    public static JB4DCSession getSessionNotException() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        if(request == null) {
            throw new JBuild4DCRunTimeException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"HttpServletRequest对象为空,没有运行在Web容器中");
        }
        JB4DCSession b4DSession = (JB4DCSession)request.getSession().getAttribute(UserLoginSessionKey);
        ISessionProvide sessionProvide=BeanUtility.getBean(ISessionProvide.class);
        if(b4DSession==null&&sessionProvide!=null){
            b4DSession=sessionProvide.provideCustSession(request);
        }
        return b4DSession;
    }

    /*public static String sendJSessionIdToClient(HttpServletRequest request){
        String jSessionId=request.getSession().getId();
        return jSessionId;
    }*/

    public static void addSessionAttr(String key,Object value){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        if(request == null) {
            throw new JBuild4DCSessionTimeoutException();
        }
        request.getSession().setAttribute(key,value);
    }

    public static void addLocationLoginedJB4DCSession(JB4DCSession jb4DCSession) {
        addSessionAttr(UserLoginSessionKey, jb4DCSession);
    }

    public static Object getSessionAttr(String key){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        if(request == null) {
            throw new JBuild4DCSessionTimeoutException();
        }
        return request.getSession().getAttribute(key);
    }

    public static boolean containKey(String key){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        if(request == null) {
            throw new JBuild4DCSessionTimeoutException();
        }
        Object tempObj=request.getSession().getAttribute(key);
        if(tempObj==null){
            return false;
        }
        return true;
    }

    public static void clearMyLocationLoginedJB4DCSession() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        request.getSession().removeAttribute(UserLoginSessionKey);
    }

    /*public static void setUserInfoToMV(ModelAndView modelAndView) throws JsonProcessingException {
        JB4DCSession jb4DCSession=getSession();
        modelAndView.addObject("currUserEntity", JsonUtility.toObjectString(jb4DCSession));
    }*/

    public static JB4DCSession getTempSession(String organId,String organName,String userId,String userName){
        JB4DCSession jb4DCSession=new JB4DCSession();
        jb4DCSession.setOrganId(organId);
        jb4DCSession.setOrganName(organName);
        jb4DCSession.setUserId(userId);
        jb4DCSession.setUserName(userName);
        jb4DCSession.setFullAuthority(false);
        return jb4DCSession;
    }
}
