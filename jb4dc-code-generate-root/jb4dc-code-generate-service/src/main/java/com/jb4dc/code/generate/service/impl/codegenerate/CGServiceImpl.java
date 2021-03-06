package com.jb4dc.code.generate.service.impl.codegenerate;

import com.jb4dc.code.generate.bo.PackageSingleBO;
import com.jb4dc.core.base.tools.StringUtility;
import org.mybatis.generatorex.api.IntrospectedTable;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/27
 * To change this template use File | Settings | File Templates.
 */
public class CGServiceImpl {

    public static String generate(List<IntrospectedTable> introspectedTableList, String tableName, String orderFieldName, String statusFieldName,
                                  PackageSingleBO packageSingleBO, String xmlMapperACStr, String daoMapperName){
        StringBuilder builder=new StringBuilder();

        IntrospectedTable introspectedTable=introspectedTableList.get(0);

        String daoMapperInstanceName= StringUtility.firstCharLower(daoMapperName);
        String serviceImplName=introspectedTable.getFullyQualifiedTable().getDomainObjectName().replace("Entity","")+"ServiceImpl";
        String domainObjectName=introspectedTable.getFullyQualifiedTable().getDomainObjectName();

        builder.append("public class "+serviceImplName);
        builder.append(" extends BaseServiceImpl<"+domainObjectName+"> ");
        builder.append("implements I"+introspectedTable.getFullyQualifiedTable().getDomainObjectName().replace("Entity","")+"Service");
        builder.append(CGTool.newLineChar());
        builder.append("{");

        //---------------构造函数---------------
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(1)+daoMapperName+" "+ daoMapperInstanceName+";");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(1)+"public "+ serviceImplName+"("+daoMapperName+" _defaultBaseMapper){");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(2)+"super(_defaultBaseMapper);");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(2)+daoMapperInstanceName+"=_defaultBaseMapper;");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(1)+"}");
        builder.append(CGTool.newLineChar());

        //---------------保存方法---------------
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(1)+"@Override");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(1)+"public int saveSimple(JB4DCSession jb4DCSession, String id, "+domainObjectName+" record) throws JBuild4DCGenerallyException {");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(2)+"return super.save(jb4DCSession,id, record, new IAddBefore<"+domainObjectName+">() {");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(3)+"@Override");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(3)+"public "+domainObjectName+" run(JB4DCSession jb4DCSession,"+domainObjectName+" sourceEntity) throws JBuild4DCGenerallyException {");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(4)+"//设置排序,以及其他参数--nextOrderNum()");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(4)+"return sourceEntity;");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(3)+"}");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(2)+"});");
        builder.append(CGTool.newLineChar());
        builder.append(CGTool.tabChar(1)+"}");

        builder.append(CGTool.newLineChar());
        builder.append("}");
        builder.append(CGTool.newLineChar());
        return builder.toString();
    }

}
