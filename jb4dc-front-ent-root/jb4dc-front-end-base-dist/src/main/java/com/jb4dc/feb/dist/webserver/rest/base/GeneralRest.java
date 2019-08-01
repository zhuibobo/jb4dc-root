package com.jb4dc.feb.dist.webserver.rest.base;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.pagehelper.PageInfo;
import com.jb4dc.base.dbaccess.anno.DBAnnoUtility;
import com.jb4dc.base.service.IBaseService;
import com.jb4dc.base.service.IHistoryDataService;
import com.jb4dc.base.service.IOperationLogService;
import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.service.po.DictionaryPO;
import com.jb4dc.base.service.provide.IDictionaryProvide;
import com.jb4dc.base.service.search.GeneralSearchUtility;
import com.jb4dc.base.tools.JsonUtility;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.ClassUtility;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public abstract class GeneralRest<T> implements IGeneralRest<T> {

    private static Logger logger = LoggerFactory.getLogger(GeneralRest.class);

    @Autowired(required = false)
    IDictionaryProvide dictionaryProvide;

    @Autowired(required = false)
    IOperationLogService operationLogService;

    @Autowired(required = false)
    IHistoryDataService historyDataService;

    //@Autowired
    //JBuild4DCYaml jBuild4DCYaml;

    //@Autowired(required = false)
    //IOperationLogProvide operationLogProvide;

    //protected String jBuild4DSystemName ="应用管理系统";
    //protected String moduleName="";
    //;

    /*

    public abstract String getModuleName();*/

    /**/

    public String getJB4DCSystemCaption(){
        return JBuild4DCYaml.getSystemCaption();
    }

    public abstract String getModuleName();

    //protected String logTypeName="";
    protected String getLogTypeName(){
        return "操作日志";
    }

    protected void writeOperationLog(String actionName, String text, String data, HttpServletRequest request) throws JsonProcessingException, JBuild4DCGenerallyException {
        String systemCaption=this.getJB4DCSystemCaption();
        /*if(systemName==null){
            systemName=jBuild4DSystemName;
        }*/
        if(operationLogService!=null) {
            operationLogService.writeOperationLog(JB4DCSessionUtility.getSession(), systemCaption, getModuleName(), actionName, getLogTypeName(), text, data, this.getClass(), request);
        }
        else{
            logger.info("找不到IOperationLogService实现类的Bean!");
        }
    }

    //得到泛型类T
    public Class getMyClass(){
        //System.out.println(this.getClass());
        //class com.dfsj.generic.UserDaoImpl因为是该类调用的该法，所以this代表它

        //返回表示此 Class 所表示的实体类的 直接父类 的 Type。注意，是直接父类
        //这里type结果是 com.dfsj.generic.GetInstanceUtil<com.dfsj.generic.User>
        Type type = getClass().getGenericSuperclass();

        // 判断 是否泛型
        if (type instanceof ParameterizedType) {
            // 返回表示此类型实际类型参数的Type对象的数组.
            // 当有多个泛型类时，数组的长度就不是1了
            Type[] ptype = ((ParameterizedType) type).getActualTypeArguments();
            return (Class) ptype[0];  //将第一个泛型T对应的类返回（这里只有一个）
        } else {
            return Object.class;//若没有给定泛型，则返回Object类
        }

    }

    protected abstract IBaseService<T> getBaseService();

    @RequestMapping(value = "/GetListData", method = RequestMethod.POST)
    public JBuild4DCResponseVo getListData(Integer pageSize, Integer pageNum, String searchCondition, boolean loadDict) throws IOException, ParseException, JBuild4DCGenerallyException {
        JB4DCSession jb4DSession= JB4DCSessionUtility.getSession();
        Map<String,Object> searchMap= GeneralSearchUtility.deserializationToMap(searchCondition);
        PageInfo<T> proPageInfo=getBaseService().getPage(jb4DSession,pageNum,pageSize,searchMap);
        JBuild4DCResponseVo responseVo=new JBuild4DCResponseVo();
        responseVo.setData(proPageInfo);
        responseVo.setMessage("获取成功");
        responseVo.setSuccess(true);

        if(loadDict==true) {
            List<String> dictionaryGroupValueList = bindDictionaryToPage();
            if (dictionaryGroupValueList != null && dictionaryGroupValueList.size() > 0) {
                responseVo.addExKVData("dictionaryJson", getDictionaryJson(dictionaryGroupValueList));
            }
        }

        return responseVo;
        //return JBuild4DCResponseVo.success("获取成功",proOrganPageInfo);
    }

    @RequestMapping(value = "/GetDetailData", method = RequestMethod.POST)
    public JBuild4DCResponseVo getDetailData(String recordId, String op) throws IllegalAccessException, InstantiationException, JsonProcessingException, JBuild4DCGenerallyException {
        T entity;
        JBuild4DCResponseVo responseVo=new JBuild4DCResponseVo();
        if(StringUtility.isEmpty(recordId)) {
            entity=(T) ClassUtility.newTclass(getMyClass());
            recordId= UUIDUtility.getUUID();
            responseVo.addExKVData("recordId",recordId);
            DBAnnoUtility.setIdValue(entity,recordId);
        }
        else {
            JB4DCSession jb4DSession= JB4DCSessionUtility.getSession();
            entity=getBaseService().getByPrimaryKey(jb4DSession,recordId);
            responseVo.addExKVData("recordId",recordId);
        }

        List<String> dictionaryGroupValueList=bindDictionaryToPage();
        //String dictionaryJsonString=getDictionaryJsonString(dictionaryGroupValueList);
        Map<String,List<DictionaryPO>> dictionaryJson=getDictionaryJson(dictionaryGroupValueList);
        responseVo.addExKVData("dictionaryJson",dictionaryJson);

        responseVo.setData(entity);
        responseVo.addExKVData("op",op);

        Map<String,Object> bindObjectsToMVData=this.bindObjectsToMV();
        if(bindObjectsToMVData!=null){
            responseVo.addExKVData("exObjectsJson", bindObjectsToMVData);
        }
        return responseVo;
    }

    public JBuild4DCResponseVo saveEditEnable(JB4DCSession jb4DSession,T entity, HttpServletRequest request){
        return JBuild4DCResponseVo.success("");
    }

    @RequestMapping(value = "/SaveEdit", method = RequestMethod.POST)
    public JBuild4DCResponseVo saveEdit(@RequestBody T entity, HttpServletRequest request) throws JBuild4DCGenerallyException {
        try {
            JB4DCSession jb4DSession=JB4DCSessionUtility.getSession();
            JBuild4DCResponseVo saveBeforeValidateVo=saveEditEnable(jb4DSession,entity,request);
            if(saveBeforeValidateVo.isSuccess()) {
                String recordID = DBAnnoUtility.getIdValue(entity);
                if (recordID.equals("") || recordID == null) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"recordID不能为空或字符串!");
                }

                if (getBaseService() == null) {
                    throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,this.getClass().getSimpleName() + ".getBaseService()返回的对象为Null");
                }
                if (getBaseService().getByPrimaryKey(jb4DSession, recordID) == null) {
                    this.writeOperationLog("新增数据", "用户[" + jb4DSession.getUserName() + "]新增了ID为" + recordID + "的数据[" + getMyClass().getSimpleName() + "]", JsonUtility.toObjectString(entity), request);
                } else {
                    this.writeOperationLog("修改数据", "用户[" + jb4DSession.getUserName() + "]修改了ID为" + recordID + "的数据[" + getMyClass().getSimpleName() + "]", JsonUtility.toObjectString(entity), request);
                }
                getBaseService().saveSimple(jb4DSession, recordID, entity);
                return JBuild4DCResponseVo.saveSuccess(entity);
            }
            else
            {
                return saveBeforeValidateVo;
            }
        } catch (JBuild4DCGenerallyException e) {
            return JBuild4DCResponseVo.error(e.getMessage());
        }
        catch (Exception e){
            return JBuild4DCResponseVo.error(e.getMessage());
        }
    }

    @RequestMapping(value = "/StatusChange", method = RequestMethod.POST)
    public JBuild4DCResponseVo statusChange(String ids, String status, HttpServletRequest request) throws JsonProcessingException {
        try {
            if(StringUtility.isEmpty(ids)){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"参数Ids不能为空或空串!");
            }
            if(StringUtility.isEmpty(status)){
                throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"参数status不能为空或空串!");
            }
            JB4DCSession jb4DSession=JB4DCSessionUtility.getSession();
            this.writeOperationLog("修改数据","用户["+jb4DSession.getUserName()+"]修改了ID为"+ids+"的数据状态["+getMyClass().getSimpleName()+"]",status,request);
            getBaseService().statusChange(jb4DSession,ids,status);
            return JBuild4DCResponseVo.opSuccess();
        } catch (JBuild4DCGenerallyException e) {
            return JBuild4DCResponseVo.opError(e.getMessage());
        }
        //dictionaryGroupService.saveBySelective(dictionaryEntity.getDictGroupId(), dictionaryEntity);
    }

    @RequestMapping(value = "/Delete", method = RequestMethod.DELETE)
    public JBuild4DCResponseVo delete(String recordId, HttpServletRequest request) throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCSession jb4DSession=JB4DCSessionUtility.getSession();
        T entity=getBaseService().getByPrimaryKey(jb4DSession,recordId);
        this.writeOperationLog("删除数据","用户["+jb4DSession.getUserName()+"]删除了ID为"+recordId+"的数据["+getMyClass().getSimpleName()+"]",JsonUtility.toObjectString(entity),request);
        getBaseService().deleteByKey(jb4DSession,recordId);
        return JBuild4DCResponseVo.opSuccess();
    }

    @RequestMapping(value = "/Move", method = RequestMethod.POST)
    public JBuild4DCResponseVo move(String recordId, String type, HttpServletRequest request) throws JBuild4DCGenerallyException, JsonProcessingException {
        JB4DCSession jb4DSession=JB4DCSessionUtility.getSession();
        this.writeOperationLog("修改数据","用户["+jb4DSession.getUserName()+"]移动了ID为"+recordId+"的数据["+getMyClass().getSimpleName()+"]",recordId,request);
        if(type.equals("up")) {
            getBaseService().moveUp(jb4DSession, recordId);
        }
        else {
            getBaseService().moveDown(jb4DSession,recordId);
        }
        return JBuild4DCResponseVo.opSuccess();
    }

    public List<String> bindDictionaryToPage(){
        return null;
    }

    protected Map<String,Object> bindObjectsToMV(){
        return null;
    }

    protected Map<String,List<DictionaryPO>> getDictionaryJson(List<String> groupValueList) throws JsonProcessingException, JBuild4DCGenerallyException {
        Map<String,List<DictionaryPO>> dictionarysMap=new HashMap<>();

        if(groupValueList!=null&&groupValueList.size()>0){
            for (String groupValue : groupValueList) {
                if (dictionaryProvide==null){
                    throw JBuild4DCGenerallyException.getInterfaceNotBeanException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"com.jb4dc.base.service.provide.IDictionaryProvide");
                }
                List<DictionaryPO> dictionaryEntityList=dictionaryProvide.getListDataByGroupValue(JB4DCSessionUtility.getSession(),groupValue);
                if(dictionaryEntityList==null){
                    dictionaryEntityList=new ArrayList<>();
                }
                dictionarysMap.put(groupValue,dictionaryEntityList);
            }
        }
        return dictionarysMap;
    }
}
