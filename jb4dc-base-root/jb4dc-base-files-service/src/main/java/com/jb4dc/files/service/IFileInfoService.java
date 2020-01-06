package com.jb4dc.files.service;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.files.dbentities.FileInfoEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IFileInfoService extends IBaseService<FileInfoEntity> {

    public static final String FILE_CATEGORY_MAIN_IMAGE = "主题图片";
    public static final String FILE_CATEGORY_USER_HEADER = "用户头像";
    public static final String FILE_CATEGORY_ATTACHMENT = "附件";
    public static final String FILE_CATEGORY_MANUSCRIPT_PAPER = "稿纸";
    public static final String FILE_CATEGORY_MAIN_BODY= "正文";
    public static final String FILE_CATEGORY_BPMN_XML= "BPMN流程定义";

    FileInfoEntity getLastVersionFileInfo(JB4DCSession session, String objId, String objName);

    List<FileInfoEntity> getFileInfoList(JB4DCSession session, String objId, String objName);

    FileInfoEntity addSmallFileToDB(JB4DCSession jb4DCSession, MultipartFile file, String objId, String objName, String objType,String fileCategory) throws IOException;

    byte[] getContent(String fileId);
}
