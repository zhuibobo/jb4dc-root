package com.jb4dc.files.service;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.files.dbentities.FileInfoEntity;
import com.jb4dc.files.po.SimpleFilePathPO;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

public interface IFileInfoService extends IBaseService<FileInfoEntity> {

    public static final String FILE_CATEGORY_MAIN_IMAGE = "主题图片";
    public static final String FILE_CATEGORY_USER_HEADER = "用户头像";
    public static final String FILE_CATEGORY_ATTACHMENT = "附件";
    public static final String FILE_CATEGORY_MANUSCRIPT_PAPER = "稿纸";
    public static final String FILE_CATEGORY_MAIN_BODY= "正文";
    public static final String FILE_CATEGORY_BPMN_XML= "BPMN流程定义";

    public static final String FILE_OBJ_TYPE_TABLE_NAME= "数据表名";

    FileInfoEntity getLastVersionFileInfo(JB4DCSession session, String objId, String objName);

    List<FileInfoEntity> getFileInfoList(JB4DCSession session, String objId, String objName);

    List<FileInfoEntity> getFileInfoListByObjectId(JB4DCSession session, String objId, String category);

    List<FileInfoEntity> getFileInfoListByObjectId(JB4DCSession session, String objId);

    FileInfoEntity addSmallFileToDB(JB4DCSession session, String fileName, byte[] fileByte, String objId, String objName, String objType, String fileCategory) throws IOException, JBuild4DCGenerallyException;

    FileInfoEntity addSmallFileToDB(JB4DCSession jb4DCSession, MultipartFile file, String objId, String objName, String objType, String fileCategory) throws IOException, JBuild4DCGenerallyException;

    FileInfoEntity addFileToFileSystem(JB4DCSession session, String fileName, byte[] fileByte, String objId, String objName, String objType, String fileCategory) throws JBuild4DCGenerallyException, IOException, URISyntaxException;

    FileInfoEntity addFileToFileSystem(JB4DCSession session, MultipartFile file, String objId, String objName, String objType, String fileCategory) throws IOException, JBuild4DCGenerallyException, URISyntaxException;

    SimpleFilePathPO buildSavePath(String preFolderName, String recordId, String fileName) throws FileNotFoundException, URISyntaxException;

    String buildFilePath(FileInfoEntity fileInfoEntity) throws URISyntaxException, FileNotFoundException;

    byte[] getContentInDB(String fileId);
}
