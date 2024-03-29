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
package org.mybatis.generatorex.codegen.ibatis2.dao;

import org.mybatis.generatorex.api.CommentGenerator;
import org.mybatis.generatorex.api.FullyQualifiedTable;
import org.mybatis.generatorex.api.dom.java.*;
import org.mybatis.generatorex.codegen.AbstractJavaClientGenerator;
import org.mybatis.generatorex.codegen.AbstractXmlGenerator;
import org.mybatis.generatorex.codegen.ibatis2.dao.elements.*;
import org.mybatis.generatorex.codegen.ibatis2.dao.templates.AbstractDAOTemplate;
import org.mybatis.generatorex.config.PropertyRegistry;
import org.mybatis.generatorex.internal.rules.Rules;

import java.util.ArrayList;
import java.util.List;

import static org.mybatis.generatorex.internal.util.StringUtility.stringHasValue;
import static org.mybatis.generatorex.internal.util.messages.Messages.getString;

/**
 * DAO generator for iBatis.
 * 
 * @author Jeff Butler
 * 
 */
public class DAOGenerator extends AbstractJavaClientGenerator {

    private AbstractDAOTemplate daoTemplate;
    private boolean generateForJava5;

    public DAOGenerator(AbstractDAOTemplate daoTemplate,
            boolean generateForJava5) {
        super(true);
        this.daoTemplate = daoTemplate;
        this.generateForJava5 = generateForJava5;
    }

    @Override
    public List<CompilationUnit> getCompilationUnits() {
        FullyQualifiedTable table = introspectedTable.getFullyQualifiedTable();
        progressCallback.startTask(getString(
                "Progress.14", table.toString())); //$NON-NLS-1$
        TopLevelClass topLevelClass = getTopLevelClassShell();
        Interface interfaze = getInterfaceShell();

        addCountByExampleMethod(topLevelClass, interfaze);
        addDeleteByExampleMethod(topLevelClass, interfaze);
        addDeleteByPrimaryKeyMethod(topLevelClass, interfaze);
        addInsertMethod(topLevelClass, interfaze);
        addInsertSelectiveMethod(topLevelClass, interfaze);
        addSelectByExampleWithBLOBsMethod(topLevelClass, interfaze);
        addSelectByExampleWithoutBLOBsMethod(topLevelClass, interfaze);
        addSelectByPrimaryKeyMethod(topLevelClass, interfaze);
        addUpdateByExampleParmsInnerclass(topLevelClass, interfaze);
        addUpdateByExampleSelectiveMethod(topLevelClass, interfaze);
        addUpdateByExampleWithBLOBsMethod(topLevelClass, interfaze);
        addUpdateByExampleWithoutBLOBsMethod(topLevelClass, interfaze);
        addUpdateByPrimaryKeySelectiveMethod(topLevelClass, interfaze);
        addUpdateByPrimaryKeyWithBLOBsMethod(topLevelClass, interfaze);
        addUpdateByPrimaryKeyWithoutBLOBsMethod(topLevelClass, interfaze);

        List<CompilationUnit> answer = new ArrayList<CompilationUnit>();
        if (context.getPlugins().clientGenerated(interfaze,
                topLevelClass, introspectedTable)) {
            answer.add(topLevelClass);
            answer.add(interfaze);
        }

        return answer;
    }

    protected TopLevelClass getTopLevelClassShell() {
        FullyQualifiedJavaType interfaceType = new FullyQualifiedJavaType(
                introspectedTable.getDAOInterfaceType());
        FullyQualifiedJavaType implementationType = new FullyQualifiedJavaType(
                introspectedTable.getDAOImplementationType());


        TopLevelClass answer = new TopLevelClass(implementationType);
        answer.setVisibility(JavaVisibility.PUBLIC);
        answer.setSuperClass(daoTemplate.getSuperClass());
        answer.addImportedType(daoTemplate.getSuperClass());
        answer.addSuperInterface(interfaceType);
        answer.addImportedType(interfaceType);

        for (FullyQualifiedJavaType fqjt : daoTemplate
                .getImplementationImports()) {
            answer.addImportedType(fqjt);
        }

        CommentGenerator commentGenerator = context.getCommentGenerator();
        commentGenerator.addJavaFileComment(answer);

        // add constructor from the template
        answer.addMethod(daoTemplate.getConstructorClone(commentGenerator,
                implementationType, introspectedTable));

        // add any fields from the template
        for (Field field : daoTemplate.getFieldClones(commentGenerator,
                introspectedTable)) {
            answer.addField(field);
        }

        // add any methods from the template
        for (Method method : daoTemplate.getMethodClones(commentGenerator,
                introspectedTable)) {
            answer.addMethod(method);
        }

        return answer;
    }

    protected Interface getInterfaceShell() {
        Interface answer = new Interface(new FullyQualifiedJavaType(
                introspectedTable.getDAOInterfaceType()));
        answer.setVisibility(JavaVisibility.PUBLIC);

        String rootInterface = introspectedTable
                .getTableConfigurationProperty(PropertyRegistry.ANY_ROOT_INTERFACE);
        if (!stringHasValue(rootInterface)) {
            rootInterface = context.getJavaClientGeneratorConfiguration()
                    .getProperty(PropertyRegistry.ANY_ROOT_INTERFACE);
        }

        if (stringHasValue(rootInterface)) {
            FullyQualifiedJavaType fqjt = new FullyQualifiedJavaType(
                    rootInterface);
            answer.addSuperInterface(fqjt);
            answer.addImportedType(fqjt);
        }

        for (FullyQualifiedJavaType fqjt : daoTemplate.getInterfaceImports()) {
            answer.addImportedType(fqjt);
        }

        context.getCommentGenerator().addJavaFileComment(answer);

        return answer;
    }

    protected void addCountByExampleMethod(TopLevelClass topLevelClass,
            Interface interfaze) {
        if (introspectedTable.getRules().generateCountByExample()) {
            AbstractDAOElementGenerator methodGenerator =
                    new CountByExampleMethodGenerator(generateForJava5);
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void addDeleteByExampleMethod(TopLevelClass topLevelClass,
            Interface interfaze) {
        if (introspectedTable.getRules().generateDeleteByExample()) {
            AbstractDAOElementGenerator methodGenerator =
                    new DeleteByExampleMethodGenerator(generateForJava5);
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void addDeleteByPrimaryKeyMethod(TopLevelClass topLevelClass,
            Interface interfaze) {
        if (introspectedTable.getRules().generateDeleteByPrimaryKey()) {
            AbstractDAOElementGenerator methodGenerator =
                    new DeleteByPrimaryKeyMethodGenerator(generateForJava5);
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void addInsertMethod(TopLevelClass topLevelClass,
            Interface interfaze) {
        if (introspectedTable.getRules().generateInsert()) {
            AbstractDAOElementGenerator methodGenerator =
                    new InsertMethodGenerator(generateForJava5);
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void addInsertSelectiveMethod(TopLevelClass topLevelClass,
            Interface interfaze) {
        if (introspectedTable.getRules().generateInsertSelective()) {
            AbstractDAOElementGenerator methodGenerator =
                    new InsertSelectiveMethodGenerator(generateForJava5);
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void addSelectByExampleWithBLOBsMethod(
            TopLevelClass topLevelClass, Interface interfaze) {
        if (introspectedTable.getRules().generateSelectByExampleWithBLOBs()) {
            AbstractDAOElementGenerator methodGenerator =
                    new SelectByExampleWithBLOBsMethodGenerator(generateForJava5);
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void addSelectByExampleWithoutBLOBsMethod(
            TopLevelClass topLevelClass, Interface interfaze) {
        if (introspectedTable.getRules().generateSelectByExampleWithoutBLOBs()) {
            AbstractDAOElementGenerator methodGenerator =
                    new SelectByExampleWithoutBLOBsMethodGenerator(generateForJava5);
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void addSelectByPrimaryKeyMethod(TopLevelClass topLevelClass,
            Interface interfaze) {
        if (introspectedTable.getRules().generateSelectByPrimaryKey()) {
            AbstractDAOElementGenerator methodGenerator =
                    new SelectByPrimaryKeyMethodGenerator(generateForJava5);
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void addUpdateByExampleParmsInnerclass(
            TopLevelClass topLevelClass, Interface interfaze) {
        Rules rules = introspectedTable.getRules();
        if (rules.generateUpdateByExampleSelective()
                || rules.generateUpdateByExampleWithBLOBs()
                || rules.generateUpdateByExampleWithoutBLOBs()) {
            AbstractDAOElementGenerator methodGenerator =
                    new UpdateByExampleParmsInnerclassGenerator();
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void addUpdateByExampleSelectiveMethod(
            TopLevelClass topLevelClass, Interface interfaze) {
        if (introspectedTable.getRules().generateUpdateByExampleSelective()) {
            AbstractDAOElementGenerator methodGenerator =
                    new UpdateByExampleSelectiveMethodGenerator(generateForJava5);
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void addUpdateByExampleWithBLOBsMethod(
            TopLevelClass topLevelClass, Interface interfaze) {
        if (introspectedTable.getRules().generateUpdateByExampleWithBLOBs()) {
            AbstractDAOElementGenerator methodGenerator =
                    new UpdateByExampleWithBLOBsMethodGenerator(generateForJava5);
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void addUpdateByExampleWithoutBLOBsMethod(
            TopLevelClass topLevelClass, Interface interfaze) {
        if (introspectedTable.getRules().generateUpdateByExampleWithoutBLOBs()) {
            AbstractDAOElementGenerator methodGenerator =
                    new UpdateByExampleWithoutBLOBsMethodGenerator(generateForJava5);
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void addUpdateByPrimaryKeySelectiveMethod(
            TopLevelClass topLevelClass, Interface interfaze) {
        if (introspectedTable.getRules().generateUpdateByPrimaryKeySelective()) {
            AbstractDAOElementGenerator methodGenerator =
                    new UpdateByPrimaryKeySelectiveMethodGenerator(generateForJava5);
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void addUpdateByPrimaryKeyWithBLOBsMethod(
            TopLevelClass topLevelClass, Interface interfaze) {
        if (introspectedTable.getRules().generateUpdateByPrimaryKeyWithBLOBs()) {
            AbstractDAOElementGenerator methodGenerator =
                    new UpdateByPrimaryKeyWithBLOBsMethodGenerator(generateForJava5);
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void addUpdateByPrimaryKeyWithoutBLOBsMethod(
            TopLevelClass topLevelClass, Interface interfaze) {
        if (introspectedTable.getRules()
                .generateUpdateByPrimaryKeyWithoutBLOBs()) {
            AbstractDAOElementGenerator methodGenerator =
                    new UpdateByPrimaryKeyWithoutBLOBsMethodGenerator(generateForJava5);
            initializeAndExecuteGenerator(methodGenerator, topLevelClass,
                    interfaze);
        }
    }

    protected void initializeAndExecuteGenerator(
            AbstractDAOElementGenerator methodGenerator,
            TopLevelClass topLevelClass, Interface interfaze) {
        methodGenerator.setDAOTemplate(daoTemplate);
        methodGenerator.setContext(context);
        methodGenerator.setIntrospectedTable(introspectedTable);
        methodGenerator.setProgressCallback(progressCallback);
        methodGenerator.setWarnings(warnings);
        methodGenerator.addImplementationElements(topLevelClass);
        methodGenerator.addInterfaceElements(interfaze);
    }

    @Override
    public AbstractXmlGenerator getMatchedXMLGenerator() {
        // this method is not called for iBATIS2
        return null;
    }
}
