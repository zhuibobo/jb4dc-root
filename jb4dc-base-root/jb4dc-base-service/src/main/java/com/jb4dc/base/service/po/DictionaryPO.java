package com.jb4dc.base.service.po;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/12
 * To change this template use File | Settings | File Templates.
 */
public class DictionaryPO {
    //DICT_ID:字典项的ID:随机的UUID,主键
    @DBKeyField
    private String dictId;

    //DICT_KEY:字典项的键值:在同一组内必须唯一,用于进行二次开发
    private String dictKey;

    //DICT_VALUE:字典项的Value:在同一组内必须唯一,绑定到控件时,将使用该值作为Value
    private String dictValue;

    //DICT_TEXT:字典项的显示文本
    private String dictText;

    //DICT_GROUP_ID:分组ID:字典项所述的分组的ID
    private String dictGroupId;

    //DICT_ORDER_NUM:排序号
    private Integer dictOrderNum;

    //DICT_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date dictCreateTime;

    //DICT_PARENT_ID:父节点的ID
    private String dictParentId;

    //DICT_PARENT_ID_LIST:父节点的ID列表
    private String dictParentIdList;

    //DICT_IS_SYSTEM:是否是系统字典项
    private String dictIsSystem;

    //DICT_DEL_ENABLE:能否删除
    private String dictDelEnable;

    //DICT_STATUS:状态:启用,禁用
    private String dictStatus;

    //DICT_IS_SELECTED:是否默认选中:需要程序自行实现
    private String dictIsSelected;

    //DICT_DESC:备注
    private String dictDesc;

    //DICT_CHILD_COUNT:子节点的数量:不包含孙节点
    private Integer dictChildCount;

    //DICT_EX_ATTR1:扩展属性1:用于开发
    private String dictExAttr1;

    //DICT_EX_ATTR2:扩展属性2:用于开发
    private String dictExAttr2;

    //DICT_EX_ATTR3:扩展属性3:用于开发
    private String dictExAttr3;

    //DICT_EX_ATTR4:扩展属性4:用于开发
    private String dictExAttr4;

    //DICT_USER_ID:创建用户ID
    private String dictUserId;

    //DICT_USER_NAME:创建用户名称
    private String dictUserName;

    //DICT_ORGAN_ID:创建组织ID
    private String dictOrganId;

    //DICT_ORGAN_NAME:创建组织名称
    private String dictOrganName;

    /**
     * 构造函数
     * @param dictId 字典项的ID
     * @param dictKey 字典项的键值
     * @param dictValue 字典项的Value
     * @param dictText 字典项的显示文本
     * @param dictGroupId 分组ID
     * @param dictOrderNum 排序号
     * @param dictCreateTime 创建时间
     * @param dictParentId 父节点的ID
     * @param dictParentIdList 父节点的ID列表
     * @param dictIsSystem 是否是系统字典项
     * @param dictDelEnable 能否删除
     * @param dictStatus 状态
     * @param dictIsSelected 是否默认选中
     * @param dictDesc 备注
     * @param dictChildCount 子节点的数量
     * @param dictExAttr1 扩展属性1
     * @param dictExAttr2 扩展属性2
     * @param dictExAttr3 扩展属性3
     * @param dictExAttr4 扩展属性4
     * @param dictUserId 创建用户ID
     * @param dictUserName 创建用户名称
     * @param dictOrganId 创建组织ID
     * @param dictOrganName 创建组织名称
     **/
    public DictionaryPO(String dictId, String dictKey, String dictValue, String dictText, String dictGroupId, Integer dictOrderNum, Date dictCreateTime, String dictParentId, String dictParentIdList, String dictIsSystem, String dictDelEnable, String dictStatus, String dictIsSelected, String dictDesc, Integer dictChildCount, String dictExAttr1, String dictExAttr2, String dictExAttr3, String dictExAttr4, String dictUserId, String dictUserName, String dictOrganId, String dictOrganName) {
        this.dictId = dictId;
        this.dictKey = dictKey;
        this.dictValue = dictValue;
        this.dictText = dictText;
        this.dictGroupId = dictGroupId;
        this.dictOrderNum = dictOrderNum;
        this.dictCreateTime = dictCreateTime;
        this.dictParentId = dictParentId;
        this.dictParentIdList = dictParentIdList;
        this.dictIsSystem = dictIsSystem;
        this.dictDelEnable = dictDelEnable;
        this.dictStatus = dictStatus;
        this.dictIsSelected = dictIsSelected;
        this.dictDesc = dictDesc;
        this.dictChildCount = dictChildCount;
        this.dictExAttr1 = dictExAttr1;
        this.dictExAttr2 = dictExAttr2;
        this.dictExAttr3 = dictExAttr3;
        this.dictExAttr4 = dictExAttr4;
        this.dictUserId = dictUserId;
        this.dictUserName = dictUserName;
        this.dictOrganId = dictOrganId;
        this.dictOrganName = dictOrganName;
    }

    public DictionaryPO() {
        super();
    }

    /**
     * 字典项的ID:随机的UUID,主键
     * @return java.lang.String
     **/
    public String getDictId() {
        return dictId;
    }

    /**
     * 字典项的ID:随机的UUID,主键
     * @param dictId 字典项的ID
     **/
    public void setDictId(String dictId) {
        this.dictId = dictId == null ? null : dictId.trim();
    }

    /**
     * 字典项的键值:在同一组内必须唯一,用于进行二次开发
     * @return java.lang.String
     **/
    public String getDictKey() {
        return dictKey;
    }

    /**
     * 字典项的键值:在同一组内必须唯一,用于进行二次开发
     * @param dictKey 字典项的键值
     **/
    public void setDictKey(String dictKey) {
        this.dictKey = dictKey == null ? null : dictKey.trim();
    }

    /**
     * 字典项的Value:在同一组内必须唯一,绑定到控件时,将使用该值作为Value
     * @return java.lang.String
     **/
    public String getDictValue() {
        return dictValue;
    }

    /**
     * 字典项的Value:在同一组内必须唯一,绑定到控件时,将使用该值作为Value
     * @param dictValue 字典项的Value
     **/
    public void setDictValue(String dictValue) {
        this.dictValue = dictValue == null ? null : dictValue.trim();
    }

    /**
     * 字典项的显示文本
     * @return java.lang.String
     **/
    public String getDictText() {
        return dictText;
    }

    /**
     * 字典项的显示文本
     * @param dictText 字典项的显示文本
     **/
    public void setDictText(String dictText) {
        this.dictText = dictText == null ? null : dictText.trim();
    }

    /**
     * 分组ID:字典项所述的分组的ID
     * @return java.lang.String
     **/
    public String getDictGroupId() {
        return dictGroupId;
    }

    /**
     * 分组ID:字典项所述的分组的ID
     * @param dictGroupId 分组ID
     **/
    public void setDictGroupId(String dictGroupId) {
        this.dictGroupId = dictGroupId == null ? null : dictGroupId.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getDictOrderNum() {
        return dictOrderNum;
    }

    /**
     * 排序号
     * @param dictOrderNum 排序号
     **/
    public void setDictOrderNum(Integer dictOrderNum) {
        this.dictOrderNum = dictOrderNum;
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getDictCreateTime() {
        return dictCreateTime;
    }

    /**
     * 创建时间
     * @param dictCreateTime 创建时间
     **/
    public void setDictCreateTime(Date dictCreateTime) {
        this.dictCreateTime = dictCreateTime;
    }

    /**
     * 父节点的ID
     * @return java.lang.String
     **/
    public String getDictParentId() {
        return dictParentId;
    }

    /**
     * 父节点的ID
     * @param dictParentId 父节点的ID
     **/
    public void setDictParentId(String dictParentId) {
        this.dictParentId = dictParentId == null ? null : dictParentId.trim();
    }

    /**
     * 父节点的ID列表
     * @return java.lang.String
     **/
    public String getDictParentIdList() {
        return dictParentIdList;
    }

    /**
     * 父节点的ID列表
     * @param dictParentIdList 父节点的ID列表
     **/
    public void setDictParentIdList(String dictParentIdList) {
        this.dictParentIdList = dictParentIdList == null ? null : dictParentIdList.trim();
    }

    /**
     * 是否是系统字典项
     * @return java.lang.String
     **/
    public String getDictIsSystem() {
        return dictIsSystem;
    }

    /**
     * 是否是系统字典项
     * @param dictIsSystem 是否是系统字典项
     **/
    public void setDictIsSystem(String dictIsSystem) {
        this.dictIsSystem = dictIsSystem == null ? null : dictIsSystem.trim();
    }

    /**
     * 能否删除
     * @return java.lang.String
     **/
    public String getDictDelEnable() {
        return dictDelEnable;
    }

    /**
     * 能否删除
     * @param dictDelEnable 能否删除
     **/
    public void setDictDelEnable(String dictDelEnable) {
        this.dictDelEnable = dictDelEnable == null ? null : dictDelEnable.trim();
    }

    /**
     * 状态:启用,禁用
     * @return java.lang.String
     **/
    public String getDictStatus() {
        return dictStatus;
    }

    /**
     * 状态:启用,禁用
     * @param dictStatus 状态
     **/
    public void setDictStatus(String dictStatus) {
        this.dictStatus = dictStatus == null ? null : dictStatus.trim();
    }

    /**
     * 是否默认选中:需要程序自行实现
     * @return java.lang.String
     **/
    public String getDictIsSelected() {
        return dictIsSelected;
    }

    /**
     * 是否默认选中:需要程序自行实现
     * @param dictIsSelected 是否默认选中
     **/
    public void setDictIsSelected(String dictIsSelected) {
        this.dictIsSelected = dictIsSelected == null ? null : dictIsSelected.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getDictDesc() {
        return dictDesc;
    }

    /**
     * 备注
     * @param dictDesc 备注
     **/
    public void setDictDesc(String dictDesc) {
        this.dictDesc = dictDesc == null ? null : dictDesc.trim();
    }

    /**
     * 子节点的数量:不包含孙节点
     * @return java.lang.Integer
     **/
    public Integer getDictChildCount() {
        return dictChildCount;
    }

    /**
     * 子节点的数量:不包含孙节点
     * @param dictChildCount 子节点的数量
     **/
    public void setDictChildCount(Integer dictChildCount) {
        this.dictChildCount = dictChildCount;
    }

    /**
     * 扩展属性1:用于开发
     * @return java.lang.String
     **/
    public String getDictExAttr1() {
        return dictExAttr1;
    }

    /**
     * 扩展属性1:用于开发
     * @param dictExAttr1 扩展属性1
     **/
    public void setDictExAttr1(String dictExAttr1) {
        this.dictExAttr1 = dictExAttr1 == null ? null : dictExAttr1.trim();
    }

    /**
     * 扩展属性2:用于开发
     * @return java.lang.String
     **/
    public String getDictExAttr2() {
        return dictExAttr2;
    }

    /**
     * 扩展属性2:用于开发
     * @param dictExAttr2 扩展属性2
     **/
    public void setDictExAttr2(String dictExAttr2) {
        this.dictExAttr2 = dictExAttr2 == null ? null : dictExAttr2.trim();
    }

    /**
     * 扩展属性3:用于开发
     * @return java.lang.String
     **/
    public String getDictExAttr3() {
        return dictExAttr3;
    }

    /**
     * 扩展属性3:用于开发
     * @param dictExAttr3 扩展属性3
     **/
    public void setDictExAttr3(String dictExAttr3) {
        this.dictExAttr3 = dictExAttr3 == null ? null : dictExAttr3.trim();
    }

    /**
     * 扩展属性4:用于开发
     * @return java.lang.String
     **/
    public String getDictExAttr4() {
        return dictExAttr4;
    }

    /**
     * 扩展属性4:用于开发
     * @param dictExAttr4 扩展属性4
     **/
    public void setDictExAttr4(String dictExAttr4) {
        this.dictExAttr4 = dictExAttr4 == null ? null : dictExAttr4.trim();
    }

    /**
     * 创建用户ID
     * @return java.lang.String
     **/
    public String getDictUserId() {
        return dictUserId;
    }

    /**
     * 创建用户ID
     * @param dictUserId 创建用户ID
     **/
    public void setDictUserId(String dictUserId) {
        this.dictUserId = dictUserId == null ? null : dictUserId.trim();
    }

    /**
     * 创建用户名称
     * @return java.lang.String
     **/
    public String getDictUserName() {
        return dictUserName;
    }

    /**
     * 创建用户名称
     * @param dictUserName 创建用户名称
     **/
    public void setDictUserName(String dictUserName) {
        this.dictUserName = dictUserName == null ? null : dictUserName.trim();
    }

    /**
     * 创建组织ID
     * @return java.lang.String
     **/
    public String getDictOrganId() {
        return dictOrganId;
    }

    /**
     * 创建组织ID
     * @param dictOrganId 创建组织ID
     **/
    public void setDictOrganId(String dictOrganId) {
        this.dictOrganId = dictOrganId == null ? null : dictOrganId.trim();
    }

    /**
     * 创建组织名称
     * @return java.lang.String
     **/
    public String getDictOrganName() {
        return dictOrganName;
    }

    /**
     * 创建组织名称
     * @param dictOrganName 创建组织名称
     **/
    public void setDictOrganName(String dictOrganName) {
        this.dictOrganName = dictOrganName == null ? null : dictOrganName.trim();
    }
}
