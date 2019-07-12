package com.jb4dc.base.service.provide;

import com.jb4dc.core.base.session.JB4DCSession;

import javax.servlet.http.HttpServletRequest;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/12
 * To change this template use File | Settings | File Templates.
 */
public interface IOperationLogProvide {
    void writeOperationLog(JB4DCSession session, String systemName, String moduleName, String actionName, String logTypeName, String text, String data, Class targetClass, HttpServletRequest request);
}
