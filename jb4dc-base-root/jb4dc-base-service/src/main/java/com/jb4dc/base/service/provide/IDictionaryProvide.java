package com.jb4dc.base.service.provide;

import com.jb4dc.base.service.po.DictionaryPO;
import com.jb4dc.core.base.session.JB4DCSession;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/12
 * To change this template use File | Settings | File Templates.
 */
public interface IDictionaryProvide {
    List<DictionaryPO> getListDataByGroupValue(JB4DCSession session, String groupValue);
}
