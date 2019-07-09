package com.jb4dc.base.service.extend;

import com.jb4dc.base.service.po.MenuPO;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/9
 * To change this template use File | Settings | File Templates.
 */
public interface IFrameMenu {
    public List<MenuPO> getMyFrameMenu(JB4DCSession jb4DCSession);
}
