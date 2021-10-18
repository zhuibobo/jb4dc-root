package com.jb4dc.core.base.exception;

import com.jb4dc.core.base.tools.StringUtility;

public class JBuild4DCGenerallyException extends JBuild4DCBaseException {

    //static int defaultCode=0;

    /* public JBuild4DCGenerallyException(int code,String message) {
         super(code, message);
     }*/
    public static int EXCEPTION_PLATFORM_CODE = 110001;
    public static int EXCEPTION_DEVMOCK_CODE = 110002;
    public static int EXCEPTION_SSO_CODE = 110003;
    public static int EXCEPTION_BUILDER_CODE = 110004;
    public static int EXCEPTION_CONFIG_CODE = 110005;
    public static int EXCEPTION_CODE_GENERATE_CODE=110006;
    public static int EXCEPTION_GRID_CODE=110007;
    public static int EXCEPTION_QC_CODE=110008;
    public static int EXCEPTION_SITE_CODE=110009;
    public static int EXCEPTION_WORKFLOW_CODE=110010;
    public static int EXCEPTION_PORTLET_CODE=110011;
    public static int EXCEPTION_BIGSCREEN_CODE=110012;

    public JBuild4DCGenerallyException(int errorCode, Exception ex) {
        //super(ex.getCause());
        super(errorCode, ex.getMessage(), ex.getCause(),ex.getStackTrace());
    }

    public JBuild4DCGenerallyException(int errorCode, String message) {
        super(errorCode, message);
    }

    public JBuild4DCGenerallyException(int errorCode, String message, Throwable cause,StackTraceElement[] stackTraceElements) {
        super(errorCode, message, cause,stackTraceElements);
    }

    /*public JBuild4DCGenerallyException(int errorCode,String message, Throwable cause) {
        super(errorCode, message, cause);
    }*/

    public static JBuild4DCGenerallyException getSystemRecordDelException(int errorCode) {
        return new JBuild4DCGenerallyException(errorCode, "系统数据不能删除！");
    }

    public static JBuild4DCGenerallyException getDBFieldSettingDelException(int errorCode) {
        return new JBuild4DCGenerallyException(errorCode, "该记录已被设置为无法删除！");
    }

    public static JBuild4DCGenerallyException getHadChildDelException(int errorCode) {
        return new JBuild4DCGenerallyException(errorCode, "存在子记录,请先删除子记录！");
    }

    public static JBuild4DCGenerallyException getNotSupportMySQLException(int errorCode) {
        return new JBuild4DCGenerallyException(errorCode, "暂不支持Oracle！");
    }

    public static JBuild4DCGenerallyException getNotSupportOracleException(int errorCode) {
        return new JBuild4DCGenerallyException(errorCode, "暂不支持Oracle！");
    }

    public static JBuild4DCGenerallyException getNotSupportMSSQLException(int errorCode) {
        return new JBuild4DCGenerallyException(errorCode, "暂不支持MS SqlServer！");
    }

    public static JBuild4DCGenerallyException getNotSupportDBException(int errorCode) {
        return new JBuild4DCGenerallyException(errorCode, "暂不支持该类数据库！");
    }

    public static JBuild4DCGenerallyException getInterfaceNotBeanException(int errorCode,String interfaceFullName) {
        return new JBuild4DCGenerallyException(errorCode, "请在项目中提供"+interfaceFullName+"的实现类,并声明为bean!");
    }

    public static JBuild4DCGenerallyException getEmptyException(int errorCode,String name){
        return new JBuild4DCGenerallyException(errorCode, name+"不能为空!");
    }

    public static JBuild4DCGenerallyException getNotSupportMethodException(int errorCode) {
        return new JBuild4DCGenerallyException(errorCode, "该方法已经弃用！");
    }
}
