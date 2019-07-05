package com.jb4dc.code.generate.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.lang.Nullable;

import javax.xml.bind.JAXBException;
import java.beans.PropertyVetoException;
import java.io.FileNotFoundException;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/5
 * To change this template use File | Settings | File Templates.
 */
public interface IDataSourceManager {
    JdbcTemplate getJdbcTemplate(String dataSourceId) throws PropertyVetoException, FileNotFoundException, JAXBException;

    void execute(String dataSourceId, String sql) throws PropertyVetoException, FileNotFoundException, JAXBException;

    void execute(String dataSourceId, String sql, PreparedStatementCallback preparedStatementCallback) throws PropertyVetoException, FileNotFoundException, JAXBException;

    Map selectOne(String dataSourceId, String sql) throws PropertyVetoException, FileNotFoundException, JAXBException;

    List<Map<String,Object>> selectList(String dataSourceId, String sql,@Nullable Object... args) throws PropertyVetoException, FileNotFoundException, JAXBException;
}
