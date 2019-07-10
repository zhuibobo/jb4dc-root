package com.jb4dc.base.service;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/17
 * To change this template use File | Settings | File Templates.
 */
public interface IUpdateBefore <T> {
    T run(JB4DCSession jb4DCSession, T sourceEntity) throws JBuild4DCGenerallyException;
}
