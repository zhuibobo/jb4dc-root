//基础工具
var BaseUtility = {
    GetRootPath: function () {
        var fullHref = window.document.location.href;
        var pathName = window.document.location.pathname;
        var lac = fullHref.indexOf(pathName);
        var localhostPath = fullHref.substring(0, lac);
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhostPath + projectName);
    },
    GetTopWindow: function () {
        alert("BaseUtility.GetTopWindow 已停用");
        /*var windowTop = window;
        var windowParent = window.dialogArguments || opener || parent;
        while (windowParent && windowTop != windowParent) {
            windowTop = windowParent;
            if(windowTop.IsTopWorkaroundPage){
                break;
            }
            windowParent = windowParent.dialogArguments || windowParent.opener || windowParent.parent;
        }
        return windowTop;*/
    },
    TrySetControlFocus:function () {
        alert("BaseUtility.TrySetControlFocus 已停用");
        /*var cts=$("input[type='text']");
        for(var i=0;i<cts.length;i++){
            var ct=$(cts[i]);
            if (ct.attr("readonly") != "readonly"&& ct.attr("disabled") != "disabled") {
                try {
                    ct[0].focus();
                }
                catch (e) {

                }
                return;
            }
        }*/
    },
    BuildView:function (action,para) {
        return this.BuildAction(action,para);
        /*var urlPara = "";
        if (para) {
            urlPara = $.param(para);
        }
        var _url = this.GetRootPath() + action;
        if (urlPara != "") {
            _url += "?" + urlPara;
        }
        return this.AppendTimeStampUrl(_url);*/
    },
    BuildAction:function (action,para) {
        var urlPara = "";
        if (para) {
            urlPara = $.param(para);
        }
        var _url = this.GetRootPath() + action;
        if (urlPara != "") {
            _url += "?" + urlPara;
        }
        //alert(_url);
        return this.AppendTimeStampUrl(_url);
    },
    RedirectToLogin:function () {
        var url=BaseUtility.GetRootPath()+"/PlatForm/LoginView.do";
        window.parent.parent.location.href=url;
    },
    AppendTimeStampUrl:function (url) {
        if (url.indexOf("timestamp") > "0") {
            return url;
        }
        var getTimestamp = new Date().getTime();
        if (url.indexOf("?") > -1) {
            url = url + "&timestamp=" + getTimestamp
        } else {
            url = url + "?timestamp=" + getTimestamp
        }
        return url;
    },
    GetUrlParaValue: function (paraName) {
        return this.GetUrlParaValueByString(paraName,window.location.search);
    },
    GetUrlParaValueByString:function (paraName,urlString) {
        var reg = new RegExp("(^|&)" + paraName + "=([^&]*)(&|$)");
        var r = urlString.substr(1).match(reg);
        if (r != null)return decodeURIComponent(r[2]);
        return "";
    },
    CopyValueClipboard:function (value) {
        //debugger;
        var transfer = document.getElementById('J_CopyTransfer');
        if (!transfer) {
            transfer = document.createElement('textarea');
            transfer.id = 'J_CopyTransfer';
            transfer.style.position = 'absolute';
            transfer.style.left = '-9999px';
            transfer.style.top = '-9999px';
            transfer.style.zIndex = 9999;
            document.body.appendChild(transfer);
        }
        //$(transfer).val(value);
        transfer.value = value;
        transfer.focus();
        transfer.select();
        document.execCommand('copy');
    },
    SetSystemFavicon:function () {
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = BaseUtility.GetRootPath()+'/favicon.ico';
        document.getElementsByTagName('head')[0].appendChild(link);
    },
    SetSystemTitle:function () {
        document.title=JBuild4DCYaml.GetClientSystemTitle();
    },
    SetSystemCaption:function(){
        $("#systemCaption").text(JBuild4DCYaml.GetClientSystemCaption());
    },
    IsFunction:function (func) {
        if(typeof(func)=="function"){
            return true;
        }
        return false;
    }
};