package com.jb4dc.config.service;

import com.jb4dc.core.base.session.JB4DCSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/25
 * To change this template use File | Settings | File Templates.
 */
public interface IHistoryDataService {
    void keepRecordData(JB4DCSession JB4DCSession, Object record);

    void keepRecordData(JB4DCSession JB4DCSession, String tableName, String recordId, String recordData);
}
