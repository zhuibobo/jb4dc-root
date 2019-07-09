package com.jb4dc.base.service.impl;

import com.jb4dc.base.service.IMetadataService;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exenum.DBTypeEnum;

import java.util.List;
import java.util.Map;

public class MetadataServiceImpl implements IMetadataService {

    ISQLBuilderService sqlBuilderService;

    public MetadataServiceImpl(ISQLBuilderService sqlBuilderService) {
        this.sqlBuilderService = sqlBuilderService;
    }

    @Override
    public String getTableComment(DBTypeEnum dbType, String tableName, String dataBaseName) throws JBuild4DCGenerallyException {
        String sql="";
        if(dbType==DBTypeEnum.sqlserver){
            //throw JBuild4DGenerallyException.getNotSupportMSSQLException();
            sql="SELECT " +
                    "convert(nvarchar(100), A.name) TABLE_NAME,"+
                    "convert(nvarchar(200), C.value) TABLE_COMMENT "+
                    "FROM sys.tables A " +
                    "inner JOIN sys.extended_properties C ON C.major_id = A.object_id  and minor_id=0 and A.name='"+tableName+"'";
        }
        else if(dbType==DBTypeEnum.mysql){
            sql="SELECT * FROM information_schema.tables WHERE table_schema = '"+dataBaseName+"' and table_name=#{tableName}";
        }
        else if(dbType==DBTypeEnum.oracle){
            throw JBuild4DCGenerallyException.getNotSupportOracleException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE);
        }
        Map<String, Object> tableInfo=sqlBuilderService.selectOne(sql,tableName);
        if(tableInfo!=null) {
            if (tableInfo.get("TABLE_COMMENT") != null) {
                return tableInfo.get("TABLE_COMMENT").toString();
            }
        }
        return "";
    }

    @Override
    public List<Map<String, Object>>  getTableFiledComment(DBTypeEnum dbType,String tableName) throws JBuild4DCGenerallyException {
        String sql="";
        if(dbType==DBTypeEnum.sqlserver){
            sql="SELECT " +
                    "convert(nvarchar(100),A.name) AS TABLE_NAME," +
                    "convert(nvarchar(100),B.name) AS COLUMN_NAME," +
                    "convert(nvarchar(200),C.value) AS COLUMN_COMMENT " +
                    "FROM sys.tables A " +
                    "INNER JOIN sys.columns B ON B.object_id = A.object_id " +
                    "LEFT JOIN sys.extended_properties C ON C.major_id = B.object_id AND C.minor_id = B.column_id " +
                    "WHERE A.name = #{tableName}";
        }
        else if(dbType==DBTypeEnum.mysql){
            throw JBuild4DCGenerallyException.getNotSupportMySQLException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE);
        }
        else if(dbType==DBTypeEnum.oracle){
            throw JBuild4DCGenerallyException.getNotSupportOracleException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE);
        }
        List<Map<String, Object>> fieldsInfo=sqlBuilderService.selectList(sql,tableName);
        return fieldsInfo;
    }
}
