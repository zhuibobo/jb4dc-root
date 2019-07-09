package com.jb4dc.base.service.general;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.exception.JBuild4DCSessionTimeoutException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

public class JB4DCSessionUtility {

    public static String UserLoginSessionKey="JB4DSession";
    public static String EXSessionKey1="EXSessionKey1";

    /**
     * 返回必须通过request请求调用
     * @return
     * @throws JBuild4DCSessionTimeoutException session超时时抛出
     */
    public static JB4DCSession getSession() throws JBuild4DCSessionTimeoutException {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        if(request == null) {
            throw new JBuild4DCSessionTimeoutException();
        }
        JB4DCSession b4DSession = (JB4DCSession)request.getSession().getAttribute(UserLoginSessionKey);
        if(b4DSession == null) {
            throw new JBuild4DCSessionTimeoutException();
        }
        return b4DSession;
    }

    public static JB4DCSession getSessionToClientStore(){
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
            throw new JBuild4DCSessionTimeoutException();
        }
        JB4DCSession b4DSession = (JB4DCSession)request.getSession().getAttribute(UserLoginSessionKey);
        if(b4DSession == null) {
            return null;
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

    public static void clearMySession() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        request.getSession().removeAttribute(UserLoginSessionKey);
    }

    public static void setUserInfoToMV(ModelAndView modelAndView) throws JsonProcessingException {
        JB4DCSession jb4DSession=getSession();
        modelAndView.addObject("currUserEntity", JsonUtility.toObjectString(jb4DSession));
    }
}
