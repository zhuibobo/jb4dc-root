package com.jb4dc.code.generate.vo;

import javax.xml.bind.annotation.*;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/4
 * To change this template use File | Settings | File Templates.
 */
@XmlAccessorType(XmlAccessType.FIELD)

// XML文件中的根标识
@XmlRootElement(name = "DataSource")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "id",
        "caption",
        "dbType",
        "driverName",
        "databaseName",
        "url",
        "user",
        "password"
})
public class DataSourceSingleVo {
    @XmlElement(name = "Id")
    private String id;

    @XmlElement(name = "Caption")
    private String caption;

    @XmlElement(name = "DBType")
    private String dbType;

    @XmlElement(name = "DriverName")
    private String driverName;

    @XmlElement(name = "DatabaseName")
    private String databaseName;

    @XmlElement(name = "Url")
    private String url;

    @XmlElement(name = "User")
    private String user;

    @XmlElement(name = "Password")
    private String password;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public String getDbType() {
        return dbType;
    }

    public void setDbType(String dbType) {
        this.dbType = dbType;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getDatabaseName() {
        return databaseName;
    }

    public void setDatabaseName(String databaseName) {
        this.databaseName = databaseName;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
