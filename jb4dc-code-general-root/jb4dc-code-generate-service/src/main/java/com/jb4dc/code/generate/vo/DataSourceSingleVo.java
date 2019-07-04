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
}
