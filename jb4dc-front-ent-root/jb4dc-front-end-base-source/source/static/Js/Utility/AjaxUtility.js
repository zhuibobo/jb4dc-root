//Ajax处理工具类
var AjaxUtility={
    PostRequestBody:function (_url,sendData,func,caller,dataType) {
        this.Post(_url,sendData,func,caller,dataType,"application/json; charset=utf-8");
    },
    PostSync:function (_url,sendData,func,caller,dataType,contentType) {
        return  this.Post(_url,sendData,func,dataType,caller,contentType,false);
    },
    Post:function (_url,sendData,func,caller,dataType) {
        return this._InnerAjax(_url,sendData,func,caller,dataType,null,true,"POST")
    },
    GetSync:function (_url,sendData,func,caller,dataType) {
        return this.Get(_url,sendData,func,caller,dataType,false);
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
        var url = BaseUtility.BuildAction(_url);
        if (dataType == undefined || dataType == null) {
            dataType = "json";
        }
        if (isAsync == undefined || isAsync == null) {
            isAsync = true;
        }
        if(contentType==undefined||contentType==null){
            contentType="application/x-www-form-urlencoded; charset=UTF-8";
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
                            DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"Session超时，请重新登陆系统",function () {
                                BaseUtility.RedirectToLogin();
                            });
                        }
                    }
                }
                catch(e) {
                    console.log("AjaxUtility.Post Exception "+url);
                }
                if(caller){
                    func.call(caller,result);
                }
                else {
                    func(result);
                }
                try{
                    if(result.success==false){
                        DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, result.message, function () {})
                    }
                }
                catch (e) {

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
                    DialogUtility.Alert(window,"AjaxUtility.Post.Error",{},"Ajax请求发生错误！"+"status:"+msg.status+",responseText:"+msg.responseText,null);
                }catch (e){

                }
            }
        });
        return innerResult;
    }
}