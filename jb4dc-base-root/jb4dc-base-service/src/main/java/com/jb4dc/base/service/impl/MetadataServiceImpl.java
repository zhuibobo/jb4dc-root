package com.jb4dc.base.service.impl;

import com.jb4dc.base.dbaccess.dynamic.ISQLBuilderMapper;
import com.jb4dc.base.dbaccess.dynamic.impl.SQLBuilderMapper;
import com.jb4dc.base.dbaccess.dynamic.impl.TemporarySqlSessionFactoryBuilder;
import com.jb4dc.base.service.IMetadataService;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.exenum.DBTypeEnum;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

public class MetadataServiceImpl implements IMetadataService {

    ISQLBuilderService sqlBuilderService;
    SqlSession sqlSession;

    String driver;
    String url;
    String username;
    String password;

    //public MetadataServiceImpl(ISQLBuilderService sqlBuilderService) {
    //    this.sqlBuilderService = sqlBuilderService;
    //}

    private MetadataServiceImpl(){

    }

    public static MetadataServiceImpl getInstance(String driver, String url, String username, String password){

        MetadataServiceImpl metadataService=new MetadataServiceImpl();
        metadataService.driver=driver;
        metadataService.url=url;
        metadataService.username=username;
        metadataService.password=password;

        return metadataService;
    }

    @Override
    public String getTableComment(DBTypeEnum dbType, String tableName, String dataBaseName) throws JBuild4DCGenerallyException {
        SqlSessionFactory sqlSessionFactory= TemporarySqlSessionFactoryBuilder.build(driver,url,username,password);
        SqlSession sqlSession=sqlSessionFactory.openSession();

        ISQLBuilderMapper sqlBuilderMapper=new SQLBuilderMapper(sqlSession);
        ISQLBuilderService sqlBuilderService=new SQLBuilderServiceImpl(sqlBuilderMapper);

        try {
            String sql = "";
            if (dbType == DBTypeEnum.sqlserver) {
                //throw JBuild4DCGenerallyException.getNotSupportMSSQLException();
                sql = "SELECT " +
                        "convert(nvarchar(100), A.name) TABLE_NAME," +
                        "convert(nvarchar(200), C.value) TABLE_COMMENT " +
                        "FROM sys.tables A " +
                        "inner JOIN sys.extended_properties C ON C.major_id = A.object_id  and minor_id=0 and A.name='" + tableName + "'";
            } else if (dbType == DBTypeEnum.mysql) {
                sql = "SELECT * FROM information_schema.tables WHERE table_schema = '" + dataBaseName + "' and table_name=#{tableName}";
            } else if (dbType == DBTypeEnum.oracle) {
                throw JBuild4DCGenerallyException.getNotSupportOracleException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE);
            }

            Map<String, Object> tableInfo = sqlBuilderService.selectOne(sql, tableName);

            if (tableInfo != null) {
                if (tableInfo.get("TABLE_COMMENT") != null) {
                    return tableInfo.get("TABLE_COMMENT").toString();
                }
            }
            return "";
        }
        finally {
            sqlSession.close();
        }
    }

    @Override
    public List<Map<String, Object>>  getTableFiledComment(DBTypeEnum dbType,String tableName) throws JBuild4DCGenerallyException {
        SqlSessionFactory sqlSessionFactory = TemporarySqlSessionFactoryBuilder.build(driver, url, username, password);
        SqlSession sqlSession = sqlSessionFactory.openSession();

        ISQLBuilderMapper sqlBuilderMapper = new SQLBuilderMapper(sqlSession);
        ISQLBuilderService sqlBuilderService = new SQLBuilderServiceImpl(sqlBuilderMapper);
        try {
            String sql = "";
            if (dbType == DBTypeEnum.sqlserver) {
                sql = "SELECT " +
                        "convert(nvarchar(100),A.name) AS TABLE_NAME," +
                        "convert(nvarchar(100),B.name) AS COLUMN_NAME," +
                        "convert(nvarchar(200),C.value) AS COLUMN_COMMENT " +
                        "FROM sys.tables A " +
                        "INNER JOIN sys.columns B ON B.object_id = A.object_id " +
                        "LEFT JOIN sys.extended_properties C ON C.major_id = B.object_id AND C.minor_id = B.column_id " +
                        "WHERE A.name = #{tableName}";
            } else if (dbType == DBTypeEnum.mysql) {
                throw JBuild4DCGenerallyException.getNotSupportMySQLException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE);
            } else if (dbType == DBTypeEnum.oracle) {
                throw JBuild4DCGenerallyException.getNotSupportOracleException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE);
            }
            List<Map<String, Object>> fieldsInfo = sqlBuilderService.selectList(sql, tableName);
            return fieldsInfo;
        } finally {
            sqlSession.close();
        }
    }
}
