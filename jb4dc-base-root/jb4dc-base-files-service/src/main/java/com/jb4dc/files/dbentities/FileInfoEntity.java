package com.jb4dc.files.dbentities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :TFS_FILE_INFO
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class FileInfoEntity {
    //FILE_ID:文件ID:UUID,主键
    @DBKeyField
    private String fileId;

    //FILE_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date fileCreateTime;

    //FILE_CREATOR_ID:创建人
    private String fileCreatorId;

    //FILE_CREATOR_NAME:创建人姓名
    private String fileCreatorName;

    //FILE_NAME:文件名称
    private String fileName;

    //FILE_SIZE:文件大小
    private Long fileSize;

    //FILE_STORE_TYPE:文件的存储位置:小文件可以存储于数据库中
    private String fileStoreType;

    //FILE_STORE_PATH:文件的存储路径
    private String fileStorePath;

    //FILE_STORE_NAME:文件的物理存储名称
    private String fileStoreName;

    //FILE_ORGAN_ID:文件创建组织的ID
    private String fileOrganId;

    //FILE_ORGAN_NAME:文件创建的组织名称
    private String fileOrganName;

    //FILE_EXTENSION:文件的扩展名称
    private String fileExtension;

    //FILE_DESCRIPTION:文件的描述
    private String fileDescription;

    //FILE_READ_TIME:文件的读取次数
    private Integer fileReadTime;

    //FILE_STATUS:文件的状态值
    private String fileStatus;

    //FILE_ORDER_NUM:文件的排序号
    private Integer fileOrderNum;

    //FILE_VERSION:文件的版本号
    private Integer fileVersion;

    //FILE_CATEGORY:文件分类名称
    private String fileCategory;

    //FILE_HASH_CODE:文件Hash值
    private String fileHashCode;

    //FILE_GROUP_ID:文件分组ID
    private String fileGroupId;

    /**
     * 构造函数
     * @param fileId 文件ID
     * @param fileCreateTime 创建时间
     * @param fileCreatorId 创建人
     * @param fileCreatorName 创建人姓名
     * @param fileName 文件名称
     * @param fileSize 文件大小
     * @param fileStoreType 文件的存储位置
     * @param fileStorePath 文件的存储路径
     * @param fileStoreName 文件的物理存储名称
     * @param fileOrganId 文件创建组织的ID
     * @param fileOrganName 文件创建的组织名称
     * @param fileExtension 文件的扩展名称
     * @param fileDescription 文件的描述
     * @param fileReadTime 文件的读取次数
     * @param fileStatus 文件的状态值
     * @param fileOrderNum 文件的排序号
     * @param fileVersion 文件的版本号
     * @param fileCategory 文件分类名称
     * @param fileHashCode 文件Hash值
     * @param fileGroupId 文件分组ID
     **/
    public FileInfoEntity(String fileId, Date fileCreateTime, String fileCreatorId, String fileCreatorName, String fileName, Long fileSize, String fileStoreType, String fileStorePath, String fileStoreName, String fileOrganId, String fileOrganName, String fileExtension, String fileDescription, Integer fileReadTime, String fileStatus, Integer fileOrderNum, Integer fileVersion, String fileCategory, String fileHashCode, String fileGroupId) {
        this.fileId = fileId;
        this.fileCreateTime = fileCreateTime;
        this.fileCreatorId = fileCreatorId;
        this.fileCreatorName = fileCreatorName;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.fileStoreType = fileStoreType;
        this.fileStorePath = fileStorePath;
        this.fileStoreName = fileStoreName;
        this.fileOrganId = fileOrganId;
        this.fileOrganName = fileOrganName;
        this.fileExtension = fileExtension;
        this.fileDescription = fileDescription;
        this.fileReadTime = fileReadTime;
        this.fileStatus = fileStatus;
        this.fileOrderNum = fileOrderNum;
        this.fileVersion = fileVersion;
        this.fileCategory = fileCategory;
        this.fileHashCode = fileHashCode;
        this.fileGroupId = fileGroupId;
    }

    public FileInfoEntity() {
        super();
    }

    /**
     * 文件ID:UUID,主键
     * @return java.lang.String
     **/
    public String getFileId() {
        return fileId;
    }

    /**
     * 文件ID:UUID,主键
     * @param fileId 文件ID
     **/
    public void setFileId(String fileId) {
        this.fileId = fileId == null ? null : fileId.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getFileCreateTime() {
        return fileCreateTime;
    }

    /**
     * 创建时间
     * @param fileCreateTime 创建时间
     **/
    public void setFileCreateTime(Date fileCreateTime) {
        this.fileCreateTime = fileCreateTime;
    }

    /**
     * 创建人
     * @return java.lang.String
     **/
    public String getFileCreatorId() {
        return fileCreatorId;
    }

    /**
     * 创建人
     * @param fileCreatorId 创建人
     **/
    public void setFileCreatorId(String fileCreatorId) {
        this.fileCreatorId = fileCreatorId == null ? null : fileCreatorId.trim();
    }

    /**
     * 创建人姓名
     * @return java.lang.String
     **/
    public String getFileCreatorName() {
        return fileCreatorName;
    }

    /**
     * 创建人姓名
     * @param fileCreatorName 创建人姓名
     **/
    public void setFileCreatorName(String fileCreatorName) {
        this.fileCreatorName = fileCreatorName == null ? null : fileCreatorName.trim();
    }

    /**
     * 文件名称
     * @return java.lang.String
     **/
    public String getFileName() {
        return fileName;
    }

    /**
     * 文件名称
     * @param fileName 文件名称
     **/
    public void setFileName(String fileName) {
        this.fileName = fileName == null ? null : fileName.trim();
    }

    /**
     * 文件大小
     * @return java.lang.Long
     **/
    public Long getFileSize() {
        return fileSize;
    }

    /**
     * 文件大小
     * @param fileSize 文件大小
     **/
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    /**
     * 文件的存储位置:小文件可以存储于数据库中
     * @return java.lang.String
     **/
    public String getFileStoreType() {
        return fileStoreType;
    }

    /**
     * 文件的存储位置:小文件可以存储于数据库中
     * @param fileStoreType 文件的存储位置
     **/
    public void setFileStoreType(String fileStoreType) {
        this.fileStoreType = fileStoreType == null ? null : fileStoreType.trim();
    }

    /**
     * 文件的存储路径
     * @return java.lang.String
     **/
    public String getFileStorePath() {
        return fileStorePath;
    }

    /**
     * 文件的存储路径
     * @param fileStorePath 文件的存储路径
     **/
    public void setFileStorePath(String fileStorePath) {
        this.fileStorePath = fileStorePath == null ? null : fileStorePath.trim();
    }

    /**
     * 文件的物理存储名称
     * @return java.lang.String
     **/
    public String getFileStoreName() {
        return fileStoreName;
    }

    /**
     * 文件的物理存储名称
     * @param fileStoreName 文件的物理存储名称
     **/
    public void setFileStoreName(String fileStoreName) {
        this.fileStoreName = fileStoreName == null ? null : fileStoreName.trim();
    }

    /**
     * 文件创建组织的ID
     * @return java.lang.String
     **/
    public String getFileOrganId() {
        return fileOrganId;
    }

    /**
     * 文件创建组织的ID
     * @param fileOrganId 文件创建组织的ID
     **/
    public void setFileOrganId(String fileOrganId) {
        this.fileOrganId = fileOrganId == null ? null : fileOrganId.trim();
    }

    /**
     * 文件创建的组织名称
     * @return java.lang.String
     **/
    public String getFileOrganName() {
        return fileOrganName;
    }

    /**
     * 文件创建的组织名称
     * @param fileOrganName 文件创建的组织名称
     **/
    public void setFileOrganName(String fileOrganName) {
        this.fileOrganName = fileOrganName == null ? null : fileOrganName.trim();
    }

    /**
     * 文件的扩展名称
     * @return java.lang.String
     **/
    public String getFileExtension() {
        return fileExtension;
    }

    /**
     * 文件的扩展名称
     * @param fileExtension 文件的扩展名称
     **/
    public void setFileExtension(String fileExtension) {
        this.fileExtension = fileExtension == null ? null : fileExtension.trim();
    }

    /**
     * 文件的描述
     * @return java.lang.String
     **/
    public String getFileDescription() {
        return fileDescription;
    }

    /**
     * 文件的描述
     * @param fileDescription 文件的描述
     **/
    public void setFileDescription(String fileDescription) {
        this.fileDescription = fileDescription == null ? null : fileDescription.trim();
    }

    /**
     * 文件的读取次数
     * @return java.lang.Integer
     **/
    public Integer getFileReadTime() {
        return fileReadTime;
    }

    /**
     * 文件的读取次数
     * @param fileReadTime 文件的读取次数
     **/
    public void setFileReadTime(Integer fileReadTime) {
        this.fileReadTime = fileReadTime;
    }

    /**
     * 文件的状态值
     * @return java.lang.String
     **/
    public String getFileStatus() {
        return fileStatus;
    }

    /**
     * 文件的状态值
     * @param fileStatus 文件的状态值
     **/
    public void setFileStatus(String fileStatus) {
        this.fileStatus = fileStatus == null ? null : fileStatus.trim();
    }

    /**
     * 文件的排序号
     * @return java.lang.Integer
     **/
    public Integer getFileOrderNum() {
        return fileOrderNum;
    }

    /**
     * 文件的排序号
     * @param fileOrderNum 文件的排序号
     **/
    public void setFileOrderNum(Integer fileOrderNum) {
        this.fileOrderNum = fileOrderNum;
    }

    /**
     * 文件的版本号
     * @return java.lang.Integer
     **/
    public Integer getFileVersion() {
        return fileVersion;
    }

    /**
     * 文件的版本号
     * @param fileVersion 文件的版本号
     **/
    public void setFileVersion(Integer fileVersion) {
        this.fileVersion = fileVersion;
    }

    /**
     * 文件分类名称
     * @return java.lang.String
     **/
    public String getFileCategory() {
        return fileCategory;
    }

    /**
     * 文件分类名称
     * @param fileCategory 文件分类名称
     **/
    public void setFileCategory(String fileCategory) {
        this.fileCategory = fileCategory == null ? null : fileCategory.trim();
    }

    /**
     * 文件Hash值
     * @return java.lang.String
     **/
    public String getFileHashCode() {
        return fileHashCode;
    }

    /**
     * 文件Hash值
     * @param fileHashCode 文件Hash值
     **/
    public void setFileHashCode(String fileHashCode) {
        this.fileHashCode = fileHashCode == null ? null : fileHashCode.trim();
    }

    /**
     * 文件分组ID
     * @return java.lang.String
     **/
    public String getFileGroupId() {
        return fileGroupId;
    }

    /**
     * 文件分组ID
     * @param fileGroupId 文件分组ID
     **/
    public void setFileGroupId(String fileGroupId) {
        this.fileGroupId = fileGroupId == null ? null : fileGroupId.trim();
    }
}