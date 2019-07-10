package com.jb4dc.config.service;

import com.jb4dc.base.service.IBaseService;
import com.jb4dc.config.dbentities.SettingEntity;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public interface ISettingService extends IBaseService<SettingEntity> {
    public static final String SETTINGUSERDEFAULTPASSWORD = "SettingUserDefaultPassword";

    void initSystemData(JB4DCSession JB4DCSession) throws JBuild4DCGenerallyException;

    SettingEntity getByKey(JB4DCSession JB4DCSession, String key);
}
