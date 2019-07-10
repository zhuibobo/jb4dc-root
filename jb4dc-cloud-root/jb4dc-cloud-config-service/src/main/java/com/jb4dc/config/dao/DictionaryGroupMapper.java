package com.jb4dc.config.dao;

import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.config.dbentities.DictionaryGroupEntity;

import java.util.List;

public interface DictionaryGroupMapper extends BaseMapper<DictionaryGroupEntity> {
    List<DictionaryGroupEntity> selectChilds(String id);

    DictionaryGroupEntity selectByValue(String dictGroupValue);
}