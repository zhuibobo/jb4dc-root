package com.jb4dc.base.service.po;

import com.jb4dc.core.base.vo.JBuild4DCResponseVo;

import java.util.HashMap;
import java.util.Map;

public class SimplePO {
    private boolean success;
    private String message;
    private String stringValue;
    private boolean booleanValue;
    private Object data;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStringValue() {
        return stringValue;
    }

    public void setStringValue(String stringValue) {
        this.stringValue = stringValue;
    }

    public boolean isBooleanValue() {
        return booleanValue;
    }

    public void setBooleanValue(boolean booleanValue) {
        this.booleanValue = booleanValue;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public JBuild4DCResponseVo toResponseVo(){
        JBuild4DCResponseVo responseVo=new JBuild4DCResponseVo();
        responseVo.setSuccess(success);
        responseVo.setMessage(message);
        responseVo.setData(data);
        Map<String,Object> exKVData=new HashMap<>();
        exKVData.put("stringValue",stringValue);
        exKVData.put("booleanValue",booleanValue);
        responseVo.setExKVData(exKVData);
        return responseVo;
    }
}
