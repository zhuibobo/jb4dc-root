package com.jb4dc.code.generate.service.impl;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.dbaccess.dynamic.ISQLBuilderMapper;
import com.jb4dc.base.dbaccess.dynamic.impl.SQLBuilderMapper;
import com.jb4dc.base.dbaccess.dynamic.impl.TemporarySqlSessionFactoryBuilder;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.impl.SQLBuilderServiceImpl;
import com.jb4dc.base.service.impl.TemporarySQLBuilderService;
import com.jb4dc.base.service.spring.SpringContextHolder;
import com.jb4dc.code.generate.bo.DataSourceSingleBO;
import com.jb4dc.code.generate.bo.PackageSingleBO;
import com.jb4dc.code.generate.bo.SimpleTableFieldBO;
import com.jb4dc.code.generate.service.ICodeGenerateService;
import com.jb4dc.code.generate.service.IDataSourceService;
import com.jb4dc.code.generate.service.IPackageService;
import com.jb4dc.code.generate.service.impl.codegenerate.CGCodeFragment;
import com.jb4dc.code.generate.service.impl.codegenerate.CGIService;
import com.jb4dc.code.generate.service.impl.codegenerate.CGMapperEX;
import com.jb4dc.code.generate.service.impl.codegenerate.CGServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.tools.DateUtility;
import com.jb4dc.core.base.tools.StringUtility;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.generatorex.api.IntrospectedTable;
import org.mybatis.generatorex.api.MyBatisGenerator;
import org.mybatis.generatorex.config.*;
import org.mybatis.generatorex.config.xml.ConfigurationParser;
import org.mybatis.generatorex.exception.InvalidConfigurationException;
import org.mybatis.generatorex.exception.XMLParserException;
import org.mybatis.generatorex.internal.DefaultShellCallback;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import javax.xml.bind.JAXBException;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.beans.PropertyVetoException;
import java.io.*;
import java.net.URISyntaxException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/25
 * To change this template use File | Settings | File Templates.
 */
@Service
public class CodeGenerateServiceImpl implements ICodeGenerateService {

    Logger logger= LoggerFactory.getLogger(CodeGenerateServiceImpl.class);

    //ISQLBuilderService sqlBuilderService;

    IDataSourceService dataSourceService;
    //IDataSourceManager dataSourceManager;

    IPackageService packageService;

    @Autowired
    public CodeGenerateServiceImpl(IDataSourceService dataSourceService,IPackageService packageService) {
        //sqlBuilderService=_sqlBuilderService;
        //Select Name FROM SysObjects Where XType='U' orDER BY Name
        //DBType=MSSQLSERVER
        //#DBType=ORACLE
        //#DBType=MYSQL

        this.dataSourceService=dataSourceService;
        //this.dataSourceManager=dataSourceManager;
        this.packageService=packageService;
    }



    @Override
    public PageInfo<List<Map<String, Object>>> getTables(String dataSourceId,String searchTableName,Integer pageNum, Integer pageSize) throws JBuild4DCGenerallyException, FileNotFoundException, PropertyVetoException, JAXBException, URISyntaxException {
        String sql = "";

        String _searchTableName = "%%";
        if (searchTableName != null && !searchTableName.equals("")) {
            _searchTableName = "%" + searchTableName + "%";
        }
        DataSourceSingleBO dataSourceSingleVo = dataSourceService.getDataSourceSingleConfig(dataSourceId);
        if (dataSourceSingleVo.getDbType().equals("sqlserver")) {
            sql = "Select Name as TableName FROM SysObjects Where XType='U' and Name like #{searchTableName} and Name not in ('DATABASECHANGELOG','DATABASECHANGELOGLOCK','TestConn') order BY Name";
        }
        if (dataSourceSingleVo.getDbType().equals("mysql")) {
            sql = "select upper(table_name) TableName from information_schema.tables where table_schema='" + dataSourceSingleVo.getDatabaseName() + "' and table_name like #{searchTableName} and upper(table_type)='BASE TABLE' and table_name not in ('DATABASECHANGELOG','DATABASECHANGELOGLOCK')";
        }
        if (dataSourceSingleVo.getDbType().equals("oracle")) {
            throw JBuild4DCGenerallyException.getNotSupportOracleException(JBuild4DCGenerallyException.EXCEPTION_CODE_GENERATE_CODE);
        }
        //PageHelper.startPage(pageNum, pageSize);
        //PageHelper.
        /*SqlSessionFactory sqlSessionFactory = TemporarySqlSessionFactoryBuilder.build(dataSourceSingleVo.getDriverName(),dataSourceSingleVo.getUrl(),dataSourceSingleVo.getUser(),dataSourceSingleVo.getPassword());
        SqlSession sqlSession=sqlSessionFactory.openSession();
        ISQLBuilderMapper sqlBuilderMapper=new SQLBuilderMapper(sqlSession);
        ISQLBuilderService sqlBuilderService=new SQLBuilderServiceImpl(sqlBuilderMapper);

        List<Map<String, Object>> list=sqlBuilderService.selectList(sql, _searchTableName);*/
        List<Map<String, Object>> list = TemporarySQLBuilderService.selectList(dataSourceSingleVo.getDriverName(), dataSourceSingleVo.getUrl(), dataSourceSingleVo.getUser(), dataSourceSingleVo.getPassword(), sql, _searchTableName);

        PageInfo<List<Map<String, Object>>> pageInfo = new PageInfo(list);
        return pageInfo;
    }

    @Override
    public List<SimpleTableFieldBO> getTableFields(String dataSourceId, String tableName) throws JBuild4DCGenerallyException, FileNotFoundException, PropertyVetoException, JAXBException, URISyntaxException {
        String sql="";
        List<SimpleTableFieldBO> result=new ArrayList<>();
        DataSourceSingleBO dataSourceSingleVo=dataSourceService.getDataSourceSingleConfig(dataSourceId);
        if(dataSourceSingleVo.getDbType().equals("sqlserver")){
            sql="SELECT * FROM INFORMATION_SCHEMA.columns WHERE TABLE_NAME=#{searchTableName}";
        }
        if(dataSourceSingleVo.getDbType().equals("mysql")){
            sql="select * from information_schema.columns where table_schema='"+dataSourceSingleVo.getDatabaseName()+"' and table_name= #{searchTableName}";
        }
        if(dataSourceSingleVo.getDbType().equals("oracle")){
            throw JBuild4DCGenerallyException.getNotSupportOracleException(JBuild4DCGenerallyException.EXCEPTION_CODE_GENERATE_CODE);
        }

        SqlSessionFactory sqlSessionFactory = TemporarySqlSessionFactoryBuilder.build(dataSourceSingleVo.getDriverName(),dataSourceSingleVo.getUrl(),dataSourceSingleVo.getUser(),dataSourceSingleVo.getPassword());
        SqlSession sqlSession=sqlSessionFactory.openSession();
        ISQLBuilderMapper sqlBuilderMapper=new SQLBuilderMapper(sqlSession);
        ISQLBuilderService sqlBuilderService=new SQLBuilderServiceImpl(sqlBuilderMapper);

        List<Map<String, Object>> fieldList=sqlBuilderService.selectList(sql, tableName);
        for (Map<String, Object> map : fieldList) {
            SimpleTableFieldBO simpleTableFieldVo=new SimpleTableFieldBO();
            simpleTableFieldVo.setTableName(map.get("TABLE_NAME").toString());
            simpleTableFieldVo.setFieldName(map.get("COLUMN_NAME").toString());
            simpleTableFieldVo.setFieldType(map.get("DATA_TYPE").toString());
            result.add(simpleTableFieldVo);
        }

        sqlSession.close();

        return result;
    }

    private String EntityRootFolderKey="EntityRootFolderKey";
    private String DaoRootFolderKey="DaoRootFolderKey";
    private String XmlRootFolderKey="XmlRootFolderKey";
    private PackageSingleBO createAboutFolder(PackageSingleBO packageSingleBO){
        //String GenerateCodeFilesPath= PathBaseUtility.getThreadRunRootPath()+"/GenerateCodeFiles"+"/"+DateUtility.getDate_yyyyMMddHHmmssSSS();
        //String GenerateCodeFilesPath= "D:/JavaProject/jb4dc/GenerateCodeFiles"+"/"+DateUtility.getDate_yyyyMMddHHmmssSSS();
        String GenerateCodeFilesPath="";
        if(SpringContextHolder.getActiveProfile().equals("dev")){
            GenerateCodeFilesPath= "D:/JavaProject/jb4dc/GenerateCodeFiles"+"/"+DateUtility.getDate_yyyyMMddHHmmssSSS();
        }
        else{
            GenerateCodeFilesPath= "E:/JavaPlat/jb4dcsystem/codegenerate/GenerateCodeFiles"+"/"+DateUtility.getDate_yyyyMMddHHmmssSSS();
        }
        File tempRootFolder=new File(GenerateCodeFilesPath);
        tempRootFolder.mkdirs();

        Map<String,String> result=new HashMap<>();
        //Entity
        String tempPath=GenerateCodeFilesPath+"/Entity";
        File temp=new File(tempPath);
        temp.mkdirs();
        packageSingleBO.setEntitySavePath(tempPath);
        //result.put(EntityRootFolderKey,tempPath);

        //Dao
        tempPath=GenerateCodeFilesPath+"/Dao";
        temp=new File(tempPath);
        temp.mkdirs();
        packageSingleBO.setDaoSavePath(tempPath);

        //XmlMapperAC
        tempPath=GenerateCodeFilesPath+"/XMLACMapper";
        temp=new File(tempPath);
        temp.mkdirs();
        packageSingleBO.setMapperACSavePath(tempPath);

        return packageSingleBO;
    }

    @Override
    public IntrospectedTable getTableInfo(String tableName,String driverName,String url,String user,String password){
        Map<String, String> generateCodeMap = new HashMap<>();
        List<String> warnings = new ArrayList<String>();
        boolean overwrite = true;

        InputStream is = this.getClass().getClassLoader().getResourceAsStream("MybatisGenerator/generatorConfigToCode.xml");

        //Map<CodeGenerateTypeEnum, CodeGenerateBO> codeGenerateVoMap= CodeGenerateBO.generateTypeEnumCodeGenerateVoMap().get("JBuild4D-PlatForm");

        PackageSingleBO packageSingleBO=new PackageSingleBO();
        packageSingleBO=createAboutFolder(packageSingleBO);

        ConfigurationParser cp = new ConfigurationParser(warnings);
        Configuration config = null;
        try {
            config = cp.parseConfiguration(is);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (XMLParserException e) {
            e.printStackTrace();
        }
        DefaultShellCallback callback = new DefaultShellCallback(overwrite);
        MyBatisGenerator myBatisGenerator = null;

        Context context = config.getContexts().get(0);
        //设置数据库连接
        JDBCConnectionConfiguration jdbcConnectionConfiguration=new JDBCConnectionConfiguration();
        /*jdbcConnectionConfiguration.setDriverClass(DBProp.getDriverName());
        jdbcConnectionConfiguration.setConnectionURL(DBProp.getUrl());
        jdbcConnectionConfiguration.setUserId(DBProp.getUser());
        jdbcConnectionConfiguration.setPassword(DBProp.getPassword());*/
        jdbcConnectionConfiguration.setDriverClass(driverName);
        jdbcConnectionConfiguration.setConnectionURL(url);
        jdbcConnectionConfiguration.setUserId(user);
        jdbcConnectionConfiguration.setPassword(password);
        context.setJdbcConnectionConfiguration(jdbcConnectionConfiguration);

        //设置model的相关信息
        JavaModelGeneratorConfiguration javaModelGeneratorConfiguration=context.getJavaModelGeneratorConfiguration();
        String modelPackageName=packageSingleBO.getEntity()+".temp";
        javaModelGeneratorConfiguration.setTargetPackage(modelPackageName);
        javaModelGeneratorConfiguration.setTargetProject(packageSingleBO.getEntitySavePath());
        context.setJavaModelGeneratorConfiguration(javaModelGeneratorConfiguration);

        //设置dao的相关的信息
        JavaClientGeneratorConfiguration javaClientGeneratorConfiguration=context.getJavaClientGeneratorConfiguration();
        String daoPackageName=packageSingleBO.getDao()+".temp";
        javaClientGeneratorConfiguration.setTargetPackage(daoPackageName);
        javaClientGeneratorConfiguration.setTargetProject(packageSingleBO.getDaoSavePath());
        context.setJavaModelGeneratorConfiguration(javaModelGeneratorConfiguration);

        //设置mapper的相关信息
        SqlMapGeneratorConfiguration sqlMapGeneratorConfiguration=context.getSqlMapGeneratorConfiguration();
        String mapperPackageName=packageSingleBO.getMapperAC()+".temp";
        sqlMapGeneratorConfiguration.setTargetPackage(mapperPackageName);
        sqlMapGeneratorConfiguration.setTargetProject(packageSingleBO.getMapperACSavePath());
        context.setSqlMapGeneratorConfiguration(sqlMapGeneratorConfiguration);

        String domainObjectName= StringUtility.firstCharUpperThenLower(tableName)+"Entity";
        String mapperName=StringUtility.firstCharUpperThenLower(tableName)+"ACMapper";
        String daoMapperName=StringUtility.firstCharUpperThenLower(tableName)+"Mapper";

        if(tableName.indexOf("_")>0){
            //String shortName=tableName.substring(tableName.indexOf("_")+1);
            String name="";
            String[] names=tableName.split("_");
            for(int i=1;i<names.length;i++){
                name+=StringUtility.firstCharUpperThenLower(names[i]);
            }
            domainObjectName=name+"Entity";
            mapperName=name+"ACMapper";
            daoMapperName=name+"Mapper";
        }
        //设置表名称
        TableConfiguration tc = new TableConfiguration(context);
        tc.setTableName(tableName);
        tc.setDomainObjectName(domainObjectName);
        tc.setMapperName(mapperName);
        tc.setCountByExampleStatementEnabled(false);
        tc.setUpdateByExampleStatementEnabled(false);
        tc.setDeleteByExampleStatementEnabled(false);
        tc.setSelectByExampleStatementEnabled(false);
        //tc.setDeleteByPrimaryKeyStatementEnabled(false);
        context.addTableConfiguration(tc);

        try {
            myBatisGenerator = new MyBatisGenerator(config, callback, warnings);
        } catch (InvalidConfigurationException e) {
            e.printStackTrace();
        }

        try {
            myBatisGenerator.generate(null);
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        List<IntrospectedTable> introspectedTableList=context.getIntrospectedTables();
        IntrospectedTable introspectedTable=introspectedTableList.get(0);
        return introspectedTable;
    }

    @Override
    public Map<String, String> getTableGenerateCode(String dataSourceId,String tableName, String orderFieldName, String statusFieldName, String packageType, String packageLevel2Name) throws IOException, ParserConfigurationException, SAXException, XPathExpressionException, JAXBException, URISyntaxException {
        if(!packageLevel2Name.equals("")){
            packageLevel2Name="."+packageLevel2Name;
        }

        DataSourceSingleBO dataSourceSingleBO=dataSourceService.getDataSourceSingleConfig(dataSourceId);

        //根据单表生成代码
        Map<String, String> generateCodeMap = new HashMap<>();
        List<String> warnings = new ArrayList<String>();
        boolean overwrite = true;

        InputStream is = this.getClass().getClassLoader().getResourceAsStream("MybatisGenerator/generatorConfigToCode.xml");

        PackageSingleBO packageSingleBO= packageService.getPackageSingleBO(packageType);

        packageSingleBO=createAboutFolder(packageSingleBO);

        ConfigurationParser cp = new ConfigurationParser(warnings);
        Configuration config = null;
        try {
            config = cp.parseConfiguration(is);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (XMLParserException e) {
            e.printStackTrace();
        }
        DefaultShellCallback callback = new DefaultShellCallback(overwrite);
        MyBatisGenerator myBatisGenerator = null;

        Context context = config.getContexts().get(0);
        //设置数据库连接
        JDBCConnectionConfiguration jdbcConnectionConfiguration=new JDBCConnectionConfiguration();
        jdbcConnectionConfiguration.setDriverClass(dataSourceSingleBO.getDriverName());
        jdbcConnectionConfiguration.setConnectionURL(dataSourceSingleBO.getUrl());
        jdbcConnectionConfiguration.setUserId(dataSourceSingleBO.getUser());
        jdbcConnectionConfiguration.setPassword(dataSourceSingleBO.getPassword());
        context.setJdbcConnectionConfiguration(jdbcConnectionConfiguration);

        //设置model的相关信息
        JavaModelGeneratorConfiguration javaModelGeneratorConfiguration=context.getJavaModelGeneratorConfiguration();
        String modelPackageName=packageSingleBO.getEntity()+packageLevel2Name;
        javaModelGeneratorConfiguration.setTargetPackage(modelPackageName);
        javaModelGeneratorConfiguration.setTargetProject(packageSingleBO.getEntitySavePath());
        context.setJavaModelGeneratorConfiguration(javaModelGeneratorConfiguration);

        //设置dao的相关的信息
        JavaClientGeneratorConfiguration javaClientGeneratorConfiguration=context.getJavaClientGeneratorConfiguration();
        String daoPackageName=packageSingleBO.getDao()+packageLevel2Name;
        javaClientGeneratorConfiguration.setTargetPackage(daoPackageName);
        javaClientGeneratorConfiguration.setTargetProject(packageSingleBO.getDaoSavePath());
        context.setJavaModelGeneratorConfiguration(javaModelGeneratorConfiguration);

        //设置mapper的相关信息
        SqlMapGeneratorConfiguration sqlMapGeneratorConfiguration=context.getSqlMapGeneratorConfiguration();
        String mapperPackageName=packageSingleBO.getMapperAC()+packageLevel2Name;
        sqlMapGeneratorConfiguration.setTargetPackage(mapperPackageName);
        sqlMapGeneratorConfiguration.setTargetProject(packageSingleBO.getMapperACSavePath());
        context.setSqlMapGeneratorConfiguration(sqlMapGeneratorConfiguration);

        String domainObjectName= StringUtility.firstCharUpperThenLower(tableName)+"Entity";
        String mapperName=StringUtility.firstCharUpperThenLower(tableName)+"ACMapper";
        String daoMapperName=StringUtility.firstCharUpperThenLower(tableName)+"Mapper";

        if(tableName.indexOf("_")>0){
            //String shortName=tableName.substring(tableName.indexOf("_")+1);
            String name="";
            String[] names=tableName.split("_");
            for(int i=1;i<names.length;i++){
                name+=StringUtility.firstCharUpperThenLower(names[i]);
            }
            domainObjectName=name+"Entity";
            mapperName=name+"ACMapper";
            daoMapperName=name+"Mapper";
        }
        //设置表名称
        TableConfiguration tc = new TableConfiguration(context);
        tc.setTableName(tableName);
        tc.setDomainObjectName(domainObjectName);
        tc.setMapperName(mapperName);
        tc.setCountByExampleStatementEnabled(false);
        tc.setUpdateByExampleStatementEnabled(false);
        tc.setDeleteByExampleStatementEnabled(false);
        tc.setSelectByExampleStatementEnabled(false);
        //tc.setDeleteByPrimaryKeyStatementEnabled(false);
        context.addTableConfiguration(tc);

        try {
            myBatisGenerator = new MyBatisGenerator(config, callback, warnings);
        } catch (InvalidConfigurationException e) {
            e.printStackTrace();
        }
        try {
            myBatisGenerator.generate(null);
        } catch (SQLException e) {
            logger.error("---------------------------MyBatisGenerator Error---------------------------");
            e.printStackTrace();
        } catch (IOException e) {
            logger.error("---------------------------MyBatisGenerator Error---------------------------");
            e.printStackTrace();
        } catch (InterruptedException e) {
            logger.error("---------------------------MyBatisGenerator Error---------------------------");
            e.printStackTrace();
        }

        //读取文件作为结果返回
        //Entity文件
        String tempPath=packageSingleBO.getEntitySavePath()+"/"+modelPackageName.replaceAll("\\.","/");
        logger.info("Entity生成路径:"+tempPath);
        generateCodeMap.put("EntityContent",readFolderSingleFileToString(tempPath));

        //判断是否生成了二进制的继承实体文件;
        if(existBLOBEntity(tempPath)){
            generateCodeMap.put("EntityWithBLOBContent",readWithBLOBsFileToString(tempPath));
        }
        else {
            generateCodeMap.put("EntityWithBLOBContent","不存在二进制字段!");
        }

        tempPath=packageSingleBO.getDaoSavePath()+"/"+daoPackageName.replaceAll("\\.","/");
        logger.info("DAO生成路径:"+tempPath);
        generateCodeMap.put("DaoContent",readFolderSingleFileToString(tempPath));

        tempPath=packageSingleBO.getMapperACSavePath()+"/"+mapperPackageName.replaceAll("\\.","/");
        logger.info("MAPPER生成路径:"+tempPath);
        generateCodeMap.put("MapperACContent",readFolderSingleFileToString(tempPath));

        logger.info("---------------------------打印表信息---------------------------");
        List<IntrospectedTable> introspectedTableList=context.getIntrospectedTables();
        for (IntrospectedTable introspectedTable : introspectedTableList) {
            logger.info(introspectedTable.getFullyQualifiedTable().getIntrospectedTableName());
        }
        logger.info("---------------------------打印表信息---------------------------");

        //生成MapperEX
        logger.info("---------------------------生成MapperEX---------------------------");
        String keyFieldName=introspectedTableList.get(0).getPrimaryKeyColumns().get(0).getActualColumnName();
        logger.info("---------------------------生成MapperEX:主键为"+keyFieldName+"---------------------------");
        IntrospectedTable introspectedTable=introspectedTableList.get(0);
        logger.info("---------------------------生成MapperEX:生成列数为"+introspectedTable.getNonPrimaryKeyColumns().size()+"---------------------------");

        generateCodeMap.put("MapperEXContent", CGMapperEX.generate(keyFieldName,introspectedTable,tableName,orderFieldName,statusFieldName,packageSingleBO,generateCodeMap.get("MapperACContent")));
        //生成IService
        logger.info("---------------------------生成IService---------------------------");
        generateCodeMap.put("IServiceContent", CGIService.generate(introspectedTableList,tableName,orderFieldName,statusFieldName,packageSingleBO,generateCodeMap.get("MapperACContent")));
        //生成ServiceImpl
        logger.info("---------------------------生成ServiceImpl---------------------------");
        generateCodeMap.put("ServiceImplContent", CGServiceImpl.generate(introspectedTableList,tableName,orderFieldName,statusFieldName,packageSingleBO,generateCodeMap.get("MapperACContent"),daoMapperName));
        //生成Js实体片段
        generateCodeMap.put("CodeFragmentContent", CGCodeFragment.generate(introspectedTableList,tableName,orderFieldName,statusFieldName,packageSingleBO,generateCodeMap.get("MapperACContent"),daoMapperName));
        //生成ListHTML


        //生成DetailHTML


        return generateCodeMap;
    }

    private boolean existBLOBEntity(String folder){
        File file=new File(folder);
        if(file.exists()){
            File[] files=file.listFiles();
            if(files.length>0){
                for (File file1 : files) {
                    if(file1.getName().indexOf("WithBLOBs")>0){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private String readWithBLOBsFileToString(String folder){
        File file=new File(folder);
        String result="";
        if(file.exists()){
            File[] files=file.listFiles();
            if(files.length>0){
                for (File file1 : files) {
                    if(file1.getName().indexOf("WithBLOBs")>0){
                        return getFileToString(file1);
                    }
                }
            }
        }
        return result;
    }

    private String getFileToString(File file) {
        Long filelength = file.length();
        byte[] filecontent = new byte[filelength.intValue()];
        try {
            FileInputStream in = new FileInputStream(file);
            in.read(filecontent);
            in.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            return new String(filecontent, "utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
    }

    private String readFolderSingleFileToString(String folder){
        File file=new File(folder);
        if(file.exists()){
            File[] files=file.listFiles();
            if(files.length>0){
                File singleFile=files[0];
                return getFileToString(singleFile);
            }
        }
        return "";
    }
}
