//Ajax处理工具类
var AjaxUtility={
    PostRequestBody:function (_url,sendData,func,caller,dataType) {
        return this._InnerAjax(_url,sendData,func,caller,dataType,"application/json; charset=utf-8",true,"POST");
    },
    PostSync:function (_url,sendData,func,caller,dataType,contentType) {
        return this._InnerAjax(_url,sendData,func,caller,dataType,null,false,"POST")
    },
    Post:function (_url,sendData,func,caller,dataType) {
        return this._InnerAjax(_url,sendData,func,caller,dataType,null,true,"POST")
    },
    GetSync:function (_url,sendData,func,caller,dataType) {
        return this._InnerAjax(_url,sendData,func,caller,dataType,null,false,"GET");
    },
    Get:function (_url,sendData,func,caller,dataType) {
        return this._InnerAjax(_url,sendData,func,caller,dataType,null,true,"GET")
    },
    Delete:function (_url,sendData,func,caller,dataType) {
        return this._InnerAjax(_url,sendData,func,caller,dataType,null,true,"DELETE")
    },
    DeleteSync:function (_url,sendData,func,caller,dataType) {
        return this._InnerAjax(_url,sendData,func,caller,dataType,null,false,"DELETE")
    },
    _InnerAjax:function (_url,sendData,func,caller,dataType,contentType,isAsync,ajaxType) {
        if(caller&&caller=="json") {
            DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, "由于方法更新,caller参数请传递this", null);
        }
        /*if(caller&&caller.isSubmitting){
            caller.isSubmitting=true;
        }*/
        var url = BaseUtility.BuildAction(_url);
        if (dataType == undefined || dataType == null) {
            dataType = "json";
        }
        if (isAsync == undefined || isAsync == null) {
            isAsync = true;
        }
        if(contentType==undefined || contentType==null) {
            contentType = "application/x-www-form-urlencoded; charset=UTF-8";
        }
        var innerResult=null;
        $.ajax({
            type: ajaxType,
            url: url,
            cache: false,
            async:isAsync,
            contentType: contentType,//"application/json; charset=utf-8",*/
            dataType: dataType,
            data: sendData,
            success: function (result) {
                try{
                    if(result!=null&&result.success!=null&&!result.success){
                        if(result.message=="登录Session过期"){
                            DialogUtility.AlertError(window,DialogUtility.DialogAlertErrorId,{},"Session超时，请重新登陆系统",function () {
                                BaseUtility.RedirectToLogin();
                            });
                        }
                    }
                }
                catch(e) {
                    console.log("AjaxUtility.Post Exception "+url);
                }
                try{
                    if(result.success==false){
                        var message=result.message;
                        if(StringUtility.IsNullOrEmpty(message)){
                            message=result.traceMsg;
                        }
                        DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, message, function () {})
                        if(caller){
                            if(caller.isSubmitting){
                                caller.isSubmitting=false;
                            }
                        }
                    }
                }
                catch (e) {

                }
                if(caller){
                    func.call(caller,result);
                }
                else {
                    func(result);
                }
                innerResult=result;
            },
            complete: function (msg) {
                //debugger;
            },
            error: function (msg) {
                //debugger;
                try{
                    if(msg.responseText.indexOf("请重新登陆系统")>=0){
                        BaseUtility.RedirectToLogin();
                    }
                    console.log(msg);
                    DialogUtility.AlertError(window,"AjaxUtility.Post.Error",{},"Ajax请求发生错误！<br/>"+"status:"+msg.status+",<br/>responseText:"+msg.responseText,null);
                }catch (e){

                }
            }
        });
        return innerResult;
    }
}