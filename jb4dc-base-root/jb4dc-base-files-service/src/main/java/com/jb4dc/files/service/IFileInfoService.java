package com.jb4dc.files.service;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.files.dbentities.FileInfoEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IFileInfoService extends IBaseService<FileInfoEntity> {

    FileInfoEntity addSmallFileToDB(JB4DCSession jb4DCSession, MultipartFile file,String objId,String objName,String objType) throws IOException;

    byte[] getContent(String fileId);
}
