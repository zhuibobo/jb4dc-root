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
public class HistoryDataPO {
    //HISTORY_ID:随机生成:UUID
    @DBKeyField
    private String historyId;

    //HISTORY_SYSTEM_NAME:系统名称
    private String historySystemName;

    //HISTORY_SYSTEM_ID:所属系统ID
    private String historySystemId;

    //HISTORY_MODULE_NAME:模块名称
    private String historyModuleName;

    //HISTORY_MODULE_ID:模块ID
    private String historyModuleId;

    //HISTORY_RECORD:被删除数据的json格式数据
    private String historyRecord;

    //HISTORY_ORGAN_ID:删除用户所在的组织id
    private String historyOrganId;

    //HISTORY_ORGAN_NAME:删除用户所在的组织名称
    private String historyOrganName;

    //HISTORY_USER_ID:删除用户的ID
    private String historyUserId;

    //HISTORY_USER_NAME:删除用户的用户名
    private String historyUserName;

    //HISTORY_CREATE_TIME:记录的创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date historyCreateTime;

    //HISTORY_TABLE_NAME:删除记录的表名
    private String historyTableName;

    //HISTORY_RECORD_ID:删除记录的主键值
    private String historyRecordId;

    /**
     * 构造函数
     * @param historyId 随机生成
     * @param historySystemName 系统名称
     * @param historySystemId 所属系统ID
     * @param historyModuleName 模块名称
     * @param historyModuleId 模块ID
     * @param historyRecord 被删除数据的json格式数据
     * @param historyOrganId 删除用户所在的组织id
     * @param historyOrganName 删除用户所在的组织名称
     * @param historyUserId 删除用户的ID
     * @param historyUserName 删除用户的用户名
     * @param historyCreateTime 记录的创建时间
     * @param historyTableName 删除记录的表名
     * @param historyRecordId 删除记录的主键值
     **/
    public HistoryDataPO(String historyId, String historySystemName, String historySystemId, String historyModuleName, String historyModuleId, String historyRecord, String historyOrganId, String historyOrganName, String historyUserId, String historyUserName, Date historyCreateTime, String historyTableName, String historyRecordId) {
        this.historyId = historyId;
        this.historySystemName = historySystemName;
        this.historySystemId = historySystemId;
        this.historyModuleName = historyModuleName;
        this.historyModuleId = historyModuleId;
        this.historyRecord = historyRecord;
        this.historyOrganId = historyOrganId;
        this.historyOrganName = historyOrganName;
        this.historyUserId = historyUserId;
        this.historyUserName = historyUserName;
        this.historyCreateTime = historyCreateTime;
        this.historyTableName = historyTableName;
        this.historyRecordId = historyRecordId;
    }

    public HistoryDataPO() {
        super();
    }

    /**
     * 随机生成:UUID
     * @return java.lang.String
     **/
    public String getHistoryId() {
        return historyId;
    }

    /**
     * 随机生成:UUID
     * @param historyId 随机生成
     **/
    public void setHistoryId(String historyId) {
        this.historyId = historyId == null ? null : historyId.trim();
    }

    /**
     * 系统名称
     * @return java.lang.String
     **/
    public String getHistorySystemName() {
        return historySystemName;
    }

    /**
     * 系统名称
     * @param historySystemName 系统名称
     **/
    public void setHistorySystemName(String historySystemName) {
        this.historySystemName = historySystemName == null ? null : historySystemName.trim();
    }

    /**
     * 所属系统ID
     * @return java.lang.String
     **/
    public String getHistorySystemId() {
        return historySystemId;
    }

    /**
     * 所属系统ID
     * @param historySystemId 所属系统ID
     **/
    public void setHistorySystemId(String historySystemId) {
        this.historySystemId = historySystemId == null ? null : historySystemId.trim();
    }

    /**
     * 模块名称
     * @return java.lang.String
     **/
    public String getHistoryModuleName() {
        return historyModuleName;
    }

    /**
     * 模块名称
     * @param historyModuleName 模块名称
     **/
    public void setHistoryModuleName(String historyModuleName) {
        this.historyModuleName = historyModuleName == null ? null : historyModuleName.trim();
    }

    /**
     * 模块ID
     * @return java.lang.String
     **/
    public String getHistoryModuleId() {
        return historyModuleId;
    }

    /**
     * 模块ID
     * @param historyModuleId 模块ID
     **/
    public void setHistoryModuleId(String historyModuleId) {
        this.historyModuleId = historyModuleId == null ? null : historyModuleId.trim();
    }

    /**
     * 被删除数据的json格式数据
     * @return java.lang.String
     **/
    public String getHistoryRecord() {
        return historyRecord;
    }

    /**
     * 被删除数据的json格式数据
     * @param historyRecord 被删除数据的json格式数据
     **/
    public void setHistoryRecord(String historyRecord) {
        this.historyRecord = historyRecord == null ? null : historyRecord.trim();
    }

    /**
     * 删除用户所在的组织id
     * @return java.lang.String
     **/
    public String getHistoryOrganId() {
        return historyOrganId;
    }

    /**
     * 删除用户所在的组织id
     * @param historyOrganId 删除用户所在的组织id
     **/
    public void setHistoryOrganId(String historyOrganId) {
        this.historyOrganId = historyOrganId == null ? null : historyOrganId.trim();
    }

    /**
     * 删除用户所在的组织名称
     * @return java.lang.String
     **/
    public String getHistoryOrganName() {
        return historyOrganName;
    }

    /**
     * 删除用户所在的组织名称
     * @param historyOrganName 删除用户所在的组织名称
     **/
    public void setHistoryOrganName(String historyOrganName) {
        this.historyOrganName = historyOrganName == null ? null : historyOrganName.trim();
    }

    /**
     * 删除用户的ID
     * @return java.lang.String
     **/
    public String getHistoryUserId() {
        return historyUserId;
    }

    /**
     * 删除用户的ID
     * @param historyUserId 删除用户的ID
     **/
    public void setHistoryUserId(String historyUserId) {
        this.historyUserId = historyUserId == null ? null : historyUserId.trim();
    }

    /**
     * 删除用户的用户名
     * @return java.lang.String
     **/
    public String getHistoryUserName() {
        return historyUserName;
    }

    /**
     * 删除用户的用户名
     * @param historyUserName 删除用户的用户名
     **/
    public void setHistoryUserName(String historyUserName) {
        this.historyUserName = historyUserName == null ? null : historyUserName.trim();
    }

    /**
     * 记录的创建时间
     * @return java.util.Date
     **/
    public Date getHistoryCreateTime() {
        return historyCreateTime;
    }

    /**
     * 记录的创建时间
     * @param historyCreateTime 记录的创建时间
     **/
    public void setHistoryCreateTime(Date historyCreateTime) {
        this.historyCreateTime = historyCreateTime;
    }

    /**
     * 删除记录的表名
     * @return java.lang.String
     **/
    public String getHistoryTableName() {
        return historyTableName;
    }

    /**
     * 删除记录的表名
     * @param historyTableName 删除记录的表名
     **/
    public void setHistoryTableName(String historyTableName) {
        this.historyTableName = historyTableName == null ? null : historyTableName.trim();
    }

    /**
     * 删除记录的主键值
     * @return java.lang.String
     **/
    public String getHistoryRecordId() {
        return historyRecordId;
    }

    /**
     * 删除记录的主键值
     * @param historyRecordId 删除记录的主键值
     **/
    public void setHistoryRecordId(String historyRecordId) {
        this.historyRecordId = historyRecordId == null ? null : historyRecordId.trim();
    }
}
