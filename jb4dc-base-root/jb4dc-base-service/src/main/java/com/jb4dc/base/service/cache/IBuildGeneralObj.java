package com.jb4dc.base.service.cache;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

public interface IBuildGeneralObj<T> {
    T BuildObj() throws JBuild4DCGenerallyException;
}
