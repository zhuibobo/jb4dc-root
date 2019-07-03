package com.jb4dc.base.service;

import com.jb4dc.core.base.exception.JBuild4DGenerallyException;
import com.jb4dc.core.base.session.JB4DSession;

public interface IAddBefore<T> {
     T run(JB4DSession jb4DSession, T sourceEntity) throws JBuild4DGenerallyException;
}
