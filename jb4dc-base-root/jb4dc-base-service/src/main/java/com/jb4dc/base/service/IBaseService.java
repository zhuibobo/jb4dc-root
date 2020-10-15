package com.jb4dc.base.service;

import com.github.pagehelper.PageInfo;
import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.List;
import java.util.Map;

/**
 * @Author: zhuangrb
 * @Date: 2018/4/5
 * @Description:
 * @Version 1.0.0
 */
public interface IBaseService<T> {

    void setGeneralService(IGeneralService _generalServiceImpl);

    void setSqlSessionTemplate(SqlSessionTemplate _sqlSessionTemplate);

    void setDefaultBaseMapper(BaseMapper<T> _defaultBaseMapper);

    int deleteByKey(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException;

    int deleteByKeyNotValidate(JB4DCSession jb4DCSession, String id, String warningOperationCode) throws JBuild4DCGenerallyException;

    int deleteAll(JB4DCSession jb4DCSession, String warningOperationCode) throws JBuild4DCGenerallyException;

    int add(JB4DCSession jb4DCSession, T entity);

    int addSelective(JB4DCSession jb4DCSession, T entity);

    T getByPrimaryKey(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException;

    int updateByKeySelective(JB4DCSession jb4DCSession, T entity);

    int updateByKey(JB4DCSession jb4DCSession, T entity);

    int saveSimple(JB4DCSession jb4DCSession, String id, T entity) throws JBuild4DCGenerallyException;

    int save(JB4DCSession jb4DCSession, String id, T entity, IAddBefore<T> addBefore) throws JBuild4DCGenerallyException;

    int save(JB4DCSession jb4DCSession, String id, T entity, IAddBefore<T> addBefore, IUpdateBefore<T> updateBefore) throws JBuild4DCGenerallyException;

    PageInfo<T> getPage(JB4DCSession jb4DCSession, int pageNum, int pageSize);

    PageInfo<T> getPage(JB4DCSession jb4DCSession, int pageNum, int pageSize, Map<String, Object> searchItemMap);

    List<T> getALL(JB4DCSession jb4DCSession);

    List<T> getALLASC(JB4DCSession jb4DCSession);

    int getNextOrderNum(JB4DCSession jb4DCSession);

    void statusChange(JB4DCSession jb4DCSession, String ids, String status) throws JBuild4DCGenerallyException;

    void moveUp(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException;

    void moveDown(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException;
}
