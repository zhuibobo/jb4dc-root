package com.jb4dc.code.generate.bo;

import javax.xml.bind.annotation.*;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/4
 * To change this template use File | Settings | File Templates.
 */

@XmlAccessorType(XmlAccessType.FIELD)
// XML文件中的根标识
@XmlRootElement(name = "Config")
// 控制JAXB 绑定类中属性和字段的排序
@XmlType(propOrder = {
        "desc",
        "dataSourceSingleVoList"
})
public class DataSourceConfigBO {
    @XmlAttribute(name = "desc")
    private String desc;

    @XmlElement(name = "DataSource")
    private List<DataSourceSingleBO> dataSourceSingleVoList;

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public List<DataSourceSingleBO> getDataSourceSingleVoList() {
        return dataSourceSingleVoList;
    }

    public void setDataSourceSingleVoList(List<DataSourceSingleBO> dataSourceSingleVoList) {
        this.dataSourceSingleVoList = dataSourceSingleVoList;
    }
}
