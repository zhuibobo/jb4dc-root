package com.jb4dc.config.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.config.dbentities.SettingEntity;

public interface SettingMapper extends BaseMapper<SettingEntity> {
    SettingEntity selectByKeyField(String key);
}