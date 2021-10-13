package com.jb4dc.feb.dist.webserver.interceptor;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.core.base.session.JB4DCSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

public class JB4DCSessionInterceptor implements HandlerInterceptor{
    private static Logger logger = LoggerFactory.getLogger(JB4DCSessionInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        //Map<String, String> igUrl = new HashMap<>();
        //igUrl.put("HTML/LoginSSO.html", "");
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSession();
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }
}
