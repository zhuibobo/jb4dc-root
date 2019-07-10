package com.jb4dc.config.service.impl;

import com.jb4dc.base.dbaccess.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.config.dao.DictionaryMapper;
import com.jb4dc.config.dbentities.DictionaryEntity;
import com.jb4dc.config.service.IDictionaryService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public class DictionaryServiceImpl extends BaseServiceImpl<DictionaryEntity> implements IDictionaryService {

    DictionaryMapper dictionaryMapper;

    public DictionaryServiceImpl(DictionaryMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        dictionaryMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession JB4DCSession, String id, DictionaryEntity entity) throws JBuild4DCGenerallyException {
        return this.save(JB4DCSession, id, entity, new IAddBefore<DictionaryEntity>() {
            @Override
            public DictionaryEntity run(JB4DCSession JB4DCSession, DictionaryEntity sourceEntity) throws JBuild4DCGenerallyException {
                sourceEntity.setDictChildCount(0);
                sourceEntity.setDictOrderNum(dictionaryMapper.nextOrderNum());
                sourceEntity.setDictCreateTime(new Date());
                String parentIdList;
                if(sourceEntity.getDictParentId().equals(sourceEntity.getDictGroupId())){
                    parentIdList=sourceEntity.getDictParentId();
                }
                else
                {
                    DictionaryEntity parentDictionEntity=dictionaryMapper.selectByPrimaryKey(sourceEntity.getDictParentId());
                    parentIdList=parentDictionEntity.getDictParentIdlist();
                    parentDictionEntity.setDictChildCount(parentDictionEntity.getDictChildCount()+1);
                    dictionaryMapper.updateByPrimaryKeySelective(parentDictionEntity);
                }
                sourceEntity.setDictParentIdlist(parentIdList+"*"+sourceEntity.getDictId());
                sourceEntity.setDictOrganId(JB4DCSession.getOrganId());
                sourceEntity.setDictOrganName(JB4DCSession.getOrganName());
                sourceEntity.setDictUserId(JB4DCSession.getUserId());
                sourceEntity.setDictUserName(JB4DCSession.getUserName());
                return sourceEntity;
            }
        });
    }

    @Override
    public List<DictionaryEntity> getListDataByGroupId(JB4DCSession session, String groupId) {
        return dictionaryMapper.selectByGroupId(groupId);
    }

    @Override
    public void setSelected(JB4DCSession JB4DCSession, String recordId) throws JBuild4DCGenerallyException {
        DictionaryEntity entity=getByPrimaryKey(JB4DCSession,recordId);

        String parentId=entity.getDictParentId();
        List<DictionaryEntity> dictionaryEntityList=dictionaryMapper.selectByParentId(parentId);
        if(dictionaryEntityList!=null&&dictionaryEntityList.size()>0){
            for (DictionaryEntity dictionaryEntity : dictionaryEntityList) {
                dictionaryEntity.setDictIsSelected(TrueFalseEnum.False.getDisplayName());
                dictionaryMapper.updateByPrimaryKeySelective(dictionaryEntity);
            }
        }

        entity.setDictIsSelected(TrueFalseEnum.True.getDisplayName());
        dictionaryMapper.updateByPrimaryKeySelective(entity);
    }

    @Override
    public List<DictionaryEntity> getListDataByGroupValue(JB4DCSession session, String groupValue) {
        return dictionaryMapper.selectByGroupValue(groupValue);
    }

    @Override
    public void statusChange(JB4DCSession JB4DCSession, String ids, String status) throws JBuild4DCGenerallyException {
        if(StringUtility.isNotEmpty(ids)) {
            String[] idArray = ids.split(";");
            for (int i = 0; i < idArray.length; i++) {
                DictionaryEntity entity = getByPrimaryKey(JB4DCSession, idArray[i]);
                entity.setDictStatus(status);
                dictionaryMapper.updateByPrimaryKeySelective(entity);
            }
        }
    }

    @Override
    public void moveUp(JB4DCSession JB4DCSession, String id) throws JBuild4DCGenerallyException {
        DictionaryEntity selfEntity=dictionaryMapper.selectByPrimaryKey(id);
        DictionaryEntity ltEntity=dictionaryMapper.selectLessThanRecord(id,selfEntity.getDictParentId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DCSession JB4DCSession, String id) throws JBuild4DCGenerallyException {
        DictionaryEntity selfEntity=dictionaryMapper.selectByPrimaryKey(id);
        DictionaryEntity ltEntity=dictionaryMapper.selectGreaterThanRecord(id,selfEntity.getDictParentId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(DictionaryEntity toEntity,DictionaryEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getDictOrderNum();
            toEntity.setDictOrderNum(selfEntity.getDictOrderNum());
            selfEntity.setDictOrderNum(newNum);
            dictionaryMapper.updateByPrimaryKeySelective(toEntity);
            dictionaryMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
