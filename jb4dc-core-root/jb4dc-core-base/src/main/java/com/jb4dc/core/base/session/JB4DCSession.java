package com.jb4dc.core.base.session;

import java.io.*;
import java.util.List;
import java.util.Map;

public class JB4DCSession implements Serializable {

    private String cookieSessionId;
    private String jaSessionId;

    /**
     * 用户所在的组织ID
     */
    private String organId;

    /**
     * 用户所在的组织名称
     */
    private String organName;

    /**
     * 用户所在的组织机构代码
     */
    private String organCode;

    /**
     * 用户的ID
     */
    private String userId;

    /**
     * 用户名名称
     */
    private String userName;

    /**
     * 用户帐号ID
     */
    private String accountId;

    /**
     * 用户帐号名称
     */
    private String accountName;

//    /**
//     * 用户帐号的密码
//     */
//    private String accountPsw;

    /**
     * 用户所属主部门的ID
     */
    private String mainDepartmentId;

    /**
     * 用户所属主部门的部门名称
     */
    private String mainDepartmentName;

    /**
     * 用户所有的角色Id
     */
    private List<String> roleKeys;

    private Map<String,String> exMap;

    private boolean fullAuthority;

    private String ssoSessionToken;

    private String appClientToken;

    public String getAppClientToken() {
        return appClientToken;
    }

    public void setAppClientToken(String appClientToken) {
        this.appClientToken = appClientToken;
    }

    public String getCookieSessionId() {
        return cookieSessionId;
    }

    public void setCookieSessionId(String cookieSessionId) {
        this.cookieSessionId = cookieSessionId;
    }

    public String getJaSessionId() {
        return jaSessionId;
    }

    public void setJaSessionId(String jaSessionId) {
        this.jaSessionId = jaSessionId;
    }

    /**
     * @return 拷贝Session对象
     */
    public JB4DCSession deepClone() {
        Object o = null;
        try {
            if (this != null) {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ObjectOutputStream oos = new ObjectOutputStream(baos);
                oos.writeObject(this);
                oos.close();
                ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
                ObjectInputStream ois = new ObjectInputStream(bais);
                o = ois.readObject();
                ois.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return (JB4DCSession) o;
    }

    public String getOrganId() {
        return organId;
    }

    public void setOrganId(String organId) {
        this.organId = organId;
    }

    public String getOrganName() {
        return organName;
    }

    public String getOrganCode() {
        return organCode;
    }

    public void setOrganCode(String organCode) {
        this.organCode = organCode;
    }

    public void setOrganName(String organName) {
        this.organName = organName;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getMainDepartmentId() {
        return mainDepartmentId;
    }

    public void setMainDepartmentId(String mainDepartmentId) {
        this.mainDepartmentId = mainDepartmentId;
    }

    public String getMainDepartmentName() {
        return mainDepartmentName;
    }

    public void setMainDepartmentName(String mainDepartmentName) {
        this.mainDepartmentName = mainDepartmentName;
    }

    public List<String> getRoleKeys() {
        return roleKeys;
    }

    public void setRoleKeys(List<String> roleKeys) {
        this.roleKeys = roleKeys;
    }

    public Map<String, String> getExMap() {
        return exMap;
    }

    public void setExMap(Map<String, String> exMap) {
        this.exMap = exMap;
    }

    public boolean isFullAuthority() {
        return fullAuthority;
    }

    public void setFullAuthority(boolean fullAuthority) {
        this.fullAuthority = fullAuthority;
    }

    public String getSsoSessionToken() {
        return ssoSessionToken;
    }

    public void setSsoSessionToken(String ssoSessionToken) {
        this.ssoSessionToken = ssoSessionToken;
    }
}
