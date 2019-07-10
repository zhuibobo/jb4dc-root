package com.jb4dc.config.service.impl;

import com.jb4dc.base.dbaccess.exenum.EnableTypeEnum;
import com.jb4dc.base.dbaccess.exenum.TrueFalseEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.base.service.IUpdateBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.config.dao.SettingMapper;
import com.jb4dc.config.dbentities.SettingEntity;
import com.jb4dc.config.service.ISettingService;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.StringUtility;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public class SettingServiceImpl extends BaseServiceImpl<SettingEntity> implements ISettingService {

    SettingMapper settingMapper;

    public SettingServiceImpl(SettingMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        settingMapper = _defaultBaseMapper;
    }

    public static String getValueExistErrorMsg(String value){
        return String.format("已经存在值为:%s的设置项!", value);
    }

    @Override
    public int saveSimple(JB4DCSession JB4DCSession, String id, SettingEntity entity) throws JBuild4DCGenerallyException {
        //判断是否存在相同Value的记录
        String value = entity.getSettingValue();

        return this.save(JB4DCSession, id, entity, new IAddBefore<SettingEntity>() {
            @Override
            public SettingEntity run(JB4DCSession JB4DCSession, SettingEntity sourceEntity) throws JBuild4DCGenerallyException {
                if (settingMapper.selectByKeyField(value) == null) {
                    sourceEntity.setSettingCreatetime(new Date());
                    sourceEntity.setSettingUserId(JB4DCSession.getUserId());
                    sourceEntity.setSettingUserName(JB4DCSession.getUserName());
                    sourceEntity.setSettingOrganId(JB4DCSession.getOrganId());
                    sourceEntity.setSettingOrganName(JB4DCSession.getOrganName());
                    sourceEntity.setSettingOrderNum(settingMapper.nextOrderNum());
                    return sourceEntity;
                } else {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_CONFIG_CODE,getValueExistErrorMsg(value));
                }
            }
        }, new IUpdateBefore<SettingEntity>() {
            @Override
            public SettingEntity run(JB4DCSession JB4DCSession, SettingEntity sourceEntity) throws JBuild4DCGenerallyException {
                SettingEntity oldEntity=settingMapper.selectByKeyField(value);
                if (oldEntity!=null){
                    if(!oldEntity.getSettingId().equals(sourceEntity.getSettingId())){
                        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_CONFIG_CODE,getValueExistErrorMsg(value));
                    }
                }
                return sourceEntity;
            }
        });
    }

    @Override
    public void statusChange(JB4DCSession JB4DCSession, String ids, String status) throws JBuild4DCGenerallyException {
        if(StringUtility.isNotEmpty(ids)) {
            String[] idArray = ids.split(";");
            for (int i = 0; i < idArray.length; i++) {
                SettingEntity entity = getByPrimaryKey(JB4DCSession, idArray[i]);
                entity.setSettingStatus(status);
                settingMapper.updateByPrimaryKeySelective(entity);
            }
        }
    }

    @Override
    public void initSystemData(JB4DCSession JB4DCSession) throws JBuild4DCGenerallyException {
        //String userDefaultPasswordId="SettingUserDefaultPassword";
        this.deleteByKeyNotValidate(JB4DCSession,SETTINGUSERDEFAULTPASSWORD, JBuild4DCYaml.getWarningOperationCode());
        SettingEntity defaultUserPasswordEntity=new SettingEntity();
        defaultUserPasswordEntity.setSettingId(SETTINGUSERDEFAULTPASSWORD);
        defaultUserPasswordEntity.setSettingKey(SETTINGUSERDEFAULTPASSWORD);
        defaultUserPasswordEntity.setSettingName("用户默认密码");
        defaultUserPasswordEntity.setSettingValue("j4d123456");
        defaultUserPasswordEntity.setSettingStatus(EnableTypeEnum.enable.getDisplayName());
        defaultUserPasswordEntity.setSettingIsSystem(TrueFalseEnum.True.getDisplayName());
        this.saveSimple(JB4DCSession,defaultUserPasswordEntity.getSettingId(),defaultUserPasswordEntity);
    }

    @Override
    public SettingEntity getByKey(JB4DCSession JB4DCSession, String key) {
        return settingMapper.selectByKeyField(key);
    }
}
