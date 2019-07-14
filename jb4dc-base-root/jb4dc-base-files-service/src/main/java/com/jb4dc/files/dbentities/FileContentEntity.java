package com.jb4dc.files.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TFS_FILE_CONTENT
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class FileContentEntity {
    //FILE_ID:文件ID:关联于TFS_FILE_INFO
    @DBKeyField
    private String fileId;

    //FILE_CONTENT:文件的二进制内容
    private byte[] fileContent;

    /**
     * 构造函数
     * @param fileId 文件ID
     **/
    public FileContentEntity(String fileId) {
        this.fileId = fileId;
    }

    /**
     * 构造函数
     * @param fileId 文件ID
     * @param fileContent 文件的二进制内容
     **/
    public FileContentEntity(String fileId, byte[] fileContent) {
        this.fileId = fileId;
        this.fileContent = fileContent;
    }

    public FileContentEntity() {
        super();
    }

    /**
     * 文件ID:关联于TFS_FILE_INFO
     * @return java.lang.String
     **/
    public String getFileId() {
        return fileId;
    }

    /**
     * 文件ID:关联于TFS_FILE_INFO
     * @param fileId 文件ID
     **/
    public void setFileId(String fileId) {
        this.fileId = fileId == null ? null : fileId.trim();
    }

    /**
     * 文件的二进制内容
     * @return byte[]
     **/
    public byte[] getFileContent() {
        return fileContent;
    }

    /**
     * 文件的二进制内容
     * @param fileContent 文件的二进制内容
     **/
    public void setFileContent(byte[] fileContent) {
        this.fileContent = fileContent;
    }
}