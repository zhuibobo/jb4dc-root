package com.jb4dc.code.generate.service.impl;

import com.jb4dc.base.dbaccess.exenum.MenuTypeEnum;
import com.jb4dc.base.dbaccess.exenum.TrueFalseEnum;
import com.jb4dc.base.service.provide.IFrameMenuProvide;
import com.jb4dc.base.service.po.MenuPO;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/9
 * To change this template use File | Settings | File Templates.
 */
public class FrameMenuImpl implements IFrameMenuProvide {
    @Override
    public List<MenuPO> getMyFrameMenu(JB4DCSession jb4DCSession) {
        //return null;
        List<MenuPO> result=new ArrayList<>();
        String rootMenuId="0";
        MenuPO rootMenu=getMenu("-1",rootMenuId,"Root","Root","Root", MenuTypeEnum.Root.getDisplayName(),"","","");

        MenuPO codeGenerate=getMenu(rootMenu.getMenuId(),"codeGenerate",
                "代码生成","代码生成","代码生成",
                "","","/Controller/CodeGenerate/Manager","");

        MenuPO templateDownLoad=getMenu(rootMenu.getMenuId(),"templateDownLoad",
                "模版下载","模版下载","模版下载",
                "","","","");

        result.add(rootMenu);
        result.add(codeGenerate);
        result.add(templateDownLoad);
        return result;
    }

    public MenuPO getMenu(String parentId,String id,String name,String text,String value,String type,String leftUrl,String rightUrl,String iconClassName){
        MenuPO menuEntity=new MenuPO();
        menuEntity.setMenuId(id);
        menuEntity.setMenuName(name);
        menuEntity.setMenuText(text);
        menuEntity.setMenuValue(value);
        menuEntity.setMenuType(type);
        menuEntity.setMenuIsExpand(TrueFalseEnum.False.getDisplayName());
        menuEntity.setMenuIsSystem(TrueFalseEnum.True.getDisplayName());
        menuEntity.setMenuLeftUrl(leftUrl);
        menuEntity.setMenuRightUrl(rightUrl);
        menuEntity.setMenuParentId(parentId);
        menuEntity.setMenuClassName(iconClassName);
        return menuEntity;
    }
}
