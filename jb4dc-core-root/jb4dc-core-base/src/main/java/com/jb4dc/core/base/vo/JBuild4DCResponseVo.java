package com.jb4dc.core.base.vo;

import java.util.HashMap;
import java.util.Map;

public class JBuild4DCResponseVo<T> {
    public static final String SUCCESSMSG = "操作成功!";
    public static final String GETDATASUCCESSMSG = "获取数据成功!";
    /**
     * 是否成功
     */
    private boolean success = true;

    /**
     * 消息
     */
    private String message = "";

    private String traceMsg="";

    /**
     * 错误码
     */
    private Integer errorCode;

    /**
     * 数据
     */
    private T data;

    private Map<String,Object> exKVData=new HashMap<>();

    public JBuild4DCResponseVo() {
    }

    public JBuild4DCResponseVo(boolean success, String message, T data, Integer errorCode) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errorCode = errorCode;
    }

    public JBuild4DCResponseVo(boolean success, String message, T data, Integer errorCode, String traceMsg) {
        this.success = success;
        this.message = message;
        this.traceMsg = traceMsg;
        this.errorCode = errorCode;
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Integer getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(Integer errorCode) {
        this.errorCode = errorCode;
    }

    /**
     * 返回SSSResponse实例
     *
     * @return SSSResponse
     */
    public static JBuild4DCResponseVo success() {
        return new JBuild4DCResponseVo(true, "", null, null);
    }

    /**
     * 返回SSSResponse实例
     *
     * @param message 成功信息
     * @return
     */
    public static JBuild4DCResponseVo success(String message) {
        return new JBuild4DCResponseVo(true, message, null, null);
    }

    /**
     * 返回SSSResponse实例
     *
     * @param message 成功信息
     * @param data    数据
     * @return
     */
    public static <T> JBuild4DCResponseVo success(String message, T data) {
        return new JBuild4DCResponseVo(true, message, data, null);
    }

    public static <T> JBuild4DCResponseVo getDataSuccess(T data){
        return success("获取数据成功!",data);
    }

    public static JBuild4DCResponseVo deleteSuccess(){
        return success("删除成功！");
    }

    public static JBuild4DCResponseVo saveSuccess(){
        return success("保存成功！");
    }

    public static <T> JBuild4DCResponseVo saveSuccess(T data){
        return success("保存成功！",data);
    }

    public static JBuild4DCResponseVo opSuccess(){
        return success("操作成功！");
    }

    public static <T> JBuild4DCResponseVo opSuccess(T data){
        return success("操作成功！",data);
    }

    public static JBuild4DCResponseVo deleteError(){
        return success("删除失败！");
    }

    public static JBuild4DCResponseVo saveError(){
        return success("保存失败！");
    }

    public static JBuild4DCResponseVo opError(){
        return error("操作失败！");
    }

    public static JBuild4DCResponseVo opError(String msg){
        return error(msg);
    }

    /**
     * 返回SSSResponse实例 用于APP普通列表（分页列表还是用success方法）
     *
     * @param message 成功信息
     * @param data    数据
     * @return
     */
    public static <T> JBuild4DCResponseVo successMap(String message, T data) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("results", data);
        return new JBuild4DCResponseVo(true, message, map, null);
    }

    /**
     * 返回SSSResponse实例
     *
     * @param message 失败信息
     * @return
     */
    public static JBuild4DCResponseVo error(String message) {
        return new JBuild4DCResponseVo(false, message, null, null);
    }

    public static JBuild4DCResponseVo error(String message, String traceMsg) {
        return new JBuild4DCResponseVo(false, message, null, null,traceMsg);
    }

    /**
     * 返回SSSResponse实例
     *
     * @param message 失败信息
     * @param data    数据
     * @return
     */
    public static JBuild4DCResponseVo error(String message, Object data) {
        return new JBuild4DCResponseVo(false, message, data, null);
    }

    /**
     * 返回SSSResponse实例
     *
     * @param sssBaseException 异常
     * @return
     */
    public static JBuild4DCResponseVo error(JBuild4DCResponseVo sssBaseException) {
        return new JBuild4DCResponseVo(false, sssBaseException.getMessage(), null, sssBaseException.getErrorCode());
    }

    public void addExKVData(String key,Object value){
        exKVData.put(key,value);
    }

    public void setExKVData(Map<String, Object> _exKVData) {
        exKVData = _exKVData;
    }

    public Map<String,Object> getExKVData() {
        return exKVData;
    }
}
