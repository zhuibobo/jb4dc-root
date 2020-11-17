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
    if (caller) {
      if (caller == "json") {
        DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, "由于方法更新,caller参数请传递this", null);
      }
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

    var _url = this.GetRootPath() + action;

    if (urlPara != "") {
      _url += "?" + urlPara;
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
  GetCurrentDataString: function GetCurrentDataString(split) {
    alert("DateUtility.GetCurrentDataString 已停用");
  },
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
  FormatCurrentData: function FormatCurrentData(formatString) {
    var myDate = new Date();
    return this.Format(myDate, formatString);
  },
  GetCurrentData: function GetCurrentData() {
    return new Date();
  },
  GetCurrentTimeStamp: function GetCurrentTimeStamp() {
    return new Date().getTime();
  },
  DataFormatByTimeStamp: function DataFormatByTimeStamp(timeStamp, formatString) {
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
  DialogNewWindowId: "DialogNewWindowId01",
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
                               <div class='alert-loading-img'></div>\
                               <div class='alert-loading-txt'></div>\
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
      width: 300,
      title: "",
      show: true,
      modal: true
    };
    var defaultConfig = $.extend(true, {}, defaultConfig, config);
    $(htmlElem).find(".alert-loading-txt").html(htmlMsg);
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
    var link = $("<a href='" + url + "' style='position:absolute;top: -100px;width: 0px;height: 0px' target='_blank'></a>");
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
    sender.$Message.info(message);
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
      pageHeight = pageHeight - $("#list-button-wrap").outerHeight() + fixHeight - ($("#list-pager-wrap").length > 0 ? $("#list-pager-wrap").outerHeight() : 0) - 30;
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
      custParas: {}
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

        if (config.autoSelectedOldRows) {
          if (config.tableList.selectionRows != null) {
            for (var i = 0; i < config.tableList.tableData.length; i++) {
              for (var j = 0; j < config.tableList.selectionRows.length; j++) {
                if (config.tableList.selectionRows[j][config.idField] == config.tableList.tableData[i][config.idField]) {
                  config.tableList.tableData[i]._checked = true;
                }
              }
            }
          }
        }
      }
    }, this, "json");
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
  IsNullOrEmpty: function IsNullOrEmpty(obj) {
    return obj == undefined || obj == "" || obj == null || obj == "undefined" || obj == "null";
  },
  IsNotNullOrEmpty: function IsNotNullOrEmpty(obj) {
    return !this.IsNullOrEmpty(obj);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFqYXhVdGlsaXR5LmpzIiwiQXJyYXlVdGlsaXR5LmpzIiwiQmFpZHVNYXBVdGlsaXR5LmpzIiwiQmFzZVV0aWxpdHkuanMiLCJCcm93c2VySW5mb1V0aWxpdHkuanMiLCJDYWNoZURhdGFVdGlsaXR5LmpzIiwiQ29va2llVXRpbGl0eS5qcyIsIkRhdGVVdGlsaXR5LmpzIiwiRGV0YWlsUGFnZVV0aWxpdHkuanMiLCJEaWFsb2dVdGlsaXR5LmpzIiwiRGljdGlvbmFyeVV0aWxpdHkuanMiLCJIYXJkRGlza1V0aWxpdHkuanMiLCJKQnVpbGQ0RENCYXNlTGliLmpzIiwiSkJ1aWxkNERDWWFtbC5qcyIsIkpzb25VdGlsaXR5LmpzIiwiTGlzdFBhZ2VVdGlsaXR5LmpzIiwiTG9jYWxTdG9yYWdlVXRpbGl0eS5qcyIsIlBhZ2VTdHlsZVV0aWxpdHkuanMiLCJTZWFyY2hVdGlsaXR5LmpzIiwiU2VsZWN0Vmlld0xpYi5qcyIsIlNlc3Npb25VdGlsaXR5LmpzIiwiU3RyaW5nVXRpbGl0eS5qcyIsIlRyZWVVdGlsaXR5LmpzIiwiVmFsaWRhdGVVdGlsaXR5LmpzIiwiWE1MVXRpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0RBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaG1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0EiLCJmaWxlIjoiSkJ1aWxkNERDTGliLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBBamF4VXRpbGl0eSA9IHtcbiAgUG9zdFJlcXVlc3RCb2R5OiBmdW5jdGlvbiBQb3N0UmVxdWVzdEJvZHkoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5fSW5uZXJBamF4KF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIiwgdHJ1ZSwgXCJQT1NUXCIpO1xuICB9LFxuICBQb3N0U3luYzogZnVuY3Rpb24gUG9zdFN5bmMoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUsIGNvbnRlbnRUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuX0lubmVyQWpheChfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSwgbnVsbCwgZmFsc2UsIFwiUE9TVFwiKTtcbiAgfSxcbiAgUG9zdDogZnVuY3Rpb24gUG9zdChfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSkge1xuICAgIHJldHVybiB0aGlzLl9Jbm5lckFqYXgoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUsIG51bGwsIHRydWUsIFwiUE9TVFwiKTtcbiAgfSxcbiAgR2V0U3luYzogZnVuY3Rpb24gR2V0U3luYyhfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSkge1xuICAgIHJldHVybiB0aGlzLl9Jbm5lckFqYXgoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUsIG51bGwsIGZhbHNlLCBcIkdFVFwiKTtcbiAgfSxcbiAgR2V0OiBmdW5jdGlvbiBHZXQoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5fSW5uZXJBamF4KF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlLCBudWxsLCB0cnVlLCBcIkdFVFwiKTtcbiAgfSxcbiAgRGVsZXRlOiBmdW5jdGlvbiBEZWxldGUoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5fSW5uZXJBamF4KF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlLCBudWxsLCB0cnVlLCBcIkRFTEVURVwiKTtcbiAgfSxcbiAgRGVsZXRlU3luYzogZnVuY3Rpb24gRGVsZXRlU3luYyhfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSkge1xuICAgIHJldHVybiB0aGlzLl9Jbm5lckFqYXgoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUsIG51bGwsIGZhbHNlLCBcIkRFTEVURVwiKTtcbiAgfSxcbiAgX0lubmVyQWpheDogZnVuY3Rpb24gX0lubmVyQWpheChfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSwgY29udGVudFR5cGUsIGlzQXN5bmMsIGFqYXhUeXBlKSB7XG4gICAgaWYgKGNhbGxlcikge1xuICAgICAgaWYgKGNhbGxlciA9PSBcImpzb25cIikge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0RXJyb3Iod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0RXJyb3JJZCwge30sIFwi55Sx5LqO5pa55rOV5pu05pawLGNhbGxlcuWPguaVsOivt+S8oOmAknRoaXNcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKF91cmwpO1xuXG4gICAgaWYgKGRhdGFUeXBlID09IHVuZGVmaW5lZCB8fCBkYXRhVHlwZSA9PSBudWxsKSB7XG4gICAgICBkYXRhVHlwZSA9IFwianNvblwiO1xuICAgIH1cblxuICAgIGlmIChpc0FzeW5jID09IHVuZGVmaW5lZCB8fCBpc0FzeW5jID09IG51bGwpIHtcbiAgICAgIGlzQXN5bmMgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjb250ZW50VHlwZSA9PSB1bmRlZmluZWQgfHwgY29udGVudFR5cGUgPT0gbnVsbCkge1xuICAgICAgY29udGVudFR5cGUgPSBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiO1xuICAgIH1cblxuICAgIHZhciBpbm5lclJlc3VsdCA9IG51bGw7XG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6IGFqYXhUeXBlLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBhc3luYzogaXNBc3luYyxcbiAgICAgIGNvbnRlbnRUeXBlOiBjb250ZW50VHlwZSxcbiAgICAgIGRhdGFUeXBlOiBkYXRhVHlwZSxcbiAgICAgIGRhdGE6IHNlbmREYXRhLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhyZXN1bHQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwgJiYgcmVzdWx0LnN1Y2Nlc3MgIT0gbnVsbCAmJiAhcmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQubWVzc2FnZSA9PSBcIueZu+W9lVNlc3Npb27ov4fmnJ9cIikge1xuICAgICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0RXJyb3Iod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0RXJyb3JJZCwge30sIFwiU2Vzc2lvbui2heaXtu+8jOivt+mHjeaWsOeZu+mZhuezu+e7n1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgQmFzZVV0aWxpdHkuUmVkaXJlY3RUb0xvZ2luKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWpheFV0aWxpdHkuUG9zdCBFeGNlcHRpb24gXCIgKyB1cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gcmVzdWx0Lm1lc3NhZ2U7XG5cbiAgICAgICAgICAgIGlmIChTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkobWVzc2FnZSkpIHtcbiAgICAgICAgICAgICAgbWVzc2FnZSA9IHJlc3VsdC50cmFjZU1zZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEVycm9yKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydEVycm9ySWQsIHt9LCBtZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG5cbiAgICAgICAgICAgIGlmIChjYWxsZXIpIHtcbiAgICAgICAgICAgICAgaWYgKGNhbGxlci5pc1N1Ym1pdHRpbmcpIHtcbiAgICAgICAgICAgICAgICBjYWxsZXIuaXNTdWJtaXR0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICAgICAgaWYgKGNhbGxlcikge1xuICAgICAgICAgIGZ1bmMuY2FsbChjYWxsZXIsIHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnVuYyhyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5uZXJSZXN1bHQgPSByZXN1bHQ7XG4gICAgICB9LFxuICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKG1zZykge30sXG4gICAgICBlcnJvcjogZnVuY3Rpb24gZXJyb3IobXNnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKG1zZy5yZXNwb25zZVRleHQuaW5kZXhPZihcIuivt+mHjeaWsOeZu+mZhuezu+e7n1wiKSA+PSAwKSB7XG4gICAgICAgICAgICBCYXNlVXRpbGl0eS5SZWRpcmVjdFRvTG9naW4oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRFcnJvcih3aW5kb3csIFwiQWpheFV0aWxpdHkuUG9zdC5FcnJvclwiLCB7fSwgXCJBamF46K+35rGC5Y+R55Sf6ZSZ6K+v77yBPGJyLz5cIiArIFwic3RhdHVzOlwiICsgbXNnLnN0YXR1cyArIFwiLDxici8+cmVzcG9uc2VUZXh0OlwiICsgbXNnLnJlc3BvbnNlVGV4dCwgbnVsbCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGlubmVyUmVzdWx0O1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQXJyYXlVdGlsaXR5ID0ge1xuICBEZWxldGU6IGZ1bmN0aW9uIERlbGV0ZShhcnksIGluZGV4KSB7XG4gICAgYXJ5LnNwbGljZShpbmRleCwgMSk7XG4gIH0sXG4gIFN3YXBJdGVtczogZnVuY3Rpb24gU3dhcEl0ZW1zKGFyeSwgaW5kZXgxLCBpbmRleDIpIHtcbiAgICBhcnlbaW5kZXgxXSA9IGFyeS5zcGxpY2UoaW5kZXgyLCAxLCBhcnlbaW5kZXgxXSlbMF07XG4gICAgcmV0dXJuIGFyeTtcbiAgfSxcbiAgTW92ZVVwOiBmdW5jdGlvbiBNb3ZlVXAoYXJyLCAkaW5kZXgpIHtcbiAgICBpZiAoJGluZGV4ID09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLlN3YXBJdGVtcyhhcnIsICRpbmRleCwgJGluZGV4IC0gMSk7XG4gIH0sXG4gIE1vdmVEb3duOiBmdW5jdGlvbiBNb3ZlRG93bihhcnIsICRpbmRleCkge1xuICAgIGlmICgkaW5kZXggPT0gYXJyLmxlbmd0aCAtIDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLlN3YXBJdGVtcyhhcnIsICRpbmRleCwgJGluZGV4ICsgMSk7XG4gIH0sXG4gIFVuaXF1ZTogZnVuY3Rpb24gVW5pcXVlKGFycikge1xuICAgIHZhciBuID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG4uaW5kZXhPZihhcnJbaV0pID09IC0xKSBuLnB1c2goYXJyW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbjtcbiAgfSxcbiAgRXhpc3Q6IGZ1bmN0aW9uIEV4aXN0KGFyciwgY29uZGl0aW9uKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjb25kaXRpb24oYXJyW2ldKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIFB1c2hXaGVuTm90RXhpc3Q6IGZ1bmN0aW9uIFB1c2hXaGVuTm90RXhpc3QoYXJyLCBpdGVtLCBjb25kaXRpb24pIHtcbiAgICBpZiAoIXRoaXMuRXhpc3QoYXJyLCBjb25kaXRpb24pKSB7XG4gICAgICBhcnIucHVzaChpdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyO1xuICB9LFxuICBXaGVyZTogZnVuY3Rpb24gV2hlcmUoYXJyLCBjb25kaXRpb24pIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGNvbmRpdGlvbihhcnJbaV0pKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGFycltpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgV2hlcmVTaW5nbGU6IGZ1bmN0aW9uIFdoZXJlU2luZ2xlKGFyciwgY29uZGl0aW9uKSB7XG4gICAgdmFyIHRlbXAgPSB0aGlzLldoZXJlKGFyciwgY29uZGl0aW9uKTtcblxuICAgIGlmICh0ZW1wLmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGVtcFswXTtcbiAgfSxcbiAgUHVzaDogZnVuY3Rpb24gUHVzaChzb3VyY2UsIGFwcGVuZCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGFwcGVuZCkpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXBwZW5kLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHNvdXJjZS5wdXNoKGFwcGVuZFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNvdXJjZS5wdXNoKGFwcGVuZCk7XG4gICAgfVxuICB9LFxuICBUcnVlOiBmdW5jdGlvbiBUcnVlKHNvdXJjZSwgY29uZGl0aW9uKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjb25kaXRpb24oc291cmNlW2ldKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIElzQXJyYXk6IGZ1bmN0aW9uIElzQXJyYXkoc291cmNlKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KSB7XG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShzb3VyY2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHNvdXJjZSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfVxuICB9LFxuICBSZXBsYWNlSXRlbTogZnVuY3Rpb24gUmVwbGFjZUl0ZW0oc291cmNlLCBuZXdJdGVtLCBjb25kaXRpb24pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGNvbmRpdGlvbihzb3VyY2VbaV0pKSB7XG4gICAgICAgIHNvdXJjZS5zcGxpY2UoaSwgMSwgbmV3SXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBFeGlzdFJlcGxhY2VJdGVtOiBmdW5jdGlvbiBFeGlzdFJlcGxhY2VJdGVtKHNvdXJjZSwgbmV3SXRlbSwgY29uZGl0aW9uKSB7XG4gICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGNvbmRpdGlvbihzb3VyY2VbaV0pKSB7XG4gICAgICAgIHNvdXJjZS5zcGxpY2UoaSwgMSwgbmV3SXRlbSk7XG4gICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEJhaWR1TWFwVXRpbGl0eSA9IHtcbiAgTG9hZEpzQ29tcGxldGVkOiBmdW5jdGlvbiBMb2FkSnNDb21wbGV0ZWQoY2JGdW5jTmFtZSkge1xuICAgIEFqYXhVdGlsaXR5LkdldChcIi9SZXN0L1Byb3BzL1N5c3RlbVByb3BlcnRpZXMvR2V0QmFpZHVNYXBKc1VybFwiLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIHZhciB1cmwgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgIHNjcmlwdC5zcmMgPSB1cmwgKyBcIiZjYWxsYmFjaz1cIiArIGNiRnVuY05hbWU7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgR2V0TGF0TG5nQ2VudGVyOiBmdW5jdGlvbiBHZXRMYXRMbmdDZW50ZXIocG9seWdvblBhdGhBcnJheSkge1xuICAgIHZhciBhcnkgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9seWdvblBhdGhBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgYXJ5LnB1c2goW3BvbHlnb25QYXRoQXJyYXlbaV0ubG5nLCBwb2x5Z29uUGF0aEFycmF5W2ldLmxhdF0pO1xuICAgIH1cblxuICAgIHZhciBwb2x5Z29uID0gdHVyZi5wb2x5Z29uKFthcnldKTtcbiAgICB2YXIgY2VudGVyID0gdHVyZi5jZW50ZXIocG9seWdvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxuZzogY2VudGVyLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLFxuICAgICAgbGF0OiBjZW50ZXIuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV1cbiAgICB9O1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQmFzZVV0aWxpdHkgPSB7XG4gIEdldFJvb3RQYXRoOiBmdW5jdGlvbiBHZXRSb290UGF0aCgpIHtcbiAgICB2YXIgZnVsbEhyZWYgPSB3aW5kb3cuZG9jdW1lbnQubG9jYXRpb24uaHJlZjtcbiAgICB2YXIgcGF0aE5hbWUgPSB3aW5kb3cuZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgdmFyIGxhYyA9IGZ1bGxIcmVmLmluZGV4T2YocGF0aE5hbWUpO1xuICAgIHZhciBsb2NhbGhvc3RQYXRoID0gZnVsbEhyZWYuc3Vic3RyaW5nKDAsIGxhYyk7XG4gICAgdmFyIHByb2plY3ROYW1lID0gcGF0aE5hbWUuc3Vic3RyaW5nKDAsIHBhdGhOYW1lLnN1YnN0cigxKS5pbmRleE9mKCcvJykgKyAxKTtcbiAgICByZXR1cm4gbG9jYWxob3N0UGF0aCArIHByb2plY3ROYW1lO1xuICB9LFxuICBHZXRUb3BXaW5kb3c6IGZ1bmN0aW9uIEdldFRvcFdpbmRvdygpIHtcbiAgICBhbGVydChcIkJhc2VVdGlsaXR5LkdldFRvcFdpbmRvdyDlt7LlgZznlKhcIik7XG4gIH0sXG4gIFRyeVNldENvbnRyb2xGb2N1czogZnVuY3Rpb24gVHJ5U2V0Q29udHJvbEZvY3VzKCkge1xuICAgIGFsZXJ0KFwiQmFzZVV0aWxpdHkuVHJ5U2V0Q29udHJvbEZvY3VzIOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgQnVpbGRWaWV3OiBmdW5jdGlvbiBCdWlsZFZpZXcoYWN0aW9uLCBwYXJhKSB7XG4gICAgcmV0dXJuIHRoaXMuQnVpbGRBY3Rpb24oYWN0aW9uLCBwYXJhKTtcbiAgfSxcbiAgQnVpbGRBY3Rpb246IGZ1bmN0aW9uIEJ1aWxkQWN0aW9uKGFjdGlvbiwgcGFyYSkge1xuICAgIHZhciB1cmxQYXJhID0gXCJcIjtcblxuICAgIGlmIChwYXJhKSB7XG4gICAgICB1cmxQYXJhID0gJC5wYXJhbShwYXJhKTtcbiAgICB9XG5cbiAgICB2YXIgX3VybCA9IHRoaXMuR2V0Um9vdFBhdGgoKSArIGFjdGlvbjtcblxuICAgIGlmICh1cmxQYXJhICE9IFwiXCIpIHtcbiAgICAgIF91cmwgKz0gXCI/XCIgKyB1cmxQYXJhO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLkFwcGVuZFRpbWVTdGFtcFVybChfdXJsKTtcbiAgfSxcbiAgUmVkaXJlY3RUb0xvZ2luOiBmdW5jdGlvbiBSZWRpcmVjdFRvTG9naW4oKSB7XG4gICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9QbGF0Rm9ybS9Mb2dpblZpZXcuZG9cIjtcbiAgICB3aW5kb3cucGFyZW50LnBhcmVudC5sb2NhdGlvbi5ocmVmID0gdXJsO1xuICB9LFxuICBBcHBlbmRUaW1lU3RhbXBVcmw6IGZ1bmN0aW9uIEFwcGVuZFRpbWVTdGFtcFVybCh1cmwpIHtcbiAgICBpZiAodXJsLmluZGV4T2YoXCJ0aW1lc3RhbXBcIikgPiBcIjBcIikge1xuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG5cbiAgICB2YXIgZ2V0VGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICBpZiAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgIHVybCA9IHVybCArIFwiJnRpbWVzdGFtcD1cIiArIGdldFRpbWVzdGFtcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gdXJsICsgXCI/dGltZXN0YW1wPVwiICsgZ2V0VGltZXN0YW1wO1xuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG4gIH0sXG4gIEdldFVybFBhcmFWYWx1ZTogZnVuY3Rpb24gR2V0VXJsUGFyYVZhbHVlKHBhcmFOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuR2V0VXJsUGFyYVZhbHVlQnlTdHJpbmcocGFyYU5hbWUsIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICB9LFxuICBHZXRVcmxPUFBhcmFWYWx1ZTogZnVuY3Rpb24gR2V0VXJsT1BQYXJhVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuR2V0VXJsUGFyYVZhbHVlKFwib3BcIik7XG4gIH0sXG4gIEdldFVybFBhcmFWYWx1ZUJ5U3RyaW5nOiBmdW5jdGlvbiBHZXRVcmxQYXJhVmFsdWVCeVN0cmluZyhwYXJhTmFtZSwgdXJsU3RyaW5nKSB7XG4gICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoXCIoXnwmKVwiICsgcGFyYU5hbWUgKyBcIj0oW14mXSopKCZ8JClcIik7XG4gICAgdmFyIHIgPSB1cmxTdHJpbmcuc3Vic3RyKDEpLm1hdGNoKHJlZyk7XG4gICAgaWYgKHIgIT0gbnVsbCkgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyWzJdKTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfSxcbiAgQ29weVZhbHVlQ2xpcGJvYXJkOiBmdW5jdGlvbiBDb3B5VmFsdWVDbGlwYm9hcmQodmFsdWUpIHtcbiAgICB2YXIgdHJhbnNmZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnSl9Db3B5VHJhbnNmZXInKTtcblxuICAgIGlmICghdHJhbnNmZXIpIHtcbiAgICAgIHRyYW5zZmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICAgIHRyYW5zZmVyLmlkID0gJ0pfQ29weVRyYW5zZmVyJztcbiAgICAgIHRyYW5zZmVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIHRyYW5zZmVyLnN0eWxlLmxlZnQgPSAnLTk5OTlweCc7XG4gICAgICB0cmFuc2Zlci5zdHlsZS50b3AgPSAnLTk5OTlweCc7XG4gICAgICB0cmFuc2Zlci5zdHlsZS56SW5kZXggPSA5OTk5O1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0cmFuc2Zlcik7XG4gICAgfVxuXG4gICAgdHJhbnNmZXIudmFsdWUgPSB2YWx1ZTtcbiAgICB0cmFuc2Zlci5mb2N1cygpO1xuICAgIHRyYW5zZmVyLnNlbGVjdCgpO1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG4gIH0sXG4gIFNldFN5c3RlbUZhdmljb246IGZ1bmN0aW9uIFNldFN5c3RlbUZhdmljb24oKSB7XG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibGlua1tyZWwqPSdpY29uJ11cIikgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgIGxpbmsudHlwZSA9ICdpbWFnZS94LWljb24nO1xuICAgIGxpbmsucmVsID0gJ3Nob3J0Y3V0IGljb24nO1xuICAgIGxpbmsuaHJlZiA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyAnL2Zhdmljb24uaWNvJztcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKGxpbmspO1xuICB9LFxuICBTZXRTeXN0ZW1UaXRsZTogZnVuY3Rpb24gU2V0U3lzdGVtVGl0bGUoKSB7XG4gICAgZG9jdW1lbnQudGl0bGUgPSBKQnVpbGQ0RENZYW1sLkdldENsaWVudFN5c3RlbVRpdGxlKCk7XG4gIH0sXG4gIFNldFN5c3RlbUNhcHRpb246IGZ1bmN0aW9uIFNldFN5c3RlbUNhcHRpb24oKSB7XG4gICAgJChcIiNzeXN0ZW1DYXB0aW9uXCIpLnRleHQoSkJ1aWxkNERDWWFtbC5HZXRDbGllbnRTeXN0ZW1DYXB0aW9uKCkpO1xuICB9LFxuICBJc0Z1bmN0aW9uOiBmdW5jdGlvbiBJc0Z1bmN0aW9uKGZ1bmMpIHtcbiAgICBpZiAodHlwZW9mIGZ1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIEdldEVsZW1BbGxBdHRyOiBmdW5jdGlvbiBHZXRFbGVtQWxsQXR0cigkZWxlbSkge1xuICAgIHZhciBhdHRycyA9IHt9O1xuICAgICRlbGVtLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgJC5lYWNoKHRoaXMuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5zcGVjaWZpZWQpIHtcbiAgICAgICAgICBhdHRyc1t0aGlzLm5hbWVdID0gdGhpcy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGF0dHJzO1xuICB9LFxuICBHZXRWaWV3T3BlcmF0aW9uTmFtZTogZnVuY3Rpb24gR2V0Vmlld09wZXJhdGlvbk5hbWUoKSB7XG4gICAgcmV0dXJuIFwidmlld1wiO1xuICB9LFxuICBJc1ZpZXdPcGVyYXRpb246IGZ1bmN0aW9uIElzVmlld09wZXJhdGlvbihvcGVyYXRpb25UeXBlKSB7XG4gICAgcmV0dXJuIG9wZXJhdGlvblR5cGUgJiYgb3BlcmF0aW9uVHlwZSA9PSB0aGlzLkdldFZpZXdPcGVyYXRpb25OYW1lKCk7XG4gIH0sXG4gIEdldEFkZE9wZXJhdGlvbk5hbWU6IGZ1bmN0aW9uIEdldEFkZE9wZXJhdGlvbk5hbWUoKSB7XG4gICAgcmV0dXJuIFwiYWRkXCI7XG4gIH0sXG4gIElzQWRkT3BlcmF0aW9uOiBmdW5jdGlvbiBJc0FkZE9wZXJhdGlvbihvcGVyYXRpb25UeXBlKSB7XG4gICAgcmV0dXJuIG9wZXJhdGlvblR5cGUgJiYgb3BlcmF0aW9uVHlwZSA9PSB0aGlzLkdldEFkZE9wZXJhdGlvbk5hbWUoKTtcbiAgfSxcbiAgR2V0VXBkYXRlT3BlcmF0aW9uTmFtZTogZnVuY3Rpb24gR2V0VXBkYXRlT3BlcmF0aW9uTmFtZSgpIHtcbiAgICByZXR1cm4gXCJ1cGRhdGVcIjtcbiAgfSxcbiAgSXNVcGRhdGVPcGVyYXRpb246IGZ1bmN0aW9uIElzVXBkYXRlT3BlcmF0aW9uKG9wZXJhdGlvblR5cGUpIHtcbiAgICByZXR1cm4gb3BlcmF0aW9uVHlwZSAmJiBvcGVyYXRpb25UeXBlID09IHRoaXMuR2V0VXBkYXRlT3BlcmF0aW9uTmFtZSgpO1xuICB9LFxuICBHZXREZWxldGVPcGVyYXRpb25OYW1lOiBmdW5jdGlvbiBHZXREZWxldGVPcGVyYXRpb25OYW1lKCkge1xuICAgIHJldHVybiBcImRlbGV0ZVwiO1xuICB9LFxuICBJc0RlbGV0ZU9wZXJhdGlvbjogZnVuY3Rpb24gSXNEZWxldGVPcGVyYXRpb24ob3BlcmF0aW9uVHlwZSkge1xuICAgIHJldHVybiBvcGVyYXRpb25UeXBlICYmIG9wZXJhdGlvblR5cGUgPT0gdGhpcy5HZXREZWxldGVPcGVyYXRpb25OYW1lKCk7XG4gIH0sXG4gIElzQWRkT3BlcmF0aW9uQnlVcmw6IGZ1bmN0aW9uIElzQWRkT3BlcmF0aW9uQnlVcmwoKSB7XG4gICAgaWYgKHRoaXMuR2V0VXJsUGFyYVZhbHVlKFwib3BcIikpIHtcbiAgICAgIGlmICh0aGlzLkdldFVybFBhcmFWYWx1ZShcIm9wXCIpID09IHRoaXMuR2V0QWRkT3BlcmF0aW9uTmFtZSgpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgSXNVcGRhdGVPcGVyYXRpb25CeVVybDogZnVuY3Rpb24gSXNVcGRhdGVPcGVyYXRpb25CeVVybCgpIHtcbiAgICBpZiAodGhpcy5HZXRVcmxQYXJhVmFsdWUoXCJvcFwiKSkge1xuICAgICAgaWYgKHRoaXMuR2V0VXJsUGFyYVZhbHVlKFwib3BcIikgPT0gdGhpcy5HZXRVcGRhdGVPcGVyYXRpb25OYW1lKCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc1ZpZXdPcGVyYXRpb25CeVVybDogZnVuY3Rpb24gSXNWaWV3T3BlcmF0aW9uQnlVcmwoKSB7XG4gICAgaWYgKHRoaXMuR2V0VXJsUGFyYVZhbHVlKFwib3BcIikpIHtcbiAgICAgIGlmICh0aGlzLkdldFVybFBhcmFWYWx1ZShcIm9wXCIpID09IHRoaXMuR2V0Vmlld09wZXJhdGlvbk5hbWUoKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIFRocm93TWVzc2FnZTogZnVuY3Rpb24gVGhyb3dNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChtZXNzYWdlKTtcbiAgICB0aHJvdyBtZXNzYWdlO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQnJvd3NlckluZm9VdGlsaXR5ID0ge1xuICBCcm93c2VyQXBwTmFtZTogZnVuY3Rpb24gQnJvd3NlckFwcE5hbWUoKSB7XG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkZpcmVmb3hcIikgPiAwKSB7XG4gICAgICByZXR1cm4gXCJGaXJlZm94XCI7XG4gICAgfSBlbHNlIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpID4gMCkge1xuICAgICAgcmV0dXJuIFwiSUVcIjtcbiAgICB9IGVsc2UgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkNocm9tZVwiKSA+IDApIHtcbiAgICAgIHJldHVybiBcIkNocm9tZVwiO1xuICAgIH1cbiAgfSxcbiAgSXNJRTogZnVuY3Rpb24gSXNJRSgpIHtcbiAgICBpZiAoISF3aW5kb3cuQWN0aXZlWE9iamVjdCB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3cpIHJldHVybiB0cnVlO2Vsc2UgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc0lFNjogZnVuY3Rpb24gSXNJRTYoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgNi4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRTc6IGZ1bmN0aW9uIElzSUU3KCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDcuMFwiKSA+IDA7XG4gIH0sXG4gIElzSUU4OiBmdW5jdGlvbiBJc0lFOCgpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA4LjBcIikgPiAwO1xuICB9LFxuICBJc0lFOFg2NDogZnVuY3Rpb24gSXNJRThYNjQoKSB7XG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOC4wXCIpID4gMCkge1xuICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIng2NFwiKSA+IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc0lFOTogZnVuY3Rpb24gSXNJRTkoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOS4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRTlYNjQ6IGZ1bmN0aW9uIElzSUU5WDY0KCkge1xuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDkuMFwiKSA+IDApIHtcbiAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJ4NjRcIikgPiAwO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgSXNJRTEwOiBmdW5jdGlvbiBJc0lFMTAoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgMTAuMFwiKSA+IDA7XG4gIH0sXG4gIElzSUUxMFg2NDogZnVuY3Rpb24gSXNJRTEwWDY0KCkge1xuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDEwLjBcIikgPiAwKSB7XG4gICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwieDY0XCIpID4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIElFRG9jdW1lbnRNb2RlOiBmdW5jdGlvbiBJRURvY3VtZW50TW9kZSgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xuICB9LFxuICBJc0lFOERvY3VtZW50TW9kZTogZnVuY3Rpb24gSXNJRThEb2N1bWVudE1vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuSUVEb2N1bWVudE1vZGUoKSA9PSA4O1xuICB9LFxuICBJc0ZpcmVmb3g6IGZ1bmN0aW9uIElzRmlyZWZveCgpIHtcbiAgICByZXR1cm4gdGhpcy5Ccm93c2VyQXBwTmFtZSgpID09IFwiRmlyZWZveFwiO1xuICB9LFxuICBJc0Nocm9tZTogZnVuY3Rpb24gSXNDaHJvbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuQnJvd3NlckFwcE5hbWUoKSA9PSBcIkNocm9tZVwiO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2FjaGVEYXRhVXRpbGl0eSA9IHt9OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ29va2llVXRpbGl0eSA9IHtcbiAgU2V0Q29va2llMURheTogZnVuY3Rpb24gU2V0Q29va2llMURheShuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBleHAgPSBuZXcgRGF0ZSgpO1xuICAgIGV4cC5zZXRUaW1lKGV4cC5nZXRUaW1lKCkgKyAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBlc2NhcGUodmFsdWUpICsgXCI7ZXhwaXJlcz1cIiArIGV4cC50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XG4gIH0sXG4gIFNldENvb2tpZTFNb250aDogZnVuY3Rpb24gU2V0Q29va2llMU1vbnRoKG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGV4cCA9IG5ldyBEYXRlKCk7XG4gICAgZXhwLnNldFRpbWUoZXhwLmdldFRpbWUoKSArIDMwICogMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgZXNjYXBlKHZhbHVlKSArIFwiO2V4cGlyZXM9XCIgKyBleHAudG9HTVRTdHJpbmcoKSArIFwiO3BhdGg9L1wiO1xuICB9LFxuICBTZXRDb29raWUxWWVhcjogZnVuY3Rpb24gU2V0Q29va2llMVllYXIobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgZXhwID0gbmV3IERhdGUoKTtcbiAgICBleHAuc2V0VGltZShleHAuZ2V0VGltZSgpICsgMzAgKiAyNCAqIDYwICogNjAgKiAzNjUgKiAxMDAwKTtcbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBlc2NhcGUodmFsdWUpICsgXCI7ZXhwaXJlcz1cIiArIGV4cC50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XG4gIH0sXG4gIEdldENvb2tpZTogZnVuY3Rpb24gR2V0Q29va2llKG5hbWUpIHtcbiAgICB2YXIgYXJyID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoXCIoXnwgKVwiICsgbmFtZSArIFwiPShbXjtdKikoO3wkKVwiKSk7XG4gICAgaWYgKGFyciAhPSBudWxsKSByZXR1cm4gdW5lc2NhcGUoYXJyWzJdKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgRGVsQ29va2llOiBmdW5jdGlvbiBEZWxDb29raWUobmFtZSkge1xuICAgIHZhciBleHAgPSBuZXcgRGF0ZSgpO1xuICAgIGV4cC5zZXRUaW1lKGV4cC5nZXRUaW1lKCkgLSAxKTtcbiAgICB2YXIgY3ZhbCA9IHRoaXMuZ2V0Q29va2llKG5hbWUpO1xuICAgIGlmIChjdmFsICE9IG51bGwpIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIGN2YWwgKyBcIjtleHBpcmVzPVwiICsgZXhwLnRvR01UU3RyaW5nKCkgKyBcIjtwYXRoPS9cIjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERhdGVVdGlsaXR5ID0ge1xuICBHZXRDdXJyZW50RGF0YVN0cmluZzogZnVuY3Rpb24gR2V0Q3VycmVudERhdGFTdHJpbmcoc3BsaXQpIHtcbiAgICBhbGVydChcIkRhdGVVdGlsaXR5LkdldEN1cnJlbnREYXRhU3RyaW5nIOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgRGF0ZUZvcm1hdDogZnVuY3Rpb24gRGF0ZUZvcm1hdChteURhdGUsIHNwbGl0KSB7XG4gICAgYWxlcnQoXCJEYXRlVXRpbGl0eS5HZXRDdXJyZW50RGF0YVN0cmluZyDlt7LlgZznlKhcIik7XG4gIH0sXG4gIENvbnZlcnRGcm9tU3RyaW5nOiBmdW5jdGlvbiBDb252ZXJ0RnJvbVN0cmluZyhkYXRlU3RyaW5nKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRlU3RyaW5nKTtcbiAgICByZXR1cm4gZGF0ZTtcbiAgfSxcbiAgRm9ybWF0OiBmdW5jdGlvbiBGb3JtYXQobXlEYXRlLCBmb3JtYXRTdHJpbmcpIHtcbiAgICB2YXIgbyA9IHtcbiAgICAgIFwiTStcIjogbXlEYXRlLmdldE1vbnRoKCkgKyAxLFxuICAgICAgXCJkK1wiOiBteURhdGUuZ2V0RGF0ZSgpLFxuICAgICAgXCJoK1wiOiBteURhdGUuZ2V0SG91cnMoKSxcbiAgICAgIFwibStcIjogbXlEYXRlLmdldE1pbnV0ZXMoKSxcbiAgICAgIFwicytcIjogbXlEYXRlLmdldFNlY29uZHMoKSxcbiAgICAgIFwicStcIjogTWF0aC5mbG9vcigobXlEYXRlLmdldE1vbnRoKCkgKyAzKSAvIDMpLFxuICAgICAgXCJTXCI6IG15RGF0ZS5nZXRNaWxsaXNlY29uZHMoKVxuICAgIH07XG4gICAgaWYgKC8oeSspLy50ZXN0KGZvcm1hdFN0cmluZykpIGZvcm1hdFN0cmluZyA9IGZvcm1hdFN0cmluZy5yZXBsYWNlKFJlZ0V4cC4kMSwgKG15RGF0ZS5nZXRGdWxsWWVhcigpICsgXCJcIikuc3Vic3RyKDQgLSBSZWdFeHAuJDEubGVuZ3RoKSk7XG5cbiAgICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICAgIGlmIChuZXcgUmVnRXhwKFwiKFwiICsgayArIFwiKVwiKS50ZXN0KGZvcm1hdFN0cmluZykpIGZvcm1hdFN0cmluZyA9IGZvcm1hdFN0cmluZy5yZXBsYWNlKFJlZ0V4cC4kMSwgUmVnRXhwLiQxLmxlbmd0aCA9PSAxID8gb1trXSA6IChcIjAwXCIgKyBvW2tdKS5zdWJzdHIoKFwiXCIgKyBvW2tdKS5sZW5ndGgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9ybWF0U3RyaW5nO1xuICB9LFxuICBGb3JtYXRDdXJyZW50RGF0YTogZnVuY3Rpb24gRm9ybWF0Q3VycmVudERhdGEoZm9ybWF0U3RyaW5nKSB7XG4gICAgdmFyIG15RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIHRoaXMuRm9ybWF0KG15RGF0ZSwgZm9ybWF0U3RyaW5nKTtcbiAgfSxcbiAgR2V0Q3VycmVudERhdGE6IGZ1bmN0aW9uIEdldEN1cnJlbnREYXRhKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpO1xuICB9LFxuICBHZXRDdXJyZW50VGltZVN0YW1wOiBmdW5jdGlvbiBHZXRDdXJyZW50VGltZVN0YW1wKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfSxcbiAgRGF0YUZvcm1hdEJ5VGltZVN0YW1wOiBmdW5jdGlvbiBEYXRhRm9ybWF0QnlUaW1lU3RhbXAodGltZVN0YW1wLCBmb3JtYXRTdHJpbmcpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHRpbWVTdGFtcCk7XG4gICAgcmV0dXJuIHRoaXMuRm9ybWF0KGRhdGUsIGZvcm1hdFN0cmluZyk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEZXRhaWxQYWdlVXRpbGl0eSA9IHtcbiAgSVZpZXdQYWdlVG9WaWV3U3RhdHVzOiBmdW5jdGlvbiBJVmlld1BhZ2VUb1ZpZXdTdGF0dXMoKSB7XG4gICAgcmV0dXJuO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoXCJpbnB1dFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5oaWRlKCk7XG4gICAgICAgIHZhciB2YWwgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAkKHRoaXMpLmFmdGVyKCQoXCI8bGFiZWwgLz5cIikudGV4dCh2YWwpKTtcbiAgICAgIH0pO1xuICAgICAgJChcIi5pdnUtZGF0ZS1waWNrZXItZWRpdG9yXCIpLmZpbmQoXCIuaXZ1LWljb25cIikuaGlkZSgpO1xuICAgICAgJChcIi5pdnUtcmFkaW9cIikuaGlkZSgpO1xuICAgICAgJChcIi5pdnUtcmFkaW8tZ3JvdXAtaXRlbVwiKS5oaWRlKCk7XG4gICAgICAkKFwiLml2dS1yYWRpby13cmFwcGVyLWNoZWNrZWRcIikuc2hvdygpO1xuICAgICAgJChcIi5pdnUtcmFkaW8td3JhcHBlci1jaGVja2VkXCIpLmZpbmQoXCJzcGFuXCIpLmhpZGUoKTtcbiAgICAgICQoXCJ0ZXh0YXJlYVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5oaWRlKCk7XG4gICAgICAgIHZhciB2YWwgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAkKHRoaXMpLmFmdGVyKCQoXCI8bGFiZWwgLz5cIikudGV4dCh2YWwpKTtcbiAgICAgIH0pO1xuICAgIH0sIDEwMCk7XG4gIH0sXG4gIE92ZXJyaWRlT2JqZWN0VmFsdWU6IGZ1bmN0aW9uIE92ZXJyaWRlT2JqZWN0VmFsdWUoc291cmNlT2JqZWN0LCBkYXRhT2JqZWN0KSB7XG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZU9iamVjdCkge1xuICAgICAgaWYgKGRhdGFPYmplY3Rba2V5XSAhPSB1bmRlZmluZWQgJiYgZGF0YU9iamVjdFtrZXldICE9IG51bGwgJiYgZGF0YU9iamVjdFtrZXldICE9IFwiXCIpIHtcbiAgICAgICAgc291cmNlT2JqZWN0W2tleV0gPSBkYXRhT2JqZWN0W2tleV07XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBPdmVycmlkZU9iamVjdFZhbHVlRnVsbDogZnVuY3Rpb24gT3ZlcnJpZGVPYmplY3RWYWx1ZUZ1bGwoc291cmNlT2JqZWN0LCBkYXRhT2JqZWN0KSB7XG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZU9iamVjdCkge1xuICAgICAgc291cmNlT2JqZWN0W2tleV0gPSBkYXRhT2JqZWN0W2tleV07XG4gICAgfVxuICB9LFxuICBCaW5kRm9ybURhdGE6IGZ1bmN0aW9uIEJpbmRGb3JtRGF0YShpbnRlcmZhY2VVcmwsIHZ1ZUZvcm1EYXRhLCByZWNvcmRJZCwgb3AsIGJlZkZ1bmMsIGFmRnVuYywgY2FsbGVyKSB7XG4gICAgQWpheFV0aWxpdHkuUG9zdChpbnRlcmZhY2VVcmwsIHtcbiAgICAgIHJlY29yZElkOiByZWNvcmRJZCxcbiAgICAgIG9wOiBvcFxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBpZiAodHlwZW9mIGJlZkZ1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgYmVmRnVuYyhyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgRGV0YWlsUGFnZVV0aWxpdHkuT3ZlcnJpZGVPYmplY3RWYWx1ZSh2dWVGb3JtRGF0YSwgcmVzdWx0LmRhdGEpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYWZGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGFmRnVuYyhyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wID09IFwidmlld1wiKSB7XG4gICAgICAgICAgRGV0YWlsUGFnZVV0aWxpdHkuSVZpZXdQYWdlVG9WaWV3U3RhdHVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICB9XG4gICAgfSwgY2FsbGVyKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxudmFyIERpYWxvZ1V0aWxpdHkgPSB7XG4gIERpYWxvZ0FsZXJ0SWQ6IFwiRGVmYXVsdERpYWxvZ0FsZXJ0VXRpbGl0eTAxXCIsXG4gIERpYWxvZ0FsZXJ0RXJyb3JJZDogXCJEZWZhdWx0RGlhbG9nQWxlcnRFcnJvclV0aWxpdHkwMVwiLFxuICBEaWFsb2dQcm9tcHRJZDogXCJEZWZhdWx0RGlhbG9nUHJvbXB0VXRpbGl0eTAxXCIsXG4gIERpYWxvZ0xvYWRpbmdJZDogXCJEZWZhdWx0RGlhbG9nTG9hZGluZzAxXCIsXG4gIERpYWxvZ0lkOiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDFcIixcbiAgRGlhbG9nSWQwMjogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTAyXCIsXG4gIERpYWxvZ0lkMDM6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwM1wiLFxuICBEaWFsb2dJZDA0OiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDRcIixcbiAgRGlhbG9nSWQwNTogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTA1XCIsXG4gIERpYWxvZ05ld1dpbmRvd0lkOiBcIkRpYWxvZ05ld1dpbmRvd0lkMDFcIixcbiAgX0dldEVsZW06IGZ1bmN0aW9uIF9HZXRFbGVtKGRpYWxvZ0lkKSB7XG4gICAgcmV0dXJuICQoXCIjXCIgKyBkaWFsb2dJZCk7XG4gIH0sXG4gIF9DcmVhdGVEaWFsb2dFbGVtOiBmdW5jdGlvbiBfQ3JlYXRlRGlhbG9nRWxlbShkb2NPYmosIGRpYWxvZ0lkKSB7XG4gICAgaWYgKHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpLmxlbmd0aCA9PSAwKSB7XG4gICAgICB2YXIgZGlhbG9nRWxlID0gJChcIjxkaXYgaWQ9XCIgKyBkaWFsb2dJZCArIFwiIHRpdGxlPSfns7vnu5/mj5DnpLonIHN0eWxlPSdkaXNwbGF5Om5vbmUnPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XCIpO1xuICAgICAgJChkb2NPYmouYm9keSkuYXBwZW5kKGRpYWxvZ0VsZSk7XG4gICAgICByZXR1cm4gZGlhbG9nRWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fR2V0RWxlbShkaWFsb2dJZCk7XG4gICAgfVxuICB9LFxuICBfQ3JlYXRlQWxlcnRMb2FkaW5nTXNnRWxlbWVudDogZnVuY3Rpb24gX0NyZWF0ZUFsZXJ0TG9hZGluZ01zZ0VsZW1lbnQoZG9jT2JqLCBkaWFsb2dJZCkge1xuICAgIGlmICh0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKS5sZW5ndGggPT0gMCkge1xuICAgICAgdmFyIGRpYWxvZ0VsZSA9ICQoXCI8ZGl2IGlkPVwiICsgZGlhbG9nSWQgKyBcIiB0aXRsZT0n57O757uf5o+Q56S6JyBzdHlsZT0nZGlzcGxheTpub25lJz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nYWxlcnQtbG9hZGluZy1pbWcnPjwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdhbGVydC1sb2FkaW5nLXR4dCc+PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XCIpO1xuICAgICAgJChkb2NPYmouYm9keSkuYXBwZW5kKGRpYWxvZ0VsZSk7XG4gICAgICByZXR1cm4gZGlhbG9nRWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fR2V0RWxlbShkaWFsb2dJZCk7XG4gICAgfVxuICB9LFxuICBfQ3JlYXRlSWZyYW1lRGlhbG9nRWxlbWVudDogZnVuY3Rpb24gX0NyZWF0ZUlmcmFtZURpYWxvZ0VsZW1lbnQoZG9jT2JqLCBkaWFsb2dJZCwgdXJsKSB7XG4gICAgdmFyIGRpYWxvZ0VsZSA9ICQoXCI8ZGl2IGlkPVwiICsgZGlhbG9nSWQgKyBcIiB0aXRsZT0nQmFzaWMgZGlhbG9nJz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aWZyYW1lIG5hbWU9J2RpYWxvZ0lmcmFtZScgd2lkdGg9JzEwMCUnIGhlaWdodD0nOTglJyBmcmFtZWJvcmRlcj0nMCc+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pZnJhbWU+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gICAgJChkb2NPYmouYm9keSkuYXBwZW5kKGRpYWxvZ0VsZSk7XG4gICAgcmV0dXJuIGRpYWxvZ0VsZTtcbiAgfSxcbiAgX1Rlc3REaWFsb2dFbGVtSXNFeGlzdDogZnVuY3Rpb24gX1Rlc3REaWFsb2dFbGVtSXNFeGlzdChkaWFsb2dJZCkge1xuICAgIGlmICh0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIF9UZXN0UnVuRW5hYmxlOiBmdW5jdGlvbiBfVGVzdFJ1bkVuYWJsZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgQWxlcnRFcnJvcjogZnVuY3Rpb24gQWxlcnRFcnJvcihvcGVuZXJXaW5kb3csIGRpYWxvZ0lkLCBjb25maWcsIGh0bWxNc2csIHNGdW5jLCB0aW1lQ2xvc3VyZSkge1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiBcImF1dG9cIixcbiAgICAgIHdpZHRoOiBcImF1dG9cIixcbiAgICAgIHRpdGxlOiBcIumUmeivr+aPkOekulwiXG4gICAgfTtcbiAgICBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgdGhpcy5BbGVydChvcGVuZXJXaW5kb3csIGRpYWxvZ0lkLCBkZWZhdWx0Q29uZmlnLCBodG1sTXNnLCBzRnVuYywgdGltZUNsb3N1cmUpO1xuICB9LFxuICBBbGVydFRleHQ6IGZ1bmN0aW9uIEFsZXJ0VGV4dCh0ZXh0LCBjYWxsZXIsIHRpbWVDbG9zdXJlKSB7XG4gICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHRleHQsIG51bGwsIGNhbGxlciwgdGltZUNsb3N1cmUpO1xuICB9LFxuICBBbGVydDogZnVuY3Rpb24gQWxlcnQob3BlbmVyV2luZG93LCBkaWFsb2dJZCwgY29uZmlnLCBodG1sTXNnLCBzRnVuYywgY2FsbGVyLCB0aW1lQ2xvc3VyZSkge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlbmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIFwi5YWz6ZetXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvcGVuOiBmdW5jdGlvbiBvcGVuKCkge30sXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgIGlmIChzRnVuYykge1xuICAgICAgICAgIGlmIChjYWxsZXIpIHtcbiAgICAgICAgICAgIHNGdW5jLmNhbGwoY2FsbGVyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc0Z1bmMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBoaWRlOiB7XG4gICAgICAgIGVmZmVjdDogXCJmYWRlXCIsXG4gICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgIH1cbiAgICB9O1xuICAgIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxNc2cpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcblxuICAgIGlmICh0aW1lQ2xvc3VyZSkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKGRpYWxvZ0lkKTtcbiAgICAgIH0sIDEwMDAgKiB0aW1lQ2xvc3VyZSk7XG4gICAgfVxuICB9LFxuICBBbGVydEpzb25Db2RlOiBmdW5jdGlvbiBBbGVydEpzb25Db2RlKGpzb24sIHRpbWVDbG9zdXJlKSB7XG4gICAgaWYgKF90eXBlb2YoanNvbikgPT0gXCJvYmplY3RcIikge1xuICAgICAganNvbiA9IEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZ0Zvcm1hdChqc29uKTtcbiAgICB9XG5cbiAgICBqc29uID0ganNvbi5yZXBsYWNlKC8mL2csICcmJykucmVwbGFjZSgvPC9nLCAnPCcpLnJlcGxhY2UoLz4vZywgJz4nKTtcbiAgICBqc29uID0ganNvbi5yZXBsYWNlKC8oXCIoXFxcXHVbYS16QS1aMC05XXs0fXxcXFxcW151XXxbXlxcXFxcIl0pKlwiKFxccyo6KT98XFxiKHRydWV8ZmFsc2V8bnVsbClcXGJ8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8pL2csIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgdmFyIGNscyA9ICdqc29uLW51bWJlcic7XG5cbiAgICAgIGlmICgvXlwiLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICBpZiAoLzokLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICAgIGNscyA9ICdqc29uLWtleSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2xzID0gJ2pzb24tc3RyaW5nJztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgvdHJ1ZXxmYWxzZS8udGVzdChtYXRjaCkpIHtcbiAgICAgICAgY2xzID0gJ2pzb24tYm9vbGVhbic7XG4gICAgICB9IGVsc2UgaWYgKC9udWxsLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICBjbHMgPSAnanNvbi1udWxsJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIicgKyBjbHMgKyAnXCI+JyArIG1hdGNoICsgJzwvc3Bhbj4nO1xuICAgIH0pO1xuXG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbSh3aW5kb3cuZG9jdW1lbnQuYm9keSwgdGhpcy5EaWFsb2dBbGVydElkKTtcblxuICAgIHZhciB0aXRsZSA9IFwi57O757uf5o+Q56S6XCI7XG5cbiAgICBpZiAodGltZUNsb3N1cmUpIHtcbiAgICAgIHRpdGxlICs9IFwiIFsgXCIgKyB0aW1lQ2xvc3VyZSArIFwi56eS5ZCO6Ieq5Yqo5YWz6ZetIF1cIjtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIGhlaWdodDogNjAwLFxuICAgICAgd2lkdGg6IDkwMCxcbiAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLlhbPpl61cIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCLlpI3liLblubblhbPpl61cIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICBCYXNlVXRpbGl0eS5Db3B5VmFsdWVDbGlwYm9hcmQoJChcIi5qc29uLXByZVwiKS50ZXh0KCkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb3BlbjogZnVuY3Rpb24gb3BlbigpIHt9LFxuICAgICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKCkge30sXG4gICAgICBoaWRlOiB7XG4gICAgICAgIGVmZmVjdDogXCJmYWRlXCIsXG4gICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgIH1cbiAgICB9O1xuICAgICQoaHRtbEVsZW0pLmh0bWwoXCI8ZGl2IGlkPSdwc2NvbnRhaW5lcicgc3R5bGU9J3dpZHRoOiAxMDAlO2hlaWdodDogMTAwJTtvdmVyZmxvdzogYXV0bztwb3NpdGlvbjogcmVsYXRpdmU7Jz48cHJlIGNsYXNzPSdqc29uLXByZSc+XCIgKyBqc29uICsgXCI8L3ByZT48L2Rpdj5cIik7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuXG4gICAgaWYgKHRpbWVDbG9zdXJlKSB7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkKTtcbiAgICAgIH0sIDEwMDAgKiB0aW1lQ2xvc3VyZSk7XG4gICAgfVxuXG4gICAgdmFyIHBzID0gbmV3IFBlcmZlY3RTY3JvbGxiYXIoJyNwc2NvbnRhaW5lcicpO1xuICB9LFxuICBTaG93SFRNTDogZnVuY3Rpb24gU2hvd0hUTUwob3BlbmVyV2luZG93LCBkaWFsb2dJZCwgY29uZmlnLCBodG1sTXNnLCBjbG9zZV9hZnRlcl9ldmVudCwgcGFyYW1zKSB7XG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbShvcGVuZXJXaW5kb3cuZG9jdW1lbnQuYm9keSwgZGlhbG9nSWQpO1xuXG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZShldmVudCwgdWkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNsb3NlX2FmdGVyX2V2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY2xvc2VfYWZ0ZXJfZXZlbnQocGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgICQoaHRtbEVsZW0pLmh0bWwoaHRtbE1zZyk7XG4gICAgcmV0dXJuICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcbiAgfSxcbiAgU2hvd0J5RWxlbUlkOiBmdW5jdGlvbiBTaG93QnlFbGVtSWQoZWxlbUlkLCBjb25maWcsIGNsb3NlX2FmdGVyX2V2ZW50LCBwYXJhbXMsIGNhbGxlcikge1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjbG9zZV9hZnRlcl9ldmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNsb3NlX2FmdGVyX2V2ZW50KHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICByZXR1cm4gJChcIiNcIiArIGVsZW1JZCkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICB9LFxuICBDbG9zZUJ5RWxlbUlkOiBmdW5jdGlvbiBDbG9zZUJ5RWxlbUlkKGVsZW1JZCkge1xuICAgIHJldHVybiAkKFwiI1wiICsgZWxlbUlkKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgfSxcbiAgRGVzdHJveUJ5RWxlbUlkOiBmdW5jdGlvbiBEZXN0cm95QnlFbGVtSWQoZWxlbUlkKSB7XG4gICAgcmV0dXJuICQoXCIjXCIgKyBlbGVtSWQpLmRpYWxvZyhcImRlc3Ryb3lcIik7XG4gIH0sXG4gIEFsZXJ0TG9hZGluZzogZnVuY3Rpb24gQWxlcnRMb2FkaW5nKG9wZW5lcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbE1zZykge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZUFsZXJ0TG9hZGluZ01zZ0VsZW1lbnQob3BlbmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAxNDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWVcbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuZmluZChcIi5hbGVydC1sb2FkaW5nLXR4dFwiKS5odG1sKGh0bWxNc2cpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcbiAgfSxcbiAgQ29uZmlybTogZnVuY3Rpb24gQ29uZmlybShvcGVuZXJXaW5kb3csIGh0bWxNc2csIG9rRm4sIGNhbGxlcikge1xuICAgIHRoaXMuQ29uZmlybUNvbmZpZyhvcGVuZXJXaW5kb3csIGh0bWxNc2csIG51bGwsIG9rRm4sIGNhbGxlcik7XG4gIH0sXG4gIENvbmZpcm1Db25maWc6IGZ1bmN0aW9uIENvbmZpcm1Db25maWcob3BlbmVyV2luZG93LCBodG1sTXNnLCBjb25maWcsIG9rRm4sIGNhbGxlcikge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlbmVyV2luZG93LmRvY3VtZW50LmJvZHksIFwiQWxlcnRDb25maXJtTXNnXCIpO1xuXG4gICAgdmFyIHBhcmFzID0gbnVsbDtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIG9rZnVuYzogZnVuY3Rpb24gb2tmdW5jKHBhcmFzKSB7XG4gICAgICAgIGlmIChva0ZuICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChjYWxsZXIpIHtcbiAgICAgICAgICAgIG9rRm4uY2FsbChjYWxsZXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gb2tGbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVuZXJXaW5kb3cuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNhbmNlbGZ1bmM6IGZ1bmN0aW9uIGNhbmNlbGZ1bmMocGFyYXMpIHt9LFxuICAgICAgdmFsaWRhdGVmdW5jOiBmdW5jdGlvbiB2YWxpZGF0ZWZ1bmMocGFyYXMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgY2xvc2VhZnRlcmZ1bmM6IHRydWUsXG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLnoa7orqRcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdENvbmZpZy52YWxpZGF0ZWZ1bmMocGFyYXMpKSB7XG4gICAgICAgICAgICB2YXIgciA9IGRlZmF1bHRDb25maWcub2tmdW5jKHBhcmFzKTtcbiAgICAgICAgICAgIHIgPSByID09IG51bGwgPyB0cnVlIDogcjtcblxuICAgICAgICAgICAgaWYgKHIgJiYgZGVmYXVsdENvbmZpZy5jbG9zZWFmdGVyZnVuYykge1xuICAgICAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwi5Y+W5raIXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgZGVmYXVsdENvbmZpZy5jYW5jZWxmdW5jKHBhcmFzKTtcblxuICAgICAgICAgIGlmIChkZWZhdWx0Q29uZmlnLmNsb3NlYWZ0ZXJmdW5jKSB7XG4gICAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuaHRtbChodG1sTXNnKTtcbiAgICAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gICAgcGFyYXMgPSB7XG4gICAgICBcIkVsZW1lbnRPYmpcIjogaHRtbEVsZW1cbiAgICB9O1xuICB9LFxuICBQcm9tcHQ6IGZ1bmN0aW9uIFByb21wdChvcGVuZXJXaW5kb3csIGNvbmZpZywgZGlhbG9nSWQsIGxhYmVsTXNnLCBva0Z1bmMpIHtcbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVEaWFsb2dFbGVtKG9wZW5lcldpbmRvdy5kb2N1bWVudC5ib2R5LCBkaWFsb2dJZCk7XG5cbiAgICB2YXIgcGFyYXMgPSBudWxsO1xuICAgIHZhciB0ZXh0QXJlYSA9ICQoXCI8dGV4dGFyZWEgLz5cIik7XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCJcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLnoa7orqRcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIG9rRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHZhciBpbnB1dFRleHQgPSB0ZXh0QXJlYS52YWwoKTtcbiAgICAgICAgICAgIG9rRnVuYyhpbnB1dFRleHQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQoaHRtbEVsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICB9LFxuICAgICAgICBcIuWPlua2iFwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgICQoaHRtbEVsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgICQodGV4dEFyZWEpLmNzcyhcImhlaWdodFwiLCBkZWZhdWx0Q29uZmlnLmhlaWdodCAtIDEzMCkuY3NzKFwid2lkdGhcIiwgXCIxMDAlXCIpO1xuICAgIHZhciBodG1sQ29udGVudCA9ICQoXCI8ZGl2PjxkaXYgc3R5bGU9J3dpZHRoOiAxMDAlJz5cIiArIGxhYmVsTXNnICsgXCLvvJo8L2Rpdj48L2Rpdj5cIikuYXBwZW5kKHRleHRBcmVhKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxDb250ZW50KTtcbiAgICAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gIH0sXG4gIERpYWxvZ0VsZW06IGZ1bmN0aW9uIERpYWxvZ0VsZW0oZWxlbUlkLCBjb25maWcpIHtcbiAgICAkKFwiI1wiICsgZWxlbUlkKS5kaWFsb2coY29uZmlnKTtcbiAgfSxcbiAgRGlhbG9nRWxlbU9iajogZnVuY3Rpb24gRGlhbG9nRWxlbU9iaihlbGVtT2JqLCBjb25maWcpIHtcbiAgICAkKGVsZW1PYmopLmRpYWxvZyhjb25maWcpO1xuICB9LFxuICBPcGVuSWZyYW1lV2luZG93OiBmdW5jdGlvbiBPcGVuSWZyYW1lV2luZG93KG9wZW5lcndpbmRvdywgZGlhbG9nSWQsIHVybCwgb3B0aW9ucywgd2h0eXBlKSB7XG4gICAgdmFyIGRlZmF1bHRvcHRpb25zID0ge1xuICAgICAgaGVpZ2h0OiA0MTAsXG4gICAgICB3aWR0aDogNjAwLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICB0aXRsZTogXCLns7vnu59cIixcbiAgICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZShldmVudCwgdWkpIHtcbiAgICAgICAgdmFyIGF1dG9kaWFsb2dJZCA9ICQodGhpcykuYXR0cihcImlkXCIpO1xuICAgICAgICAkKHRoaXMpLmZpbmQoXCJpZnJhbWVcIikucmVtb3ZlKCk7XG4gICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAkKHRoaXMpLmRpYWxvZyhcImRlc3Ryb3lcIik7XG4gICAgICAgICQoXCIjXCIgKyBhdXRvZGlhbG9nSWQpLnJlbW92ZSgpO1xuXG4gICAgICAgIGlmIChCcm93c2VySW5mb1V0aWxpdHkuSXNJRThEb2N1bWVudE1vZGUoKSkge1xuICAgICAgICAgIENvbGxlY3RHYXJiYWdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2xvc2VfYWZ0ZXJfZXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgb3B0aW9ucy5jbG9zZV9hZnRlcl9ldmVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoJChcIiNGb3Jmb2N1c1wiKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkKFwiI0ZvcmZvY3VzXCIpWzBdLmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAod2h0eXBlID09IDEpIHtcbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgIGhlaWdodDogNjgwLFxuICAgICAgICB3aWR0aDogOTgwXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSAyKSB7XG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgd2lkdGg6IDgwMFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gNCkge1xuICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgaGVpZ2h0OiAzODAsXG4gICAgICAgIHdpZHRoOiA0ODBcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDUpIHtcbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgIGhlaWdodDogMTgwLFxuICAgICAgICB3aWR0aDogMzAwXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy53aWR0aCA9PSAwKSB7XG4gICAgICBvcHRpb25zLndpZHRoID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKSAtIDIwO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmhlaWdodCA9PSAwKSB7XG4gICAgICBvcHRpb25zLmhlaWdodCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIC0gMTA7XG4gICAgfVxuXG4gICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHZhciBhdXRvZGlhbG9nSWQgPSBkaWFsb2dJZDtcblxuICAgIHZhciBkaWFsb2dFbGUgPSB0aGlzLl9DcmVhdGVJZnJhbWVEaWFsb2dFbGVtZW50KG9wZW5lcndpbmRvdy5kb2N1bWVudCwgYXV0b2RpYWxvZ0lkLCB1cmwpO1xuXG4gICAgdmFyIGRpYWxvZ09iaiA9ICQoZGlhbG9nRWxlKS5kaWFsb2coZGVmYXVsdG9wdGlvbnMpO1xuICAgIHZhciAkaWZyYW1lb2JqID0gJChkaWFsb2dFbGUpLmZpbmQoXCJpZnJhbWVcIik7XG4gICAgJGlmcmFtZW9iai5vbihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKFN0cmluZ1V0aWxpdHkuSXNTYW1lRG9tYWluKHdpbmRvdy5sb2NhdGlvbi5ocmVmLCB1cmwpKSB7XG4gICAgICAgIHRoaXMuY29udGVudFdpbmRvdy5GcmFtZVdpbmRvd0lkID0gYXV0b2RpYWxvZ0lkO1xuICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuT3BlbmVyV2luZG93T2JqID0gb3BlbmVyd2luZG93O1xuICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuSXNPcGVuRm9yRnJhbWUgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCLot6jln59JZnJhbWUs5peg5rOV6K6+572u5bGe5oCnIVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAkaWZyYW1lb2JqLmF0dHIoXCJzcmNcIiwgdXJsKTtcbiAgICByZXR1cm4gZGlhbG9nT2JqO1xuICB9LFxuICBDbG9zZU9wZW5JZnJhbWVXaW5kb3c6IGZ1bmN0aW9uIENsb3NlT3BlbklmcmFtZVdpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkKSB7XG4gICAgb3BlbmVyd2luZG93Lk9wZW5lcldpbmRvd09iai5EaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKGRpYWxvZ0lkKTtcbiAgfSxcbiAgQ2xvc2VEaWFsb2dFbGVtOiBmdW5jdGlvbiBDbG9zZURpYWxvZ0VsZW0oZGlhbG9nRWxlbSkge1xuICAgICQoZGlhbG9nRWxlbSkuZmluZChcImlmcmFtZVwiKS5yZW1vdmUoKTtcbiAgICAkKGRpYWxvZ0VsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICgkKFwiI0ZvcmZvY3VzXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJChcIiNGb3Jmb2N1c1wiKVswXS5mb2N1cygpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH0sXG4gIENsb3NlRGlhbG9nOiBmdW5jdGlvbiBDbG9zZURpYWxvZyhkaWFsb2dJZCkge1xuICAgIHRoaXMuQ2xvc2VEaWFsb2dFbGVtKHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpKTtcbiAgfSxcbiAgT3Blbk5ld1dpbmRvdzogZnVuY3Rpb24gT3Blbk5ld1dpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSkge1xuICAgIHZhciB3aWR0aCA9IDA7XG4gICAgdmFyIGhlaWdodCA9IDA7XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgd2lkdGggPSBvcHRpb25zLndpZHRoO1xuICAgICAgaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XG4gICAgfVxuXG4gICAgdmFyIGxlZnQgPSBwYXJzZUludCgoc2NyZWVuLmF2YWlsV2lkdGggLSB3aWR0aCkgLyAyKS50b1N0cmluZygpO1xuICAgIHZhciB0b3AgPSBwYXJzZUludCgoc2NyZWVuLmF2YWlsSGVpZ2h0IC0gaGVpZ2h0KSAvIDIpLnRvU3RyaW5nKCk7XG5cbiAgICBpZiAod2lkdGgudG9TdHJpbmcoKSA9PSBcIjBcIiAmJiBoZWlnaHQudG9TdHJpbmcoKSA9PSBcIjBcIikge1xuICAgICAgd2lkdGggPSB3aW5kb3cuc2NyZWVuLmF2YWlsV2lkdGggLSAzMDtcbiAgICAgIGhlaWdodCA9IHdpbmRvdy5zY3JlZW4uYXZhaWxIZWlnaHQgLSA2MDtcbiAgICAgIGxlZnQgPSBcIjBcIjtcbiAgICAgIHRvcCA9IFwiMFwiO1xuICAgIH1cblxuICAgIHZhciB3aW5IYW5kbGUgPSB3aW5kb3cub3Blbih1cmwsIFwiXCIsIFwic2Nyb2xsYmFycz1ubyx0b29sYmFyPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPXllcyxjZW50ZXI9eWVzLGhlbHA9bm8sIHN0YXR1cz15ZXMsdG9wPSBcIiArIHRvcCArIFwicHgsbGVmdD1cIiArIGxlZnQgKyBcInB4LHdpZHRoPVwiICsgd2lkdGggKyBcInB4LGhlaWdodD1cIiArIGhlaWdodCArIFwicHhcIik7XG5cbiAgICBpZiAod2luSGFuZGxlID09IG51bGwpIHtcbiAgICAgIGFsZXJ0KFwi6K+36Kej6Zmk5rWP6KeI5Zmo5a+55pys57O757uf5by55Ye656qX5Y+j55qE6Zi75q2i6K6+572u77yBXCIpO1xuICAgIH1cbiAgfSxcbiAgT3Blbk5ld1RhYldpbmRvdzogZnVuY3Rpb24gT3Blbk5ld1RhYldpbmRvdyh1cmwpIHtcbiAgICB2YXIgbGluayA9ICQoXCI8YSBocmVmPSdcIiArIHVybCArIFwiJyBzdHlsZT0ncG9zaXRpb246YWJzb2x1dGU7dG9wOiAtMTAwcHg7d2lkdGg6IDBweDtoZWlnaHQ6IDBweCcgdGFyZ2V0PSdfYmxhbmsnPjwvYT5cIik7XG4gICAgJCh3aW5kb3cuZG9jdW1lbnQuYm9keSkuYXBwZW5kKGxpbmspO1xuICAgIGxpbmtbMF0uY2xpY2soKTtcbiAgfSxcbiAgX1RyeUdldFBhcmVudFdpbmRvdzogZnVuY3Rpb24gX1RyeUdldFBhcmVudFdpbmRvdyh3aW4pIHtcbiAgICBpZiAod2luLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gd2luLnBhcmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgX0ZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqOiBmdW5jdGlvbiBfRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmood2luLCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKSB7XG4gICAgaWYgKHRyeWZpbmR0aW1lID4gY3VycmVudHRyeWZpbmR0aW1lKSB7XG4gICAgICB2YXIgaXN0b3BGcmFtZXBhZ2UgPSBmYWxzZTtcbiAgICAgIGN1cnJlbnR0cnlmaW5kdGltZSsrO1xuXG4gICAgICB0cnkge1xuICAgICAgICBpc3RvcEZyYW1lcGFnZSA9IHdpbi5Jc1RvcEZyYW1lUGFnZTtcblxuICAgICAgICBpZiAoaXN0b3BGcmFtZXBhZ2UpIHtcbiAgICAgICAgICByZXR1cm4gd2luO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaih0aGlzLl9UcnlHZXRQYXJlbnRXaW5kb3cod2luKSwgdHJ5ZmluZHRpbWUsIGN1cnJlbnR0cnlmaW5kdGltZSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0ZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqKHRoaXMuX1RyeUdldFBhcmVudFdpbmRvdyh3aW4pLCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgX09wZW5XaW5kb3dJbkZyYW1lUGFnZTogZnVuY3Rpb24gX09wZW5XaW5kb3dJbkZyYW1lUGFnZShvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSkge1xuICAgIGlmIChTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkoZGlhbG9nSWQpKSB7XG4gICAgICBhbGVydChcImRpYWxvZ0lk5LiN6IO95Li656m6XCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHVybCA9IEJhc2VVdGlsaXR5LkFwcGVuZFRpbWVTdGFtcFVybCh1cmwpO1xuICAgIHZhciBhdXRvZGlhbG9nSWQgPSBcIkZyYW1lRGlhbG9nRWxlXCIgKyBkaWFsb2dJZDtcblxuICAgIGlmICgkKHRoaXMuRnJhbWVQYWdlUmVmLmRvY3VtZW50KS5maW5kKFwiI1wiICsgYXV0b2RpYWxvZ0lkKS5sZW5ndGggPT0gMCkge1xuICAgICAgdmFyIGRpYWxvZ0VsZSA9IHRoaXMuX0NyZWF0ZUlmcmFtZURpYWxvZ0VsZW1lbnQodGhpcy5GcmFtZVBhZ2VSZWYuZG9jdW1lbnQsIGF1dG9kaWFsb2dJZCwgdXJsKTtcblxuICAgICAgdmFyIGRlZmF1bHRvcHRpb25zID0ge1xuICAgICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgICAgd2lkdGg6IDYwMCxcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHRpdGxlOiBcIuezu+e7n1wiLFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgdmFyIGF1dG9kaWFsb2dJZCA9ICQodGhpcykuYXR0cihcImlkXCIpO1xuICAgICAgICAgICQodGhpcykuZmluZChcImlmcmFtZVwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAkKHRoaXMpLmRpYWxvZyhcImRlc3Ryb3lcIik7XG4gICAgICAgICAgJChcIiNcIiArIGF1dG9kaWFsb2dJZCkucmVtb3ZlKCk7XG5cbiAgICAgICAgICBpZiAoQnJvd3NlckluZm9VdGlsaXR5LklzSUU4RG9jdW1lbnRNb2RlKCkpIHtcbiAgICAgICAgICAgIENvbGxlY3RHYXJiYWdlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNsb3NlX2FmdGVyX2V2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgb3B0aW9ucy5jbG9zZV9hZnRlcl9ldmVudCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKHdodHlwZSA9PSAwKSB7XG4gICAgICAgIG9wdGlvbnMud2lkdGggPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VXaWR0aCgpIC0gMjA7XG4gICAgICAgIG9wdGlvbnMuaGVpZ2h0ID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgLSAxODA7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSAxKSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiA2MTAsXG4gICAgICAgICAgd2lkdGg6IDk4MFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDIpIHtcbiAgICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgICB3aWR0aDogODAwXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gNCkge1xuICAgICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICAgIGhlaWdodDogMzgwLFxuICAgICAgICAgIHdpZHRoOiA0ODBcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSA1KSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiAxODAsXG4gICAgICAgICAgd2lkdGg6IDMwMFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMud2lkdGggPT0gMCkge1xuICAgICAgICBvcHRpb25zLndpZHRoID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKSAtIDIwO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5oZWlnaHQgPT0gMCkge1xuICAgICAgICBvcHRpb25zLmhlaWdodCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIC0gMTgwO1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAkKGRpYWxvZ0VsZSkuZGlhbG9nKGRlZmF1bHRvcHRpb25zKTtcbiAgICAgICQoXCIudWktd2lkZ2V0LW92ZXJsYXlcIikuY3NzKFwiekluZGV4XCIsIFwiMjAwMFwiKTtcbiAgICAgICQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCBcIjIwMDFcIik7XG4gICAgICB2YXIgJGlmcmFtZW9iaiA9ICQoZGlhbG9nRWxlKS5maW5kKFwiaWZyYW1lXCIpO1xuICAgICAgJGlmcmFtZW9iai5vbihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoU3RyaW5nVXRpbGl0eS5Jc1NhbWVEb21haW4od2luZG93LmxvY2F0aW9uLmhyZWYsIHVybCkpIHtcbiAgICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuRnJhbWVXaW5kb3dJZCA9IGF1dG9kaWFsb2dJZDtcbiAgICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuT3BlbmVyV2luZG93T2JqID0gb3BlbmVyd2luZG93O1xuICAgICAgICAgIHRoaXMuY29udGVudFdpbmRvdy5Jc09wZW5Gb3JGcmFtZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCLot6jln59JZnJhbWUs5peg5rOV6K6+572u5bGe5oCnIVwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAkaWZyYW1lb2JqLmF0dHIoXCJzcmNcIiwgdXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJChcIiNcIiArIGF1dG9kaWFsb2dJZCkuZGlhbG9nKFwibW92ZVRvVG9wXCIpO1xuICAgIH1cbiAgfSxcbiAgX0ZyYW1lX0ZyYW1lUGFnZUNsb3NlRGlhbG9nOiBmdW5jdGlvbiBfRnJhbWVfRnJhbWVQYWdlQ2xvc2VEaWFsb2coZGlhbG9nSWQpIHtcbiAgICAkKFwiI1wiICsgZGlhbG9nSWQpLmRpYWxvZyhcImNsb3NlXCIpO1xuICB9LFxuICBGcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iajogZnVuY3Rpb24gRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmooKSB7XG4gICAgdmFyIHRyeWZpbmR0aW1lID0gNTtcbiAgICB2YXIgY3VycmVudHRyeWZpbmR0aW1lID0gMTtcbiAgICByZXR1cm4gdGhpcy5fRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmood2luZG93LCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKTtcbiAgfSxcbiAgRnJhbWVfQWxlcnQ6IGZ1bmN0aW9uIEZyYW1lX0FsZXJ0KCkge30sXG4gIEZyYW1lX0NvbmZpcm06IGZ1bmN0aW9uIEZyYW1lX0NvbmZpcm0oKSB7fSxcbiAgRnJhbWVfT3BlbklmcmFtZVdpbmRvdzogZnVuY3Rpb24gRnJhbWVfT3BlbklmcmFtZVdpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSwgbm90RnJhbWVPcGVuSW5DdXJyKSB7XG4gICAgaWYgKHVybCA9PSBcIlwiKSB7XG4gICAgICBhbGVydChcInVybOS4jeiDveS4uuepuuWtl+espuS4siFcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFub3RGcmFtZU9wZW5JbkN1cnIpIHtcbiAgICAgIG5vdEZyYW1lT3BlbkluQ3VyciA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciB3cndpbiA9IHRoaXMuRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmooKTtcbiAgICB0aGlzLkZyYW1lUGFnZVJlZiA9IHdyd2luO1xuXG4gICAgaWYgKHdyd2luICE9IG51bGwpIHtcbiAgICAgIHRoaXMuRnJhbWVQYWdlUmVmLkRpYWxvZ1V0aWxpdHkuRnJhbWVQYWdlUmVmID0gd3J3aW47XG5cbiAgICAgIHRoaXMuRnJhbWVQYWdlUmVmLkRpYWxvZ1V0aWxpdHkuX09wZW5XaW5kb3dJbkZyYW1lUGFnZShvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChub3RGcmFtZU9wZW5JbkN1cnIpIHtcbiAgICAgICAgdGhpcy5PcGVuSWZyYW1lV2luZG93KG9wZW5lcndpbmRvdywgZGlhbG9nSWQsIHVybCwgb3B0aW9ucywgd2h0eXBlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwi5om+5LiN5YiwRnJhbWVQYWdlISFcIik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBGcmFtZV9DbG9zZURpYWxvZzogZnVuY3Rpb24gRnJhbWVfQ2xvc2VEaWFsb2cob3BlbmVyV2luZG93KSB7XG4gICAgdmFyIHdyd2luID0gdGhpcy5GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaigpO1xuICAgIHZhciBvcGVuZXJ3aW4gPSBvcGVuZXJXaW5kb3cuT3BlbmVyV2luZG93T2JqO1xuICAgIHZhciBhdXRvZGlhbG9nSWQgPSBvcGVuZXJXaW5kb3cuRnJhbWVXaW5kb3dJZDtcblxuICAgIHdyd2luLkRpYWxvZ1V0aWxpdHkuX0ZyYW1lX0ZyYW1lUGFnZUNsb3NlRGlhbG9nKGF1dG9kaWFsb2dJZCk7XG4gIH0sXG4gIFRvYXN0TWVzc2FnZTogZnVuY3Rpb24gVG9hc3RNZXNzYWdlKHNlbmRlciwgbWVzc2FnZSkge1xuICAgIHNlbmRlci4kTWVzc2FnZS5pbmZvKG1lc3NhZ2UpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGljdGlvbmFyeVV0aWxpdHkgPSB7XG4gIF9Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb246IG51bGwsXG4gIEdyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbjogZnVuY3Rpb24gR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uKHNvdXJjZURpY3Rpb25hcnlKc29uKSB7XG4gICAgaWYgKHRoaXMuX0dyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbiA9PSBudWxsKSB7XG4gICAgICBpZiAoc291cmNlRGljdGlvbmFyeUpzb24gIT0gbnVsbCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICAgICAgZm9yICh2YXIgZ3JvdXBWYWx1ZSBpbiBzb3VyY2VEaWN0aW9uYXJ5SnNvbikge1xuICAgICAgICAgIHJlc3VsdFtncm91cFZhbHVlXSA9IHt9O1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0W2dyb3VwVmFsdWVdW3NvdXJjZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdW2ldLmRpY3RWYWx1ZV0gPSBzb3VyY2VEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXVtpXS5kaWN0VGV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb24gPSByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX0dyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEhhcmREaXNrVXRpbGl0eSA9IHtcbiAgQnl0ZUNvbnZlcnQ6IGZ1bmN0aW9uIEJ5dGVDb252ZXJ0KGJ5dGVzKSB7XG4gICAgaWYgKGlzTmFOKGJ5dGVzKSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHZhciBzeW1ib2xzID0gWydieXRlcycsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddO1xuICAgIHZhciBleHAgPSBNYXRoLmZsb29yKE1hdGgubG9nKGJ5dGVzKSAvIE1hdGgubG9nKDIpKTtcblxuICAgIGlmIChleHAgPCAxKSB7XG4gICAgICBleHAgPSAwO1xuICAgIH1cblxuICAgIHZhciBpID0gTWF0aC5mbG9vcihleHAgLyAxMCk7XG4gICAgYnl0ZXMgPSBieXRlcyAvIE1hdGgucG93KDIsIDEwICogaSk7XG5cbiAgICBpZiAoYnl0ZXMudG9TdHJpbmcoKS5sZW5ndGggPiBieXRlcy50b0ZpeGVkKDIpLnRvU3RyaW5nKCkubGVuZ3RoKSB7XG4gICAgICBieXRlcyA9IGJ5dGVzLnRvRml4ZWQoMik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ5dGVzICsgJyAnICsgc3ltYm9sc1tpXTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNvbnNvbGUgPSBjb25zb2xlIHx8IHtcbiAgbG9nOiBmdW5jdGlvbiBsb2coKSB7fSxcbiAgd2FybjogZnVuY3Rpb24gd2FybigpIHt9LFxuICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7fVxufTtcblxuZnVuY3Rpb24gRGF0ZUV4dGVuZF9EYXRlRm9ybWF0KGRhdGUsIGZtdCkge1xuICBpZiAobnVsbCA9PSBkYXRlIHx8IHVuZGVmaW5lZCA9PSBkYXRlKSByZXR1cm4gJyc7XG4gIHZhciBvID0ge1xuICAgIFwiTStcIjogZGF0ZS5nZXRNb250aCgpICsgMSxcbiAgICBcImQrXCI6IGRhdGUuZ2V0RGF0ZSgpLFxuICAgIFwiaCtcIjogZGF0ZS5nZXRIb3VycygpLFxuICAgIFwibStcIjogZGF0ZS5nZXRNaW51dGVzKCksXG4gICAgXCJzK1wiOiBkYXRlLmdldFNlY29uZHMoKSxcbiAgICBcIlNcIjogZGF0ZS5nZXRNaWxsaXNlY29uZHMoKVxuICB9O1xuICBpZiAoLyh5KykvLnRlc3QoZm10KSkgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCAoZGF0ZS5nZXRGdWxsWWVhcigpICsgXCJcIikuc3Vic3RyKDQgLSBSZWdFeHAuJDEubGVuZ3RoKSk7XG5cbiAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoXCIoXCIgKyBrICsgXCIpXCIpLnRlc3QoZm10KSkgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCBSZWdFeHAuJDEubGVuZ3RoID09IDEgPyBvW2tdIDogKFwiMDBcIiArIG9ba10pLnN1YnN0cigoXCJcIiArIG9ba10pLmxlbmd0aCkpO1xuICB9XG5cbiAgcmV0dXJuIGZtdDtcbn1cblxuRGF0ZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gRGF0ZUV4dGVuZF9EYXRlRm9ybWF0KHRoaXMsICd5eXl5LU1NLWRkIG1tOmhoOnNzJyk7XG59O1xuXG5pZiAoIU9iamVjdC5jcmVhdGUpIHtcbiAgT2JqZWN0LmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBhbGVydChcIkV4dGVuZCBPYmplY3QuY3JlYXRlXCIpO1xuXG4gICAgZnVuY3Rpb24gRigpIHt9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG8pIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignT2JqZWN0LmNyZWF0ZSBpbXBsZW1lbnRhdGlvbiBvbmx5IGFjY2VwdHMgb25lIHBhcmFtZXRlci4nKTtcbiAgICAgIH1cblxuICAgICAgRi5wcm90b3R5cGUgPSBvO1xuICAgICAgcmV0dXJuIG5ldyBGKCk7XG4gICAgfTtcbiAgfSgpO1xufVxuXG4kLmZuLm91dGVySFRNTCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICF0aGlzLmxlbmd0aCA/IHRoaXMgOiB0aGlzWzBdLm91dGVySFRNTCB8fCBmdW5jdGlvbiAoZWwpIHtcbiAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGVsLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgdmFyIGNvbnRlbnRzID0gZGl2LmlubmVySFRNTDtcbiAgICBkaXYgPSBudWxsO1xuICAgIGFsZXJ0KGNvbnRlbnRzKTtcbiAgICByZXR1cm4gY29udGVudHM7XG4gIH0odGhpc1swXSk7XG59O1xuXG5mdW5jdGlvbiByZWZDc3NMaW5rKGhyZWYpIHtcbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gIHN0eWxlLnJlbCA9ICdzdHlsZXNoZWV0JztcbiAgc3R5bGUuaHJlZiA9IGhyZWY7XG4gIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICByZXR1cm4gc3R5bGUuc2hlZXQgfHwgc3R5bGUuc3R5bGVTaGVldDtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEpCdWlsZDREQ1lhbWwgPSB7XG4gIF9jbGllbnRDbGllbnRTeXN0ZW1UaXRsZTogbnVsbCxcbiAgX2NsaWVudENsaWVudFN5c3RlbUNhcHRpb246IG51bGwsXG4gIEdldENsaWVudFN5c3RlbVRpdGxlOiBmdW5jdGlvbiBHZXRDbGllbnRTeXN0ZW1UaXRsZSgpIHtcbiAgICB2YXIgc3RvcmVLZXkgPSBcIkpCdWlsZDREQ1lhbWwuX2NsaWVudENsaWVudFN5c3RlbVRpdGxlXCI7XG5cbiAgICBpZiAoTG9jYWxTdG9yYWdlVXRpbGl0eS5nZXRJdGVtSW5TZXNzaW9uU3RvcmFnZShzdG9yZUtleSkpIHtcbiAgICAgIHJldHVybiBMb2NhbFN0b3JhZ2VVdGlsaXR5LmdldEl0ZW1JblNlc3Npb25TdG9yYWdlKHN0b3JlS2V5KTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2NsaWVudENsaWVudFN5c3RlbVRpdGxlKSB7XG4gICAgICBpZiAoIXdpbmRvdy5wYXJlbnQuSkJ1aWxkNERDWWFtbC5fY2xpZW50Q2xpZW50U3lzdGVtVGl0bGUpIHtcbiAgICAgICAgQWpheFV0aWxpdHkuR2V0U3luYyhcIi9SZXN0L0pCdWlsZDREQ1lhbWwvR2V0Q2xpZW50U3lzdGVtVGl0bGVcIiwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuX2NsaWVudENsaWVudFN5c3RlbVRpdGxlID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgICBMb2NhbFN0b3JhZ2VVdGlsaXR5LnNldEl0ZW1JblNlc3Npb25TdG9yYWdlKHN0b3JlS2V5LCB0aGlzLl9jbGllbnRDbGllbnRTeXN0ZW1UaXRsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NsaWVudENsaWVudFN5c3RlbVRpdGxlID0gd2luZG93LnBhcmVudC5KQnVpbGQ0RENZYW1sLl9jbGllbnRDbGllbnRTeXN0ZW1UaXRsZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fY2xpZW50Q2xpZW50U3lzdGVtVGl0bGU7XG4gIH0sXG4gIEdldENsaWVudFN5c3RlbUNhcHRpb246IGZ1bmN0aW9uIEdldENsaWVudFN5c3RlbUNhcHRpb24oKSB7XG4gICAgQWpheFV0aWxpdHkuR2V0U3luYyhcIi9SZXN0L0pCdWlsZDREQ1lhbWwvR2V0Q2xpZW50U3lzdGVtQ2FwdGlvblwiLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIHRoaXMuX2NsaWVudENsaWVudFN5c3RlbUNhcHRpb24gPSByZXN1bHQuZGF0YTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5fY2xpZW50Q2xpZW50U3lzdGVtQ2FwdGlvbjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEpzb25VdGlsaXR5ID0ge1xuICBQYXJzZUFycmF5SnNvblRvVHJlZUpzb246IGZ1bmN0aW9uIFBhcnNlQXJyYXlKc29uVG9UcmVlSnNvbihjb25maWcsIHNvdXJjZUFycmF5LCByb290SWQpIHtcbiAgICB2YXIgX2NvbmZpZyA9IHtcbiAgICAgIEtleUZpZWxkOiBcIlwiLFxuICAgICAgUmVsYXRpb25GaWVsZDogXCJcIixcbiAgICAgIENoaWxkRmllbGROYW1lOiBcIlwiXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIEZpbmRKc29uQnlJZChrZXlGaWVsZCwgaWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNvdXJjZUFycmF5W2ldW2tleUZpZWxkXSA9PSBpZCkge1xuICAgICAgICAgIHJldHVybiBzb3VyY2VBcnJheVtpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhbGVydChcIlBhcnNlQXJyYXlKc29uVG9UcmVlSnNvbi5GaW5kSnNvbkJ5SWQ65Zyoc291cmNlQXJyYXnkuK3mib7kuI3liLDmjIflrppJZOeahOiusOW9lVwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBGaW5kQ2hpbGRKc29uKHJlbGF0aW9uRmllbGQsIHBpZCkge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzb3VyY2VBcnJheVtpXVtyZWxhdGlvbkZpZWxkXSA9PSBwaWQpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChzb3VyY2VBcnJheVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBGaW5kQ2hpbGROb2RlQW5kUGFyc2UocGlkLCByZXN1bHQpIHtcbiAgICAgIHZhciBjaGlsZGpzb25zID0gRmluZENoaWxkSnNvbihjb25maWcuUmVsYXRpb25GaWVsZCwgcGlkKTtcblxuICAgICAgaWYgKGNoaWxkanNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAocmVzdWx0W2NvbmZpZy5DaGlsZEZpZWxkTmFtZV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVzdWx0W2NvbmZpZy5DaGlsZEZpZWxkTmFtZV0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRqc29ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciB0b09iaiA9IHt9O1xuICAgICAgICAgIHRvT2JqID0gSnNvblV0aWxpdHkuU2ltcGxlQ2xvbmVBdHRyKHRvT2JqLCBjaGlsZGpzb25zW2ldKTtcbiAgICAgICAgICByZXN1bHRbY29uZmlnLkNoaWxkRmllbGROYW1lXS5wdXNoKHRvT2JqKTtcbiAgICAgICAgICB2YXIgaWQgPSB0b09ialtjb25maWcuS2V5RmllbGRdO1xuICAgICAgICAgIEZpbmRDaGlsZE5vZGVBbmRQYXJzZShpZCwgdG9PYmopO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciByb290SnNvbiA9IEZpbmRKc29uQnlJZChjb25maWcuS2V5RmllbGQsIHJvb3RJZCk7XG4gICAgcmVzdWx0ID0gdGhpcy5TaW1wbGVDbG9uZUF0dHIocmVzdWx0LCByb290SnNvbik7XG4gICAgRmluZENoaWxkTm9kZUFuZFBhcnNlKHJvb3RJZCwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBSZXNvbHZlU2ltcGxlQXJyYXlKc29uVG9UcmVlSnNvbjogZnVuY3Rpb24gUmVzb2x2ZVNpbXBsZUFycmF5SnNvblRvVHJlZUpzb24oY29uZmlnLCBzb3VyY2VKc29uLCByb290Tm9kZUlkKSB7XG4gICAgYWxlcnQoXCJKc29uVXRpbGl0eS5SZXNvbHZlU2ltcGxlQXJyYXlKc29uVG9UcmVlSnNvbiDlt7LlgZznlKhcIik7XG4gIH0sXG4gIFNpbXBsZUNsb25lQXR0cjogZnVuY3Rpb24gU2ltcGxlQ2xvbmVBdHRyKHRvT2JqLCBmcm9tT2JqKSB7XG4gICAgZm9yICh2YXIgYXR0ciBpbiBmcm9tT2JqKSB7XG4gICAgICB0b09ialthdHRyXSA9IGZyb21PYmpbYXR0cl07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvT2JqO1xuICB9LFxuICBDbG9uZUFycmF5U2ltcGxlOiBmdW5jdGlvbiBDbG9uZUFycmF5U2ltcGxlKGFycmF5KSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0LnB1c2godGhpcy5DbG9uZVNpbXBsZShhcnJheVtpXSkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIENsb25lU2ltcGxlOiBmdW5jdGlvbiBDbG9uZVNpbXBsZShzb3VyY2UpIHtcbiAgICB2YXIgbmV3SnNvbiA9IGpRdWVyeS5leHRlbmQodHJ1ZSwge30sIHNvdXJjZSk7XG4gICAgcmV0dXJuIG5ld0pzb247XG4gIH0sXG4gIENsb25lU3RyaW5naWZ5OiBmdW5jdGlvbiBDbG9uZVN0cmluZ2lmeShzb3VyY2UpIHtcbiAgICB2YXIgbmV3SnNvbiA9IHRoaXMuSnNvblRvU3RyaW5nKHNvdXJjZSk7XG4gICAgcmV0dXJuIHRoaXMuU3RyaW5nVG9Kc29uKG5ld0pzb24pO1xuICB9LFxuICBDbG9uZU9iamVjdFByb3A6IGZ1bmN0aW9uIENsb25lT2JqZWN0UHJvcChzb3VyY2UsIHByb3BDYWxsQmFjaykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIgY2xvbmVTb3VyY2UgPSB0aGlzLkNsb25lU3RyaW5naWZ5KHNvdXJjZSk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gY2xvbmVTb3VyY2UpIHtcbiAgICAgIHZhciBzb3VyY2VQcm9wVmFsdWUgPSBjbG9uZVNvdXJjZVtrZXldO1xuICAgICAgdmFyIG5ld1Byb3BWYWx1ZTtcblxuICAgICAgaWYgKHR5cGVvZiBwcm9wQ2FsbEJhY2sgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIG5ld1Byb3BWYWx1ZSA9IHByb3BDYWxsQmFjayhrZXksIHNvdXJjZVByb3BWYWx1ZSk7XG5cbiAgICAgICAgaWYgKCFuZXdQcm9wVmFsdWUpIHtcbiAgICAgICAgICBuZXdQcm9wVmFsdWUgPSBzb3VyY2VQcm9wVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVzdWx0W2tleV0gPSBuZXdQcm9wVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgSnNvblRvU3RyaW5nOiBmdW5jdGlvbiBKc29uVG9TdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH0sXG4gIEpzb25Ub1N0cmluZ0Zvcm1hdDogZnVuY3Rpb24gSnNvblRvU3RyaW5nRm9ybWF0KG9iaikge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDIpO1xuICB9LFxuICBTdHJpbmdUb0pzb246IGZ1bmN0aW9uIFN0cmluZ1RvSnNvbihzdHIpIHtcbiAgICByZXR1cm4gZXZhbChcIihcIiArIHN0ciArIFwiKVwiKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIExpc3RQYWdlVXRpbGl0eSA9IHtcbiAgRGVmYXVsdExpc3RIZWlnaHQ6IGZ1bmN0aW9uIERlZmF1bHRMaXN0SGVpZ2h0KCkge1xuICAgIGlmIChQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSA+IDc4MCkge1xuICAgICAgcmV0dXJuIDY3ODtcbiAgICB9IGVsc2UgaWYgKFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpID4gNjgwKSB7XG4gICAgICByZXR1cm4gNTc4O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMzc4O1xuICAgIH1cbiAgfSxcbiAgRGVmYXVsdExpc3RIZWlnaHRfNTA6IGZ1bmN0aW9uIERlZmF1bHRMaXN0SGVpZ2h0XzUwKCkge1xuICAgIHJldHVybiB0aGlzLkRlZmF1bHRMaXN0SGVpZ2h0KCkgLSA1MDtcbiAgfSxcbiAgRGVmYXVsdExpc3RIZWlnaHRfODA6IGZ1bmN0aW9uIERlZmF1bHRMaXN0SGVpZ2h0XzgwKCkge1xuICAgIHJldHVybiB0aGlzLkRlZmF1bHRMaXN0SGVpZ2h0KCkgLSA4MDtcbiAgfSxcbiAgRGVmYXVsdExpc3RIZWlnaHRfMTAwOiBmdW5jdGlvbiBEZWZhdWx0TGlzdEhlaWdodF8xMDAoKSB7XG4gICAgcmV0dXJuIHRoaXMuRGVmYXVsdExpc3RIZWlnaHQoKSAtIDEwMDtcbiAgfSxcbiAgR2V0R2VuZXJhbFBhZ2VIZWlnaHQ6IGZ1bmN0aW9uIEdldEdlbmVyYWxQYWdlSGVpZ2h0KGZpeEhlaWdodCkge1xuICAgIHZhciBwYWdlSGVpZ2h0ID0galF1ZXJ5KGRvY3VtZW50KS5oZWlnaHQoKTtcblxuICAgIGlmICgkKFwiI2xpc3Qtc2ltcGxlLXNlYXJjaC13cmFwXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgIHBhZ2VIZWlnaHQgPSBwYWdlSGVpZ2h0IC0gJChcIiNsaXN0LXNpbXBsZS1zZWFyY2gtd3JhcFwiKS5vdXRlckhlaWdodCgpICsgZml4SGVpZ2h0IC0gJChcIiNsaXN0LWJ1dHRvbi13cmFwXCIpLm91dGVySGVpZ2h0KCkgLSAkKFwiI2xpc3QtcGFnZXItd3JhcFwiKS5vdXRlckhlaWdodCgpIC0gMzA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhZ2VIZWlnaHQgPSBwYWdlSGVpZ2h0IC0gJChcIiNsaXN0LWJ1dHRvbi13cmFwXCIpLm91dGVySGVpZ2h0KCkgKyBmaXhIZWlnaHQgLSAoJChcIiNsaXN0LXBhZ2VyLXdyYXBcIikubGVuZ3RoID4gMCA/ICQoXCIjbGlzdC1wYWdlci13cmFwXCIpLm91dGVySGVpZ2h0KCkgOiAwKSAtIDMwO1xuICAgIH1cblxuICAgIHJldHVybiBwYWdlSGVpZ2h0O1xuICB9LFxuICBHZXRGaXhIZWlnaHQ6IGZ1bmN0aW9uIEdldEZpeEhlaWdodCgpIHtcbiAgICByZXR1cm4gLTcwO1xuICB9LFxuICBJVmlld1RhYmxlUmVuZGVyZXI6IHtcbiAgICBUb0RhdGVZWVlZX01NX0REOiBmdW5jdGlvbiBUb0RhdGVZWVlZX01NX0REKGgsIGRhdGV0aW1lKSB7XG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGRhdGV0aW1lKTtcbiAgICAgIHZhciBkYXRlU3RyID0gRGF0ZVV0aWxpdHkuRm9ybWF0KGRhdGUsICd5eXl5LU1NLWRkJyk7XG4gICAgICByZXR1cm4gaCgnZGl2JywgZGF0ZVN0cik7XG4gICAgfSxcbiAgICBTdHJpbmdUb0RhdGVZWVlZX01NX0REOiBmdW5jdGlvbiBTdHJpbmdUb0RhdGVZWVlZX01NX0REKGgsIGRhdGV0aW1lKSB7XG4gICAgICB2YXIgZGF0ZVN0ciA9IGRhdGV0aW1lLnNwbGl0KFwiIFwiKVswXTtcbiAgICAgIHJldHVybiBoKCdkaXYnLCBkYXRlU3RyKTtcbiAgICB9LFxuICAgIFRvU3RhdHVzRW5hYmxlOiBmdW5jdGlvbiBUb1N0YXR1c0VuYWJsZShoLCBzdGF0dXMpIHtcbiAgICAgIGlmIChzdGF0dXMgPT0gMCkge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLnpoHnlKhcIik7XG4gICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PSAxKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuWQr+eUqFwiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFRvWWVzTm9FbmFibGU6IGZ1bmN0aW9uIFRvWWVzTm9FbmFibGUoaCwgc3RhdHVzKSB7XG4gICAgICBpZiAoc3RhdHVzID09IDApIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5ZCmXCIpO1xuICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT0gMSkge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLmmK9cIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBUb0RpY3Rpb25hcnlUZXh0OiBmdW5jdGlvbiBUb0RpY3Rpb25hcnlUZXh0KGgsIGRpY3Rpb25hcnlKc29uLCBncm91cFZhbHVlLCBkaWN0aW9uYXJ5VmFsdWUpIHtcbiAgICAgIHZhciBzaW1wbGVEaWN0aW9uYXJ5SnNvbiA9IERpY3Rpb25hcnlVdGlsaXR5Lkdyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbihkaWN0aW9uYXJ5SnNvbik7XG5cbiAgICAgIGlmIChkaWN0aW9uYXJ5VmFsdWUgPT0gbnVsbCB8fCBkaWN0aW9uYXJ5VmFsdWUgPT0gXCJcIikge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCJcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzaW1wbGVEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHNpbXBsZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdKSB7XG4gICAgICAgICAgaWYgKHNpbXBsZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdW2RpY3Rpb25hcnlWYWx1ZV0pIHtcbiAgICAgICAgICAgIHJldHVybiBoKCdkaXYnLCBzaW1wbGVEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXVtkaWN0aW9uYXJ5VmFsdWVdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5om+5LiN5Yiw6KOF5o2i55qEVEVYVFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5om+5LiN5Yiw6KOF5o2i55qE5YiG57uEXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLmib7kuI3liLDoo4XmjaLnmoTliIbnu4RcIik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBJVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZDogZnVuY3Rpb24gSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWQoc2VsZWN0aW9uUm93cykge1xuICAgIGlmIChzZWxlY3Rpb25Sb3dzICE9IG51bGwgJiYgc2VsZWN0aW9uUm93cy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKGZ1bmMpIHtcbiAgICAgICAgICBmdW5jKHNlbGVjdGlvblJvd3MpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInkuK3pnIDopoHmk43kvZznmoTooYwhXCIsIG51bGwpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGhlbjogZnVuY3Rpb24gdGhlbihmdW5jKSB7fVxuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIElWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkT25lOiBmdW5jdGlvbiBJVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZE9uZShzZWxlY3Rpb25Sb3dzLCBjYWxsZXIpIHtcbiAgICBpZiAoc2VsZWN0aW9uUm93cyAhPSBudWxsICYmIHNlbGVjdGlvblJvd3MubGVuZ3RoID4gMCAmJiBzZWxlY3Rpb25Sb3dzLmxlbmd0aCA9PSAxKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKGZ1bmMpIHtcbiAgICAgICAgICBpZiAoY2FsbGVyKSB7XG4gICAgICAgICAgICBmdW5jLmNhbGwoY2FsbGVyLCBzZWxlY3Rpb25Sb3dzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZnVuYyhzZWxlY3Rpb25Sb3dzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieS4remcgOimgeaTjeS9nOeahOihjO+8jOavj+asoeWPquiDvemAieS4reS4gOihjCFcIiwgbnVsbCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKGZ1bmMpIHt9XG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXM6IGZ1bmN0aW9uIElWaWV3Q2hhbmdlU2VydmVyU3RhdHVzKHVybCwgc2VsZWN0aW9uUm93cywgaWRGaWVsZCwgc3RhdHVzTmFtZSwgcGFnZUFwcE9iaikge1xuICAgIHZhciBpZEFycmF5ID0gbmV3IEFycmF5KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGlvblJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlkQXJyYXkucHVzaChzZWxlY3Rpb25Sb3dzW2ldW2lkRmllbGRdKTtcbiAgICB9XG5cbiAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgaWRzOiBpZEFycmF5LmpvaW4oXCI7XCIpLFxuICAgICAgc3RhdHVzOiBzdGF0dXNOYW1lXG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgICBwYWdlQXBwT2JqLnJlbG9hZERhdGEoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICB9XG4gICAgfSwgcGFnZUFwcE9iaik7XG4gIH0sXG4gIElWaWV3TW92ZUZhY2U6IGZ1bmN0aW9uIElWaWV3TW92ZUZhY2UodXJsLCBzZWxlY3Rpb25Sb3dzLCBpZEZpZWxkLCB0eXBlLCBwYWdlQXBwT2JqKSB7XG4gICAgdGhpcy5JVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZE9uZShzZWxlY3Rpb25Sb3dzKS50aGVuKGZ1bmN0aW9uIChzZWxlY3Rpb25Sb3dzKSB7XG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgICByZWNvcmRJZDogc2VsZWN0aW9uUm93c1swXVtpZEZpZWxkXSxcbiAgICAgICAgdHlwZTogdHlwZVxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBwYWdlQXBwT2JqLnJlbG9hZERhdGEoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBwYWdlQXBwT2JqKTtcbiAgICB9KTtcbiAgfSxcbiAgSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXNGYWNlOiBmdW5jdGlvbiBJVmlld0NoYW5nZVNlcnZlclN0YXR1c0ZhY2UodXJsLCBzZWxlY3Rpb25Sb3dzLCBpZEZpZWxkLCBzdGF0dXNOYW1lLCBwYWdlQXBwT2JqKSB7XG4gICAgdGhpcy5JVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZChzZWxlY3Rpb25Sb3dzKS50aGVuKGZ1bmN0aW9uIChzZWxlY3Rpb25Sb3dzKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXModXJsLCBzZWxlY3Rpb25Sb3dzLCBpZEZpZWxkLCBzdGF0dXNOYW1lLCBwYWdlQXBwT2JqKTtcbiAgICB9KTtcbiAgfSxcbiAgSVZpZXdUYWJsZURlbGV0ZVJvdzogZnVuY3Rpb24gSVZpZXdUYWJsZURlbGV0ZVJvdyh1cmwsIHJlY29yZElkLCBwYWdlQXBwT2JqKSB7XG4gICAgRGlhbG9nVXRpbGl0eS5Db25maXJtKHdpbmRvdywgXCLnoa7orqTopoHliKDpmaTlvZPliY3orrDlvZXlkJfvvJ9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgQWpheFV0aWxpdHkuRGVsZXRlKHVybCwge1xuICAgICAgICByZWNvcmRJZDogcmVjb3JkSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLnJlbG9hZERhdGEoKTtcbiAgICAgICAgICB9LCBwYWdlQXBwT2JqKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgICAgfVxuICAgICAgfSwgcGFnZUFwcE9iaik7XG4gICAgfSwgcGFnZUFwcE9iaik7XG4gIH0sXG4gIElWaWV3VGFibGVCaW5kRGF0YUJ5U2VhcmNoOiBmdW5jdGlvbiBJVmlld1RhYmxlQmluZERhdGFCeVNlYXJjaChfY29uZmlnKSB7XG4gICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgIHVybDogXCJcIixcbiAgICAgIHBhZ2VOdW06IDEsXG4gICAgICBwYWdlU2l6ZTogMTIsXG4gICAgICBzZWFyY2hDb25kaXRpb246IG51bGwsXG4gICAgICBwYWdlQXBwT2JqOiBudWxsLFxuICAgICAgdGFibGVMaXN0OiBudWxsLFxuICAgICAgaWRGaWVsZDogXCJcIixcbiAgICAgIGF1dG9TZWxlY3RlZE9sZFJvd3M6IGZhbHNlLFxuICAgICAgc3VjY2Vzc0Z1bmM6IG51bGwsXG4gICAgICBsb2FkRGljdDogZmFsc2UsXG4gICAgICBjdXN0UGFyYXM6IHt9XG4gICAgfTtcbiAgICBjb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgY29uZmlnLCBfY29uZmlnKTtcblxuICAgIGlmICghY29uZmlnLnRhYmxlTGlzdCkge1xuICAgICAgY29uZmlnLnRhYmxlTGlzdCA9IGNvbmZpZy5wYWdlQXBwT2JqO1xuICAgIH1cblxuICAgIDtcbiAgICB2YXIgc2VuZERhdGEgPSB7XG4gICAgICBcInBhZ2VOdW1cIjogY29uZmlnLnBhZ2VOdW0sXG4gICAgICBcInBhZ2VTaXplXCI6IGNvbmZpZy5wYWdlU2l6ZSxcbiAgICAgIFwic2VhcmNoQ29uZGl0aW9uXCI6IFNlYXJjaFV0aWxpdHkuU2VyaWFsaXphdGlvblNlYXJjaENvbmRpdGlvbihjb25maWcuc2VhcmNoQ29uZGl0aW9uKSxcbiAgICAgIFwibG9hZERpY3RcIjogY29uZmlnLmxvYWREaWN0XG4gICAgfTtcblxuICAgIGZvciAodmFyIGtleSBpbiBjb25maWcuY3VzdFBhcmFzKSB7XG4gICAgICBzZW5kRGF0YVtrZXldID0gY29uZmlnLmN1c3RQYXJhc1trZXldO1xuICAgIH1cblxuICAgIEFqYXhVdGlsaXR5LlBvc3QoY29uZmlnLnVybCwgc2VuZERhdGEsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5zdWNjZXNzRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBjb25maWcuc3VjY2Vzc0Z1bmMuY2FsbChjb25maWcucGFnZUFwcE9iaiwgcmVzdWx0LCBjb25maWcucGFnZUFwcE9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIGNvbmZpZy50YWJsZUxpc3QucGFnZVRvdGFsID0gcmVzdWx0LmRhdGEudG90YWw7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5hdXRvU2VsZWN0ZWRPbGRSb3dzKSB7XG4gICAgICAgICAgaWYgKGNvbmZpZy50YWJsZUxpc3Quc2VsZWN0aW9uUm93cyAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy50YWJsZUxpc3QudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29uZmlnLnRhYmxlTGlzdC5zZWxlY3Rpb25Sb3dzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZy50YWJsZUxpc3Quc2VsZWN0aW9uUm93c1tqXVtjb25maWcuaWRGaWVsZF0gPT0gY29uZmlnLnRhYmxlTGlzdC50YWJsZURhdGFbaV1bY29uZmlnLmlkRmllbGRdKSB7XG4gICAgICAgICAgICAgICAgICBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YVtpXS5fY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcywgXCJqc29uXCIpO1xuICB9LFxuICBJVmlld1RhYmxlTG9hZERhdGFTZWFyY2g6IGZ1bmN0aW9uIElWaWV3VGFibGVMb2FkRGF0YVNlYXJjaCh1cmwsIHBhZ2VOdW0sIHBhZ2VTaXplLCBzZWFyY2hDb25kaXRpb24sIHBhZ2VBcHBPYmosIGlkRmllbGQsIGF1dG9TZWxlY3RlZE9sZFJvd3MsIHN1Y2Nlc3NGdW5jLCBsb2FkRGljdCwgY3VzdFBhcmFzKSB7XG4gICAgYWxlcnQoXCJMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUxvYWREYXRhU2VhcmNo5pa55rOV5bey57uP6KKr5bqf5byDLOivt+i9rOiwg0lWaWV3VGFibGVCaW5kRGF0YUJ5U2VhcmNoXCIpO1xuICAgIHJldHVybjtcblxuICAgIGlmIChsb2FkRGljdCA9PSB1bmRlZmluZWQgfHwgbG9hZERpY3QgPT0gbnVsbCkge1xuICAgICAgbG9hZERpY3QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIWN1c3RQYXJhcykge1xuICAgICAgY3VzdFBhcmFzID0ge307XG4gICAgfVxuXG4gICAgdmFyIHNlbmREYXRhID0ge1xuICAgICAgXCJwYWdlTnVtXCI6IHBhZ2VOdW0sXG4gICAgICBcInBhZ2VTaXplXCI6IHBhZ2VTaXplLFxuICAgICAgXCJzZWFyY2hDb25kaXRpb25cIjogU2VhcmNoVXRpbGl0eS5TZXJpYWxpemF0aW9uU2VhcmNoQ29uZGl0aW9uKHNlYXJjaENvbmRpdGlvbiksXG4gICAgICBcImxvYWREaWN0XCI6IGxvYWREaWN0XG4gICAgfTtcblxuICAgIGZvciAodmFyIGtleSBpbiBjdXN0UGFyYXMpIHtcbiAgICAgIHNlbmREYXRhW2tleV0gPSBjdXN0UGFyYXNba2V5XTtcbiAgICB9XG5cbiAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwgc2VuZERhdGEsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBpZiAodHlwZW9mIHN1Y2Nlc3NGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHN1Y2Nlc3NGdW5jKHJlc3VsdCwgcGFnZUFwcE9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIHBhZ2VBcHBPYmoucGFnZVRvdGFsID0gcmVzdWx0LmRhdGEudG90YWw7XG5cbiAgICAgICAgaWYgKGF1dG9TZWxlY3RlZE9sZFJvd3MpIHtcbiAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZUFwcE9iai50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzW2pdW2lkRmllbGRdID09IHBhZ2VBcHBPYmoudGFibGVEYXRhW2ldW2lkRmllbGRdKSB7XG4gICAgICAgICAgICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YVtpXS5fY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge31cbiAgICB9LCB0aGlzLCBcImpzb25cIik7XG4gIH0sXG4gIElWaWV3VGFibGVMb2FkRGF0YU5vU2VhcmNoOiBmdW5jdGlvbiBJVmlld1RhYmxlTG9hZERhdGFOb1NlYXJjaCh1cmwsIHBhZ2VOdW0sIHBhZ2VTaXplLCBwYWdlQXBwT2JqLCBpZEZpZWxkLCBhdXRvU2VsZWN0ZWRPbGRSb3dzLCBzdWNjZXNzRnVuYykge1xuICAgIGFsZXJ0KFwiTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVMb2FkRGF0YVNlYXJjaOaWueazleW3sue7j+iiq+W6n+W8gyzor7fovazosINJVmlld1RhYmxlQmluZERhdGFCeVNlYXJjaFwiKTtcbiAgICByZXR1cm47XG4gICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHtcbiAgICAgIHBhZ2VOdW06IHBhZ2VOdW0sXG4gICAgICBwYWdlU2l6ZTogcGFnZVNpemVcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGEgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGEgPSByZXN1bHQuZGF0YS5saXN0O1xuICAgICAgICBwYWdlQXBwT2JqLnBhZ2VUb3RhbCA9IHJlc3VsdC5kYXRhLnRvdGFsO1xuXG4gICAgICAgIGlmIChhdXRvU2VsZWN0ZWRPbGRSb3dzKSB7XG4gICAgICAgICAgaWYgKHBhZ2VBcHBPYmouc2VsZWN0aW9uUm93cyAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VBcHBPYmoudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2VBcHBPYmouc2VsZWN0aW9uUm93c1tqXVtpZEZpZWxkXSA9PSBwYWdlQXBwT2JqLnRhYmxlRGF0YVtpXVtpZEZpZWxkXSkge1xuICAgICAgICAgICAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGFbaV0uX2NoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygc3VjY2Vzc0Z1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgc3VjY2Vzc0Z1bmMocmVzdWx0LCBwYWdlQXBwT2JqKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIFwianNvblwiKTtcbiAgfSxcbiAgSVZpZXdUYWJsZUlubmVyQnV0dG9uOiB7XG4gICAgVmlld0J1dHRvbjogZnVuY3Rpb24gVmlld0J1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmopIHtcbiAgICAgIHJldHVybiBoKCdUb29sdGlwJywge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGNvbnRlbnQ6IFwi5p+l55yLXCJcbiAgICAgICAgfVxuICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIHZpZXdcIixcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLnZpZXcocGFyYW1zLnJvd1tpZEZpZWxkXSwgcGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXSk7XG4gICAgfSxcbiAgICBFZGl0QnV0dG9uOiBmdW5jdGlvbiBFZGl0QnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ1Rvb2x0aXAnLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgY29udGVudDogXCLkv67mlLlcIlxuICAgICAgICB9XG4gICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gZWRpdFwiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmouZWRpdChwYXJhbXMucm93W2lkRmllbGRdLCBwYXJhbXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSldKTtcbiAgICB9LFxuICAgIERlbGV0ZUJ1dHRvbjogZnVuY3Rpb24gRGVsZXRlQnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ1Rvb2x0aXAnLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgY29udGVudDogXCLliKDpmaRcIlxuICAgICAgICB9XG4gICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gZGVsXCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai5kZWwocGFyYW1zLnJvd1tpZEZpZWxkXSwgcGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXSk7XG4gICAgfSxcbiAgICBNb3ZlVXBCdXR0b246IGZ1bmN0aW9uIE1vdmVVcEJ1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmopIHtcbiAgICAgIHJldHVybiBoKCdUb29sdGlwJywge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGNvbnRlbnQ6IFwi5LiK56e7XCJcbiAgICAgICAgfVxuICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIG1vdmUtdXBcIixcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLm1vdmVVcChwYXJhbXMucm93W2lkRmllbGRdLCBwYXJhbXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSldKTtcbiAgICB9LFxuICAgIE1vdmVEb3duQnV0dG9uOiBmdW5jdGlvbiBNb3ZlRG93bkJ1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmopIHtcbiAgICAgIHJldHVybiBoKCdUb29sdGlwJywge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGNvbnRlbnQ6IFwi5LiL56e7XCJcbiAgICAgICAgfVxuICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIG1vdmUtZG93blwiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmoubW92ZURvd24ocGFyYW1zLnJvd1tpZEZpZWxkXSwgcGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXSk7XG4gICAgfSxcbiAgICBTZWxlY3RlZEJ1dHRvbjogZnVuY3Rpb24gU2VsZWN0ZWRCdXR0b24oaCwgcGFyYW1zLCBpZEZpZWxkLCBwYWdlQXBwT2JqLCBjbGlja0V2ZW50KSB7XG4gICAgICByZXR1cm4gaCgnVG9vbHRpcCcsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBjb250ZW50OiBcIumAieaLqVwiXG4gICAgICAgIH1cbiAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbiBzZWxlY3RlZFwiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2xpY2tFdmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgY2xpY2tFdmVudChwYXJhbXMucm93W2lkRmllbGRdLCBwYXJhbXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGFnZUFwcE9iai5zZWxlY3RlZChwYXJhbXMucm93W2lkRmllbGRdLCBwYXJhbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSldKTtcbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBMb2NhbFN0b3JhZ2VVdGlsaXR5ID0ge1xuICBpc1N1cHBvcnQ6IGZ1bmN0aW9uIGlzU3VwcG9ydCgpIHtcbiAgICBpZiAodHlwZW9mIFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuICBzZXRJdGVtOiBmdW5jdGlvbiBzZXRJdGVtKGtleSwgdmFsdWUpIHtcbiAgICBpZiAodGhpcy5pc1N1cHBvcnQoKSkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgfVxuICB9LFxuICBnZXRJdGVtOiBmdW5jdGlvbiBnZXRJdGVtKGtleSkge1xuICAgIGlmICh0aGlzLmlzU3VwcG9ydCgpKSB7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgc2V0SXRlbUluU2Vzc2lvblN0b3JhZ2U6IGZ1bmN0aW9uIHNldEl0ZW1JblNlc3Npb25TdG9yYWdlKGtleSwgdmFsdWUpIHtcbiAgICBpZiAodGhpcy5pc1N1cHBvcnQoKSkge1xuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcbiAgICB9XG4gIH0sXG4gIGdldEl0ZW1JblNlc3Npb25TdG9yYWdlOiBmdW5jdGlvbiBnZXRJdGVtSW5TZXNzaW9uU3RvcmFnZShrZXkpIHtcbiAgICBpZiAodGhpcy5pc1N1cHBvcnQoKSkge1xuICAgICAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFBhZ2VTdHlsZVV0aWxpdHkgPSB7XG4gIEdldFBhZ2VIZWlnaHQ6IGZ1bmN0aW9uIEdldFBhZ2VIZWlnaHQoKSB7XG4gICAgcmV0dXJuIGpRdWVyeSh3aW5kb3cuZG9jdW1lbnQpLmhlaWdodCgpO1xuICB9LFxuICBHZXRQYWdlV2lkdGg6IGZ1bmN0aW9uIEdldFBhZ2VXaWR0aCgpIHtcbiAgICByZXR1cm4galF1ZXJ5KHdpbmRvdy5kb2N1bWVudCkud2lkdGgoKTtcbiAgfSxcbiAgR2V0V2luZG93SGVpZ2h0OiBmdW5jdGlvbiBHZXRXaW5kb3dIZWlnaHQoKSB7XG4gICAgYWxlcnQoXCJHZXRXaW5kb3dIZWlnaHQ65pyq5a6e546wXCIpO1xuICAgIHRocm93IFwiR2V0V2luZG93SGVpZ2h0OuacquWunueOsFwiO1xuICB9LFxuICBHZXRXaW5kb3dXaWR0aDogZnVuY3Rpb24gR2V0V2luZG93V2lkdGgoKSB7XG4gICAgYWxlcnQoXCJHZXRXaW5kb3dXaWR0aDrmnKrlrp7njrBcIik7XG4gICAgdGhyb3cgXCJHZXRXaW5kb3dXaWR0aDrmnKrlrp7njrBcIjtcbiAgfSxcbiAgR2V0U2NyZWVuSGVpZ2h0OiBmdW5jdGlvbiBHZXRTY3JlZW5IZWlnaHQoKSB7XG4gICAgcmV0dXJuIHNjcmVlbi5oZWlnaHQ7XG4gIH0sXG4gIEdldFNjcmVlbldpZHRoOiBmdW5jdGlvbiBHZXRTY3JlZW5XaWR0aCgpIHtcbiAgICByZXR1cm4gc2NyZWVuLndpZHRoO1xuICB9LFxuICBBdXRvRWxlbUhlaWdodDogZnVuY3Rpb24gQXV0b0VsZW1IZWlnaHQoZWxlbVNlbGVjdG9yLCBmaXhIZWlnaHQpIHtcbiAgICB2YXIgcGFnZUhlaWdodCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpO1xuICAgIHZhciBuZXdIZWlnaHQgPSBwYWdlSGVpZ2h0IC0gZml4SGVpZ2h0O1xuICAgICQoZWxlbVNlbGVjdG9yKS5oZWlnaHQobmV3SGVpZ2h0KTtcbiAgfSxcbiAgQXV0b0VsZW1IZWlnaHRJblRhYmxlTGF5b3V0OiBmdW5jdGlvbiBBdXRvRWxlbUhlaWdodEluVGFibGVMYXlvdXQoZWxlbVNlbGVjdG9yLCB0YWJsZVNlbGVjdG9yKSB7XG4gICAgdmFyIHBhZ2VIZWlnaHQgPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKTtcbiAgICB2YXIgdGFibGVIZWlnaHQgPSAkKHRhYmxlU2VsZWN0b3IpLmhlaWdodCgpO1xuXG4gICAgaWYgKHBhZ2VIZWlnaHQgPiB0YWJsZUhlaWdodCkge1xuICAgICAgdmFyIGVsZW1IZWlnaHQgPSAkKGVsZW1TZWxlY3RvcikuaGVpZ2h0KCk7XG4gICAgICB2YXIgZml4SGVpZ2h0ID0gcGFnZUhlaWdodCAtIHRhYmxlSGVpZ2h0O1xuICAgICAgdmFyIGhlaWdodCA9IGVsZW1IZWlnaHQgKyBmaXhIZWlnaHQgLSA2MDtcblxuICAgICAgaWYgKCQoXCIudWktdGFic1wiKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGhlaWdodCA9IGhlaWdodCAtIDcwO1xuICAgICAgfVxuXG4gICAgICAkKGVsZW1TZWxlY3RvcikuaGVpZ2h0KGhlaWdodCk7XG4gICAgfVxuICB9LFxuICBHZXRMaXN0QnV0dG9uT3V0ZXJIZWlnaHQ6IGZ1bmN0aW9uIEdldExpc3RCdXR0b25PdXRlckhlaWdodCgpIHtcbiAgICBhbGVydChcIlBhZ2VTdHlsZVV0aWxpdHkuR2V0TGlzdEJ1dHRvbk91dGVySGVpZ2h0IOW3suWBnOeUqFwiKTtcbiAgICByZXR1cm4galF1ZXJ5KFwiLmxpc3QtYnV0dG9uLW91dGVyLWNcIikub3V0ZXJIZWlnaHQoKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFNlYXJjaFV0aWxpdHkgPSB7XG4gIFNlYXJjaEZpZWxkVHlwZToge1xuICAgIEludFR5cGU6IFwiSW50VHlwZVwiLFxuICAgIE51bWJlclR5cGU6IFwiTnVtYmVyVHlwZVwiLFxuICAgIERhdGFUeXBlOiBcIkRhdGVUeXBlXCIsXG4gICAgTGlrZVN0cmluZ1R5cGU6IFwiTGlrZVN0cmluZ1R5cGVcIixcbiAgICBMZWZ0TGlrZVN0cmluZ1R5cGU6IFwiTGVmdExpa2VTdHJpbmdUeXBlXCIsXG4gICAgUmlnaHRMaWtlU3RyaW5nVHlwZTogXCJSaWdodExpa2VTdHJpbmdUeXBlXCIsXG4gICAgU3RyaW5nVHlwZTogXCJTdHJpbmdUeXBlXCIsXG4gICAgRGF0YVN0cmluZ1R5cGU6IFwiRGF0ZVN0cmluZ1R5cGVcIixcbiAgICBBcnJheUxpa2VTdHJpbmdUeXBlOiBcIkFycmF5TGlrZVN0cmluZ1R5cGVcIlxuICB9LFxuICBTZXJpYWxpemF0aW9uU2VhcmNoQ29uZGl0aW9uOiBmdW5jdGlvbiBTZXJpYWxpemF0aW9uU2VhcmNoQ29uZGl0aW9uKHNlYXJjaENvbmRpdGlvbikge1xuICAgIGlmIChzZWFyY2hDb25kaXRpb24pIHtcbiAgICAgIHZhciBzZWFyY2hDb25kaXRpb25DbG9uZSA9IEpzb25VdGlsaXR5LkNsb25lU2ltcGxlKHNlYXJjaENvbmRpdGlvbik7XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBzZWFyY2hDb25kaXRpb25DbG9uZSkge1xuICAgICAgICBpZiAoc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS50eXBlID09IFNlYXJjaFV0aWxpdHkuU2VhcmNoRmllbGRUeXBlLkFycmF5TGlrZVN0cmluZ1R5cGUpIHtcbiAgICAgICAgICBpZiAoc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZSAhPSBudWxsICYmIHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZSA9IHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udmFsdWUuam9pbihcIjtcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udmFsdWUgPSBcIlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc2VhcmNoQ29uZGl0aW9uQ2xvbmUpO1xuICAgIH1cblxuICAgIHJldHVybiBcIlwiO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgSkJ1aWxkNERTZWxlY3RWaWV3ID0ge1xuICBTZWxlY3RFbnZWYXJpYWJsZToge1xuICAgIGZvcm1hdFRleHQ6IGZ1bmN0aW9uIGZvcm1hdFRleHQodHlwZSwgdGV4dCkge1xuICAgICAgYWxlcnQoXCJKQnVpbGQ0RFNlbGVjdFZpZXcuZm9ybWF0VGV4dOaWueazleW3sue7j+W6n+W8gyzor7fkvb/nlKhzZWxlY3QtZGVmYXVsdC12YWx1ZS1kaWFsb2fnu4Tku7blhoXpg6jnmoRmb3JtYXRUZXh05pa55rOVIVwiKTtcbiAgICAgIHJldHVybjtcblxuICAgICAgaWYgKHR5cGUgPT0gXCJDb25zdFwiKSB7XG4gICAgICAgIHJldHVybiBcIumdmeaAgeWAvDrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiRGF0ZVRpbWVcIikge1xuICAgICAgICByZXR1cm4gXCLml6XmnJ/ml7bpl7Q644CQXCIgKyB0ZXh0ICsgXCLjgJFcIjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIkFwaVZhclwiKSB7XG4gICAgICAgIHJldHVybiBcIkFQSeWPmOmHjzrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiTnVtYmVyQ29kZVwiKSB7XG4gICAgICAgIHJldHVybiBcIuW6j+WPt+e8lueggTrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiSWRDb2RlclwiKSB7XG4gICAgICAgIHJldHVybiBcIuS4u+mUrueUn+aIkDrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIFwi44CQ5peg44CRXCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBcIuacquefpeexu+Wei1wiICsgdGV4dDtcbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBTZXNzaW9uVXRpbGl0eSA9IHtcbiAgX2N1cnJlbnRTZXNzaW9uVXNlcjogbnVsbCxcbiAgX2N1cnJlbnRTZXNzaW9uVXNlck1vY2s6IHtcbiAgICBvcmdhbklkOiBcIlwiLFxuICAgIG9yZ2FuTmFtZTogXCJcIixcbiAgICB1c2VySWQ6IFwiXCIsXG4gICAgdXNlck5hbWU6IFwiXCIsXG4gICAgbWFpbkRlcGFydG1lbnRJZDogXCJcIixcbiAgICBtYWluRGVwYXJ0bWVudE5hbWU6IFwiXCIsXG4gICAgYWNjb3VudElkOiBcIlwiLFxuICAgIGFjY291bnROYW1lOiBcIlwiXG4gIH0sXG4gIENsZWFyQ2xpZW50U2Vzc2lvblN0b3JlU2Vzc2lvblVzZXI6IGZ1bmN0aW9uIENsZWFyQ2xpZW50U2Vzc2lvblN0b3JlU2Vzc2lvblVzZXIoKSB7fSxcbiAgR2V0U2Vzc2lvblVzZXJTeW5jOiBmdW5jdGlvbiBHZXRTZXNzaW9uVXNlclN5bmMoKSB7XG4gICAgaWYgKHRoaXMuX2N1cnJlbnRTZXNzaW9uVXNlciA9PSBudWxsKSB7XG4gICAgICBpZiAod2luZG93LnBhcmVudC5TZXNzaW9uVXRpbGl0eS5fY3VycmVudFNlc3Npb25Vc2VyICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5wYXJlbnQuU2Vzc2lvblV0aWxpdHkuX2N1cnJlbnRTZXNzaW9uVXNlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEFqYXhVdGlsaXR5LlBvc3RTeW5jKFwiL1Jlc3QvU2Vzc2lvbi9Vc2VyL0dldE15U2Vzc2lvblVzZXJcIiwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIFNlc3Npb25VdGlsaXR5Ll9jdXJyZW50U2Vzc2lvblVzZXIgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICB9IGVsc2Uge31cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50U2Vzc2lvblVzZXI7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50U2Vzc2lvblVzZXI7XG4gICAgfVxuICB9LFxuICBHZXRTZXNzaW9uVXNlcjogZnVuY3Rpb24gR2V0U2Vzc2lvblVzZXIoZnVuYykge1xuICAgIGlmICghdGhpcy5fY3VycmVudFNlc3Npb25Vc2VyKSB7XG4gICAgICBBamF4VXRpbGl0eS5HZXQoXCIvUmVzdC9TZXNzaW9uL1VzZXIvR2V0TXlTZXNzaW9uVXNlclwiLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBmdW5jKHJlc3VsdC5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRTZXNzaW9uVXNlcjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxudmFyIFN0cmluZ1V0aWxpdHkgPSB7XG4gIEd1aWRTcGxpdDogZnVuY3Rpb24gR3VpZFNwbGl0KHNwbGl0KSB7XG4gICAgdmFyIGd1aWQgPSBcIlwiO1xuXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMzI7IGkrKykge1xuICAgICAgZ3VpZCArPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNi4wKS50b1N0cmluZygxNik7XG4gICAgICBpZiAoaSA9PSA4IHx8IGkgPT0gMTIgfHwgaSA9PSAxNiB8fCBpID09IDIwKSBndWlkICs9IHNwbGl0O1xuICAgIH1cblxuICAgIHJldHVybiBndWlkO1xuICB9LFxuICBHdWlkOiBmdW5jdGlvbiBHdWlkKCkge1xuICAgIHJldHVybiB0aGlzLkd1aWRTcGxpdChcIi1cIik7XG4gIH0sXG4gIFRpbWVzdGFtcDogZnVuY3Rpb24gVGltZXN0YW1wKCkge1xuICAgIHZhciB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICByZXR1cm4gdGltZXN0YW1wLnRvU3RyaW5nKCkuc3Vic3RyKDQsIDEwKTtcbiAgfSxcbiAgVHJpbTogZnVuY3Rpb24gVHJpbShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyheW+OAgFxcc10qKXwoW+OAgFxcc10qJCkvZywgXCJcIik7XG4gIH0sXG4gIFJlbW92ZUxhc3RDaGFyOiBmdW5jdGlvbiBSZW1vdmVMYXN0Q2hhcihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZygwLCBzdHIubGVuZ3RoIC0gMSk7XG4gIH0sXG4gIElzTnVsbE9yRW1wdHk6IGZ1bmN0aW9uIElzTnVsbE9yRW1wdHkob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PSB1bmRlZmluZWQgfHwgb2JqID09IFwiXCIgfHwgb2JqID09IG51bGwgfHwgb2JqID09IFwidW5kZWZpbmVkXCIgfHwgb2JqID09IFwibnVsbFwiO1xuICB9LFxuICBJc05vdE51bGxPckVtcHR5OiBmdW5jdGlvbiBJc05vdE51bGxPckVtcHR5KG9iaikge1xuICAgIHJldHVybiAhdGhpcy5Jc051bGxPckVtcHR5KG9iaik7XG4gIH0sXG4gIEdldEZ1bmN0aW9uTmFtZTogZnVuY3Rpb24gR2V0RnVuY3Rpb25OYW1lKGZ1bmMpIHtcbiAgICBpZiAodHlwZW9mIGZ1bmMgPT0gXCJmdW5jdGlvblwiIHx8IF90eXBlb2YoZnVuYykgPT0gXCJvYmplY3RcIikgdmFyIGZOYW1lID0gKFwiXCIgKyBmdW5jKS5tYXRjaCgvZnVuY3Rpb25cXHMqKFtcXHdcXCRdKilcXHMqXFwoLyk7XG4gICAgaWYgKGZOYW1lICE9PSBudWxsKSByZXR1cm4gZk5hbWVbMV07XG4gIH0sXG4gIFRvTG93ZXJDYXNlOiBmdW5jdGlvbiBUb0xvd2VyQ2FzZShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCk7XG4gIH0sXG4gIHRvVXBwZXJDYXNlOiBmdW5jdGlvbiB0b1VwcGVyQ2FzZShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7XG4gIH0sXG4gIEVuZFdpdGg6IGZ1bmN0aW9uIEVuZFdpdGgoc3RyLCBlbmRTdHIpIHtcbiAgICB2YXIgZCA9IHN0ci5sZW5ndGggLSBlbmRTdHIubGVuZ3RoO1xuICAgIHJldHVybiBkID49IDAgJiYgc3RyLmxhc3RJbmRleE9mKGVuZFN0cikgPT0gZDtcbiAgfSxcbiAgSXNTYW1lRG9tYWluOiBmdW5jdGlvbiBJc1NhbWVEb21haW4odXJsMSwgdXJsMikge1xuICAgIHZhciBvcmlnaW4xID0gL1xcL1xcL1tcXHctLl0rKDpcXGQrKT8vaS5leGVjKHVybDEpWzBdO1xuICAgIHZhciBvcGVuID0gL1xcL1xcL1tcXHctLl0rKDpcXGQrKT8vaS5leGVjKHVybDIpO1xuXG4gICAgaWYgKG9wZW4gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBvcmlnaW4yID0gb3BlblswXTtcblxuICAgICAgaWYgKG9yaWdpbjEgPT0gb3JpZ2luMikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcbiAgRmlyc3RDaGFyTGV0dGVyOiBmdW5jdGlvbiBGaXJzdENoYXJMZXR0ZXIoc3RyKSB7XG4gICAgdmFyIHN0cjEgPSBzdHIucmVwbGFjZShzdHJbMF0sIHN0clswXS50b0xvd2VyQ2FzZSgpKTtcbiAgICByZXR1cm4gc3RyMTtcbiAgfSxcbiAgRmlyc3RDaGFyVXBwZXI6IGZ1bmN0aW9uIEZpcnN0Q2hhclVwcGVyKHN0cikge1xuICAgIHZhciBzdHIxID0gc3RyLnJlcGxhY2Uoc3RyWzBdLCBzdHJbMF0udG9VcHBlckNhc2UoKSk7XG4gICAgcmV0dXJuIHN0cjE7XG4gIH0sXG4gIFJlbW92ZVNjcmlwdDogZnVuY3Rpb24gUmVtb3ZlU2NyaXB0KHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvPHNjcmlwdC4qPz4uKj88XFwvc2NyaXB0Pi9pZywgJycpO1xuICB9LFxuICBFbmNvZGVIdG1sOiBmdW5jdGlvbiBFbmNvZGVIdG1sKHN0cikge1xuICAgIHZhciBSRUdYX0hUTUxfRU5DT0RFID0gL1wifCZ8J3w8fD58W1xceDAwLVxceDIwXXxbXFx4N0YtXFx4RkZdfFtcXHUwMTAwLVxcdTI3MDBdL2c7XG4gICAgcmV0dXJuIHR5cGVvZiBzdHIgIT0gXCJzdHJpbmdcIiA/IHN0ciA6IHN0ci5yZXBsYWNlKFJFR1hfSFRNTF9FTkNPREUsIGZ1bmN0aW9uICgkMCkge1xuICAgICAgdmFyIGMgPSAkMC5jaGFyQ29kZUF0KDApLFxuICAgICAgICAgIHIgPSBbXCImI1wiXTtcbiAgICAgIGMgPSBjID09IDB4MjAgPyAweEEwIDogYztcbiAgICAgIHIucHVzaChjKTtcbiAgICAgIHIucHVzaChcIjtcIik7XG4gICAgICByZXR1cm4gci5qb2luKFwiXCIpO1xuICAgIH0pO1xuICB9LFxuICBEZWNvZGVIdG1sOiBmdW5jdGlvbiBEZWNvZGVIdG1sKHN0cikge1xuICAgIHZhciBSRUdYX0hUTUxfREVDT0RFID0gLyZcXHcrO3wmIyhcXGQrKTsvZztcbiAgICB2YXIgSFRNTF9ERUNPREUgPSB7XG4gICAgICBcIiZsdDtcIjogXCI8XCIsXG4gICAgICBcIiZndDtcIjogXCI+XCIsXG4gICAgICBcIiZhbXA7XCI6IFwiJlwiLFxuICAgICAgXCImbmJzcDtcIjogXCIgXCIsXG4gICAgICBcIiZxdW90O1wiOiBcIlxcXCJcIixcbiAgICAgIFwiwqlcIjogXCJcIlxuICAgIH07XG4gICAgcmV0dXJuIHR5cGVvZiBzdHIgIT0gXCJzdHJpbmdcIiA/IHN0ciA6IHN0ci5yZXBsYWNlKFJFR1hfSFRNTF9ERUNPREUsIGZ1bmN0aW9uICgkMCwgJDEpIHtcbiAgICAgIHZhciBjID0gSFRNTF9ERUNPREVbJDBdO1xuXG4gICAgICBpZiAoYyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKCFpc05hTigkMSkpIHtcbiAgICAgICAgICBjID0gU3RyaW5nLmZyb21DaGFyQ29kZSgkMSA9PSAxNjAgPyAzMiA6ICQxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjID0gJDA7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGM7XG4gICAgfSk7XG4gIH0sXG4gIEdldEZpbGVFeE5hbWU6IGZ1bmN0aW9uIEdldEZpbGVFeE5hbWUoZmlsZU5hbWUpIHtcbiAgICB2YXIgZXh0ID0gZmlsZU5hbWUuc3Vic3RyaW5nKGZpbGVOYW1lLmxhc3RJbmRleE9mKFwiLlwiKSwgZmlsZU5hbWUubGVuZ3RoKTtcbiAgICByZXR1cm4gZXh0O1xuICB9LFxuICBSZXBsYWNlU1BDaGFyTDE6IGZ1bmN0aW9uIFJlcGxhY2VTUENoYXJMMShzb3VyY2UpIHtcbiAgICB2YXIgcmVnID0gL1xcXFx8XFwvfFxcP3xcXO+8n3xcXCp8XFxcInxcXOKAnHxcXOKAnXxcXCd8XFzigJh8XFzigJl8XFzjgIF8XFxefFxcJHxcXCF8XFx+fFxcYHxcXHwvZztcbiAgICB2YXIgdGVtcCA9IHNvdXJjZS5yZXBsYWNlKHJlZywgXCJcIik7XG4gICAgcmV0dXJuIHRlbXA7XG4gIH0sXG4gIFJlcGxhY2VTUENoYXJMMjogZnVuY3Rpb24gUmVwbGFjZVNQQ2hhckwyKHNvdXJjZSkge1xuICAgIHZhciByZWcgPSAvXFxcXHxcXC98XFw/fFxc77yffFxcKnxcXFwifFxc4oCcfFxc4oCdfFxcJ3xcXOKAmHxcXOKAmXxcXDx8XFw+fFxce3xcXH18XFxbfFxcXXwsfFxc44CQfFxc44CRfFxc77yafFxcOnxcXOOAgXxcXF58XFwkfFxcIXxcXH58XFxgfFxcfC9nO1xuICAgIHZhciB0ZW1wID0gc291cmNlLnJlcGxhY2UocmVnLCBcIlwiKTtcbiAgICByZXR1cm4gdGVtcDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFRyZWVVdGlsaXR5ID0ge1xuICBCdWlsZE5vZGVQYXRoTmFtZTogZnVuY3Rpb24gQnVpbGROb2RlUGF0aE5hbWUodHJlZU5vZGUsIG5hbWUsIGFwcGVuZFRleHQsIGJlZ2luSW5kZXgpIHtcbiAgICBpZiAoIWJlZ2luSW5kZXgpIHtcbiAgICAgIGJlZ2luSW5kZXggPSAwO1xuICAgIH1cblxuICAgIHZhciBhcnkgPSBbXTtcbiAgICB2YXIgcGF0aE5vZGUgPSB0cmVlTm9kZS5nZXRQYXRoKCk7XG5cbiAgICBmb3IgKHZhciBpID0gYmVnaW5JbmRleDsgaSA8IHBhdGhOb2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcnkucHVzaChTdHJpbmdVdGlsaXR5LlJlcGxhY2VTUENoYXJMMihwYXRoTm9kZVtpXVtuYW1lXSkpO1xuICAgIH1cblxuICAgIGlmIChTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkoYXBwZW5kVGV4dCkpIHtcbiAgICAgIHJldHVybiBhcnkuam9pbihcIuKWt+KWt1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJ5LmpvaW4oXCLilrfilrdcIikgKyBcIuKWt+KWt1wiICsgU3RyaW5nVXRpbGl0eS5SZXBsYWNlU1BDaGFyTDIoYXBwZW5kVGV4dCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBWYWxpZGF0ZVV0aWxpdHkgPSB7XG4gIFZhbGlkYXRlVHlwZToge1xuICAgIE5vdEVtcHR5OiBcIlwiLFxuICAgIEludDogXCJcIixcbiAgICBOdW1iZXI6IFwiXCIsXG4gICAgU2ltcGxlQ29kZTogXCJcIixcbiAgICBFTWFpbDogXCJcIixcbiAgICBNb2JpbGU6IFwiXCIsXG4gICAgR2VuZXJhbFdvcmQ6IFwiXCJcbiAgfSxcbiAgVmFsaWRhdGVTaW5nbGU6IGZ1bmN0aW9uIFZhbGlkYXRlU2luZ2xlKHZhbHVlLCB0eXBlLCBjYXB0aW9uLCBtZXNzYWdlLCBlcnJvckNhbGxCYWNrKSB7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBtZXNzYWdlQXJyYXk6IFtdLFxuICAgICAgbWVzc2FnZTogXCJcIlxuICAgIH07XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgdGhpcy5WYWxpZGF0ZVR5cGUuTm90RW1wdHk6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgdmFsID0gU3RyaW5nVXRpbGl0eS5UcmltKHZhbHVlKTtcblxuICAgICAgICAgIGlmICh2YWwgPT0gXCJcIikge1xuICAgICAgICAgICAgdmFyIG1zZyA9IFwi44CQXCIgKyBjYXB0aW9uICsgXCLjgJHkuI3og73kuLrnqbrvvIFcIjtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRFcnJvcih3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRFcnJvcklkLCB7fSwgbXNnLCBudWxsLCBudWxsKTtcbiAgICAgICAgICAgIHJlc3VsdC5zdWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICByZXN1bHQubWVzc2FnZSA9IG1zZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgdGhpcy5WYWxpZGF0ZVR5cGUuU2ltcGxlQ29kZTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciByZWcgPSAvXlthLXpBLVowLTlfXXswLH0kLztcblxuICAgICAgICAgIGlmICghcmVnLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICB2YXIgbXNnID0gXCLjgJBcIiArIGNhcHRpb24gKyBcIuOAkeivt+S9v+eUqOiLseaWhyzmlbDlrZcs5oiW6ICFX++8gVwiO1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEVycm9yKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydEVycm9ySWQsIHt9LCBtc2csIG51bGwsIG51bGwpO1xuICAgICAgICAgICAgcmVzdWx0LnN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIHJlc3VsdC5tZXNzYWdlID0gbXNnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBYTUxVdGlsaXR5ID0ge307Il19
