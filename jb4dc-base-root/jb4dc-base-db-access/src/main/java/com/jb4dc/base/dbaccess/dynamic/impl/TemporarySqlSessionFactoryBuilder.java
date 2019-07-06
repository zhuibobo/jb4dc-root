package com.jb4dc.base.dbaccess.dynamic.impl;

import org.apache.ibatis.datasource.unpooled.UnpooledDataSource;
import org.apache.ibatis.mapping.Environment;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.apache.ibatis.transaction.TransactionFactory;
import org.apache.ibatis.transaction.jdbc.JdbcTransactionFactory;

import javax.sql.DataSource;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/6
 * To change this template use File | Settings | File Templates.
 */
public class TemporarySqlSessionFactoryBuilder {

    public static SqlSessionFactory build(String driver, String url, String username, String password){
        org.apache.ibatis.session.Configuration configuration=new org.apache.ibatis.session.Configuration();

        TransactionFactory transactionFactory=new JdbcTransactionFactory();
        //Connection dbConn= DriverManager.getConnection(context.getJdbcConnectionConfiguration().getConnectionURL(),context.getJdbcConnectionConfiguration().getUserId(),context.getJdbcConnectionConfiguration().getPassword());
        DataSource dataSource=new UnpooledDataSource(driver,url,username,password);
        //dataSource.set

        Environment environment=new Environment("TemporarySqlSessionFactoryBuilder1",transactionFactory,dataSource);
        //configuration.setEnvironment(Env);
        configuration.setEnvironment(environment);
        SqlSessionFactory sessionFactory = new SqlSessionFactoryBuilder().build(configuration);
        return sessionFactory;
    }
}
