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
@XmlRootElement(name = "Config")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "desc",
        "packageSingleBOList"
})
public class PackageConfigBO {
    @XmlAttribute(name = "desc")
    private String desc;

    @XmlElement(name = "Package")
    private List<PackageSingleBO> packageSingleBOList;

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public List<PackageSingleBO> getPackageSingleBOList() {
        return packageSingleBOList;
    }

    public void setPackageSingleBOList(List<PackageSingleBO> packageSingleBOList) {
        this.packageSingleBOList = packageSingleBOList;
    }
}
