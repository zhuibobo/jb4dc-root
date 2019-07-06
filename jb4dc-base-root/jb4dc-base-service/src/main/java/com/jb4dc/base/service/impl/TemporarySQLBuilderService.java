package com.jb4dc.base.service.impl;

import com.jb4dc.base.dbaccess.dynamic.ISQLBuilderMapper;
import com.jb4dc.base.dbaccess.dynamic.impl.SQLBuilderMapper;
import com.jb4dc.base.dbaccess.dynamic.impl.TemporarySqlSessionFactoryBuilder;
import com.jb4dc.base.service.ISQLBuilderService;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/6
 * To change this template use File | Settings | File Templates.
 */
public class TemporarySQLBuilderService {

    private static ISQLBuilderService getInnerInstance(SqlSession sqlSession){
        ISQLBuilderMapper sqlBuilderMapper=new SQLBuilderMapper(sqlSession);
        ISQLBuilderService sqlBuilderService=new SQLBuilderServiceImpl(sqlBuilderMapper);
        return sqlBuilderService;
    }

    private static SqlSession getSqlSessionInstance(String driver, String url, String username, String password){
        SqlSessionFactory sqlSessionFactory = TemporarySqlSessionFactoryBuilder.build(driver,url,username,password);
        SqlSession sqlSession=sqlSessionFactory.openSession();
        return sqlSession;
    }

    public static List<Map<String, Object>> selectList(String driver, String url, String username, String password, String sql, String value) {
        SqlSession sqlSession=getSqlSessionInstance(driver,url,username,password);
        List<Map<String, Object>> result=null;
        try {
            ISQLBuilderService instance = getInnerInstance(sqlSession);
            result = instance.selectList(sql, value);
        }
        finally {
            sqlSession.close();
        }
        return result;
    }
}
