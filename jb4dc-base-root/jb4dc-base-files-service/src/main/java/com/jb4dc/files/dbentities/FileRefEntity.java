package com.jb4dc.files.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TFS_FILE_REF
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class FileRefEntity {
    //REF_ID:文件引用的ID:UUID,主键
    @DBKeyField
    private String refId;

    //REF_FILE_ID:文件的ID:关联到表TFS_FILE_INFO
    private String refFileId;

    //REF_OBJ_ID:关联记录的ID
    private String refObjId;

    //REF_OBJ_NAME:关联记录的对象名称
    private String refObjName;

    //REF_ORDER_NUM:排序号
    private Integer refOrderNum;

    //REF_STATUS:文件引用的状态值
    private String refStatus;

    /**
     * 构造函数
     * @param refId 文件引用的ID
     * @param refFileId 文件的ID
     * @param refObjId 关联记录的ID
     * @param refObjName 关联记录的对象名称
     * @param refOrderNum 排序号
     * @param refStatus 文件引用的状态值
     **/
    public FileRefEntity(String refId, String refFileId, String refObjId, String refObjName, Integer refOrderNum, String refStatus) {
        this.refId = refId;
        this.refFileId = refFileId;
        this.refObjId = refObjId;
        this.refObjName = refObjName;
        this.refOrderNum = refOrderNum;
        this.refStatus = refStatus;
    }

    public FileRefEntity() {
        super();
    }

    /**
     * 文件引用的ID:UUID,主键
     * @return java.lang.String
     **/
    public String getRefId() {
        return refId;
    }

    /**
     * 文件引用的ID:UUID,主键
     * @param refId 文件引用的ID
     **/
    public void setRefId(String refId) {
        this.refId = refId == null ? null : refId.trim();
    }

    /**
     * 文件的ID:关联到表TFS_FILE_INFO
     * @return java.lang.String
     **/
    public String getRefFileId() {
        return refFileId;
    }

    /**
     * 文件的ID:关联到表TFS_FILE_INFO
     * @param refFileId 文件的ID
     **/
    public void setRefFileId(String refFileId) {
        this.refFileId = refFileId == null ? null : refFileId.trim();
    }

    /**
     * 关联记录的ID
     * @return java.lang.String
     **/
    public String getRefObjId() {
        return refObjId;
    }

    /**
     * 关联记录的ID
     * @param refObjId 关联记录的ID
     **/
    public void setRefObjId(String refObjId) {
        this.refObjId = refObjId == null ? null : refObjId.trim();
    }

    /**
     * 关联记录的对象名称
     * @return java.lang.String
     **/
    public String getRefObjName() {
        return refObjName;
    }

    /**
     * 关联记录的对象名称
     * @param refObjName 关联记录的对象名称
     **/
    public void setRefObjName(String refObjName) {
        this.refObjName = refObjName == null ? null : refObjName.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getRefOrderNum() {
        return refOrderNum;
    }

    /**
     * 排序号
     * @param refOrderNum 排序号
     **/
    public void setRefOrderNum(Integer refOrderNum) {
        this.refOrderNum = refOrderNum;
    }

    /**
     * 文件引用的状态值
     * @return java.lang.String
     **/
    public String getRefStatus() {
        return refStatus;
    }

    /**
     * 文件引用的状态值
     * @param refStatus 文件引用的状态值
     **/
    public void setRefStatus(String refStatus) {
        this.refStatus = refStatus == null ? null : refStatus.trim();
    }
}