package com.jb4dc.base.service;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/11
 * To change this template use File | Settings | File Templates.
 */
public interface ISQLBuilderService {
    Object selectOneScalar(String sql);

    Object selectOneScalar(String sql, Object value);

    Map<String,Object> selectOne(String sql, Object value);

    List<Map<String,Object>> selectList(String sql, Map paras);

    List<Map<String,Object>> selectList(String sql, String value);

    List<Map<String,Object>> selectList(String sql);

    int execute(String sql);

    int insert(String sql);

    int insert(String sql, Map paras);

    int update(String sql);

    int update(String sql, Map paras);
}
