package com.jb4dc.base.service.provide;

import com.jb4dc.core.base.session.JB4DCSession;

import javax.servlet.http.HttpServletRequest;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/27
 * To change this template use File | Settings | File Templates.
 */
public interface ISessionProvide {
    JB4DCSession provideCustSession(HttpServletRequest request);
}
