"use strict";

var AjaxUtility = {
  PostRequestBody: function PostRequestBody(_url, sendData, func, caller, dataType) {
    return this._InnerAjax(_url, sendData, func, caller, dataType, "application/json; charset=utf-8", true, "POST");
  },
  PostSync: function PostSync(_url, sendData, func, caller, dataType, contentType) {
    return this._InnerAjax(_url, sendData, func, caller, dataType, null, false, "POST");
  },
  Post: function Post(_url, sendData, func, caller, dataType) {
    return this._InnerAjax(_url, sendData, func, caller, dataType, null, true, "POST");
  },
  GetSync: function GetSync(_url, sendData, func, caller, dataType) {
    return this._InnerAjax(_url, sendData, func, caller, dataType, null, false, "GET");
  },
  Get: function Get(_url, sendData, func, caller, dataType) {
    return this._InnerAjax(_url, sendData, func, caller, dataType, null, true, "GET");
  },
  Delete: function Delete(_url, sendData, func, caller, dataType) {
    return this._InnerAjax(_url, sendData, func, caller, dataType, null, true, "DELETE");
  },
  DeleteSync: function DeleteSync(_url, sendData, func, caller, dataType) {
    return this._InnerAjax(_url, sendData, func, caller, dataType, null, false, "DELETE");
  },
  _InnerAjax: function _InnerAjax(_url, sendData, func, caller, dataType, contentType, isAsync, ajaxType) {
    if (caller && caller == "json") {
      DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, "由于方法更新,caller参数请传递this", null);
    }

    var url = BaseUtility.BuildAction(_url);

    if (dataType == undefined || dataType == null) {
      dataType = "json";
    }

    if (isAsync == undefined || isAsync == null) {
      isAsync = true;
    }

    if (contentType == undefined || contentType == null) {
      contentType = "application/x-www-form-urlencoded; charset=UTF-8";
    }

    var innerResult = null;
    $.ajax({
      type: ajaxType,
      url: url,
      cache: false,
      async: isAsync,
      contentType: contentType,
      dataType: dataType,
      data: sendData,
      success: function success(result) {
        try {
          if (result != null && result.success != null && !result.success) {
            if (result.message == "登录Session过期") {
              DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, "Session超时，请重新登陆系统", function () {
                BaseUtility.RedirectToLogin();
              });
            }
          }
        } catch (e) {
          console.log("AjaxUtility.Post Exception " + url);
        }

        try {
          if (result.success == false) {
            var message = result.message;

            if (StringUtility.IsNullOrEmpty(message)) {
              message = result.traceMsg;
            }

            DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, message, function () {});

            if (caller) {
              if (caller.isSubmitting) {
                caller.isSubmitting = false;
              }
            }
          }
        } catch (e) {}

        if (caller) {
          func.call(caller, result);
        } else {
          func(result);
        }

        innerResult = result;
      },
      complete: function complete(msg) {},
      error: function error(msg) {
        try {
          if (msg.responseText.indexOf("请重新登陆系统") >= 0) {
            BaseUtility.RedirectToLogin();
          }

          console.log(msg);
          DialogUtility.AlertError(window, "AjaxUtility.Post.Error", {}, "Ajax请求发生错误！<br/>" + "status:" + msg.status + ",<br/>responseText:" + msg.responseText, null);
        } catch (e) {}
      }
    });
    return innerResult;
  }
};
"use strict";

var ArrayUtility = {
  DeleteWhere: function DeleteWhere(arr, condition) {
    for (var i = 0; i < arr.length; i++) {
      if (condition(arr[i])) {
        ArrayUtility.Delete(arr, i);
      }
    }
  },
  Delete: function Delete(ary, index) {
    ary.splice(index, 1);
  },
  SwapItems: function SwapItems(ary, index1, index2) {
    ary[index1] = ary.splice(index2, 1, ary[index1])[0];
    return ary;
  },
  MoveUp: function MoveUp(arr, $index) {
    if ($index == 0) {
      return;
    }

    this.SwapItems(arr, $index, $index - 1);
  },
  MoveDown: function MoveDown(arr, $index) {
    if ($index == arr.length - 1) {
      return;
    }

    this.SwapItems(arr, $index, $index + 1);
  },
  Unique: function Unique(arr) {
    var n = [];

    for (var i = 0; i < arr.length; i++) {
      if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
    }

    return n;
  },
  Exist: function Exist(arr, condition) {
    for (var i = 0; i < arr.length; i++) {
      if (condition(arr[i])) {
        return true;
      }
    }

    return false;
  },
  NotExist: function NotExist(arr, condition) {
    return !this.Exist(arr, condition);
  },
  PushWhenNotExist: function PushWhenNotExist(arr, item, condition) {
    if (!this.Exist(arr, condition)) {
      arr.push(item);
    }

    return arr;
  },
  Where: function Where(arr, condition) {
    var result = [];

    for (var i = 0; i < arr.length; i++) {
      if (condition(arr[i])) {
        result.push(arr[i]);
      }
    }

    return result;
  },
  WhereSingle: function WhereSingle(arr, condition) {
    var temp = this.Where(arr, condition);

    if (temp.length == 0) {
      return null;
    }

    return temp[0];
  },
  Push: function Push(source, append) {
    if (Array.isArray(append)) {
      for (var i = 0; i < append.length; i++) {
        source.push(append[i]);
      }
    } else {
      source.push(append);
    }
  },
  True: function True(source, condition) {
    for (var i = 0; i < source.length; i++) {
      if (condition(source[i])) {
        return true;
      }
    }

    return false;
  },
  IsArray: function IsArray(source) {
    if (!Array.isArray) {
      return Array.isArray(source);
    } else {
      return Object.prototype.toString.call(source) === '[object Array]';
    }
  },
  ReplaceItem: function ReplaceItem(source, newItem, condition) {
    for (var i = 0; i < source.length; i++) {
      if (condition(source[i])) {
        source.splice(i, 1, newItem);
      }
    }
  },
  ExistReplaceItem: function ExistReplaceItem(source, newItem, condition) {
    if (!source) {
      return false;
    }

    var result = false;

    for (var i = 0; i < source.length; i++) {
      if (condition(source[i])) {
        source.splice(i, 1, newItem);
        result = true;
      }
    }

    return result;
  },
  ToMap: function ToMap(source, keyFile) {
    var result = {};

    for (var i = 0; i < source.length; i++) {
      if (source[i][keyFile]) {
        result[source[i][keyFile]] = source[i];
      }
    }

    return result;
  },
  Insert: function Insert(source, index, item) {
    source.splice(index, 0, item);
  },
  InsertArray: function InsertArray(source, index, newAry) {
    for (var i = 0; i < newAry.length; i++) {
      source.splice(index++, 0, newAry[i]);
    }
  }
};
"use strict";

var BaiduMapUtility = {
  LoadJsCompleted: function LoadJsCompleted(cbFuncName) {
    AjaxUtility.Get("/Rest/Props/SystemProperties/GetBaiduMapJsUrl", {}, function (result) {
      if (result.success) {
        var url = result.data;
        var script = document.createElement("script");
        script.src = url + "&callback=" + cbFuncName;
        document.body.appendChild(script);
      }
    });
  },
  GetLatLngCenter: function GetLatLngCenter(polygonPathArray) {
    var ary = [];

    for (var i = 0; i < polygonPathArray.length; i++) {
      ary.push([polygonPathArray[i].lng, polygonPathArray[i].lat]);
    }

    var polygon = turf.polygon([ary]);
    var center = turf.center(polygon);
    return {
      lng: center.geometry.coordinates[0],
      lat: center.geometry.coordinates[1]
    };
  }
};
"use strict";

var BaseUtility = {
  GetRootPath: function GetRootPath() {
    var fullHref = window.document.location.href;
    var pathName = window.document.location.pathname;
    var lac = fullHref.indexOf(pathName);
    var localhostPath = fullHref.substring(0, lac);
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return localhostPath + projectName;
  },
  GetTopWindow: function GetTopWindow() {
    alert("BaseUtility.GetTopWindow 已停用");
  },
  TrySetControlFocus: function TrySetControlFocus() {
    alert("BaseUtility.TrySetControlFocus 已停用");
  },
  BuildView: function BuildView(action, para) {
    return this.BuildAction(action, para);
  },
  BuildAction: function BuildAction(action, para) {
    var urlPara = "";

    if (para) {
      urlPara = $.param(para);
    }

    var _url;

    if (action.indexOf("../") == 0) {
      _url = action;
    } else {
      _url = this.GetRootPath() + action;
    }

    if (urlPara != "") {
      if (_url.indexOf("?") > -1) {
        _url += "&" + urlPara;
      } else {
        _url += "?" + urlPara;
      }
    }

    return this.AppendTimeStampUrl(_url);
  },
  BuildActionNotAppendRootPath: function BuildActionNotAppendRootPath(action, para) {
    var urlPara = "";

    if (para) {
      urlPara = $.param(para);
    }

    var _url = action;

    if (urlPara != "") {
      if (_url.indexOf("?") > -1) {
        _url += "&" + urlPara;
      } else {
        _url += "?" + urlPara;
      }
    }

    return this.AppendTimeStampUrl(_url);
  },
  RedirectToLogin: function RedirectToLogin() {
    var url = BaseUtility.GetRootPath() + "/PlatForm/LoginView.do";
    window.parent.parent.location.href = url;
  },
  AppendTimeStampUrl: function AppendTimeStampUrl(url) {
    if (url.indexOf("timestamp") > "0") {
      return url;
    }

    var getTimestamp = new Date().getTime();

    if (url.indexOf("?") > -1) {
      url = url + "&timestamp=" + getTimestamp;
    } else {
      url = url + "?timestamp=" + getTimestamp;
    }

    return url;
  },
  GetUrlParaValue: function GetUrlParaValue(paraName) {
    return this.GetUrlParaValueByString(paraName, window.location.search);
  },
  GetUrlOPParaValue: function GetUrlOPParaValue() {
    return this.GetUrlParaValue("op");
  },
  GetUrlParaValueByString: function GetUrlParaValueByString(paraName, urlString) {
    var reg = new RegExp("(^|&)" + paraName + "=([^&]*)(&|$)");
    var r = urlString.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return "";
  },
  CopyValueClipboard: function CopyValueClipboard(value) {
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

    transfer.value = value;
    transfer.focus();
    transfer.select();
    document.execCommand('copy');
  },
  SetSystemFavicon: function SetSystemFavicon() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = BaseUtility.GetRootPath() + '/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
  },
  SetSystemTitle: function SetSystemTitle() {
    document.title = JBuild4DCYaml.GetClientSystemTitle();
  },
  SetSystemCaption: function SetSystemCaption() {
    $("#systemCaption").text(JBuild4DCYaml.GetClientSystemCaption());
  },
  IsFunction: function IsFunction(func) {
    if (typeof func == "function") {
      return true;
    }

    return false;
  },
  GetElemAllAttr: function GetElemAllAttr($elem) {
    var attrs = {};
    $elem.each(function () {
      $.each(this.attributes, function () {
        if (this.specified) {
          attrs[this.name] = this.value;
        }
      });
    });
    return attrs;
  },
  GetViewOperationName: function GetViewOperationName() {
    return "view";
  },
  IsViewOperation: function IsViewOperation(operationType) {
    return operationType && operationType == this.GetViewOperationName();
  },
  GetAddOperationName: function GetAddOperationName() {
    return "add";
  },
  IsAddOperation: function IsAddOperation(operationType) {
    return operationType && operationType == this.GetAddOperationName();
  },
  GetUpdateOperationName: function GetUpdateOperationName() {
    return "update";
  },
  IsUpdateOperation: function IsUpdateOperation(operationType) {
    return operationType && operationType == this.GetUpdateOperationName();
  },
  GetDeleteOperationName: function GetDeleteOperationName() {
    return "delete";
  },
  IsDeleteOperation: function IsDeleteOperation(operationType) {
    return operationType && operationType == this.GetDeleteOperationName();
  },
  IsAddOperationByUrl: function IsAddOperationByUrl() {
    if (this.GetUrlParaValue("op")) {
      if (this.GetUrlParaValue("op") == this.GetAddOperationName()) {
        return true;
      }
    }

    return false;
  },
  IsUpdateOperationByUrl: function IsUpdateOperationByUrl() {
    if (this.GetUrlParaValue("op")) {
      if (this.GetUrlParaValue("op") == this.GetUpdateOperationName()) {
        return true;
      }
    }

    return false;
  },
  IsViewOperationByUrl: function IsViewOperationByUrl() {
    if (this.GetUrlParaValue("op")) {
      if (this.GetUrlParaValue("op") == this.GetViewOperationName()) {
        return true;
      }
    }

    return false;
  },
  ThrowMessage: function ThrowMessage(message) {
    DialogUtility.AlertText(message);
    throw message;
  }
};
"use strict";

var BrowserInfoUtility = {
  BrowserAppName: function BrowserAppName() {
    if (navigator.userAgent.indexOf("Firefox") > 0) {
      return "Firefox";
    } else if (navigator.userAgent.indexOf("MSIE") > 0) {
      return "IE";
    } else if (navigator.userAgent.indexOf("Chrome") > 0) {
      return "Chrome";
    }
  },
  IsIE: function IsIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) return true;else return false;
  },
  IsIE6: function IsIE6() {
    return navigator.userAgent.indexOf("MSIE 6.0") > 0;
  },
  IsIE7: function IsIE7() {
    return navigator.userAgent.indexOf("MSIE 7.0") > 0;
  },
  IsIE8: function IsIE8() {
    return navigator.userAgent.indexOf("MSIE 8.0") > 0;
  },
  IsIE8X64: function IsIE8X64() {
    if (navigator.userAgent.indexOf("MSIE 8.0") > 0) {
      return navigator.userAgent.indexOf("x64") > 0;
    }

    return false;
  },
  IsIE9: function IsIE9() {
    return navigator.userAgent.indexOf("MSIE 9.0") > 0;
  },
  IsIE9X64: function IsIE9X64() {
    if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
      return navigator.userAgent.indexOf("x64") > 0;
    }

    return false;
  },
  IsIE10: function IsIE10() {
    return navigator.userAgent.indexOf("MSIE 10.0") > 0;
  },
  IsIE10X64: function IsIE10X64() {
    if (navigator.userAgent.indexOf("MSIE 10.0") > 0) {
      return navigator.userAgent.indexOf("x64") > 0;
    }

    return false;
  },
  IEDocumentMode: function IEDocumentMode() {
    return document.documentMode;
  },
  IsIE8DocumentMode: function IsIE8DocumentMode() {
    return this.IEDocumentMode() == 8;
  },
  IsFirefox: function IsFirefox() {
    return this.BrowserAppName() == "Firefox";
  },
  IsChrome: function IsChrome() {
    return this.BrowserAppName() == "Chrome";
  }
};
"use strict";

var CacheDataUtility = {};
"use strict";

var CookieUtility = {
  SetCookie1Day: function SetCookie1Day(name, value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  },
  SetCookie1Month: function SetCookie1Month(name, value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  },
  SetCookie1Year: function SetCookie1Year(name, value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 365 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  },
  GetCookie: function GetCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;
  },
  DelCookie: function DelCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
  }
};
"use strict";

var DateUtility = {
  DateFormat: function DateFormat(myDate, split) {
    alert("DateUtility.GetCurrentDataString 已停用");
  },
  ConvertFromString: function ConvertFromString(dateString) {
    var date = new Date(dateString);
    return date;
  },
  Format: function Format(myDate, formatString) {
    var o = {
      "M+": myDate.getMonth() + 1,
      "d+": myDate.getDate(),
      "h+": myDate.getHours(),
      "m+": myDate.getMinutes(),
      "s+": myDate.getSeconds(),
      "q+": Math.floor((myDate.getMonth() + 3) / 3),
      "S": myDate.getMilliseconds()
    };
    if (/(y+)/.test(formatString)) formatString = formatString.replace(RegExp.$1, (myDate.getFullYear() + "").substr(4 - RegExp.$1.length));

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(formatString)) formatString = formatString.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }

    return formatString;
  },
  FormatCurrentDate: function FormatCurrentDate(formatString) {
    var myDate = new Date();
    return this.Format(myDate, formatString);
  },
  GetCurrentDate: function GetCurrentDate() {
    return new Date();
  },
  GetCurrentTimeStamp: function GetCurrentTimeStamp() {
    return new Date().getTime();
  },
  GetCurrentTimeString: function GetCurrentTimeString() {
    return this.FormatCurrentDate("yyyy-MM-dd hh:mm:ss");
  },
  GetCurrentDateString: function GetCurrentDateString() {
    return this.FormatCurrentDate("yyyy-MM-dd");
  },
  DateFormatByTimeStamp: function DateFormatByTimeStamp(timeStamp, formatString) {
    var date = new Date(timeStamp);
    return this.Format(date, formatString);
  }
};
"use strict";

var DetailPageUtility = {
  IViewPageToViewStatus: function IViewPageToViewStatus() {
    return;
    window.setTimeout(function () {
      $("input").each(function () {
        $(this).hide();
        var val = $(this).val();
        $(this).after($("<label />").text(val));
      });
      $(".ivu-date-picker-editor").find(".ivu-icon").hide();
      $(".ivu-radio").hide();
      $(".ivu-radio-group-item").hide();
      $(".ivu-radio-wrapper-checked").show();
      $(".ivu-radio-wrapper-checked").find("span").hide();
      $("textarea").each(function () {
        $(this).hide();
        var val = $(this).val();
        $(this).after($("<label />").text(val));
      });
    }, 100);
  },
  OverrideObjectValue: function OverrideObjectValue(sourceObject, dataObject) {
    for (var key in sourceObject) {
      if (dataObject[key] != undefined && dataObject[key] != null && dataObject[key] != "") {
        sourceObject[key] = dataObject[key];
      }
    }
  },
  OverrideObjectValueFull: function OverrideObjectValueFull(sourceObject, dataObject) {
    for (var key in sourceObject) {
      sourceObject[key] = dataObject[key];
    }
  },
  BindFormData: function BindFormData(interfaceUrl, vueFormData, recordId, op, befFunc, afFunc, caller) {
    AjaxUtility.Post(interfaceUrl, {
      recordId: recordId,
      op: op
    }, function (result) {
      if (result.success) {
        if (typeof befFunc == "function") {
          befFunc(result);
        }

        DetailPageUtility.OverrideObjectValue(vueFormData, result.data);

        if (typeof afFunc == "function") {
          afFunc(result);
        }

        if (op == "view") {
          DetailPageUtility.IViewPageToViewStatus();
        }
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
      }
    }, caller);
  }
};
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var DialogUtility = {
  DialogAlertId: "DefaultDialogAlertUtility01",
  DialogAlertErrorId: "DefaultDialogAlertErrorUtility01",
  DialogPromptId: "DefaultDialogPromptUtility01",
  DialogLoadingId: "DefaultDialogLoading01",
  DialogId: "DefaultDialogUtility01",
  DialogId02: "DefaultDialogUtility02",
  DialogId03: "DefaultDialogUtility03",
  DialogId04: "DefaultDialogUtility04",
  DialogId05: "DefaultDialogUtility05",
  DialogId06: "DefaultDialogUtility06",
  DialogId07: "DefaultDialogUtility07",
  DialogId08: "DefaultDialogUtility08",
  DialogId09: "DefaultDialogUtility09",
  DialogId10: "DefaultDialogUtility10",
  DialogNewWindowId: "DialogNewWindowId01",
  DialogWorkFlowFormId: "DefaultDialogWorkFlowFormIdUtility01",
  _GetElem: function _GetElem(dialogId) {
    return $("#" + dialogId);
  },
  _CreateDialogElem: function _CreateDialogElem(docObj, dialogId) {
    if (this._GetElem(dialogId).length == 0) {
      var dialogEle = $("<div id=" + dialogId + " title='系统提示' style='display:none'>\
                    </div>");
      $(docObj.body).append(dialogEle);
      return dialogEle;
    } else {
      return this._GetElem(dialogId);
    }
  },
  _CreateAlertLoadingMsgElement: function _CreateAlertLoadingMsgElement(docObj, dialogId) {
    if (this._GetElem(dialogId).length == 0) {
      var dialogEle = $("<div id=" + dialogId + " title='系统提示' style='display:none'>\
                               <div class=\"lds-ring\"><div></div><div></div><div></div><div></div></div>\
                               <div class='alert-loading-txt-outer'><div class='alert-loading-txt'></div></div>\
                           </div>");
      $(docObj.body).append(dialogEle);
      return dialogEle;
    } else {
      return this._GetElem(dialogId);
    }
  },
  _CreateIframeDialogElement: function _CreateIframeDialogElement(docObj, dialogId, url) {
    var dialogEle = $("<div id=" + dialogId + " title='Basic dialog'>\
                        <iframe name='dialogIframe' width='100%' height='98%' frameborder='0'>\
                        </iframe>\
                    </div>");
    $(docObj.body).append(dialogEle);
    return dialogEle;
  },
  _TestDialogElemIsExist: function _TestDialogElemIsExist(dialogId) {
    if (this._GetElem(dialogId).length > 0) {
      return true;
    }

    return false;
  },
  _TestRunEnable: function _TestRunEnable() {
    return true;
  },
  RemoveDialogRemainingElem: function RemoveDialogRemainingElem(dialogId) {
    $("[aria-describedby='" + dialogId + "']").remove();
  },
  AlertError: function AlertError(openerWindow, dialogId, config, htmlMsg, sFunc, timeClosure) {
    var defaultConfig = {
      height: "auto",
      width: "auto",
      title: "错误提示"
    };
    defaultConfig = $.extend(true, {}, defaultConfig, config);
    this.Alert(openerWindow, dialogId, defaultConfig, htmlMsg, sFunc, timeClosure);
  },
  AlertText: function AlertText(text, caller, timeClosure) {
    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, text, null, caller, timeClosure);
  },
  Alert: function Alert(openerWindow, dialogId, config, htmlMsg, sFunc, caller, timeClosure) {
    var htmlElem = this._CreateDialogElem(openerWindow.document.body, dialogId);

    var defaultConfig = {
      height: 200,
      width: 300,
      title: "系统提示",
      show: true,
      modal: true,
      buttons: {
        "关闭": function _() {
          $(htmlElem).dialog("close");
        }
      },
      open: function open() {},
      close: function close() {
        if (sFunc) {
          if (caller) {
            sFunc.call(caller);
          } else {
            sFunc();
          }
        }
      },
      hide: {
        effect: "fade",
        duration: 500
      }
    };
    defaultConfig = $.extend(true, {}, defaultConfig, config);
    $(htmlElem).html(htmlMsg);
    $(htmlElem).dialog(defaultConfig);

    if (timeClosure) {
      window.setTimeout(function () {
        DialogUtility.CloseDialog(dialogId);
      }, 1000 * timeClosure);
    }
  },
  AlertJsonCode: function AlertJsonCode(json, timeClosure) {
    if (_typeof(json) == "object") {
      json = JsonUtility.JsonToStringFormat(json);
    }

    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'json-number';

      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }

      return '<span class="' + cls + '">' + match + '</span>';
    });

    var htmlElem = this._CreateDialogElem(window.document.body, this.DialogAlertId);

    var title = "系统提示";

    if (timeClosure) {
      title += " [ " + timeClosure + "秒后自动关闭 ]";
    }

    var defaultConfig = {
      height: 600,
      width: 900,
      title: title,
      show: true,
      modal: true,
      buttons: {
        "关闭": function _() {
          $(htmlElem).dialog("close");
        },
        "复制并关闭": function _() {
          $(htmlElem).dialog("close");
          BaseUtility.CopyValueClipboard($(".json-pre").text());
        }
      },
      open: function open() {},
      close: function close() {},
      hide: {
        effect: "fade",
        duration: 500
      }
    };
    $(htmlElem).html("<div id='pscontainer' style='width: 100%;height: 100%;overflow: auto;position: relative;'><pre class='json-pre'>" + json + "</pre></div>");
    $(htmlElem).dialog(defaultConfig);

    if (timeClosure) {
      window.setTimeout(function () {
        DialogUtility.CloseDialog(DialogUtility.DialogAlertId);
      }, 1000 * timeClosure);
    }

    var ps = new PerfectScrollbar('#pscontainer');
  },
  ShowHTML: function ShowHTML(openerWindow, dialogId, config, htmlMsg, close_after_event, params) {
    var htmlElem = this._CreateDialogElem(openerWindow.document.body, dialogId);

    var defaultConfig = {
      height: 200,
      width: 300,
      title: "系统提示",
      show: true,
      modal: true,
      close: function close(event, ui) {
        try {
          if (typeof close_after_event == "function") {
            close_after_event(params);
          }
        } catch (e) {}
      }
    };
    var defaultConfig = $.extend(true, {}, defaultConfig, config);
    $(htmlElem).html(htmlMsg);
    return $(htmlElem).dialog(defaultConfig);
  },
  ShowByElemId: function ShowByElemId(elemId, config, close_after_event, params, caller) {
    var defaultConfig = {
      height: 200,
      width: 300,
      title: "系统提示",
      show: true,
      modal: true,
      close: function close(event, ui) {
        try {
          if (typeof close_after_event == "function") {
            close_after_event(params);
          }
        } catch (e) {}
      }
    };
    var defaultConfig = $.extend(true, {}, defaultConfig, config);
    return $("#" + elemId).dialog(defaultConfig);
  },
  CloseByElemId: function CloseByElemId(elemId) {
    return $("#" + elemId).dialog("close");
  },
  DestroyByElemId: function DestroyByElemId(elemId) {
    return $("#" + elemId).dialog("destroy");
  },
  AlertLoading: function AlertLoading(openerWindow, dialogId, config, htmlMsg) {
    var htmlElem = this._CreateAlertLoadingMsgElement(openerWindow.document.body, dialogId);

    var defaultConfig = {
      height: 140,
      width: 350,
      title: "系统提示",
      show: true,
      modal: true
    };
    var defaultConfig = $.extend(true, {}, defaultConfig, config);
    $(htmlElem).find(".alert-loading-txt").html(htmlMsg ? htmlMsg : "系统处理中,请稍候。");
    $(htmlElem).dialog(defaultConfig);
  },
  Confirm: function Confirm(openerWindow, htmlMsg, okFn, caller) {
    this.ConfirmConfig(openerWindow, htmlMsg, null, okFn, caller);
  },
  ConfirmConfig: function ConfirmConfig(openerWindow, htmlMsg, config, okFn, caller) {
    var htmlElem = this._CreateDialogElem(openerWindow.document.body, "AlertConfirmMsg");

    var paras = null;
    var defaultConfig = {
      okfunc: function okfunc(paras) {
        if (okFn != undefined) {
          if (caller) {
            okFn.call(caller);
          } else {
            return okFn();
          }
        } else {
          openerWindow.close();
        }
      },
      cancelfunc: function cancelfunc(paras) {},
      validatefunc: function validatefunc(paras) {
        return true;
      },
      closeafterfunc: true,
      height: 200,
      width: 300,
      title: "系统提示",
      show: true,
      modal: true,
      buttons: {
        "确认": function _() {
          if (defaultConfig.validatefunc(paras)) {
            var r = defaultConfig.okfunc(paras);
            r = r == null ? true : r;

            if (r && defaultConfig.closeafterfunc) {
              $(htmlElem).dialog("close");
            }
          }
        },
        "取消": function _() {
          defaultConfig.cancelfunc(paras);

          if (defaultConfig.closeafterfunc) {
            $(htmlElem).dialog("close");
          }
        }
      }
    };

    if (config && config.buttons) {
      defaultConfig.buttons = {};
    }

    var defaultConfig = $.extend(true, {}, defaultConfig, config);
    $(htmlElem).html(htmlMsg);
    $(htmlElem).dialog(defaultConfig);
    paras = {
      "ElementObj": htmlElem
    };
  },
  Prompt: function Prompt(openerWindow, config, dialogId, labelMsg, okFunc) {
    var htmlElem = this._CreateDialogElem(openerWindow.document.body, dialogId);

    var paras = null;
    var textArea = $("<textarea />");
    var defaultConfig = {
      height: 200,
      width: 300,
      title: "",
      show: true,
      modal: true,
      buttons: {
        "确认": function _() {
          if (typeof okFunc == "function") {
            var inputText = textArea.val();
            okFunc(inputText);
          }

          $(htmlElem).dialog("close");
        },
        "取消": function _() {
          $(htmlElem).dialog("close");
        }
      }
    };
    var defaultConfig = $.extend(true, {}, defaultConfig, config);
    $(textArea).css("height", defaultConfig.height - 130).css("width", "100%");
    var htmlContent = $("<div><div style='width: 100%'>" + labelMsg + "：</div></div>").append(textArea);
    $(htmlElem).html(htmlContent);
    $(htmlElem).dialog(defaultConfig);
  },
  DialogElem: function DialogElem(elemId, config) {
    $("#" + elemId).dialog(config);
  },
  DialogElemObj: function DialogElemObj(elemObj, config) {
    $(elemObj).dialog(config);
  },
  OpenIframeWindow: function OpenIframeWindow(openerwindow, dialogId, url, options, whtype) {
    var defaultoptions = {
      height: 410,
      width: 600,
      modal: true,
      title: "系统",
      close: function close(event, ui) {
        var autodialogId = $(this).attr("id");
        $(this).find("iframe").remove();
        $(this).dialog('close');
        $(this).dialog("destroy");
        $("#" + autodialogId).remove();

        if (BrowserInfoUtility.IsIE8DocumentMode()) {
          CollectGarbage();
        }

        if (typeof options.close_after_event == "function") {
          options.close_after_event();
        }

        try {
          if ($("#Forfocus").length > 0) {
            $("#Forfocus")[0].focus();
          }
        } catch (e) {}
      }
    };

    if (whtype == 1) {
      defaultoptions = $.extend(true, {}, defaultoptions, {
        height: 680,
        width: 980
      });
    } else if (whtype == 2) {
      defaultoptions = $.extend(true, {}, defaultoptions, {
        height: 600,
        width: 800
      });
    } else if (whtype == 4) {
      defaultoptions = $.extend(true, {}, defaultoptions, {
        height: 380,
        width: 480
      });
    } else if (whtype == 5) {
      defaultoptions = $.extend(true, {}, defaultoptions, {
        height: 180,
        width: 300
      });
    }

    if (options.width == 0) {
      options.width = PageStyleUtility.GetPageWidth() - 20;
    }

    if (options.height == 0) {
      options.height = PageStyleUtility.GetPageHeight() - 10;
    }

    defaultoptions = $.extend(true, {}, defaultoptions, options);
    var autodialogId = dialogId;

    var dialogEle = this._CreateIframeDialogElement(openerwindow.document, autodialogId, url);

    var dialogObj = $(dialogEle).dialog(defaultoptions);
    var $iframeobj = $(dialogEle).find("iframe");
    $iframeobj.on("load", function () {
      if (StringUtility.IsSameDomain(window.location.href, url)) {
        this.contentWindow.FrameWindowId = autodialogId;
        this.contentWindow.OpenerWindowObj = openerwindow;
        this.contentWindow.IsOpenForFrame = true;
      } else {
        console.log("跨域Iframe,无法设置属性!");
      }
    });
    $iframeobj.attr("src", url);
    return dialogObj;
  },
  CloseOpenIframeWindow: function CloseOpenIframeWindow(openerwindow, dialogId) {
    openerwindow.OpenerWindowObj.DialogUtility.CloseDialog(dialogId);
  },
  CloseDialogElem: function CloseDialogElem(dialogElem) {
    $(dialogElem).find("iframe").remove();
    $(dialogElem).dialog("close");

    try {
      if ($("#Forfocus").length > 0) {
        $("#Forfocus")[0].focus();
      }
    } catch (e) {}
  },
  CloseDialog: function CloseDialog(dialogId) {
    this.CloseDialogElem(this._GetElem(dialogId));
  },
  OpenNewWindow: function OpenNewWindow(openerwindow, dialogId, url, options, whtype) {
    var width = 0;
    var height = 0;

    if (options) {
      width = options.width;
      height = options.height;
    }

    var left = parseInt((screen.availWidth - width) / 2).toString();
    var top = parseInt((screen.availHeight - height) / 2).toString();

    if (width.toString() == "0" && height.toString() == "0") {
      width = window.screen.availWidth - 30;
      height = window.screen.availHeight - 60;
      left = "0";
      top = "0";
    }

    var winHandle = window.open(url, "", "scrollbars=no,toolbar=no,menubar=no,resizable=yes,center=yes,help=no, status=yes,top= " + top + "px,left=" + left + "px,width=" + width + "px,height=" + height + "px");

    if (winHandle == null) {
      alert("请解除浏览器对本系统弹出窗口的阻止设置！");
    }
  },
  OpenNewTabWindow: function OpenNewTabWindow(url) {
    var link = $("<a href='" + url + "' style='position:absolute;top: -100px;width: 0px;height: 0px' target='_blank' rel='opener'></a>");
    $(window.document.body).append(link);
    link[0].click();
  },
  _TryGetParentWindow: function _TryGetParentWindow(win) {
    if (win.parent != null) {
      return win.parent;
    }

    return null;
  },
  _Frame_TryGetFrameWindowObj: function _Frame_TryGetFrameWindowObj(win, tryfindtime, currenttryfindtime) {
    if (tryfindtime > currenttryfindtime) {
      var istopFramepage = false;
      currenttryfindtime++;

      try {
        istopFramepage = win.IsTopFramePage;

        if (istopFramepage) {
          return win;
        } else {
          return this._Frame_TryGetFrameWindowObj(this._TryGetParentWindow(win), tryfindtime, currenttryfindtime);
        }
      } catch (e) {
        return this._Frame_TryGetFrameWindowObj(this._TryGetParentWindow(win), tryfindtime, currenttryfindtime);
      }
    }

    return null;
  },
  _OpenWindowInFramePage: function _OpenWindowInFramePage(openerwindow, dialogId, url, options, whtype) {
    if (StringUtility.IsNullOrEmpty(dialogId)) {
      alert("dialogId不能为空");
      return;
    }

    url = BaseUtility.AppendTimeStampUrl(url);
    var autodialogId = "FrameDialogEle" + dialogId;

    if ($(this.FramePageRef.document).find("#" + autodialogId).length == 0) {
      var dialogEle = this._CreateIframeDialogElement(this.FramePageRef.document, autodialogId, url);

      var defaultoptions = {
        height: 400,
        width: 600,
        modal: true,
        title: "系统",
        close: function close(event, ui) {
          var autodialogId = $(this).attr("id");
          $(this).find("iframe").remove();
          $(this).dialog('close');
          $(this).dialog("destroy");
          $("#" + autodialogId).remove();

          if (BrowserInfoUtility.IsIE8DocumentMode()) {
            CollectGarbage();
          }

          if (typeof options.close_after_event == "function") {
            options.close_after_event();
          }
        }
      };

      if (whtype == 0) {
        options.width = PageStyleUtility.GetPageWidth() - 20;
        options.height = PageStyleUtility.GetPageHeight() - 180;
      } else if (whtype == 1) {
        defaultoptions = $.extend(true, {}, defaultoptions, {
          height: 610,
          width: 980
        });
      } else if (whtype == 2) {
        defaultoptions = $.extend(true, {}, defaultoptions, {
          height: 600,
          width: 800
        });
      } else if (whtype == 4) {
        defaultoptions = $.extend(true, {}, defaultoptions, {
          height: 380,
          width: 480
        });
      } else if (whtype == 5) {
        defaultoptions = $.extend(true, {}, defaultoptions, {
          height: 180,
          width: 300
        });
      }

      if (options.width == 0) {
        options.width = PageStyleUtility.GetPageWidth() - 20;
      }

      if (options.height == 0) {
        options.height = PageStyleUtility.GetPageHeight() - 180;
      }

      defaultoptions = $.extend(true, {}, defaultoptions, options);
      $(dialogEle).dialog(defaultoptions);
      $(".ui-widget-overlay").css("zIndex", "2000");
      $(".ui-dialog").css("zIndex", "2001");
      var $iframeobj = $(dialogEle).find("iframe");
      $iframeobj.on("load", function () {
        if (StringUtility.IsSameDomain(window.location.href, url)) {
          this.contentWindow.FrameWindowId = autodialogId;
          this.contentWindow.OpenerWindowObj = openerwindow;
          this.contentWindow.IsOpenForFrame = true;
        } else {
          console.log("跨域Iframe,无法设置属性!");
        }
      });
      $iframeobj.attr("src", url);
    } else {
      $("#" + autodialogId).dialog("moveToTop");
    }
  },
  _Frame_FramePageCloseDialog: function _Frame_FramePageCloseDialog(dialogId) {
    $("#" + dialogId).dialog("close");
  },
  Frame_TryGetFrameWindowObj: function Frame_TryGetFrameWindowObj() {
    var tryfindtime = 5;
    var currenttryfindtime = 1;
    return this._Frame_TryGetFrameWindowObj(window, tryfindtime, currenttryfindtime);
  },
  Frame_Alert: function Frame_Alert() {},
  Frame_Confirm: function Frame_Confirm() {},
  Frame_OpenIframeWindow: function Frame_OpenIframeWindow(openerwindow, dialogId, url, options, whtype, notFrameOpenInCurr) {
    if (url == "") {
      alert("url不能为空字符串!");
      return;
    }

    if (!notFrameOpenInCurr) {
      notFrameOpenInCurr = false;
    }

    var wrwin = this.Frame_TryGetFrameWindowObj();
    this.FramePageRef = wrwin;

    if (wrwin != null) {
      this.FramePageRef.DialogUtility.FramePageRef = wrwin;

      this.FramePageRef.DialogUtility._OpenWindowInFramePage(openerwindow, dialogId, url, options, whtype);
    } else {
      if (notFrameOpenInCurr) {
        this.OpenIframeWindow(openerwindow, dialogId, url, options, whtype);
      } else {
        alert("找不到FramePage!!");
      }
    }
  },
  Frame_CloseDialog: function Frame_CloseDialog(openerWindow) {
    var wrwin = this.Frame_TryGetFrameWindowObj();
    var openerwin = openerWindow.OpenerWindowObj;
    var autodialogId = openerWindow.FrameWindowId;

    wrwin.DialogUtility._Frame_FramePageCloseDialog(autodialogId);
  },
  ToastMessage: function ToastMessage(sender, message) {
    sender.$Message['success']({
      background: true,
      content: message
    });
  },
  ToastErrorMessage: function ToastErrorMessage(sender, message) {
    sender.$Message['error']({
      background: true,
      content: message
    });
  },
  ToastWarningMessage: function ToastWarningMessage(sender, message) {
    sender.$Message['warning']({
      background: true,
      content: message
    });
  },
  ToastInfoMessage: function ToastInfoMessage(sender, message) {
    sender.$Message['info']({
      background: true,
      content: message
    });
  },
  ShowSelectImageClassDialog: function ShowSelectImageClassDialog(options, sureFunc, cancelFunc, fixPath) {
    var defaultOptions = {
      height: 540,
      width: 800,
      modal: true,
      title: "选择图标",
      close: function close(event, ui) {}
    };
    defaultOptions = $.extend(true, {}, defaultOptions, options);
    var viewUrl = "HTML/SelectDialog/SelectLineAwesomeClass.html";

    if (fixPath) {
      viewUrl = fixPath + viewUrl;
    }

    var url = BaseUtility.BuildAction(viewUrl, {
      sureFunc: sureFunc,
      cancelFunc: cancelFunc
    });
    this.OpenIframeWindow(window, "ShowSelectImageClassDialog", url, defaultOptions, 2);
  }
};
"use strict";

var DictionaryUtility = {
  _GroupValueListJsonToSimpleJson: null,
  GroupValueListJsonToSimpleJson: function GroupValueListJsonToSimpleJson(sourceDictionaryJson) {
    if (this._GroupValueListJsonToSimpleJson == null) {
      if (sourceDictionaryJson != null) {
        var result = {};

        for (var groupValue in sourceDictionaryJson) {
          result[groupValue] = {};

          for (var i = 0; i < sourceDictionaryJson[groupValue].length; i++) {
            result[groupValue][sourceDictionaryJson[groupValue][i].dictValue] = sourceDictionaryJson[groupValue][i].dictText;
          }
        }

        this._GroupValueListJsonToSimpleJson = result;
      }
    }

    return this._GroupValueListJsonToSimpleJson;
  }
};
"use strict";

var HardDiskUtility = {
  ByteConvert: function ByteConvert(bytes) {
    if (isNaN(bytes)) {
      return '';
    }

    var symbols = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var exp = Math.floor(Math.log(bytes) / Math.log(2));

    if (exp < 1) {
      exp = 0;
    }

    var i = Math.floor(exp / 10);
    bytes = bytes / Math.pow(2, 10 * i);

    if (bytes.toString().length > bytes.toFixed(2).toString().length) {
      bytes = bytes.toFixed(2);
    }

    return bytes + ' ' + symbols[i];
  }
};
"use strict";

var console = console || {
  log: function log() {},
  warn: function warn() {},
  error: function error() {}
};

function DateExtend_DateFormat(date, fmt) {
  if (null == date || undefined == date) return '';
  var o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "S": date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  }

  return fmt;
}

Date.prototype.toJSON = function () {
  return DateExtend_DateFormat(this, 'yyyy-MM-dd mm:hh:ss');
};

if (!Object.create) {
  Object.create = function () {
    alert("Extend Object.create");

    function F() {}

    return function (o) {
      if (arguments.length !== 1) {
        throw new Error('Object.create implementation only accepts one parameter.');
      }

      F.prototype = o;
      return new F();
    };
  }();
}

$.fn.outerHTML = function () {
  return !this.length ? this : this[0].outerHTML || function (el) {
    var div = document.createElement('div');
    div.appendChild(el.cloneNode(true));
    var contents = div.innerHTML;
    div = null;
    alert(contents);
    return contents;
  }(this[0]);
};

function refCssLink(href) {
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('link');
  style.type = 'text/css';
  style.rel = 'stylesheet';
  style.href = href;
  head.appendChild(style);
  return style.sheet || style.styleSheet;
}
"use strict";

var JBuild4DCYaml = {
  _clientClientSystemTitle: null,
  _clientClientSystemCaption: null,
  GetClientSystemTitle: function GetClientSystemTitle() {
    var storeKey = "JBuild4DCYaml._clientClientSystemTitle";

    if (LocalStorageUtility.getItemInSessionStorage(storeKey)) {
      return LocalStorageUtility.getItemInSessionStorage(storeKey);
    }

    if (!this._clientClientSystemTitle) {
      if (!window.parent.JBuild4DCYaml._clientClientSystemTitle) {
        AjaxUtility.GetSync("/Rest/JBuild4DCYaml/GetClientSystemTitle", {}, function (result) {
          if (result.success) {
            this._clientClientSystemTitle = result.data;
            LocalStorageUtility.setItemInSessionStorage(storeKey, this._clientClientSystemTitle);
          }
        }, this);
      } else {
        this._clientClientSystemTitle = window.parent.JBuild4DCYaml._clientClientSystemTitle;
      }
    }

    return this._clientClientSystemTitle;
  },
  GetClientSystemCaption: function GetClientSystemCaption() {
    AjaxUtility.GetSync("/Rest/JBuild4DCYaml/GetClientSystemCaption", {}, function (result) {
      if (result.success) {
        this._clientClientSystemCaption = result.data;
      }
    }, this);
    return this._clientClientSystemCaption;
  }
};
"use strict";

var JsonUtility = {
  ParseArrayJsonToTreeJson: function ParseArrayJsonToTreeJson(config, sourceArray, rootId) {
    var _config = {
      KeyField: "",
      RelationField: "",
      ChildFieldName: ""
    };

    function FindJsonById(keyField, id) {
      for (var i = 0; i < sourceArray.length; i++) {
        if (sourceArray[i][keyField] == id) {
          return sourceArray[i];
        }
      }

      alert("ParseArrayJsonToTreeJson.FindJsonById:在sourceArray中找不到指定Id的记录");
    }

    function FindChildJson(relationField, pid) {
      var result = [];

      for (var i = 0; i < sourceArray.length; i++) {
        if (sourceArray[i][relationField] == pid) {
          result.push(sourceArray[i]);
        }
      }

      return result;
    }

    function FindChildNodeAndParse(pid, result) {
      var childjsons = FindChildJson(config.RelationField, pid);

      if (childjsons.length > 0) {
        if (result[config.ChildFieldName] == undefined) {
          result[config.ChildFieldName] = [];
        }

        for (var i = 0; i < childjsons.length; i++) {
          var toObj = {};
          toObj = JsonUtility.SimpleCloneAttr(toObj, childjsons[i]);
          result[config.ChildFieldName].push(toObj);
          var id = toObj[config.KeyField];
          FindChildNodeAndParse(id, toObj);
        }
      }
    }

    var result = {};
    var rootJson = FindJsonById(config.KeyField, rootId);
    result = this.SimpleCloneAttr(result, rootJson);
    FindChildNodeAndParse(rootId, result);
    return result;
  },
  ResolveSimpleArrayJsonToTreeJson: function ResolveSimpleArrayJsonToTreeJson(config, sourceJson, rootNodeId) {
    alert("JsonUtility.ResolveSimpleArrayJsonToTreeJson 已停用");
  },
  SimpleCloneAttr: function SimpleCloneAttr(toObj, fromObj) {
    for (var attr in fromObj) {
      toObj[attr] = fromObj[attr];
    }

    return toObj;
  },
  CloneArraySimple: function CloneArraySimple(array) {
    var result = [];

    for (var i = 0; i < array.length; i++) {
      result.push(this.CloneSimple(array[i]));
    }

    return result;
  },
  CloneSimple: function CloneSimple(source) {
    var newJson = jQuery.extend(true, {}, source);
    return newJson;
  },
  CloneStringify: function CloneStringify(source) {
    var newJson = this.JsonToString(source);
    return this.StringToJson(newJson);
  },
  CloneObjectProp: function CloneObjectProp(source, propCallBack) {
    var result = {};
    var cloneSource = this.CloneStringify(source);

    for (var key in cloneSource) {
      var sourcePropValue = cloneSource[key];
      var newPropValue;

      if (typeof propCallBack == "function") {
        newPropValue = propCallBack(key, sourcePropValue);

        if (!newPropValue) {
          newPropValue = sourcePropValue;
        }
      }

      result[key] = newPropValue;
    }

    return result;
  },
  JsonToString: function JsonToString(obj) {
    return JSON.stringify(obj);
  },
  JsonToStringFormat: function JsonToStringFormat(obj) {
    return JSON.stringify(obj, null, 2);
  },
  StringToJson: function StringToJson(str) {
    return eval("(" + str + ")");
  }
};
"use strict";

var ListPageUtility = {
  DefaultListHeight: function DefaultListHeight() {
    if (PageStyleUtility.GetPageHeight() > 780) {
      return 678;
    } else if (PageStyleUtility.GetPageHeight() > 680) {
      return 578;
    } else {
      return 378;
    }
  },
  DefaultListHeight_50: function DefaultListHeight_50() {
    return this.DefaultListHeight() - 50;
  },
  DefaultListHeight_80: function DefaultListHeight_80() {
    return this.DefaultListHeight() - 80;
  },
  DefaultListHeight_100: function DefaultListHeight_100() {
    return this.DefaultListHeight() - 100;
  },
  GetGeneralPageHeight: function GetGeneralPageHeight(fixHeight) {
    var pageHeight = jQuery(document).height();

    if ($("#list-simple-search-wrap").length > 0) {
      pageHeight = pageHeight - $("#list-simple-search-wrap").outerHeight() + fixHeight - $("#list-button-wrap").outerHeight() - $("#list-pager-wrap").outerHeight() - 30;
    } else {
      pageHeight = pageHeight - ($("#list-button-wrap").outerHeight() ? $("#list-button-wrap").outerHeight() : 0) + fixHeight - ($("#list-pager-wrap").length > 0 ? $("#list-pager-wrap").outerHeight() : 0) - 30;
    }

    return pageHeight;
  },
  GetFixHeight: function GetFixHeight() {
    return -70;
  },
  IViewTableRenderer: {
    ToDateYYYY_MM_DD: function ToDateYYYY_MM_DD(h, datetime) {
      var date = new Date(datetime);
      var dateStr = DateUtility.Format(date, 'yyyy-MM-dd');
      return h('div', dateStr);
    },
    StringToDateYYYY_MM_DD: function StringToDateYYYY_MM_DD(h, datetime) {
      var dateStr = datetime.split(" ")[0];
      return h('div', dateStr);
    },
    ToStatusEnable: function ToStatusEnable(h, status) {
      if (status == 0) {
        return h('div', "禁用");
      } else if (status == 1) {
        return h('div', "启用");
      }
    },
    ToYesNoEnable: function ToYesNoEnable(h, status) {
      if (status == 0) {
        return h('div', "否");
      } else if (status == 1) {
        return h('div', "是");
      }
    },
    ToDictionaryText: function ToDictionaryText(h, dictionaryJson, groupValue, dictionaryValue) {
      var simpleDictionaryJson = DictionaryUtility.GroupValueListJsonToSimpleJson(dictionaryJson);

      if (dictionaryValue == null || dictionaryValue == "") {
        return h('div', "");
      }

      if (simpleDictionaryJson[groupValue] != undefined) {
        if (simpleDictionaryJson[groupValue]) {
          if (simpleDictionaryJson[groupValue][dictionaryValue]) {
            return h('div', simpleDictionaryJson[groupValue][dictionaryValue]);
          } else {
            return h('div', "找不到装换的TEXT");
          }
        } else {
          return h('div', "找不到装换的分组");
        }
      } else {
        return h('div', "找不到装换的分组");
      }
    }
  },
  IViewTableMareSureSelected: function IViewTableMareSureSelected(selectionRows) {
    if (selectionRows != null && selectionRows.length > 0) {
      return {
        then: function then(func) {
          func(selectionRows);
        }
      };
    } else {
      DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选中需要操作的行!", null);
      return {
        then: function then(func) {}
      };
    }
  },
  IViewTableMareSureSelectedOne: function IViewTableMareSureSelectedOne(selectionRows, caller) {
    if (selectionRows != null && selectionRows.length > 0 && selectionRows.length == 1) {
      return {
        then: function then(func) {
          if (caller) {
            func.call(caller, selectionRows);
          } else {
            func(selectionRows);
          }
        }
      };
    } else {
      DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选中需要操作的行，每次只能选中一行!", null);
      return {
        then: function then(func) {}
      };
    }
  },
  IViewChangeServerStatus: function IViewChangeServerStatus(url, selectionRows, idField, statusName, pageAppObj) {
    var idArray = new Array();

    for (var i = 0; i < selectionRows.length; i++) {
      idArray.push(selectionRows[i][idField]);
    }

    AjaxUtility.Post(url, {
      ids: idArray.join(";"),
      status: statusName
    }, function (result) {
      if (result.success) {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
        pageAppObj.reloadData();
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
      }
    }, pageAppObj);
  },
  IViewMoveFace: function IViewMoveFace(url, selectionRows, idField, type, pageAppObj) {
    this.IViewTableMareSureSelectedOne(selectionRows).then(function (selectionRows) {
      AjaxUtility.Post(url, {
        recordId: selectionRows[0][idField],
        type: type
      }, function (result) {
        if (result.success) {
          pageAppObj.reloadData();
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, pageAppObj);
    });
  },
  IViewCopyRowId: function IViewCopyRowId(selectionRows, idField, pageAppObj) {
    this.IViewTableMareSureSelectedOne(selectionRows).then(function (selectionRows) {
      var idValue = selectionRows[0][idField];
      BaseUtility.CopyValueClipboard(idValue);
      DialogUtility.ToastMessage(pageAppObj, "复制成功!");
    });
  },
  IViewChangeServerStatusFace: function IViewChangeServerStatusFace(url, selectionRows, idField, statusName, pageAppObj) {
    this.IViewTableMareSureSelected(selectionRows).then(function (selectionRows) {
      ListPageUtility.IViewChangeServerStatus(url, selectionRows, idField, statusName, pageAppObj);
    });
  },
  IViewTableDeleteRow: function IViewTableDeleteRow(url, recordId, pageAppObj) {
    DialogUtility.Confirm(window, "确认要删除当前记录吗？", function () {
      AjaxUtility.Delete(url, {
        recordId: recordId
      }, function (result) {
        if (result.success) {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
            pageAppObj.reloadData();
          }, pageAppObj);
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
        }
      }, pageAppObj);
    }, pageAppObj);
  },
  IViewTableBindDataBySearch: function IViewTableBindDataBySearch(_config) {
    var config = {
      url: "",
      pageNum: 1,
      pageSize: 12,
      searchCondition: null,
      pageAppObj: null,
      tableList: null,
      idField: "",
      autoSelectedOldRows: false,
      successFunc: null,
      loadDict: false,
      custParas: {},
      _expandedALL: false
    };
    config = $.extend(true, {}, config, _config);

    if (!config.tableList) {
      config.tableList = config.pageAppObj;
    }

    ;
    var sendData = {
      "pageNum": config.pageNum,
      "pageSize": config.pageSize,
      "searchCondition": SearchUtility.SerializationSearchCondition(config.searchCondition),
      "loadDict": config.loadDict
    };

    for (var key in config.custParas) {
      sendData[key] = config.custParas[key];
    }

    AjaxUtility.Post(config.url, sendData, function (result) {
      if (result.success) {
        if (typeof config.successFunc == "function") {
          config.successFunc.call(config.pageAppObj, result, config.pageAppObj);
        }

        config.tableList.tableData = new Array();
        config.tableList.tableData = result.data.list;
        config.tableList.pageTotal = result.data.total;

        if (config.tableList.tableData && config.tableList.tableData.length > 0) {
          for (var i = 0; i < config.tableList.tableData.length; i++) {
            if (config._expandedALL) {
              config.tableList.tableData[i]._expanded = true;
            }
          }
        }

        if (config.autoSelectedOldRows) {
          if (config.tableList.selectionRows != null) {
            for (var i = 0; i < config.tableList.tableData.length; i++) {
              for (var j = 0; j < config.tableList.selectionRows.length; j++) {
                if (config.tableList.selectionRows[j][config.idField] == config.tableList.tableData[i][config.idField]) {
                  config.tableList.tableData[i]._checked = true;
                }

                if (config._expandedALL) {
                  config.tableList.tableData[i]._expanded = true;
                }
              }
            }
          }
        }
      }
    }, config.pageAppObj, "json");
  },
  IViewTableBindDataBySearchPostRequestBody: function IViewTableBindDataBySearchPostRequestBody(_config, searchModel) {
    var config = {
      url: "",
      pageNum: 1,
      pageSize: 12,
      pageAppObj: null,
      tableList: null,
      idField: "",
      autoSelectedOldRows: false,
      successFunc: null,
      loadDict: false,
      custParas: {},
      _expandedALL: false
    };
    config = $.extend(true, {}, config, _config);

    if (!config.tableList) {
      config.tableList = config.pageAppObj;
    }

    ;
    var sendData = {
      "pageNum": config.pageNum,
      "pageSize": config.pageSize,
      "loadDict": config.loadDict
    };
    sendData = $.extend(true, {}, sendData, searchModel);

    for (var key in config.custParas) {
      sendData[key] = config.custParas[key];
    }

    sendData = JSON.stringify(sendData);
    AjaxUtility.PostRequestBody(config.url, sendData, function (result) {
      if (result.success) {
        if (typeof config.successFunc == "function") {
          config.successFunc.call(config.pageAppObj, result, config.pageAppObj);
        }

        config.tableList.tableData = new Array();
        config.tableList.tableData = result.data.list;
        config.tableList.pageTotal = result.data.total;

        if (config.tableList.tableData && config.tableList.tableData.length > 0) {
          for (var i = 0; i < config.tableList.tableData.length; i++) {
            if (config._expandedALL) {
              config.tableList.tableData[i]._expanded = true;
            }
          }
        }

        if (config.autoSelectedOldRows) {
          if (config.tableList.selectionRows != null) {
            for (var i = 0; i < config.tableList.tableData.length; i++) {
              for (var j = 0; j < config.tableList.selectionRows.length; j++) {
                if (config.tableList.selectionRows[j][config.idField] == config.tableList.tableData[i][config.idField]) {
                  config.tableList.tableData[i]._checked = true;
                }

                if (config._expandedALL) {
                  config.tableList.tableData[i]._expanded = true;
                }
              }
            }
          }
        }
      }
    }, config.pageAppObj, "json");
  },
  IViewTableLoadDataSearch: function IViewTableLoadDataSearch(url, pageNum, pageSize, searchCondition, pageAppObj, idField, autoSelectedOldRows, successFunc, loadDict, custParas) {
    alert("ListPageUtility.IViewTableLoadDataSearch方法已经被废弃,请转调IViewTableBindDataBySearch");
    return;

    if (loadDict == undefined || loadDict == null) {
      loadDict = false;
    }

    if (!custParas) {
      custParas = {};
    }

    var sendData = {
      "pageNum": pageNum,
      "pageSize": pageSize,
      "searchCondition": SearchUtility.SerializationSearchCondition(searchCondition),
      "loadDict": loadDict
    };

    for (var key in custParas) {
      sendData[key] = custParas[key];
    }

    AjaxUtility.Post(url, sendData, function (result) {
      if (result.success) {
        if (typeof successFunc == "function") {
          successFunc(result, pageAppObj);
        }

        pageAppObj.tableData = new Array();
        pageAppObj.tableData = result.data.list;
        pageAppObj.pageTotal = result.data.total;

        if (autoSelectedOldRows) {
          if (pageAppObj.selectionRows != null) {
            for (var i = 0; i < pageAppObj.tableData.length; i++) {
              for (var j = 0; j < pageAppObj.selectionRows.length; j++) {
                if (pageAppObj.selectionRows[j][idField] == pageAppObj.tableData[i][idField]) {
                  pageAppObj.tableData[i]._checked = true;
                }
              }
            }
          }
        }
      } else {}
    }, this, "json");
  },
  IViewTableLoadDataNoSearch: function IViewTableLoadDataNoSearch(url, pageNum, pageSize, pageAppObj, idField, autoSelectedOldRows, successFunc) {
    alert("ListPageUtility.IViewTableLoadDataSearch方法已经被废弃,请转调IViewTableBindDataBySearch");
    return;
    AjaxUtility.Post(url, {
      pageNum: pageNum,
      pageSize: pageSize
    }, function (result) {
      if (result.success) {
        pageAppObj.tableData = new Array();
        pageAppObj.tableData = result.data.list;
        pageAppObj.pageTotal = result.data.total;

        if (autoSelectedOldRows) {
          if (pageAppObj.selectionRows != null) {
            for (var i = 0; i < pageAppObj.tableData.length; i++) {
              for (var j = 0; j < pageAppObj.selectionRows.length; j++) {
                if (pageAppObj.selectionRows[j][idField] == pageAppObj.tableData[i][idField]) {
                  pageAppObj.tableData[i]._checked = true;
                }
              }
            }
          }
        }

        if (typeof successFunc == "function") {
          successFunc(result, pageAppObj);
        }
      }
    }, "json");
  },
  IViewTableInnerButton: {
    ViewButton: function ViewButton(h, params, idField, pageAppObj) {
      return h('Tooltip', {
        props: {
          content: "查看"
        }
      }, [h('div', {
        class: "list-row-button view",
        on: {
          click: function click() {
            pageAppObj.view(params.row[idField], params);
          }
        }
      })]);
    },
    EditButton: function EditButton(h, params, idField, pageAppObj) {
      return h('Tooltip', {
        props: {
          content: "修改"
        }
      }, [h('div', {
        class: "list-row-button edit",
        on: {
          click: function click() {
            pageAppObj.edit(params.row[idField], params);
          }
        }
      })]);
    },
    DeleteButton: function DeleteButton(h, params, idField, pageAppObj) {
      return h('Tooltip', {
        props: {
          content: "删除"
        }
      }, [h('div', {
        class: "list-row-button del",
        on: {
          click: function click() {
            pageAppObj.del(params.row[idField], params);
          }
        }
      })]);
    },
    MoveUpButton: function MoveUpButton(h, params, idField, pageAppObj) {
      return h('Tooltip', {
        props: {
          content: "上移"
        }
      }, [h('div', {
        class: "list-row-button move-up",
        on: {
          click: function click() {
            pageAppObj.moveUp(params.row[idField], params);
          }
        }
      })]);
    },
    MoveDownButton: function MoveDownButton(h, params, idField, pageAppObj) {
      return h('Tooltip', {
        props: {
          content: "下移"
        }
      }, [h('div', {
        class: "list-row-button move-down",
        on: {
          click: function click() {
            pageAppObj.moveDown(params.row[idField], params);
          }
        }
      })]);
    },
    SelectedButton: function SelectedButton(h, params, idField, pageAppObj, clickEvent) {
      return h('Tooltip', {
        props: {
          content: "选择"
        }
      }, [h('div', {
        class: "list-row-button selected",
        on: {
          click: function click() {
            if (typeof clickEvent == "function") {
              clickEvent(params.row[idField], params);
            } else {
              pageAppObj.selected(params.row[idField], params);
            }
          }
        }
      })]);
    }
  }
};
"use strict";

var LoadJsCssUtility = function (dom) {
  var cache = {},
      funct;

  funct = function funct(path, callback) {
    if (!path) {
      throw new Error("请输入path路径!");
    }

    ;
    var fn = Object.prototype.toString.call(callback) == "[object Function]" ? callback : function () {};

    if (".js" == path.substr(-3)) {
      addJs(path, fn);
    } else if (".css" == path.substr(-4)) {
      addCss(path, fn);
    } else {
      throw new Error('请输入正确的path路径!');
    }
  };

  function addCss(path, callback) {
    if (!checkcache(path)) {
      var head = dom.getElementsByTagName('head')[0];
      var link = dom.createElement('link');
      link.href = path;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      head.appendChild(link);

      link.onload = link.onreadystatechange = function () {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
          link.onload = link.onreadystatechange = null;
          callback();
        }
      };

      cache[path] = 1;
    }
  }

  ;

  function addJs(path, callback) {
    if (!checkcache(path)) {
      var head = dom.getElementsByTagName('head')[0];
      var script = dom.createElement('script');
      script.src = path;
      script.type = 'text/javascript';
      head.appendChild(script);

      script.onload = script.onreadystatechange = function () {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
          script.onload = script.onreadystatechange = null;
          callback();
        }
      };

      cache[path] = 1;
    }
  }

  ;

  function checkcache(path) {
    if (cache[path]) {
      return true;
    } else {
      return false;
    }
  }

  ;
  return funct;
}(document);
"use strict";

var LocalStorageUtility = {
  isSupport: function isSupport() {
    if (typeof Storage !== "undefined") {
      return true;
    } else {
      return false;
    }
  },
  setItem: function setItem(key, value) {
    if (this.isSupport()) {
      localStorage.setItem(key, value);
    }
  },
  getItem: function getItem(key) {
    if (this.isSupport()) {
      return localStorage.getItem(key);
    }

    return null;
  },
  setItemInSessionStorage: function setItemInSessionStorage(key, value) {
    if (this.isSupport()) {
      sessionStorage.setItem(key, value);
    }
  },
  getItemInSessionStorage: function getItemInSessionStorage(key) {
    if (this.isSupport()) {
      return sessionStorage.getItem(key);
    }

    return null;
  }
};
"use strict";

var PageStyleUtility = {
  GetPageHeight: function GetPageHeight() {
    return jQuery(window.document).height();
  },
  GetPageWidth: function GetPageWidth() {
    return jQuery(window.document).width();
  },
  GetWindowHeight: function GetWindowHeight() {
    alert("GetWindowHeight:未实现");
    throw "GetWindowHeight:未实现";
  },
  GetWindowWidth: function GetWindowWidth() {
    alert("GetWindowWidth:未实现");
    throw "GetWindowWidth:未实现";
  },
  GetScreenHeight: function GetScreenHeight() {
    return screen.height;
  },
  GetScreenWidth: function GetScreenWidth() {
    return screen.width;
  },
  AutoElemHeight: function AutoElemHeight(elemSelector, fixHeight) {
    var pageHeight = PageStyleUtility.GetPageHeight();
    var newHeight = pageHeight - fixHeight;
    $(elemSelector).height(newHeight);
  },
  AutoElemHeightInTableLayout: function AutoElemHeightInTableLayout(elemSelector, tableSelector) {
    var pageHeight = PageStyleUtility.GetPageHeight();
    var tableHeight = $(tableSelector).height();

    if (pageHeight > tableHeight) {
      var elemHeight = $(elemSelector).height();
      var fixHeight = pageHeight - tableHeight;
      var height = elemHeight + fixHeight - 60;

      if ($(".ui-tabs").length > 0) {
        height = height - 70;
      }

      $(elemSelector).height(height);
    }
  },
  GetListButtonOuterHeight: function GetListButtonOuterHeight() {
    alert("PageStyleUtility.GetListButtonOuterHeight 已停用");
    return jQuery(".list-button-outer-c").outerHeight();
  }
};
"use strict";

var SearchUtility = {
  SearchFieldType: {
    IntType: "IntType",
    NumberType: "NumberType",
    DataType: "DateType",
    LikeStringType: "LikeStringType",
    LeftLikeStringType: "LeftLikeStringType",
    RightLikeStringType: "RightLikeStringType",
    StringType: "StringType",
    DataStringType: "DateStringType",
    ArrayLikeStringType: "ArrayLikeStringType"
  },
  SerializationSearchCondition: function SerializationSearchCondition(searchCondition) {
    if (searchCondition) {
      var searchConditionClone = JsonUtility.CloneSimple(searchCondition);

      for (var key in searchConditionClone) {
        if (searchConditionClone[key].type == SearchUtility.SearchFieldType.ArrayLikeStringType) {
          if (searchConditionClone[key].value != null && searchConditionClone[key].value.length > 0) {
            searchConditionClone[key].value = searchConditionClone[key].value.join(";");
          } else {
            searchConditionClone[key].value = "";
          }
        }
      }

      return JSON.stringify(searchConditionClone);
    }

    return "";
  }
};
"use strict";

var JBuild4DSelectView = {
  SelectEnvVariable: {
    formatText: function formatText(type, text) {
      alert("JBuild4DSelectView.formatText方法已经废弃,请使用select-default-value-dialog组件内部的formatText方法!");
      return;

      if (type == "Const") {
        return "静态值:【" + text + "】";
      } else if (type == "DateTime") {
        return "日期时间:【" + text + "】";
      } else if (type == "ApiVar") {
        return "API变量:【" + text + "】";
      } else if (type == "NumberCode") {
        return "序号编码:【" + text + "】";
      } else if (type == "IdCoder") {
        return "主键生成:【" + text + "】";
      } else if (type == "") {
        return "【无】";
      }

      return "未知类型" + text;
    }
  }
};
"use strict";

var SessionUtility = {
  _currentSessionUser: null,
  _currentSessionUserMock: {
    organId: "",
    organName: "",
    userId: "",
    userName: "",
    mainDepartmentId: "",
    mainDepartmentName: "",
    accountId: "",
    accountName: ""
  },
  ClearClientSessionStoreSessionUser: function ClearClientSessionStoreSessionUser() {},
  GetSessionUserSync: function GetSessionUserSync() {
    if (this._currentSessionUser == null) {
      if (window.parent.SessionUtility._currentSessionUser != null) {
        return window.parent.SessionUtility._currentSessionUser;
      } else {
        AjaxUtility.PostSync("/Rest/Session/User/GetMySessionUser", {}, function (result) {
          if (result.success) {
            SessionUtility._currentSessionUser = result.data;
          } else {}
        }, this);
        return this._currentSessionUser;
      }
    } else {
      return this._currentSessionUser;
    }
  },
  GetSessionUser: function GetSessionUser(func) {
    if (!this._currentSessionUser) {
      AjaxUtility.Get("/Rest/Session/User/GetMySessionUser", {}, function (result) {
        if (result.success) {
          func(result.data);
        }
      }, this);
    }

    return this._currentSessionUser;
  }
};
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var StringUtility = {
  GuidSplit: function GuidSplit(split) {
    var guid = "";

    for (var i = 1; i <= 32; i++) {
      guid += Math.floor(Math.random() * 16.0).toString(16);
      if (i == 8 || i == 12 || i == 16 || i == 20) guid += split;
    }

    return guid;
  },
  Guid: function Guid() {
    return this.GuidSplit("-");
  },
  Timestamp: function Timestamp() {
    var timestamp = new Date().getTime();
    return timestamp.toString().substr(4, 10);
  },
  Trim: function Trim(str) {
    return str.replace(/(^[　\s]*)|([　\s]*$)/g, "");
  },
  RemoveLastChar: function RemoveLastChar(str) {
    return str.substring(0, str.length - 1);
  },
  IsNullOrEmptyTrim: function IsNullOrEmptyTrim(obj) {
    if (obj) {
      obj = this.Trim(obj.toString());
    }

    return this.IsNullOrEmpty(obj);
  },
  IsNullOrEmpty: function IsNullOrEmpty(obj) {
    return obj == undefined || obj === "" || obj == null || obj == "undefined" || obj == "null";
  },
  IsNotNullOrEmpty: function IsNotNullOrEmpty(obj) {
    return !this.IsNullOrEmpty(obj);
  },
  NullToES: function NullToES(obj) {
    if (this.IsNullOrEmpty(obj)) {
      return "";
    }

    return obj;
  },
  GetFunctionName: function GetFunctionName(func) {
    if (typeof func == "function" || _typeof(func) == "object") var fName = ("" + func).match(/function\s*([\w\$]*)\s*\(/);
    if (fName !== null) return fName[1];
  },
  ToLowerCase: function ToLowerCase(str) {
    return str.toLowerCase();
  },
  toUpperCase: function toUpperCase(str) {
    return str.toUpperCase();
  },
  EndWith: function EndWith(str, endStr) {
    var d = str.length - endStr.length;
    return d >= 0 && str.lastIndexOf(endStr) == d;
  },
  IsSameDomain: function IsSameDomain(url1, url2) {
    if (url2.indexOf("../") == 0) {
      return true;
    }

    var origin1 = /\/\/[\w-.]+(:\d+)?/i.exec(url1)[0];
    var open = /\/\/[\w-.]+(:\d+)?/i.exec(url2);

    if (open == null) {
      return true;
    } else {
      var origin2 = open[0];

      if (origin1 == origin2) {
        return true;
      }

      return false;
    }
  },
  FirstCharLetter: function FirstCharLetter(str) {
    var str1 = str.replace(str[0], str[0].toLowerCase());
    return str1;
  },
  FirstCharUpper: function FirstCharUpper(str) {
    var str1 = str.replace(str[0], str[0].toUpperCase());
    return str1;
  },
  RemoveScript: function RemoveScript(str) {
    return str.replace(/<script.*?>.*?<\/script>/ig, '');
  },
  EncodeHtml: function EncodeHtml(str) {
    var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
    return typeof str != "string" ? str : str.replace(REGX_HTML_ENCODE, function ($0) {
      var c = $0.charCodeAt(0),
          r = ["&#"];
      c = c == 0x20 ? 0xA0 : c;
      r.push(c);
      r.push(";");
      return r.join("");
    });
  },
  DecodeHtml: function DecodeHtml(str) {
    var REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;
    var HTML_DECODE = {
      "&lt;": "<",
      "&gt;": ">",
      "&amp;": "&",
      "&nbsp;": " ",
      "&quot;": "\"",
      "©": ""
    };
    return typeof str != "string" ? str : str.replace(REGX_HTML_DECODE, function ($0, $1) {
      var c = HTML_DECODE[$0];

      if (c == undefined) {
        if (!isNaN($1)) {
          c = String.fromCharCode($1 == 160 ? 32 : $1);
        } else {
          c = $0;
        }
      }

      return c;
    });
  },
  GetFileExName: function GetFileExName(fileName) {
    var ext = fileName.substring(fileName.lastIndexOf("."), fileName.length);
    return ext;
  },
  ReplaceSPCharL1: function ReplaceSPCharL1(source) {
    var reg = /\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\、|\^|\$|\!|\~|\`|\|/g;
    var temp = source.replace(reg, "");
    return temp;
  },
  ReplaceSPCharL2: function ReplaceSPCharL2(source) {
    var reg = /\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|,|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g;
    var temp = source.replace(reg, "");
    return temp;
  }
};
"use strict";

var TreeUtility = {
  BuildNodePathName: function BuildNodePathName(treeNode, name, appendText, beginIndex) {
    if (!beginIndex) {
      beginIndex = 0;
    }

    var ary = [];
    var pathNode = treeNode.getPath();

    for (var i = beginIndex; i < pathNode.length; i++) {
      ary.push(StringUtility.ReplaceSPCharL2(pathNode[i][name]));
    }

    if (StringUtility.IsNullOrEmpty(appendText)) {
      return ary.join("▷▷");
    }

    return ary.join("▷▷") + "▷▷" + StringUtility.ReplaceSPCharL2(appendText);
  }
};
"use strict";

var ValidateUtility = {
  ValidateType: {
    NotEmpty: "",
    Int: "",
    Number: "",
    SimpleCode: "",
    EMail: "",
    Mobile: "",
    GeneralWord: ""
  },
  ValidateSingle: function ValidateSingle(value, type, caption, message, errorCallBack) {
    var result = {
      success: true,
      messageArray: [],
      message: ""
    };

    switch (type) {
      case this.ValidateType.NotEmpty:
        {
          var val = StringUtility.Trim(value);

          if (val == "") {
            var msg = "【" + caption + "】不能为空！";
            DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, msg, null, null);
            result.success = false;
            result.message = msg;
          }
        }
        break;

      case this.ValidateType.SimpleCode:
        {
          var reg = /^[a-zA-Z0-9_]{0,}$/;

          if (!reg.test(value)) {
            var msg = "【" + caption + "】请使用英文,数字,或者_！";
            DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, msg, null, null);
            result.success = false;
            result.message = msg;
          }
        }
    }

    return result;
  }
};
"use strict";

var XMLUtility = {};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFqYXhVdGlsaXR5LmpzIiwiQXJyYXlVdGlsaXR5LmpzIiwiQmFpZHVNYXBVdGlsaXR5LmpzIiwiQmFzZVV0aWxpdHkuanMiLCJCcm93c2VySW5mb1V0aWxpdHkuanMiLCJDYWNoZURhdGFVdGlsaXR5LmpzIiwiQ29va2llVXRpbGl0eS5qcyIsIkRhdGVVdGlsaXR5LmpzIiwiRGV0YWlsUGFnZVV0aWxpdHkuanMiLCJEaWFsb2dVdGlsaXR5LmpzIiwiRGljdGlvbmFyeVV0aWxpdHkuanMiLCJIYXJkRGlza1V0aWxpdHkuanMiLCJKQnVpbGQ0RENCYXNlTGliLmpzIiwiSkJ1aWxkNERDWWFtbC5qcyIsIkpzb25VdGlsaXR5LmpzIiwiTGlzdFBhZ2VVdGlsaXR5LmpzIiwiTG9hZEpzQ3NzVXRpbGl0eS5qcyIsIkxvY2FsU3RvcmFnZVV0aWxpdHkuanMiLCJQYWdlU3R5bGVVdGlsaXR5LmpzIiwiU2VhcmNoVXRpbGl0eS5qcyIsIlNlbGVjdFZpZXdMaWIuanMiLCJTZXNzaW9uVXRpbGl0eS5qcyIsIlN0cmluZ1V0aWxpdHkuanMiLCJUcmVlVXRpbGl0eS5qcyIsIlZhbGlkYXRlVXRpbGl0eS5qcyIsIlhNTFV0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeHBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5ZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0EiLCJmaWxlIjoiSkJ1aWxkNERDTGliLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBBamF4VXRpbGl0eSA9IHtcbiAgUG9zdFJlcXVlc3RCb2R5OiBmdW5jdGlvbiBQb3N0UmVxdWVzdEJvZHkoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5fSW5uZXJBamF4KF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIiwgdHJ1ZSwgXCJQT1NUXCIpO1xuICB9LFxuICBQb3N0U3luYzogZnVuY3Rpb24gUG9zdFN5bmMoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUsIGNvbnRlbnRUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuX0lubmVyQWpheChfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSwgbnVsbCwgZmFsc2UsIFwiUE9TVFwiKTtcbiAgfSxcbiAgUG9zdDogZnVuY3Rpb24gUG9zdChfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSkge1xuICAgIHJldHVybiB0aGlzLl9Jbm5lckFqYXgoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUsIG51bGwsIHRydWUsIFwiUE9TVFwiKTtcbiAgfSxcbiAgR2V0U3luYzogZnVuY3Rpb24gR2V0U3luYyhfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSkge1xuICAgIHJldHVybiB0aGlzLl9Jbm5lckFqYXgoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUsIG51bGwsIGZhbHNlLCBcIkdFVFwiKTtcbiAgfSxcbiAgR2V0OiBmdW5jdGlvbiBHZXQoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5fSW5uZXJBamF4KF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlLCBudWxsLCB0cnVlLCBcIkdFVFwiKTtcbiAgfSxcbiAgRGVsZXRlOiBmdW5jdGlvbiBEZWxldGUoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5fSW5uZXJBamF4KF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlLCBudWxsLCB0cnVlLCBcIkRFTEVURVwiKTtcbiAgfSxcbiAgRGVsZXRlU3luYzogZnVuY3Rpb24gRGVsZXRlU3luYyhfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSkge1xuICAgIHJldHVybiB0aGlzLl9Jbm5lckFqYXgoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUsIG51bGwsIGZhbHNlLCBcIkRFTEVURVwiKTtcbiAgfSxcbiAgX0lubmVyQWpheDogZnVuY3Rpb24gX0lubmVyQWpheChfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSwgY29udGVudFR5cGUsIGlzQXN5bmMsIGFqYXhUeXBlKSB7XG4gICAgaWYgKGNhbGxlciAmJiBjYWxsZXIgPT0gXCJqc29uXCIpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRFcnJvcih3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRFcnJvcklkLCB7fSwgXCLnlLHkuo7mlrnms5Xmm7TmlrAsY2FsbGVy5Y+C5pWw6K+35Lyg6YCSdGhpc1wiLCBudWxsKTtcbiAgICB9XG5cbiAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24oX3VybCk7XG5cbiAgICBpZiAoZGF0YVR5cGUgPT0gdW5kZWZpbmVkIHx8IGRhdGFUeXBlID09IG51bGwpIHtcbiAgICAgIGRhdGFUeXBlID0gXCJqc29uXCI7XG4gICAgfVxuXG4gICAgaWYgKGlzQXN5bmMgPT0gdW5kZWZpbmVkIHx8IGlzQXN5bmMgPT0gbnVsbCkge1xuICAgICAgaXNBc3luYyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnRUeXBlID09IHVuZGVmaW5lZCB8fCBjb250ZW50VHlwZSA9PSBudWxsKSB7XG4gICAgICBjb250ZW50VHlwZSA9IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04XCI7XG4gICAgfVxuXG4gICAgdmFyIGlubmVyUmVzdWx0ID0gbnVsbDtcbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogYWpheFR5cGUsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGFzeW5jOiBpc0FzeW5jLFxuICAgICAgY29udGVudFR5cGU6IGNvbnRlbnRUeXBlLFxuICAgICAgZGF0YVR5cGU6IGRhdGFUeXBlLFxuICAgICAgZGF0YTogc2VuZERhdGEsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKHJlc3VsdCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCAmJiByZXN1bHQuc3VjY2VzcyAhPSBudWxsICYmICFyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5tZXNzYWdlID09IFwi55m75b2VU2Vzc2lvbui/h+acn1wiKSB7XG4gICAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRFcnJvcih3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRFcnJvcklkLCB7fSwgXCJTZXNzaW9u6LaF5pe277yM6K+36YeN5paw55m76ZmG57O757ufXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBCYXNlVXRpbGl0eS5SZWRpcmVjdFRvTG9naW4oKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJBamF4VXRpbGl0eS5Qb3N0IEV4Y2VwdGlvbiBcIiArIHVybCk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyA9PSBmYWxzZSkge1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSByZXN1bHQubWVzc2FnZTtcblxuICAgICAgICAgICAgaWYgKFN0cmluZ1V0aWxpdHkuSXNOdWxsT3JFbXB0eShtZXNzYWdlKSkge1xuICAgICAgICAgICAgICBtZXNzYWdlID0gcmVzdWx0LnRyYWNlTXNnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0RXJyb3Iod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0RXJyb3JJZCwge30sIG1lc3NhZ2UsIGZ1bmN0aW9uICgpIHt9KTtcblxuICAgICAgICAgICAgaWYgKGNhbGxlcikge1xuICAgICAgICAgICAgICBpZiAoY2FsbGVyLmlzU3VibWl0dGluZykge1xuICAgICAgICAgICAgICAgIGNhbGxlci5pc1N1Ym1pdHRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cblxuICAgICAgICBpZiAoY2FsbGVyKSB7XG4gICAgICAgICAgZnVuYy5jYWxsKGNhbGxlciwgcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmdW5jKHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbm5lclJlc3VsdCA9IHJlc3VsdDtcbiAgICAgIH0sXG4gICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUobXNnKSB7fSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcihtc2cpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAobXNnLnJlc3BvbnNlVGV4dC5pbmRleE9mKFwi6K+36YeN5paw55m76ZmG57O757ufXCIpID49IDApIHtcbiAgICAgICAgICAgIEJhc2VVdGlsaXR5LlJlZGlyZWN0VG9Mb2dpbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEVycm9yKHdpbmRvdywgXCJBamF4VXRpbGl0eS5Qb3N0LkVycm9yXCIsIHt9LCBcIkFqYXjor7fmsYLlj5HnlJ/plJnor6/vvIE8YnIvPlwiICsgXCJzdGF0dXM6XCIgKyBtc2cuc3RhdHVzICsgXCIsPGJyLz5yZXNwb25zZVRleHQ6XCIgKyBtc2cucmVzcG9uc2VUZXh0LCBudWxsKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaW5uZXJSZXN1bHQ7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBBcnJheVV0aWxpdHkgPSB7XG4gIERlbGV0ZVdoZXJlOiBmdW5jdGlvbiBEZWxldGVXaGVyZShhcnIsIGNvbmRpdGlvbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY29uZGl0aW9uKGFycltpXSkpIHtcbiAgICAgICAgQXJyYXlVdGlsaXR5LkRlbGV0ZShhcnIsIGkpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgRGVsZXRlOiBmdW5jdGlvbiBEZWxldGUoYXJ5LCBpbmRleCkge1xuICAgIGFyeS5zcGxpY2UoaW5kZXgsIDEpO1xuICB9LFxuICBTd2FwSXRlbXM6IGZ1bmN0aW9uIFN3YXBJdGVtcyhhcnksIGluZGV4MSwgaW5kZXgyKSB7XG4gICAgYXJ5W2luZGV4MV0gPSBhcnkuc3BsaWNlKGluZGV4MiwgMSwgYXJ5W2luZGV4MV0pWzBdO1xuICAgIHJldHVybiBhcnk7XG4gIH0sXG4gIE1vdmVVcDogZnVuY3Rpb24gTW92ZVVwKGFyciwgJGluZGV4KSB7XG4gICAgaWYgKCRpbmRleCA9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5Td2FwSXRlbXMoYXJyLCAkaW5kZXgsICRpbmRleCAtIDEpO1xuICB9LFxuICBNb3ZlRG93bjogZnVuY3Rpb24gTW92ZURvd24oYXJyLCAkaW5kZXgpIHtcbiAgICBpZiAoJGluZGV4ID09IGFyci5sZW5ndGggLSAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5Td2FwSXRlbXMoYXJyLCAkaW5kZXgsICRpbmRleCArIDEpO1xuICB9LFxuICBVbmlxdWU6IGZ1bmN0aW9uIFVuaXF1ZShhcnIpIHtcbiAgICB2YXIgbiA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChuLmluZGV4T2YoYXJyW2ldKSA9PSAtMSkgbi5wdXNoKGFycltpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG47XG4gIH0sXG4gIEV4aXN0OiBmdW5jdGlvbiBFeGlzdChhcnIsIGNvbmRpdGlvbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY29uZGl0aW9uKGFycltpXSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBOb3RFeGlzdDogZnVuY3Rpb24gTm90RXhpc3QoYXJyLCBjb25kaXRpb24pIHtcbiAgICByZXR1cm4gIXRoaXMuRXhpc3QoYXJyLCBjb25kaXRpb24pO1xuICB9LFxuICBQdXNoV2hlbk5vdEV4aXN0OiBmdW5jdGlvbiBQdXNoV2hlbk5vdEV4aXN0KGFyciwgaXRlbSwgY29uZGl0aW9uKSB7XG4gICAgaWYgKCF0aGlzLkV4aXN0KGFyciwgY29uZGl0aW9uKSkge1xuICAgICAgYXJyLnB1c2goaXRlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycjtcbiAgfSxcbiAgV2hlcmU6IGZ1bmN0aW9uIFdoZXJlKGFyciwgY29uZGl0aW9uKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjb25kaXRpb24oYXJyW2ldKSkge1xuICAgICAgICByZXN1bHQucHVzaChhcnJbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIFdoZXJlU2luZ2xlOiBmdW5jdGlvbiBXaGVyZVNpbmdsZShhcnIsIGNvbmRpdGlvbikge1xuICAgIHZhciB0ZW1wID0gdGhpcy5XaGVyZShhcnIsIGNvbmRpdGlvbik7XG5cbiAgICBpZiAodGVtcC5sZW5ndGggPT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRlbXBbMF07XG4gIH0sXG4gIFB1c2g6IGZ1bmN0aW9uIFB1c2goc291cmNlLCBhcHBlbmQpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcHBlbmQpKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFwcGVuZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBzb3VyY2UucHVzaChhcHBlbmRbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzb3VyY2UucHVzaChhcHBlbmQpO1xuICAgIH1cbiAgfSxcbiAgVHJ1ZTogZnVuY3Rpb24gVHJ1ZShzb3VyY2UsIGNvbmRpdGlvbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY29uZGl0aW9uKHNvdXJjZVtpXSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc0FycmF5OiBmdW5jdGlvbiBJc0FycmF5KHNvdXJjZSkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheSkge1xuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoc291cmNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzb3VyY2UpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cbiAgfSxcbiAgUmVwbGFjZUl0ZW06IGZ1bmN0aW9uIFJlcGxhY2VJdGVtKHNvdXJjZSwgbmV3SXRlbSwgY29uZGl0aW9uKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjb25kaXRpb24oc291cmNlW2ldKSkge1xuICAgICAgICBzb3VyY2Uuc3BsaWNlKGksIDEsIG5ld0l0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgRXhpc3RSZXBsYWNlSXRlbTogZnVuY3Rpb24gRXhpc3RSZXBsYWNlSXRlbShzb3VyY2UsIG5ld0l0ZW0sIGNvbmRpdGlvbikge1xuICAgIGlmICghc291cmNlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjb25kaXRpb24oc291cmNlW2ldKSkge1xuICAgICAgICBzb3VyY2Uuc3BsaWNlKGksIDEsIG5ld0l0ZW0pO1xuICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIFRvTWFwOiBmdW5jdGlvbiBUb01hcChzb3VyY2UsIGtleUZpbGUpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNvdXJjZVtpXVtrZXlGaWxlXSkge1xuICAgICAgICByZXN1bHRbc291cmNlW2ldW2tleUZpbGVdXSA9IHNvdXJjZVtpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBJbnNlcnQ6IGZ1bmN0aW9uIEluc2VydChzb3VyY2UsIGluZGV4LCBpdGVtKSB7XG4gICAgc291cmNlLnNwbGljZShpbmRleCwgMCwgaXRlbSk7XG4gIH0sXG4gIEluc2VydEFycmF5OiBmdW5jdGlvbiBJbnNlcnRBcnJheShzb3VyY2UsIGluZGV4LCBuZXdBcnkpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld0FyeS5sZW5ndGg7IGkrKykge1xuICAgICAgc291cmNlLnNwbGljZShpbmRleCsrLCAwLCBuZXdBcnlbaV0pO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEJhaWR1TWFwVXRpbGl0eSA9IHtcbiAgTG9hZEpzQ29tcGxldGVkOiBmdW5jdGlvbiBMb2FkSnNDb21wbGV0ZWQoY2JGdW5jTmFtZSkge1xuICAgIEFqYXhVdGlsaXR5LkdldChcIi9SZXN0L1Byb3BzL1N5c3RlbVByb3BlcnRpZXMvR2V0QmFpZHVNYXBKc1VybFwiLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIHZhciB1cmwgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgIHNjcmlwdC5zcmMgPSB1cmwgKyBcIiZjYWxsYmFjaz1cIiArIGNiRnVuY05hbWU7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgR2V0TGF0TG5nQ2VudGVyOiBmdW5jdGlvbiBHZXRMYXRMbmdDZW50ZXIocG9seWdvblBhdGhBcnJheSkge1xuICAgIHZhciBhcnkgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9seWdvblBhdGhBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgYXJ5LnB1c2goW3BvbHlnb25QYXRoQXJyYXlbaV0ubG5nLCBwb2x5Z29uUGF0aEFycmF5W2ldLmxhdF0pO1xuICAgIH1cblxuICAgIHZhciBwb2x5Z29uID0gdHVyZi5wb2x5Z29uKFthcnldKTtcbiAgICB2YXIgY2VudGVyID0gdHVyZi5jZW50ZXIocG9seWdvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxuZzogY2VudGVyLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLFxuICAgICAgbGF0OiBjZW50ZXIuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV1cbiAgICB9O1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQmFzZVV0aWxpdHkgPSB7XG4gIEdldFJvb3RQYXRoOiBmdW5jdGlvbiBHZXRSb290UGF0aCgpIHtcbiAgICB2YXIgZnVsbEhyZWYgPSB3aW5kb3cuZG9jdW1lbnQubG9jYXRpb24uaHJlZjtcbiAgICB2YXIgcGF0aE5hbWUgPSB3aW5kb3cuZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgdmFyIGxhYyA9IGZ1bGxIcmVmLmluZGV4T2YocGF0aE5hbWUpO1xuICAgIHZhciBsb2NhbGhvc3RQYXRoID0gZnVsbEhyZWYuc3Vic3RyaW5nKDAsIGxhYyk7XG4gICAgdmFyIHByb2plY3ROYW1lID0gcGF0aE5hbWUuc3Vic3RyaW5nKDAsIHBhdGhOYW1lLnN1YnN0cigxKS5pbmRleE9mKCcvJykgKyAxKTtcbiAgICByZXR1cm4gbG9jYWxob3N0UGF0aCArIHByb2plY3ROYW1lO1xuICB9LFxuICBHZXRUb3BXaW5kb3c6IGZ1bmN0aW9uIEdldFRvcFdpbmRvdygpIHtcbiAgICBhbGVydChcIkJhc2VVdGlsaXR5LkdldFRvcFdpbmRvdyDlt7LlgZznlKhcIik7XG4gIH0sXG4gIFRyeVNldENvbnRyb2xGb2N1czogZnVuY3Rpb24gVHJ5U2V0Q29udHJvbEZvY3VzKCkge1xuICAgIGFsZXJ0KFwiQmFzZVV0aWxpdHkuVHJ5U2V0Q29udHJvbEZvY3VzIOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgQnVpbGRWaWV3OiBmdW5jdGlvbiBCdWlsZFZpZXcoYWN0aW9uLCBwYXJhKSB7XG4gICAgcmV0dXJuIHRoaXMuQnVpbGRBY3Rpb24oYWN0aW9uLCBwYXJhKTtcbiAgfSxcbiAgQnVpbGRBY3Rpb246IGZ1bmN0aW9uIEJ1aWxkQWN0aW9uKGFjdGlvbiwgcGFyYSkge1xuICAgIHZhciB1cmxQYXJhID0gXCJcIjtcblxuICAgIGlmIChwYXJhKSB7XG4gICAgICB1cmxQYXJhID0gJC5wYXJhbShwYXJhKTtcbiAgICB9XG5cbiAgICB2YXIgX3VybDtcblxuICAgIGlmIChhY3Rpb24uaW5kZXhPZihcIi4uL1wiKSA9PSAwKSB7XG4gICAgICBfdXJsID0gYWN0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICBfdXJsID0gdGhpcy5HZXRSb290UGF0aCgpICsgYWN0aW9uO1xuICAgIH1cblxuICAgIGlmICh1cmxQYXJhICE9IFwiXCIpIHtcbiAgICAgIGlmIChfdXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgICAgX3VybCArPSBcIiZcIiArIHVybFBhcmE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfdXJsICs9IFwiP1wiICsgdXJsUGFyYTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5BcHBlbmRUaW1lU3RhbXBVcmwoX3VybCk7XG4gIH0sXG4gIEJ1aWxkQWN0aW9uTm90QXBwZW5kUm9vdFBhdGg6IGZ1bmN0aW9uIEJ1aWxkQWN0aW9uTm90QXBwZW5kUm9vdFBhdGgoYWN0aW9uLCBwYXJhKSB7XG4gICAgdmFyIHVybFBhcmEgPSBcIlwiO1xuXG4gICAgaWYgKHBhcmEpIHtcbiAgICAgIHVybFBhcmEgPSAkLnBhcmFtKHBhcmEpO1xuICAgIH1cblxuICAgIHZhciBfdXJsID0gYWN0aW9uO1xuXG4gICAgaWYgKHVybFBhcmEgIT0gXCJcIikge1xuICAgICAgaWYgKF91cmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgICBfdXJsICs9IFwiJlwiICsgdXJsUGFyYTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF91cmwgKz0gXCI/XCIgKyB1cmxQYXJhO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLkFwcGVuZFRpbWVTdGFtcFVybChfdXJsKTtcbiAgfSxcbiAgUmVkaXJlY3RUb0xvZ2luOiBmdW5jdGlvbiBSZWRpcmVjdFRvTG9naW4oKSB7XG4gICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9QbGF0Rm9ybS9Mb2dpblZpZXcuZG9cIjtcbiAgICB3aW5kb3cucGFyZW50LnBhcmVudC5sb2NhdGlvbi5ocmVmID0gdXJsO1xuICB9LFxuICBBcHBlbmRUaW1lU3RhbXBVcmw6IGZ1bmN0aW9uIEFwcGVuZFRpbWVTdGFtcFVybCh1cmwpIHtcbiAgICBpZiAodXJsLmluZGV4T2YoXCJ0aW1lc3RhbXBcIikgPiBcIjBcIikge1xuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG5cbiAgICB2YXIgZ2V0VGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICBpZiAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgIHVybCA9IHVybCArIFwiJnRpbWVzdGFtcD1cIiArIGdldFRpbWVzdGFtcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gdXJsICsgXCI/dGltZXN0YW1wPVwiICsgZ2V0VGltZXN0YW1wO1xuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG4gIH0sXG4gIEdldFVybFBhcmFWYWx1ZTogZnVuY3Rpb24gR2V0VXJsUGFyYVZhbHVlKHBhcmFOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuR2V0VXJsUGFyYVZhbHVlQnlTdHJpbmcocGFyYU5hbWUsIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICB9LFxuICBHZXRVcmxPUFBhcmFWYWx1ZTogZnVuY3Rpb24gR2V0VXJsT1BQYXJhVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuR2V0VXJsUGFyYVZhbHVlKFwib3BcIik7XG4gIH0sXG4gIEdldFVybFBhcmFWYWx1ZUJ5U3RyaW5nOiBmdW5jdGlvbiBHZXRVcmxQYXJhVmFsdWVCeVN0cmluZyhwYXJhTmFtZSwgdXJsU3RyaW5nKSB7XG4gICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoXCIoXnwmKVwiICsgcGFyYU5hbWUgKyBcIj0oW14mXSopKCZ8JClcIik7XG4gICAgdmFyIHIgPSB1cmxTdHJpbmcuc3Vic3RyKDEpLm1hdGNoKHJlZyk7XG4gICAgaWYgKHIgIT0gbnVsbCkgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyWzJdKTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfSxcbiAgQ29weVZhbHVlQ2xpcGJvYXJkOiBmdW5jdGlvbiBDb3B5VmFsdWVDbGlwYm9hcmQodmFsdWUpIHtcbiAgICB2YXIgdHJhbnNmZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnSl9Db3B5VHJhbnNmZXInKTtcblxuICAgIGlmICghdHJhbnNmZXIpIHtcbiAgICAgIHRyYW5zZmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICAgIHRyYW5zZmVyLmlkID0gJ0pfQ29weVRyYW5zZmVyJztcbiAgICAgIHRyYW5zZmVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIHRyYW5zZmVyLnN0eWxlLmxlZnQgPSAnLTk5OTlweCc7XG4gICAgICB0cmFuc2Zlci5zdHlsZS50b3AgPSAnLTk5OTlweCc7XG4gICAgICB0cmFuc2Zlci5zdHlsZS56SW5kZXggPSA5OTk5O1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0cmFuc2Zlcik7XG4gICAgfVxuXG4gICAgdHJhbnNmZXIudmFsdWUgPSB2YWx1ZTtcbiAgICB0cmFuc2Zlci5mb2N1cygpO1xuICAgIHRyYW5zZmVyLnNlbGVjdCgpO1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG4gIH0sXG4gIFNldFN5c3RlbUZhdmljb246IGZ1bmN0aW9uIFNldFN5c3RlbUZhdmljb24oKSB7XG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibGlua1tyZWwqPSdpY29uJ11cIikgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgIGxpbmsudHlwZSA9ICdpbWFnZS94LWljb24nO1xuICAgIGxpbmsucmVsID0gJ3Nob3J0Y3V0IGljb24nO1xuICAgIGxpbmsuaHJlZiA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyAnL2Zhdmljb24uaWNvJztcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKGxpbmspO1xuICB9LFxuICBTZXRTeXN0ZW1UaXRsZTogZnVuY3Rpb24gU2V0U3lzdGVtVGl0bGUoKSB7XG4gICAgZG9jdW1lbnQudGl0bGUgPSBKQnVpbGQ0RENZYW1sLkdldENsaWVudFN5c3RlbVRpdGxlKCk7XG4gIH0sXG4gIFNldFN5c3RlbUNhcHRpb246IGZ1bmN0aW9uIFNldFN5c3RlbUNhcHRpb24oKSB7XG4gICAgJChcIiNzeXN0ZW1DYXB0aW9uXCIpLnRleHQoSkJ1aWxkNERDWWFtbC5HZXRDbGllbnRTeXN0ZW1DYXB0aW9uKCkpO1xuICB9LFxuICBJc0Z1bmN0aW9uOiBmdW5jdGlvbiBJc0Z1bmN0aW9uKGZ1bmMpIHtcbiAgICBpZiAodHlwZW9mIGZ1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIEdldEVsZW1BbGxBdHRyOiBmdW5jdGlvbiBHZXRFbGVtQWxsQXR0cigkZWxlbSkge1xuICAgIHZhciBhdHRycyA9IHt9O1xuICAgICRlbGVtLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgJC5lYWNoKHRoaXMuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5zcGVjaWZpZWQpIHtcbiAgICAgICAgICBhdHRyc1t0aGlzLm5hbWVdID0gdGhpcy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGF0dHJzO1xuICB9LFxuICBHZXRWaWV3T3BlcmF0aW9uTmFtZTogZnVuY3Rpb24gR2V0Vmlld09wZXJhdGlvbk5hbWUoKSB7XG4gICAgcmV0dXJuIFwidmlld1wiO1xuICB9LFxuICBJc1ZpZXdPcGVyYXRpb246IGZ1bmN0aW9uIElzVmlld09wZXJhdGlvbihvcGVyYXRpb25UeXBlKSB7XG4gICAgcmV0dXJuIG9wZXJhdGlvblR5cGUgJiYgb3BlcmF0aW9uVHlwZSA9PSB0aGlzLkdldFZpZXdPcGVyYXRpb25OYW1lKCk7XG4gIH0sXG4gIEdldEFkZE9wZXJhdGlvbk5hbWU6IGZ1bmN0aW9uIEdldEFkZE9wZXJhdGlvbk5hbWUoKSB7XG4gICAgcmV0dXJuIFwiYWRkXCI7XG4gIH0sXG4gIElzQWRkT3BlcmF0aW9uOiBmdW5jdGlvbiBJc0FkZE9wZXJhdGlvbihvcGVyYXRpb25UeXBlKSB7XG4gICAgcmV0dXJuIG9wZXJhdGlvblR5cGUgJiYgb3BlcmF0aW9uVHlwZSA9PSB0aGlzLkdldEFkZE9wZXJhdGlvbk5hbWUoKTtcbiAgfSxcbiAgR2V0VXBkYXRlT3BlcmF0aW9uTmFtZTogZnVuY3Rpb24gR2V0VXBkYXRlT3BlcmF0aW9uTmFtZSgpIHtcbiAgICByZXR1cm4gXCJ1cGRhdGVcIjtcbiAgfSxcbiAgSXNVcGRhdGVPcGVyYXRpb246IGZ1bmN0aW9uIElzVXBkYXRlT3BlcmF0aW9uKG9wZXJhdGlvblR5cGUpIHtcbiAgICByZXR1cm4gb3BlcmF0aW9uVHlwZSAmJiBvcGVyYXRpb25UeXBlID09IHRoaXMuR2V0VXBkYXRlT3BlcmF0aW9uTmFtZSgpO1xuICB9LFxuICBHZXREZWxldGVPcGVyYXRpb25OYW1lOiBmdW5jdGlvbiBHZXREZWxldGVPcGVyYXRpb25OYW1lKCkge1xuICAgIHJldHVybiBcImRlbGV0ZVwiO1xuICB9LFxuICBJc0RlbGV0ZU9wZXJhdGlvbjogZnVuY3Rpb24gSXNEZWxldGVPcGVyYXRpb24ob3BlcmF0aW9uVHlwZSkge1xuICAgIHJldHVybiBvcGVyYXRpb25UeXBlICYmIG9wZXJhdGlvblR5cGUgPT0gdGhpcy5HZXREZWxldGVPcGVyYXRpb25OYW1lKCk7XG4gIH0sXG4gIElzQWRkT3BlcmF0aW9uQnlVcmw6IGZ1bmN0aW9uIElzQWRkT3BlcmF0aW9uQnlVcmwoKSB7XG4gICAgaWYgKHRoaXMuR2V0VXJsUGFyYVZhbHVlKFwib3BcIikpIHtcbiAgICAgIGlmICh0aGlzLkdldFVybFBhcmFWYWx1ZShcIm9wXCIpID09IHRoaXMuR2V0QWRkT3BlcmF0aW9uTmFtZSgpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgSXNVcGRhdGVPcGVyYXRpb25CeVVybDogZnVuY3Rpb24gSXNVcGRhdGVPcGVyYXRpb25CeVVybCgpIHtcbiAgICBpZiAodGhpcy5HZXRVcmxQYXJhVmFsdWUoXCJvcFwiKSkge1xuICAgICAgaWYgKHRoaXMuR2V0VXJsUGFyYVZhbHVlKFwib3BcIikgPT0gdGhpcy5HZXRVcGRhdGVPcGVyYXRpb25OYW1lKCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc1ZpZXdPcGVyYXRpb25CeVVybDogZnVuY3Rpb24gSXNWaWV3T3BlcmF0aW9uQnlVcmwoKSB7XG4gICAgaWYgKHRoaXMuR2V0VXJsUGFyYVZhbHVlKFwib3BcIikpIHtcbiAgICAgIGlmICh0aGlzLkdldFVybFBhcmFWYWx1ZShcIm9wXCIpID09IHRoaXMuR2V0Vmlld09wZXJhdGlvbk5hbWUoKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIFRocm93TWVzc2FnZTogZnVuY3Rpb24gVGhyb3dNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChtZXNzYWdlKTtcbiAgICB0aHJvdyBtZXNzYWdlO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQnJvd3NlckluZm9VdGlsaXR5ID0ge1xuICBCcm93c2VyQXBwTmFtZTogZnVuY3Rpb24gQnJvd3NlckFwcE5hbWUoKSB7XG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkZpcmVmb3hcIikgPiAwKSB7XG4gICAgICByZXR1cm4gXCJGaXJlZm94XCI7XG4gICAgfSBlbHNlIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpID4gMCkge1xuICAgICAgcmV0dXJuIFwiSUVcIjtcbiAgICB9IGVsc2UgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkNocm9tZVwiKSA+IDApIHtcbiAgICAgIHJldHVybiBcIkNocm9tZVwiO1xuICAgIH1cbiAgfSxcbiAgSXNJRTogZnVuY3Rpb24gSXNJRSgpIHtcbiAgICBpZiAoISF3aW5kb3cuQWN0aXZlWE9iamVjdCB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3cpIHJldHVybiB0cnVlO2Vsc2UgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc0lFNjogZnVuY3Rpb24gSXNJRTYoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgNi4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRTc6IGZ1bmN0aW9uIElzSUU3KCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDcuMFwiKSA+IDA7XG4gIH0sXG4gIElzSUU4OiBmdW5jdGlvbiBJc0lFOCgpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA4LjBcIikgPiAwO1xuICB9LFxuICBJc0lFOFg2NDogZnVuY3Rpb24gSXNJRThYNjQoKSB7XG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOC4wXCIpID4gMCkge1xuICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIng2NFwiKSA+IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc0lFOTogZnVuY3Rpb24gSXNJRTkoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOS4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRTlYNjQ6IGZ1bmN0aW9uIElzSUU5WDY0KCkge1xuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDkuMFwiKSA+IDApIHtcbiAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJ4NjRcIikgPiAwO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgSXNJRTEwOiBmdW5jdGlvbiBJc0lFMTAoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgMTAuMFwiKSA+IDA7XG4gIH0sXG4gIElzSUUxMFg2NDogZnVuY3Rpb24gSXNJRTEwWDY0KCkge1xuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDEwLjBcIikgPiAwKSB7XG4gICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwieDY0XCIpID4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIElFRG9jdW1lbnRNb2RlOiBmdW5jdGlvbiBJRURvY3VtZW50TW9kZSgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xuICB9LFxuICBJc0lFOERvY3VtZW50TW9kZTogZnVuY3Rpb24gSXNJRThEb2N1bWVudE1vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuSUVEb2N1bWVudE1vZGUoKSA9PSA4O1xuICB9LFxuICBJc0ZpcmVmb3g6IGZ1bmN0aW9uIElzRmlyZWZveCgpIHtcbiAgICByZXR1cm4gdGhpcy5Ccm93c2VyQXBwTmFtZSgpID09IFwiRmlyZWZveFwiO1xuICB9LFxuICBJc0Nocm9tZTogZnVuY3Rpb24gSXNDaHJvbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuQnJvd3NlckFwcE5hbWUoKSA9PSBcIkNocm9tZVwiO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2FjaGVEYXRhVXRpbGl0eSA9IHt9OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ29va2llVXRpbGl0eSA9IHtcbiAgU2V0Q29va2llMURheTogZnVuY3Rpb24gU2V0Q29va2llMURheShuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBleHAgPSBuZXcgRGF0ZSgpO1xuICAgIGV4cC5zZXRUaW1lKGV4cC5nZXRUaW1lKCkgKyAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBlc2NhcGUodmFsdWUpICsgXCI7ZXhwaXJlcz1cIiArIGV4cC50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XG4gIH0sXG4gIFNldENvb2tpZTFNb250aDogZnVuY3Rpb24gU2V0Q29va2llMU1vbnRoKG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGV4cCA9IG5ldyBEYXRlKCk7XG4gICAgZXhwLnNldFRpbWUoZXhwLmdldFRpbWUoKSArIDMwICogMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgZXNjYXBlKHZhbHVlKSArIFwiO2V4cGlyZXM9XCIgKyBleHAudG9HTVRTdHJpbmcoKSArIFwiO3BhdGg9L1wiO1xuICB9LFxuICBTZXRDb29raWUxWWVhcjogZnVuY3Rpb24gU2V0Q29va2llMVllYXIobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgZXhwID0gbmV3IERhdGUoKTtcbiAgICBleHAuc2V0VGltZShleHAuZ2V0VGltZSgpICsgMzAgKiAyNCAqIDYwICogNjAgKiAzNjUgKiAxMDAwKTtcbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBlc2NhcGUodmFsdWUpICsgXCI7ZXhwaXJlcz1cIiArIGV4cC50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XG4gIH0sXG4gIEdldENvb2tpZTogZnVuY3Rpb24gR2V0Q29va2llKG5hbWUpIHtcbiAgICB2YXIgYXJyID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoXCIoXnwgKVwiICsgbmFtZSArIFwiPShbXjtdKikoO3wkKVwiKSk7XG4gICAgaWYgKGFyciAhPSBudWxsKSByZXR1cm4gdW5lc2NhcGUoYXJyWzJdKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgRGVsQ29va2llOiBmdW5jdGlvbiBEZWxDb29raWUobmFtZSkge1xuICAgIHZhciBleHAgPSBuZXcgRGF0ZSgpO1xuICAgIGV4cC5zZXRUaW1lKGV4cC5nZXRUaW1lKCkgLSAxKTtcbiAgICB2YXIgY3ZhbCA9IHRoaXMuZ2V0Q29va2llKG5hbWUpO1xuICAgIGlmIChjdmFsICE9IG51bGwpIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIGN2YWwgKyBcIjtleHBpcmVzPVwiICsgZXhwLnRvR01UU3RyaW5nKCkgKyBcIjtwYXRoPS9cIjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERhdGVVdGlsaXR5ID0ge1xuICBEYXRlRm9ybWF0OiBmdW5jdGlvbiBEYXRlRm9ybWF0KG15RGF0ZSwgc3BsaXQpIHtcbiAgICBhbGVydChcIkRhdGVVdGlsaXR5LkdldEN1cnJlbnREYXRhU3RyaW5nIOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgQ29udmVydEZyb21TdHJpbmc6IGZ1bmN0aW9uIENvbnZlcnRGcm9tU3RyaW5nKGRhdGVTdHJpbmcpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGRhdGVTdHJpbmcpO1xuICAgIHJldHVybiBkYXRlO1xuICB9LFxuICBGb3JtYXQ6IGZ1bmN0aW9uIEZvcm1hdChteURhdGUsIGZvcm1hdFN0cmluZykge1xuICAgIHZhciBvID0ge1xuICAgICAgXCJNK1wiOiBteURhdGUuZ2V0TW9udGgoKSArIDEsXG4gICAgICBcImQrXCI6IG15RGF0ZS5nZXREYXRlKCksXG4gICAgICBcImgrXCI6IG15RGF0ZS5nZXRIb3VycygpLFxuICAgICAgXCJtK1wiOiBteURhdGUuZ2V0TWludXRlcygpLFxuICAgICAgXCJzK1wiOiBteURhdGUuZ2V0U2Vjb25kcygpLFxuICAgICAgXCJxK1wiOiBNYXRoLmZsb29yKChteURhdGUuZ2V0TW9udGgoKSArIDMpIC8gMyksXG4gICAgICBcIlNcIjogbXlEYXRlLmdldE1pbGxpc2Vjb25kcygpXG4gICAgfTtcbiAgICBpZiAoLyh5KykvLnRlc3QoZm9ybWF0U3RyaW5nKSkgZm9ybWF0U3RyaW5nID0gZm9ybWF0U3RyaW5nLnJlcGxhY2UoUmVnRXhwLiQxLCAobXlEYXRlLmdldEZ1bGxZZWFyKCkgKyBcIlwiKS5zdWJzdHIoNCAtIFJlZ0V4cC4kMS5sZW5ndGgpKTtcblxuICAgIGZvciAodmFyIGsgaW4gbykge1xuICAgICAgaWYgKG5ldyBSZWdFeHAoXCIoXCIgKyBrICsgXCIpXCIpLnRlc3QoZm9ybWF0U3RyaW5nKSkgZm9ybWF0U3RyaW5nID0gZm9ybWF0U3RyaW5nLnJlcGxhY2UoUmVnRXhwLiQxLCBSZWdFeHAuJDEubGVuZ3RoID09IDEgPyBvW2tdIDogKFwiMDBcIiArIG9ba10pLnN1YnN0cigoXCJcIiArIG9ba10pLmxlbmd0aCkpO1xuICAgIH1cblxuICAgIHJldHVybiBmb3JtYXRTdHJpbmc7XG4gIH0sXG4gIEZvcm1hdEN1cnJlbnREYXRlOiBmdW5jdGlvbiBGb3JtYXRDdXJyZW50RGF0ZShmb3JtYXRTdHJpbmcpIHtcbiAgICB2YXIgbXlEYXRlID0gbmV3IERhdGUoKTtcbiAgICByZXR1cm4gdGhpcy5Gb3JtYXQobXlEYXRlLCBmb3JtYXRTdHJpbmcpO1xuICB9LFxuICBHZXRDdXJyZW50RGF0ZTogZnVuY3Rpb24gR2V0Q3VycmVudERhdGUoKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCk7XG4gIH0sXG4gIEdldEN1cnJlbnRUaW1lU3RhbXA6IGZ1bmN0aW9uIEdldEN1cnJlbnRUaW1lU3RhbXAoKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9LFxuICBHZXRDdXJyZW50VGltZVN0cmluZzogZnVuY3Rpb24gR2V0Q3VycmVudFRpbWVTdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuRm9ybWF0Q3VycmVudERhdGUoXCJ5eXl5LU1NLWRkIGhoOm1tOnNzXCIpO1xuICB9LFxuICBHZXRDdXJyZW50RGF0ZVN0cmluZzogZnVuY3Rpb24gR2V0Q3VycmVudERhdGVTdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuRm9ybWF0Q3VycmVudERhdGUoXCJ5eXl5LU1NLWRkXCIpO1xuICB9LFxuICBEYXRlRm9ybWF0QnlUaW1lU3RhbXA6IGZ1bmN0aW9uIERhdGVGb3JtYXRCeVRpbWVTdGFtcCh0aW1lU3RhbXAsIGZvcm1hdFN0cmluZykge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUodGltZVN0YW1wKTtcbiAgICByZXR1cm4gdGhpcy5Gb3JtYXQoZGF0ZSwgZm9ybWF0U3RyaW5nKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERldGFpbFBhZ2VVdGlsaXR5ID0ge1xuICBJVmlld1BhZ2VUb1ZpZXdTdGF0dXM6IGZ1bmN0aW9uIElWaWV3UGFnZVRvVmlld1N0YXR1cygpIHtcbiAgICByZXR1cm47XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgJChcImlucHV0XCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmhpZGUoKTtcbiAgICAgICAgdmFyIHZhbCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICQodGhpcykuYWZ0ZXIoJChcIjxsYWJlbCAvPlwiKS50ZXh0KHZhbCkpO1xuICAgICAgfSk7XG4gICAgICAkKFwiLml2dS1kYXRlLXBpY2tlci1lZGl0b3JcIikuZmluZChcIi5pdnUtaWNvblwiKS5oaWRlKCk7XG4gICAgICAkKFwiLml2dS1yYWRpb1wiKS5oaWRlKCk7XG4gICAgICAkKFwiLml2dS1yYWRpby1ncm91cC1pdGVtXCIpLmhpZGUoKTtcbiAgICAgICQoXCIuaXZ1LXJhZGlvLXdyYXBwZXItY2hlY2tlZFwiKS5zaG93KCk7XG4gICAgICAkKFwiLml2dS1yYWRpby13cmFwcGVyLWNoZWNrZWRcIikuZmluZChcInNwYW5cIikuaGlkZSgpO1xuICAgICAgJChcInRleHRhcmVhXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmhpZGUoKTtcbiAgICAgICAgdmFyIHZhbCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICQodGhpcykuYWZ0ZXIoJChcIjxsYWJlbCAvPlwiKS50ZXh0KHZhbCkpO1xuICAgICAgfSk7XG4gICAgfSwgMTAwKTtcbiAgfSxcbiAgT3ZlcnJpZGVPYmplY3RWYWx1ZTogZnVuY3Rpb24gT3ZlcnJpZGVPYmplY3RWYWx1ZShzb3VyY2VPYmplY3QsIGRhdGFPYmplY3QpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlT2JqZWN0KSB7XG4gICAgICBpZiAoZGF0YU9iamVjdFtrZXldICE9IHVuZGVmaW5lZCAmJiBkYXRhT2JqZWN0W2tleV0gIT0gbnVsbCAmJiBkYXRhT2JqZWN0W2tleV0gIT0gXCJcIikge1xuICAgICAgICBzb3VyY2VPYmplY3Rba2V5XSA9IGRhdGFPYmplY3Rba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIE92ZXJyaWRlT2JqZWN0VmFsdWVGdWxsOiBmdW5jdGlvbiBPdmVycmlkZU9iamVjdFZhbHVlRnVsbChzb3VyY2VPYmplY3QsIGRhdGFPYmplY3QpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlT2JqZWN0KSB7XG4gICAgICBzb3VyY2VPYmplY3Rba2V5XSA9IGRhdGFPYmplY3Rba2V5XTtcbiAgICB9XG4gIH0sXG4gIEJpbmRGb3JtRGF0YTogZnVuY3Rpb24gQmluZEZvcm1EYXRhKGludGVyZmFjZVVybCwgdnVlRm9ybURhdGEsIHJlY29yZElkLCBvcCwgYmVmRnVuYywgYWZGdW5jLCBjYWxsZXIpIHtcbiAgICBBamF4VXRpbGl0eS5Qb3N0KGludGVyZmFjZVVybCwge1xuICAgICAgcmVjb3JkSWQ6IHJlY29yZElkLFxuICAgICAgb3A6IG9wXG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYmVmRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBiZWZGdW5jKHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBEZXRhaWxQYWdlVXRpbGl0eS5PdmVycmlkZU9iamVjdFZhbHVlKHZ1ZUZvcm1EYXRhLCByZXN1bHQuZGF0YSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhZkZ1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgYWZGdW5jKHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3AgPT0gXCJ2aWV3XCIpIHtcbiAgICAgICAgICBEZXRhaWxQYWdlVXRpbGl0eS5JVmlld1BhZ2VUb1ZpZXdTdGF0dXMoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LCBjYWxsZXIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG52YXIgRGlhbG9nVXRpbGl0eSA9IHtcbiAgRGlhbG9nQWxlcnRJZDogXCJEZWZhdWx0RGlhbG9nQWxlcnRVdGlsaXR5MDFcIixcbiAgRGlhbG9nQWxlcnRFcnJvcklkOiBcIkRlZmF1bHREaWFsb2dBbGVydEVycm9yVXRpbGl0eTAxXCIsXG4gIERpYWxvZ1Byb21wdElkOiBcIkRlZmF1bHREaWFsb2dQcm9tcHRVdGlsaXR5MDFcIixcbiAgRGlhbG9nTG9hZGluZ0lkOiBcIkRlZmF1bHREaWFsb2dMb2FkaW5nMDFcIixcbiAgRGlhbG9nSWQ6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwMVwiLFxuICBEaWFsb2dJZDAyOiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDJcIixcbiAgRGlhbG9nSWQwMzogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTAzXCIsXG4gIERpYWxvZ0lkMDQ6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwNFwiLFxuICBEaWFsb2dJZDA1OiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDVcIixcbiAgRGlhbG9nSWQwNjogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTA2XCIsXG4gIERpYWxvZ0lkMDc6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwN1wiLFxuICBEaWFsb2dJZDA4OiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDhcIixcbiAgRGlhbG9nSWQwOTogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTA5XCIsXG4gIERpYWxvZ0lkMTA6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkxMFwiLFxuICBEaWFsb2dOZXdXaW5kb3dJZDogXCJEaWFsb2dOZXdXaW5kb3dJZDAxXCIsXG4gIERpYWxvZ1dvcmtGbG93Rm9ybUlkOiBcIkRlZmF1bHREaWFsb2dXb3JrRmxvd0Zvcm1JZFV0aWxpdHkwMVwiLFxuICBfR2V0RWxlbTogZnVuY3Rpb24gX0dldEVsZW0oZGlhbG9nSWQpIHtcbiAgICByZXR1cm4gJChcIiNcIiArIGRpYWxvZ0lkKTtcbiAgfSxcbiAgX0NyZWF0ZURpYWxvZ0VsZW06IGZ1bmN0aW9uIF9DcmVhdGVEaWFsb2dFbGVtKGRvY09iaiwgZGlhbG9nSWQpIHtcbiAgICBpZiAodGhpcy5fR2V0RWxlbShkaWFsb2dJZCkubGVuZ3RoID09IDApIHtcbiAgICAgIHZhciBkaWFsb2dFbGUgPSAkKFwiPGRpdiBpZD1cIiArIGRpYWxvZ0lkICsgXCIgdGl0bGU9J+ezu+e7n+aPkOekuicgc3R5bGU9J2Rpc3BsYXk6bm9uZSc+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gICAgICAkKGRvY09iai5ib2R5KS5hcHBlbmQoZGlhbG9nRWxlKTtcbiAgICAgIHJldHVybiBkaWFsb2dFbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKTtcbiAgICB9XG4gIH0sXG4gIF9DcmVhdGVBbGVydExvYWRpbmdNc2dFbGVtZW50OiBmdW5jdGlvbiBfQ3JlYXRlQWxlcnRMb2FkaW5nTXNnRWxlbWVudChkb2NPYmosIGRpYWxvZ0lkKSB7XG4gICAgaWYgKHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpLmxlbmd0aCA9PSAwKSB7XG4gICAgICB2YXIgZGlhbG9nRWxlID0gJChcIjxkaXYgaWQ9XCIgKyBkaWFsb2dJZCArIFwiIHRpdGxlPSfns7vnu5/mj5DnpLonIHN0eWxlPSdkaXNwbGF5Om5vbmUnPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsZHMtcmluZ1xcXCI+PGRpdj48L2Rpdj48ZGl2PjwvZGl2PjxkaXY+PC9kaXY+PGRpdj48L2Rpdj48L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nYWxlcnQtbG9hZGluZy10eHQtb3V0ZXInPjxkaXYgY2xhc3M9J2FsZXJ0LWxvYWRpbmctdHh0Jz48L2Rpdj48L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gICAgICAkKGRvY09iai5ib2R5KS5hcHBlbmQoZGlhbG9nRWxlKTtcbiAgICAgIHJldHVybiBkaWFsb2dFbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKTtcbiAgICB9XG4gIH0sXG4gIF9DcmVhdGVJZnJhbWVEaWFsb2dFbGVtZW50OiBmdW5jdGlvbiBfQ3JlYXRlSWZyYW1lRGlhbG9nRWxlbWVudChkb2NPYmosIGRpYWxvZ0lkLCB1cmwpIHtcbiAgICB2YXIgZGlhbG9nRWxlID0gJChcIjxkaXYgaWQ9XCIgKyBkaWFsb2dJZCArIFwiIHRpdGxlPSdCYXNpYyBkaWFsb2cnPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpZnJhbWUgbmFtZT0nZGlhbG9nSWZyYW1lJyB3aWR0aD0nMTAwJScgaGVpZ2h0PSc5OCUnIGZyYW1lYm9yZGVyPScwJz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2lmcmFtZT5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgICAkKGRvY09iai5ib2R5KS5hcHBlbmQoZGlhbG9nRWxlKTtcbiAgICByZXR1cm4gZGlhbG9nRWxlO1xuICB9LFxuICBfVGVzdERpYWxvZ0VsZW1Jc0V4aXN0OiBmdW5jdGlvbiBfVGVzdERpYWxvZ0VsZW1Jc0V4aXN0KGRpYWxvZ0lkKSB7XG4gICAgaWYgKHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgX1Rlc3RSdW5FbmFibGU6IGZ1bmN0aW9uIF9UZXN0UnVuRW5hYmxlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBSZW1vdmVEaWFsb2dSZW1haW5pbmdFbGVtOiBmdW5jdGlvbiBSZW1vdmVEaWFsb2dSZW1haW5pbmdFbGVtKGRpYWxvZ0lkKSB7XG4gICAgJChcIlthcmlhLWRlc2NyaWJlZGJ5PSdcIiArIGRpYWxvZ0lkICsgXCInXVwiKS5yZW1vdmUoKTtcbiAgfSxcbiAgQWxlcnRFcnJvcjogZnVuY3Rpb24gQWxlcnRFcnJvcihvcGVuZXJXaW5kb3csIGRpYWxvZ0lkLCBjb25maWcsIGh0bWxNc2csIHNGdW5jLCB0aW1lQ2xvc3VyZSkge1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiBcImF1dG9cIixcbiAgICAgIHdpZHRoOiBcImF1dG9cIixcbiAgICAgIHRpdGxlOiBcIumUmeivr+aPkOekulwiXG4gICAgfTtcbiAgICBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgdGhpcy5BbGVydChvcGVuZXJXaW5kb3csIGRpYWxvZ0lkLCBkZWZhdWx0Q29uZmlnLCBodG1sTXNnLCBzRnVuYywgdGltZUNsb3N1cmUpO1xuICB9LFxuICBBbGVydFRleHQ6IGZ1bmN0aW9uIEFsZXJ0VGV4dCh0ZXh0LCBjYWxsZXIsIHRpbWVDbG9zdXJlKSB7XG4gICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHRleHQsIG51bGwsIGNhbGxlciwgdGltZUNsb3N1cmUpO1xuICB9LFxuICBBbGVydDogZnVuY3Rpb24gQWxlcnQob3BlbmVyV2luZG93LCBkaWFsb2dJZCwgY29uZmlnLCBodG1sTXNnLCBzRnVuYywgY2FsbGVyLCB0aW1lQ2xvc3VyZSkge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlbmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIFwi5YWz6ZetXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvcGVuOiBmdW5jdGlvbiBvcGVuKCkge30sXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgIGlmIChzRnVuYykge1xuICAgICAgICAgIGlmIChjYWxsZXIpIHtcbiAgICAgICAgICAgIHNGdW5jLmNhbGwoY2FsbGVyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc0Z1bmMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBoaWRlOiB7XG4gICAgICAgIGVmZmVjdDogXCJmYWRlXCIsXG4gICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgIH1cbiAgICB9O1xuICAgIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxNc2cpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcblxuICAgIGlmICh0aW1lQ2xvc3VyZSkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKGRpYWxvZ0lkKTtcbiAgICAgIH0sIDEwMDAgKiB0aW1lQ2xvc3VyZSk7XG4gICAgfVxuICB9LFxuICBBbGVydEpzb25Db2RlOiBmdW5jdGlvbiBBbGVydEpzb25Db2RlKGpzb24sIHRpbWVDbG9zdXJlKSB7XG4gICAgaWYgKF90eXBlb2YoanNvbikgPT0gXCJvYmplY3RcIikge1xuICAgICAganNvbiA9IEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZ0Zvcm1hdChqc29uKTtcbiAgICB9XG5cbiAgICBqc29uID0ganNvbi5yZXBsYWNlKC8mL2csICcmJykucmVwbGFjZSgvPC9nLCAnPCcpLnJlcGxhY2UoLz4vZywgJz4nKTtcbiAgICBqc29uID0ganNvbi5yZXBsYWNlKC8oXCIoXFxcXHVbYS16QS1aMC05XXs0fXxcXFxcW151XXxbXlxcXFxcIl0pKlwiKFxccyo6KT98XFxiKHRydWV8ZmFsc2V8bnVsbClcXGJ8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8pL2csIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgdmFyIGNscyA9ICdqc29uLW51bWJlcic7XG5cbiAgICAgIGlmICgvXlwiLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICBpZiAoLzokLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICAgIGNscyA9ICdqc29uLWtleSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2xzID0gJ2pzb24tc3RyaW5nJztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgvdHJ1ZXxmYWxzZS8udGVzdChtYXRjaCkpIHtcbiAgICAgICAgY2xzID0gJ2pzb24tYm9vbGVhbic7XG4gICAgICB9IGVsc2UgaWYgKC9udWxsLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICBjbHMgPSAnanNvbi1udWxsJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIicgKyBjbHMgKyAnXCI+JyArIG1hdGNoICsgJzwvc3Bhbj4nO1xuICAgIH0pO1xuXG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbSh3aW5kb3cuZG9jdW1lbnQuYm9keSwgdGhpcy5EaWFsb2dBbGVydElkKTtcblxuICAgIHZhciB0aXRsZSA9IFwi57O757uf5o+Q56S6XCI7XG5cbiAgICBpZiAodGltZUNsb3N1cmUpIHtcbiAgICAgIHRpdGxlICs9IFwiIFsgXCIgKyB0aW1lQ2xvc3VyZSArIFwi56eS5ZCO6Ieq5Yqo5YWz6ZetIF1cIjtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIGhlaWdodDogNjAwLFxuICAgICAgd2lkdGg6IDkwMCxcbiAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLlhbPpl61cIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCLlpI3liLblubblhbPpl61cIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICBCYXNlVXRpbGl0eS5Db3B5VmFsdWVDbGlwYm9hcmQoJChcIi5qc29uLXByZVwiKS50ZXh0KCkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb3BlbjogZnVuY3Rpb24gb3BlbigpIHt9LFxuICAgICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKCkge30sXG4gICAgICBoaWRlOiB7XG4gICAgICAgIGVmZmVjdDogXCJmYWRlXCIsXG4gICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgIH1cbiAgICB9O1xuICAgICQoaHRtbEVsZW0pLmh0bWwoXCI8ZGl2IGlkPSdwc2NvbnRhaW5lcicgc3R5bGU9J3dpZHRoOiAxMDAlO2hlaWdodDogMTAwJTtvdmVyZmxvdzogYXV0bztwb3NpdGlvbjogcmVsYXRpdmU7Jz48cHJlIGNsYXNzPSdqc29uLXByZSc+XCIgKyBqc29uICsgXCI8L3ByZT48L2Rpdj5cIik7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuXG4gICAgaWYgKHRpbWVDbG9zdXJlKSB7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkKTtcbiAgICAgIH0sIDEwMDAgKiB0aW1lQ2xvc3VyZSk7XG4gICAgfVxuXG4gICAgdmFyIHBzID0gbmV3IFBlcmZlY3RTY3JvbGxiYXIoJyNwc2NvbnRhaW5lcicpO1xuICB9LFxuICBTaG93SFRNTDogZnVuY3Rpb24gU2hvd0hUTUwob3BlbmVyV2luZG93LCBkaWFsb2dJZCwgY29uZmlnLCBodG1sTXNnLCBjbG9zZV9hZnRlcl9ldmVudCwgcGFyYW1zKSB7XG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbShvcGVuZXJXaW5kb3cuZG9jdW1lbnQuYm9keSwgZGlhbG9nSWQpO1xuXG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZShldmVudCwgdWkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNsb3NlX2FmdGVyX2V2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY2xvc2VfYWZ0ZXJfZXZlbnQocGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgICQoaHRtbEVsZW0pLmh0bWwoaHRtbE1zZyk7XG4gICAgcmV0dXJuICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcbiAgfSxcbiAgU2hvd0J5RWxlbUlkOiBmdW5jdGlvbiBTaG93QnlFbGVtSWQoZWxlbUlkLCBjb25maWcsIGNsb3NlX2FmdGVyX2V2ZW50LCBwYXJhbXMsIGNhbGxlcikge1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjbG9zZV9hZnRlcl9ldmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNsb3NlX2FmdGVyX2V2ZW50KHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICByZXR1cm4gJChcIiNcIiArIGVsZW1JZCkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICB9LFxuICBDbG9zZUJ5RWxlbUlkOiBmdW5jdGlvbiBDbG9zZUJ5RWxlbUlkKGVsZW1JZCkge1xuICAgIHJldHVybiAkKFwiI1wiICsgZWxlbUlkKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgfSxcbiAgRGVzdHJveUJ5RWxlbUlkOiBmdW5jdGlvbiBEZXN0cm95QnlFbGVtSWQoZWxlbUlkKSB7XG4gICAgcmV0dXJuICQoXCIjXCIgKyBlbGVtSWQpLmRpYWxvZyhcImRlc3Ryb3lcIik7XG4gIH0sXG4gIEFsZXJ0TG9hZGluZzogZnVuY3Rpb24gQWxlcnRMb2FkaW5nKG9wZW5lcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbE1zZykge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZUFsZXJ0TG9hZGluZ01zZ0VsZW1lbnQob3BlbmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAxNDAsXG4gICAgICB3aWR0aDogMzUwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWVcbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuZmluZChcIi5hbGVydC1sb2FkaW5nLXR4dFwiKS5odG1sKGh0bWxNc2cgPyBodG1sTXNnIDogXCLns7vnu5/lpITnkIbkuK0s6K+356iN5YCZ44CCXCIpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcbiAgfSxcbiAgQ29uZmlybTogZnVuY3Rpb24gQ29uZmlybShvcGVuZXJXaW5kb3csIGh0bWxNc2csIG9rRm4sIGNhbGxlcikge1xuICAgIHRoaXMuQ29uZmlybUNvbmZpZyhvcGVuZXJXaW5kb3csIGh0bWxNc2csIG51bGwsIG9rRm4sIGNhbGxlcik7XG4gIH0sXG4gIENvbmZpcm1Db25maWc6IGZ1bmN0aW9uIENvbmZpcm1Db25maWcob3BlbmVyV2luZG93LCBodG1sTXNnLCBjb25maWcsIG9rRm4sIGNhbGxlcikge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlbmVyV2luZG93LmRvY3VtZW50LmJvZHksIFwiQWxlcnRDb25maXJtTXNnXCIpO1xuXG4gICAgdmFyIHBhcmFzID0gbnVsbDtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIG9rZnVuYzogZnVuY3Rpb24gb2tmdW5jKHBhcmFzKSB7XG4gICAgICAgIGlmIChva0ZuICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChjYWxsZXIpIHtcbiAgICAgICAgICAgIG9rRm4uY2FsbChjYWxsZXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gb2tGbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVuZXJXaW5kb3cuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNhbmNlbGZ1bmM6IGZ1bmN0aW9uIGNhbmNlbGZ1bmMocGFyYXMpIHt9LFxuICAgICAgdmFsaWRhdGVmdW5jOiBmdW5jdGlvbiB2YWxpZGF0ZWZ1bmMocGFyYXMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgY2xvc2VhZnRlcmZ1bmM6IHRydWUsXG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLnoa7orqRcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdENvbmZpZy52YWxpZGF0ZWZ1bmMocGFyYXMpKSB7XG4gICAgICAgICAgICB2YXIgciA9IGRlZmF1bHRDb25maWcub2tmdW5jKHBhcmFzKTtcbiAgICAgICAgICAgIHIgPSByID09IG51bGwgPyB0cnVlIDogcjtcblxuICAgICAgICAgICAgaWYgKHIgJiYgZGVmYXVsdENvbmZpZy5jbG9zZWFmdGVyZnVuYykge1xuICAgICAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwi5Y+W5raIXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgZGVmYXVsdENvbmZpZy5jYW5jZWxmdW5jKHBhcmFzKTtcblxuICAgICAgICAgIGlmIChkZWZhdWx0Q29uZmlnLmNsb3NlYWZ0ZXJmdW5jKSB7XG4gICAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGNvbmZpZyAmJiBjb25maWcuYnV0dG9ucykge1xuICAgICAgZGVmYXVsdENvbmZpZy5idXR0b25zID0ge307XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxNc2cpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcbiAgICBwYXJhcyA9IHtcbiAgICAgIFwiRWxlbWVudE9ialwiOiBodG1sRWxlbVxuICAgIH07XG4gIH0sXG4gIFByb21wdDogZnVuY3Rpb24gUHJvbXB0KG9wZW5lcldpbmRvdywgY29uZmlnLCBkaWFsb2dJZCwgbGFiZWxNc2csIG9rRnVuYykge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlbmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBwYXJhcyA9IG51bGw7XG4gICAgdmFyIHRleHRBcmVhID0gJChcIjx0ZXh0YXJlYSAvPlwiKTtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIGhlaWdodDogMjAwLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIHRpdGxlOiBcIlwiLFxuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgYnV0dG9uczoge1xuICAgICAgICBcIuehruiupFwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgIGlmICh0eXBlb2Ygb2tGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdmFyIGlucHV0VGV4dCA9IHRleHRBcmVhLnZhbCgpO1xuICAgICAgICAgICAgb2tGdW5jKGlucHV0VGV4dCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgIH0sXG4gICAgICAgIFwi5Y+W5raIXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJCh0ZXh0QXJlYSkuY3NzKFwiaGVpZ2h0XCIsIGRlZmF1bHRDb25maWcuaGVpZ2h0IC0gMTMwKS5jc3MoXCJ3aWR0aFwiLCBcIjEwMCVcIik7XG4gICAgdmFyIGh0bWxDb250ZW50ID0gJChcIjxkaXY+PGRpdiBzdHlsZT0nd2lkdGg6IDEwMCUnPlwiICsgbGFiZWxNc2cgKyBcIu+8mjwvZGl2PjwvZGl2PlwiKS5hcHBlbmQodGV4dEFyZWEpO1xuICAgICQoaHRtbEVsZW0pLmh0bWwoaHRtbENvbnRlbnQpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcbiAgfSxcbiAgRGlhbG9nRWxlbTogZnVuY3Rpb24gRGlhbG9nRWxlbShlbGVtSWQsIGNvbmZpZykge1xuICAgICQoXCIjXCIgKyBlbGVtSWQpLmRpYWxvZyhjb25maWcpO1xuICB9LFxuICBEaWFsb2dFbGVtT2JqOiBmdW5jdGlvbiBEaWFsb2dFbGVtT2JqKGVsZW1PYmosIGNvbmZpZykge1xuICAgICQoZWxlbU9iaikuZGlhbG9nKGNvbmZpZyk7XG4gIH0sXG4gIE9wZW5JZnJhbWVXaW5kb3c6IGZ1bmN0aW9uIE9wZW5JZnJhbWVXaW5kb3cob3BlbmVyd2luZG93LCBkaWFsb2dJZCwgdXJsLCBvcHRpb25zLCB3aHR5cGUpIHtcbiAgICB2YXIgZGVmYXVsdG9wdGlvbnMgPSB7XG4gICAgICBoZWlnaHQ6IDQxMCxcbiAgICAgIHdpZHRoOiA2MDAsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIHRpdGxlOiBcIuezu+e7n1wiLFxuICAgICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKGV2ZW50LCB1aSkge1xuICAgICAgICB2YXIgYXV0b2RpYWxvZ0lkID0gJCh0aGlzKS5hdHRyKFwiaWRcIik7XG4gICAgICAgICQodGhpcykuZmluZChcImlmcmFtZVwiKS5yZW1vdmUoKTtcbiAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICQodGhpcykuZGlhbG9nKFwiZGVzdHJveVwiKTtcbiAgICAgICAgJChcIiNcIiArIGF1dG9kaWFsb2dJZCkucmVtb3ZlKCk7XG5cbiAgICAgICAgaWYgKEJyb3dzZXJJbmZvVXRpbGl0eS5Jc0lFOERvY3VtZW50TW9kZSgpKSB7XG4gICAgICAgICAgQ29sbGVjdEdhcmJhZ2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jbG9zZV9hZnRlcl9ldmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBvcHRpb25zLmNsb3NlX2FmdGVyX2V2ZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmICgkKFwiI0ZvcmZvY3VzXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICQoXCIjRm9yZm9jdXNcIilbMF0uZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICh3aHR5cGUgPT0gMSkge1xuICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgaGVpZ2h0OiA2ODAsXG4gICAgICAgIHdpZHRoOiA5ODBcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDIpIHtcbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgIGhlaWdodDogNjAwLFxuICAgICAgICB3aWR0aDogODAwXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSA0KSB7XG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICBoZWlnaHQ6IDM4MCxcbiAgICAgICAgd2lkdGg6IDQ4MFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gNSkge1xuICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgaGVpZ2h0OiAxODAsXG4gICAgICAgIHdpZHRoOiAzMDBcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLndpZHRoID09IDApIHtcbiAgICAgIG9wdGlvbnMud2lkdGggPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VXaWR0aCgpIC0gMjA7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuaGVpZ2h0ID09IDApIHtcbiAgICAgIG9wdGlvbnMuaGVpZ2h0ID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgLSAxMDtcbiAgICB9XG5cbiAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywgb3B0aW9ucyk7XG4gICAgdmFyIGF1dG9kaWFsb2dJZCA9IGRpYWxvZ0lkO1xuXG4gICAgdmFyIGRpYWxvZ0VsZSA9IHRoaXMuX0NyZWF0ZUlmcmFtZURpYWxvZ0VsZW1lbnQob3BlbmVyd2luZG93LmRvY3VtZW50LCBhdXRvZGlhbG9nSWQsIHVybCk7XG5cbiAgICB2YXIgZGlhbG9nT2JqID0gJChkaWFsb2dFbGUpLmRpYWxvZyhkZWZhdWx0b3B0aW9ucyk7XG4gICAgdmFyICRpZnJhbWVvYmogPSAkKGRpYWxvZ0VsZSkuZmluZChcImlmcmFtZVwiKTtcbiAgICAkaWZyYW1lb2JqLm9uKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoU3RyaW5nVXRpbGl0eS5Jc1NhbWVEb21haW4od2luZG93LmxvY2F0aW9uLmhyZWYsIHVybCkpIHtcbiAgICAgICAgdGhpcy5jb250ZW50V2luZG93LkZyYW1lV2luZG93SWQgPSBhdXRvZGlhbG9nSWQ7XG4gICAgICAgIHRoaXMuY29udGVudFdpbmRvdy5PcGVuZXJXaW5kb3dPYmogPSBvcGVuZXJ3aW5kb3c7XG4gICAgICAgIHRoaXMuY29udGVudFdpbmRvdy5Jc09wZW5Gb3JGcmFtZSA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcIui3qOWfn0lmcmFtZSzml6Dms5Xorr7nva7lsZ7mgKchXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgICRpZnJhbWVvYmouYXR0cihcInNyY1wiLCB1cmwpO1xuICAgIHJldHVybiBkaWFsb2dPYmo7XG4gIH0sXG4gIENsb3NlT3BlbklmcmFtZVdpbmRvdzogZnVuY3Rpb24gQ2xvc2VPcGVuSWZyYW1lV2luZG93KG9wZW5lcndpbmRvdywgZGlhbG9nSWQpIHtcbiAgICBvcGVuZXJ3aW5kb3cuT3BlbmVyV2luZG93T2JqLkRpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coZGlhbG9nSWQpO1xuICB9LFxuICBDbG9zZURpYWxvZ0VsZW06IGZ1bmN0aW9uIENsb3NlRGlhbG9nRWxlbShkaWFsb2dFbGVtKSB7XG4gICAgJChkaWFsb2dFbGVtKS5maW5kKFwiaWZyYW1lXCIpLnJlbW92ZSgpO1xuICAgICQoZGlhbG9nRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG5cbiAgICB0cnkge1xuICAgICAgaWYgKCQoXCIjRm9yZm9jdXNcIikubGVuZ3RoID4gMCkge1xuICAgICAgICAkKFwiI0ZvcmZvY3VzXCIpWzBdLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfSxcbiAgQ2xvc2VEaWFsb2c6IGZ1bmN0aW9uIENsb3NlRGlhbG9nKGRpYWxvZ0lkKSB7XG4gICAgdGhpcy5DbG9zZURpYWxvZ0VsZW0odGhpcy5fR2V0RWxlbShkaWFsb2dJZCkpO1xuICB9LFxuICBPcGVuTmV3V2luZG93OiBmdW5jdGlvbiBPcGVuTmV3V2luZG93KG9wZW5lcndpbmRvdywgZGlhbG9nSWQsIHVybCwgb3B0aW9ucywgd2h0eXBlKSB7XG4gICAgdmFyIHdpZHRoID0gMDtcbiAgICB2YXIgaGVpZ2h0ID0gMDtcblxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICB3aWR0aCA9IG9wdGlvbnMud2lkdGg7XG4gICAgICBoZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcbiAgICB9XG5cbiAgICB2YXIgbGVmdCA9IHBhcnNlSW50KChzY3JlZW4uYXZhaWxXaWR0aCAtIHdpZHRoKSAvIDIpLnRvU3RyaW5nKCk7XG4gICAgdmFyIHRvcCA9IHBhcnNlSW50KChzY3JlZW4uYXZhaWxIZWlnaHQgLSBoZWlnaHQpIC8gMikudG9TdHJpbmcoKTtcblxuICAgIGlmICh3aWR0aC50b1N0cmluZygpID09IFwiMFwiICYmIGhlaWdodC50b1N0cmluZygpID09IFwiMFwiKSB7XG4gICAgICB3aWR0aCA9IHdpbmRvdy5zY3JlZW4uYXZhaWxXaWR0aCAtIDMwO1xuICAgICAgaGVpZ2h0ID0gd2luZG93LnNjcmVlbi5hdmFpbEhlaWdodCAtIDYwO1xuICAgICAgbGVmdCA9IFwiMFwiO1xuICAgICAgdG9wID0gXCIwXCI7XG4gICAgfVxuXG4gICAgdmFyIHdpbkhhbmRsZSA9IHdpbmRvdy5vcGVuKHVybCwgXCJcIiwgXCJzY3JvbGxiYXJzPW5vLHRvb2xiYXI9bm8sbWVudWJhcj1ubyxyZXNpemFibGU9eWVzLGNlbnRlcj15ZXMsaGVscD1ubywgc3RhdHVzPXllcyx0b3A9IFwiICsgdG9wICsgXCJweCxsZWZ0PVwiICsgbGVmdCArIFwicHgsd2lkdGg9XCIgKyB3aWR0aCArIFwicHgsaGVpZ2h0PVwiICsgaGVpZ2h0ICsgXCJweFwiKTtcblxuICAgIGlmICh3aW5IYW5kbGUgPT0gbnVsbCkge1xuICAgICAgYWxlcnQoXCLor7fop6PpmaTmtY/op4jlmajlr7nmnKzns7vnu5/lvLnlh7rnqpflj6PnmoTpmLvmraLorr7nva7vvIFcIik7XG4gICAgfVxuICB9LFxuICBPcGVuTmV3VGFiV2luZG93OiBmdW5jdGlvbiBPcGVuTmV3VGFiV2luZG93KHVybCkge1xuICAgIHZhciBsaW5rID0gJChcIjxhIGhyZWY9J1wiICsgdXJsICsgXCInIHN0eWxlPSdwb3NpdGlvbjphYnNvbHV0ZTt0b3A6IC0xMDBweDt3aWR0aDogMHB4O2hlaWdodDogMHB4JyB0YXJnZXQ9J19ibGFuaycgcmVsPSdvcGVuZXInPjwvYT5cIik7XG4gICAgJCh3aW5kb3cuZG9jdW1lbnQuYm9keSkuYXBwZW5kKGxpbmspO1xuICAgIGxpbmtbMF0uY2xpY2soKTtcbiAgfSxcbiAgX1RyeUdldFBhcmVudFdpbmRvdzogZnVuY3Rpb24gX1RyeUdldFBhcmVudFdpbmRvdyh3aW4pIHtcbiAgICBpZiAod2luLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gd2luLnBhcmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgX0ZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqOiBmdW5jdGlvbiBfRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmood2luLCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKSB7XG4gICAgaWYgKHRyeWZpbmR0aW1lID4gY3VycmVudHRyeWZpbmR0aW1lKSB7XG4gICAgICB2YXIgaXN0b3BGcmFtZXBhZ2UgPSBmYWxzZTtcbiAgICAgIGN1cnJlbnR0cnlmaW5kdGltZSsrO1xuXG4gICAgICB0cnkge1xuICAgICAgICBpc3RvcEZyYW1lcGFnZSA9IHdpbi5Jc1RvcEZyYW1lUGFnZTtcblxuICAgICAgICBpZiAoaXN0b3BGcmFtZXBhZ2UpIHtcbiAgICAgICAgICByZXR1cm4gd2luO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaih0aGlzLl9UcnlHZXRQYXJlbnRXaW5kb3cod2luKSwgdHJ5ZmluZHRpbWUsIGN1cnJlbnR0cnlmaW5kdGltZSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0ZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqKHRoaXMuX1RyeUdldFBhcmVudFdpbmRvdyh3aW4pLCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgX09wZW5XaW5kb3dJbkZyYW1lUGFnZTogZnVuY3Rpb24gX09wZW5XaW5kb3dJbkZyYW1lUGFnZShvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSkge1xuICAgIGlmIChTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkoZGlhbG9nSWQpKSB7XG4gICAgICBhbGVydChcImRpYWxvZ0lk5LiN6IO95Li656m6XCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHVybCA9IEJhc2VVdGlsaXR5LkFwcGVuZFRpbWVTdGFtcFVybCh1cmwpO1xuICAgIHZhciBhdXRvZGlhbG9nSWQgPSBcIkZyYW1lRGlhbG9nRWxlXCIgKyBkaWFsb2dJZDtcblxuICAgIGlmICgkKHRoaXMuRnJhbWVQYWdlUmVmLmRvY3VtZW50KS5maW5kKFwiI1wiICsgYXV0b2RpYWxvZ0lkKS5sZW5ndGggPT0gMCkge1xuICAgICAgdmFyIGRpYWxvZ0VsZSA9IHRoaXMuX0NyZWF0ZUlmcmFtZURpYWxvZ0VsZW1lbnQodGhpcy5GcmFtZVBhZ2VSZWYuZG9jdW1lbnQsIGF1dG9kaWFsb2dJZCwgdXJsKTtcblxuICAgICAgdmFyIGRlZmF1bHRvcHRpb25zID0ge1xuICAgICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgICAgd2lkdGg6IDYwMCxcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHRpdGxlOiBcIuezu+e7n1wiLFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgdmFyIGF1dG9kaWFsb2dJZCA9ICQodGhpcykuYXR0cihcImlkXCIpO1xuICAgICAgICAgICQodGhpcykuZmluZChcImlmcmFtZVwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAkKHRoaXMpLmRpYWxvZyhcImRlc3Ryb3lcIik7XG4gICAgICAgICAgJChcIiNcIiArIGF1dG9kaWFsb2dJZCkucmVtb3ZlKCk7XG5cbiAgICAgICAgICBpZiAoQnJvd3NlckluZm9VdGlsaXR5LklzSUU4RG9jdW1lbnRNb2RlKCkpIHtcbiAgICAgICAgICAgIENvbGxlY3RHYXJiYWdlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNsb3NlX2FmdGVyX2V2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgb3B0aW9ucy5jbG9zZV9hZnRlcl9ldmVudCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKHdodHlwZSA9PSAwKSB7XG4gICAgICAgIG9wdGlvbnMud2lkdGggPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VXaWR0aCgpIC0gMjA7XG4gICAgICAgIG9wdGlvbnMuaGVpZ2h0ID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgLSAxODA7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSAxKSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiA2MTAsXG4gICAgICAgICAgd2lkdGg6IDk4MFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDIpIHtcbiAgICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgICB3aWR0aDogODAwXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gNCkge1xuICAgICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICAgIGhlaWdodDogMzgwLFxuICAgICAgICAgIHdpZHRoOiA0ODBcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSA1KSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiAxODAsXG4gICAgICAgICAgd2lkdGg6IDMwMFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMud2lkdGggPT0gMCkge1xuICAgICAgICBvcHRpb25zLndpZHRoID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKSAtIDIwO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5oZWlnaHQgPT0gMCkge1xuICAgICAgICBvcHRpb25zLmhlaWdodCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIC0gMTgwO1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAkKGRpYWxvZ0VsZSkuZGlhbG9nKGRlZmF1bHRvcHRpb25zKTtcbiAgICAgICQoXCIudWktd2lkZ2V0LW92ZXJsYXlcIikuY3NzKFwiekluZGV4XCIsIFwiMjAwMFwiKTtcbiAgICAgICQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCBcIjIwMDFcIik7XG4gICAgICB2YXIgJGlmcmFtZW9iaiA9ICQoZGlhbG9nRWxlKS5maW5kKFwiaWZyYW1lXCIpO1xuICAgICAgJGlmcmFtZW9iai5vbihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoU3RyaW5nVXRpbGl0eS5Jc1NhbWVEb21haW4od2luZG93LmxvY2F0aW9uLmhyZWYsIHVybCkpIHtcbiAgICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuRnJhbWVXaW5kb3dJZCA9IGF1dG9kaWFsb2dJZDtcbiAgICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuT3BlbmVyV2luZG93T2JqID0gb3BlbmVyd2luZG93O1xuICAgICAgICAgIHRoaXMuY29udGVudFdpbmRvdy5Jc09wZW5Gb3JGcmFtZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCLot6jln59JZnJhbWUs5peg5rOV6K6+572u5bGe5oCnIVwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAkaWZyYW1lb2JqLmF0dHIoXCJzcmNcIiwgdXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJChcIiNcIiArIGF1dG9kaWFsb2dJZCkuZGlhbG9nKFwibW92ZVRvVG9wXCIpO1xuICAgIH1cbiAgfSxcbiAgX0ZyYW1lX0ZyYW1lUGFnZUNsb3NlRGlhbG9nOiBmdW5jdGlvbiBfRnJhbWVfRnJhbWVQYWdlQ2xvc2VEaWFsb2coZGlhbG9nSWQpIHtcbiAgICAkKFwiI1wiICsgZGlhbG9nSWQpLmRpYWxvZyhcImNsb3NlXCIpO1xuICB9LFxuICBGcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iajogZnVuY3Rpb24gRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmooKSB7XG4gICAgdmFyIHRyeWZpbmR0aW1lID0gNTtcbiAgICB2YXIgY3VycmVudHRyeWZpbmR0aW1lID0gMTtcbiAgICByZXR1cm4gdGhpcy5fRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmood2luZG93LCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKTtcbiAgfSxcbiAgRnJhbWVfQWxlcnQ6IGZ1bmN0aW9uIEZyYW1lX0FsZXJ0KCkge30sXG4gIEZyYW1lX0NvbmZpcm06IGZ1bmN0aW9uIEZyYW1lX0NvbmZpcm0oKSB7fSxcbiAgRnJhbWVfT3BlbklmcmFtZVdpbmRvdzogZnVuY3Rpb24gRnJhbWVfT3BlbklmcmFtZVdpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSwgbm90RnJhbWVPcGVuSW5DdXJyKSB7XG4gICAgaWYgKHVybCA9PSBcIlwiKSB7XG4gICAgICBhbGVydChcInVybOS4jeiDveS4uuepuuWtl+espuS4siFcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFub3RGcmFtZU9wZW5JbkN1cnIpIHtcbiAgICAgIG5vdEZyYW1lT3BlbkluQ3VyciA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciB3cndpbiA9IHRoaXMuRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmooKTtcbiAgICB0aGlzLkZyYW1lUGFnZVJlZiA9IHdyd2luO1xuXG4gICAgaWYgKHdyd2luICE9IG51bGwpIHtcbiAgICAgIHRoaXMuRnJhbWVQYWdlUmVmLkRpYWxvZ1V0aWxpdHkuRnJhbWVQYWdlUmVmID0gd3J3aW47XG5cbiAgICAgIHRoaXMuRnJhbWVQYWdlUmVmLkRpYWxvZ1V0aWxpdHkuX09wZW5XaW5kb3dJbkZyYW1lUGFnZShvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChub3RGcmFtZU9wZW5JbkN1cnIpIHtcbiAgICAgICAgdGhpcy5PcGVuSWZyYW1lV2luZG93KG9wZW5lcndpbmRvdywgZGlhbG9nSWQsIHVybCwgb3B0aW9ucywgd2h0eXBlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwi5om+5LiN5YiwRnJhbWVQYWdlISFcIik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBGcmFtZV9DbG9zZURpYWxvZzogZnVuY3Rpb24gRnJhbWVfQ2xvc2VEaWFsb2cob3BlbmVyV2luZG93KSB7XG4gICAgdmFyIHdyd2luID0gdGhpcy5GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaigpO1xuICAgIHZhciBvcGVuZXJ3aW4gPSBvcGVuZXJXaW5kb3cuT3BlbmVyV2luZG93T2JqO1xuICAgIHZhciBhdXRvZGlhbG9nSWQgPSBvcGVuZXJXaW5kb3cuRnJhbWVXaW5kb3dJZDtcblxuICAgIHdyd2luLkRpYWxvZ1V0aWxpdHkuX0ZyYW1lX0ZyYW1lUGFnZUNsb3NlRGlhbG9nKGF1dG9kaWFsb2dJZCk7XG4gIH0sXG4gIFRvYXN0TWVzc2FnZTogZnVuY3Rpb24gVG9hc3RNZXNzYWdlKHNlbmRlciwgbWVzc2FnZSkge1xuICAgIHNlbmRlci4kTWVzc2FnZVsnc3VjY2VzcyddKHtcbiAgICAgIGJhY2tncm91bmQ6IHRydWUsXG4gICAgICBjb250ZW50OiBtZXNzYWdlXG4gICAgfSk7XG4gIH0sXG4gIFRvYXN0RXJyb3JNZXNzYWdlOiBmdW5jdGlvbiBUb2FzdEVycm9yTWVzc2FnZShzZW5kZXIsIG1lc3NhZ2UpIHtcbiAgICBzZW5kZXIuJE1lc3NhZ2VbJ2Vycm9yJ10oe1xuICAgICAgYmFja2dyb3VuZDogdHJ1ZSxcbiAgICAgIGNvbnRlbnQ6IG1lc3NhZ2VcbiAgICB9KTtcbiAgfSxcbiAgVG9hc3RXYXJuaW5nTWVzc2FnZTogZnVuY3Rpb24gVG9hc3RXYXJuaW5nTWVzc2FnZShzZW5kZXIsIG1lc3NhZ2UpIHtcbiAgICBzZW5kZXIuJE1lc3NhZ2VbJ3dhcm5pbmcnXSh7XG4gICAgICBiYWNrZ3JvdW5kOiB0cnVlLFxuICAgICAgY29udGVudDogbWVzc2FnZVxuICAgIH0pO1xuICB9LFxuICBUb2FzdEluZm9NZXNzYWdlOiBmdW5jdGlvbiBUb2FzdEluZm9NZXNzYWdlKHNlbmRlciwgbWVzc2FnZSkge1xuICAgIHNlbmRlci4kTWVzc2FnZVsnaW5mbyddKHtcbiAgICAgIGJhY2tncm91bmQ6IHRydWUsXG4gICAgICBjb250ZW50OiBtZXNzYWdlXG4gICAgfSk7XG4gIH0sXG4gIFNob3dTZWxlY3RJbWFnZUNsYXNzRGlhbG9nOiBmdW5jdGlvbiBTaG93U2VsZWN0SW1hZ2VDbGFzc0RpYWxvZyhvcHRpb25zLCBzdXJlRnVuYywgY2FuY2VsRnVuYywgZml4UGF0aCkge1xuICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGhlaWdodDogNTQwLFxuICAgICAgd2lkdGg6IDgwMCxcbiAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgdGl0bGU6IFwi6YCJ5oup5Zu+5qCHXCIsXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7fVxuICAgIH07XG4gICAgZGVmYXVsdE9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHZhciB2aWV3VXJsID0gXCJIVE1ML1NlbGVjdERpYWxvZy9TZWxlY3RMaW5lQXdlc29tZUNsYXNzLmh0bWxcIjtcblxuICAgIGlmIChmaXhQYXRoKSB7XG4gICAgICB2aWV3VXJsID0gZml4UGF0aCArIHZpZXdVcmw7XG4gICAgfVxuXG4gICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKHZpZXdVcmwsIHtcbiAgICAgIHN1cmVGdW5jOiBzdXJlRnVuYyxcbiAgICAgIGNhbmNlbEZ1bmM6IGNhbmNlbEZ1bmNcbiAgICB9KTtcbiAgICB0aGlzLk9wZW5JZnJhbWVXaW5kb3cod2luZG93LCBcIlNob3dTZWxlY3RJbWFnZUNsYXNzRGlhbG9nXCIsIHVybCwgZGVmYXVsdE9wdGlvbnMsIDIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGljdGlvbmFyeVV0aWxpdHkgPSB7XG4gIF9Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb246IG51bGwsXG4gIEdyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbjogZnVuY3Rpb24gR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uKHNvdXJjZURpY3Rpb25hcnlKc29uKSB7XG4gICAgaWYgKHRoaXMuX0dyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbiA9PSBudWxsKSB7XG4gICAgICBpZiAoc291cmNlRGljdGlvbmFyeUpzb24gIT0gbnVsbCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICAgICAgZm9yICh2YXIgZ3JvdXBWYWx1ZSBpbiBzb3VyY2VEaWN0aW9uYXJ5SnNvbikge1xuICAgICAgICAgIHJlc3VsdFtncm91cFZhbHVlXSA9IHt9O1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0W2dyb3VwVmFsdWVdW3NvdXJjZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdW2ldLmRpY3RWYWx1ZV0gPSBzb3VyY2VEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXVtpXS5kaWN0VGV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb24gPSByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX0dyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEhhcmREaXNrVXRpbGl0eSA9IHtcbiAgQnl0ZUNvbnZlcnQ6IGZ1bmN0aW9uIEJ5dGVDb252ZXJ0KGJ5dGVzKSB7XG4gICAgaWYgKGlzTmFOKGJ5dGVzKSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHZhciBzeW1ib2xzID0gWydieXRlcycsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddO1xuICAgIHZhciBleHAgPSBNYXRoLmZsb29yKE1hdGgubG9nKGJ5dGVzKSAvIE1hdGgubG9nKDIpKTtcblxuICAgIGlmIChleHAgPCAxKSB7XG4gICAgICBleHAgPSAwO1xuICAgIH1cblxuICAgIHZhciBpID0gTWF0aC5mbG9vcihleHAgLyAxMCk7XG4gICAgYnl0ZXMgPSBieXRlcyAvIE1hdGgucG93KDIsIDEwICogaSk7XG5cbiAgICBpZiAoYnl0ZXMudG9TdHJpbmcoKS5sZW5ndGggPiBieXRlcy50b0ZpeGVkKDIpLnRvU3RyaW5nKCkubGVuZ3RoKSB7XG4gICAgICBieXRlcyA9IGJ5dGVzLnRvRml4ZWQoMik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ5dGVzICsgJyAnICsgc3ltYm9sc1tpXTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNvbnNvbGUgPSBjb25zb2xlIHx8IHtcbiAgbG9nOiBmdW5jdGlvbiBsb2coKSB7fSxcbiAgd2FybjogZnVuY3Rpb24gd2FybigpIHt9LFxuICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7fVxufTtcblxuZnVuY3Rpb24gRGF0ZUV4dGVuZF9EYXRlRm9ybWF0KGRhdGUsIGZtdCkge1xuICBpZiAobnVsbCA9PSBkYXRlIHx8IHVuZGVmaW5lZCA9PSBkYXRlKSByZXR1cm4gJyc7XG4gIHZhciBvID0ge1xuICAgIFwiTStcIjogZGF0ZS5nZXRNb250aCgpICsgMSxcbiAgICBcImQrXCI6IGRhdGUuZ2V0RGF0ZSgpLFxuICAgIFwiaCtcIjogZGF0ZS5nZXRIb3VycygpLFxuICAgIFwibStcIjogZGF0ZS5nZXRNaW51dGVzKCksXG4gICAgXCJzK1wiOiBkYXRlLmdldFNlY29uZHMoKSxcbiAgICBcIlNcIjogZGF0ZS5nZXRNaWxsaXNlY29uZHMoKVxuICB9O1xuICBpZiAoLyh5KykvLnRlc3QoZm10KSkgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCAoZGF0ZS5nZXRGdWxsWWVhcigpICsgXCJcIikuc3Vic3RyKDQgLSBSZWdFeHAuJDEubGVuZ3RoKSk7XG5cbiAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoXCIoXCIgKyBrICsgXCIpXCIpLnRlc3QoZm10KSkgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCBSZWdFeHAuJDEubGVuZ3RoID09IDEgPyBvW2tdIDogKFwiMDBcIiArIG9ba10pLnN1YnN0cigoXCJcIiArIG9ba10pLmxlbmd0aCkpO1xuICB9XG5cbiAgcmV0dXJuIGZtdDtcbn1cblxuRGF0ZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gRGF0ZUV4dGVuZF9EYXRlRm9ybWF0KHRoaXMsICd5eXl5LU1NLWRkIG1tOmhoOnNzJyk7XG59O1xuXG5pZiAoIU9iamVjdC5jcmVhdGUpIHtcbiAgT2JqZWN0LmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBhbGVydChcIkV4dGVuZCBPYmplY3QuY3JlYXRlXCIpO1xuXG4gICAgZnVuY3Rpb24gRigpIHt9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG8pIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignT2JqZWN0LmNyZWF0ZSBpbXBsZW1lbnRhdGlvbiBvbmx5IGFjY2VwdHMgb25lIHBhcmFtZXRlci4nKTtcbiAgICAgIH1cblxuICAgICAgRi5wcm90b3R5cGUgPSBvO1xuICAgICAgcmV0dXJuIG5ldyBGKCk7XG4gICAgfTtcbiAgfSgpO1xufVxuXG4kLmZuLm91dGVySFRNTCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICF0aGlzLmxlbmd0aCA/IHRoaXMgOiB0aGlzWzBdLm91dGVySFRNTCB8fCBmdW5jdGlvbiAoZWwpIHtcbiAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGVsLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgdmFyIGNvbnRlbnRzID0gZGl2LmlubmVySFRNTDtcbiAgICBkaXYgPSBudWxsO1xuICAgIGFsZXJ0KGNvbnRlbnRzKTtcbiAgICByZXR1cm4gY29udGVudHM7XG4gIH0odGhpc1swXSk7XG59O1xuXG5mdW5jdGlvbiByZWZDc3NMaW5rKGhyZWYpIHtcbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gIHN0eWxlLnJlbCA9ICdzdHlsZXNoZWV0JztcbiAgc3R5bGUuaHJlZiA9IGhyZWY7XG4gIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICByZXR1cm4gc3R5bGUuc2hlZXQgfHwgc3R5bGUuc3R5bGVTaGVldDtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEpCdWlsZDREQ1lhbWwgPSB7XG4gIF9jbGllbnRDbGllbnRTeXN0ZW1UaXRsZTogbnVsbCxcbiAgX2NsaWVudENsaWVudFN5c3RlbUNhcHRpb246IG51bGwsXG4gIEdldENsaWVudFN5c3RlbVRpdGxlOiBmdW5jdGlvbiBHZXRDbGllbnRTeXN0ZW1UaXRsZSgpIHtcbiAgICB2YXIgc3RvcmVLZXkgPSBcIkpCdWlsZDREQ1lhbWwuX2NsaWVudENsaWVudFN5c3RlbVRpdGxlXCI7XG5cbiAgICBpZiAoTG9jYWxTdG9yYWdlVXRpbGl0eS5nZXRJdGVtSW5TZXNzaW9uU3RvcmFnZShzdG9yZUtleSkpIHtcbiAgICAgIHJldHVybiBMb2NhbFN0b3JhZ2VVdGlsaXR5LmdldEl0ZW1JblNlc3Npb25TdG9yYWdlKHN0b3JlS2V5KTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2NsaWVudENsaWVudFN5c3RlbVRpdGxlKSB7XG4gICAgICBpZiAoIXdpbmRvdy5wYXJlbnQuSkJ1aWxkNERDWWFtbC5fY2xpZW50Q2xpZW50U3lzdGVtVGl0bGUpIHtcbiAgICAgICAgQWpheFV0aWxpdHkuR2V0U3luYyhcIi9SZXN0L0pCdWlsZDREQ1lhbWwvR2V0Q2xpZW50U3lzdGVtVGl0bGVcIiwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuX2NsaWVudENsaWVudFN5c3RlbVRpdGxlID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgICBMb2NhbFN0b3JhZ2VVdGlsaXR5LnNldEl0ZW1JblNlc3Npb25TdG9yYWdlKHN0b3JlS2V5LCB0aGlzLl9jbGllbnRDbGllbnRTeXN0ZW1UaXRsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NsaWVudENsaWVudFN5c3RlbVRpdGxlID0gd2luZG93LnBhcmVudC5KQnVpbGQ0RENZYW1sLl9jbGllbnRDbGllbnRTeXN0ZW1UaXRsZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fY2xpZW50Q2xpZW50U3lzdGVtVGl0bGU7XG4gIH0sXG4gIEdldENsaWVudFN5c3RlbUNhcHRpb246IGZ1bmN0aW9uIEdldENsaWVudFN5c3RlbUNhcHRpb24oKSB7XG4gICAgQWpheFV0aWxpdHkuR2V0U3luYyhcIi9SZXN0L0pCdWlsZDREQ1lhbWwvR2V0Q2xpZW50U3lzdGVtQ2FwdGlvblwiLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIHRoaXMuX2NsaWVudENsaWVudFN5c3RlbUNhcHRpb24gPSByZXN1bHQuZGF0YTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5fY2xpZW50Q2xpZW50U3lzdGVtQ2FwdGlvbjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEpzb25VdGlsaXR5ID0ge1xuICBQYXJzZUFycmF5SnNvblRvVHJlZUpzb246IGZ1bmN0aW9uIFBhcnNlQXJyYXlKc29uVG9UcmVlSnNvbihjb25maWcsIHNvdXJjZUFycmF5LCByb290SWQpIHtcbiAgICB2YXIgX2NvbmZpZyA9IHtcbiAgICAgIEtleUZpZWxkOiBcIlwiLFxuICAgICAgUmVsYXRpb25GaWVsZDogXCJcIixcbiAgICAgIENoaWxkRmllbGROYW1lOiBcIlwiXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIEZpbmRKc29uQnlJZChrZXlGaWVsZCwgaWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNvdXJjZUFycmF5W2ldW2tleUZpZWxkXSA9PSBpZCkge1xuICAgICAgICAgIHJldHVybiBzb3VyY2VBcnJheVtpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhbGVydChcIlBhcnNlQXJyYXlKc29uVG9UcmVlSnNvbi5GaW5kSnNvbkJ5SWQ65Zyoc291cmNlQXJyYXnkuK3mib7kuI3liLDmjIflrppJZOeahOiusOW9lVwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBGaW5kQ2hpbGRKc29uKHJlbGF0aW9uRmllbGQsIHBpZCkge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzb3VyY2VBcnJheVtpXVtyZWxhdGlvbkZpZWxkXSA9PSBwaWQpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChzb3VyY2VBcnJheVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBGaW5kQ2hpbGROb2RlQW5kUGFyc2UocGlkLCByZXN1bHQpIHtcbiAgICAgIHZhciBjaGlsZGpzb25zID0gRmluZENoaWxkSnNvbihjb25maWcuUmVsYXRpb25GaWVsZCwgcGlkKTtcblxuICAgICAgaWYgKGNoaWxkanNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAocmVzdWx0W2NvbmZpZy5DaGlsZEZpZWxkTmFtZV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVzdWx0W2NvbmZpZy5DaGlsZEZpZWxkTmFtZV0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRqc29ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciB0b09iaiA9IHt9O1xuICAgICAgICAgIHRvT2JqID0gSnNvblV0aWxpdHkuU2ltcGxlQ2xvbmVBdHRyKHRvT2JqLCBjaGlsZGpzb25zW2ldKTtcbiAgICAgICAgICByZXN1bHRbY29uZmlnLkNoaWxkRmllbGROYW1lXS5wdXNoKHRvT2JqKTtcbiAgICAgICAgICB2YXIgaWQgPSB0b09ialtjb25maWcuS2V5RmllbGRdO1xuICAgICAgICAgIEZpbmRDaGlsZE5vZGVBbmRQYXJzZShpZCwgdG9PYmopO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciByb290SnNvbiA9IEZpbmRKc29uQnlJZChjb25maWcuS2V5RmllbGQsIHJvb3RJZCk7XG4gICAgcmVzdWx0ID0gdGhpcy5TaW1wbGVDbG9uZUF0dHIocmVzdWx0LCByb290SnNvbik7XG4gICAgRmluZENoaWxkTm9kZUFuZFBhcnNlKHJvb3RJZCwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBSZXNvbHZlU2ltcGxlQXJyYXlKc29uVG9UcmVlSnNvbjogZnVuY3Rpb24gUmVzb2x2ZVNpbXBsZUFycmF5SnNvblRvVHJlZUpzb24oY29uZmlnLCBzb3VyY2VKc29uLCByb290Tm9kZUlkKSB7XG4gICAgYWxlcnQoXCJKc29uVXRpbGl0eS5SZXNvbHZlU2ltcGxlQXJyYXlKc29uVG9UcmVlSnNvbiDlt7LlgZznlKhcIik7XG4gIH0sXG4gIFNpbXBsZUNsb25lQXR0cjogZnVuY3Rpb24gU2ltcGxlQ2xvbmVBdHRyKHRvT2JqLCBmcm9tT2JqKSB7XG4gICAgZm9yICh2YXIgYXR0ciBpbiBmcm9tT2JqKSB7XG4gICAgICB0b09ialthdHRyXSA9IGZyb21PYmpbYXR0cl07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvT2JqO1xuICB9LFxuICBDbG9uZUFycmF5U2ltcGxlOiBmdW5jdGlvbiBDbG9uZUFycmF5U2ltcGxlKGFycmF5KSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0LnB1c2godGhpcy5DbG9uZVNpbXBsZShhcnJheVtpXSkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIENsb25lU2ltcGxlOiBmdW5jdGlvbiBDbG9uZVNpbXBsZShzb3VyY2UpIHtcbiAgICB2YXIgbmV3SnNvbiA9IGpRdWVyeS5leHRlbmQodHJ1ZSwge30sIHNvdXJjZSk7XG4gICAgcmV0dXJuIG5ld0pzb247XG4gIH0sXG4gIENsb25lU3RyaW5naWZ5OiBmdW5jdGlvbiBDbG9uZVN0cmluZ2lmeShzb3VyY2UpIHtcbiAgICB2YXIgbmV3SnNvbiA9IHRoaXMuSnNvblRvU3RyaW5nKHNvdXJjZSk7XG4gICAgcmV0dXJuIHRoaXMuU3RyaW5nVG9Kc29uKG5ld0pzb24pO1xuICB9LFxuICBDbG9uZU9iamVjdFByb3A6IGZ1bmN0aW9uIENsb25lT2JqZWN0UHJvcChzb3VyY2UsIHByb3BDYWxsQmFjaykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIgY2xvbmVTb3VyY2UgPSB0aGlzLkNsb25lU3RyaW5naWZ5KHNvdXJjZSk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gY2xvbmVTb3VyY2UpIHtcbiAgICAgIHZhciBzb3VyY2VQcm9wVmFsdWUgPSBjbG9uZVNvdXJjZVtrZXldO1xuICAgICAgdmFyIG5ld1Byb3BWYWx1ZTtcblxuICAgICAgaWYgKHR5cGVvZiBwcm9wQ2FsbEJhY2sgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIG5ld1Byb3BWYWx1ZSA9IHByb3BDYWxsQmFjayhrZXksIHNvdXJjZVByb3BWYWx1ZSk7XG5cbiAgICAgICAgaWYgKCFuZXdQcm9wVmFsdWUpIHtcbiAgICAgICAgICBuZXdQcm9wVmFsdWUgPSBzb3VyY2VQcm9wVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVzdWx0W2tleV0gPSBuZXdQcm9wVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgSnNvblRvU3RyaW5nOiBmdW5jdGlvbiBKc29uVG9TdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH0sXG4gIEpzb25Ub1N0cmluZ0Zvcm1hdDogZnVuY3Rpb24gSnNvblRvU3RyaW5nRm9ybWF0KG9iaikge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDIpO1xuICB9LFxuICBTdHJpbmdUb0pzb246IGZ1bmN0aW9uIFN0cmluZ1RvSnNvbihzdHIpIHtcbiAgICByZXR1cm4gZXZhbChcIihcIiArIHN0ciArIFwiKVwiKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIExpc3RQYWdlVXRpbGl0eSA9IHtcbiAgRGVmYXVsdExpc3RIZWlnaHQ6IGZ1bmN0aW9uIERlZmF1bHRMaXN0SGVpZ2h0KCkge1xuICAgIGlmIChQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSA+IDc4MCkge1xuICAgICAgcmV0dXJuIDY3ODtcbiAgICB9IGVsc2UgaWYgKFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpID4gNjgwKSB7XG4gICAgICByZXR1cm4gNTc4O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMzc4O1xuICAgIH1cbiAgfSxcbiAgRGVmYXVsdExpc3RIZWlnaHRfNTA6IGZ1bmN0aW9uIERlZmF1bHRMaXN0SGVpZ2h0XzUwKCkge1xuICAgIHJldHVybiB0aGlzLkRlZmF1bHRMaXN0SGVpZ2h0KCkgLSA1MDtcbiAgfSxcbiAgRGVmYXVsdExpc3RIZWlnaHRfODA6IGZ1bmN0aW9uIERlZmF1bHRMaXN0SGVpZ2h0XzgwKCkge1xuICAgIHJldHVybiB0aGlzLkRlZmF1bHRMaXN0SGVpZ2h0KCkgLSA4MDtcbiAgfSxcbiAgRGVmYXVsdExpc3RIZWlnaHRfMTAwOiBmdW5jdGlvbiBEZWZhdWx0TGlzdEhlaWdodF8xMDAoKSB7XG4gICAgcmV0dXJuIHRoaXMuRGVmYXVsdExpc3RIZWlnaHQoKSAtIDEwMDtcbiAgfSxcbiAgR2V0R2VuZXJhbFBhZ2VIZWlnaHQ6IGZ1bmN0aW9uIEdldEdlbmVyYWxQYWdlSGVpZ2h0KGZpeEhlaWdodCkge1xuICAgIHZhciBwYWdlSGVpZ2h0ID0galF1ZXJ5KGRvY3VtZW50KS5oZWlnaHQoKTtcblxuICAgIGlmICgkKFwiI2xpc3Qtc2ltcGxlLXNlYXJjaC13cmFwXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgIHBhZ2VIZWlnaHQgPSBwYWdlSGVpZ2h0IC0gJChcIiNsaXN0LXNpbXBsZS1zZWFyY2gtd3JhcFwiKS5vdXRlckhlaWdodCgpICsgZml4SGVpZ2h0IC0gJChcIiNsaXN0LWJ1dHRvbi13cmFwXCIpLm91dGVySGVpZ2h0KCkgLSAkKFwiI2xpc3QtcGFnZXItd3JhcFwiKS5vdXRlckhlaWdodCgpIC0gMzA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhZ2VIZWlnaHQgPSBwYWdlSGVpZ2h0IC0gKCQoXCIjbGlzdC1idXR0b24td3JhcFwiKS5vdXRlckhlaWdodCgpID8gJChcIiNsaXN0LWJ1dHRvbi13cmFwXCIpLm91dGVySGVpZ2h0KCkgOiAwKSArIGZpeEhlaWdodCAtICgkKFwiI2xpc3QtcGFnZXItd3JhcFwiKS5sZW5ndGggPiAwID8gJChcIiNsaXN0LXBhZ2VyLXdyYXBcIikub3V0ZXJIZWlnaHQoKSA6IDApIC0gMzA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhZ2VIZWlnaHQ7XG4gIH0sXG4gIEdldEZpeEhlaWdodDogZnVuY3Rpb24gR2V0Rml4SGVpZ2h0KCkge1xuICAgIHJldHVybiAtNzA7XG4gIH0sXG4gIElWaWV3VGFibGVSZW5kZXJlcjoge1xuICAgIFRvRGF0ZVlZWVlfTU1fREQ6IGZ1bmN0aW9uIFRvRGF0ZVlZWVlfTU1fREQoaCwgZGF0ZXRpbWUpIHtcbiAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoZGF0ZXRpbWUpO1xuICAgICAgdmFyIGRhdGVTdHIgPSBEYXRlVXRpbGl0eS5Gb3JtYXQoZGF0ZSwgJ3l5eXktTU0tZGQnKTtcbiAgICAgIHJldHVybiBoKCdkaXYnLCBkYXRlU3RyKTtcbiAgICB9LFxuICAgIFN0cmluZ1RvRGF0ZVlZWVlfTU1fREQ6IGZ1bmN0aW9uIFN0cmluZ1RvRGF0ZVlZWVlfTU1fREQoaCwgZGF0ZXRpbWUpIHtcbiAgICAgIHZhciBkYXRlU3RyID0gZGF0ZXRpbWUuc3BsaXQoXCIgXCIpWzBdO1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIGRhdGVTdHIpO1xuICAgIH0sXG4gICAgVG9TdGF0dXNFbmFibGU6IGZ1bmN0aW9uIFRvU3RhdHVzRW5hYmxlKGgsIHN0YXR1cykge1xuICAgICAgaWYgKHN0YXR1cyA9PSAwKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuemgeeUqFwiKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09IDEpIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5ZCv55SoXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgVG9ZZXNOb0VuYWJsZTogZnVuY3Rpb24gVG9ZZXNOb0VuYWJsZShoLCBzdGF0dXMpIHtcbiAgICAgIGlmIChzdGF0dXMgPT0gMCkge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLlkKZcIik7XG4gICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PSAxKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuaYr1wiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFRvRGljdGlvbmFyeVRleHQ6IGZ1bmN0aW9uIFRvRGljdGlvbmFyeVRleHQoaCwgZGljdGlvbmFyeUpzb24sIGdyb3VwVmFsdWUsIGRpY3Rpb25hcnlWYWx1ZSkge1xuICAgICAgdmFyIHNpbXBsZURpY3Rpb25hcnlKc29uID0gRGljdGlvbmFyeVV0aWxpdHkuR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uKGRpY3Rpb25hcnlKc29uKTtcblxuICAgICAgaWYgKGRpY3Rpb25hcnlWYWx1ZSA9PSBudWxsIHx8IGRpY3Rpb25hcnlWYWx1ZSA9PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIlwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNpbXBsZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoc2ltcGxlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV0pIHtcbiAgICAgICAgICBpZiAoc2ltcGxlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV1bZGljdGlvbmFyeVZhbHVlXSkge1xuICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIHNpbXBsZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdW2RpY3Rpb25hcnlWYWx1ZV0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLmib7kuI3liLDoo4XmjaLnmoRURVhUXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLmib7kuI3liLDoo4XmjaLnmoTliIbnu4RcIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuaJvuS4jeWIsOijheaNoueahOWIhue7hFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIElWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkOiBmdW5jdGlvbiBJVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZChzZWxlY3Rpb25Sb3dzKSB7XG4gICAgaWYgKHNlbGVjdGlvblJvd3MgIT0gbnVsbCAmJiBzZWxlY3Rpb25Sb3dzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4oZnVuYykge1xuICAgICAgICAgIGZ1bmMoc2VsZWN0aW9uUm93cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieS4remcgOimgeaTjeS9nOeahOihjCFcIiwgbnVsbCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKGZ1bmMpIHt9XG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWRPbmU6IGZ1bmN0aW9uIElWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkT25lKHNlbGVjdGlvblJvd3MsIGNhbGxlcikge1xuICAgIGlmIChzZWxlY3Rpb25Sb3dzICE9IG51bGwgJiYgc2VsZWN0aW9uUm93cy5sZW5ndGggPiAwICYmIHNlbGVjdGlvblJvd3MubGVuZ3RoID09IDEpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4oZnVuYykge1xuICAgICAgICAgIGlmIChjYWxsZXIpIHtcbiAgICAgICAgICAgIGZ1bmMuY2FsbChjYWxsZXIsIHNlbGVjdGlvblJvd3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmdW5jKHNlbGVjdGlvblJvd3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5Lit6ZyA6KaB5pON5L2c55qE6KGM77yM5q+P5qyh5Y+q6IO96YCJ5Lit5LiA6KGMIVwiLCBudWxsKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4oZnVuYykge31cbiAgICAgIH07XG4gICAgfVxuICB9LFxuICBJVmlld0NoYW5nZVNlcnZlclN0YXR1czogZnVuY3Rpb24gSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXModXJsLCBzZWxlY3Rpb25Sb3dzLCBpZEZpZWxkLCBzdGF0dXNOYW1lLCBwYWdlQXBwT2JqKSB7XG4gICAgdmFyIGlkQXJyYXkgPSBuZXcgQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0aW9uUm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWRBcnJheS5wdXNoKHNlbGVjdGlvblJvd3NbaV1baWRGaWVsZF0pO1xuICAgIH1cblxuICAgIEFqYXhVdGlsaXR5LlBvc3QodXJsLCB7XG4gICAgICBpZHM6IGlkQXJyYXkuam9pbihcIjtcIiksXG4gICAgICBzdGF0dXM6IHN0YXR1c05hbWVcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgIHBhZ2VBcHBPYmoucmVsb2FkRGF0YSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LCBwYWdlQXBwT2JqKTtcbiAgfSxcbiAgSVZpZXdNb3ZlRmFjZTogZnVuY3Rpb24gSVZpZXdNb3ZlRmFjZSh1cmwsIHNlbGVjdGlvblJvd3MsIGlkRmllbGQsIHR5cGUsIHBhZ2VBcHBPYmopIHtcbiAgICB0aGlzLklWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkT25lKHNlbGVjdGlvblJvd3MpLnRoZW4oZnVuY3Rpb24gKHNlbGVjdGlvblJvd3MpIHtcbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodXJsLCB7XG4gICAgICAgIHJlY29yZElkOiBzZWxlY3Rpb25Sb3dzWzBdW2lkRmllbGRdLFxuICAgICAgICB0eXBlOiB0eXBlXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIHBhZ2VBcHBPYmoucmVsb2FkRGF0YSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHBhZ2VBcHBPYmopO1xuICAgIH0pO1xuICB9LFxuICBJVmlld0NvcHlSb3dJZDogZnVuY3Rpb24gSVZpZXdDb3B5Um93SWQoc2VsZWN0aW9uUm93cywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgIHRoaXMuSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWRPbmUoc2VsZWN0aW9uUm93cykudGhlbihmdW5jdGlvbiAoc2VsZWN0aW9uUm93cykge1xuICAgICAgdmFyIGlkVmFsdWUgPSBzZWxlY3Rpb25Sb3dzWzBdW2lkRmllbGRdO1xuICAgICAgQmFzZVV0aWxpdHkuQ29weVZhbHVlQ2xpcGJvYXJkKGlkVmFsdWUpO1xuICAgICAgRGlhbG9nVXRpbGl0eS5Ub2FzdE1lc3NhZ2UocGFnZUFwcE9iaiwgXCLlpI3liLbmiJDlip8hXCIpO1xuICAgIH0pO1xuICB9LFxuICBJVmlld0NoYW5nZVNlcnZlclN0YXR1c0ZhY2U6IGZ1bmN0aW9uIElWaWV3Q2hhbmdlU2VydmVyU3RhdHVzRmFjZSh1cmwsIHNlbGVjdGlvblJvd3MsIGlkRmllbGQsIHN0YXR1c05hbWUsIHBhZ2VBcHBPYmopIHtcbiAgICB0aGlzLklWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkKHNlbGVjdGlvblJvd3MpLnRoZW4oZnVuY3Rpb24gKHNlbGVjdGlvblJvd3MpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld0NoYW5nZVNlcnZlclN0YXR1cyh1cmwsIHNlbGVjdGlvblJvd3MsIGlkRmllbGQsIHN0YXR1c05hbWUsIHBhZ2VBcHBPYmopO1xuICAgIH0pO1xuICB9LFxuICBJVmlld1RhYmxlRGVsZXRlUm93OiBmdW5jdGlvbiBJVmlld1RhYmxlRGVsZXRlUm93KHVybCwgcmVjb3JkSWQsIHBhZ2VBcHBPYmopIHtcbiAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOimgeWIoOmZpOW9k+WJjeiusOW9leWQl++8n1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBBamF4VXRpbGl0eS5EZWxldGUodXJsLCB7XG4gICAgICAgIHJlY29yZElkOiByZWNvcmRJZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmoucmVsb2FkRGF0YSgpO1xuICAgICAgICAgIH0sIHBhZ2VBcHBPYmopO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgICB9XG4gICAgICB9LCBwYWdlQXBwT2JqKTtcbiAgICB9LCBwYWdlQXBwT2JqKTtcbiAgfSxcbiAgSVZpZXdUYWJsZUJpbmREYXRhQnlTZWFyY2g6IGZ1bmN0aW9uIElWaWV3VGFibGVCaW5kRGF0YUJ5U2VhcmNoKF9jb25maWcpIHtcbiAgICB2YXIgY29uZmlnID0ge1xuICAgICAgdXJsOiBcIlwiLFxuICAgICAgcGFnZU51bTogMSxcbiAgICAgIHBhZ2VTaXplOiAxMixcbiAgICAgIHNlYXJjaENvbmRpdGlvbjogbnVsbCxcbiAgICAgIHBhZ2VBcHBPYmo6IG51bGwsXG4gICAgICB0YWJsZUxpc3Q6IG51bGwsXG4gICAgICBpZEZpZWxkOiBcIlwiLFxuICAgICAgYXV0b1NlbGVjdGVkT2xkUm93czogZmFsc2UsXG4gICAgICBzdWNjZXNzRnVuYzogbnVsbCxcbiAgICAgIGxvYWREaWN0OiBmYWxzZSxcbiAgICAgIGN1c3RQYXJhczoge30sXG4gICAgICBfZXhwYW5kZWRBTEw6IGZhbHNlXG4gICAgfTtcbiAgICBjb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgY29uZmlnLCBfY29uZmlnKTtcblxuICAgIGlmICghY29uZmlnLnRhYmxlTGlzdCkge1xuICAgICAgY29uZmlnLnRhYmxlTGlzdCA9IGNvbmZpZy5wYWdlQXBwT2JqO1xuICAgIH1cblxuICAgIDtcbiAgICB2YXIgc2VuZERhdGEgPSB7XG4gICAgICBcInBhZ2VOdW1cIjogY29uZmlnLnBhZ2VOdW0sXG4gICAgICBcInBhZ2VTaXplXCI6IGNvbmZpZy5wYWdlU2l6ZSxcbiAgICAgIFwic2VhcmNoQ29uZGl0aW9uXCI6IFNlYXJjaFV0aWxpdHkuU2VyaWFsaXphdGlvblNlYXJjaENvbmRpdGlvbihjb25maWcuc2VhcmNoQ29uZGl0aW9uKSxcbiAgICAgIFwibG9hZERpY3RcIjogY29uZmlnLmxvYWREaWN0XG4gICAgfTtcblxuICAgIGZvciAodmFyIGtleSBpbiBjb25maWcuY3VzdFBhcmFzKSB7XG4gICAgICBzZW5kRGF0YVtrZXldID0gY29uZmlnLmN1c3RQYXJhc1trZXldO1xuICAgIH1cblxuICAgIEFqYXhVdGlsaXR5LlBvc3QoY29uZmlnLnVybCwgc2VuZERhdGEsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5zdWNjZXNzRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBjb25maWcuc3VjY2Vzc0Z1bmMuY2FsbChjb25maWcucGFnZUFwcE9iaiwgcmVzdWx0LCBjb25maWcucGFnZUFwcE9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIGNvbmZpZy50YWJsZUxpc3QucGFnZVRvdGFsID0gcmVzdWx0LmRhdGEudG90YWw7XG5cbiAgICAgICAgaWYgKGNvbmZpZy50YWJsZUxpc3QudGFibGVEYXRhICYmIGNvbmZpZy50YWJsZUxpc3QudGFibGVEYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy50YWJsZUxpc3QudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY29uZmlnLl9leHBhbmRlZEFMTCkge1xuICAgICAgICAgICAgICBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YVtpXS5fZXhwYW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcuYXV0b1NlbGVjdGVkT2xkUm93cykge1xuICAgICAgICAgIGlmIChjb25maWcudGFibGVMaXN0LnNlbGVjdGlvblJvd3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbmZpZy50YWJsZUxpc3Quc2VsZWN0aW9uUm93cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChjb25maWcudGFibGVMaXN0LnNlbGVjdGlvblJvd3Nbal1bY29uZmlnLmlkRmllbGRdID09IGNvbmZpZy50YWJsZUxpc3QudGFibGVEYXRhW2ldW2NvbmZpZy5pZEZpZWxkXSkge1xuICAgICAgICAgICAgICAgICAgY29uZmlnLnRhYmxlTGlzdC50YWJsZURhdGFbaV0uX2NoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjb25maWcuX2V4cGFuZGVkQUxMKSB7XG4gICAgICAgICAgICAgICAgICBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YVtpXS5fZXhwYW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIGNvbmZpZy5wYWdlQXBwT2JqLCBcImpzb25cIik7XG4gIH0sXG4gIElWaWV3VGFibGVCaW5kRGF0YUJ5U2VhcmNoUG9zdFJlcXVlc3RCb2R5OiBmdW5jdGlvbiBJVmlld1RhYmxlQmluZERhdGFCeVNlYXJjaFBvc3RSZXF1ZXN0Qm9keShfY29uZmlnLCBzZWFyY2hNb2RlbCkge1xuICAgIHZhciBjb25maWcgPSB7XG4gICAgICB1cmw6IFwiXCIsXG4gICAgICBwYWdlTnVtOiAxLFxuICAgICAgcGFnZVNpemU6IDEyLFxuICAgICAgcGFnZUFwcE9iajogbnVsbCxcbiAgICAgIHRhYmxlTGlzdDogbnVsbCxcbiAgICAgIGlkRmllbGQ6IFwiXCIsXG4gICAgICBhdXRvU2VsZWN0ZWRPbGRSb3dzOiBmYWxzZSxcbiAgICAgIHN1Y2Nlc3NGdW5jOiBudWxsLFxuICAgICAgbG9hZERpY3Q6IGZhbHNlLFxuICAgICAgY3VzdFBhcmFzOiB7fSxcbiAgICAgIF9leHBhbmRlZEFMTDogZmFsc2VcbiAgICB9O1xuICAgIGNvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBjb25maWcsIF9jb25maWcpO1xuXG4gICAgaWYgKCFjb25maWcudGFibGVMaXN0KSB7XG4gICAgICBjb25maWcudGFibGVMaXN0ID0gY29uZmlnLnBhZ2VBcHBPYmo7XG4gICAgfVxuXG4gICAgO1xuICAgIHZhciBzZW5kRGF0YSA9IHtcbiAgICAgIFwicGFnZU51bVwiOiBjb25maWcucGFnZU51bSxcbiAgICAgIFwicGFnZVNpemVcIjogY29uZmlnLnBhZ2VTaXplLFxuICAgICAgXCJsb2FkRGljdFwiOiBjb25maWcubG9hZERpY3RcbiAgICB9O1xuICAgIHNlbmREYXRhID0gJC5leHRlbmQodHJ1ZSwge30sIHNlbmREYXRhLCBzZWFyY2hNb2RlbCk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gY29uZmlnLmN1c3RQYXJhcykge1xuICAgICAgc2VuZERhdGFba2V5XSA9IGNvbmZpZy5jdXN0UGFyYXNba2V5XTtcbiAgICB9XG5cbiAgICBzZW5kRGF0YSA9IEpTT04uc3RyaW5naWZ5KHNlbmREYXRhKTtcbiAgICBBamF4VXRpbGl0eS5Qb3N0UmVxdWVzdEJvZHkoY29uZmlnLnVybCwgc2VuZERhdGEsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5zdWNjZXNzRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBjb25maWcuc3VjY2Vzc0Z1bmMuY2FsbChjb25maWcucGFnZUFwcE9iaiwgcmVzdWx0LCBjb25maWcucGFnZUFwcE9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIGNvbmZpZy50YWJsZUxpc3QucGFnZVRvdGFsID0gcmVzdWx0LmRhdGEudG90YWw7XG5cbiAgICAgICAgaWYgKGNvbmZpZy50YWJsZUxpc3QudGFibGVEYXRhICYmIGNvbmZpZy50YWJsZUxpc3QudGFibGVEYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy50YWJsZUxpc3QudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY29uZmlnLl9leHBhbmRlZEFMTCkge1xuICAgICAgICAgICAgICBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YVtpXS5fZXhwYW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcuYXV0b1NlbGVjdGVkT2xkUm93cykge1xuICAgICAgICAgIGlmIChjb25maWcudGFibGVMaXN0LnNlbGVjdGlvblJvd3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbmZpZy50YWJsZUxpc3Quc2VsZWN0aW9uUm93cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChjb25maWcudGFibGVMaXN0LnNlbGVjdGlvblJvd3Nbal1bY29uZmlnLmlkRmllbGRdID09IGNvbmZpZy50YWJsZUxpc3QudGFibGVEYXRhW2ldW2NvbmZpZy5pZEZpZWxkXSkge1xuICAgICAgICAgICAgICAgICAgY29uZmlnLnRhYmxlTGlzdC50YWJsZURhdGFbaV0uX2NoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjb25maWcuX2V4cGFuZGVkQUxMKSB7XG4gICAgICAgICAgICAgICAgICBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YVtpXS5fZXhwYW5kZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIGNvbmZpZy5wYWdlQXBwT2JqLCBcImpzb25cIik7XG4gIH0sXG4gIElWaWV3VGFibGVMb2FkRGF0YVNlYXJjaDogZnVuY3Rpb24gSVZpZXdUYWJsZUxvYWREYXRhU2VhcmNoKHVybCwgcGFnZU51bSwgcGFnZVNpemUsIHNlYXJjaENvbmRpdGlvbiwgcGFnZUFwcE9iaiwgaWRGaWVsZCwgYXV0b1NlbGVjdGVkT2xkUm93cywgc3VjY2Vzc0Z1bmMsIGxvYWREaWN0LCBjdXN0UGFyYXMpIHtcbiAgICBhbGVydChcIkxpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlTG9hZERhdGFTZWFyY2jmlrnms5Xlt7Lnu4/ooqvlup/lvIMs6K+36L2s6LCDSVZpZXdUYWJsZUJpbmREYXRhQnlTZWFyY2hcIik7XG4gICAgcmV0dXJuO1xuXG4gICAgaWYgKGxvYWREaWN0ID09IHVuZGVmaW5lZCB8fCBsb2FkRGljdCA9PSBudWxsKSB7XG4gICAgICBsb2FkRGljdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghY3VzdFBhcmFzKSB7XG4gICAgICBjdXN0UGFyYXMgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgc2VuZERhdGEgPSB7XG4gICAgICBcInBhZ2VOdW1cIjogcGFnZU51bSxcbiAgICAgIFwicGFnZVNpemVcIjogcGFnZVNpemUsXG4gICAgICBcInNlYXJjaENvbmRpdGlvblwiOiBTZWFyY2hVdGlsaXR5LlNlcmlhbGl6YXRpb25TZWFyY2hDb25kaXRpb24oc2VhcmNoQ29uZGl0aW9uKSxcbiAgICAgIFwibG9hZERpY3RcIjogbG9hZERpY3RcbiAgICB9O1xuXG4gICAgZm9yICh2YXIga2V5IGluIGN1c3RQYXJhcykge1xuICAgICAgc2VuZERhdGFba2V5XSA9IGN1c3RQYXJhc1trZXldO1xuICAgIH1cblxuICAgIEFqYXhVdGlsaXR5LlBvc3QodXJsLCBzZW5kRGF0YSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3VjY2Vzc0Z1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgc3VjY2Vzc0Z1bmMocmVzdWx0LCBwYWdlQXBwT2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhID0gbmV3IEFycmF5KCk7XG4gICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhID0gcmVzdWx0LmRhdGEubGlzdDtcbiAgICAgICAgcGFnZUFwcE9iai5wYWdlVG90YWwgPSByZXN1bHQuZGF0YS50b3RhbDtcblxuICAgICAgICBpZiAoYXV0b1NlbGVjdGVkT2xkUm93cykge1xuICAgICAgICAgIGlmIChwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlQXBwT2JqLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBhZ2VBcHBPYmouc2VsZWN0aW9uUm93cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3Nbal1baWRGaWVsZF0gPT0gcGFnZUFwcE9iai50YWJsZURhdGFbaV1baWRGaWVsZF0pIHtcbiAgICAgICAgICAgICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhW2ldLl9jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7fVxuICAgIH0sIHRoaXMsIFwianNvblwiKTtcbiAgfSxcbiAgSVZpZXdUYWJsZUxvYWREYXRhTm9TZWFyY2g6IGZ1bmN0aW9uIElWaWV3VGFibGVMb2FkRGF0YU5vU2VhcmNoKHVybCwgcGFnZU51bSwgcGFnZVNpemUsIHBhZ2VBcHBPYmosIGlkRmllbGQsIGF1dG9TZWxlY3RlZE9sZFJvd3MsIHN1Y2Nlc3NGdW5jKSB7XG4gICAgYWxlcnQoXCJMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUxvYWREYXRhU2VhcmNo5pa55rOV5bey57uP6KKr5bqf5byDLOivt+i9rOiwg0lWaWV3VGFibGVCaW5kRGF0YUJ5U2VhcmNoXCIpO1xuICAgIHJldHVybjtcbiAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgcGFnZU51bTogcGFnZU51bSxcbiAgICAgIHBhZ2VTaXplOiBwYWdlU2l6ZVxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIHBhZ2VBcHBPYmoucGFnZVRvdGFsID0gcmVzdWx0LmRhdGEudG90YWw7XG5cbiAgICAgICAgaWYgKGF1dG9TZWxlY3RlZE9sZFJvd3MpIHtcbiAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZUFwcE9iai50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzW2pdW2lkRmllbGRdID09IHBhZ2VBcHBPYmoudGFibGVEYXRhW2ldW2lkRmllbGRdKSB7XG4gICAgICAgICAgICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YVtpXS5fY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzdWNjZXNzRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBzdWNjZXNzRnVuYyhyZXN1bHQsIHBhZ2VBcHBPYmopO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgXCJqc29uXCIpO1xuICB9LFxuICBJVmlld1RhYmxlSW5uZXJCdXR0b246IHtcbiAgICBWaWV3QnV0dG9uOiBmdW5jdGlvbiBWaWV3QnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ1Rvb2x0aXAnLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgY29udGVudDogXCLmn6XnnItcIlxuICAgICAgICB9XG4gICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gdmlld1wiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmoudmlldyhwYXJhbXMucm93W2lkRmllbGRdLCBwYXJhbXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSldKTtcbiAgICB9LFxuICAgIEVkaXRCdXR0b246IGZ1bmN0aW9uIEVkaXRCdXR0b24oaCwgcGFyYW1zLCBpZEZpZWxkLCBwYWdlQXBwT2JqKSB7XG4gICAgICByZXR1cm4gaCgnVG9vbHRpcCcsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBjb250ZW50OiBcIuS/ruaUuVwiXG4gICAgICAgIH1cbiAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbiBlZGl0XCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai5lZGl0KHBhcmFtcy5yb3dbaWRGaWVsZF0sIHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KV0pO1xuICAgIH0sXG4gICAgRGVsZXRlQnV0dG9uOiBmdW5jdGlvbiBEZWxldGVCdXR0b24oaCwgcGFyYW1zLCBpZEZpZWxkLCBwYWdlQXBwT2JqKSB7XG4gICAgICByZXR1cm4gaCgnVG9vbHRpcCcsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBjb250ZW50OiBcIuWIoOmZpFwiXG4gICAgICAgIH1cbiAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbiBkZWxcIixcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLmRlbChwYXJhbXMucm93W2lkRmllbGRdLCBwYXJhbXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSldKTtcbiAgICB9LFxuICAgIE1vdmVVcEJ1dHRvbjogZnVuY3Rpb24gTW92ZVVwQnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ1Rvb2x0aXAnLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgY29udGVudDogXCLkuIrnp7tcIlxuICAgICAgICB9XG4gICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gbW92ZS11cFwiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmoubW92ZVVwKHBhcmFtcy5yb3dbaWRGaWVsZF0sIHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KV0pO1xuICAgIH0sXG4gICAgTW92ZURvd25CdXR0b246IGZ1bmN0aW9uIE1vdmVEb3duQnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ1Rvb2x0aXAnLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgY29udGVudDogXCLkuIvnp7tcIlxuICAgICAgICB9XG4gICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gbW92ZS1kb3duXCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai5tb3ZlRG93bihwYXJhbXMucm93W2lkRmllbGRdLCBwYXJhbXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSldKTtcbiAgICB9LFxuICAgIFNlbGVjdGVkQnV0dG9uOiBmdW5jdGlvbiBTZWxlY3RlZEJ1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmosIGNsaWNrRXZlbnQpIHtcbiAgICAgIHJldHVybiBoKCdUb29sdGlwJywge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGNvbnRlbnQ6IFwi6YCJ5oupXCJcbiAgICAgICAgfVxuICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIHNlbGVjdGVkXCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjbGlja0V2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICBjbGlja0V2ZW50KHBhcmFtcy5yb3dbaWRGaWVsZF0sIHBhcmFtcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwYWdlQXBwT2JqLnNlbGVjdGVkKHBhcmFtcy5yb3dbaWRGaWVsZF0sIHBhcmFtcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KV0pO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIExvYWRKc0Nzc1V0aWxpdHkgPSBmdW5jdGlvbiAoZG9tKSB7XG4gIHZhciBjYWNoZSA9IHt9LFxuICAgICAgZnVuY3Q7XG5cbiAgZnVuY3QgPSBmdW5jdGlvbiBmdW5jdChwYXRoLCBjYWxsYmFjaykge1xuICAgIGlmICghcGF0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwi6K+36L6T5YWlcGF0aOi3r+W+hCFcIik7XG4gICAgfVxuXG4gICAgO1xuICAgIHZhciBmbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChjYWxsYmFjaykgPT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiID8gY2FsbGJhY2sgOiBmdW5jdGlvbiAoKSB7fTtcblxuICAgIGlmIChcIi5qc1wiID09IHBhdGguc3Vic3RyKC0zKSkge1xuICAgICAgYWRkSnMocGF0aCwgZm4pO1xuICAgIH0gZWxzZSBpZiAoXCIuY3NzXCIgPT0gcGF0aC5zdWJzdHIoLTQpKSB7XG4gICAgICBhZGRDc3MocGF0aCwgZm4pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ+ivt+i+k+WFpeato+ehrueahHBhdGjot6/lvoQhJyk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGFkZENzcyhwYXRoLCBjYWxsYmFjaykge1xuICAgIGlmICghY2hlY2tjYWNoZShwYXRoKSkge1xuICAgICAgdmFyIGhlYWQgPSBkb20uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgIHZhciBsaW5rID0gZG9tLmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgIGxpbmsuaHJlZiA9IHBhdGg7XG4gICAgICBsaW5rLnJlbCA9ICdzdHlsZXNoZWV0JztcbiAgICAgIGxpbmsudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKGxpbmspO1xuXG4gICAgICBsaW5rLm9ubG9hZCA9IGxpbmsub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMucmVhZHlTdGF0ZSB8fCB0aGlzLnJlYWR5U3RhdGUgPT09IFwibG9hZGVkXCIgfHwgdGhpcy5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIpIHtcbiAgICAgICAgICBsaW5rLm9ubG9hZCA9IGxpbmsub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjYWNoZVtwYXRoXSA9IDE7XG4gICAgfVxuICB9XG5cbiAgO1xuXG4gIGZ1bmN0aW9uIGFkZEpzKHBhdGgsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFjaGVja2NhY2hlKHBhdGgpKSB7XG4gICAgICB2YXIgaGVhZCA9IGRvbS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgICAgdmFyIHNjcmlwdCA9IGRvbS5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgIHNjcmlwdC5zcmMgPSBwYXRoO1xuICAgICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblxuICAgICAgc2NyaXB0Lm9ubG9hZCA9IHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5yZWFkeVN0YXRlIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gXCJsb2FkZWRcIiB8fCB0aGlzLnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIikge1xuICAgICAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjYWNoZVtwYXRoXSA9IDE7XG4gICAgfVxuICB9XG5cbiAgO1xuXG4gIGZ1bmN0aW9uIGNoZWNrY2FjaGUocGF0aCkge1xuICAgIGlmIChjYWNoZVtwYXRoXSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICA7XG4gIHJldHVybiBmdW5jdDtcbn0oZG9jdW1lbnQpOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgTG9jYWxTdG9yYWdlVXRpbGl0eSA9IHtcbiAgaXNTdXBwb3J0OiBmdW5jdGlvbiBpc1N1cHBvcnQoKSB7XG4gICAgaWYgKHR5cGVvZiBTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcbiAgc2V0SXRlbTogZnVuY3Rpb24gc2V0SXRlbShrZXksIHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuaXNTdXBwb3J0KCkpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgfSxcbiAgZ2V0SXRlbTogZnVuY3Rpb24gZ2V0SXRlbShrZXkpIHtcbiAgICBpZiAodGhpcy5pc1N1cHBvcnQoKSkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIHNldEl0ZW1JblNlc3Npb25TdG9yYWdlOiBmdW5jdGlvbiBzZXRJdGVtSW5TZXNzaW9uU3RvcmFnZShrZXksIHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuaXNTdXBwb3J0KCkpIHtcbiAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgfVxuICB9LFxuICBnZXRJdGVtSW5TZXNzaW9uU3RvcmFnZTogZnVuY3Rpb24gZ2V0SXRlbUluU2Vzc2lvblN0b3JhZ2Uoa2V5KSB7XG4gICAgaWYgKHRoaXMuaXNTdXBwb3J0KCkpIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQYWdlU3R5bGVVdGlsaXR5ID0ge1xuICBHZXRQYWdlSGVpZ2h0OiBmdW5jdGlvbiBHZXRQYWdlSGVpZ2h0KCkge1xuICAgIHJldHVybiBqUXVlcnkod2luZG93LmRvY3VtZW50KS5oZWlnaHQoKTtcbiAgfSxcbiAgR2V0UGFnZVdpZHRoOiBmdW5jdGlvbiBHZXRQYWdlV2lkdGgoKSB7XG4gICAgcmV0dXJuIGpRdWVyeSh3aW5kb3cuZG9jdW1lbnQpLndpZHRoKCk7XG4gIH0sXG4gIEdldFdpbmRvd0hlaWdodDogZnVuY3Rpb24gR2V0V2luZG93SGVpZ2h0KCkge1xuICAgIGFsZXJ0KFwiR2V0V2luZG93SGVpZ2h0OuacquWunueOsFwiKTtcbiAgICB0aHJvdyBcIkdldFdpbmRvd0hlaWdodDrmnKrlrp7njrBcIjtcbiAgfSxcbiAgR2V0V2luZG93V2lkdGg6IGZ1bmN0aW9uIEdldFdpbmRvd1dpZHRoKCkge1xuICAgIGFsZXJ0KFwiR2V0V2luZG93V2lkdGg65pyq5a6e546wXCIpO1xuICAgIHRocm93IFwiR2V0V2luZG93V2lkdGg65pyq5a6e546wXCI7XG4gIH0sXG4gIEdldFNjcmVlbkhlaWdodDogZnVuY3Rpb24gR2V0U2NyZWVuSGVpZ2h0KCkge1xuICAgIHJldHVybiBzY3JlZW4uaGVpZ2h0O1xuICB9LFxuICBHZXRTY3JlZW5XaWR0aDogZnVuY3Rpb24gR2V0U2NyZWVuV2lkdGgoKSB7XG4gICAgcmV0dXJuIHNjcmVlbi53aWR0aDtcbiAgfSxcbiAgQXV0b0VsZW1IZWlnaHQ6IGZ1bmN0aW9uIEF1dG9FbGVtSGVpZ2h0KGVsZW1TZWxlY3RvciwgZml4SGVpZ2h0KSB7XG4gICAgdmFyIHBhZ2VIZWlnaHQgPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKTtcbiAgICB2YXIgbmV3SGVpZ2h0ID0gcGFnZUhlaWdodCAtIGZpeEhlaWdodDtcbiAgICAkKGVsZW1TZWxlY3RvcikuaGVpZ2h0KG5ld0hlaWdodCk7XG4gIH0sXG4gIEF1dG9FbGVtSGVpZ2h0SW5UYWJsZUxheW91dDogZnVuY3Rpb24gQXV0b0VsZW1IZWlnaHRJblRhYmxlTGF5b3V0KGVsZW1TZWxlY3RvciwgdGFibGVTZWxlY3Rvcikge1xuICAgIHZhciBwYWdlSGVpZ2h0ID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCk7XG4gICAgdmFyIHRhYmxlSGVpZ2h0ID0gJCh0YWJsZVNlbGVjdG9yKS5oZWlnaHQoKTtcblxuICAgIGlmIChwYWdlSGVpZ2h0ID4gdGFibGVIZWlnaHQpIHtcbiAgICAgIHZhciBlbGVtSGVpZ2h0ID0gJChlbGVtU2VsZWN0b3IpLmhlaWdodCgpO1xuICAgICAgdmFyIGZpeEhlaWdodCA9IHBhZ2VIZWlnaHQgLSB0YWJsZUhlaWdodDtcbiAgICAgIHZhciBoZWlnaHQgPSBlbGVtSGVpZ2h0ICsgZml4SGVpZ2h0IC0gNjA7XG5cbiAgICAgIGlmICgkKFwiLnVpLXRhYnNcIikubGVuZ3RoID4gMCkge1xuICAgICAgICBoZWlnaHQgPSBoZWlnaHQgLSA3MDtcbiAgICAgIH1cblxuICAgICAgJChlbGVtU2VsZWN0b3IpLmhlaWdodChoZWlnaHQpO1xuICAgIH1cbiAgfSxcbiAgR2V0TGlzdEJ1dHRvbk91dGVySGVpZ2h0OiBmdW5jdGlvbiBHZXRMaXN0QnV0dG9uT3V0ZXJIZWlnaHQoKSB7XG4gICAgYWxlcnQoXCJQYWdlU3R5bGVVdGlsaXR5LkdldExpc3RCdXR0b25PdXRlckhlaWdodCDlt7LlgZznlKhcIik7XG4gICAgcmV0dXJuIGpRdWVyeShcIi5saXN0LWJ1dHRvbi1vdXRlci1jXCIpLm91dGVySGVpZ2h0KCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBTZWFyY2hVdGlsaXR5ID0ge1xuICBTZWFyY2hGaWVsZFR5cGU6IHtcbiAgICBJbnRUeXBlOiBcIkludFR5cGVcIixcbiAgICBOdW1iZXJUeXBlOiBcIk51bWJlclR5cGVcIixcbiAgICBEYXRhVHlwZTogXCJEYXRlVHlwZVwiLFxuICAgIExpa2VTdHJpbmdUeXBlOiBcIkxpa2VTdHJpbmdUeXBlXCIsXG4gICAgTGVmdExpa2VTdHJpbmdUeXBlOiBcIkxlZnRMaWtlU3RyaW5nVHlwZVwiLFxuICAgIFJpZ2h0TGlrZVN0cmluZ1R5cGU6IFwiUmlnaHRMaWtlU3RyaW5nVHlwZVwiLFxuICAgIFN0cmluZ1R5cGU6IFwiU3RyaW5nVHlwZVwiLFxuICAgIERhdGFTdHJpbmdUeXBlOiBcIkRhdGVTdHJpbmdUeXBlXCIsXG4gICAgQXJyYXlMaWtlU3RyaW5nVHlwZTogXCJBcnJheUxpa2VTdHJpbmdUeXBlXCJcbiAgfSxcbiAgU2VyaWFsaXphdGlvblNlYXJjaENvbmRpdGlvbjogZnVuY3Rpb24gU2VyaWFsaXphdGlvblNlYXJjaENvbmRpdGlvbihzZWFyY2hDb25kaXRpb24pIHtcbiAgICBpZiAoc2VhcmNoQ29uZGl0aW9uKSB7XG4gICAgICB2YXIgc2VhcmNoQ29uZGl0aW9uQ2xvbmUgPSBKc29uVXRpbGl0eS5DbG9uZVNpbXBsZShzZWFyY2hDb25kaXRpb24pO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gc2VhcmNoQ29uZGl0aW9uQ2xvbmUpIHtcbiAgICAgICAgaWYgKHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udHlwZSA9PSBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5BcnJheUxpa2VTdHJpbmdUeXBlKSB7XG4gICAgICAgICAgaWYgKHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udmFsdWUgIT0gbnVsbCAmJiBzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udmFsdWUgPSBzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnZhbHVlLmpvaW4oXCI7XCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHNlYXJjaENvbmRpdGlvbkNsb25lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gXCJcIjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEpCdWlsZDREU2VsZWN0VmlldyA9IHtcbiAgU2VsZWN0RW52VmFyaWFibGU6IHtcbiAgICBmb3JtYXRUZXh0OiBmdW5jdGlvbiBmb3JtYXRUZXh0KHR5cGUsIHRleHQpIHtcbiAgICAgIGFsZXJ0KFwiSkJ1aWxkNERTZWxlY3RWaWV3LmZvcm1hdFRleHTmlrnms5Xlt7Lnu4/lup/lvIMs6K+35L2/55Soc2VsZWN0LWRlZmF1bHQtdmFsdWUtZGlhbG9n57uE5Lu25YaF6YOo55qEZm9ybWF0VGV4dOaWueazlSFcIik7XG4gICAgICByZXR1cm47XG5cbiAgICAgIGlmICh0eXBlID09IFwiQ29uc3RcIikge1xuICAgICAgICByZXR1cm4gXCLpnZnmgIHlgLw644CQXCIgKyB0ZXh0ICsgXCLjgJFcIjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIkRhdGVUaW1lXCIpIHtcbiAgICAgICAgcmV0dXJuIFwi5pel5pyf5pe26Ze0OuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJBcGlWYXJcIikge1xuICAgICAgICByZXR1cm4gXCJBUEnlj5jph48644CQXCIgKyB0ZXh0ICsgXCLjgJFcIjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIk51bWJlckNvZGVcIikge1xuICAgICAgICByZXR1cm4gXCLluo/lj7fnvJbnoIE644CQXCIgKyB0ZXh0ICsgXCLjgJFcIjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIklkQ29kZXJcIikge1xuICAgICAgICByZXR1cm4gXCLkuLvplK7nlJ/miJA644CQXCIgKyB0ZXh0ICsgXCLjgJFcIjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiBcIuOAkOaXoOOAkVwiO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gXCLmnKrnn6XnsbvlnotcIiArIHRleHQ7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgU2Vzc2lvblV0aWxpdHkgPSB7XG4gIF9jdXJyZW50U2Vzc2lvblVzZXI6IG51bGwsXG4gIF9jdXJyZW50U2Vzc2lvblVzZXJNb2NrOiB7XG4gICAgb3JnYW5JZDogXCJcIixcbiAgICBvcmdhbk5hbWU6IFwiXCIsXG4gICAgdXNlcklkOiBcIlwiLFxuICAgIHVzZXJOYW1lOiBcIlwiLFxuICAgIG1haW5EZXBhcnRtZW50SWQ6IFwiXCIsXG4gICAgbWFpbkRlcGFydG1lbnROYW1lOiBcIlwiLFxuICAgIGFjY291bnRJZDogXCJcIixcbiAgICBhY2NvdW50TmFtZTogXCJcIlxuICB9LFxuICBDbGVhckNsaWVudFNlc3Npb25TdG9yZVNlc3Npb25Vc2VyOiBmdW5jdGlvbiBDbGVhckNsaWVudFNlc3Npb25TdG9yZVNlc3Npb25Vc2VyKCkge30sXG4gIEdldFNlc3Npb25Vc2VyU3luYzogZnVuY3Rpb24gR2V0U2Vzc2lvblVzZXJTeW5jKCkge1xuICAgIGlmICh0aGlzLl9jdXJyZW50U2Vzc2lvblVzZXIgPT0gbnVsbCkge1xuICAgICAgaWYgKHdpbmRvdy5wYXJlbnQuU2Vzc2lvblV0aWxpdHkuX2N1cnJlbnRTZXNzaW9uVXNlciAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cucGFyZW50LlNlc3Npb25VdGlsaXR5Ll9jdXJyZW50U2Vzc2lvblVzZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0U3luYyhcIi9SZXN0L1Nlc3Npb24vVXNlci9HZXRNeVNlc3Npb25Vc2VyXCIsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBTZXNzaW9uVXRpbGl0eS5fY3VycmVudFNlc3Npb25Vc2VyID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgfSBlbHNlIHt9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFNlc3Npb25Vc2VyO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3VycmVudFNlc3Npb25Vc2VyO1xuICAgIH1cbiAgfSxcbiAgR2V0U2Vzc2lvblVzZXI6IGZ1bmN0aW9uIEdldFNlc3Npb25Vc2VyKGZ1bmMpIHtcbiAgICBpZiAoIXRoaXMuX2N1cnJlbnRTZXNzaW9uVXNlcikge1xuICAgICAgQWpheFV0aWxpdHkuR2V0KFwiL1Jlc3QvU2Vzc2lvbi9Vc2VyL0dldE15U2Vzc2lvblVzZXJcIiwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgZnVuYyhyZXN1bHQuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9jdXJyZW50U2Vzc2lvblVzZXI7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbnZhciBTdHJpbmdVdGlsaXR5ID0ge1xuICBHdWlkU3BsaXQ6IGZ1bmN0aW9uIEd1aWRTcGxpdChzcGxpdCkge1xuICAgIHZhciBndWlkID0gXCJcIjtcblxuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IDMyOyBpKyspIHtcbiAgICAgIGd1aWQgKz0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTYuMCkudG9TdHJpbmcoMTYpO1xuICAgICAgaWYgKGkgPT0gOCB8fCBpID09IDEyIHx8IGkgPT0gMTYgfHwgaSA9PSAyMCkgZ3VpZCArPSBzcGxpdDtcbiAgICB9XG5cbiAgICByZXR1cm4gZ3VpZDtcbiAgfSxcbiAgR3VpZDogZnVuY3Rpb24gR3VpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5HdWlkU3BsaXQoXCItXCIpO1xuICB9LFxuICBUaW1lc3RhbXA6IGZ1bmN0aW9uIFRpbWVzdGFtcCgpIHtcbiAgICB2YXIgdGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgcmV0dXJuIHRpbWVzdGFtcC50b1N0cmluZygpLnN1YnN0cig0LCAxMCk7XG4gIH0sXG4gIFRyaW06IGZ1bmN0aW9uIFRyaW0oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oXlvjgIBcXHNdKil8KFvjgIBcXHNdKiQpL2csIFwiXCIpO1xuICB9LFxuICBSZW1vdmVMYXN0Q2hhcjogZnVuY3Rpb24gUmVtb3ZlTGFzdENoYXIoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoMCwgc3RyLmxlbmd0aCAtIDEpO1xuICB9LFxuICBJc051bGxPckVtcHR5VHJpbTogZnVuY3Rpb24gSXNOdWxsT3JFbXB0eVRyaW0ob2JqKSB7XG4gICAgaWYgKG9iaikge1xuICAgICAgb2JqID0gdGhpcy5UcmltKG9iai50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5Jc051bGxPckVtcHR5KG9iaik7XG4gIH0sXG4gIElzTnVsbE9yRW1wdHk6IGZ1bmN0aW9uIElzTnVsbE9yRW1wdHkob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PSB1bmRlZmluZWQgfHwgb2JqID09PSBcIlwiIHx8IG9iaiA9PSBudWxsIHx8IG9iaiA9PSBcInVuZGVmaW5lZFwiIHx8IG9iaiA9PSBcIm51bGxcIjtcbiAgfSxcbiAgSXNOb3ROdWxsT3JFbXB0eTogZnVuY3Rpb24gSXNOb3ROdWxsT3JFbXB0eShvYmopIHtcbiAgICByZXR1cm4gIXRoaXMuSXNOdWxsT3JFbXB0eShvYmopO1xuICB9LFxuICBOdWxsVG9FUzogZnVuY3Rpb24gTnVsbFRvRVMob2JqKSB7XG4gICAgaWYgKHRoaXMuSXNOdWxsT3JFbXB0eShvYmopKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xuICB9LFxuICBHZXRGdW5jdGlvbk5hbWU6IGZ1bmN0aW9uIEdldEZ1bmN0aW9uTmFtZShmdW5jKSB7XG4gICAgaWYgKHR5cGVvZiBmdW5jID09IFwiZnVuY3Rpb25cIiB8fCBfdHlwZW9mKGZ1bmMpID09IFwib2JqZWN0XCIpIHZhciBmTmFtZSA9IChcIlwiICsgZnVuYykubWF0Y2goL2Z1bmN0aW9uXFxzKihbXFx3XFwkXSopXFxzKlxcKC8pO1xuICAgIGlmIChmTmFtZSAhPT0gbnVsbCkgcmV0dXJuIGZOYW1lWzFdO1xuICB9LFxuICBUb0xvd2VyQ2FzZTogZnVuY3Rpb24gVG9Mb3dlckNhc2Uoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpO1xuICB9LFxuICB0b1VwcGVyQ2FzZTogZnVuY3Rpb24gdG9VcHBlckNhc2Uoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpO1xuICB9LFxuICBFbmRXaXRoOiBmdW5jdGlvbiBFbmRXaXRoKHN0ciwgZW5kU3RyKSB7XG4gICAgdmFyIGQgPSBzdHIubGVuZ3RoIC0gZW5kU3RyLmxlbmd0aDtcbiAgICByZXR1cm4gZCA+PSAwICYmIHN0ci5sYXN0SW5kZXhPZihlbmRTdHIpID09IGQ7XG4gIH0sXG4gIElzU2FtZURvbWFpbjogZnVuY3Rpb24gSXNTYW1lRG9tYWluKHVybDEsIHVybDIpIHtcbiAgICBpZiAodXJsMi5pbmRleE9mKFwiLi4vXCIpID09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciBvcmlnaW4xID0gL1xcL1xcL1tcXHctLl0rKDpcXGQrKT8vaS5leGVjKHVybDEpWzBdO1xuICAgIHZhciBvcGVuID0gL1xcL1xcL1tcXHctLl0rKDpcXGQrKT8vaS5leGVjKHVybDIpO1xuXG4gICAgaWYgKG9wZW4gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBvcmlnaW4yID0gb3BlblswXTtcblxuICAgICAgaWYgKG9yaWdpbjEgPT0gb3JpZ2luMikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcbiAgRmlyc3RDaGFyTGV0dGVyOiBmdW5jdGlvbiBGaXJzdENoYXJMZXR0ZXIoc3RyKSB7XG4gICAgdmFyIHN0cjEgPSBzdHIucmVwbGFjZShzdHJbMF0sIHN0clswXS50b0xvd2VyQ2FzZSgpKTtcbiAgICByZXR1cm4gc3RyMTtcbiAgfSxcbiAgRmlyc3RDaGFyVXBwZXI6IGZ1bmN0aW9uIEZpcnN0Q2hhclVwcGVyKHN0cikge1xuICAgIHZhciBzdHIxID0gc3RyLnJlcGxhY2Uoc3RyWzBdLCBzdHJbMF0udG9VcHBlckNhc2UoKSk7XG4gICAgcmV0dXJuIHN0cjE7XG4gIH0sXG4gIFJlbW92ZVNjcmlwdDogZnVuY3Rpb24gUmVtb3ZlU2NyaXB0KHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvPHNjcmlwdC4qPz4uKj88XFwvc2NyaXB0Pi9pZywgJycpO1xuICB9LFxuICBFbmNvZGVIdG1sOiBmdW5jdGlvbiBFbmNvZGVIdG1sKHN0cikge1xuICAgIHZhciBSRUdYX0hUTUxfRU5DT0RFID0gL1wifCZ8J3w8fD58W1xceDAwLVxceDIwXXxbXFx4N0YtXFx4RkZdfFtcXHUwMTAwLVxcdTI3MDBdL2c7XG4gICAgcmV0dXJuIHR5cGVvZiBzdHIgIT0gXCJzdHJpbmdcIiA/IHN0ciA6IHN0ci5yZXBsYWNlKFJFR1hfSFRNTF9FTkNPREUsIGZ1bmN0aW9uICgkMCkge1xuICAgICAgdmFyIGMgPSAkMC5jaGFyQ29kZUF0KDApLFxuICAgICAgICAgIHIgPSBbXCImI1wiXTtcbiAgICAgIGMgPSBjID09IDB4MjAgPyAweEEwIDogYztcbiAgICAgIHIucHVzaChjKTtcbiAgICAgIHIucHVzaChcIjtcIik7XG4gICAgICByZXR1cm4gci5qb2luKFwiXCIpO1xuICAgIH0pO1xuICB9LFxuICBEZWNvZGVIdG1sOiBmdW5jdGlvbiBEZWNvZGVIdG1sKHN0cikge1xuICAgIHZhciBSRUdYX0hUTUxfREVDT0RFID0gLyZcXHcrO3wmIyhcXGQrKTsvZztcbiAgICB2YXIgSFRNTF9ERUNPREUgPSB7XG4gICAgICBcIiZsdDtcIjogXCI8XCIsXG4gICAgICBcIiZndDtcIjogXCI+XCIsXG4gICAgICBcIiZhbXA7XCI6IFwiJlwiLFxuICAgICAgXCImbmJzcDtcIjogXCIgXCIsXG4gICAgICBcIiZxdW90O1wiOiBcIlxcXCJcIixcbiAgICAgIFwiwqlcIjogXCJcIlxuICAgIH07XG4gICAgcmV0dXJuIHR5cGVvZiBzdHIgIT0gXCJzdHJpbmdcIiA/IHN0ciA6IHN0ci5yZXBsYWNlKFJFR1hfSFRNTF9ERUNPREUsIGZ1bmN0aW9uICgkMCwgJDEpIHtcbiAgICAgIHZhciBjID0gSFRNTF9ERUNPREVbJDBdO1xuXG4gICAgICBpZiAoYyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKCFpc05hTigkMSkpIHtcbiAgICAgICAgICBjID0gU3RyaW5nLmZyb21DaGFyQ29kZSgkMSA9PSAxNjAgPyAzMiA6ICQxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjID0gJDA7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGM7XG4gICAgfSk7XG4gIH0sXG4gIEdldEZpbGVFeE5hbWU6IGZ1bmN0aW9uIEdldEZpbGVFeE5hbWUoZmlsZU5hbWUpIHtcbiAgICB2YXIgZXh0ID0gZmlsZU5hbWUuc3Vic3RyaW5nKGZpbGVOYW1lLmxhc3RJbmRleE9mKFwiLlwiKSwgZmlsZU5hbWUubGVuZ3RoKTtcbiAgICByZXR1cm4gZXh0O1xuICB9LFxuICBSZXBsYWNlU1BDaGFyTDE6IGZ1bmN0aW9uIFJlcGxhY2VTUENoYXJMMShzb3VyY2UpIHtcbiAgICB2YXIgcmVnID0gL1xcXFx8XFwvfFxcP3xcXO+8n3xcXCp8XFxcInxcXOKAnHxcXOKAnXxcXCd8XFzigJh8XFzigJl8XFzjgIF8XFxefFxcJHxcXCF8XFx+fFxcYHxcXHwvZztcbiAgICB2YXIgdGVtcCA9IHNvdXJjZS5yZXBsYWNlKHJlZywgXCJcIik7XG4gICAgcmV0dXJuIHRlbXA7XG4gIH0sXG4gIFJlcGxhY2VTUENoYXJMMjogZnVuY3Rpb24gUmVwbGFjZVNQQ2hhckwyKHNvdXJjZSkge1xuICAgIHZhciByZWcgPSAvXFxcXHxcXC98XFw/fFxc77yffFxcKnxcXFwifFxc4oCcfFxc4oCdfFxcJ3xcXOKAmHxcXOKAmXxcXDx8XFw+fFxce3xcXH18XFxbfFxcXXwsfFxc44CQfFxc44CRfFxc77yafFxcOnxcXOOAgXxcXF58XFwkfFxcIXxcXH58XFxgfFxcfC9nO1xuICAgIHZhciB0ZW1wID0gc291cmNlLnJlcGxhY2UocmVnLCBcIlwiKTtcbiAgICByZXR1cm4gdGVtcDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFRyZWVVdGlsaXR5ID0ge1xuICBCdWlsZE5vZGVQYXRoTmFtZTogZnVuY3Rpb24gQnVpbGROb2RlUGF0aE5hbWUodHJlZU5vZGUsIG5hbWUsIGFwcGVuZFRleHQsIGJlZ2luSW5kZXgpIHtcbiAgICBpZiAoIWJlZ2luSW5kZXgpIHtcbiAgICAgIGJlZ2luSW5kZXggPSAwO1xuICAgIH1cblxuICAgIHZhciBhcnkgPSBbXTtcbiAgICB2YXIgcGF0aE5vZGUgPSB0cmVlTm9kZS5nZXRQYXRoKCk7XG5cbiAgICBmb3IgKHZhciBpID0gYmVnaW5JbmRleDsgaSA8IHBhdGhOb2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnkucHVzaChTdHJpbmdVdGlsaXR5LlJlcGxhY2VTUENoYXJMMihwYXRoTm9kZVtpXVtuYW1lXSkpO1xuICAgIH1cblxuICAgIGlmIChTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkoYXBwZW5kVGV4dCkpIHtcbiAgICAgIHJldHVybiBhcnkuam9pbihcIuKWt+KWt1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJ5LmpvaW4oXCLilrfilrdcIikgKyBcIuKWt+KWt1wiICsgU3RyaW5nVXRpbGl0eS5SZXBsYWNlU1BDaGFyTDIoYXBwZW5kVGV4dCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBWYWxpZGF0ZVV0aWxpdHkgPSB7XG4gIFZhbGlkYXRlVHlwZToge1xuICAgIE5vdEVtcHR5OiBcIlwiLFxuICAgIEludDogXCJcIixcbiAgICBOdW1iZXI6IFwiXCIsXG4gICAgU2ltcGxlQ29kZTogXCJcIixcbiAgICBFTWFpbDogXCJcIixcbiAgICBNb2JpbGU6IFwiXCIsXG4gICAgR2VuZXJhbFdvcmQ6IFwiXCJcbiAgfSxcbiAgVmFsaWRhdGVTaW5nbGU6IGZ1bmN0aW9uIFZhbGlkYXRlU2luZ2xlKHZhbHVlLCB0eXBlLCBjYXB0aW9uLCBtZXNzYWdlLCBlcnJvckNhbGxCYWNrKSB7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBtZXNzYWdlQXJyYXk6IFtdLFxuICAgICAgbWVzc2FnZTogXCJcIlxuICAgIH07XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgdGhpcy5WYWxpZGF0ZVR5cGUuTm90RW1wdHk6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgdmFsID0gU3RyaW5nVXRpbGl0eS5UcmltKHZhbHVlKTtcblxuICAgICAgICAgIGlmICh2YWwgPT0gXCJcIikge1xuICAgICAgICAgICAgdmFyIG1zZyA9IFwi44CQXCIgKyBjYXB0aW9uICsgXCLjgJHkuI3og73kuLrnqbrvvIFcIjtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRFcnJvcih3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRFcnJvcklkLCB7fSwgbXNnLCBudWxsLCBudWxsKTtcbiAgICAgICAgICAgIHJlc3VsdC5zdWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICByZXN1bHQubWVzc2FnZSA9IG1zZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgdGhpcy5WYWxpZGF0ZVR5cGUuU2ltcGxlQ29kZTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciByZWcgPSAvXlthLXpBLVowLTlfXXswLH0kLztcblxuICAgICAgICAgIGlmICghcmVnLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICB2YXIgbXNnID0gXCLjgJBcIiArIGNhcHRpb24gKyBcIuOAkeivt+S9v+eUqOiLseaWhyzmlbDlrZcs5oiW6ICFX++8gVwiO1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEVycm9yKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydEVycm9ySWQsIHt9LCBtc2csIG51bGwsIG51bGwpO1xuICAgICAgICAgICAgcmVzdWx0LnN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIHJlc3VsdC5tZXNzYWdlID0gbXNnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBYTUxVdGlsaXR5ID0ge307Il19
