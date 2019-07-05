package com.jb4dc.base.service;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;
import java.util.Map;

public interface IMetadataService {
    String getTableComment(JB4DCSession jb4DSession, String tableName) throws JBuild4DCGenerallyException;

    List<Map<String, Object>> getTableFiledComment(String tableName) throws JBuild4DCGenerallyException;
}
