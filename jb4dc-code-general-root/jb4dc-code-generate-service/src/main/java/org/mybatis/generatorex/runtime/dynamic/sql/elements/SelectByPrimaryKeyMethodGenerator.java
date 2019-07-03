/**
 *    Copyright 2006-2017 the original author or authors.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package org.mybatis.generatorex.runtime.dynamic.sql.elements;

import org.mybatis.generatorex.api.dom.java.FullyQualifiedJavaType;
import org.mybatis.generatorex.api.dom.java.Interface;
import org.mybatis.generatorex.api.dom.java.Method;

import java.util.HashSet;
import java.util.Set;

public class SelectByPrimaryKeyMethodGenerator extends AbstractMethodGenerator {
    private FullyQualifiedJavaType recordType;
    private String tableFieldName;
    private FragmentGenerator fragmentGenerator;
    
    private SelectByPrimaryKeyMethodGenerator(Builder builder) {
        super(builder);
        recordType = builder.recordType;
        tableFieldName = builder.tableFieldName;
        fragmentGenerator = builder.fragmentGenerator;
    }

    @Override
    public MethodAndImports generateMethodAndImports() {
        if (!introspectedTable.getRules().generateSelectByPrimaryKey()) {
            return null;
        }
        
        Set<FullyQualifiedJavaType> imports = new HashSet<FullyQualifiedJavaType>();
        
        imports.add(new FullyQualifiedJavaType("org.mybatis.dynamic.sql.select.SelectDSL")); //$NON-NLS-1$
        imports.add(recordType);
        
        Method method = new Method("selectByPrimaryKey"); //$NON-NLS-1$
        method.setDefault(true);
        context.getCommentGenerator().addGeneralMethodAnnotation(method, introspectedTable, imports);
        method.setReturnType(recordType);
        
        StringBuilder sb = new StringBuilder();
        sb.append("return SelectDSL.selectWithMapper(this::selectOne, "); //$NON-NLS-1$
        sb.append(fragmentGenerator.getSelectList());
        sb.append(')');
        method.addBodyLine(sb.toString());
        
        method.addBodyLine("        .from(" + tableFieldName + ")"); //$NON-NLS-1$ //$NON-NLS-2$
        
        MethodAndImports.Builder builder = MethodAndImports.withMethod(method)
                .withStaticImport("org.mybatis.dynamic.sql.SqlBuilder.*") //$NON-NLS-1$
                .withImports(imports);
        
        MethodParts methodParts = fragmentGenerator.getPrimaryKeyWhereClauseAndParameters();
        acceptParts(builder, method, methodParts);
        
        method.addBodyLine("        .build()"); //$NON-NLS-1$
        method.addBodyLine("        .execute();"); //$NON-NLS-1$
        
        return builder.build();
    }

    @Override
    public boolean callPlugins(Method method, Interface interfaze) {
        return context.getPlugins().clientSelectByPrimaryKeyMethodGenerated(method, interfaze, introspectedTable);
    }

    public static class Builder extends BaseBuilder<Builder, SelectByPrimaryKeyMethodGenerator> {
        private FullyQualifiedJavaType recordType;
        private String tableFieldName;
        private FragmentGenerator fragmentGenerator;
        
        public Builder withRecordType(FullyQualifiedJavaType recordType) {
            this.recordType = recordType;
            return this;
        }
        
        public Builder withTableFieldName(String tableFieldName) {
            this.tableFieldName = tableFieldName;
            return this;
        }

        public Builder withFragmentGenerator(FragmentGenerator fragmentGenerator) {
            this.fragmentGenerator = fragmentGenerator;
            return this;
        }

        @Override
        public Builder getThis() {
            return this;
        }

        @Override
        public SelectByPrimaryKeyMethodGenerator build() {
            return new SelectByPrimaryKeyMethodGenerator(this);
        }
    }
}
