package com.jb4dc.code.generate.webserver.beanconfig.service;

import com.jb4dc.code.generate.service.ICodeGenerateService;
import com.jb4dc.code.generate.service.IDataSourceManager;
import com.jb4dc.code.generate.service.IDataSourceService;
import com.jb4dc.code.generate.service.IPackageService;
import com.jb4dc.code.generate.service.impl.CodeGenerateServiceImpl;
import com.jb4dc.code.generate.service.impl.DataSourceManagerImpl;
import com.jb4dc.code.generate.service.impl.DataSourceServiceImpl;
import com.jb4dc.code.generate.service.impl.PackageServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/5
 * To change this template use File | Settings | File Templates.
 */

@Configuration
public class CodeGenerateBeansConfig {

    @Bean
    public IDataSourceService dataSourceService(){
        IDataSourceService dataSourceService=new DataSourceServiceImpl();
        return dataSourceService;
    }

    @Bean
    public IPackageService packageService(){
        IPackageService packageService=new PackageServiceImpl();
        return packageService;
    }

    @Bean
    public IDataSourceManager dataSourceManager(){
        IDataSourceManager dataSourceManager=new DataSourceManagerImpl(dataSourceService());
        return dataSourceManager;
    }

    @Bean
    public ICodeGenerateService codeGenerateService(){
        ICodeGenerateService codeGenerateService=new CodeGenerateServiceImpl(dataSourceService(),dataSourceManager());
        return codeGenerateService;
    }
}
