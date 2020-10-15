package com.jb4dc.base.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.dbaccess.anno.DBAnnoUtility;
import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.base.service.*;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.UUIDUtility;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.List;
import java.util.Map;

/**
 * @Author: zhuangrb
 * @Date: 2018/4/5
 * @Description:
 * @Version 1.0.0
 */
public abstract class BaseServiceImpl<T> implements IBaseService<T> {
    private BaseMapper<T> defaultBaseMapper = null;
    protected SqlSessionTemplate sqlSessionTemplate = null;
    protected ISQLBuilderService sqlBuilderService = null;
    protected IGeneralService generalService;

    /*public BaseServiceImpl(BaseMapper<T> _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        defaultBaseMapper= _defaultBaseMapper;
        sqlSessionTemplate=_sqlSessionTemplate;
        sqlBuilderService=_sqlBuilderService;
    }*/

    public BaseServiceImpl(BaseMapper<T> _defaultBaseMapper){
        defaultBaseMapper= _defaultBaseMapper;
    }

    @Override
    public void setGeneralService(IGeneralService _generalServiceImpl) {
        generalService = _generalServiceImpl;
    }

    @Override
    public void setSqlSessionTemplate(SqlSessionTemplate _sqlSessionTemplate) {
        sqlSessionTemplate=_sqlSessionTemplate;
    }

    @Override
    public void setDefaultBaseMapper(BaseMapper<T> _defaultBaseMapper){
        defaultBaseMapper=_defaultBaseMapper;
    }

    public BaseMapper getDefaultBaseMapper(){
        return defaultBaseMapper;
    }

    @Override
    public int deleteByKey(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        return defaultBaseMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int deleteByKeyNotValidate(JB4DCSession jb4DCSession, String id, String warningOperationCode ) throws JBuild4DCGenerallyException {
        if(JBuild4DCYaml.getWarningOperationCode().equals(warningOperationCode)) {
            return defaultBaseMapper.deleteByPrimaryKey(id);
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"删除失败WarningOperationCode错误");
    }

    @Override
    public int deleteAll(JB4DCSession jb4DCSession, String warningOperationCode) throws JBuild4DCGenerallyException {
        if(JBuild4DCYaml.getWarningOperationCode().equals(warningOperationCode)) {
            return defaultBaseMapper.deleteAll();
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"删除失败WarningOperationCode错误");
    }

    @Override
    public int add(JB4DCSession jb4DCSession, T entity) {
        return defaultBaseMapper.insert(entity);
    }

    @Override
    public int addSelective(JB4DCSession jb4DCSession, T entity) {
        return defaultBaseMapper.insertSelective(entity);
    }

    @Override
    public T getByPrimaryKey(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        return defaultBaseMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByKeySelective(JB4DCSession jb4DCSession, T entity) {
        return defaultBaseMapper.updateByPrimaryKeySelective(entity);
    }

    @Override
    public int updateByKey(JB4DCSession jb4DCSession, T entity) {
        return defaultBaseMapper.updateByPrimaryKey(entity);
    }

    @Override
    public int save(JB4DCSession jb4DCSession, String id, T entity, IAddBefore<T> addBefore) throws JBuild4DCGenerallyException {
        if(getByPrimaryKey(jb4DCSession,id)==null){
            autoSetEntityId(entity);
            entity=addBefore.run(jb4DCSession,entity);
            return addSelective(jb4DCSession,entity);
        }
        else{
            return updateByKeySelective(jb4DCSession,entity);
        }
    }

    @Override
    public int save(JB4DCSession jb4DCSession, String id, T entity, IAddBefore<T> addBefore, IUpdateBefore<T> updateBefore) throws JBuild4DCGenerallyException {
        if(getByPrimaryKey(jb4DCSession,id)==null){
            autoSetEntityId(entity);
            entity=addBefore.run(jb4DCSession,entity);
            return addSelective(jb4DCSession,entity);
        }
        else{
            entity=updateBefore.run(jb4DCSession,entity);
            return updateByKeySelective(jb4DCSession,entity);
        }
    }

    private void autoSetEntityId(T entity) throws JBuild4DCGenerallyException {
        try {
            String entId= DBAnnoUtility.getIdValue(entity);
            if(entId==null||entId.equals("")){
                DBAnnoUtility.setIdValue(entity, UUIDUtility.getUUID());
            }
        } catch (Exception e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,e.getMessage(),e.getCause(),e.getStackTrace());
        }
    }

    @Override
    public List<T> getALL(JB4DCSession jb4DCSession) {
        return defaultBaseMapper.selectAll();
    }

    @Override
    public List<T> getALLASC(JB4DCSession jb4DCSession) {
        return defaultBaseMapper.selectAllASC();
    }

    @Override
    public PageInfo<T> getPage(JB4DCSession jb4DCSession, int pageNum, int pageSize){
        PageHelper.startPage(pageNum, pageSize);
        //PageHelper.
        List<T> list=defaultBaseMapper.selectAll();
        PageInfo<T> pageInfo = new PageInfo<T>(list);
        if(pageInfo.getSize()==0&&pageInfo.getPageNum()>1){
            //如果查询的结果为0,退回查询前一页的数据;
            return getPage(jb4DCSession,pageNum-1,pageSize);
        }
        return pageInfo;
    }

    @Override
    public PageInfo<T> getPage(JB4DCSession jb4DCSession, int pageNum, int pageSize, Map<String,Object> searchItemMap){
        PageHelper.startPage(pageNum, pageSize);
        List<T> list=defaultBaseMapper.selectBySearch(searchItemMap);
        PageInfo<T> pageInfo = new PageInfo<T>(list);
        if(pageInfo.getSize()==0&&pageInfo.getPageNum()>1) {
            //如果查询的结果为0,退回查询前一页的数据;
            return getPage(jb4DCSession, pageNum - 1, pageSize, searchItemMap);
        }
        return pageInfo;
    }

    @Override
    public int getNextOrderNum(JB4DCSession jb4DCSession){
        return defaultBaseMapper.nextOrderNum();
    }

    @Override
    public void statusChange(JB4DCSession jb4DCSession, String ids, String status) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"请在"+this.getClass().getSimpleName()+"中实现statusChange方法!");
    }

    @Override
    public void moveUp(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"请在"+this.getClass().getSimpleName()+"中重写moveUp方法！");
    }

    @Override
    public void moveDown(JB4DCSession jb4DCSession, String id) throws JBuild4DCGenerallyException {
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"请在"+this.getClass().getSimpleName()+"中重写moveDown方法！");
    }
}
