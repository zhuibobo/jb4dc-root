package com.jb4dc.base.tools;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.WebApplicationContext;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */

@Service
public class BeanUtility {
    private static WebApplicationContext context;

    public static WebApplicationContext getContext() {
        return context;
    }

    @Autowired
    public BeanUtility(WebApplicationContext _context){
        this.context=_context;
    }

    public static void setContext(WebApplicationContext _context) {
        context = _context;
    }

    public static <T> T getBean(String name){
        return  ((T) context.getBean(name));
    }

    public static <T> T getBean(Class<T> classT){
        return context.getBean(classT);
    }

    public static boolean containsBean(String name){
        return context.containsBean(name);
    }
}
