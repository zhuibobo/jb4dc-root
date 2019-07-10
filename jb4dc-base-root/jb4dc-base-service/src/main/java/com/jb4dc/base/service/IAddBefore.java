package com.jb4dc.base.service;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

public interface IAddBefore<T> {
     T run(JB4DCSession jb4DCSession, T sourceEntity) throws JBuild4DCGenerallyException;
}
