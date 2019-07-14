package com.jb4dc.files.service.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.files.dao.FileContentMapper;
import com.jb4dc.files.dbentities.FileContentEntity;
import com.jb4dc.files.service.IFileContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileContentServiceImpl extends BaseServiceImpl<FileContentEntity> implements IFileContentService
{
    FileContentMapper fileContentMapper;

    @Autowired
    public FileContentServiceImpl(FileContentMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        fileContentMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DSession, String id, FileContentEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<FileContentEntity>() {
            @Override
            public FileContentEntity run(JB4DCSession jb4DSession, FileContentEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}

