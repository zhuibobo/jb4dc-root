package com.jb4dc.devmock.webserver.beanconfig.liquibase;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import liquibase.Liquibase;
import liquibase.database.Database;
import liquibase.database.DatabaseConnection;
import liquibase.database.DatabaseFactory;
import liquibase.database.jvm.JdbcConnection;
import liquibase.exception.DatabaseException;
import liquibase.resource.ClassLoaderResourceAccessor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/7
 * To change this template use File | Settings | File Templates.
 */

@Configuration
public class LiQuiBaseBeansConfig {

    private static final Logger logger = LoggerFactory.getLogger(LiQuiBaseBeansConfig.class);

    @Bean(name = "jb4dc_liquibase")
    public Liquibase liquibase(DataSource dataSource) throws JBuild4DCGenerallyException {
        logger.info("Configuring Liquibase");

        Liquibase liquibase = null;
        try {
            DatabaseConnection connection = new JdbcConnection(dataSource.getConnection());
            Database database = DatabaseFactory.getInstance().findCorrectDatabaseImplementation(connection);
            database.setDatabaseChangeLogTableName(database.getDatabaseChangeLogTableName());
            database.setDatabaseChangeLogLockTableName(database.getDatabaseChangeLogLockTableName());

            liquibase = new Liquibase("liquibase/jb4dc-dev-mock-db-changelog.xml", new ClassLoaderResourceAccessor(), database);
            liquibase.update("zhuangrb");
            return liquibase;

        } catch (Exception e) {
            e.printStackTrace();
            throw new JBuild4DCGenerallyException("执行数据库更新失败！");
        } finally {
            if (liquibase != null) {
                Database database = liquibase.getDatabase();
                if (database != null) {
                    try {
                        database.close();
                    } catch (DatabaseException e) {
                        logger.warn("关闭数据库连接失败！", e);
                    }
                }
            }
        }
    }

}
