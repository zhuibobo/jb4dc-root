package com.jb4dc.base.service;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exenum.DBTypeEnum;

import java.util.List;
import java.util.Map;

public interface IMetadataService {
    String getTableComment(DBTypeEnum dbType, String tableName, String dataBaseName) throws JBuild4DCGenerallyException;

    List<Map<String, Object>> getTableFiledComment(DBTypeEnum dbType,String tableName) throws JBuild4DCGenerallyException;
}
