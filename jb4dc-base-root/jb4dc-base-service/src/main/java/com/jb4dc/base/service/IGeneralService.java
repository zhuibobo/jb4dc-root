package com.jb4dc.base.service;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/6
 * To change this template use File | Settings | File Templates.
 */
public interface IGeneralService {

    List<Map> executeSql(String sql);

    List<Map> executeSqlMap(Map map);

    //Long nextOrderNum(String tableName,String orderFieldName) throws JBuild4DCGenerallyException;

    Object executeScalarSql(String sql);
}
