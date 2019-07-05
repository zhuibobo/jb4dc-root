package com.jb4dc.code.generate.service.impl;

import com.jb4dc.code.generate.service.IDataSourceManager;
import com.jb4dc.code.generate.service.IDataSourceService;
import com.jb4dc.code.generate.vo.DataSourceSingleVo;
import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.Nullable;

import javax.xml.bind.JAXBException;
import java.beans.PropertyVetoException;
import java.io.FileNotFoundException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/5
 * To change this template use File | Settings | File Templates.
 */
public class DataSourceManagerImpl implements IDataSourceManager {

    IDataSourceService dataSourceService;

    public DataSourceManagerImpl(IDataSourceService _dataSourceService) {
        dataSourceService=_dataSourceService;
    }

    @Override
    public JdbcTemplate getJdbcTemplate(String dataSourceId) throws PropertyVetoException, FileNotFoundException, JAXBException {
        ComboPooledDataSource comboPooledDataSource=new ComboPooledDataSource();
        DataSourceSingleVo dataSourceSingleVo=dataSourceService.getSingleDataSourceConfig(dataSourceId);
        /*if(dbLinkEntity.getDbIsLocation().equals(TrueFalseEnum.True.getDisplayName())){
            dbLinkEntity.setDbDriverName(DBProp.getDriverName());
            dbLinkEntity.setDbDatabaseName(DBProp.getDatabaseName());
            dbLinkEntity.setDbUser(DBProp.getUser());
            dbLinkEntity.setDbPassword(DBProp.getPassword());
            dbLinkEntity.setDbUrl(DBProp.getUrl());
        }*/

        comboPooledDataSource.setDriverClass(dataSourceSingleVo.getDriverName());
        comboPooledDataSource.setJdbcUrl(dataSourceSingleVo.getUrl());
        comboPooledDataSource.setUser(dataSourceSingleVo.getUser());
        comboPooledDataSource.setPassword(dataSourceSingleVo.getPassword());
        JdbcTemplate jdbcTemplate=new JdbcTemplate(comboPooledDataSource);
        return jdbcTemplate;
    }

    @Override
    public void execute(String dataSourceId, String sql) throws PropertyVetoException, FileNotFoundException, JAXBException {
        JdbcTemplate jdbcTemplate=getJdbcTemplate(dataSourceId);
        jdbcTemplate.execute(sql);
    }

    @Override
    public void execute(String dataSourceId, String sql, PreparedStatementCallback preparedStatementCallback) throws PropertyVetoException, FileNotFoundException, JAXBException {
        JdbcTemplate jdbcTemplate=getJdbcTemplate(dataSourceId);
        jdbcTemplate.execute(sql,preparedStatementCallback);
    }

    @Override
    public Map selectOne(String dataSourceId, String sql) throws PropertyVetoException, FileNotFoundException, JAXBException {
        JdbcTemplate jdbcTemplate=getJdbcTemplate(dataSourceId);
        //jdbcTemplate.
        List<Object> strLst=jdbcTemplate.query(sql, new RowMapper<Object>() {
            @Override
            public Object mapRow(ResultSet resultSet, int i) throws SQLException {
                return 1;
            }
        });
        if(strLst.isEmpty()){
            return null;
        }
        return jdbcTemplate.queryForMap(sql);
    }

    @Override
    public List<Map<String,Object>> selectList(String dataSourceId, String sql,@Nullable Object... args) throws PropertyVetoException, FileNotFoundException, JAXBException {
        JdbcTemplate jdbcTemplate=getJdbcTemplate(dataSourceId);
        //jdbcTemplate.
        /*List<Object> strLst=jdbcTemplate.query(sql, new RowMapper<Object>() {
            @Override
            public Object mapRow(ResultSet resultSet, int i) throws SQLException {
                return 1;
            }
        });
        if(strLst.isEmpty()){
            return null;
        }*/
        return jdbcTemplate.queryForList(sql,args);
    }
}
