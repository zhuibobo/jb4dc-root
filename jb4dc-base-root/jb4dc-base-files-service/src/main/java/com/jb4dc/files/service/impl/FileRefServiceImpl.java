package com.jb4dc.files.service.impl;

import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.files.dao.FileRefMapper;
import com.jb4dc.files.dbentities.FileRefEntity;
import com.jb4dc.files.service.IFileRefService;

public class FileRefServiceImpl extends BaseServiceImpl<FileRefEntity> implements IFileRefService
{
    FileRefMapper fileRefMapper;
    public FileRefServiceImpl(FileRefMapper _defaultBaseMapper){
        super(_defaultBaseMapper);
        fileRefMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DSession, String id, FileRefEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<FileRefEntity>() {
            @Override
            public FileRefEntity run(JB4DCSession jb4DSession,FileRefEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
