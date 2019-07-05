package com.jb4dc.core.base.exception;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/2
 * To change this template use File | Settings | File Templates.
 */
public class JBuild4DCPhysicalTableException extends Exception {

    private static int ErrorCode_CreateTableError=1200000;
    private static int ErrorCode_TableIsExistError =1200001;
    private static int ErrorCode_TableIsExistRecordError =1200002;
    private static int ErrorCode_TableIsNotExistError=1200003;
    private static int ErrorCode_DeleteTableError=1200004;
    private static int ErrorCode_UpdateTableError=1200005;

    private static int ErrorCode_CreateFieldError=1300000;
    private static int ErrorCode_UpdateFieldError=1300003;
    private static int ErrorCode_FieldsCannotBeNullError =1300001;
    private static int ErrorCode_FieldTypeNodeSupportError =1300002;
    private static int ErrorCode_UpdateFieldNoAllowOverCountError =1300003;

    private int code;
    private String message;

    public JBuild4DCPhysicalTableException(int _code, String _message){
        this.code=_code;
        this.message=_message;
    }



    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public static JBuild4DCPhysicalTableException getCreateTableError(Exception ex){
        return new JBuild4DCPhysicalTableException(JBuild4DCPhysicalTableException.ErrorCode_CreateTableError,ex.getMessage());
    }

    public static JBuild4DCPhysicalTableException getFieldsCannotBeNullError(){
        return new JBuild4DCPhysicalTableException(JBuild4DCPhysicalTableException.ErrorCode_FieldsCannotBeNullError,"字段不能为空");
    }

    public static JBuild4DCPhysicalTableException getTableIsExistError(String tableName){
        return new JBuild4DCPhysicalTableException(JBuild4DCPhysicalTableException.ErrorCode_TableIsExistError,"已经存在名称为"+tableName+"的物理表!");
    }


    public static JBuild4DCPhysicalTableException getTableIsNotExistError(String tableName) {
        return new JBuild4DCPhysicalTableException(JBuild4DCPhysicalTableException.ErrorCode_TableIsNotExistError,"已经不存在名称为"+tableName+"的表!");
    }

    public static JBuild4DCPhysicalTableException getTableExistRecordError(String tableName) {
        return new JBuild4DCPhysicalTableException(JBuild4DCPhysicalTableException.ErrorCode_TableIsExistRecordError,"表"+tableName+"中存在记录,请先手工删除该表的记录!");
    }

    public static JBuild4DCPhysicalTableException getDeleteTableError(Exception ex){
        return new JBuild4DCPhysicalTableException(JBuild4DCPhysicalTableException.ErrorCode_DeleteTableError,ex.getMessage());
    }

    public static JBuild4DCPhysicalTableException getFieldTypeNodeSupportError(String typeName) {
        return new JBuild4DCPhysicalTableException(JBuild4DCPhysicalTableException.ErrorCode_FieldTypeNodeSupportError,"不支持字段类型"+typeName+"!");
    }

    public static JBuild4DCPhysicalTableException getFieldCreateError() {
        return new JBuild4DCPhysicalTableException(JBuild4DCPhysicalTableException.ErrorCode_CreateFieldError,"创建物理表字段失败!");
    }

    public static JBuild4DCPhysicalTableException getFieldUpdateError() {
        return new JBuild4DCPhysicalTableException(JBuild4DCPhysicalTableException.ErrorCode_UpdateFieldError,"修改物理表字段失败!");
    }

    public static JBuild4DCPhysicalTableException getFieldCreateError(Exception ex) {
        return new JBuild4DCPhysicalTableException(JBuild4DCPhysicalTableException.ErrorCode_CreateFieldError,ex.getMessage());
    }

    public static JBuild4DCPhysicalTableException getUpdateTableError(Exception ex) {
        return new JBuild4DCPhysicalTableException(JBuild4DCPhysicalTableException.ErrorCode_UpdateTableError,ex.getMessage());
    }

    public static JBuild4DCPhysicalTableException getUpdateFieldNoAllowOverCount(int i) {
        return new JBuild4DCPhysicalTableException(JBuild4DCPhysicalTableException.ErrorCode_UpdateFieldNoAllowOverCountError,"不允许修改记录超过"+i+"的表字段.请手工进行修改!");
    }

}
