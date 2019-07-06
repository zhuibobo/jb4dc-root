package com.jb4dc.code.generate.bo;

import javax.xml.bind.annotation.*;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/6
 * To change this template use File | Settings | File Templates.
 */

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "Package")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "name",
        "entity",
        "dao",
        "mapperAC",
        "packageLevel2BOList"
})
public class PackageSingleBO {
    @XmlAttribute(name = "name")
    private String name;

    @XmlAttribute(name = "entity")
    private String entity;

    @XmlTransient
    private String entitySavePath;

    @XmlAttribute(name = "dao")
    private String dao;

    @XmlTransient
    private String daoSavePath;

    @XmlAttribute(name = "mapperAC")
    private String mapperAC;

    @XmlTransient
    private String mapperACSavePath;

    @XmlElement(name = "PackageLevel2Name")
    private List<PackageLevel2BO> packageLevel2BOList;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEntity() {
        return entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

    public String getDao() {
        return dao;
    }

    public void setDao(String dao) {
        this.dao = dao;
    }

    public String getMapperAC() {
        return mapperAC;
    }

    public void setMapperAC(String mapperAC) {
        this.mapperAC = mapperAC;
    }

    public List<PackageLevel2BO> getPackageLevel2BOList() {
        return packageLevel2BOList;
    }

    public void setPackageLevel2BOList(List<PackageLevel2BO> packageLevel2BOList) {
        this.packageLevel2BOList = packageLevel2BOList;
    }

    public String getEntitySavePath() {
        return entitySavePath;
    }

    public void setEntitySavePath(String entitySavePath) {
        this.entitySavePath = entitySavePath;
    }

    public String getDaoSavePath() {
        return daoSavePath;
    }

    public void setDaoSavePath(String daoSavePath) {
        this.daoSavePath = daoSavePath;
    }

    public String getMapperACSavePath() {
        return mapperACSavePath;
    }

    public void setMapperACSavePath(String mapperACSavePath) {
        this.mapperACSavePath = mapperACSavePath;
    }
}
