package com.jb4dc.base.service.impl;

import com.jb4dc.base.dbaccess.dynamic.ISQLBuilderMapper;
import com.jb4dc.base.dbaccess.dynamic.impl.SQLBuilderMapper;
import com.jb4dc.base.dbaccess.dynamic.impl.TemporarySqlSessionFactoryBuilder;
import com.jb4dc.base.service.ISQLBuilderService;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/6
 * To change this template use File | Settings | File Templates.
 */

public class SQLBuilderServiceImpl implements ISQLBuilderService {

    ISQLBuilderMapper sqlBuilderMapper;

    public SQLBuilderServiceImpl(ISQLBuilderMapper sqlBuilderMapper) {
        this.sqlBuilderMapper = sqlBuilderMapper;
    }

    @Override
    public Map<String, Object> selectOne(String sql, Object value) {
        return sqlBuilderMapper.selectOne(sql,value);
    }

    @Override
    public List<Map<String, Object>> selectList(String sql, Map paras) {
        return sqlBuilderMapper.selectList(sql,paras);
    }

    @Override
    public List<Map<String, Object>> selectList(String sql, String value) {
        return sqlBuilderMapper.selectList(sql,value);
    }

    @Override
    public List<Map<String, Object>> selectList(String sql) {
        return sqlBuilderMapper.selectList(sql);
    }

    @Override
    public int execute(String sql){
        return sqlBuilderMapper.insert(sql);
    }

}
