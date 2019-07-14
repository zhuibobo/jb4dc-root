package com.jb4dc.files.service.impl;

import com.jb4dc.base.dbaccess.exenum.EnableTypeEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.files.dao.FileContentMapper;
import com.jb4dc.files.dao.FileInfoMapper;
import com.jb4dc.files.dbentities.FileContentEntity;
import com.jb4dc.files.dbentities.FileInfoEntity;
import com.jb4dc.files.service.IFileInfoService;
import org.apache.commons.io.FilenameUtils;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;

public class FileInfoServiceImpl extends BaseServiceImpl<FileInfoEntity> implements IFileInfoService
{
    FileInfoMapper fileInfoMapper;
    FileContentMapper contentMapper;
    public FileInfoServiceImpl(FileInfoMapper _defaultBaseMapper, FileContentMapper _contentMapper){
        super(_defaultBaseMapper);
        fileInfoMapper=_defaultBaseMapper;
        contentMapper=_contentMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DSession, String id, FileInfoEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<FileInfoEntity>() {
            @Override
            public FileInfoEntity run(JB4DCSession jb4DSession,FileInfoEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public FileInfoEntity addSmallFileToDB(JB4DCSession session, MultipartFile file) throws IOException {
        String fileId= UUIDUtility.getUUID();

        FileInfoEntity fileInfoEntity=new FileInfoEntity();
        fileInfoEntity.setFileId(fileId);
        fileInfoEntity.setFileCreateTime(new Date());
        fileInfoEntity.setFileCreatorName(session.getUserName());
        fileInfoEntity.setFileCreatorId(session.getUserId());
        fileInfoEntity.setFileName(file.getOriginalFilename());
        fileInfoEntity.setFileSize(file.getSize());
        fileInfoEntity.setFileStoreType("DB");
        fileInfoEntity.setFileStorePath("");
        fileInfoEntity.setFileStoreName("");
        fileInfoEntity.setFileOrganId(session.getOrganId());
        fileInfoEntity.setFileOrganName(session.getOrganName());
        fileInfoEntity.setFileExtension(FilenameUtils.getExtension(file.getOriginalFilename()));
        fileInfoEntity.setFileDescription("");
        fileInfoEntity.setFileReadTime(0);
        fileInfoEntity.setFileStatus(EnableTypeEnum.enable.getDisplayName());

        FileContentEntity fileContentEntity=new FileContentEntity();
        fileContentEntity.setFileId(fileId);
        fileContentEntity.setFileContent(file.getBytes());

        fileInfoMapper.insertSelective(fileInfoEntity);
        contentMapper.insertSelective(fileContentEntity);
        return fileInfoEntity;
    }

    @Override
    public byte[] getContent(String fileId) {
        return contentMapper.selectByPrimaryKey(fileId).getFileContent();
    }
}
