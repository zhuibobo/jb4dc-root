package com.jb4dc.base.service.impl;

import com.jb4dc.base.dbaccess.dynamic.ISQLBuilderMapper;
import com.jb4dc.base.service.ISQLBuilderService;

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
    public Object selectOneScalar(String sql){
        Map<String, Object> oneMap=sqlBuilderMapper.selectOne(sql);
        if(oneMap==null)
            return null;
        return oneMap.entrySet().iterator().next().getValue();
    }

    @Override
    public Object selectOneScalar(String sql, Object value){
        Map<String, Object> oneMap=this.selectOne(sql,value);
        if(oneMap==null)
            return null;
        return oneMap.entrySet().iterator().next().getValue();
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

    @Override
    public int insert(String sql){
        return sqlBuilderMapper.insert(sql);
    }

    @Override
    public int insert(String sql, Map paras){
        return sqlBuilderMapper.insert(sql,paras);
    }

    @Override
    public int update(String sql){
        return sqlBuilderMapper.update(sql);
    }

    @Override
    public int update(String sql,Map paras){
        return sqlBuilderMapper.update(sql,paras);
    }

}
