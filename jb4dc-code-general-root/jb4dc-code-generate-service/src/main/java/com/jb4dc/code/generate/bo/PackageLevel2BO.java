package com.jb4dc.code.generate.bo;

import javax.xml.bind.annotation.*;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/6
 * To change this template use File | Settings | File Templates.
 */
@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "PackageLevel2Name")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "value",
})
public class PackageLevel2BO {

    @XmlAttribute(name = "value")
    private String value;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
