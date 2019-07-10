package com.jb4dc.config.service.impl;

import com.jb4dc.base.dbaccess.exenum.EnableTypeEnum;
import com.jb4dc.base.dbaccess.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.config.dao.DictionaryGroupMapper;
import com.jb4dc.config.dbentities.DictionaryEntity;
import com.jb4dc.config.dbentities.DictionaryGroupEntity;
import com.jb4dc.config.service.IDictionaryGroupService;
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
public class DictionaryGroupServiceImpl extends BaseServiceImpl<DictionaryGroupEntity> implements IDictionaryGroupService {

    DictionaryGroupMapper dictionaryGroupMapper;

    public DictionaryGroupServiceImpl(DictionaryGroupMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        dictionaryGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DCSession JB4DCSession, String id, DictionaryGroupEntity record) throws JBuild4DCGenerallyException {
        //判定是否存在同Value的记录
        DictionaryGroupEntity theSameValueEntity=dictionaryGroupMapper.selectByValue(record.getDictGroupValue());
        if(theSameValueEntity!=null) {
            if (!theSameValueEntity.getDictGroupId().equals(record.getDictGroupId())){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_CONFIG_CODE,"已经存在相同Value的记录!");
            }
        }
        return super.save(JB4DCSession,id, record, new IAddBefore<DictionaryGroupEntity>() {
            @Override
            public DictionaryGroupEntity run(JB4DCSession JB4DCSession1,DictionaryGroupEntity item) throws JBuild4DCGenerallyException {
                item.setDictGroupOrderNum(dictionaryGroupMapper.nextOrderNum());
                item.setDictGroupStatus(EnableTypeEnum.enable.getDisplayName());
                item.setDictGroupCreateTime(new Date());
                return item;
            }
        });
    }

    @Override
    public void statusChange(JB4DCSession JB4DCSession,String ids,String status) throws JBuild4DCGenerallyException {
        if(StringUtility.isNotEmpty(ids)) {
            String[] idArray = ids.split(";");
            for (int i = 0; i < idArray.length; i++) {
                DictionaryGroupEntity dictionaryGroupEntity = getByPrimaryKey(JB4DCSession, idArray[i]);
                dictionaryGroupEntity.setDictGroupStatus(status);
                dictionaryGroupMapper.updateByPrimaryKeySelective(dictionaryGroupEntity);
            }
        }
    }

    @Override
    public int deleteByKey(JB4DCSession JB4DCSession, String id) throws JBuild4DCGenerallyException {
        DictionaryGroupEntity dictionaryGroupEntity=dictionaryGroupMapper.selectByPrimaryKey(id);
        if(dictionaryGroupEntity!=null){
            if(dictionaryGroupEntity.getDictGroupIssystem().equals(TrueFalseEnum.True.getDisplayName())){
                throw JBuild4DCGenerallyException.getSystemRecordDelException(JBuild4DCGenerallyException.EXCEPTION_CONFIG_CODE);
            }
            if(dictionaryGroupEntity.getDictGroupDelEnable().equals(TrueFalseEnum.False.getDisplayName())){
                throw JBuild4DCGenerallyException.getDBFieldSettingDelException(JBuild4DCGenerallyException.EXCEPTION_CONFIG_CODE);
            }
            List<DictionaryGroupEntity> childEntityList=dictionaryGroupMapper.selectChilds(id);
            if(childEntityList!=null&&childEntityList.size()>0){
                throw JBuild4DCGenerallyException.getHadChildDelException(JBuild4DCGenerallyException.EXCEPTION_CONFIG_CODE);
            }
            return super.deleteByKey(JB4DCSession, id);
        }
        else
        {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_CONFIG_CODE,"找不到要删除的记录!");
        }
    }

    @Override
    public void initSystemData(JB4DCSession JB4DCSession, IDictionaryService dictionaryService) throws JBuild4DCGenerallyException {
        //根字典分组
        String rootDictionaryId="0";
        DictionaryGroupEntity rootDictionaryGroupEntity=getDictionaryGroup(rootDictionaryId,"数据字典分组","数据字典分组","","-1",TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        deleteByKeyNotValidate(JB4DCSession,rootDictionaryGroupEntity.getDictGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,rootDictionaryGroupEntity.getDictGroupId(),rootDictionaryGroupEntity);

        String DevDemoDictionaryGroupRootId="DevDemoDictionaryGroupRoot";
        DictionaryGroupEntity devDemoDictionaryGroupEntity=getDictionaryGroup(DevDemoDictionaryGroupRootId,"开发示例","开发示例","",rootDictionaryGroupEntity.getDictGroupId(),TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        deleteByKeyNotValidate(JB4DCSession,devDemoDictionaryGroupEntity.getDictGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,devDemoDictionaryGroupEntity.getDictGroupId(),devDemoDictionaryGroupEntity);

        String DevDemoDictionaryGroupBindSelect="DevDemoDictionaryGroupBindSelect";
        DictionaryGroupEntity DevDemoDictionaryGroupBindSelectEntity=getDictionaryGroup(DevDemoDictionaryGroupBindSelect,"DevDemoDictionaryGroupBindSelect","绑定下拉列表","",devDemoDictionaryGroupEntity.getDictGroupId(),TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        deleteByKeyNotValidate(JB4DCSession,DevDemoDictionaryGroupBindSelectEntity.getDictGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,DevDemoDictionaryGroupBindSelectEntity.getDictGroupId(),DevDemoDictionaryGroupBindSelectEntity);

        String DevDemoDictionaryGroupBindRadio="DevDemoDictionaryGroupBindRadio";
        DictionaryGroupEntity DevDemoDictionaryGroupBindRadioEntity=getDictionaryGroup(DevDemoDictionaryGroupBindRadio,"DevDemoDictionaryGroupBindRadio","绑定单选项","",devDemoDictionaryGroupEntity.getDictGroupId(),TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        deleteByKeyNotValidate(JB4DCSession,DevDemoDictionaryGroupBindRadioEntity.getDictGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,DevDemoDictionaryGroupBindRadioEntity.getDictGroupId(),DevDemoDictionaryGroupBindRadioEntity);

        String DevDemoDictionaryGroupBindCheckbox="DevDemoDictionaryGroupBindCheckbox";
        DictionaryGroupEntity DevDemoDictionaryGroupBindCheckboxEntity=getDictionaryGroup(DevDemoDictionaryGroupBindCheckbox,"DevDemoDictionaryGroupBindCheckbox","绑定复选项","",devDemoDictionaryGroupEntity.getDictGroupId(),TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        deleteByKeyNotValidate(JB4DCSession,DevDemoDictionaryGroupBindCheckboxEntity.getDictGroupId(), JBuild4DCYaml.getWarningOperationCode());
        saveSimple(JB4DCSession,DevDemoDictionaryGroupBindCheckboxEntity.getDictGroupId(),DevDemoDictionaryGroupBindCheckboxEntity);

        for(int i=0;i<10;i++){
            String select_dic_id=DevDemoDictionaryGroupBindSelect+String.valueOf(i);
            DictionaryEntity selectDictionaryEntity=getDictionary(DevDemoDictionaryGroupBindSelect,select_dic_id,DevDemoDictionaryGroupBindSelect,"Select-Key-"+i,"Select-Value-"+i,"Select-Text-"+i);
            dictionaryService.deleteByKeyNotValidate(JB4DCSession,select_dic_id, JBuild4DCYaml.getWarningOperationCode());
            dictionaryService.saveSimple(JB4DCSession,select_dic_id,selectDictionaryEntity);

            String radio_dic_id=DevDemoDictionaryGroupBindRadio+String.valueOf(i);
            DictionaryEntity radioDictionaryEntity=getDictionary(DevDemoDictionaryGroupBindRadio,radio_dic_id,DevDemoDictionaryGroupBindRadio,"Radio-Key-"+i,"Radio-Value-"+i,"Radio-Text-"+i);
            dictionaryService.deleteByKeyNotValidate(JB4DCSession,radio_dic_id, JBuild4DCYaml.getWarningOperationCode());
            dictionaryService.saveSimple(JB4DCSession,radio_dic_id,radioDictionaryEntity);

            String checkbox_dic_id=DevDemoDictionaryGroupBindCheckbox+String.valueOf(i);
            DictionaryEntity checkboxDictionaryEntity=getDictionary(DevDemoDictionaryGroupBindCheckbox,checkbox_dic_id,DevDemoDictionaryGroupBindCheckbox,"Checkbox-Key-"+i,"Checkbox-Value-"+i,"Checkbox-Text-"+i);
            dictionaryService.deleteByKeyNotValidate(JB4DCSession,checkbox_dic_id, JBuild4DCYaml.getWarningOperationCode());
            dictionaryService.saveSimple(JB4DCSession,checkbox_dic_id,checkboxDictionaryEntity);
        }
    }

    public DictionaryGroupEntity getDictionaryGroup(String id,String value,String text,String desc,String parendId,String isSystem,String delEnable){
        DictionaryGroupEntity dictionaryGroupEntity=new DictionaryGroupEntity();
        dictionaryGroupEntity.setDictGroupId(id);
        dictionaryGroupEntity.setDictGroupValue(value);
        dictionaryGroupEntity.setDictGroupText(text);
        dictionaryGroupEntity.setDictGroupDesc(desc);
        dictionaryGroupEntity.setDictGroupParentId(parendId);
        dictionaryGroupEntity.setDictGroupIssystem(isSystem);
        dictionaryGroupEntity.setDictGroupDelEnable(delEnable);
        dictionaryGroupEntity.setDictGroupEnpItem(TrueFalseEnum.True.getDisplayName());
        return dictionaryGroupEntity;
    }

    public DictionaryEntity getDictionary(String parentId, String id, String groupId, String key, String value, String text){
        DictionaryEntity dictionaryEntity=new DictionaryEntity();
        dictionaryEntity.setDictId(id);
        dictionaryEntity.setDictIsSelected("否");
        dictionaryEntity.setDictStatus("启用");
        dictionaryEntity.setDictParentId(parentId);
        dictionaryEntity.setDictDelEnable("是");
        dictionaryEntity.setDictIssystem("是");
        dictionaryEntity.setDictGroupId(groupId);
        dictionaryEntity.setDictKey(key);
        dictionaryEntity.setDictText(text);
        dictionaryEntity.setDictValue(value);
        return dictionaryEntity;
    }
}
