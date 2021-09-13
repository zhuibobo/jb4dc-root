package com.jb4dc.feb.dist.webserver.controlleradvice;

import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exception.JBuild4DCSessionTimeoutException;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.apache.ibatis.binding.BindingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/20
 * To change this template use File | Settings | File Templates.
 */

@ControllerAdvice
public class ExceptionControllerAdvice {

    Logger logger = LoggerFactory.getLogger(ExceptionControllerAdvice.class);

    @ExceptionHandler(IOException.class)
    public void processIOException(HttpServletResponse response, HttpServletRequest request, IOException e) {
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");
        handlerGenerallyException(response, request, e);
    }

    @ExceptionHandler(JBuild4DCGenerallyException.class)
    public void processGenerallyException(HttpServletResponse response, HttpServletRequest request, JBuild4DCGenerallyException e) {
        logger.error(e.getMessage());
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");
        handlerGenerallyException(response, request, e);
    }

    @ExceptionHandler(NullPointerException.class)
    public void processNullPointerException(HttpServletResponse response, HttpServletRequest request, NullPointerException e) {
        //logger.error(e.getMessage());
        logger.error("空指针错误!",e);
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");
        handlerGenerallyException(response, request, e);
    }

    @ExceptionHandler(ServletException.class)
    public void processServletException(HttpServletResponse response, HttpServletRequest request, JBuild4DCGenerallyException e) {
        logger.error(e.getMessage());
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");
        handlerGenerallyException(response, request, e);
    }

    private void handlerGenerallyException(HttpServletResponse response, HttpServletRequest request, Exception e) {
        try {
            String msg=e.getMessage();
            if(StringUtility.isEmpty(msg)){
                msg="null Exception";
            }
            String traceMsg=org.apache.commons.lang3.exception.ExceptionUtils.getStackTrace(e);
            response.getWriter().print(JsonUtility.toObjectString(JBuild4DCResponseVo.error(msg,traceMsg)));
        } catch (IOException e1) {
            logger.error(request.getRequestURI()+":"+e1.getMessage(),e1);
            e1.printStackTrace();
        }
    }

    @ExceptionHandler(JBuild4DCSessionTimeoutException.class)
    public ModelAndView processSessionTimeoutException(HttpServletResponse response, HttpServletRequest request, JBuild4DCSessionTimeoutException e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");
        try {
            //request.getSession().setAttribute("theme",request.getContextPath()+"/Themes/Default");
            response.getWriter().print(JsonUtility.toObjectString(JBuild4DCResponseVo.error(e.getMessage())));
        } catch (IOException e1) {
            e1.printStackTrace();
        }
        ModelAndView mv=new ModelAndView("SessionTimeout");
        return mv;
    }

    @ExceptionHandler(BindingException.class)
    public void processMyBatisBindingException(HttpServletResponse response, HttpServletRequest request, BindingException e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");
        try {
            response.getWriter().print(JsonUtility.toObjectString(JBuild4DCResponseVo.error(e.getMessage())));
        } catch (IOException e1) {
            e1.printStackTrace();
        }
    }
}
