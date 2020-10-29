package com.jb4dc.base.service.po;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tsso_menu
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class MenuPO {
    //MENU_ID:
    @DBKeyField
    private String menuId;

    //MENU_NAME:菜单名称
    private String menuName;

    //MENU_SYSTEM_ID:所属系统ID
    private String menuSystemId;

    //MENU_TEXT:菜单文本:用于UI显示
    private String menuText;

    //MENU_VALUE:菜单值
    private String menuValue;

    //MENU_TYPE:菜单类型:超链接菜单,Web模块列表,Web模块窗体
    private String menuType;

    //MENU_OUTER_ID:外部关联ID
    private String menuOuterId;

    //MENU_OUTER_NAME:外部关联对象名称
    private String menuOuterName;

    //MENU_CREATOR_ID:创建者ID
    private String menuCreatorId;

    //MENU_ORGAN_ID:创建组织ID
    private String menuOrganId;

    //MENU_ORGAN_NAME:创造组织名称
    private String menuOrganName;

    //MENU_IS_EXPAND:是否展开
    private String menuIsExpand;

    //MENU_IS_SYSTEM:是否系统所有
    private String menuIsSystem;

    //MENU_LEFT_URL:左侧链接地址
    private String menuLeftUrl;

    //MENU_LEFT_URL_PARA:左侧链接参数
    private String menuLeftUrlPara;

    //MENU_RIGHT_URL:链接地址
    private String menuRightUrl;

    //MENU_RIGHT_URL_PARA:链接参数
    private String menuRightUrlPara;

    //MENU_ORDER_NUM:排序号
    private Integer menuOrderNum;

    //MENU_PARENT_ID:父节点ID
    private String menuParentId;

    //MENU_PARENT_ID_LIST:父节点ID列表
    private String menuParentIdList;

    //MENU_TARGET:点击打开对象
    private String menuTarget;

    //MENU_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date menuCreateTime;

    //MENU_UPDATER:更新人
    private String menuUpdater;

    //MENU_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date menuUpdateTime;

    //MENU_USE_ORGAN_NAME:使用组织名称
    private String menuUseOrganName;

    //MENU_USE_ORGAN_ID:使用组织ID
    private String menuUseOrganId;

    //MENU_USE_ORGAN_TYPE_NAME:使用组织类型名称
    private String menuUseOrganTypeName;

    //MENU_USE_ORGAN_TYPE_ID:使用组织类型ID
    private String menuUseOrganTypeId;

    //MENU_CLASS_NAME:样式类名
    private String menuClassName;

    //MENU_CLASS_NAME_HOVER:Hover时的样式类名
    private String menuClassNameHover;

    //MENU_CLASS_NAME_SELECTED:样式选中的样式类名
    private String menuClassNameSelected;

    //MENU_CHILD_COUNT:子节点数量
    private Integer menuChildCount;

    //MENU_DESCRIPTION:备注
    private String menuDescription;

    //MENU_STATUS:状态:启用,禁用
    private String menuStatus;

    //MENU_JS_EXPRESSION:扩展的JS表达式
    private String menuJsExpression;

    //MENU_OUTER_OBJECT:外部关联对象
    private String menuOuterObject;

    /**
     * 构造函数
     * @param menuId
     * @param menuName 菜单名称
     * @param menuSystemId 所属系统ID
     * @param menuText 菜单文本
     * @param menuValue 菜单值
     * @param menuType 菜单类型
     * @param menuOuterId 外部关联ID
     * @param menuOuterName 外部关联对象名称
     * @param menuCreatorId 创建者ID
     * @param menuOrganId 创建组织ID
     * @param menuOrganName 创造组织名称
     * @param menuIsExpand 是否展开
     * @param menuIsSystem 是否系统所有
     * @param menuLeftUrl 左侧链接地址
     * @param menuLeftUrlPara 左侧链接参数
     * @param menuRightUrl 链接地址
     * @param menuRightUrlPara 链接参数
     * @param menuOrderNum 排序号
     * @param menuParentId 父节点ID
     * @param menuParentIdList 父节点ID列表
     * @param menuTarget 点击打开对象
     * @param menuCreateTime 创建时间
     * @param menuUpdater 更新人
     * @param menuUpdateTime 更新时间
     * @param menuUseOrganName 使用组织名称
     * @param menuUseOrganId 使用组织ID
     * @param menuUseOrganTypeName 使用组织类型名称
     * @param menuUseOrganTypeId 使用组织类型ID
     * @param menuClassName 样式类名
     * @param menuClassNameHover Hover时的样式类名
     * @param menuClassNameSelected 样式选中的样式类名
     * @param menuChildCount 子节点数量
     * @param menuDescription 备注
     * @param menuStatus 状态
     * @param menuJsExpression 扩展的JS表达式
     * @param menuOuterObject 外部关联对象
     **/
    public MenuPO(String menuId, String menuName, String menuSystemId, String menuText, String menuValue, String menuType, String menuOuterId, String menuOuterName, String menuCreatorId, String menuOrganId, String menuOrganName, String menuIsExpand, String menuIsSystem, String menuLeftUrl, String menuLeftUrlPara, String menuRightUrl, String menuRightUrlPara, Integer menuOrderNum, String menuParentId, String menuParentIdList, String menuTarget, Date menuCreateTime, String menuUpdater, Date menuUpdateTime, String menuUseOrganName, String menuUseOrganId, String menuUseOrganTypeName, String menuUseOrganTypeId, String menuClassName, String menuClassNameHover, String menuClassNameSelected, Integer menuChildCount, String menuDescription, String menuStatus, String menuJsExpression, String menuOuterObject) {
        this.menuId = menuId;
        this.menuName = menuName;
        this.menuSystemId = menuSystemId;
        this.menuText = menuText;
        this.menuValue = menuValue;
        this.menuType = menuType;
        this.menuOuterId = menuOuterId;
        this.menuOuterName = menuOuterName;
        this.menuCreatorId = menuCreatorId;
        this.menuOrganId = menuOrganId;
        this.menuOrganName = menuOrganName;
        this.menuIsExpand = menuIsExpand;
        this.menuIsSystem = menuIsSystem;
        this.menuLeftUrl = menuLeftUrl;
        this.menuLeftUrlPara = menuLeftUrlPara;
        this.menuRightUrl = menuRightUrl;
        this.menuRightUrlPara = menuRightUrlPara;
        this.menuOrderNum = menuOrderNum;
        this.menuParentId = menuParentId;
        this.menuParentIdList = menuParentIdList;
        this.menuTarget = menuTarget;
        this.menuCreateTime = menuCreateTime;
        this.menuUpdater = menuUpdater;
        this.menuUpdateTime = menuUpdateTime;
        this.menuUseOrganName = menuUseOrganName;
        this.menuUseOrganId = menuUseOrganId;
        this.menuUseOrganTypeName = menuUseOrganTypeName;
        this.menuUseOrganTypeId = menuUseOrganTypeId;
        this.menuClassName = menuClassName;
        this.menuClassNameHover = menuClassNameHover;
        this.menuClassNameSelected = menuClassNameSelected;
        this.menuChildCount = menuChildCount;
        this.menuDescription = menuDescription;
        this.menuStatus = menuStatus;
        this.menuJsExpression = menuJsExpression;
        this.menuOuterObject = menuOuterObject;
    }

    public MenuPO() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getMenuId() {
        return menuId;
    }

    /**
     *
     * @param menuId
     **/
    public void setMenuId(String menuId) {
        this.menuId = menuId == null ? null : menuId.trim();
    }

    /**
     * 菜单名称
     * @return java.lang.String
     **/
    public String getMenuName() {
        return menuName;
    }

    /**
     * 菜单名称
     * @param menuName 菜单名称
     **/
    public void setMenuName(String menuName) {
        this.menuName = menuName == null ? null : menuName.trim();
    }

    /**
     * 所属系统ID
     * @return java.lang.String
     **/
    public String getMenuSystemId() {
        return menuSystemId;
    }

    /**
     * 所属系统ID
     * @param menuSystemId 所属系统ID
     **/
    public void setMenuSystemId(String menuSystemId) {
        this.menuSystemId = menuSystemId == null ? null : menuSystemId.trim();
    }

    /**
     * 菜单文本:用于UI显示
     * @return java.lang.String
     **/
    public String getMenuText() {
        return menuText;
    }

    /**
     * 菜单文本:用于UI显示
     * @param menuText 菜单文本
     **/
    public void setMenuText(String menuText) {
        this.menuText = menuText == null ? null : menuText.trim();
    }

    /**
     * 菜单值
     * @return java.lang.String
     **/
    public String getMenuValue() {
        return menuValue;
    }

    /**
     * 菜单值
     * @param menuValue 菜单值
     **/
    public void setMenuValue(String menuValue) {
        this.menuValue = menuValue == null ? null : menuValue.trim();
    }

    /**
     * 菜单类型:超链接菜单,Web模块列表,Web模块窗体
     * @return java.lang.String
     **/
    public String getMenuType() {
        return menuType;
    }

    /**
     * 菜单类型:超链接菜单,Web模块列表,Web模块窗体
     * @param menuType 菜单类型
     **/
    public void setMenuType(String menuType) {
        this.menuType = menuType == null ? null : menuType.trim();
    }

    /**
     * 外部关联ID
     * @return java.lang.String
     **/
    public String getMenuOuterId() {
        return menuOuterId;
    }

    /**
     * 外部关联ID
     * @param menuOuterId 外部关联ID
     **/
    public void setMenuOuterId(String menuOuterId) {
        this.menuOuterId = menuOuterId == null ? null : menuOuterId.trim();
    }

    /**
     * 外部关联对象名称
     * @return java.lang.String
     **/
    public String getMenuOuterName() {
        return menuOuterName;
    }

    /**
     * 外部关联对象名称
     * @param menuOuterName 外部关联对象名称
     **/
    public void setMenuOuterName(String menuOuterName) {
        this.menuOuterName = menuOuterName == null ? null : menuOuterName.trim();
    }

    /**
     * 创建者ID
     * @return java.lang.String
     **/
    public String getMenuCreatorId() {
        return menuCreatorId;
    }

    /**
     * 创建者ID
     * @param menuCreatorId 创建者ID
     **/
    public void setMenuCreatorId(String menuCreatorId) {
        this.menuCreatorId = menuCreatorId == null ? null : menuCreatorId.trim();
    }

    /**
     * 创建组织ID
     * @return java.lang.String
     **/
    public String getMenuOrganId() {
        return menuOrganId;
    }

    /**
     * 创建组织ID
     * @param menuOrganId 创建组织ID
     **/
    public void setMenuOrganId(String menuOrganId) {
        this.menuOrganId = menuOrganId == null ? null : menuOrganId.trim();
    }

    /**
     * 创造组织名称
     * @return java.lang.String
     **/
    public String getMenuOrganName() {
        return menuOrganName;
    }

    /**
     * 创造组织名称
     * @param menuOrganName 创造组织名称
     **/
    public void setMenuOrganName(String menuOrganName) {
        this.menuOrganName = menuOrganName == null ? null : menuOrganName.trim();
    }

    /**
     * 是否展开
     * @return java.lang.String
     **/
    public String getMenuIsExpand() {
        return menuIsExpand;
    }

    /**
     * 是否展开
     * @param menuIsExpand 是否展开
     **/
    public void setMenuIsExpand(String menuIsExpand) {
        this.menuIsExpand = menuIsExpand == null ? null : menuIsExpand.trim();
    }

    /**
     * 是否系统所有
     * @return java.lang.String
     **/
    public String getMenuIsSystem() {
        return menuIsSystem;
    }

    /**
     * 是否系统所有
     * @param menuIsSystem 是否系统所有
     **/
    public void setMenuIsSystem(String menuIsSystem) {
        this.menuIsSystem = menuIsSystem == null ? null : menuIsSystem.trim();
    }

    /**
     * 左侧链接地址
     * @return java.lang.String
     **/
    public String getMenuLeftUrl() {
        return menuLeftUrl;
    }

    /**
     * 左侧链接地址
     * @param menuLeftUrl 左侧链接地址
     **/
    public void setMenuLeftUrl(String menuLeftUrl) {
        this.menuLeftUrl = menuLeftUrl == null ? null : menuLeftUrl.trim();
    }

    /**
     * 左侧链接参数
     * @return java.lang.String
     **/
    public String getMenuLeftUrlPara() {
        return menuLeftUrlPara;
    }

    /**
     * 左侧链接参数
     * @param menuLeftUrlPara 左侧链接参数
     **/
    public void setMenuLeftUrlPara(String menuLeftUrlPara) {
        this.menuLeftUrlPara = menuLeftUrlPara == null ? null : menuLeftUrlPara.trim();
    }

    /**
     * 链接地址
     * @return java.lang.String
     **/
    public String getMenuRightUrl() {
        return menuRightUrl;
    }

    /**
     * 链接地址
     * @param menuRightUrl 链接地址
     **/
    public void setMenuRightUrl(String menuRightUrl) {
        this.menuRightUrl = menuRightUrl == null ? null : menuRightUrl.trim();
    }

    /**
     * 链接参数
     * @return java.lang.String
     **/
    public String getMenuRightUrlPara() {
        return menuRightUrlPara;
    }

    /**
     * 链接参数
     * @param menuRightUrlPara 链接参数
     **/
    public void setMenuRightUrlPara(String menuRightUrlPara) {
        this.menuRightUrlPara = menuRightUrlPara == null ? null : menuRightUrlPara.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getMenuOrderNum() {
        return menuOrderNum;
    }

    /**
     * 排序号
     * @param menuOrderNum 排序号
     **/
    public void setMenuOrderNum(Integer menuOrderNum) {
        this.menuOrderNum = menuOrderNum;
    }

    /**
     * 父节点ID
     * @return java.lang.String
     **/
    public String getMenuParentId() {
        return menuParentId;
    }

    /**
     * 父节点ID
     * @param menuParentId 父节点ID
     **/
    public void setMenuParentId(String menuParentId) {
        this.menuParentId = menuParentId == null ? null : menuParentId.trim();
    }

    /**
     * 父节点ID列表
     * @return java.lang.String
     **/
    public String getMenuParentIdList() {
        return menuParentIdList;
    }

    /**
     * 父节点ID列表
     * @param menuParentIdList 父节点ID列表
     **/
    public void setMenuParentIdList(String menuParentIdList) {
        this.menuParentIdList = menuParentIdList == null ? null : menuParentIdList.trim();
    }

    /**
     * 点击打开对象
     * @return java.lang.String
     **/
    public String getMenuTarget() {
        return menuTarget;
    }

    /**
     * 点击打开对象
     * @param menuTarget 点击打开对象
     **/
    public void setMenuTarget(String menuTarget) {
        this.menuTarget = menuTarget == null ? null : menuTarget.trim();
    }

    /**
     * 创建时间
     * @return java.util.Date
     **/
    public Date getMenuCreateTime() {
        return menuCreateTime;
    }

    /**
     * 创建时间
     * @param menuCreateTime 创建时间
     **/
    public void setMenuCreateTime(Date menuCreateTime) {
        this.menuCreateTime = menuCreateTime;
    }

    /**
     * 更新人
     * @return java.lang.String
     **/
    public String getMenuUpdater() {
        return menuUpdater;
    }

    /**
     * 更新人
     * @param menuUpdater 更新人
     **/
    public void setMenuUpdater(String menuUpdater) {
        this.menuUpdater = menuUpdater == null ? null : menuUpdater.trim();
    }

    /**
     * 更新时间
     * @return java.util.Date
     **/
    public Date getMenuUpdateTime() {
        return menuUpdateTime;
    }

    /**
     * 更新时间
     * @param menuUpdateTime 更新时间
     **/
    public void setMenuUpdateTime(Date menuUpdateTime) {
        this.menuUpdateTime = menuUpdateTime;
    }

    /**
     * 使用组织名称
     * @return java.lang.String
     **/
    public String getMenuUseOrganName() {
        return menuUseOrganName;
    }

    /**
     * 使用组织名称
     * @param menuUseOrganName 使用组织名称
     **/
    public void setMenuUseOrganName(String menuUseOrganName) {
        this.menuUseOrganName = menuUseOrganName == null ? null : menuUseOrganName.trim();
    }

    /**
     * 使用组织ID
     * @return java.lang.String
     **/
    public String getMenuUseOrganId() {
        return menuUseOrganId;
    }

    /**
     * 使用组织ID
     * @param menuUseOrganId 使用组织ID
     **/
    public void setMenuUseOrganId(String menuUseOrganId) {
        this.menuUseOrganId = menuUseOrganId == null ? null : menuUseOrganId.trim();
    }

    /**
     * 使用组织类型名称
     * @return java.lang.String
     **/
    public String getMenuUseOrganTypeName() {
        return menuUseOrganTypeName;
    }

    /**
     * 使用组织类型名称
     * @param menuUseOrganTypeName 使用组织类型名称
     **/
    public void setMenuUseOrganTypeName(String menuUseOrganTypeName) {
        this.menuUseOrganTypeName = menuUseOrganTypeName == null ? null : menuUseOrganTypeName.trim();
    }

    /**
     * 使用组织类型ID
     * @return java.lang.String
     **/
    public String getMenuUseOrganTypeId() {
        return menuUseOrganTypeId;
    }

    /**
     * 使用组织类型ID
     * @param menuUseOrganTypeId 使用组织类型ID
     **/
    public void setMenuUseOrganTypeId(String menuUseOrganTypeId) {
        this.menuUseOrganTypeId = menuUseOrganTypeId == null ? null : menuUseOrganTypeId.trim();
    }

    /**
     * 样式类名
     * @return java.lang.String
     **/
    public String getMenuClassName() {
        return menuClassName;
    }

    /**
     * 样式类名
     * @param menuClassName 样式类名
     **/
    public void setMenuClassName(String menuClassName) {
        this.menuClassName = menuClassName == null ? null : menuClassName.trim();
    }

    /**
     * Hover时的样式类名
     * @return java.lang.String
     **/
    public String getMenuClassNameHover() {
        return menuClassNameHover;
    }

    /**
     * Hover时的样式类名
     * @param menuClassNameHover Hover时的样式类名
     **/
    public void setMenuClassNameHover(String menuClassNameHover) {
        this.menuClassNameHover = menuClassNameHover == null ? null : menuClassNameHover.trim();
    }

    /**
     * 样式选中的样式类名
     * @return java.lang.String
     **/
    public String getMenuClassNameSelected() {
        return menuClassNameSelected;
    }

    /**
     * 样式选中的样式类名
     * @param menuClassNameSelected 样式选中的样式类名
     **/
    public void setMenuClassNameSelected(String menuClassNameSelected) {
        this.menuClassNameSelected = menuClassNameSelected == null ? null : menuClassNameSelected.trim();
    }

    /**
     * 子节点数量
     * @return java.lang.Integer
     **/
    public Integer getMenuChildCount() {
        return menuChildCount;
    }

    /**
     * 子节点数量
     * @param menuChildCount 子节点数量
     **/
    public void setMenuChildCount(Integer menuChildCount) {
        this.menuChildCount = menuChildCount;
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getMenuDescription() {
        return menuDescription;
    }

    /**
     * 备注
     * @param menuDescription 备注
     **/
    public void setMenuDescription(String menuDescription) {
        this.menuDescription = menuDescription == null ? null : menuDescription.trim();
    }

    /**
     * 状态:启用,禁用
     * @return java.lang.String
     **/
    public String getMenuStatus() {
        return menuStatus;
    }

    /**
     * 状态:启用,禁用
     * @param menuStatus 状态
     **/
    public void setMenuStatus(String menuStatus) {
        this.menuStatus = menuStatus == null ? null : menuStatus.trim();
    }

    /**
     * 扩展的JS表达式
     * @return java.lang.String
     **/
    public String getMenuJsExpression() {
        return menuJsExpression;
    }

    /**
     * 扩展的JS表达式
     * @param menuJsExpression 扩展的JS表达式
     **/
    public void setMenuJsExpression(String menuJsExpression) {
        this.menuJsExpression = menuJsExpression == null ? null : menuJsExpression.trim();
    }

    /**
     * 外部关联对象
     * @return java.lang.String
     **/
    public String getMenuOuterObject() {
        return menuOuterObject;
    }

    /**
     * 外部关联对象
     * @param menuOuterObject 外部关联对象
     **/
    public void setMenuOuterObject(String menuOuterObject) {
        this.menuOuterObject = menuOuterObject == null ? null : menuOuterObject.trim();
    }
}