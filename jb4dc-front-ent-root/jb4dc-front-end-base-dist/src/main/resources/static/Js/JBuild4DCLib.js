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
    if (!this.Exist(condition)) {
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
    return $(window).height();
  },
  GetWindowWidth: function GetWindowWidth() {
    return $(window).width();
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
  }
};
"use strict";

var XMLUtility = {};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFqYXhVdGlsaXR5LmpzIiwiQXJyYXlVdGlsaXR5LmpzIiwiQmFzZVV0aWxpdHkuanMiLCJCcm93c2VySW5mb1V0aWxpdHkuanMiLCJDYWNoZURhdGFVdGlsaXR5LmpzIiwiQ29va2llVXRpbGl0eS5qcyIsIkRhdGVVdGlsaXR5LmpzIiwiRGV0YWlsUGFnZVV0aWxpdHkuanMiLCJEaWFsb2dVdGlsaXR5LmpzIiwiRGljdGlvbmFyeVV0aWxpdHkuanMiLCJKQnVpbGQ0RENCYXNlTGliLmpzIiwiSkJ1aWxkNERDWWFtbC5qcyIsIkpzb25VdGlsaXR5LmpzIiwiTGlzdFBhZ2VVdGlsaXR5LmpzIiwiTG9jYWxTdG9yYWdlVXRpbGl0eS5qcyIsIlBhZ2VTdHlsZVV0aWxpdHkuanMiLCJTZWFyY2hVdGlsaXR5LmpzIiwiU2VsZWN0Vmlld0xpYi5qcyIsIlNlc3Npb25VdGlsaXR5LmpzIiwiU3RyaW5nVXRpbGl0eS5qcyIsIlhNTFV0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNya0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcllBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQSIsImZpbGUiOiJKQnVpbGQ0RENMaWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIEFqYXhVdGlsaXR5ID0ge1xuICBQb3N0UmVxdWVzdEJvZHk6IGZ1bmN0aW9uIFBvc3RSZXF1ZXN0Qm9keShfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSkge1xuICAgIHJldHVybiB0aGlzLl9Jbm5lckFqYXgoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiLCB0cnVlLCBcIlBPU1RcIik7XG4gIH0sXG4gIFBvc3RTeW5jOiBmdW5jdGlvbiBQb3N0U3luYyhfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSwgY29udGVudFR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5fSW5uZXJBamF4KF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlLCBudWxsLCBmYWxzZSwgXCJQT1NUXCIpO1xuICB9LFxuICBQb3N0OiBmdW5jdGlvbiBQb3N0KF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuX0lubmVyQWpheChfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSwgbnVsbCwgdHJ1ZSwgXCJQT1NUXCIpO1xuICB9LFxuICBHZXRTeW5jOiBmdW5jdGlvbiBHZXRTeW5jKF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuX0lubmVyQWpheChfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSwgbnVsbCwgZmFsc2UsIFwiR0VUXCIpO1xuICB9LFxuICBHZXQ6IGZ1bmN0aW9uIEdldChfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSkge1xuICAgIHJldHVybiB0aGlzLl9Jbm5lckFqYXgoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUsIG51bGwsIHRydWUsIFwiR0VUXCIpO1xuICB9LFxuICBEZWxldGU6IGZ1bmN0aW9uIERlbGV0ZShfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSkge1xuICAgIHJldHVybiB0aGlzLl9Jbm5lckFqYXgoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUsIG51bGwsIHRydWUsIFwiREVMRVRFXCIpO1xuICB9LFxuICBEZWxldGVTeW5jOiBmdW5jdGlvbiBEZWxldGVTeW5jKF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuX0lubmVyQWpheChfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSwgbnVsbCwgZmFsc2UsIFwiREVMRVRFXCIpO1xuICB9LFxuICBfSW5uZXJBamF4OiBmdW5jdGlvbiBfSW5uZXJBamF4KF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlLCBjb250ZW50VHlwZSwgaXNBc3luYywgYWpheFR5cGUpIHtcbiAgICBpZiAoY2FsbGVyKSB7XG4gICAgICBpZiAoY2FsbGVyID09IFwianNvblwiKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRFcnJvcih3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRFcnJvcklkLCB7fSwgXCLnlLHkuo7mlrnms5Xmm7TmlrAsY2FsbGVy5Y+C5pWw6K+35Lyg6YCSdGhpc1wiLCBudWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24oX3VybCk7XG5cbiAgICBpZiAoZGF0YVR5cGUgPT0gdW5kZWZpbmVkIHx8IGRhdGFUeXBlID09IG51bGwpIHtcbiAgICAgIGRhdGFUeXBlID0gXCJqc29uXCI7XG4gICAgfVxuXG4gICAgaWYgKGlzQXN5bmMgPT0gdW5kZWZpbmVkIHx8IGlzQXN5bmMgPT0gbnVsbCkge1xuICAgICAgaXNBc3luYyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnRUeXBlID09IHVuZGVmaW5lZCB8fCBjb250ZW50VHlwZSA9PSBudWxsKSB7XG4gICAgICBjb250ZW50VHlwZSA9IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04XCI7XG4gICAgfVxuXG4gICAgdmFyIGlubmVyUmVzdWx0ID0gbnVsbDtcbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogYWpheFR5cGUsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGFzeW5jOiBpc0FzeW5jLFxuICAgICAgY29udGVudFR5cGU6IGNvbnRlbnRUeXBlLFxuICAgICAgZGF0YVR5cGU6IGRhdGFUeXBlLFxuICAgICAgZGF0YTogc2VuZERhdGEsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKHJlc3VsdCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCAmJiByZXN1bHQuc3VjY2VzcyAhPSBudWxsICYmICFyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5tZXNzYWdlID09IFwi55m75b2VU2Vzc2lvbui/h+acn1wiKSB7XG4gICAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRFcnJvcih3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRFcnJvcklkLCB7fSwgXCJTZXNzaW9u6LaF5pe277yM6K+36YeN5paw55m76ZmG57O757ufXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBCYXNlVXRpbGl0eS5SZWRpcmVjdFRvTG9naW4oKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJBamF4VXRpbGl0eS5Qb3N0IEV4Y2VwdGlvbiBcIiArIHVybCk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyA9PSBmYWxzZSkge1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSByZXN1bHQubWVzc2FnZTtcblxuICAgICAgICAgICAgaWYgKFN0cmluZ1V0aWxpdHkuSXNOdWxsT3JFbXB0eShtZXNzYWdlKSkge1xuICAgICAgICAgICAgICBtZXNzYWdlID0gcmVzdWx0LnRyYWNlTXNnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0RXJyb3Iod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0RXJyb3JJZCwge30sIG1lc3NhZ2UsIGZ1bmN0aW9uICgpIHt9KTtcblxuICAgICAgICAgICAgaWYgKGNhbGxlcikge1xuICAgICAgICAgICAgICBpZiAoY2FsbGVyLmlzU3VibWl0dGluZykge1xuICAgICAgICAgICAgICAgIGNhbGxlci5pc1N1Ym1pdHRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cblxuICAgICAgICBpZiAoY2FsbGVyKSB7XG4gICAgICAgICAgZnVuYy5jYWxsKGNhbGxlciwgcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmdW5jKHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbm5lclJlc3VsdCA9IHJlc3VsdDtcbiAgICAgIH0sXG4gICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUobXNnKSB7fSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcihtc2cpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAobXNnLnJlc3BvbnNlVGV4dC5pbmRleE9mKFwi6K+36YeN5paw55m76ZmG57O757ufXCIpID49IDApIHtcbiAgICAgICAgICAgIEJhc2VVdGlsaXR5LlJlZGlyZWN0VG9Mb2dpbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEVycm9yKHdpbmRvdywgXCJBamF4VXRpbGl0eS5Qb3N0LkVycm9yXCIsIHt9LCBcIkFqYXjor7fmsYLlj5HnlJ/plJnor6/vvIE8YnIvPlwiICsgXCJzdGF0dXM6XCIgKyBtc2cuc3RhdHVzICsgXCIsPGJyLz5yZXNwb25zZVRleHQ6XCIgKyBtc2cucmVzcG9uc2VUZXh0LCBudWxsKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaW5uZXJSZXN1bHQ7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBBcnJheVV0aWxpdHkgPSB7XG4gIERlbGV0ZTogZnVuY3Rpb24gRGVsZXRlKGFyeSwgaW5kZXgpIHtcbiAgICBhcnkuc3BsaWNlKGluZGV4LCAxKTtcbiAgfSxcbiAgU3dhcEl0ZW1zOiBmdW5jdGlvbiBTd2FwSXRlbXMoYXJ5LCBpbmRleDEsIGluZGV4Mikge1xuICAgIGFyeVtpbmRleDFdID0gYXJ5LnNwbGljZShpbmRleDIsIDEsIGFyeVtpbmRleDFdKVswXTtcbiAgICByZXR1cm4gYXJ5O1xuICB9LFxuICBNb3ZlVXA6IGZ1bmN0aW9uIE1vdmVVcChhcnIsICRpbmRleCkge1xuICAgIGlmICgkaW5kZXggPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuU3dhcEl0ZW1zKGFyciwgJGluZGV4LCAkaW5kZXggLSAxKTtcbiAgfSxcbiAgTW92ZURvd246IGZ1bmN0aW9uIE1vdmVEb3duKGFyciwgJGluZGV4KSB7XG4gICAgaWYgKCRpbmRleCA9PSBhcnIubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuU3dhcEl0ZW1zKGFyciwgJGluZGV4LCAkaW5kZXggKyAxKTtcbiAgfSxcbiAgVW5pcXVlOiBmdW5jdGlvbiBVbmlxdWUoYXJyKSB7XG4gICAgdmFyIG4gPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobi5pbmRleE9mKGFycltpXSkgPT0gLTEpIG4ucHVzaChhcnJbaV0pO1xuICAgIH1cblxuICAgIHJldHVybiBuO1xuICB9LFxuICBFeGlzdDogZnVuY3Rpb24gRXhpc3QoYXJyLCBjb25kaXRpb24pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGNvbmRpdGlvbihhcnJbaV0pKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgUHVzaFdoZW5Ob3RFeGlzdDogZnVuY3Rpb24gUHVzaFdoZW5Ob3RFeGlzdChhcnIsIGl0ZW0sIGNvbmRpdGlvbikge1xuICAgIGlmICghdGhpcy5FeGlzdChjb25kaXRpb24pKSB7XG4gICAgICBhcnIucHVzaChpdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyO1xuICB9LFxuICBXaGVyZTogZnVuY3Rpb24gV2hlcmUoYXJyLCBjb25kaXRpb24pIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGNvbmRpdGlvbihhcnJbaV0pKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGFycltpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgV2hlcmVTaW5nbGU6IGZ1bmN0aW9uIFdoZXJlU2luZ2xlKGFyciwgY29uZGl0aW9uKSB7XG4gICAgdmFyIHRlbXAgPSB0aGlzLldoZXJlKGFyciwgY29uZGl0aW9uKTtcblxuICAgIGlmICh0ZW1wLmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGVtcFswXTtcbiAgfSxcbiAgUHVzaDogZnVuY3Rpb24gUHVzaChzb3VyY2UsIGFwcGVuZCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGFwcGVuZCkpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXBwZW5kLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHNvdXJjZS5wdXNoKGFwcGVuZFtpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNvdXJjZS5wdXNoKGFwcGVuZCk7XG4gICAgfVxuICB9LFxuICBUcnVlOiBmdW5jdGlvbiBUcnVlKHNvdXJjZSwgY29uZGl0aW9uKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjb25kaXRpb24oc291cmNlW2ldKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIElzQXJyYXk6IGZ1bmN0aW9uIElzQXJyYXkoc291cmNlKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KSB7XG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShzb3VyY2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHNvdXJjZSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQmFzZVV0aWxpdHkgPSB7XG4gIEdldFJvb3RQYXRoOiBmdW5jdGlvbiBHZXRSb290UGF0aCgpIHtcbiAgICB2YXIgZnVsbEhyZWYgPSB3aW5kb3cuZG9jdW1lbnQubG9jYXRpb24uaHJlZjtcbiAgICB2YXIgcGF0aE5hbWUgPSB3aW5kb3cuZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgdmFyIGxhYyA9IGZ1bGxIcmVmLmluZGV4T2YocGF0aE5hbWUpO1xuICAgIHZhciBsb2NhbGhvc3RQYXRoID0gZnVsbEhyZWYuc3Vic3RyaW5nKDAsIGxhYyk7XG4gICAgdmFyIHByb2plY3ROYW1lID0gcGF0aE5hbWUuc3Vic3RyaW5nKDAsIHBhdGhOYW1lLnN1YnN0cigxKS5pbmRleE9mKCcvJykgKyAxKTtcbiAgICByZXR1cm4gbG9jYWxob3N0UGF0aCArIHByb2plY3ROYW1lO1xuICB9LFxuICBHZXRUb3BXaW5kb3c6IGZ1bmN0aW9uIEdldFRvcFdpbmRvdygpIHtcbiAgICBhbGVydChcIkJhc2VVdGlsaXR5LkdldFRvcFdpbmRvdyDlt7LlgZznlKhcIik7XG4gIH0sXG4gIFRyeVNldENvbnRyb2xGb2N1czogZnVuY3Rpb24gVHJ5U2V0Q29udHJvbEZvY3VzKCkge1xuICAgIGFsZXJ0KFwiQmFzZVV0aWxpdHkuVHJ5U2V0Q29udHJvbEZvY3VzIOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgQnVpbGRWaWV3OiBmdW5jdGlvbiBCdWlsZFZpZXcoYWN0aW9uLCBwYXJhKSB7XG4gICAgcmV0dXJuIHRoaXMuQnVpbGRBY3Rpb24oYWN0aW9uLCBwYXJhKTtcbiAgfSxcbiAgQnVpbGRBY3Rpb246IGZ1bmN0aW9uIEJ1aWxkQWN0aW9uKGFjdGlvbiwgcGFyYSkge1xuICAgIHZhciB1cmxQYXJhID0gXCJcIjtcblxuICAgIGlmIChwYXJhKSB7XG4gICAgICB1cmxQYXJhID0gJC5wYXJhbShwYXJhKTtcbiAgICB9XG5cbiAgICB2YXIgX3VybCA9IHRoaXMuR2V0Um9vdFBhdGgoKSArIGFjdGlvbjtcblxuICAgIGlmICh1cmxQYXJhICE9IFwiXCIpIHtcbiAgICAgIF91cmwgKz0gXCI/XCIgKyB1cmxQYXJhO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLkFwcGVuZFRpbWVTdGFtcFVybChfdXJsKTtcbiAgfSxcbiAgUmVkaXJlY3RUb0xvZ2luOiBmdW5jdGlvbiBSZWRpcmVjdFRvTG9naW4oKSB7XG4gICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9QbGF0Rm9ybS9Mb2dpblZpZXcuZG9cIjtcbiAgICB3aW5kb3cucGFyZW50LnBhcmVudC5sb2NhdGlvbi5ocmVmID0gdXJsO1xuICB9LFxuICBBcHBlbmRUaW1lU3RhbXBVcmw6IGZ1bmN0aW9uIEFwcGVuZFRpbWVTdGFtcFVybCh1cmwpIHtcbiAgICBpZiAodXJsLmluZGV4T2YoXCJ0aW1lc3RhbXBcIikgPiBcIjBcIikge1xuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG5cbiAgICB2YXIgZ2V0VGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICBpZiAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgIHVybCA9IHVybCArIFwiJnRpbWVzdGFtcD1cIiArIGdldFRpbWVzdGFtcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gdXJsICsgXCI/dGltZXN0YW1wPVwiICsgZ2V0VGltZXN0YW1wO1xuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG4gIH0sXG4gIEdldFVybFBhcmFWYWx1ZTogZnVuY3Rpb24gR2V0VXJsUGFyYVZhbHVlKHBhcmFOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuR2V0VXJsUGFyYVZhbHVlQnlTdHJpbmcocGFyYU5hbWUsIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICB9LFxuICBHZXRVcmxQYXJhVmFsdWVCeVN0cmluZzogZnVuY3Rpb24gR2V0VXJsUGFyYVZhbHVlQnlTdHJpbmcocGFyYU5hbWUsIHVybFN0cmluZykge1xuICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKFwiKF58JilcIiArIHBhcmFOYW1lICsgXCI9KFteJl0qKSgmfCQpXCIpO1xuICAgIHZhciByID0gdXJsU3RyaW5nLnN1YnN0cigxKS5tYXRjaChyZWcpO1xuICAgIGlmIChyICE9IG51bGwpIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoclsyXSk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH0sXG4gIENvcHlWYWx1ZUNsaXBib2FyZDogZnVuY3Rpb24gQ29weVZhbHVlQ2xpcGJvYXJkKHZhbHVlKSB7XG4gICAgdmFyIHRyYW5zZmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0pfQ29weVRyYW5zZmVyJyk7XG5cbiAgICBpZiAoIXRyYW5zZmVyKSB7XG4gICAgICB0cmFuc2ZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgICB0cmFuc2Zlci5pZCA9ICdKX0NvcHlUcmFuc2Zlcic7XG4gICAgICB0cmFuc2Zlci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICB0cmFuc2Zlci5zdHlsZS5sZWZ0ID0gJy05OTk5cHgnO1xuICAgICAgdHJhbnNmZXIuc3R5bGUudG9wID0gJy05OTk5cHgnO1xuICAgICAgdHJhbnNmZXIuc3R5bGUuekluZGV4ID0gOTk5OTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodHJhbnNmZXIpO1xuICAgIH1cblxuICAgIHRyYW5zZmVyLnZhbHVlID0gdmFsdWU7XG4gICAgdHJhbnNmZXIuZm9jdXMoKTtcbiAgICB0cmFuc2Zlci5zZWxlY3QoKTtcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICB9LFxuICBTZXRTeXN0ZW1GYXZpY29uOiBmdW5jdGlvbiBTZXRTeXN0ZW1GYXZpY29uKCkge1xuICAgIHZhciBsaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImxpbmtbcmVsKj0naWNvbiddXCIpIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICBsaW5rLnR5cGUgPSAnaW1hZ2UveC1pY29uJztcbiAgICBsaW5rLnJlbCA9ICdzaG9ydGN1dCBpY29uJztcbiAgICBsaW5rLmhyZWYgPSBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgJy9mYXZpY29uLmljbyc7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgfSxcbiAgU2V0U3lzdGVtVGl0bGU6IGZ1bmN0aW9uIFNldFN5c3RlbVRpdGxlKCkge1xuICAgIGRvY3VtZW50LnRpdGxlID0gSkJ1aWxkNERDWWFtbC5HZXRDbGllbnRTeXN0ZW1UaXRsZSgpO1xuICB9LFxuICBTZXRTeXN0ZW1DYXB0aW9uOiBmdW5jdGlvbiBTZXRTeXN0ZW1DYXB0aW9uKCkge1xuICAgICQoXCIjc3lzdGVtQ2FwdGlvblwiKS50ZXh0KEpCdWlsZDREQ1lhbWwuR2V0Q2xpZW50U3lzdGVtQ2FwdGlvbigpKTtcbiAgfSxcbiAgSXNGdW5jdGlvbjogZnVuY3Rpb24gSXNGdW5jdGlvbihmdW5jKSB7XG4gICAgaWYgKHR5cGVvZiBmdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBHZXRFbGVtQWxsQXR0cjogZnVuY3Rpb24gR2V0RWxlbUFsbEF0dHIoJGVsZW0pIHtcbiAgICB2YXIgYXR0cnMgPSB7fTtcbiAgICAkZWxlbS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICQuZWFjaCh0aGlzLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3BlY2lmaWVkKSB7XG4gICAgICAgICAgYXR0cnNbdGhpcy5uYW1lXSA9IHRoaXMudmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBhdHRycztcbiAgfSxcbiAgR2V0Vmlld09wZXJhdGlvbk5hbWU6IGZ1bmN0aW9uIEdldFZpZXdPcGVyYXRpb25OYW1lKCkge1xuICAgIHJldHVybiBcInZpZXdcIjtcbiAgfSxcbiAgSXNWaWV3T3BlcmF0aW9uOiBmdW5jdGlvbiBJc1ZpZXdPcGVyYXRpb24ob3BlcmF0aW9uVHlwZSkge1xuICAgIHJldHVybiBvcGVyYXRpb25UeXBlICYmIG9wZXJhdGlvblR5cGUgPT0gdGhpcy5HZXRWaWV3T3BlcmF0aW9uTmFtZSgpO1xuICB9LFxuICBHZXRBZGRPcGVyYXRpb25OYW1lOiBmdW5jdGlvbiBHZXRBZGRPcGVyYXRpb25OYW1lKCkge1xuICAgIHJldHVybiBcImFkZFwiO1xuICB9LFxuICBJc0FkZE9wZXJhdGlvbjogZnVuY3Rpb24gSXNBZGRPcGVyYXRpb24ob3BlcmF0aW9uVHlwZSkge1xuICAgIHJldHVybiBvcGVyYXRpb25UeXBlICYmIG9wZXJhdGlvblR5cGUgPT0gdGhpcy5HZXRBZGRPcGVyYXRpb25OYW1lKCk7XG4gIH0sXG4gIEdldFVwZGF0ZU9wZXJhdGlvbk5hbWU6IGZ1bmN0aW9uIEdldFVwZGF0ZU9wZXJhdGlvbk5hbWUoKSB7XG4gICAgcmV0dXJuIFwidXBkYXRlXCI7XG4gIH0sXG4gIElzVXBkYXRlT3BlcmF0aW9uOiBmdW5jdGlvbiBJc1VwZGF0ZU9wZXJhdGlvbihvcGVyYXRpb25UeXBlKSB7XG4gICAgcmV0dXJuIG9wZXJhdGlvblR5cGUgJiYgb3BlcmF0aW9uVHlwZSA9PSB0aGlzLkdldFVwZGF0ZU9wZXJhdGlvbk5hbWUoKTtcbiAgfSxcbiAgR2V0RGVsZXRlT3BlcmF0aW9uTmFtZTogZnVuY3Rpb24gR2V0RGVsZXRlT3BlcmF0aW9uTmFtZSgpIHtcbiAgICByZXR1cm4gXCJkZWxldGVcIjtcbiAgfSxcbiAgSXNEZWxldGVPcGVyYXRpb246IGZ1bmN0aW9uIElzRGVsZXRlT3BlcmF0aW9uKG9wZXJhdGlvblR5cGUpIHtcbiAgICByZXR1cm4gb3BlcmF0aW9uVHlwZSAmJiBvcGVyYXRpb25UeXBlID09IHRoaXMuR2V0RGVsZXRlT3BlcmF0aW9uTmFtZSgpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQnJvd3NlckluZm9VdGlsaXR5ID0ge1xuICBCcm93c2VyQXBwTmFtZTogZnVuY3Rpb24gQnJvd3NlckFwcE5hbWUoKSB7XG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkZpcmVmb3hcIikgPiAwKSB7XG4gICAgICByZXR1cm4gXCJGaXJlZm94XCI7XG4gICAgfSBlbHNlIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpID4gMCkge1xuICAgICAgcmV0dXJuIFwiSUVcIjtcbiAgICB9IGVsc2UgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkNocm9tZVwiKSA+IDApIHtcbiAgICAgIHJldHVybiBcIkNocm9tZVwiO1xuICAgIH1cbiAgfSxcbiAgSXNJRTogZnVuY3Rpb24gSXNJRSgpIHtcbiAgICBpZiAoISF3aW5kb3cuQWN0aXZlWE9iamVjdCB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3cpIHJldHVybiB0cnVlO2Vsc2UgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc0lFNjogZnVuY3Rpb24gSXNJRTYoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgNi4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRTc6IGZ1bmN0aW9uIElzSUU3KCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDcuMFwiKSA+IDA7XG4gIH0sXG4gIElzSUU4OiBmdW5jdGlvbiBJc0lFOCgpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA4LjBcIikgPiAwO1xuICB9LFxuICBJc0lFOFg2NDogZnVuY3Rpb24gSXNJRThYNjQoKSB7XG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOC4wXCIpID4gMCkge1xuICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIng2NFwiKSA+IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc0lFOTogZnVuY3Rpb24gSXNJRTkoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOS4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRTlYNjQ6IGZ1bmN0aW9uIElzSUU5WDY0KCkge1xuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDkuMFwiKSA+IDApIHtcbiAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJ4NjRcIikgPiAwO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgSXNJRTEwOiBmdW5jdGlvbiBJc0lFMTAoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgMTAuMFwiKSA+IDA7XG4gIH0sXG4gIElzSUUxMFg2NDogZnVuY3Rpb24gSXNJRTEwWDY0KCkge1xuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDEwLjBcIikgPiAwKSB7XG4gICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwieDY0XCIpID4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIElFRG9jdW1lbnRNb2RlOiBmdW5jdGlvbiBJRURvY3VtZW50TW9kZSgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xuICB9LFxuICBJc0lFOERvY3VtZW50TW9kZTogZnVuY3Rpb24gSXNJRThEb2N1bWVudE1vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuSUVEb2N1bWVudE1vZGUoKSA9PSA4O1xuICB9LFxuICBJc0ZpcmVmb3g6IGZ1bmN0aW9uIElzRmlyZWZveCgpIHtcbiAgICByZXR1cm4gdGhpcy5Ccm93c2VyQXBwTmFtZSgpID09IFwiRmlyZWZveFwiO1xuICB9LFxuICBJc0Nocm9tZTogZnVuY3Rpb24gSXNDaHJvbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuQnJvd3NlckFwcE5hbWUoKSA9PSBcIkNocm9tZVwiO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2FjaGVEYXRhVXRpbGl0eSA9IHt9OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ29va2llVXRpbGl0eSA9IHtcbiAgU2V0Q29va2llMURheTogZnVuY3Rpb24gU2V0Q29va2llMURheShuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBleHAgPSBuZXcgRGF0ZSgpO1xuICAgIGV4cC5zZXRUaW1lKGV4cC5nZXRUaW1lKCkgKyAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBlc2NhcGUodmFsdWUpICsgXCI7ZXhwaXJlcz1cIiArIGV4cC50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XG4gIH0sXG4gIFNldENvb2tpZTFNb250aDogZnVuY3Rpb24gU2V0Q29va2llMU1vbnRoKG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGV4cCA9IG5ldyBEYXRlKCk7XG4gICAgZXhwLnNldFRpbWUoZXhwLmdldFRpbWUoKSArIDMwICogMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgZXNjYXBlKHZhbHVlKSArIFwiO2V4cGlyZXM9XCIgKyBleHAudG9HTVRTdHJpbmcoKSArIFwiO3BhdGg9L1wiO1xuICB9LFxuICBTZXRDb29raWUxWWVhcjogZnVuY3Rpb24gU2V0Q29va2llMVllYXIobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgZXhwID0gbmV3IERhdGUoKTtcbiAgICBleHAuc2V0VGltZShleHAuZ2V0VGltZSgpICsgMzAgKiAyNCAqIDYwICogNjAgKiAzNjUgKiAxMDAwKTtcbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBlc2NhcGUodmFsdWUpICsgXCI7ZXhwaXJlcz1cIiArIGV4cC50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XG4gIH0sXG4gIEdldENvb2tpZTogZnVuY3Rpb24gR2V0Q29va2llKG5hbWUpIHtcbiAgICB2YXIgYXJyID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoXCIoXnwgKVwiICsgbmFtZSArIFwiPShbXjtdKikoO3wkKVwiKSk7XG4gICAgaWYgKGFyciAhPSBudWxsKSByZXR1cm4gdW5lc2NhcGUoYXJyWzJdKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgRGVsQ29va2llOiBmdW5jdGlvbiBEZWxDb29raWUobmFtZSkge1xuICAgIHZhciBleHAgPSBuZXcgRGF0ZSgpO1xuICAgIGV4cC5zZXRUaW1lKGV4cC5nZXRUaW1lKCkgLSAxKTtcbiAgICB2YXIgY3ZhbCA9IHRoaXMuZ2V0Q29va2llKG5hbWUpO1xuICAgIGlmIChjdmFsICE9IG51bGwpIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIGN2YWwgKyBcIjtleHBpcmVzPVwiICsgZXhwLnRvR01UU3RyaW5nKCkgKyBcIjtwYXRoPS9cIjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERhdGVVdGlsaXR5ID0ge1xuICBHZXRDdXJyZW50RGF0YVN0cmluZzogZnVuY3Rpb24gR2V0Q3VycmVudERhdGFTdHJpbmcoc3BsaXQpIHtcbiAgICBhbGVydChcIkRhdGVVdGlsaXR5LkdldEN1cnJlbnREYXRhU3RyaW5nIOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgRGF0ZUZvcm1hdDogZnVuY3Rpb24gRGF0ZUZvcm1hdChteURhdGUsIHNwbGl0KSB7XG4gICAgYWxlcnQoXCJEYXRlVXRpbGl0eS5HZXRDdXJyZW50RGF0YVN0cmluZyDlt7LlgZznlKhcIik7XG4gIH0sXG4gIENvbnZlcnRGcm9tU3RyaW5nOiBmdW5jdGlvbiBDb252ZXJ0RnJvbVN0cmluZyhkYXRlU3RyaW5nKSB7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRlU3RyaW5nKTtcbiAgICByZXR1cm4gZGF0ZTtcbiAgfSxcbiAgRm9ybWF0OiBmdW5jdGlvbiBGb3JtYXQobXlEYXRlLCBmb3JtYXRTdHJpbmcpIHtcbiAgICB2YXIgbyA9IHtcbiAgICAgIFwiTStcIjogbXlEYXRlLmdldE1vbnRoKCkgKyAxLFxuICAgICAgXCJkK1wiOiBteURhdGUuZ2V0RGF0ZSgpLFxuICAgICAgXCJoK1wiOiBteURhdGUuZ2V0SG91cnMoKSxcbiAgICAgIFwibStcIjogbXlEYXRlLmdldE1pbnV0ZXMoKSxcbiAgICAgIFwicytcIjogbXlEYXRlLmdldFNlY29uZHMoKSxcbiAgICAgIFwicStcIjogTWF0aC5mbG9vcigobXlEYXRlLmdldE1vbnRoKCkgKyAzKSAvIDMpLFxuICAgICAgXCJTXCI6IG15RGF0ZS5nZXRNaWxsaXNlY29uZHMoKVxuICAgIH07XG4gICAgaWYgKC8oeSspLy50ZXN0KGZvcm1hdFN0cmluZykpIGZvcm1hdFN0cmluZyA9IGZvcm1hdFN0cmluZy5yZXBsYWNlKFJlZ0V4cC4kMSwgKG15RGF0ZS5nZXRGdWxsWWVhcigpICsgXCJcIikuc3Vic3RyKDQgLSBSZWdFeHAuJDEubGVuZ3RoKSk7XG5cbiAgICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICAgIGlmIChuZXcgUmVnRXhwKFwiKFwiICsgayArIFwiKVwiKS50ZXN0KGZvcm1hdFN0cmluZykpIGZvcm1hdFN0cmluZyA9IGZvcm1hdFN0cmluZy5yZXBsYWNlKFJlZ0V4cC4kMSwgUmVnRXhwLiQxLmxlbmd0aCA9PSAxID8gb1trXSA6IChcIjAwXCIgKyBvW2tdKS5zdWJzdHIoKFwiXCIgKyBvW2tdKS5sZW5ndGgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9ybWF0U3RyaW5nO1xuICB9LFxuICBGb3JtYXRDdXJyZW50RGF0YTogZnVuY3Rpb24gRm9ybWF0Q3VycmVudERhdGEoZm9ybWF0U3RyaW5nKSB7XG4gICAgdmFyIG15RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIHRoaXMuRm9ybWF0KG15RGF0ZSwgZm9ybWF0U3RyaW5nKTtcbiAgfSxcbiAgR2V0Q3VycmVudERhdGE6IGZ1bmN0aW9uIEdldEN1cnJlbnREYXRhKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGV0YWlsUGFnZVV0aWxpdHkgPSB7XG4gIElWaWV3UGFnZVRvVmlld1N0YXR1czogZnVuY3Rpb24gSVZpZXdQYWdlVG9WaWV3U3RhdHVzKCkge1xuICAgIHJldHVybjtcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkKFwiaW5wdXRcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuaGlkZSgpO1xuICAgICAgICB2YXIgdmFsID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgJCh0aGlzKS5hZnRlcigkKFwiPGxhYmVsIC8+XCIpLnRleHQodmFsKSk7XG4gICAgICB9KTtcbiAgICAgICQoXCIuaXZ1LWRhdGUtcGlja2VyLWVkaXRvclwiKS5maW5kKFwiLml2dS1pY29uXCIpLmhpZGUoKTtcbiAgICAgICQoXCIuaXZ1LXJhZGlvXCIpLmhpZGUoKTtcbiAgICAgICQoXCIuaXZ1LXJhZGlvLWdyb3VwLWl0ZW1cIikuaGlkZSgpO1xuICAgICAgJChcIi5pdnUtcmFkaW8td3JhcHBlci1jaGVja2VkXCIpLnNob3coKTtcbiAgICAgICQoXCIuaXZ1LXJhZGlvLXdyYXBwZXItY2hlY2tlZFwiKS5maW5kKFwic3BhblwiKS5oaWRlKCk7XG4gICAgICAkKFwidGV4dGFyZWFcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuaGlkZSgpO1xuICAgICAgICB2YXIgdmFsID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgJCh0aGlzKS5hZnRlcigkKFwiPGxhYmVsIC8+XCIpLnRleHQodmFsKSk7XG4gICAgICB9KTtcbiAgICB9LCAxMDApO1xuICB9LFxuICBPdmVycmlkZU9iamVjdFZhbHVlOiBmdW5jdGlvbiBPdmVycmlkZU9iamVjdFZhbHVlKHNvdXJjZU9iamVjdCwgZGF0YU9iamVjdCkge1xuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2VPYmplY3QpIHtcbiAgICAgIGlmIChkYXRhT2JqZWN0W2tleV0gIT0gdW5kZWZpbmVkICYmIGRhdGFPYmplY3Rba2V5XSAhPSBudWxsICYmIGRhdGFPYmplY3Rba2V5XSAhPSBcIlwiKSB7XG4gICAgICAgIHNvdXJjZU9iamVjdFtrZXldID0gZGF0YU9iamVjdFtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgT3ZlcnJpZGVPYmplY3RWYWx1ZUZ1bGw6IGZ1bmN0aW9uIE92ZXJyaWRlT2JqZWN0VmFsdWVGdWxsKHNvdXJjZU9iamVjdCwgZGF0YU9iamVjdCkge1xuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2VPYmplY3QpIHtcbiAgICAgIHNvdXJjZU9iamVjdFtrZXldID0gZGF0YU9iamVjdFtrZXldO1xuICAgIH1cbiAgfSxcbiAgQmluZEZvcm1EYXRhOiBmdW5jdGlvbiBCaW5kRm9ybURhdGEoaW50ZXJmYWNlVXJsLCB2dWVGb3JtRGF0YSwgcmVjb3JkSWQsIG9wLCBiZWZGdW5jLCBhZkZ1bmMsIGNhbGxlcikge1xuICAgIEFqYXhVdGlsaXR5LlBvc3QoaW50ZXJmYWNlVXJsLCB7XG4gICAgICByZWNvcmRJZDogcmVjb3JkSWQsXG4gICAgICBvcDogb3BcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiZWZGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGJlZkZ1bmMocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIERldGFpbFBhZ2VVdGlsaXR5Lk92ZXJyaWRlT2JqZWN0VmFsdWUodnVlRm9ybURhdGEsIHJlc3VsdC5kYXRhKTtcblxuICAgICAgICBpZiAodHlwZW9mIGFmRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBhZkZ1bmMocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcCA9PSBcInZpZXdcIikge1xuICAgICAgICAgIERldGFpbFBhZ2VVdGlsaXR5LklWaWV3UGFnZVRvVmlld1N0YXR1cygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgfVxuICAgIH0sIGNhbGxlcik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbnZhciBEaWFsb2dVdGlsaXR5ID0ge1xuICBEaWFsb2dBbGVydElkOiBcIkRlZmF1bHREaWFsb2dBbGVydFV0aWxpdHkwMVwiLFxuICBEaWFsb2dBbGVydEVycm9ySWQ6IFwiRGVmYXVsdERpYWxvZ0FsZXJ0RXJyb3JVdGlsaXR5MDFcIixcbiAgRGlhbG9nUHJvbXB0SWQ6IFwiRGVmYXVsdERpYWxvZ1Byb21wdFV0aWxpdHkwMVwiLFxuICBEaWFsb2dMb2FkaW5nSWQ6IFwiRGVmYXVsdERpYWxvZ0xvYWRpbmcwMVwiLFxuICBEaWFsb2dJZDogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTAxXCIsXG4gIERpYWxvZ0lkMDI6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwMlwiLFxuICBEaWFsb2dJZDAzOiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDNcIixcbiAgRGlhbG9nSWQwNDogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTA0XCIsXG4gIERpYWxvZ0lkMDU6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwNVwiLFxuICBEaWFsb2dOZXdXaW5kb3dJZDogXCJEaWFsb2dOZXdXaW5kb3dJZDAxXCIsXG4gIF9HZXRFbGVtOiBmdW5jdGlvbiBfR2V0RWxlbShkaWFsb2dJZCkge1xuICAgIHJldHVybiAkKFwiI1wiICsgZGlhbG9nSWQpO1xuICB9LFxuICBfQ3JlYXRlRGlhbG9nRWxlbTogZnVuY3Rpb24gX0NyZWF0ZURpYWxvZ0VsZW0oZG9jT2JqLCBkaWFsb2dJZCkge1xuICAgIGlmICh0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKS5sZW5ndGggPT0gMCkge1xuICAgICAgdmFyIGRpYWxvZ0VsZSA9ICQoXCI8ZGl2IGlkPVwiICsgZGlhbG9nSWQgKyBcIiB0aXRsZT0n57O757uf5o+Q56S6JyBzdHlsZT0nZGlzcGxheTpub25lJz5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgICAgICQoZG9jT2JqLmJvZHkpLmFwcGVuZChkaWFsb2dFbGUpO1xuICAgICAgcmV0dXJuIGRpYWxvZ0VsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpO1xuICAgIH1cbiAgfSxcbiAgX0NyZWF0ZUFsZXJ0TG9hZGluZ01zZ0VsZW1lbnQ6IGZ1bmN0aW9uIF9DcmVhdGVBbGVydExvYWRpbmdNc2dFbGVtZW50KGRvY09iaiwgZGlhbG9nSWQpIHtcbiAgICBpZiAodGhpcy5fR2V0RWxlbShkaWFsb2dJZCkubGVuZ3RoID09IDApIHtcbiAgICAgIHZhciBkaWFsb2dFbGUgPSAkKFwiPGRpdiBpZD1cIiArIGRpYWxvZ0lkICsgXCIgdGl0bGU9J+ezu+e7n+aPkOekuicgc3R5bGU9J2Rpc3BsYXk6bm9uZSc+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J2FsZXJ0LWxvYWRpbmctaW1nJz48L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nYWxlcnQtbG9hZGluZy10eHQnPjwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgICAgICQoZG9jT2JqLmJvZHkpLmFwcGVuZChkaWFsb2dFbGUpO1xuICAgICAgcmV0dXJuIGRpYWxvZ0VsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpO1xuICAgIH1cbiAgfSxcbiAgX0NyZWF0ZUlmcmFtZURpYWxvZ0VsZW1lbnQ6IGZ1bmN0aW9uIF9DcmVhdGVJZnJhbWVEaWFsb2dFbGVtZW50KGRvY09iaiwgZGlhbG9nSWQsIHVybCkge1xuICAgIHZhciBkaWFsb2dFbGUgPSAkKFwiPGRpdiBpZD1cIiArIGRpYWxvZ0lkICsgXCIgdGl0bGU9J0Jhc2ljIGRpYWxvZyc+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlmcmFtZSBuYW1lPSdkaWFsb2dJZnJhbWUnIHdpZHRoPScxMDAlJyBoZWlnaHQ9Jzk4JScgZnJhbWVib3JkZXI9JzAnPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaWZyYW1lPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XCIpO1xuICAgICQoZG9jT2JqLmJvZHkpLmFwcGVuZChkaWFsb2dFbGUpO1xuICAgIHJldHVybiBkaWFsb2dFbGU7XG4gIH0sXG4gIF9UZXN0RGlhbG9nRWxlbUlzRXhpc3Q6IGZ1bmN0aW9uIF9UZXN0RGlhbG9nRWxlbUlzRXhpc3QoZGlhbG9nSWQpIHtcbiAgICBpZiAodGhpcy5fR2V0RWxlbShkaWFsb2dJZCkubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBfVGVzdFJ1bkVuYWJsZTogZnVuY3Rpb24gX1Rlc3RSdW5FbmFibGUoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIEFsZXJ0RXJyb3I6IGZ1bmN0aW9uIEFsZXJ0RXJyb3Iob3BlbmVyV2luZG93LCBkaWFsb2dJZCwgY29uZmlnLCBodG1sTXNnLCBzRnVuYywgdGltZUNsb3N1cmUpIHtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIGhlaWdodDogXCJhdXRvXCIsXG4gICAgICB3aWR0aDogXCJhdXRvXCIsXG4gICAgICB0aXRsZTogXCLplJnor6/mj5DnpLpcIlxuICAgIH07XG4gICAgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgIHRoaXMuQWxlcnQob3BlbmVyV2luZG93LCBkaWFsb2dJZCwgZGVmYXVsdENvbmZpZywgaHRtbE1zZywgc0Z1bmMsIHRpbWVDbG9zdXJlKTtcbiAgfSxcbiAgQWxlcnRUZXh0OiBmdW5jdGlvbiBBbGVydFRleHQodGV4dCwgY2FsbGVyLCB0aW1lQ2xvc3VyZSkge1xuICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCB0ZXh0LCBudWxsLCBjYWxsZXIsIHRpbWVDbG9zdXJlKTtcbiAgfSxcbiAgQWxlcnQ6IGZ1bmN0aW9uIEFsZXJ0KG9wZW5lcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbE1zZywgc0Z1bmMsIGNhbGxlciwgdGltZUNsb3N1cmUpIHtcbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVEaWFsb2dFbGVtKG9wZW5lcldpbmRvdy5kb2N1bWVudC5ib2R5LCBkaWFsb2dJZCk7XG5cbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIGhlaWdodDogMjAwLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIHRpdGxlOiBcIuezu+e7n+aPkOekulwiLFxuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgYnV0dG9uczoge1xuICAgICAgICBcIuWFs+mXrVwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgICQoaHRtbEVsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb3BlbjogZnVuY3Rpb24gb3BlbigpIHt9LFxuICAgICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgICBpZiAoc0Z1bmMpIHtcbiAgICAgICAgICBpZiAoY2FsbGVyKSB7XG4gICAgICAgICAgICBzRnVuYy5jYWxsKGNhbGxlcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNGdW5jKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGlkZToge1xuICAgICAgICBlZmZlY3Q6IFwiZmFkZVwiLFxuICAgICAgICBkdXJhdGlvbjogNTAwXG4gICAgICB9XG4gICAgfTtcbiAgICBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuaHRtbChodG1sTXNnKTtcbiAgICAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG5cbiAgICBpZiAodGltZUNsb3N1cmUpIHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhkaWFsb2dJZCk7XG4gICAgICB9LCAxMDAwICogdGltZUNsb3N1cmUpO1xuICAgIH1cbiAgfSxcbiAgQWxlcnRKc29uQ29kZTogZnVuY3Rpb24gQWxlcnRKc29uQ29kZShqc29uLCB0aW1lQ2xvc3VyZSkge1xuICAgIGlmIChfdHlwZW9mKGpzb24pID09IFwib2JqZWN0XCIpIHtcbiAgICAgIGpzb24gPSBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmdGb3JtYXQoanNvbik7XG4gICAgfVxuXG4gICAganNvbiA9IGpzb24ucmVwbGFjZSgvJi9nLCAnJicpLnJlcGxhY2UoLzwvZywgJzwnKS5yZXBsYWNlKC8+L2csICc+Jyk7XG4gICAganNvbiA9IGpzb24ucmVwbGFjZSgvKFwiKFxcXFx1W2EtekEtWjAtOV17NH18XFxcXFtedV18W15cXFxcXCJdKSpcIihcXHMqOik/fFxcYih0cnVlfGZhbHNlfG51bGwpXFxifC0/XFxkKyg/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/KS9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgIHZhciBjbHMgPSAnanNvbi1udW1iZXInO1xuXG4gICAgICBpZiAoL15cIi8udGVzdChtYXRjaCkpIHtcbiAgICAgICAgaWYgKC86JC8udGVzdChtYXRjaCkpIHtcbiAgICAgICAgICBjbHMgPSAnanNvbi1rZXknO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNscyA9ICdqc29uLXN0cmluZyc7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoL3RydWV8ZmFsc2UvLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgIGNscyA9ICdqc29uLWJvb2xlYW4nO1xuICAgICAgfSBlbHNlIGlmICgvbnVsbC8udGVzdChtYXRjaCkpIHtcbiAgICAgICAgY2xzID0gJ2pzb24tbnVsbCc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCInICsgY2xzICsgJ1wiPicgKyBtYXRjaCArICc8L3NwYW4+JztcbiAgICB9KTtcblxuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0od2luZG93LmRvY3VtZW50LmJvZHksIHRoaXMuRGlhbG9nQWxlcnRJZCk7XG5cbiAgICB2YXIgdGl0bGUgPSBcIuezu+e7n+aPkOekulwiO1xuXG4gICAgaWYgKHRpbWVDbG9zdXJlKSB7XG4gICAgICB0aXRsZSArPSBcIiBbIFwiICsgdGltZUNsb3N1cmUgKyBcIuenkuWQjuiHquWKqOWFs+mXrSBdXCI7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgIHdpZHRoOiA5MDAsXG4gICAgICB0aXRsZTogdGl0bGUsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIFwi5YWz6ZetXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgIH0sXG4gICAgICAgIFwi5aSN5Yi25bm25YWz6ZetXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgICAgQmFzZVV0aWxpdHkuQ29weVZhbHVlQ2xpcGJvYXJkKCQoXCIuanNvbi1wcmVcIikudGV4dCgpKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9wZW46IGZ1bmN0aW9uIG9wZW4oKSB7fSxcbiAgICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZSgpIHt9LFxuICAgICAgaGlkZToge1xuICAgICAgICBlZmZlY3Q6IFwiZmFkZVwiLFxuICAgICAgICBkdXJhdGlvbjogNTAwXG4gICAgICB9XG4gICAgfTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKFwiPGRpdiBpZD0ncHNjb250YWluZXInIHN0eWxlPSd3aWR0aDogMTAwJTtoZWlnaHQ6IDEwMCU7b3ZlcmZsb3c6IGF1dG87cG9zaXRpb246IHJlbGF0aXZlOyc+PHByZSBjbGFzcz0nanNvbi1wcmUnPlwiICsganNvbiArIFwiPC9wcmU+PC9kaXY+XCIpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcblxuICAgIGlmICh0aW1lQ2xvc3VyZSkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCk7XG4gICAgICB9LCAxMDAwICogdGltZUNsb3N1cmUpO1xuICAgIH1cblxuICAgIHZhciBwcyA9IG5ldyBQZXJmZWN0U2Nyb2xsYmFyKCcjcHNjb250YWluZXInKTtcbiAgfSxcbiAgU2hvd0hUTUw6IGZ1bmN0aW9uIFNob3dIVE1MKG9wZW5lcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbE1zZywgY2xvc2VfYWZ0ZXJfZXZlbnQsIHBhcmFtcykge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlbmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjbG9zZV9hZnRlcl9ldmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNsb3NlX2FmdGVyX2V2ZW50KHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxNc2cpO1xuICAgIHJldHVybiAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gIH0sXG4gIEFsZXJ0TG9hZGluZzogZnVuY3Rpb24gQWxlcnRMb2FkaW5nKG9wZW5lcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbE1zZykge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZUFsZXJ0TG9hZGluZ01zZ0VsZW1lbnQob3BlbmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAxNDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWVcbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuZmluZChcIi5hbGVydC1sb2FkaW5nLXR4dFwiKS5odG1sKGh0bWxNc2cpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcbiAgfSxcbiAgQ29uZmlybTogZnVuY3Rpb24gQ29uZmlybShvcGVuZXJXaW5kb3csIGh0bWxNc2csIG9rRm4sIGNhbGxlcikge1xuICAgIHRoaXMuQ29uZmlybUNvbmZpZyhvcGVuZXJXaW5kb3csIGh0bWxNc2csIG51bGwsIG9rRm4sIGNhbGxlcik7XG4gIH0sXG4gIENvbmZpcm1Db25maWc6IGZ1bmN0aW9uIENvbmZpcm1Db25maWcob3BlbmVyV2luZG93LCBodG1sTXNnLCBjb25maWcsIG9rRm4sIGNhbGxlcikge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlbmVyV2luZG93LmRvY3VtZW50LmJvZHksIFwiQWxlcnRDb25maXJtTXNnXCIpO1xuXG4gICAgdmFyIHBhcmFzID0gbnVsbDtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIG9rZnVuYzogZnVuY3Rpb24gb2tmdW5jKHBhcmFzKSB7XG4gICAgICAgIGlmIChva0ZuICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChjYWxsZXIpIHtcbiAgICAgICAgICAgIG9rRm4uY2FsbChjYWxsZXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gb2tGbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVuZXJXaW5kb3cuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNhbmNlbGZ1bmM6IGZ1bmN0aW9uIGNhbmNlbGZ1bmMocGFyYXMpIHt9LFxuICAgICAgdmFsaWRhdGVmdW5jOiBmdW5jdGlvbiB2YWxpZGF0ZWZ1bmMocGFyYXMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgY2xvc2VhZnRlcmZ1bmM6IHRydWUsXG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLnoa7orqRcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdENvbmZpZy52YWxpZGF0ZWZ1bmMocGFyYXMpKSB7XG4gICAgICAgICAgICB2YXIgciA9IGRlZmF1bHRDb25maWcub2tmdW5jKHBhcmFzKTtcbiAgICAgICAgICAgIHIgPSByID09IG51bGwgPyB0cnVlIDogcjtcblxuICAgICAgICAgICAgaWYgKHIgJiYgZGVmYXVsdENvbmZpZy5jbG9zZWFmdGVyZnVuYykge1xuICAgICAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwi5Y+W5raIXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgZGVmYXVsdENvbmZpZy5jYW5jZWxmdW5jKHBhcmFzKTtcblxuICAgICAgICAgIGlmIChkZWZhdWx0Q29uZmlnLmNsb3NlYWZ0ZXJmdW5jKSB7XG4gICAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuaHRtbChodG1sTXNnKTtcbiAgICAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gICAgcGFyYXMgPSB7XG4gICAgICBcIkVsZW1lbnRPYmpcIjogaHRtbEVsZW1cbiAgICB9O1xuICB9LFxuICBQcm9tcHQ6IGZ1bmN0aW9uIFByb21wdChvcGVuZXJXaW5kb3csIGNvbmZpZywgZGlhbG9nSWQsIGxhYmVsTXNnLCBva0Z1bmMpIHtcbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVEaWFsb2dFbGVtKG9wZW5lcldpbmRvdy5kb2N1bWVudC5ib2R5LCBkaWFsb2dJZCk7XG5cbiAgICB2YXIgcGFyYXMgPSBudWxsO1xuICAgIHZhciB0ZXh0QXJlYSA9ICQoXCI8dGV4dGFyZWEgLz5cIik7XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCJcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLnoa7orqRcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIG9rRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHZhciBpbnB1dFRleHQgPSB0ZXh0QXJlYS52YWwoKTtcbiAgICAgICAgICAgIG9rRnVuYyhpbnB1dFRleHQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQoaHRtbEVsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICB9LFxuICAgICAgICBcIuWPlua2iFwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgICQoaHRtbEVsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgICQodGV4dEFyZWEpLmNzcyhcImhlaWdodFwiLCBkZWZhdWx0Q29uZmlnLmhlaWdodCAtIDEzMCkuY3NzKFwid2lkdGhcIiwgXCIxMDAlXCIpO1xuICAgIHZhciBodG1sQ29udGVudCA9ICQoXCI8ZGl2PjxkaXYgc3R5bGU9J3dpZHRoOiAxMDAlJz5cIiArIGxhYmVsTXNnICsgXCLvvJo8L2Rpdj48L2Rpdj5cIikuYXBwZW5kKHRleHRBcmVhKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxDb250ZW50KTtcbiAgICAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gIH0sXG4gIERpYWxvZ0VsZW06IGZ1bmN0aW9uIERpYWxvZ0VsZW0oZWxlbUlkLCBjb25maWcpIHtcbiAgICAkKFwiI1wiICsgZWxlbUlkKS5kaWFsb2coY29uZmlnKTtcbiAgfSxcbiAgRGlhbG9nRWxlbU9iajogZnVuY3Rpb24gRGlhbG9nRWxlbU9iaihlbGVtT2JqLCBjb25maWcpIHtcbiAgICAkKGVsZW1PYmopLmRpYWxvZyhjb25maWcpO1xuICB9LFxuICBPcGVuSWZyYW1lV2luZG93OiBmdW5jdGlvbiBPcGVuSWZyYW1lV2luZG93KG9wZW5lcndpbmRvdywgZGlhbG9nSWQsIHVybCwgb3B0aW9ucywgd2h0eXBlKSB7XG4gICAgdmFyIGRlZmF1bHRvcHRpb25zID0ge1xuICAgICAgaGVpZ2h0OiA0MTAsXG4gICAgICB3aWR0aDogNjAwLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICB0aXRsZTogXCLns7vnu59cIixcbiAgICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZShldmVudCwgdWkpIHtcbiAgICAgICAgdmFyIGF1dG9kaWFsb2dJZCA9ICQodGhpcykuYXR0cihcImlkXCIpO1xuICAgICAgICAkKHRoaXMpLmZpbmQoXCJpZnJhbWVcIikucmVtb3ZlKCk7XG4gICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAkKHRoaXMpLmRpYWxvZyhcImRlc3Ryb3lcIik7XG4gICAgICAgICQoXCIjXCIgKyBhdXRvZGlhbG9nSWQpLnJlbW92ZSgpO1xuXG4gICAgICAgIGlmIChCcm93c2VySW5mb1V0aWxpdHkuSXNJRThEb2N1bWVudE1vZGUoKSkge1xuICAgICAgICAgIENvbGxlY3RHYXJiYWdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2xvc2VfYWZ0ZXJfZXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgb3B0aW9ucy5jbG9zZV9hZnRlcl9ldmVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoJChcIiNGb3Jmb2N1c1wiKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkKFwiI0ZvcmZvY3VzXCIpWzBdLmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAod2h0eXBlID09IDEpIHtcbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgIGhlaWdodDogNjgwLFxuICAgICAgICB3aWR0aDogOTgwXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSAyKSB7XG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgd2lkdGg6IDgwMFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gNCkge1xuICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgaGVpZ2h0OiAzODAsXG4gICAgICAgIHdpZHRoOiA0ODBcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDUpIHtcbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgIGhlaWdodDogMTgwLFxuICAgICAgICB3aWR0aDogMzAwXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy53aWR0aCA9PSAwKSB7XG4gICAgICBvcHRpb25zLndpZHRoID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKSAtIDIwO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmhlaWdodCA9PSAwKSB7XG4gICAgICBvcHRpb25zLmhlaWdodCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIC0gMTA7XG4gICAgfVxuXG4gICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHZhciBhdXRvZGlhbG9nSWQgPSBkaWFsb2dJZDtcblxuICAgIHZhciBkaWFsb2dFbGUgPSB0aGlzLl9DcmVhdGVJZnJhbWVEaWFsb2dFbGVtZW50KG9wZW5lcndpbmRvdy5kb2N1bWVudCwgYXV0b2RpYWxvZ0lkLCB1cmwpO1xuXG4gICAgdmFyIGRpYWxvZ09iaiA9ICQoZGlhbG9nRWxlKS5kaWFsb2coZGVmYXVsdG9wdGlvbnMpO1xuICAgIHZhciAkaWZyYW1lb2JqID0gJChkaWFsb2dFbGUpLmZpbmQoXCJpZnJhbWVcIik7XG4gICAgJGlmcmFtZW9iai5vbihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKFN0cmluZ1V0aWxpdHkuSXNTYW1lRG9tYWluKHdpbmRvdy5sb2NhdGlvbi5ocmVmLCB1cmwpKSB7XG4gICAgICAgIHRoaXMuY29udGVudFdpbmRvdy5GcmFtZVdpbmRvd0lkID0gYXV0b2RpYWxvZ0lkO1xuICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuT3BlbmVyV2luZG93T2JqID0gb3BlbmVyd2luZG93O1xuICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuSXNPcGVuRm9yRnJhbWUgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCLot6jln59JZnJhbWUs5peg5rOV6K6+572u5bGe5oCnIVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAkaWZyYW1lb2JqLmF0dHIoXCJzcmNcIiwgdXJsKTtcbiAgICByZXR1cm4gZGlhbG9nT2JqO1xuICB9LFxuICBDbG9zZU9wZW5JZnJhbWVXaW5kb3c6IGZ1bmN0aW9uIENsb3NlT3BlbklmcmFtZVdpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkKSB7XG4gICAgb3BlbmVyd2luZG93Lk9wZW5lcldpbmRvd09iai5EaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKGRpYWxvZ0lkKTtcbiAgfSxcbiAgQ2xvc2VEaWFsb2dFbGVtOiBmdW5jdGlvbiBDbG9zZURpYWxvZ0VsZW0oZGlhbG9nRWxlbSkge1xuICAgICQoZGlhbG9nRWxlbSkuZmluZChcImlmcmFtZVwiKS5yZW1vdmUoKTtcbiAgICAkKGRpYWxvZ0VsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICgkKFwiI0ZvcmZvY3VzXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJChcIiNGb3Jmb2N1c1wiKVswXS5mb2N1cygpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH0sXG4gIENsb3NlRGlhbG9nOiBmdW5jdGlvbiBDbG9zZURpYWxvZyhkaWFsb2dJZCkge1xuICAgIHRoaXMuQ2xvc2VEaWFsb2dFbGVtKHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpKTtcbiAgfSxcbiAgT3Blbk5ld1dpbmRvdzogZnVuY3Rpb24gT3Blbk5ld1dpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSkge1xuICAgIHZhciB3aWR0aCA9IDA7XG4gICAgdmFyIGhlaWdodCA9IDA7XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgd2lkdGggPSBvcHRpb25zLndpZHRoO1xuICAgICAgaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XG4gICAgfVxuXG4gICAgdmFyIGxlZnQgPSBwYXJzZUludCgoc2NyZWVuLmF2YWlsV2lkdGggLSB3aWR0aCkgLyAyKS50b1N0cmluZygpO1xuICAgIHZhciB0b3AgPSBwYXJzZUludCgoc2NyZWVuLmF2YWlsSGVpZ2h0IC0gaGVpZ2h0KSAvIDIpLnRvU3RyaW5nKCk7XG5cbiAgICBpZiAod2lkdGgudG9TdHJpbmcoKSA9PSBcIjBcIiAmJiBoZWlnaHQudG9TdHJpbmcoKSA9PSBcIjBcIikge1xuICAgICAgd2lkdGggPSB3aW5kb3cuc2NyZWVuLmF2YWlsV2lkdGggLSAzMDtcbiAgICAgIGhlaWdodCA9IHdpbmRvdy5zY3JlZW4uYXZhaWxIZWlnaHQgLSA2MDtcbiAgICAgIGxlZnQgPSBcIjBcIjtcbiAgICAgIHRvcCA9IFwiMFwiO1xuICAgIH1cblxuICAgIHZhciB3aW5IYW5kbGUgPSB3aW5kb3cub3Blbih1cmwsIFwiXCIsIFwic2Nyb2xsYmFycz1ubyx0b29sYmFyPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPXllcyxjZW50ZXI9eWVzLGhlbHA9bm8sIHN0YXR1cz15ZXMsdG9wPSBcIiArIHRvcCArIFwicHgsbGVmdD1cIiArIGxlZnQgKyBcInB4LHdpZHRoPVwiICsgd2lkdGggKyBcInB4LGhlaWdodD1cIiArIGhlaWdodCArIFwicHhcIik7XG5cbiAgICBpZiAod2luSGFuZGxlID09IG51bGwpIHtcbiAgICAgIGFsZXJ0KFwi6K+36Kej6Zmk5rWP6KeI5Zmo5a+55pys57O757uf5by55Ye656qX5Y+j55qE6Zi75q2i6K6+572u77yBXCIpO1xuICAgIH1cbiAgfSxcbiAgT3Blbk5ld1RhYldpbmRvdzogZnVuY3Rpb24gT3Blbk5ld1RhYldpbmRvdyh1cmwpIHtcbiAgICB2YXIgbGluayA9ICQoXCI8YSBocmVmPSdcIiArIHVybCArIFwiJyBzdHlsZT0ncG9zaXRpb246YWJzb2x1dGU7dG9wOiAtMTAwcHg7d2lkdGg6IDBweDtoZWlnaHQ6IDBweCcgdGFyZ2V0PSdfYmxhbmsnPjwvYT5cIik7XG4gICAgJCh3aW5kb3cuZG9jdW1lbnQuYm9keSkuYXBwZW5kKGxpbmspO1xuICAgIGxpbmtbMF0uY2xpY2soKTtcbiAgfSxcbiAgX1RyeUdldFBhcmVudFdpbmRvdzogZnVuY3Rpb24gX1RyeUdldFBhcmVudFdpbmRvdyh3aW4pIHtcbiAgICBpZiAod2luLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gd2luLnBhcmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgX0ZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqOiBmdW5jdGlvbiBfRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmood2luLCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKSB7XG4gICAgaWYgKHRyeWZpbmR0aW1lID4gY3VycmVudHRyeWZpbmR0aW1lKSB7XG4gICAgICB2YXIgaXN0b3BGcmFtZXBhZ2UgPSBmYWxzZTtcbiAgICAgIGN1cnJlbnR0cnlmaW5kdGltZSsrO1xuXG4gICAgICB0cnkge1xuICAgICAgICBpc3RvcEZyYW1lcGFnZSA9IHdpbi5Jc1RvcEZyYW1lUGFnZTtcblxuICAgICAgICBpZiAoaXN0b3BGcmFtZXBhZ2UpIHtcbiAgICAgICAgICByZXR1cm4gd2luO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaih0aGlzLl9UcnlHZXRQYXJlbnRXaW5kb3cod2luKSwgdHJ5ZmluZHRpbWUsIGN1cnJlbnR0cnlmaW5kdGltZSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0ZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqKHRoaXMuX1RyeUdldFBhcmVudFdpbmRvdyh3aW4pLCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgX09wZW5XaW5kb3dJbkZyYW1lUGFnZTogZnVuY3Rpb24gX09wZW5XaW5kb3dJbkZyYW1lUGFnZShvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSkge1xuICAgIGlmIChTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkoZGlhbG9nSWQpKSB7XG4gICAgICBhbGVydChcImRpYWxvZ0lk5LiN6IO95Li656m6XCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHVybCA9IEJhc2VVdGlsaXR5LkFwcGVuZFRpbWVTdGFtcFVybCh1cmwpO1xuICAgIHZhciBhdXRvZGlhbG9nSWQgPSBcIkZyYW1lRGlhbG9nRWxlXCIgKyBkaWFsb2dJZDtcblxuICAgIGlmICgkKHRoaXMuRnJhbWVQYWdlUmVmLmRvY3VtZW50KS5maW5kKFwiI1wiICsgYXV0b2RpYWxvZ0lkKS5sZW5ndGggPT0gMCkge1xuICAgICAgdmFyIGRpYWxvZ0VsZSA9IHRoaXMuX0NyZWF0ZUlmcmFtZURpYWxvZ0VsZW1lbnQodGhpcy5GcmFtZVBhZ2VSZWYuZG9jdW1lbnQsIGF1dG9kaWFsb2dJZCwgdXJsKTtcblxuICAgICAgdmFyIGRlZmF1bHRvcHRpb25zID0ge1xuICAgICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgICAgd2lkdGg6IDYwMCxcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHRpdGxlOiBcIuezu+e7n1wiLFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgdmFyIGF1dG9kaWFsb2dJZCA9ICQodGhpcykuYXR0cihcImlkXCIpO1xuICAgICAgICAgICQodGhpcykuZmluZChcImlmcmFtZVwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAkKHRoaXMpLmRpYWxvZyhcImRlc3Ryb3lcIik7XG4gICAgICAgICAgJChcIiNcIiArIGF1dG9kaWFsb2dJZCkucmVtb3ZlKCk7XG5cbiAgICAgICAgICBpZiAoQnJvd3NlckluZm9VdGlsaXR5LklzSUU4RG9jdW1lbnRNb2RlKCkpIHtcbiAgICAgICAgICAgIENvbGxlY3RHYXJiYWdlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNsb3NlX2FmdGVyX2V2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgb3B0aW9ucy5jbG9zZV9hZnRlcl9ldmVudCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKHdodHlwZSA9PSAwKSB7XG4gICAgICAgIG9wdGlvbnMud2lkdGggPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VXaWR0aCgpIC0gMjA7XG4gICAgICAgIG9wdGlvbnMuaGVpZ2h0ID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgLSAxODA7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSAxKSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiA2MTAsXG4gICAgICAgICAgd2lkdGg6IDk4MFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDIpIHtcbiAgICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgICB3aWR0aDogODAwXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gNCkge1xuICAgICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICAgIGhlaWdodDogMzgwLFxuICAgICAgICAgIHdpZHRoOiA0ODBcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSA1KSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiAxODAsXG4gICAgICAgICAgd2lkdGg6IDMwMFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMud2lkdGggPT0gMCkge1xuICAgICAgICBvcHRpb25zLndpZHRoID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKSAtIDIwO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5oZWlnaHQgPT0gMCkge1xuICAgICAgICBvcHRpb25zLmhlaWdodCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIC0gMTgwO1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAkKGRpYWxvZ0VsZSkuZGlhbG9nKGRlZmF1bHRvcHRpb25zKTtcbiAgICAgICQoXCIudWktd2lkZ2V0LW92ZXJsYXlcIikuY3NzKFwiekluZGV4XCIsIFwiMjAwMFwiKTtcbiAgICAgICQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCBcIjIwMDFcIik7XG4gICAgICB2YXIgJGlmcmFtZW9iaiA9ICQoZGlhbG9nRWxlKS5maW5kKFwiaWZyYW1lXCIpO1xuICAgICAgJGlmcmFtZW9iai5vbihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoU3RyaW5nVXRpbGl0eS5Jc1NhbWVEb21haW4od2luZG93LmxvY2F0aW9uLmhyZWYsIHVybCkpIHtcbiAgICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuRnJhbWVXaW5kb3dJZCA9IGF1dG9kaWFsb2dJZDtcbiAgICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuT3BlbmVyV2luZG93T2JqID0gb3BlbmVyd2luZG93O1xuICAgICAgICAgIHRoaXMuY29udGVudFdpbmRvdy5Jc09wZW5Gb3JGcmFtZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCLot6jln59JZnJhbWUs5peg5rOV6K6+572u5bGe5oCnIVwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAkaWZyYW1lb2JqLmF0dHIoXCJzcmNcIiwgdXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJChcIiNcIiArIGF1dG9kaWFsb2dJZCkuZGlhbG9nKFwibW92ZVRvVG9wXCIpO1xuICAgIH1cbiAgfSxcbiAgX0ZyYW1lX0ZyYW1lUGFnZUNsb3NlRGlhbG9nOiBmdW5jdGlvbiBfRnJhbWVfRnJhbWVQYWdlQ2xvc2VEaWFsb2coZGlhbG9nSWQpIHtcbiAgICAkKFwiI1wiICsgZGlhbG9nSWQpLmRpYWxvZyhcImNsb3NlXCIpO1xuICB9LFxuICBGcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iajogZnVuY3Rpb24gRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmooKSB7XG4gICAgdmFyIHRyeWZpbmR0aW1lID0gNTtcbiAgICB2YXIgY3VycmVudHRyeWZpbmR0aW1lID0gMTtcbiAgICByZXR1cm4gdGhpcy5fRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmood2luZG93LCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKTtcbiAgfSxcbiAgRnJhbWVfQWxlcnQ6IGZ1bmN0aW9uIEZyYW1lX0FsZXJ0KCkge30sXG4gIEZyYW1lX0NvbmZpcm06IGZ1bmN0aW9uIEZyYW1lX0NvbmZpcm0oKSB7fSxcbiAgRnJhbWVfT3BlbklmcmFtZVdpbmRvdzogZnVuY3Rpb24gRnJhbWVfT3BlbklmcmFtZVdpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSwgbm90RnJhbWVPcGVuSW5DdXJyKSB7XG4gICAgaWYgKHVybCA9PSBcIlwiKSB7XG4gICAgICBhbGVydChcInVybOS4jeiDveS4uuepuuWtl+espuS4siFcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFub3RGcmFtZU9wZW5JbkN1cnIpIHtcbiAgICAgIG5vdEZyYW1lT3BlbkluQ3VyciA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciB3cndpbiA9IHRoaXMuRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmooKTtcbiAgICB0aGlzLkZyYW1lUGFnZVJlZiA9IHdyd2luO1xuXG4gICAgaWYgKHdyd2luICE9IG51bGwpIHtcbiAgICAgIHRoaXMuRnJhbWVQYWdlUmVmLkRpYWxvZ1V0aWxpdHkuRnJhbWVQYWdlUmVmID0gd3J3aW47XG5cbiAgICAgIHRoaXMuRnJhbWVQYWdlUmVmLkRpYWxvZ1V0aWxpdHkuX09wZW5XaW5kb3dJbkZyYW1lUGFnZShvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChub3RGcmFtZU9wZW5JbkN1cnIpIHtcbiAgICAgICAgdGhpcy5PcGVuSWZyYW1lV2luZG93KG9wZW5lcndpbmRvdywgZGlhbG9nSWQsIHVybCwgb3B0aW9ucywgd2h0eXBlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwi5om+5LiN5YiwRnJhbWVQYWdlISFcIik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBGcmFtZV9DbG9zZURpYWxvZzogZnVuY3Rpb24gRnJhbWVfQ2xvc2VEaWFsb2cob3BlbmVyV2luZG93KSB7XG4gICAgdmFyIHdyd2luID0gdGhpcy5GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaigpO1xuICAgIHZhciBvcGVuZXJ3aW4gPSBvcGVuZXJXaW5kb3cuT3BlbmVyV2luZG93T2JqO1xuICAgIHZhciBhdXRvZGlhbG9nSWQgPSBvcGVuZXJXaW5kb3cuRnJhbWVXaW5kb3dJZDtcblxuICAgIHdyd2luLkRpYWxvZ1V0aWxpdHkuX0ZyYW1lX0ZyYW1lUGFnZUNsb3NlRGlhbG9nKGF1dG9kaWFsb2dJZCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEaWN0aW9uYXJ5VXRpbGl0eSA9IHtcbiAgX0dyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbjogbnVsbCxcbiAgR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uOiBmdW5jdGlvbiBHcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb24oc291cmNlRGljdGlvbmFyeUpzb24pIHtcbiAgICBpZiAodGhpcy5fR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uID09IG51bGwpIHtcbiAgICAgIGlmIChzb3VyY2VEaWN0aW9uYXJ5SnNvbiAhPSBudWxsKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBncm91cFZhbHVlIGluIHNvdXJjZURpY3Rpb25hcnlKc29uKSB7XG4gICAgICAgICAgcmVzdWx0W2dyb3VwVmFsdWVdID0ge307XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHRbZ3JvdXBWYWx1ZV1bc291cmNlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV1baV0uZGljdFZhbHVlXSA9IHNvdXJjZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdW2ldLmRpY3RUZXh0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX0dyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbiA9IHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgY29uc29sZSA9IGNvbnNvbGUgfHwge1xuICBsb2c6IGZ1bmN0aW9uIGxvZygpIHt9LFxuICB3YXJuOiBmdW5jdGlvbiB3YXJuKCkge30sXG4gIGVycm9yOiBmdW5jdGlvbiBlcnJvcigpIHt9XG59O1xuXG5mdW5jdGlvbiBEYXRlRXh0ZW5kX0RhdGVGb3JtYXQoZGF0ZSwgZm10KSB7XG4gIGlmIChudWxsID09IGRhdGUgfHwgdW5kZWZpbmVkID09IGRhdGUpIHJldHVybiAnJztcbiAgdmFyIG8gPSB7XG4gICAgXCJNK1wiOiBkYXRlLmdldE1vbnRoKCkgKyAxLFxuICAgIFwiZCtcIjogZGF0ZS5nZXREYXRlKCksXG4gICAgXCJoK1wiOiBkYXRlLmdldEhvdXJzKCksXG4gICAgXCJtK1wiOiBkYXRlLmdldE1pbnV0ZXMoKSxcbiAgICBcInMrXCI6IGRhdGUuZ2V0U2Vjb25kcygpLFxuICAgIFwiU1wiOiBkYXRlLmdldE1pbGxpc2Vjb25kcygpXG4gIH07XG4gIGlmICgvKHkrKS8udGVzdChmbXQpKSBmbXQgPSBmbXQucmVwbGFjZShSZWdFeHAuJDEsIChkYXRlLmdldEZ1bGxZZWFyKCkgKyBcIlwiKS5zdWJzdHIoNCAtIFJlZ0V4cC4kMS5sZW5ndGgpKTtcblxuICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICBpZiAobmV3IFJlZ0V4cChcIihcIiArIGsgKyBcIilcIikudGVzdChmbXQpKSBmbXQgPSBmbXQucmVwbGFjZShSZWdFeHAuJDEsIFJlZ0V4cC4kMS5sZW5ndGggPT0gMSA/IG9ba10gOiAoXCIwMFwiICsgb1trXSkuc3Vic3RyKChcIlwiICsgb1trXSkubGVuZ3RoKSk7XG4gIH1cblxuICByZXR1cm4gZm10O1xufVxuXG5EYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBEYXRlRXh0ZW5kX0RhdGVGb3JtYXQodGhpcywgJ3l5eXktTU0tZGQgbW06aGg6c3MnKTtcbn07XG5cbmlmICghT2JqZWN0LmNyZWF0ZSkge1xuICBPYmplY3QuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIGFsZXJ0KFwiRXh0ZW5kIE9iamVjdC5jcmVhdGVcIik7XG5cbiAgICBmdW5jdGlvbiBGKCkge31cblxuICAgIHJldHVybiBmdW5jdGlvbiAobykge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPYmplY3QuY3JlYXRlIGltcGxlbWVudGF0aW9uIG9ubHkgYWNjZXB0cyBvbmUgcGFyYW1ldGVyLicpO1xuICAgICAgfVxuXG4gICAgICBGLnByb3RvdHlwZSA9IG87XG4gICAgICByZXR1cm4gbmV3IEYoKTtcbiAgICB9O1xuICB9KCk7XG59XG5cbiQuZm4ub3V0ZXJIVE1MID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gIXRoaXMubGVuZ3RoID8gdGhpcyA6IHRoaXNbMF0ub3V0ZXJIVE1MIHx8IGZ1bmN0aW9uIChlbCkge1xuICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZWwuY2xvbmVOb2RlKHRydWUpKTtcbiAgICB2YXIgY29udGVudHMgPSBkaXYuaW5uZXJIVE1MO1xuICAgIGRpdiA9IG51bGw7XG4gICAgYWxlcnQoY29udGVudHMpO1xuICAgIHJldHVybiBjb250ZW50cztcbiAgfSh0aGlzWzBdKTtcbn07XG5cbmZ1bmN0aW9uIHJlZkNzc0xpbmsoaHJlZikge1xuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgc3R5bGUucmVsID0gJ3N0eWxlc2hlZXQnO1xuICBzdHlsZS5ocmVmID0gaHJlZjtcbiAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIHJldHVybiBzdHlsZS5zaGVldCB8fCBzdHlsZS5zdHlsZVNoZWV0O1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgSkJ1aWxkNERDWWFtbCA9IHtcbiAgX2NsaWVudENsaWVudFN5c3RlbVRpdGxlOiBudWxsLFxuICBfY2xpZW50Q2xpZW50U3lzdGVtQ2FwdGlvbjogbnVsbCxcbiAgR2V0Q2xpZW50U3lzdGVtVGl0bGU6IGZ1bmN0aW9uIEdldENsaWVudFN5c3RlbVRpdGxlKCkge1xuICAgIHZhciBzdG9yZUtleSA9IFwiSkJ1aWxkNERDWWFtbC5fY2xpZW50Q2xpZW50U3lzdGVtVGl0bGVcIjtcblxuICAgIGlmIChMb2NhbFN0b3JhZ2VVdGlsaXR5LmdldEl0ZW1JblNlc3Npb25TdG9yYWdlKHN0b3JlS2V5KSkge1xuICAgICAgcmV0dXJuIExvY2FsU3RvcmFnZVV0aWxpdHkuZ2V0SXRlbUluU2Vzc2lvblN0b3JhZ2Uoc3RvcmVLZXkpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fY2xpZW50Q2xpZW50U3lzdGVtVGl0bGUpIHtcbiAgICAgIGlmICghd2luZG93LnBhcmVudC5KQnVpbGQ0RENZYW1sLl9jbGllbnRDbGllbnRTeXN0ZW1UaXRsZSkge1xuICAgICAgICBBamF4VXRpbGl0eS5HZXRTeW5jKFwiL1Jlc3QvSkJ1aWxkNERDWWFtbC9HZXRDbGllbnRTeXN0ZW1UaXRsZVwiLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgdGhpcy5fY2xpZW50Q2xpZW50U3lzdGVtVGl0bGUgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICAgIExvY2FsU3RvcmFnZVV0aWxpdHkuc2V0SXRlbUluU2Vzc2lvblN0b3JhZ2Uoc3RvcmVLZXksIHRoaXMuX2NsaWVudENsaWVudFN5c3RlbVRpdGxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY2xpZW50Q2xpZW50U3lzdGVtVGl0bGUgPSB3aW5kb3cucGFyZW50LkpCdWlsZDREQ1lhbWwuX2NsaWVudENsaWVudFN5c3RlbVRpdGxlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9jbGllbnRDbGllbnRTeXN0ZW1UaXRsZTtcbiAgfSxcbiAgR2V0Q2xpZW50U3lzdGVtQ2FwdGlvbjogZnVuY3Rpb24gR2V0Q2xpZW50U3lzdGVtQ2FwdGlvbigpIHtcbiAgICBBamF4VXRpbGl0eS5HZXRTeW5jKFwiL1Jlc3QvSkJ1aWxkNERDWWFtbC9HZXRDbGllbnRTeXN0ZW1DYXB0aW9uXCIsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgdGhpcy5fY2xpZW50Q2xpZW50U3lzdGVtQ2FwdGlvbiA9IHJlc3VsdC5kYXRhO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiB0aGlzLl9jbGllbnRDbGllbnRTeXN0ZW1DYXB0aW9uO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgSnNvblV0aWxpdHkgPSB7XG4gIFBhcnNlQXJyYXlKc29uVG9UcmVlSnNvbjogZnVuY3Rpb24gUGFyc2VBcnJheUpzb25Ub1RyZWVKc29uKGNvbmZpZywgc291cmNlQXJyYXksIHJvb3RJZCkge1xuICAgIHZhciBfY29uZmlnID0ge1xuICAgICAgS2V5RmllbGQ6IFwiXCIsXG4gICAgICBSZWxhdGlvbkZpZWxkOiBcIlwiLFxuICAgICAgQ2hpbGRGaWVsZE5hbWU6IFwiXCJcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gRmluZEpzb25CeUlkKGtleUZpZWxkLCBpZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc291cmNlQXJyYXlbaV1ba2V5RmllbGRdID09IGlkKSB7XG4gICAgICAgICAgcmV0dXJuIHNvdXJjZUFycmF5W2ldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGFsZXJ0KFwiUGFyc2VBcnJheUpzb25Ub1RyZWVKc29uLkZpbmRKc29uQnlJZDrlnKhzb3VyY2VBcnJheeS4reaJvuS4jeWIsOaMh+Wumklk55qE6K6w5b2VXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIEZpbmRDaGlsZEpzb24ocmVsYXRpb25GaWVsZCwgcGlkKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNvdXJjZUFycmF5W2ldW3JlbGF0aW9uRmllbGRdID09IHBpZCkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHNvdXJjZUFycmF5W2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIEZpbmRDaGlsZE5vZGVBbmRQYXJzZShwaWQsIHJlc3VsdCkge1xuICAgICAgdmFyIGNoaWxkanNvbnMgPSBGaW5kQ2hpbGRKc29uKGNvbmZpZy5SZWxhdGlvbkZpZWxkLCBwaWQpO1xuXG4gICAgICBpZiAoY2hpbGRqc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChyZXN1bHRbY29uZmlnLkNoaWxkRmllbGROYW1lXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXN1bHRbY29uZmlnLkNoaWxkRmllbGROYW1lXSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZGpzb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHRvT2JqID0ge307XG4gICAgICAgICAgdG9PYmogPSBKc29uVXRpbGl0eS5TaW1wbGVDbG9uZUF0dHIodG9PYmosIGNoaWxkanNvbnNbaV0pO1xuICAgICAgICAgIHJlc3VsdFtjb25maWcuQ2hpbGRGaWVsZE5hbWVdLnB1c2godG9PYmopO1xuICAgICAgICAgIHZhciBpZCA9IHRvT2JqW2NvbmZpZy5LZXlGaWVsZF07XG4gICAgICAgICAgRmluZENoaWxkTm9kZUFuZFBhcnNlKGlkLCB0b09iaik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIHJvb3RKc29uID0gRmluZEpzb25CeUlkKGNvbmZpZy5LZXlGaWVsZCwgcm9vdElkKTtcbiAgICByZXN1bHQgPSB0aGlzLlNpbXBsZUNsb25lQXR0cihyZXN1bHQsIHJvb3RKc29uKTtcbiAgICBGaW5kQ2hpbGROb2RlQW5kUGFyc2Uocm9vdElkLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIFJlc29sdmVTaW1wbGVBcnJheUpzb25Ub1RyZWVKc29uOiBmdW5jdGlvbiBSZXNvbHZlU2ltcGxlQXJyYXlKc29uVG9UcmVlSnNvbihjb25maWcsIHNvdXJjZUpzb24sIHJvb3ROb2RlSWQpIHtcbiAgICBhbGVydChcIkpzb25VdGlsaXR5LlJlc29sdmVTaW1wbGVBcnJheUpzb25Ub1RyZWVKc29uIOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgU2ltcGxlQ2xvbmVBdHRyOiBmdW5jdGlvbiBTaW1wbGVDbG9uZUF0dHIodG9PYmosIGZyb21PYmopIHtcbiAgICBmb3IgKHZhciBhdHRyIGluIGZyb21PYmopIHtcbiAgICAgIHRvT2JqW2F0dHJdID0gZnJvbU9ialthdHRyXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9PYmo7XG4gIH0sXG4gIENsb25lQXJyYXlTaW1wbGU6IGZ1bmN0aW9uIENsb25lQXJyYXlTaW1wbGUoYXJyYXkpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHQucHVzaCh0aGlzLkNsb25lU2ltcGxlKGFycmF5W2ldKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgQ2xvbmVTaW1wbGU6IGZ1bmN0aW9uIENsb25lU2ltcGxlKHNvdXJjZSkge1xuICAgIHZhciBuZXdKc29uID0galF1ZXJ5LmV4dGVuZCh0cnVlLCB7fSwgc291cmNlKTtcbiAgICByZXR1cm4gbmV3SnNvbjtcbiAgfSxcbiAgQ2xvbmVTdHJpbmdpZnk6IGZ1bmN0aW9uIENsb25lU3RyaW5naWZ5KHNvdXJjZSkge1xuICAgIHZhciBuZXdKc29uID0gdGhpcy5Kc29uVG9TdHJpbmcoc291cmNlKTtcbiAgICByZXR1cm4gdGhpcy5TdHJpbmdUb0pzb24obmV3SnNvbik7XG4gIH0sXG4gIEpzb25Ub1N0cmluZzogZnVuY3Rpb24gSnNvblRvU3RyaW5nKG9iaikge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICB9LFxuICBKc29uVG9TdHJpbmdGb3JtYXQ6IGZ1bmN0aW9uIEpzb25Ub1N0cmluZ0Zvcm1hdChvYmopIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCAyKTtcbiAgfSxcbiAgU3RyaW5nVG9Kc29uOiBmdW5jdGlvbiBTdHJpbmdUb0pzb24oc3RyKSB7XG4gICAgcmV0dXJuIGV2YWwoXCIoXCIgKyBzdHIgKyBcIilcIik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBMaXN0UGFnZVV0aWxpdHkgPSB7XG4gIERlZmF1bHRMaXN0SGVpZ2h0OiBmdW5jdGlvbiBEZWZhdWx0TGlzdEhlaWdodCgpIHtcbiAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgPiA3ODApIHtcbiAgICAgIHJldHVybiA2Nzg7XG4gICAgfSBlbHNlIGlmIChQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSA+IDY4MCkge1xuICAgICAgcmV0dXJuIDU3ODtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDM3ODtcbiAgICB9XG4gIH0sXG4gIERlZmF1bHRMaXN0SGVpZ2h0XzUwOiBmdW5jdGlvbiBEZWZhdWx0TGlzdEhlaWdodF81MCgpIHtcbiAgICByZXR1cm4gdGhpcy5EZWZhdWx0TGlzdEhlaWdodCgpIC0gNTA7XG4gIH0sXG4gIERlZmF1bHRMaXN0SGVpZ2h0XzgwOiBmdW5jdGlvbiBEZWZhdWx0TGlzdEhlaWdodF84MCgpIHtcbiAgICByZXR1cm4gdGhpcy5EZWZhdWx0TGlzdEhlaWdodCgpIC0gODA7XG4gIH0sXG4gIERlZmF1bHRMaXN0SGVpZ2h0XzEwMDogZnVuY3Rpb24gRGVmYXVsdExpc3RIZWlnaHRfMTAwKCkge1xuICAgIHJldHVybiB0aGlzLkRlZmF1bHRMaXN0SGVpZ2h0KCkgLSAxMDA7XG4gIH0sXG4gIEdldEdlbmVyYWxQYWdlSGVpZ2h0OiBmdW5jdGlvbiBHZXRHZW5lcmFsUGFnZUhlaWdodChmaXhIZWlnaHQpIHtcbiAgICB2YXIgcGFnZUhlaWdodCA9IGpRdWVyeShkb2N1bWVudCkuaGVpZ2h0KCk7XG5cbiAgICBpZiAoJChcIiNsaXN0LXNpbXBsZS1zZWFyY2gtd3JhcFwiKS5sZW5ndGggPiAwKSB7XG4gICAgICBwYWdlSGVpZ2h0ID0gcGFnZUhlaWdodCAtICQoXCIjbGlzdC1zaW1wbGUtc2VhcmNoLXdyYXBcIikub3V0ZXJIZWlnaHQoKSArIGZpeEhlaWdodCAtICQoXCIjbGlzdC1idXR0b24td3JhcFwiKS5vdXRlckhlaWdodCgpIC0gJChcIiNsaXN0LXBhZ2VyLXdyYXBcIikub3V0ZXJIZWlnaHQoKSAtIDMwO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYWdlSGVpZ2h0ID0gcGFnZUhlaWdodCAtICQoXCIjbGlzdC1idXR0b24td3JhcFwiKS5vdXRlckhlaWdodCgpICsgZml4SGVpZ2h0IC0gKCQoXCIjbGlzdC1wYWdlci13cmFwXCIpLmxlbmd0aCA+IDAgPyAkKFwiI2xpc3QtcGFnZXItd3JhcFwiKS5vdXRlckhlaWdodCgpIDogMCkgLSAzMDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFnZUhlaWdodDtcbiAgfSxcbiAgR2V0Rml4SGVpZ2h0OiBmdW5jdGlvbiBHZXRGaXhIZWlnaHQoKSB7XG4gICAgcmV0dXJuIC03MDtcbiAgfSxcbiAgSVZpZXdUYWJsZVJlbmRlcmVyOiB7XG4gICAgVG9EYXRlWVlZWV9NTV9ERDogZnVuY3Rpb24gVG9EYXRlWVlZWV9NTV9ERChoLCBkYXRldGltZSkge1xuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRldGltZSk7XG4gICAgICB2YXIgZGF0ZVN0ciA9IERhdGVVdGlsaXR5LkZvcm1hdChkYXRlLCAneXl5eS1NTS1kZCcpO1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIGRhdGVTdHIpO1xuICAgIH0sXG4gICAgU3RyaW5nVG9EYXRlWVlZWV9NTV9ERDogZnVuY3Rpb24gU3RyaW5nVG9EYXRlWVlZWV9NTV9ERChoLCBkYXRldGltZSkge1xuICAgICAgdmFyIGRhdGVTdHIgPSBkYXRldGltZS5zcGxpdChcIiBcIilbMF07XG4gICAgICByZXR1cm4gaCgnZGl2JywgZGF0ZVN0cik7XG4gICAgfSxcbiAgICBUb1N0YXR1c0VuYWJsZTogZnVuY3Rpb24gVG9TdGF0dXNFbmFibGUoaCwgc3RhdHVzKSB7XG4gICAgICBpZiAoc3RhdHVzID09IDApIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi56aB55SoXCIpO1xuICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT0gMSkge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLlkK/nlKhcIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBUb1llc05vRW5hYmxlOiBmdW5jdGlvbiBUb1llc05vRW5hYmxlKGgsIHN0YXR1cykge1xuICAgICAgaWYgKHN0YXR1cyA9PSAwKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuWQplwiKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09IDEpIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5pivXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgVG9EaWN0aW9uYXJ5VGV4dDogZnVuY3Rpb24gVG9EaWN0aW9uYXJ5VGV4dChoLCBkaWN0aW9uYXJ5SnNvbiwgZ3JvdXBWYWx1ZSwgZGljdGlvbmFyeVZhbHVlKSB7XG4gICAgICB2YXIgc2ltcGxlRGljdGlvbmFyeUpzb24gPSBEaWN0aW9uYXJ5VXRpbGl0eS5Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb24oZGljdGlvbmFyeUpzb24pO1xuXG4gICAgICBpZiAoZGljdGlvbmFyeVZhbHVlID09IG51bGwgfHwgZGljdGlvbmFyeVZhbHVlID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwiXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2ltcGxlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChzaW1wbGVEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXSkge1xuICAgICAgICAgIGlmIChzaW1wbGVEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXVtkaWN0aW9uYXJ5VmFsdWVdKSB7XG4gICAgICAgICAgICByZXR1cm4gaCgnZGl2Jywgc2ltcGxlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV1bZGljdGlvbmFyeVZhbHVlXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuaJvuS4jeWIsOijheaNoueahFRFWFRcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuaJvuS4jeWIsOijheaNoueahOWIhue7hFwiKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5om+5LiN5Yiw6KOF5o2i55qE5YiG57uEXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWQ6IGZ1bmN0aW9uIElWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkKHNlbGVjdGlvblJvd3MpIHtcbiAgICBpZiAoc2VsZWN0aW9uUm93cyAhPSBudWxsICYmIHNlbGVjdGlvblJvd3MubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGhlbjogZnVuY3Rpb24gdGhlbihmdW5jKSB7XG4gICAgICAgICAgZnVuYyhzZWxlY3Rpb25Sb3dzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5Lit6ZyA6KaB5pON5L2c55qE6KGMIVwiLCBudWxsKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4oZnVuYykge31cbiAgICAgIH07XG4gICAgfVxuICB9LFxuICBJVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZE9uZTogZnVuY3Rpb24gSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWRPbmUoc2VsZWN0aW9uUm93cywgY2FsbGVyKSB7XG4gICAgaWYgKHNlbGVjdGlvblJvd3MgIT0gbnVsbCAmJiBzZWxlY3Rpb25Sb3dzLmxlbmd0aCA+IDAgJiYgc2VsZWN0aW9uUm93cy5sZW5ndGggPT0gMSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGhlbjogZnVuY3Rpb24gdGhlbihmdW5jKSB7XG4gICAgICAgICAgaWYgKGNhbGxlcikge1xuICAgICAgICAgICAgZnVuYy5jYWxsKGNhbGxlciwgc2VsZWN0aW9uUm93cyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZ1bmMoc2VsZWN0aW9uUm93cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInkuK3pnIDopoHmk43kvZznmoTooYzvvIzmr4/mrKHlj6rog73pgInkuK3kuIDooYwhXCIsIG51bGwpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGhlbjogZnVuY3Rpb24gdGhlbihmdW5jKSB7fVxuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIElWaWV3Q2hhbmdlU2VydmVyU3RhdHVzOiBmdW5jdGlvbiBJVmlld0NoYW5nZVNlcnZlclN0YXR1cyh1cmwsIHNlbGVjdGlvblJvd3MsIGlkRmllbGQsIHN0YXR1c05hbWUsIHBhZ2VBcHBPYmopIHtcbiAgICB2YXIgaWRBcnJheSA9IG5ldyBBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3Rpb25Sb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZEFycmF5LnB1c2goc2VsZWN0aW9uUm93c1tpXVtpZEZpZWxkXSk7XG4gICAgfVxuXG4gICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHtcbiAgICAgIGlkczogaWRBcnJheS5qb2luKFwiO1wiKSxcbiAgICAgIHN0YXR1czogc3RhdHVzTmFtZVxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgICAgcGFnZUFwcE9iai5yZWxvYWREYXRhKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgfVxuICAgIH0sIHBhZ2VBcHBPYmopO1xuICB9LFxuICBJVmlld01vdmVGYWNlOiBmdW5jdGlvbiBJVmlld01vdmVGYWNlKHVybCwgc2VsZWN0aW9uUm93cywgaWRGaWVsZCwgdHlwZSwgcGFnZUFwcE9iaikge1xuICAgIHRoaXMuSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWRPbmUoc2VsZWN0aW9uUm93cykudGhlbihmdW5jdGlvbiAoc2VsZWN0aW9uUm93cykge1xuICAgICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHtcbiAgICAgICAgcmVjb3JkSWQ6IHNlbGVjdGlvblJvd3NbMF1baWRGaWVsZF0sXG4gICAgICAgIHR5cGU6IHR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgcGFnZUFwcE9iai5yZWxvYWREYXRhKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgcGFnZUFwcE9iaik7XG4gICAgfSk7XG4gIH0sXG4gIElWaWV3Q2hhbmdlU2VydmVyU3RhdHVzRmFjZTogZnVuY3Rpb24gSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXNGYWNlKHVybCwgc2VsZWN0aW9uUm93cywgaWRGaWVsZCwgc3RhdHVzTmFtZSwgcGFnZUFwcE9iaikge1xuICAgIHRoaXMuSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWQoc2VsZWN0aW9uUm93cykudGhlbihmdW5jdGlvbiAoc2VsZWN0aW9uUm93cykge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3Q2hhbmdlU2VydmVyU3RhdHVzKHVybCwgc2VsZWN0aW9uUm93cywgaWRGaWVsZCwgc3RhdHVzTmFtZSwgcGFnZUFwcE9iaik7XG4gICAgfSk7XG4gIH0sXG4gIElWaWV3VGFibGVEZWxldGVSb3c6IGZ1bmN0aW9uIElWaWV3VGFibGVEZWxldGVSb3codXJsLCByZWNvcmRJZCwgcGFnZUFwcE9iaikge1xuICAgIERpYWxvZ1V0aWxpdHkuQ29uZmlybSh3aW5kb3csIFwi56Gu6K6k6KaB5Yig6Zmk5b2T5YmN6K6w5b2V5ZCX77yfXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIEFqYXhVdGlsaXR5LkRlbGV0ZSh1cmwsIHtcbiAgICAgICAgcmVjb3JkSWQ6IHJlY29yZElkXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai5yZWxvYWREYXRhKCk7XG4gICAgICAgICAgfSwgcGFnZUFwcE9iaik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHBhZ2VBcHBPYmopO1xuICAgIH0sIHBhZ2VBcHBPYmopO1xuICB9LFxuICBJVmlld1RhYmxlQmluZERhdGFCeVNlYXJjaDogZnVuY3Rpb24gSVZpZXdUYWJsZUJpbmREYXRhQnlTZWFyY2goX2NvbmZpZykge1xuICAgIHZhciBjb25maWcgPSB7XG4gICAgICB1cmw6IFwiXCIsXG4gICAgICBwYWdlTnVtOiAxLFxuICAgICAgcGFnZVNpemU6IDEyLFxuICAgICAgc2VhcmNoQ29uZGl0aW9uOiBudWxsLFxuICAgICAgcGFnZUFwcE9iajogbnVsbCxcbiAgICAgIHRhYmxlTGlzdDogbnVsbCxcbiAgICAgIGlkRmllbGQ6IFwiXCIsXG4gICAgICBhdXRvU2VsZWN0ZWRPbGRSb3dzOiBmYWxzZSxcbiAgICAgIHN1Y2Nlc3NGdW5jOiBudWxsLFxuICAgICAgbG9hZERpY3Q6IGZhbHNlLFxuICAgICAgY3VzdFBhcmFzOiB7fVxuICAgIH07XG4gICAgY29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGNvbmZpZywgX2NvbmZpZyk7XG5cbiAgICBpZiAoIWNvbmZpZy50YWJsZUxpc3QpIHtcbiAgICAgIGNvbmZpZy50YWJsZUxpc3QgPSBjb25maWcucGFnZUFwcE9iajtcbiAgICB9XG5cbiAgICA7XG4gICAgdmFyIHNlbmREYXRhID0ge1xuICAgICAgXCJwYWdlTnVtXCI6IGNvbmZpZy5wYWdlTnVtLFxuICAgICAgXCJwYWdlU2l6ZVwiOiBjb25maWcucGFnZVNpemUsXG4gICAgICBcInNlYXJjaENvbmRpdGlvblwiOiBTZWFyY2hVdGlsaXR5LlNlcmlhbGl6YXRpb25TZWFyY2hDb25kaXRpb24oY29uZmlnLnNlYXJjaENvbmRpdGlvbiksXG4gICAgICBcImxvYWREaWN0XCI6IGNvbmZpZy5sb2FkRGljdFxuICAgIH07XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gY29uZmlnLmN1c3RQYXJhcykge1xuICAgICAgc2VuZERhdGFba2V5XSA9IGNvbmZpZy5jdXN0UGFyYXNba2V5XTtcbiAgICB9XG5cbiAgICBBamF4VXRpbGl0eS5Qb3N0KGNvbmZpZy51cmwsIHNlbmREYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcuc3VjY2Vzc0Z1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgY29uZmlnLnN1Y2Nlc3NGdW5jLmNhbGwoY29uZmlnLnBhZ2VBcHBPYmosIHJlc3VsdCwgY29uZmlnLnBhZ2VBcHBPYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLnRhYmxlTGlzdC50YWJsZURhdGEgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgY29uZmlnLnRhYmxlTGlzdC50YWJsZURhdGEgPSByZXN1bHQuZGF0YS5saXN0O1xuICAgICAgICBjb25maWcudGFibGVMaXN0LnBhZ2VUb3RhbCA9IHJlc3VsdC5kYXRhLnRvdGFsO1xuXG4gICAgICAgIGlmIChjb25maWcuYXV0b1NlbGVjdGVkT2xkUm93cykge1xuICAgICAgICAgIGlmIChjb25maWcudGFibGVMaXN0LnNlbGVjdGlvblJvd3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbmZpZy50YWJsZUxpc3Quc2VsZWN0aW9uUm93cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChjb25maWcudGFibGVMaXN0LnNlbGVjdGlvblJvd3Nbal1bY29uZmlnLmlkRmllbGRdID09IGNvbmZpZy50YWJsZUxpc3QudGFibGVEYXRhW2ldW2NvbmZpZy5pZEZpZWxkXSkge1xuICAgICAgICAgICAgICAgICAgY29uZmlnLnRhYmxlTGlzdC50YWJsZURhdGFbaV0uX2NoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMsIFwianNvblwiKTtcbiAgfSxcbiAgSVZpZXdUYWJsZUxvYWREYXRhU2VhcmNoOiBmdW5jdGlvbiBJVmlld1RhYmxlTG9hZERhdGFTZWFyY2godXJsLCBwYWdlTnVtLCBwYWdlU2l6ZSwgc2VhcmNoQ29uZGl0aW9uLCBwYWdlQXBwT2JqLCBpZEZpZWxkLCBhdXRvU2VsZWN0ZWRPbGRSb3dzLCBzdWNjZXNzRnVuYywgbG9hZERpY3QsIGN1c3RQYXJhcykge1xuICAgIGFsZXJ0KFwiTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVMb2FkRGF0YVNlYXJjaOaWueazleW3sue7j+iiq+W6n+W8gyzor7fovazosINJVmlld1RhYmxlQmluZERhdGFCeVNlYXJjaFwiKTtcbiAgICByZXR1cm47XG5cbiAgICBpZiAobG9hZERpY3QgPT0gdW5kZWZpbmVkIHx8IGxvYWREaWN0ID09IG51bGwpIHtcbiAgICAgIGxvYWREaWN0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFjdXN0UGFyYXMpIHtcbiAgICAgIGN1c3RQYXJhcyA9IHt9O1xuICAgIH1cblxuICAgIHZhciBzZW5kRGF0YSA9IHtcbiAgICAgIFwicGFnZU51bVwiOiBwYWdlTnVtLFxuICAgICAgXCJwYWdlU2l6ZVwiOiBwYWdlU2l6ZSxcbiAgICAgIFwic2VhcmNoQ29uZGl0aW9uXCI6IFNlYXJjaFV0aWxpdHkuU2VyaWFsaXphdGlvblNlYXJjaENvbmRpdGlvbihzZWFyY2hDb25kaXRpb24pLFxuICAgICAgXCJsb2FkRGljdFwiOiBsb2FkRGljdFxuICAgIH07XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gY3VzdFBhcmFzKSB7XG4gICAgICBzZW5kRGF0YVtrZXldID0gY3VzdFBhcmFzW2tleV07XG4gICAgfVxuXG4gICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHNlbmREYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzdWNjZXNzRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBzdWNjZXNzRnVuYyhyZXN1bHQsIHBhZ2VBcHBPYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGEgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGEgPSByZXN1bHQuZGF0YS5saXN0O1xuICAgICAgICBwYWdlQXBwT2JqLnBhZ2VUb3RhbCA9IHJlc3VsdC5kYXRhLnRvdGFsO1xuXG4gICAgICAgIGlmIChhdXRvU2VsZWN0ZWRPbGRSb3dzKSB7XG4gICAgICAgICAgaWYgKHBhZ2VBcHBPYmouc2VsZWN0aW9uUm93cyAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VBcHBPYmoudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2VBcHBPYmouc2VsZWN0aW9uUm93c1tqXVtpZEZpZWxkXSA9PSBwYWdlQXBwT2JqLnRhYmxlRGF0YVtpXVtpZEZpZWxkXSkge1xuICAgICAgICAgICAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGFbaV0uX2NoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHt9XG4gICAgfSwgdGhpcywgXCJqc29uXCIpO1xuICB9LFxuICBJVmlld1RhYmxlTG9hZERhdGFOb1NlYXJjaDogZnVuY3Rpb24gSVZpZXdUYWJsZUxvYWREYXRhTm9TZWFyY2godXJsLCBwYWdlTnVtLCBwYWdlU2l6ZSwgcGFnZUFwcE9iaiwgaWRGaWVsZCwgYXV0b1NlbGVjdGVkT2xkUm93cywgc3VjY2Vzc0Z1bmMpIHtcbiAgICBhbGVydChcIkxpc3RQYWdlVXRpbGl0eS5JVmlld1RhYmxlTG9hZERhdGFTZWFyY2jmlrnms5Xlt7Lnu4/ooqvlup/lvIMs6K+36L2s6LCDSVZpZXdUYWJsZUJpbmREYXRhQnlTZWFyY2hcIik7XG4gICAgcmV0dXJuO1xuICAgIEFqYXhVdGlsaXR5LlBvc3QodXJsLCB7XG4gICAgICBwYWdlTnVtOiBwYWdlTnVtLFxuICAgICAgcGFnZVNpemU6IHBhZ2VTaXplXG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhID0gbmV3IEFycmF5KCk7XG4gICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhID0gcmVzdWx0LmRhdGEubGlzdDtcbiAgICAgICAgcGFnZUFwcE9iai5wYWdlVG90YWwgPSByZXN1bHQuZGF0YS50b3RhbDtcblxuICAgICAgICBpZiAoYXV0b1NlbGVjdGVkT2xkUm93cykge1xuICAgICAgICAgIGlmIChwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlQXBwT2JqLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBhZ2VBcHBPYmouc2VsZWN0aW9uUm93cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3Nbal1baWRGaWVsZF0gPT0gcGFnZUFwcE9iai50YWJsZURhdGFbaV1baWRGaWVsZF0pIHtcbiAgICAgICAgICAgICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhW2ldLl9jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHN1Y2Nlc3NGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHN1Y2Nlc3NGdW5jKHJlc3VsdCwgcGFnZUFwcE9iaik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCBcImpzb25cIik7XG4gIH0sXG4gIElWaWV3VGFibGVJbm5lckJ1dHRvbjoge1xuICAgIFZpZXdCdXR0b246IGZ1bmN0aW9uIFZpZXdCdXR0b24oaCwgcGFyYW1zLCBpZEZpZWxkLCBwYWdlQXBwT2JqKSB7XG4gICAgICByZXR1cm4gaCgnVG9vbHRpcCcsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBjb250ZW50OiBcIuafpeeci1wiXG4gICAgICAgIH1cbiAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbiB2aWV3XCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai52aWV3KHBhcmFtcy5yb3dbaWRGaWVsZF0sIHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KV0pO1xuICAgIH0sXG4gICAgRWRpdEJ1dHRvbjogZnVuY3Rpb24gRWRpdEJ1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmopIHtcbiAgICAgIHJldHVybiBoKCdUb29sdGlwJywge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGNvbnRlbnQ6IFwi5L+u5pS5XCJcbiAgICAgICAgfVxuICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIGVkaXRcIixcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLmVkaXQocGFyYW1zLnJvd1tpZEZpZWxkXSwgcGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXSk7XG4gICAgfSxcbiAgICBEZWxldGVCdXR0b246IGZ1bmN0aW9uIERlbGV0ZUJ1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmopIHtcbiAgICAgIHJldHVybiBoKCdUb29sdGlwJywge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGNvbnRlbnQ6IFwi5Yig6ZmkXCJcbiAgICAgICAgfVxuICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIGRlbFwiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmouZGVsKHBhcmFtcy5yb3dbaWRGaWVsZF0sIHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KV0pO1xuICAgIH0sXG4gICAgTW92ZVVwQnV0dG9uOiBmdW5jdGlvbiBNb3ZlVXBCdXR0b24oaCwgcGFyYW1zLCBpZEZpZWxkLCBwYWdlQXBwT2JqKSB7XG4gICAgICByZXR1cm4gaCgnVG9vbHRpcCcsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBjb250ZW50OiBcIuS4iuenu1wiXG4gICAgICAgIH1cbiAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbiBtb3ZlLXVwXCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai5tb3ZlVXAocGFyYW1zLnJvd1tpZEZpZWxkXSwgcGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXSk7XG4gICAgfSxcbiAgICBNb3ZlRG93bkJ1dHRvbjogZnVuY3Rpb24gTW92ZURvd25CdXR0b24oaCwgcGFyYW1zLCBpZEZpZWxkLCBwYWdlQXBwT2JqKSB7XG4gICAgICByZXR1cm4gaCgnVG9vbHRpcCcsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBjb250ZW50OiBcIuS4i+enu1wiXG4gICAgICAgIH1cbiAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbiBtb3ZlLWRvd25cIixcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLm1vdmVEb3duKHBhcmFtcy5yb3dbaWRGaWVsZF0sIHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KV0pO1xuICAgIH0sXG4gICAgU2VsZWN0ZWRCdXR0b246IGZ1bmN0aW9uIFNlbGVjdGVkQnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaiwgY2xpY2tFdmVudCkge1xuICAgICAgcmV0dXJuIGgoJ1Rvb2x0aXAnLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgY29udGVudDogXCLpgInmi6lcIlxuICAgICAgICB9XG4gICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gc2VsZWN0ZWRcIixcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNsaWNrRXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIGNsaWNrRXZlbnQocGFyYW1zLnJvd1tpZEZpZWxkXSwgcGFyYW1zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBhZ2VBcHBPYmouc2VsZWN0ZWQocGFyYW1zLnJvd1tpZEZpZWxkXSwgcGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXSk7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgTG9jYWxTdG9yYWdlVXRpbGl0eSA9IHtcbiAgaXNTdXBwb3J0OiBmdW5jdGlvbiBpc1N1cHBvcnQoKSB7XG4gICAgaWYgKHR5cGVvZiBTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcbiAgc2V0SXRlbTogZnVuY3Rpb24gc2V0SXRlbShrZXksIHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuaXNTdXBwb3J0KCkpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgfSxcbiAgZ2V0SXRlbTogZnVuY3Rpb24gZ2V0SXRlbShrZXkpIHtcbiAgICBpZiAodGhpcy5pc1N1cHBvcnQoKSkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIHNldEl0ZW1JblNlc3Npb25TdG9yYWdlOiBmdW5jdGlvbiBzZXRJdGVtSW5TZXNzaW9uU3RvcmFnZShrZXksIHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuaXNTdXBwb3J0KCkpIHtcbiAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgfVxuICB9LFxuICBnZXRJdGVtSW5TZXNzaW9uU3RvcmFnZTogZnVuY3Rpb24gZ2V0SXRlbUluU2Vzc2lvblN0b3JhZ2Uoa2V5KSB7XG4gICAgaWYgKHRoaXMuaXNTdXBwb3J0KCkpIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQYWdlU3R5bGVVdGlsaXR5ID0ge1xuICBHZXRQYWdlSGVpZ2h0OiBmdW5jdGlvbiBHZXRQYWdlSGVpZ2h0KCkge1xuICAgIHJldHVybiBqUXVlcnkod2luZG93LmRvY3VtZW50KS5oZWlnaHQoKTtcbiAgfSxcbiAgR2V0UGFnZVdpZHRoOiBmdW5jdGlvbiBHZXRQYWdlV2lkdGgoKSB7XG4gICAgcmV0dXJuIGpRdWVyeSh3aW5kb3cuZG9jdW1lbnQpLndpZHRoKCk7XG4gIH0sXG4gIEdldFdpbmRvd0hlaWdodDogZnVuY3Rpb24gR2V0V2luZG93SGVpZ2h0KCkge1xuICAgIHJldHVybiAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gIH0sXG4gIEdldFdpbmRvd1dpZHRoOiBmdW5jdGlvbiBHZXRXaW5kb3dXaWR0aCgpIHtcbiAgICByZXR1cm4gJCh3aW5kb3cpLndpZHRoKCk7XG4gIH0sXG4gIEdldExpc3RCdXR0b25PdXRlckhlaWdodDogZnVuY3Rpb24gR2V0TGlzdEJ1dHRvbk91dGVySGVpZ2h0KCkge1xuICAgIGFsZXJ0KFwiUGFnZVN0eWxlVXRpbGl0eS5HZXRMaXN0QnV0dG9uT3V0ZXJIZWlnaHQg5bey5YGc55SoXCIpO1xuICAgIHJldHVybiBqUXVlcnkoXCIubGlzdC1idXR0b24tb3V0ZXItY1wiKS5vdXRlckhlaWdodCgpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgU2VhcmNoVXRpbGl0eSA9IHtcbiAgU2VhcmNoRmllbGRUeXBlOiB7XG4gICAgSW50VHlwZTogXCJJbnRUeXBlXCIsXG4gICAgTnVtYmVyVHlwZTogXCJOdW1iZXJUeXBlXCIsXG4gICAgRGF0YVR5cGU6IFwiRGF0ZVR5cGVcIixcbiAgICBMaWtlU3RyaW5nVHlwZTogXCJMaWtlU3RyaW5nVHlwZVwiLFxuICAgIExlZnRMaWtlU3RyaW5nVHlwZTogXCJMZWZ0TGlrZVN0cmluZ1R5cGVcIixcbiAgICBSaWdodExpa2VTdHJpbmdUeXBlOiBcIlJpZ2h0TGlrZVN0cmluZ1R5cGVcIixcbiAgICBTdHJpbmdUeXBlOiBcIlN0cmluZ1R5cGVcIixcbiAgICBEYXRhU3RyaW5nVHlwZTogXCJEYXRlU3RyaW5nVHlwZVwiLFxuICAgIEFycmF5TGlrZVN0cmluZ1R5cGU6IFwiQXJyYXlMaWtlU3RyaW5nVHlwZVwiXG4gIH0sXG4gIFNlcmlhbGl6YXRpb25TZWFyY2hDb25kaXRpb246IGZ1bmN0aW9uIFNlcmlhbGl6YXRpb25TZWFyY2hDb25kaXRpb24oc2VhcmNoQ29uZGl0aW9uKSB7XG4gICAgaWYgKHNlYXJjaENvbmRpdGlvbikge1xuICAgICAgdmFyIHNlYXJjaENvbmRpdGlvbkNsb25lID0gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUoc2VhcmNoQ29uZGl0aW9uKTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNlYXJjaENvbmRpdGlvbkNsb25lKSB7XG4gICAgICAgIGlmIChzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnR5cGUgPT0gU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuQXJyYXlMaWtlU3RyaW5nVHlwZSkge1xuICAgICAgICAgIGlmIChzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnZhbHVlICE9IG51bGwgJiYgc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnZhbHVlID0gc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZS5qb2luKFwiO1wiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzZWFyY2hDb25kaXRpb25DbG9uZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBKQnVpbGQ0RFNlbGVjdFZpZXcgPSB7XG4gIFNlbGVjdEVudlZhcmlhYmxlOiB7XG4gICAgZm9ybWF0VGV4dDogZnVuY3Rpb24gZm9ybWF0VGV4dCh0eXBlLCB0ZXh0KSB7XG4gICAgICBhbGVydChcIkpCdWlsZDREU2VsZWN0Vmlldy5mb3JtYXRUZXh05pa55rOV5bey57uP5bqf5byDLOivt+S9v+eUqHNlbGVjdC1kZWZhdWx0LXZhbHVlLWRpYWxvZ+e7hOS7tuWGhemDqOeahGZvcm1hdFRleHTmlrnms5UhXCIpO1xuICAgICAgcmV0dXJuO1xuXG4gICAgICBpZiAodHlwZSA9PSBcIkNvbnN0XCIpIHtcbiAgICAgICAgcmV0dXJuIFwi6Z2Z5oCB5YC8OuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJEYXRlVGltZVwiKSB7XG4gICAgICAgIHJldHVybiBcIuaXpeacn+aXtumXtDrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiQXBpVmFyXCIpIHtcbiAgICAgICAgcmV0dXJuIFwiQVBJ5Y+Y6YePOuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJOdW1iZXJDb2RlXCIpIHtcbiAgICAgICAgcmV0dXJuIFwi5bqP5Y+357yW56CBOuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJJZENvZGVyXCIpIHtcbiAgICAgICAgcmV0dXJuIFwi5Li76ZSu55Sf5oiQOuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJcIikge1xuICAgICAgICByZXR1cm4gXCLjgJDml6DjgJFcIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFwi5pyq55+l57G75Z6LXCIgKyB0ZXh0O1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFNlc3Npb25VdGlsaXR5ID0ge1xuICBfY3VycmVudFNlc3Npb25Vc2VyOiBudWxsLFxuICBfY3VycmVudFNlc3Npb25Vc2VyTW9jazoge1xuICAgIG9yZ2FuSWQ6IFwiXCIsXG4gICAgb3JnYW5OYW1lOiBcIlwiLFxuICAgIHVzZXJJZDogXCJcIixcbiAgICB1c2VyTmFtZTogXCJcIixcbiAgICBtYWluRGVwYXJ0bWVudElkOiBcIlwiLFxuICAgIG1haW5EZXBhcnRtZW50TmFtZTogXCJcIixcbiAgICBhY2NvdW50SWQ6IFwiXCIsXG4gICAgYWNjb3VudE5hbWU6IFwiXCJcbiAgfSxcbiAgQ2xlYXJDbGllbnRTZXNzaW9uU3RvcmVTZXNzaW9uVXNlcjogZnVuY3Rpb24gQ2xlYXJDbGllbnRTZXNzaW9uU3RvcmVTZXNzaW9uVXNlcigpIHt9LFxuICBHZXRTZXNzaW9uVXNlclN5bmM6IGZ1bmN0aW9uIEdldFNlc3Npb25Vc2VyU3luYygpIHtcbiAgICBpZiAodGhpcy5fY3VycmVudFNlc3Npb25Vc2VyID09IG51bGwpIHtcbiAgICAgIGlmICh3aW5kb3cucGFyZW50LlNlc3Npb25VdGlsaXR5Ll9jdXJyZW50U2Vzc2lvblVzZXIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LnBhcmVudC5TZXNzaW9uVXRpbGl0eS5fY3VycmVudFNlc3Npb25Vc2VyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQWpheFV0aWxpdHkuUG9zdFN5bmMoXCIvUmVzdC9TZXNzaW9uL1VzZXIvR2V0TXlTZXNzaW9uVXNlclwiLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgU2Vzc2lvblV0aWxpdHkuX2N1cnJlbnRTZXNzaW9uVXNlciA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIH0gZWxzZSB7fVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRTZXNzaW9uVXNlcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRTZXNzaW9uVXNlcjtcbiAgICB9XG4gIH0sXG4gIEdldFNlc3Npb25Vc2VyOiBmdW5jdGlvbiBHZXRTZXNzaW9uVXNlcihmdW5jKSB7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50U2Vzc2lvblVzZXIpIHtcbiAgICAgIEFqYXhVdGlsaXR5LkdldChcIi9SZXN0L1Nlc3Npb24vVXNlci9HZXRNeVNlc3Npb25Vc2VyXCIsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIGZ1bmMocmVzdWx0LmRhdGEpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFNlc3Npb25Vc2VyO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG52YXIgU3RyaW5nVXRpbGl0eSA9IHtcbiAgR3VpZFNwbGl0OiBmdW5jdGlvbiBHdWlkU3BsaXQoc3BsaXQpIHtcbiAgICB2YXIgZ3VpZCA9IFwiXCI7XG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAzMjsgaSsrKSB7XG4gICAgICBndWlkICs9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2LjApLnRvU3RyaW5nKDE2KTtcbiAgICAgIGlmIChpID09IDggfHwgaSA9PSAxMiB8fCBpID09IDE2IHx8IGkgPT0gMjApIGd1aWQgKz0gc3BsaXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGd1aWQ7XG4gIH0sXG4gIEd1aWQ6IGZ1bmN0aW9uIEd1aWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuR3VpZFNwbGl0KFwiLVwiKTtcbiAgfSxcbiAgVGltZXN0YW1wOiBmdW5jdGlvbiBUaW1lc3RhbXAoKSB7XG4gICAgdmFyIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHJldHVybiB0aW1lc3RhbXAudG9TdHJpbmcoKS5zdWJzdHIoNCwgMTApO1xuICB9LFxuICBUcmltOiBmdW5jdGlvbiBUcmltKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvKF5b44CAXFxzXSopfChb44CAXFxzXSokKS9nLCBcIlwiKTtcbiAgfSxcbiAgUmVtb3ZlTGFzdENoYXI6IGZ1bmN0aW9uIFJlbW92ZUxhc3RDaGFyKHN0cikge1xuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKDAsIHN0ci5sZW5ndGggLSAxKTtcbiAgfSxcbiAgSXNOdWxsT3JFbXB0eTogZnVuY3Rpb24gSXNOdWxsT3JFbXB0eShvYmopIHtcbiAgICByZXR1cm4gb2JqID09IHVuZGVmaW5lZCB8fCBvYmogPT0gXCJcIiB8fCBvYmogPT0gbnVsbCB8fCBvYmogPT0gXCJ1bmRlZmluZWRcIiB8fCBvYmogPT0gXCJudWxsXCI7XG4gIH0sXG4gIEdldEZ1bmN0aW9uTmFtZTogZnVuY3Rpb24gR2V0RnVuY3Rpb25OYW1lKGZ1bmMpIHtcbiAgICBpZiAodHlwZW9mIGZ1bmMgPT0gXCJmdW5jdGlvblwiIHx8IF90eXBlb2YoZnVuYykgPT0gXCJvYmplY3RcIikgdmFyIGZOYW1lID0gKFwiXCIgKyBmdW5jKS5tYXRjaCgvZnVuY3Rpb25cXHMqKFtcXHdcXCRdKilcXHMqXFwoLyk7XG4gICAgaWYgKGZOYW1lICE9PSBudWxsKSByZXR1cm4gZk5hbWVbMV07XG4gIH0sXG4gIFRvTG93ZXJDYXNlOiBmdW5jdGlvbiBUb0xvd2VyQ2FzZShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCk7XG4gIH0sXG4gIHRvVXBwZXJDYXNlOiBmdW5jdGlvbiB0b1VwcGVyQ2FzZShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7XG4gIH0sXG4gIEVuZFdpdGg6IGZ1bmN0aW9uIEVuZFdpdGgoc3RyLCBlbmRTdHIpIHtcbiAgICB2YXIgZCA9IHN0ci5sZW5ndGggLSBlbmRTdHIubGVuZ3RoO1xuICAgIHJldHVybiBkID49IDAgJiYgc3RyLmxhc3RJbmRleE9mKGVuZFN0cikgPT0gZDtcbiAgfSxcbiAgSXNTYW1lRG9tYWluOiBmdW5jdGlvbiBJc1NhbWVEb21haW4odXJsMSwgdXJsMikge1xuICAgIHZhciBvcmlnaW4xID0gL1xcL1xcL1tcXHctLl0rKDpcXGQrKT8vaS5leGVjKHVybDEpWzBdO1xuICAgIHZhciBvcGVuID0gL1xcL1xcL1tcXHctLl0rKDpcXGQrKT8vaS5leGVjKHVybDIpO1xuXG4gICAgaWYgKG9wZW4gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBvcmlnaW4yID0gb3BlblswXTtcblxuICAgICAgaWYgKG9yaWdpbjEgPT0gb3JpZ2luMikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcbiAgRmlyc3RDaGFyTGV0dGVyOiBmdW5jdGlvbiBGaXJzdENoYXJMZXR0ZXIoc3RyKSB7XG4gICAgdmFyIHN0cjEgPSBzdHIucmVwbGFjZShzdHJbMF0sIHN0clswXS50b0xvd2VyQ2FzZSgpKTtcbiAgICByZXR1cm4gc3RyMTtcbiAgfSxcbiAgRmlyc3RDaGFyVXBwZXI6IGZ1bmN0aW9uIEZpcnN0Q2hhclVwcGVyKHN0cikge1xuICAgIHZhciBzdHIxID0gc3RyLnJlcGxhY2Uoc3RyWzBdLCBzdHJbMF0udG9VcHBlckNhc2UoKSk7XG4gICAgcmV0dXJuIHN0cjE7XG4gIH0sXG4gIFJlbW92ZVNjcmlwdDogZnVuY3Rpb24gUmVtb3ZlU2NyaXB0KHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvPHNjcmlwdC4qPz4uKj88XFwvc2NyaXB0Pi9pZywgJycpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgWE1MVXRpbGl0eSA9IHt9OyJdfQ==
