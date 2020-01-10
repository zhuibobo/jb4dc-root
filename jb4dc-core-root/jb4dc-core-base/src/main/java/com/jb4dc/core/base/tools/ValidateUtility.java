package com.jb4dc.core.base.tools;

import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/1/8
 * To change this template use File | Settings | File Templates.
 */
public class ValidateUtility {
    public static boolean isBeUnique(String recordId,IMustBeUnique mustBeUnique,String operationName,String errorMsg) throws JBuild4DCGenerallyException {
        if(BaseUtility.getAddOperationName().equals(operationName)){
            if(mustBeUnique.beUniquePOId()==null){
                return true;
            }
        }
        else{
            if(recordId.equals(mustBeUnique.beUniquePOId())){
                return true;
            }
        }
        throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,errorMsg);
    }

    public static void isNotEmptyException(String value,int errorCode,String name) throws JBuild4DCGenerallyException {
        if (StringUtility.isEmpty(value)) {
            throw new JBuild4DCGenerallyException(errorCode, name + "不能为空!");
        }
    }
}
