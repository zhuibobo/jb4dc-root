package com.jb4dc.base.service;

import com.jb4dc.core.base.exception.JBuild4DGenerallyException;
import com.jb4dc.core.base.session.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/17
 * To change this template use File | Settings | File Templates.
 */
public interface IUpdateBefore <T> {
    T run(JB4DSession jb4DSession, T sourceEntity) throws JBuild4DGenerallyException;
}
