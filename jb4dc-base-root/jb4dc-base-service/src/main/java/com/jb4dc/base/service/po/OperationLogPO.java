package com.jb4dc.base.service.po;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/30
 * To change this template use File | Settings | File Templates.
 */
public class OperationLogPO {
    //LOG_ID:日志的ID:随机的UUID,主键
    @DBKeyField
    private String logId;

    //LOG_TEXT:操作内容
    private String logText;

    //LOG_ORDER_NUM:排序号
    private Integer logOrderNum;

    //LOG_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date logCreateTime;

    //LOG_SYSTEM_ID:所属系统ID
    private String logSystemId;

    //LOG_SYSTEM_NAME:系统名称
    private String logSystemName;

    //LOG_MODULE_ID:模块ID
    private String logModuleId;

    //LOG_MODULE_NAME:模块名称
    private String logModuleName;

    //LOG_ACTION_NAME:动作名称
    private String logActionName;

    //LOG_DATA:日志数据
    private String logData;

    //LOG_USER_ID:用户ID
    private String logUserId;

    //LOG_USER_NAME:用户名称
    private String logUserName;

    //LOG_ORGAN_ID:组织ID
    private String logOrganId;

    //LOG_ORGAN_NAME:组织名称
    private String logOrganName;

    //LOG_IP:IP地址
    private String logIp;

    //LOG_TYPE:日志类型
    private String logType;

    //LOG_CLASS_NAME:类名
    private String logClassName;

    //LOG_STATUS:状态
    private String logStatus;

    /**
     * 构造函数
     * @param logId 日志的ID
     * @param logText 操作内容
     * @param logOrderNum 排序号
     * @param logCreateTime 创建时间
     * @param logSystemId 所属系统ID
     * @param logSystemName 系统名称
     * @param logModuleId 模块ID
     * @param logModuleName 模块名称
     * @param logActionName 动作名称
     * @param logData 日志数据
     * @param logUserId 用户ID
     * @param logUserName 用户名称
     * @param logOrganId 组织ID
     * @param logOrganName 组织名称
     * @param logIp IP地址
     * @param logType 日志类型
     * @param logClassName 类名
     * @param logStatus 状态
     **/
    public OperationLogPO(String logId, String logText, Integer logOrderNum, Date logCreateTime, String logSystemId, String logSystemName, String logModuleId, String logModuleName, String logActionName, String logData, String logUserId, String logUserName, String logOrganId, String logOrganName, String logIp, String logType, String logClassName, String logStatus) {
        this.logId = logId;
        this.logText = logText;
        this.logOrderNum = logOrderNum;
        this.logCreateTime = logCreateTime;
        this.logSystemId = logSystemId;
        this.logSystemName = logSystemName;
        this.logModuleId = logModuleId;
        this.logModuleName = logModuleName;
        this.logActionName = logActionName;
        this.logData = logData;
        this.logUserId = logUserId;
        this.logUserName = logUserName;
        this.logOrganId = logOrganId;
        this.logOrganName = logOrganName;
        this.logIp = logIp;
        this.logType = logType;
        this.logClassName = logClassName;
        this.logStatus = logStatus;
    }

    public OperationLogPO() {
        super();
    }

    /**
     * 日志的ID:随机的UUID,主键
     * @return java.lang.String
     **/
    public String getLogId() {
        return logId;
    }

    /**
     * 日志的ID:随机的UUID,主键
     * @param logId 日志的ID
     **/
    public void setLogId(String logId) {
        this.logId = logId == null ? null : logId.trim();
    }

    /**
     * 操作内容
     * @return java.lang.String
     **/
    public String getLogText() {
        return logText;
    }

    /**
     * 操作内容
     * @param logText 操作内容
     **/
    public void setLogText(String logText) {
        this.logText = logText == null ? null : logText.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getLogOrderNum() {
        return logOrderNum;
    }

    /**
     * 排序号
     * @param logOrderNum 排序号
     **/
    public void setLogOrderNum(Integer logOrderNum) {
        this.logOrderNum = logOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getLogCreateTime() {
        return logCreateTime;
    }

    /**
     * 创建时间
     * @param logCreateTime 创建时间
     **/
    public void setLogCreateTime(Date logCreateTime) {
        this.logCreateTime = logCreateTime;
    }

    /**
     * 所属系统ID
     * @return java.lang.String
     **/
    public String getLogSystemId() {
        return logSystemId;
    }

    /**
     * 所属系统ID
     * @param logSystemId 所属系统ID
     **/
    public void setLogSystemId(String logSystemId) {
        this.logSystemId = logSystemId == null ? null : logSystemId.trim();
    }

    /**
     * 系统名称
     * @return java.lang.String
     **/
    public String getLogSystemName() {
        return logSystemName;
    }

    /**
     * 系统名称
     * @param logSystemName 系统名称
     **/
    public void setLogSystemName(String logSystemName) {
        this.logSystemName = logSystemName == null ? null : logSystemName.trim();
    }

    /**
     * 模块ID
     * @return java.lang.String
     **/
    public String getLogModuleId() {
        return logModuleId;
    }

    /**
     * 模块ID
     * @param logModuleId 模块ID
     **/
    public void setLogModuleId(String logModuleId) {
        this.logModuleId = logModuleId == null ? null : logModuleId.trim();
    }

    /**
     * 模块名称
     * @return java.lang.String
     **/
    public String getLogModuleName() {
        return logModuleName;
    }

    /**
     * 模块名称
     * @param logModuleName 模块名称
     **/
    public void setLogModuleName(String logModuleName) {
        this.logModuleName = logModuleName == null ? null : logModuleName.trim();
    }

    /**
     * 动作名称
     * @return java.lang.String
     **/
    public String getLogActionName() {
        return logActionName;
    }

    /**
     * 动作名称
     * @param logActionName 动作名称
     **/
    public void setLogActionName(String logActionName) {
        this.logActionName = logActionName == null ? null : logActionName.trim();
    }

    /**
     * 日志数据
     * @return java.lang.String
     **/
    public String getLogData() {
        return logData;
    }

    /**
     * 日志数据
     * @param logData 日志数据
     **/
    public void setLogData(String logData) {
        this.logData = logData == null ? null : logData.trim();
    }

    /**
     * 用户ID
     * @return java.lang.String
     **/
    public String getLogUserId() {
        return logUserId;
    }

    /**
     * 用户ID
     * @param logUserId 用户ID
     **/
    public void setLogUserId(String logUserId) {
        this.logUserId = logUserId == null ? null : logUserId.trim();
    }

    /**
     * 用户名称
     * @return java.lang.String
     **/
    public String getLogUserName() {
        return logUserName;
    }

    /**
     * 用户名称
     * @param logUserName 用户名称
     **/
    public void setLogUserName(String logUserName) {
        this.logUserName = logUserName == null ? null : logUserName.trim();
    }

    /**
     * 组织ID
     * @return java.lang.String
     **/
    public String getLogOrganId() {
        return logOrganId;
    }

    /**
     * 组织ID
     * @param logOrganId 组织ID
     **/
    public void setLogOrganId(String logOrganId) {
        this.logOrganId = logOrganId == null ? null : logOrganId.trim();
    }

    /**
     * 组织名称
     * @return java.lang.String
     **/
    public String getLogOrganName() {
        return logOrganName;
    }

    /**
     * 组织名称
     * @param logOrganName 组织名称
     **/
    public void setLogOrganName(String logOrganName) {
        this.logOrganName = logOrganName == null ? null : logOrganName.trim();
    }

    /**
     * IP地址
     * @return java.lang.String
     **/
    public String getLogIp() {
        return logIp;
    }

    /**
     * IP地址
     * @param logIp IP地址
     **/
    public void setLogIp(String logIp) {
        this.logIp = logIp == null ? null : logIp.trim();
    }

    /**
     * 日志类型
     * @return java.lang.String
     **/
    public String getLogType() {
        return logType;
    }

    /**
     * 日志类型
     * @param logType 日志类型
     **/
    public void setLogType(String logType) {
        this.logType = logType == null ? null : logType.trim();
    }

    /**
     * 类名
     * @return java.lang.String
     **/
    public String getLogClassName() {
        return logClassName;
    }

    /**
     * 类名
     * @param logClassName 类名
     **/
    public void setLogClassName(String logClassName) {
        this.logClassName = logClassName == null ? null : logClassName.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getLogStatus() {
        return logStatus;
    }

    /**
     * 状态
     * @param logStatus 状态
     **/
    public void setLogStatus(String logStatus) {
        this.logStatus = logStatus == null ? null : logStatus.trim();
    }
}
