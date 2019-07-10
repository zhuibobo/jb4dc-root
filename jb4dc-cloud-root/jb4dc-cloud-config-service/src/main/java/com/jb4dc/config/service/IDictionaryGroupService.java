package com.jb4dc.config.service;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.config.dbentities.DictionaryGroupEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public interface IDictionaryGroupService extends IBaseService<DictionaryGroupEntity> {

    void initSystemData(JB4DCSession JB4DCSession, IDictionaryService dictionaryService) throws JBuild4DCGenerallyException;
}
