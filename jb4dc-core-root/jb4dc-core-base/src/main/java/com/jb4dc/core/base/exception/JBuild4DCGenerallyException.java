package com.jb4dc.core.base.exception;

public class JBuild4DCGenerallyException extends JBuild4DCBaseException {

    static int defaultCode=0;

    public JBuild4DCGenerallyException(String message) {
        super(defaultCode, message);
    }

    public JBuild4DCGenerallyException(Exception ex) {
        //super(ex.getCause());
        super(defaultCode, ex.getMessage(),ex.getCause());
    }

    public JBuild4DCGenerallyException(int errorCode, String message) {
        super(errorCode, message);
    }

    public JBuild4DCGenerallyException(int errorCode, String message, Throwable cause) {
        super(errorCode, message, cause);
    }

    public JBuild4DCGenerallyException(String message, Throwable cause) {
        super(defaultCode, message, cause);
    }

    public static JBuild4DCGenerallyException getSystemRecordDelException(){
        return new JBuild4DCGenerallyException("系统数据不能删除！");
    }

    public static JBuild4DCGenerallyException getDBFieldSettingDelException(){
        return new JBuild4DCGenerallyException("该记录已被设置为无法删除！");
    }

    public static JBuild4DCGenerallyException getHadChildDelException(){
        return new JBuild4DCGenerallyException("存在子记录,请先删除子记录！");
    }

    public static JBuild4DCGenerallyException getNotSupportMySQLException(){
        return new JBuild4DCGenerallyException("暂不支持Oracle！");
    }

    public static JBuild4DCGenerallyException getNotSupportOracleException(){
        return new JBuild4DCGenerallyException("暂不支持Oracle！");
    }

    public static JBuild4DCGenerallyException getNotSupportMSSQLException(){
        return new JBuild4DCGenerallyException("暂不支持MS SqlServer！");
    }
}
