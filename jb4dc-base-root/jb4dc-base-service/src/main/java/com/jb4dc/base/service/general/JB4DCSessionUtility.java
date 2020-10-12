package com.jb4dc.base.service.general;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.service.provide.ISessionProvide;
import com.jb4dc.base.tools.BeanUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCRunTimeException;
import com.jb4dc.core.base.exception.JBuild4DCSessionTimeoutException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Service
public class JB4DCSessionUtility {

    public static String UserLoginSessionKey="JB4DCSession";
    public static String EXSessionKey1="EXSessionKey1";

    //@Autowired(required = false)
    //static ISessionProvide sessionProvide;

    /**
     * 返回必须通过request请求调用
     * @return
     * @throws JBuild4DCSessionTimeoutException session超时时抛出
     */
    public static JB4DCSession getSession() throws JBuild4DCSessionTimeoutException {
        /*HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        if(request == null) {
            throw new JBuild4DCRunTimeException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"HttpServletRequest对象为空,没有运行在Web容器中");
        }
        JB4DCSession b4DSession = (JB4DCSession)request.getSession().getAttribute(UserLoginSessionKey);
        if(b4DSession == null) {
            throw new JBuild4DCSessionTimeoutException();
        }
        return b4DSession;*/
        JB4DCSession session=getSessionNotException();
        if(session==null){
            throw new JBuild4DCSessionTimeoutException();
        }
        return session;
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

    public static void setUserInfoToMV(ModelAndView modelAndView) throws JsonProcessingException {
        JB4DCSession jb4DCSession=getSession();
        modelAndView.addObject("currUserEntity", JsonUtility.toObjectString(jb4DCSession));
    }

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
