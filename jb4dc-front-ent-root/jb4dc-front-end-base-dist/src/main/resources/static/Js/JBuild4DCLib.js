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
            DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, result.message, function () {});
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
  ReplaceUrlVariable: function ReplaceUrlVariable(sourceUrl) {
    alert("ReplaceUrlVariable迁移到BuildAction");
  },
  GetTopWindow: function GetTopWindow() {
    alert("BaseUtility.GetTopWindow 已停用");
  },
  TrySetControlFocus: function TrySetControlFocus() {
    alert("BaseUtility.TrySetControlFocus 已停用");
  },
  BuildUrl: function BuildUrl(url) {
    alert("BaseUtility.BuildUrl 已停用");
  },
  BuildView: function BuildView(action, para) {
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
  BuildFrameInnerView: function BuildFrameInnerView(action, para) {
    alert("BaseUtility.BuildFrameInnerView 已停用");
    return false;
    var urlPara = "";

    if (para) {
      urlPara = $.param(para);
    }

    var _url = this.GetRootPath() + "/HTML/" + action;

    if (urlPara != "") {
      _url += "?" + urlPara;
    }

    return this.AppendTimeStampUrl(_url);
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
  DialogId: "DefaultDialogUtility01",
  DialogId02: "DefaultDialogUtility02",
  DialogId03: "DefaultDialogUtility03",
  DialogId04: "DefaultDialogUtility04",
  DialogId05: "DefaultDialogUtility05",
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
  _CreateIfrmaeDialogElement: function _CreateIfrmaeDialogElement(docObj, dialogId, url) {
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
  AlertError: function AlertError(openerWindow, dialogId, config, htmlMsg, sFunc) {
    var defaultConfig = {
      height: "auto",
      width: "auto",
      title: "错误提示"
    };
    defaultConfig = $.extend(true, {}, defaultConfig, config);
    this.Alert(openerWindow, dialogId, defaultConfig, htmlMsg, sFunc);
  },
  AlertText: function AlertText(text) {
    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, text, null);
  },
  Alert: function Alert(openerWindow, dialogId, config, htmlMsg, sFunc, caller) {
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
      }
    };
    defaultConfig = $.extend(true, {}, defaultConfig, config);
    $(htmlElem).html(htmlMsg);
    $(htmlElem).dialog(defaultConfig);
  },
  AlertJsonCode: function AlertJsonCode(json) {
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

    var htmlElem = this._CreateDialogElem(window.document.body, DialogUtility.DialogAlertId);

    var defaultConfig = {
      height: 600,
      width: 900,
      title: "系统提示",
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
      close: function close() {}
    };
    $(htmlElem).html("<div id='pscontainer' style='width: 100%;height: 100%;overflow: auto;position: relative;'><pre class='json-pre'>" + json + "</pre></div>");
    $(htmlElem).dialog(defaultConfig);
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
      height: 200,
      width: 300,
      title: "",
      show: true,
      modal: true
    };
    var defaultConfig = $.extend(true, {}, defaultConfig, config);
    $(htmlElem).find(".alertloading-txt").html(htmlMsg);
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

    var dialogEle = this._CreateIfrmaeDialogElement(openerwindow.document, autodialogId, url);

    var dialogObj = $(dialogEle).dialog(defaultoptions);
    var $iframeobj = $(dialogEle).find("iframe");
    $iframeobj.on("load", function () {
      if (StringUtility.IsSameOrgin(window.location.href, url)) {
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
      var dialogEle = this._CreateIfrmaeDialogElement(this.FramePageRef.document, autodialogId, url);

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
        if (StringUtility.IsSameOrgin(window.location.href, url)) {
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
  Frame_Comfirm: function Frame_Comfirm() {},
  Frame_OpenIframeWindow: function Frame_OpenIframeWindow(openerwindow, dialogId, url, options, whtype) {
    if (url == "") {
      alert("url不能为空字符串!");
      return;
    }

    var wrwin = this.Frame_TryGetFrameWindowObj();
    this.FramePageRef = wrwin;

    if (wrwin != null) {
      this.FramePageRef.DialogUtility.FramePageRef = wrwin;

      this.FramePageRef.DialogUtility._OpenWindowInFramePage(openerwindow, dialogId, url, options, whtype);
    } else {
      alert("找不到FramePage!!");
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
  IViewTableMareSureSelectedOne: function IViewTableMareSureSelectedOne(selectionRows) {
    if (selectionRows != null && selectionRows.length > 0 && selectionRows.length == 1) {
      return {
        then: function then(func) {
          func(selectionRows);
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
    SelectedButton: function SelectedButton(h, params, idField, pageAppObj) {
      return h('Tooltip', {
        props: {
          content: "选择"
        }
      }, [h('div', {
        class: "list-row-button selected",
        on: {
          click: function click() {
            pageAppObj.selected(params.row[idField], params);
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
  GetFuntionName: function GetFuntionName(func) {
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
  IsSameOrgin: function IsSameOrgin(url1, url2) {
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
  }
};
"use strict";

var XMLUtility = {};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFqYXhVdGlsaXR5LmpzIiwiQXJyYXlVdGlsaXR5LmpzIiwiQmFzZVV0aWxpdHkuanMiLCJCcm93c2VySW5mb1V0aWxpdHkuanMiLCJDYWNoZURhdGFVdGlsaXR5LmpzIiwiQ29va2llVXRpbGl0eS5qcyIsIkRhdGVVdGlsaXR5LmpzIiwiRGV0YWlsUGFnZVV0aWxpdHkuanMiLCJEaWFsb2dVdGlsaXR5LmpzIiwiRGljdGlvbmFyeVV0aWxpdHkuanMiLCJKQnVpbGQ0RENCYXNlTGliLmpzIiwiSkJ1aWxkNERDWWFtbC5qcyIsIkpzb25VdGlsaXR5LmpzIiwiTGlzdFBhZ2VVdGlsaXR5LmpzIiwiTG9jYWxTdG9yYWdlVXRpbGl0eS5qcyIsIlBhZ2VTdHlsZVV0aWxpdHkuanMiLCJTZWFyY2hVdGlsaXR5LmpzIiwiU2VsZWN0Vmlld0xpYi5qcyIsIlNlc3Npb25VdGlsaXR5LmpzIiwiU3RyaW5nVXRpbGl0eS5qcyIsIlhNTFV0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDemhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBIiwiZmlsZSI6IkpCdWlsZDREQ0xpYi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQWpheFV0aWxpdHkgPSB7XG4gIFBvc3RSZXF1ZXN0Qm9keTogZnVuY3Rpb24gUG9zdFJlcXVlc3RCb2R5KF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuX0lubmVyQWpheChfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsIHRydWUsIFwiUE9TVFwiKTtcbiAgfSxcbiAgUG9zdFN5bmM6IGZ1bmN0aW9uIFBvc3RTeW5jKF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlLCBjb250ZW50VHlwZSkge1xuICAgIHJldHVybiB0aGlzLl9Jbm5lckFqYXgoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUsIG51bGwsIGZhbHNlLCBcIlBPU1RcIik7XG4gIH0sXG4gIFBvc3Q6IGZ1bmN0aW9uIFBvc3QoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5fSW5uZXJBamF4KF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlLCBudWxsLCB0cnVlLCBcIlBPU1RcIik7XG4gIH0sXG4gIEdldFN5bmM6IGZ1bmN0aW9uIEdldFN5bmMoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5fSW5uZXJBamF4KF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlLCBudWxsLCBmYWxzZSwgXCJHRVRcIik7XG4gIH0sXG4gIEdldDogZnVuY3Rpb24gR2V0KF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuX0lubmVyQWpheChfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSwgbnVsbCwgdHJ1ZSwgXCJHRVRcIik7XG4gIH0sXG4gIERlbGV0ZTogZnVuY3Rpb24gRGVsZXRlKF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuX0lubmVyQWpheChfdXJsLCBzZW5kRGF0YSwgZnVuYywgY2FsbGVyLCBkYXRhVHlwZSwgbnVsbCwgdHJ1ZSwgXCJERUxFVEVcIik7XG4gIH0sXG4gIERlbGV0ZVN5bmM6IGZ1bmN0aW9uIERlbGV0ZVN5bmMoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5fSW5uZXJBamF4KF91cmwsIHNlbmREYXRhLCBmdW5jLCBjYWxsZXIsIGRhdGFUeXBlLCBudWxsLCBmYWxzZSwgXCJERUxFVEVcIik7XG4gIH0sXG4gIF9Jbm5lckFqYXg6IGZ1bmN0aW9uIF9Jbm5lckFqYXgoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGNhbGxlciwgZGF0YVR5cGUsIGNvbnRlbnRUeXBlLCBpc0FzeW5jLCBhamF4VHlwZSkge1xuICAgIGlmIChjYWxsZXIpIHtcbiAgICAgIGlmIChjYWxsZXIgPT0gXCJqc29uXCIpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEVycm9yKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydEVycm9ySWQsIHt9LCBcIueUseS6juaWueazleabtOaWsCxjYWxsZXLlj4LmlbDor7fkvKDpgJJ0aGlzXCIsIG51bGwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbihfdXJsKTtcblxuICAgIGlmIChkYXRhVHlwZSA9PSB1bmRlZmluZWQgfHwgZGF0YVR5cGUgPT0gbnVsbCkge1xuICAgICAgZGF0YVR5cGUgPSBcImpzb25cIjtcbiAgICB9XG5cbiAgICBpZiAoaXNBc3luYyA9PSB1bmRlZmluZWQgfHwgaXNBc3luYyA9PSBudWxsKSB7XG4gICAgICBpc0FzeW5jID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudFR5cGUgPT0gdW5kZWZpbmVkIHx8IGNvbnRlbnRUeXBlID09IG51bGwpIHtcbiAgICAgIGNvbnRlbnRUeXBlID0gXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLThcIjtcbiAgICB9XG5cbiAgICB2YXIgaW5uZXJSZXN1bHQgPSBudWxsO1xuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiBhamF4VHlwZSxcbiAgICAgIHVybDogdXJsLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgYXN5bmM6IGlzQXN5bmMsXG4gICAgICBjb250ZW50VHlwZTogY29udGVudFR5cGUsXG4gICAgICBkYXRhVHlwZTogZGF0YVR5cGUsXG4gICAgICBkYXRhOiBzZW5kRGF0YSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzdWx0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsICYmIHJlc3VsdC5zdWNjZXNzICE9IG51bGwgJiYgIXJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0Lm1lc3NhZ2UgPT0gXCLnmbvlvZVTZXNzaW9u6L+H5pyfXCIpIHtcbiAgICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEVycm9yKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydEVycm9ySWQsIHt9LCBcIlNlc3Npb27otoXml7bvvIzor7fph43mlrDnmbvpmYbns7vnu59cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIEJhc2VVdGlsaXR5LlJlZGlyZWN0VG9Mb2dpbigpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkFqYXhVdGlsaXR5LlBvc3QgRXhjZXB0aW9uIFwiICsgdXJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzID09IGZhbHNlKSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0RXJyb3Iod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0RXJyb3JJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuXG4gICAgICAgIGlmIChjYWxsZXIpIHtcbiAgICAgICAgICBmdW5jLmNhbGwoY2FsbGVyLCByZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZ1bmMocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlubmVyUmVzdWx0ID0gcmVzdWx0O1xuICAgICAgfSxcbiAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZShtc2cpIHt9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uIGVycm9yKG1zZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChtc2cucmVzcG9uc2VUZXh0LmluZGV4T2YoXCLor7fph43mlrDnmbvpmYbns7vnu59cIikgPj0gMCkge1xuICAgICAgICAgICAgQmFzZVV0aWxpdHkuUmVkaXJlY3RUb0xvZ2luKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0RXJyb3Iod2luZG93LCBcIkFqYXhVdGlsaXR5LlBvc3QuRXJyb3JcIiwge30sIFwiQWpheOivt+axguWPkeeUn+mUmeivr++8gTxici8+XCIgKyBcInN0YXR1czpcIiArIG1zZy5zdGF0dXMgKyBcIiw8YnIvPnJlc3BvbnNlVGV4dDpcIiArIG1zZy5yZXNwb25zZVRleHQsIG51bGwpO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpbm5lclJlc3VsdDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEFycmF5VXRpbGl0eSA9IHtcbiAgRGVsZXRlOiBmdW5jdGlvbiBEZWxldGUoYXJ5LCBpbmRleCkge1xuICAgIGFyeS5zcGxpY2UoaW5kZXgsIDEpO1xuICB9LFxuICBTd2FwSXRlbXM6IGZ1bmN0aW9uIFN3YXBJdGVtcyhhcnksIGluZGV4MSwgaW5kZXgyKSB7XG4gICAgYXJ5W2luZGV4MV0gPSBhcnkuc3BsaWNlKGluZGV4MiwgMSwgYXJ5W2luZGV4MV0pWzBdO1xuICAgIHJldHVybiBhcnk7XG4gIH0sXG4gIE1vdmVVcDogZnVuY3Rpb24gTW92ZVVwKGFyciwgJGluZGV4KSB7XG4gICAgaWYgKCRpbmRleCA9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5Td2FwSXRlbXMoYXJyLCAkaW5kZXgsICRpbmRleCAtIDEpO1xuICB9LFxuICBNb3ZlRG93bjogZnVuY3Rpb24gTW92ZURvd24oYXJyLCAkaW5kZXgpIHtcbiAgICBpZiAoJGluZGV4ID09IGFyci5sZW5ndGggLSAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5Td2FwSXRlbXMoYXJyLCAkaW5kZXgsICRpbmRleCArIDEpO1xuICB9LFxuICBVbmlxdWU6IGZ1bmN0aW9uIFVuaXF1ZShhcnIpIHtcbiAgICB2YXIgbiA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChuLmluZGV4T2YoYXJyW2ldKSA9PSAtMSkgbi5wdXNoKGFycltpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG47XG4gIH0sXG4gIEV4aXN0OiBmdW5jdGlvbiBFeGlzdChhcnIsIGNvbmRpdGlvbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoY29uZGl0aW9uKGFycltpXSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBQdXNoV2hlbk5vdEV4aXN0OiBmdW5jdGlvbiBQdXNoV2hlbk5vdEV4aXN0KGFyciwgaXRlbSwgY29uZGl0aW9uKSB7XG4gICAgaWYgKCF0aGlzLkV4aXN0KGNvbmRpdGlvbikpIHtcbiAgICAgIGFyci5wdXNoKGl0ZW0pO1xuICAgIH1cblxuICAgIHJldHVybiBhcnI7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBCYXNlVXRpbGl0eSA9IHtcbiAgR2V0Um9vdFBhdGg6IGZ1bmN0aW9uIEdldFJvb3RQYXRoKCkge1xuICAgIHZhciBmdWxsSHJlZiA9IHdpbmRvdy5kb2N1bWVudC5sb2NhdGlvbi5ocmVmO1xuICAgIHZhciBwYXRoTmFtZSA9IHdpbmRvdy5kb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICB2YXIgbGFjID0gZnVsbEhyZWYuaW5kZXhPZihwYXRoTmFtZSk7XG4gICAgdmFyIGxvY2FsaG9zdFBhdGggPSBmdWxsSHJlZi5zdWJzdHJpbmcoMCwgbGFjKTtcbiAgICB2YXIgcHJvamVjdE5hbWUgPSBwYXRoTmFtZS5zdWJzdHJpbmcoMCwgcGF0aE5hbWUuc3Vic3RyKDEpLmluZGV4T2YoJy8nKSArIDEpO1xuICAgIHJldHVybiBsb2NhbGhvc3RQYXRoICsgcHJvamVjdE5hbWU7XG4gIH0sXG4gIFJlcGxhY2VVcmxWYXJpYWJsZTogZnVuY3Rpb24gUmVwbGFjZVVybFZhcmlhYmxlKHNvdXJjZVVybCkge1xuICAgIGFsZXJ0KFwiUmVwbGFjZVVybFZhcmlhYmxl6L+B56e75YiwQnVpbGRBY3Rpb25cIik7XG4gIH0sXG4gIEdldFRvcFdpbmRvdzogZnVuY3Rpb24gR2V0VG9wV2luZG93KCkge1xuICAgIGFsZXJ0KFwiQmFzZVV0aWxpdHkuR2V0VG9wV2luZG93IOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgVHJ5U2V0Q29udHJvbEZvY3VzOiBmdW5jdGlvbiBUcnlTZXRDb250cm9sRm9jdXMoKSB7XG4gICAgYWxlcnQoXCJCYXNlVXRpbGl0eS5UcnlTZXRDb250cm9sRm9jdXMg5bey5YGc55SoXCIpO1xuICB9LFxuICBCdWlsZFVybDogZnVuY3Rpb24gQnVpbGRVcmwodXJsKSB7XG4gICAgYWxlcnQoXCJCYXNlVXRpbGl0eS5CdWlsZFVybCDlt7LlgZznlKhcIik7XG4gIH0sXG4gIEJ1aWxkVmlldzogZnVuY3Rpb24gQnVpbGRWaWV3KGFjdGlvbiwgcGFyYSkge1xuICAgIHZhciB1cmxQYXJhID0gXCJcIjtcblxuICAgIGlmIChwYXJhKSB7XG4gICAgICB1cmxQYXJhID0gJC5wYXJhbShwYXJhKTtcbiAgICB9XG5cbiAgICB2YXIgX3VybCA9IHRoaXMuR2V0Um9vdFBhdGgoKSArIGFjdGlvbjtcblxuICAgIGlmICh1cmxQYXJhICE9IFwiXCIpIHtcbiAgICAgIF91cmwgKz0gXCI/XCIgKyB1cmxQYXJhO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLkFwcGVuZFRpbWVTdGFtcFVybChfdXJsKTtcbiAgfSxcbiAgQnVpbGRGcmFtZUlubmVyVmlldzogZnVuY3Rpb24gQnVpbGRGcmFtZUlubmVyVmlldyhhY3Rpb24sIHBhcmEpIHtcbiAgICBhbGVydChcIkJhc2VVdGlsaXR5LkJ1aWxkRnJhbWVJbm5lclZpZXcg5bey5YGc55SoXCIpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgICB2YXIgdXJsUGFyYSA9IFwiXCI7XG5cbiAgICBpZiAocGFyYSkge1xuICAgICAgdXJsUGFyYSA9ICQucGFyYW0ocGFyYSk7XG4gICAgfVxuXG4gICAgdmFyIF91cmwgPSB0aGlzLkdldFJvb3RQYXRoKCkgKyBcIi9IVE1ML1wiICsgYWN0aW9uO1xuXG4gICAgaWYgKHVybFBhcmEgIT0gXCJcIikge1xuICAgICAgX3VybCArPSBcIj9cIiArIHVybFBhcmE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuQXBwZW5kVGltZVN0YW1wVXJsKF91cmwpO1xuICB9LFxuICBCdWlsZEFjdGlvbjogZnVuY3Rpb24gQnVpbGRBY3Rpb24oYWN0aW9uLCBwYXJhKSB7XG4gICAgdmFyIHVybFBhcmEgPSBcIlwiO1xuXG4gICAgaWYgKHBhcmEpIHtcbiAgICAgIHVybFBhcmEgPSAkLnBhcmFtKHBhcmEpO1xuICAgIH1cblxuICAgIHZhciBfdXJsID0gdGhpcy5HZXRSb290UGF0aCgpICsgYWN0aW9uO1xuXG4gICAgaWYgKHVybFBhcmEgIT0gXCJcIikge1xuICAgICAgX3VybCArPSBcIj9cIiArIHVybFBhcmE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuQXBwZW5kVGltZVN0YW1wVXJsKF91cmwpO1xuICB9LFxuICBSZWRpcmVjdFRvTG9naW46IGZ1bmN0aW9uIFJlZGlyZWN0VG9Mb2dpbigpIHtcbiAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1BsYXRGb3JtL0xvZ2luVmlldy5kb1wiO1xuICAgIHdpbmRvdy5wYXJlbnQucGFyZW50LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG4gIH0sXG4gIEFwcGVuZFRpbWVTdGFtcFVybDogZnVuY3Rpb24gQXBwZW5kVGltZVN0YW1wVXJsKHVybCkge1xuICAgIGlmICh1cmwuaW5kZXhPZihcInRpbWVzdGFtcFwiKSA+IFwiMFwiKSB7XG4gICAgICByZXR1cm4gdXJsO1xuICAgIH1cblxuICAgIHZhciBnZXRUaW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIGlmICh1cmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgdXJsID0gdXJsICsgXCImdGltZXN0YW1wPVwiICsgZ2V0VGltZXN0YW1wO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSB1cmwgKyBcIj90aW1lc3RhbXA9XCIgKyBnZXRUaW1lc3RhbXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcbiAgfSxcbiAgR2V0VXJsUGFyYVZhbHVlOiBmdW5jdGlvbiBHZXRVcmxQYXJhVmFsdWUocGFyYU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5HZXRVcmxQYXJhVmFsdWVCeVN0cmluZyhwYXJhTmFtZSwgd2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gIH0sXG4gIEdldFVybFBhcmFWYWx1ZUJ5U3RyaW5nOiBmdW5jdGlvbiBHZXRVcmxQYXJhVmFsdWVCeVN0cmluZyhwYXJhTmFtZSwgdXJsU3RyaW5nKSB7XG4gICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoXCIoXnwmKVwiICsgcGFyYU5hbWUgKyBcIj0oW14mXSopKCZ8JClcIik7XG4gICAgdmFyIHIgPSB1cmxTdHJpbmcuc3Vic3RyKDEpLm1hdGNoKHJlZyk7XG4gICAgaWYgKHIgIT0gbnVsbCkgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyWzJdKTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfSxcbiAgQ29weVZhbHVlQ2xpcGJvYXJkOiBmdW5jdGlvbiBDb3B5VmFsdWVDbGlwYm9hcmQodmFsdWUpIHtcbiAgICB2YXIgdHJhbnNmZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnSl9Db3B5VHJhbnNmZXInKTtcblxuICAgIGlmICghdHJhbnNmZXIpIHtcbiAgICAgIHRyYW5zZmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICAgIHRyYW5zZmVyLmlkID0gJ0pfQ29weVRyYW5zZmVyJztcbiAgICAgIHRyYW5zZmVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIHRyYW5zZmVyLnN0eWxlLmxlZnQgPSAnLTk5OTlweCc7XG4gICAgICB0cmFuc2Zlci5zdHlsZS50b3AgPSAnLTk5OTlweCc7XG4gICAgICB0cmFuc2Zlci5zdHlsZS56SW5kZXggPSA5OTk5O1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0cmFuc2Zlcik7XG4gICAgfVxuXG4gICAgdHJhbnNmZXIudmFsdWUgPSB2YWx1ZTtcbiAgICB0cmFuc2Zlci5mb2N1cygpO1xuICAgIHRyYW5zZmVyLnNlbGVjdCgpO1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG4gIH0sXG4gIFNldFN5c3RlbUZhdmljb246IGZ1bmN0aW9uIFNldFN5c3RlbUZhdmljb24oKSB7XG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibGlua1tyZWwqPSdpY29uJ11cIikgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgIGxpbmsudHlwZSA9ICdpbWFnZS94LWljb24nO1xuICAgIGxpbmsucmVsID0gJ3Nob3J0Y3V0IGljb24nO1xuICAgIGxpbmsuaHJlZiA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyAnL2Zhdmljb24uaWNvJztcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKGxpbmspO1xuICB9LFxuICBTZXRTeXN0ZW1UaXRsZTogZnVuY3Rpb24gU2V0U3lzdGVtVGl0bGUoKSB7XG4gICAgZG9jdW1lbnQudGl0bGUgPSBKQnVpbGQ0RENZYW1sLkdldENsaWVudFN5c3RlbVRpdGxlKCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBCcm93c2VySW5mb1V0aWxpdHkgPSB7XG4gIEJyb3dzZXJBcHBOYW1lOiBmdW5jdGlvbiBCcm93c2VyQXBwTmFtZSgpIHtcbiAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiRmlyZWZveFwiKSA+IDApIHtcbiAgICAgIHJldHVybiBcIkZpcmVmb3hcIjtcbiAgICB9IGVsc2UgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIikgPiAwKSB7XG4gICAgICByZXR1cm4gXCJJRVwiO1xuICAgIH0gZWxzZSBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiQ2hyb21lXCIpID4gMCkge1xuICAgICAgcmV0dXJuIFwiQ2hyb21lXCI7XG4gICAgfVxuICB9LFxuICBJc0lFOiBmdW5jdGlvbiBJc0lFKCkge1xuICAgIGlmICghIXdpbmRvdy5BY3RpdmVYT2JqZWN0IHx8IFwiQWN0aXZlWE9iamVjdFwiIGluIHdpbmRvdykgcmV0dXJuIHRydWU7ZWxzZSByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIElzSUU2OiBmdW5jdGlvbiBJc0lFNigpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA2LjBcIikgPiAwO1xuICB9LFxuICBJc0lFNzogZnVuY3Rpb24gSXNJRTcoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgNy4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRTg6IGZ1bmN0aW9uIElzSUU4KCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDguMFwiKSA+IDA7XG4gIH0sXG4gIElzSUU4WDY0OiBmdW5jdGlvbiBJc0lFOFg2NCgpIHtcbiAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA4LjBcIikgPiAwKSB7XG4gICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwieDY0XCIpID4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIElzSUU5OiBmdW5jdGlvbiBJc0lFOSgpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA5LjBcIikgPiAwO1xuICB9LFxuICBJc0lFOVg2NDogZnVuY3Rpb24gSXNJRTlYNjQoKSB7XG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOS4wXCIpID4gMCkge1xuICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIng2NFwiKSA+IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc0lFMTA6IGZ1bmN0aW9uIElzSUUxMCgpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSAxMC4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRTEwWDY0OiBmdW5jdGlvbiBJc0lFMTBYNjQoKSB7XG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgMTAuMFwiKSA+IDApIHtcbiAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJ4NjRcIikgPiAwO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgSUVEb2N1bWVudE1vZGU6IGZ1bmN0aW9uIElFRG9jdW1lbnRNb2RlKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudE1vZGU7XG4gIH0sXG4gIElzSUU4RG9jdW1lbnRNb2RlOiBmdW5jdGlvbiBJc0lFOERvY3VtZW50TW9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5JRURvY3VtZW50TW9kZSgpID09IDg7XG4gIH0sXG4gIElzRmlyZWZveDogZnVuY3Rpb24gSXNGaXJlZm94KCkge1xuICAgIHJldHVybiB0aGlzLkJyb3dzZXJBcHBOYW1lKCkgPT0gXCJGaXJlZm94XCI7XG4gIH0sXG4gIElzQ2hyb21lOiBmdW5jdGlvbiBJc0Nocm9tZSgpIHtcbiAgICByZXR1cm4gdGhpcy5Ccm93c2VyQXBwTmFtZSgpID09IFwiQ2hyb21lXCI7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDYWNoZURhdGFVdGlsaXR5ID0ge307IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDb29raWVVdGlsaXR5ID0ge1xuICBTZXRDb29raWUxRGF5OiBmdW5jdGlvbiBTZXRDb29raWUxRGF5KG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGV4cCA9IG5ldyBEYXRlKCk7XG4gICAgZXhwLnNldFRpbWUoZXhwLmdldFRpbWUoKSArIDI0ICogNjAgKiA2MCAqIDEwMDApO1xuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIGVzY2FwZSh2YWx1ZSkgKyBcIjtleHBpcmVzPVwiICsgZXhwLnRvR01UU3RyaW5nKCkgKyBcIjtwYXRoPS9cIjtcbiAgfSxcbiAgU2V0Q29va2llMU1vbnRoOiBmdW5jdGlvbiBTZXRDb29raWUxTW9udGgobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgZXhwID0gbmV3IERhdGUoKTtcbiAgICBleHAuc2V0VGltZShleHAuZ2V0VGltZSgpICsgMzAgKiAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBlc2NhcGUodmFsdWUpICsgXCI7ZXhwaXJlcz1cIiArIGV4cC50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XG4gIH0sXG4gIFNldENvb2tpZTFZZWFyOiBmdW5jdGlvbiBTZXRDb29raWUxWWVhcihuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBleHAgPSBuZXcgRGF0ZSgpO1xuICAgIGV4cC5zZXRUaW1lKGV4cC5nZXRUaW1lKCkgKyAzMCAqIDI0ICogNjAgKiA2MCAqIDM2NSAqIDEwMDApO1xuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIGVzY2FwZSh2YWx1ZSkgKyBcIjtleHBpcmVzPVwiICsgZXhwLnRvR01UU3RyaW5nKCkgKyBcIjtwYXRoPS9cIjtcbiAgfSxcbiAgR2V0Q29va2llOiBmdW5jdGlvbiBHZXRDb29raWUobmFtZSkge1xuICAgIHZhciBhcnIgPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cChcIihefCApXCIgKyBuYW1lICsgXCI9KFteO10qKSg7fCQpXCIpKTtcbiAgICBpZiAoYXJyICE9IG51bGwpIHJldHVybiB1bmVzY2FwZShhcnJbMl0pO1xuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBEZWxDb29raWU6IGZ1bmN0aW9uIERlbENvb2tpZShuYW1lKSB7XG4gICAgdmFyIGV4cCA9IG5ldyBEYXRlKCk7XG4gICAgZXhwLnNldFRpbWUoZXhwLmdldFRpbWUoKSAtIDEpO1xuICAgIHZhciBjdmFsID0gdGhpcy5nZXRDb29raWUobmFtZSk7XG4gICAgaWYgKGN2YWwgIT0gbnVsbCkgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgY3ZhbCArIFwiO2V4cGlyZXM9XCIgKyBleHAudG9HTVRTdHJpbmcoKSArIFwiO3BhdGg9L1wiO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGF0ZVV0aWxpdHkgPSB7XG4gIEdldEN1cnJlbnREYXRhU3RyaW5nOiBmdW5jdGlvbiBHZXRDdXJyZW50RGF0YVN0cmluZyhzcGxpdCkge1xuICAgIGFsZXJ0KFwiRGF0ZVV0aWxpdHkuR2V0Q3VycmVudERhdGFTdHJpbmcg5bey5YGc55SoXCIpO1xuICB9LFxuICBEYXRlRm9ybWF0OiBmdW5jdGlvbiBEYXRlRm9ybWF0KG15RGF0ZSwgc3BsaXQpIHtcbiAgICBhbGVydChcIkRhdGVVdGlsaXR5LkdldEN1cnJlbnREYXRhU3RyaW5nIOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgRm9ybWF0OiBmdW5jdGlvbiBGb3JtYXQobXlEYXRlLCBmb3JtYXRTdHJpbmcpIHtcbiAgICB2YXIgbyA9IHtcbiAgICAgIFwiTStcIjogbXlEYXRlLmdldE1vbnRoKCkgKyAxLFxuICAgICAgXCJkK1wiOiBteURhdGUuZ2V0RGF0ZSgpLFxuICAgICAgXCJoK1wiOiBteURhdGUuZ2V0SG91cnMoKSxcbiAgICAgIFwibStcIjogbXlEYXRlLmdldE1pbnV0ZXMoKSxcbiAgICAgIFwicytcIjogbXlEYXRlLmdldFNlY29uZHMoKSxcbiAgICAgIFwicStcIjogTWF0aC5mbG9vcigobXlEYXRlLmdldE1vbnRoKCkgKyAzKSAvIDMpLFxuICAgICAgXCJTXCI6IG15RGF0ZS5nZXRNaWxsaXNlY29uZHMoKVxuICAgIH07XG4gICAgaWYgKC8oeSspLy50ZXN0KGZvcm1hdFN0cmluZykpIGZvcm1hdFN0cmluZyA9IGZvcm1hdFN0cmluZy5yZXBsYWNlKFJlZ0V4cC4kMSwgKG15RGF0ZS5nZXRGdWxsWWVhcigpICsgXCJcIikuc3Vic3RyKDQgLSBSZWdFeHAuJDEubGVuZ3RoKSk7XG5cbiAgICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICAgIGlmIChuZXcgUmVnRXhwKFwiKFwiICsgayArIFwiKVwiKS50ZXN0KGZvcm1hdFN0cmluZykpIGZvcm1hdFN0cmluZyA9IGZvcm1hdFN0cmluZy5yZXBsYWNlKFJlZ0V4cC4kMSwgUmVnRXhwLiQxLmxlbmd0aCA9PSAxID8gb1trXSA6IChcIjAwXCIgKyBvW2tdKS5zdWJzdHIoKFwiXCIgKyBvW2tdKS5sZW5ndGgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9ybWF0U3RyaW5nO1xuICB9LFxuICBGb3JtYXRDdXJyZW50RGF0YTogZnVuY3Rpb24gRm9ybWF0Q3VycmVudERhdGEoZm9ybWF0U3RyaW5nKSB7XG4gICAgdmFyIG15RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIHRoaXMuRm9ybWF0KG15RGF0ZSwgZm9ybWF0U3RyaW5nKTtcbiAgfSxcbiAgR2V0Q3VycmVudERhdGE6IGZ1bmN0aW9uIEdldEN1cnJlbnREYXRhKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGV0YWlsUGFnZVV0aWxpdHkgPSB7XG4gIElWaWV3UGFnZVRvVmlld1N0YXR1czogZnVuY3Rpb24gSVZpZXdQYWdlVG9WaWV3U3RhdHVzKCkge1xuICAgIHJldHVybjtcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkKFwiaW5wdXRcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuaGlkZSgpO1xuICAgICAgICB2YXIgdmFsID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgJCh0aGlzKS5hZnRlcigkKFwiPGxhYmVsIC8+XCIpLnRleHQodmFsKSk7XG4gICAgICB9KTtcbiAgICAgICQoXCIuaXZ1LWRhdGUtcGlja2VyLWVkaXRvclwiKS5maW5kKFwiLml2dS1pY29uXCIpLmhpZGUoKTtcbiAgICAgICQoXCIuaXZ1LXJhZGlvXCIpLmhpZGUoKTtcbiAgICAgICQoXCIuaXZ1LXJhZGlvLWdyb3VwLWl0ZW1cIikuaGlkZSgpO1xuICAgICAgJChcIi5pdnUtcmFkaW8td3JhcHBlci1jaGVja2VkXCIpLnNob3coKTtcbiAgICAgICQoXCIuaXZ1LXJhZGlvLXdyYXBwZXItY2hlY2tlZFwiKS5maW5kKFwic3BhblwiKS5oaWRlKCk7XG4gICAgICAkKFwidGV4dGFyZWFcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuaGlkZSgpO1xuICAgICAgICB2YXIgdmFsID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgJCh0aGlzKS5hZnRlcigkKFwiPGxhYmVsIC8+XCIpLnRleHQodmFsKSk7XG4gICAgICB9KTtcbiAgICB9LCAxMDApO1xuICB9LFxuICBPdmVycmlkZU9iamVjdFZhbHVlOiBmdW5jdGlvbiBPdmVycmlkZU9iamVjdFZhbHVlKHNvdXJjZU9iamVjdCwgZGF0YU9iamVjdCkge1xuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2VPYmplY3QpIHtcbiAgICAgIGlmIChkYXRhT2JqZWN0W2tleV0gIT0gdW5kZWZpbmVkICYmIGRhdGFPYmplY3Rba2V5XSAhPSBudWxsICYmIGRhdGFPYmplY3Rba2V5XSAhPSBcIlwiKSB7XG4gICAgICAgIHNvdXJjZU9iamVjdFtrZXldID0gZGF0YU9iamVjdFtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgT3ZlcnJpZGVPYmplY3RWYWx1ZUZ1bGw6IGZ1bmN0aW9uIE92ZXJyaWRlT2JqZWN0VmFsdWVGdWxsKHNvdXJjZU9iamVjdCwgZGF0YU9iamVjdCkge1xuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2VPYmplY3QpIHtcbiAgICAgIHNvdXJjZU9iamVjdFtrZXldID0gZGF0YU9iamVjdFtrZXldO1xuICAgIH1cbiAgfSxcbiAgQmluZEZvcm1EYXRhOiBmdW5jdGlvbiBCaW5kRm9ybURhdGEoaW50ZXJmYWNlVXJsLCB2dWVGb3JtRGF0YSwgcmVjb3JkSWQsIG9wLCBiZWZGdW5jLCBhZkZ1bmMsIGNhbGxlcikge1xuICAgIEFqYXhVdGlsaXR5LlBvc3QoaW50ZXJmYWNlVXJsLCB7XG4gICAgICByZWNvcmRJZDogcmVjb3JkSWQsXG4gICAgICBvcDogb3BcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiZWZGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGJlZkZ1bmMocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIERldGFpbFBhZ2VVdGlsaXR5Lk92ZXJyaWRlT2JqZWN0VmFsdWUodnVlRm9ybURhdGEsIHJlc3VsdC5kYXRhKTtcblxuICAgICAgICBpZiAodHlwZW9mIGFmRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBhZkZ1bmMocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcCA9PSBcInZpZXdcIikge1xuICAgICAgICAgIERldGFpbFBhZ2VVdGlsaXR5LklWaWV3UGFnZVRvVmlld1N0YXR1cygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgfVxuICAgIH0sIGNhbGxlcik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbnZhciBEaWFsb2dVdGlsaXR5ID0ge1xuICBEaWFsb2dBbGVydElkOiBcIkRlZmF1bHREaWFsb2dBbGVydFV0aWxpdHkwMVwiLFxuICBEaWFsb2dBbGVydEVycm9ySWQ6IFwiRGVmYXVsdERpYWxvZ0FsZXJ0RXJyb3JVdGlsaXR5MDFcIixcbiAgRGlhbG9nUHJvbXB0SWQ6IFwiRGVmYXVsdERpYWxvZ1Byb21wdFV0aWxpdHkwMVwiLFxuICBEaWFsb2dJZDogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTAxXCIsXG4gIERpYWxvZ0lkMDI6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwMlwiLFxuICBEaWFsb2dJZDAzOiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDNcIixcbiAgRGlhbG9nSWQwNDogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTA0XCIsXG4gIERpYWxvZ0lkMDU6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwNVwiLFxuICBfR2V0RWxlbTogZnVuY3Rpb24gX0dldEVsZW0oZGlhbG9nSWQpIHtcbiAgICByZXR1cm4gJChcIiNcIiArIGRpYWxvZ0lkKTtcbiAgfSxcbiAgX0NyZWF0ZURpYWxvZ0VsZW06IGZ1bmN0aW9uIF9DcmVhdGVEaWFsb2dFbGVtKGRvY09iaiwgZGlhbG9nSWQpIHtcbiAgICBpZiAodGhpcy5fR2V0RWxlbShkaWFsb2dJZCkubGVuZ3RoID09IDApIHtcbiAgICAgIHZhciBkaWFsb2dFbGUgPSAkKFwiPGRpdiBpZD1cIiArIGRpYWxvZ0lkICsgXCIgdGl0bGU9J+ezu+e7n+aPkOekuicgc3R5bGU9J2Rpc3BsYXk6bm9uZSc+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gICAgICAkKGRvY09iai5ib2R5KS5hcHBlbmQoZGlhbG9nRWxlKTtcbiAgICAgIHJldHVybiBkaWFsb2dFbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKTtcbiAgICB9XG4gIH0sXG4gIF9DcmVhdGVBbGVydExvYWRpbmdNc2dFbGVtZW50OiBmdW5jdGlvbiBfQ3JlYXRlQWxlcnRMb2FkaW5nTXNnRWxlbWVudChkb2NPYmosIGRpYWxvZ0lkKSB7XG4gICAgaWYgKHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpLmxlbmd0aCA9PSAwKSB7XG4gICAgICB2YXIgZGlhbG9nRWxlID0gJChcIjxkaXYgaWQ9XCIgKyBkaWFsb2dJZCArIFwiIHRpdGxlPSfns7vnu5/mj5DnpLonIHN0eWxlPSdkaXNwbGF5Om5vbmUnPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdhbGVydC1sb2FkaW5nLWltZyc+PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J2FsZXJ0LWxvYWRpbmctdHh0Jz48L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gICAgICAkKGRvY09iai5ib2R5KS5hcHBlbmQoZGlhbG9nRWxlKTtcbiAgICAgIHJldHVybiBkaWFsb2dFbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKTtcbiAgICB9XG4gIH0sXG4gIF9DcmVhdGVJZnJtYWVEaWFsb2dFbGVtZW50OiBmdW5jdGlvbiBfQ3JlYXRlSWZybWFlRGlhbG9nRWxlbWVudChkb2NPYmosIGRpYWxvZ0lkLCB1cmwpIHtcbiAgICB2YXIgZGlhbG9nRWxlID0gJChcIjxkaXYgaWQ9XCIgKyBkaWFsb2dJZCArIFwiIHRpdGxlPSdCYXNpYyBkaWFsb2cnPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpZnJhbWUgbmFtZT0nZGlhbG9nSWZyYW1lJyB3aWR0aD0nMTAwJScgaGVpZ2h0PSc5OCUnIGZyYW1lYm9yZGVyPScwJz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2lmcmFtZT5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgICAkKGRvY09iai5ib2R5KS5hcHBlbmQoZGlhbG9nRWxlKTtcbiAgICByZXR1cm4gZGlhbG9nRWxlO1xuICB9LFxuICBfVGVzdERpYWxvZ0VsZW1Jc0V4aXN0OiBmdW5jdGlvbiBfVGVzdERpYWxvZ0VsZW1Jc0V4aXN0KGRpYWxvZ0lkKSB7XG4gICAgaWYgKHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgX1Rlc3RSdW5FbmFibGU6IGZ1bmN0aW9uIF9UZXN0UnVuRW5hYmxlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBBbGVydEVycm9yOiBmdW5jdGlvbiBBbGVydEVycm9yKG9wZW5lcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbE1zZywgc0Z1bmMpIHtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIGhlaWdodDogXCJhdXRvXCIsXG4gICAgICB3aWR0aDogXCJhdXRvXCIsXG4gICAgICB0aXRsZTogXCLplJnor6/mj5DnpLpcIlxuICAgIH07XG4gICAgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgIHRoaXMuQWxlcnQob3BlbmVyV2luZG93LCBkaWFsb2dJZCwgZGVmYXVsdENvbmZpZywgaHRtbE1zZywgc0Z1bmMpO1xuICB9LFxuICBBbGVydFRleHQ6IGZ1bmN0aW9uIEFsZXJ0VGV4dCh0ZXh0KSB7XG4gICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHRleHQsIG51bGwpO1xuICB9LFxuICBBbGVydDogZnVuY3Rpb24gQWxlcnQob3BlbmVyV2luZG93LCBkaWFsb2dJZCwgY29uZmlnLCBodG1sTXNnLCBzRnVuYywgY2FsbGVyKSB7XG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbShvcGVuZXJXaW5kb3cuZG9jdW1lbnQuYm9keSwgZGlhbG9nSWQpO1xuXG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLlhbPpl61cIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9wZW46IGZ1bmN0aW9uIG9wZW4oKSB7fSxcbiAgICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgaWYgKHNGdW5jKSB7XG4gICAgICAgICAgaWYgKGNhbGxlcikge1xuICAgICAgICAgICAgc0Z1bmMuY2FsbChjYWxsZXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzRnVuYygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgICQoaHRtbEVsZW0pLmh0bWwoaHRtbE1zZyk7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICB9LFxuICBBbGVydEpzb25Db2RlOiBmdW5jdGlvbiBBbGVydEpzb25Db2RlKGpzb24pIHtcbiAgICBpZiAoX3R5cGVvZihqc29uKSA9PSBcIm9iamVjdFwiKSB7XG4gICAgICBqc29uID0gSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nRm9ybWF0KGpzb24pO1xuICAgIH1cblxuICAgIGpzb24gPSBqc29uLnJlcGxhY2UoLyYvZywgJyYnKS5yZXBsYWNlKC88L2csICc8JykucmVwbGFjZSgvPi9nLCAnPicpO1xuICAgIGpzb24gPSBqc29uLnJlcGxhY2UoLyhcIihcXFxcdVthLXpBLVowLTldezR9fFxcXFxbXnVdfFteXFxcXFwiXSkqXCIoXFxzKjopP3xcXGIodHJ1ZXxmYWxzZXxudWxsKVxcYnwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPykvZywgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICB2YXIgY2xzID0gJ2pzb24tbnVtYmVyJztcblxuICAgICAgaWYgKC9eXCIvLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgIGlmICgvOiQvLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgICAgY2xzID0gJ2pzb24ta2V5JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbHMgPSAnanNvbi1zdHJpbmcnO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKC90cnVlfGZhbHNlLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICBjbHMgPSAnanNvbi1ib29sZWFuJztcbiAgICAgIH0gZWxzZSBpZiAoL251bGwvLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgIGNscyA9ICdqc29uLW51bGwnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwiJyArIGNscyArICdcIj4nICsgbWF0Y2ggKyAnPC9zcGFuPic7XG4gICAgfSk7XG5cbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVEaWFsb2dFbGVtKHdpbmRvdy5kb2N1bWVudC5ib2R5LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQpO1xuXG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgIHdpZHRoOiA5MDAsXG4gICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLlhbPpl61cIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCLlpI3liLblubblhbPpl61cIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICBCYXNlVXRpbGl0eS5Db3B5VmFsdWVDbGlwYm9hcmQoJChcIi5qc29uLXByZVwiKS50ZXh0KCkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb3BlbjogZnVuY3Rpb24gb3BlbigpIHt9LFxuICAgICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKCkge31cbiAgICB9O1xuICAgICQoaHRtbEVsZW0pLmh0bWwoXCI8ZGl2IGlkPSdwc2NvbnRhaW5lcicgc3R5bGU9J3dpZHRoOiAxMDAlO2hlaWdodDogMTAwJTtvdmVyZmxvdzogYXV0bztwb3NpdGlvbjogcmVsYXRpdmU7Jz48cHJlIGNsYXNzPSdqc29uLXByZSc+XCIgKyBqc29uICsgXCI8L3ByZT48L2Rpdj5cIik7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICAgIHZhciBwcyA9IG5ldyBQZXJmZWN0U2Nyb2xsYmFyKCcjcHNjb250YWluZXInKTtcbiAgfSxcbiAgU2hvd0hUTUw6IGZ1bmN0aW9uIFNob3dIVE1MKG9wZW5lcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbE1zZywgY2xvc2VfYWZ0ZXJfZXZlbnQsIHBhcmFtcykge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlbmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjbG9zZV9hZnRlcl9ldmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNsb3NlX2FmdGVyX2V2ZW50KHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxNc2cpO1xuICAgIHJldHVybiAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gIH0sXG4gIEFsZXJ0TG9hZGluZzogZnVuY3Rpb24gQWxlcnRMb2FkaW5nKG9wZW5lcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbE1zZykge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZUFsZXJ0TG9hZGluZ01zZ0VsZW1lbnQob3BlbmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWVcbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuZmluZChcIi5hbGVydGxvYWRpbmctdHh0XCIpLmh0bWwoaHRtbE1zZyk7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICB9LFxuICBDb25maXJtOiBmdW5jdGlvbiBDb25maXJtKG9wZW5lcldpbmRvdywgaHRtbE1zZywgb2tGbiwgY2FsbGVyKSB7XG4gICAgdGhpcy5Db25maXJtQ29uZmlnKG9wZW5lcldpbmRvdywgaHRtbE1zZywgbnVsbCwgb2tGbiwgY2FsbGVyKTtcbiAgfSxcbiAgQ29uZmlybUNvbmZpZzogZnVuY3Rpb24gQ29uZmlybUNvbmZpZyhvcGVuZXJXaW5kb3csIGh0bWxNc2csIGNvbmZpZywgb2tGbiwgY2FsbGVyKSB7XG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbShvcGVuZXJXaW5kb3cuZG9jdW1lbnQuYm9keSwgXCJBbGVydENvbmZpcm1Nc2dcIik7XG5cbiAgICB2YXIgcGFyYXMgPSBudWxsO1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgb2tmdW5jOiBmdW5jdGlvbiBva2Z1bmMocGFyYXMpIHtcbiAgICAgICAgaWYgKG9rRm4gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKGNhbGxlcikge1xuICAgICAgICAgICAgb2tGbi5jYWxsKGNhbGxlcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBva0ZuKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9wZW5lcldpbmRvdy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY2FuY2VsZnVuYzogZnVuY3Rpb24gY2FuY2VsZnVuYyhwYXJhcykge30sXG4gICAgICB2YWxpZGF0ZWZ1bmM6IGZ1bmN0aW9uIHZhbGlkYXRlZnVuYyhwYXJhcykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBjbG9zZWFmdGVyZnVuYzogdHJ1ZSxcbiAgICAgIGhlaWdodDogMjAwLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIHRpdGxlOiBcIuezu+e7n+aPkOekulwiLFxuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgYnV0dG9uczoge1xuICAgICAgICBcIuehruiupFwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgIGlmIChkZWZhdWx0Q29uZmlnLnZhbGlkYXRlZnVuYyhwYXJhcykpIHtcbiAgICAgICAgICAgIHZhciByID0gZGVmYXVsdENvbmZpZy5va2Z1bmMocGFyYXMpO1xuICAgICAgICAgICAgciA9IHIgPT0gbnVsbCA/IHRydWUgOiByO1xuXG4gICAgICAgICAgICBpZiAociAmJiBkZWZhdWx0Q29uZmlnLmNsb3NlYWZ0ZXJmdW5jKSB7XG4gICAgICAgICAgICAgICQoaHRtbEVsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCLlj5bmtohcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICBkZWZhdWx0Q29uZmlnLmNhbmNlbGZ1bmMocGFyYXMpO1xuXG4gICAgICAgICAgaWYgKGRlZmF1bHRDb25maWcuY2xvc2VhZnRlcmZ1bmMpIHtcbiAgICAgICAgICAgICQoaHRtbEVsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxNc2cpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcbiAgICBwYXJhcyA9IHtcbiAgICAgIFwiRWxlbWVudE9ialwiOiBodG1sRWxlbVxuICAgIH07XG4gIH0sXG4gIFByb21wdDogZnVuY3Rpb24gUHJvbXB0KG9wZW5lcldpbmRvdywgY29uZmlnLCBkaWFsb2dJZCwgbGFiZWxNc2csIG9rRnVuYykge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlbmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBwYXJhcyA9IG51bGw7XG4gICAgdmFyIHRleHRBcmVhID0gJChcIjx0ZXh0YXJlYSAvPlwiKTtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIGhlaWdodDogMjAwLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIHRpdGxlOiBcIlwiLFxuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgYnV0dG9uczoge1xuICAgICAgICBcIuehruiupFwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgIGlmICh0eXBlb2Ygb2tGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdmFyIGlucHV0VGV4dCA9IHRleHRBcmVhLnZhbCgpO1xuICAgICAgICAgICAgb2tGdW5jKGlucHV0VGV4dCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgIH0sXG4gICAgICAgIFwi5Y+W5raIXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJCh0ZXh0QXJlYSkuY3NzKFwiaGVpZ2h0XCIsIGRlZmF1bHRDb25maWcuaGVpZ2h0IC0gMTMwKS5jc3MoXCJ3aWR0aFwiLCBcIjEwMCVcIik7XG4gICAgdmFyIGh0bWxDb250ZW50ID0gJChcIjxkaXY+PGRpdiBzdHlsZT0nd2lkdGg6IDEwMCUnPlwiICsgbGFiZWxNc2cgKyBcIu+8mjwvZGl2PjwvZGl2PlwiKS5hcHBlbmQodGV4dEFyZWEpO1xuICAgICQoaHRtbEVsZW0pLmh0bWwoaHRtbENvbnRlbnQpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcbiAgfSxcbiAgRGlhbG9nRWxlbTogZnVuY3Rpb24gRGlhbG9nRWxlbShlbGVtSWQsIGNvbmZpZykge1xuICAgICQoXCIjXCIgKyBlbGVtSWQpLmRpYWxvZyhjb25maWcpO1xuICB9LFxuICBEaWFsb2dFbGVtT2JqOiBmdW5jdGlvbiBEaWFsb2dFbGVtT2JqKGVsZW1PYmosIGNvbmZpZykge1xuICAgICQoZWxlbU9iaikuZGlhbG9nKGNvbmZpZyk7XG4gIH0sXG4gIE9wZW5JZnJhbWVXaW5kb3c6IGZ1bmN0aW9uIE9wZW5JZnJhbWVXaW5kb3cob3BlbmVyd2luZG93LCBkaWFsb2dJZCwgdXJsLCBvcHRpb25zLCB3aHR5cGUpIHtcbiAgICB2YXIgZGVmYXVsdG9wdGlvbnMgPSB7XG4gICAgICBoZWlnaHQ6IDQxMCxcbiAgICAgIHdpZHRoOiA2MDAsXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgIHZhciBhdXRvZGlhbG9nSWQgPSAkKHRoaXMpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgJCh0aGlzKS5maW5kKFwiaWZyYW1lXCIpLnJlbW92ZSgpO1xuICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgJCh0aGlzKS5kaWFsb2coXCJkZXN0cm95XCIpO1xuICAgICAgICAkKFwiI1wiICsgYXV0b2RpYWxvZ0lkKS5yZW1vdmUoKTtcblxuICAgICAgICBpZiAoQnJvd3NlckluZm9VdGlsaXR5LklzSUU4RG9jdW1lbnRNb2RlKCkpIHtcbiAgICAgICAgICBDb2xsZWN0R2FyYmFnZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNsb3NlX2FmdGVyX2V2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIG9wdGlvbnMuY2xvc2VfYWZ0ZXJfZXZlbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKCQoXCIjRm9yZm9jdXNcIikubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJChcIiNGb3Jmb2N1c1wiKVswXS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHdodHlwZSA9PSAxKSB7XG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICBoZWlnaHQ6IDY4MCxcbiAgICAgICAgd2lkdGg6IDk4MFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gMikge1xuICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgIHdpZHRoOiA4MDBcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDQpIHtcbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgIGhlaWdodDogMzgwLFxuICAgICAgICB3aWR0aDogNDgwXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSA1KSB7XG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICBoZWlnaHQ6IDE4MCxcbiAgICAgICAgd2lkdGg6IDMwMFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMud2lkdGggPT0gMCkge1xuICAgICAgb3B0aW9ucy53aWR0aCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZVdpZHRoKCkgLSAyMDtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5oZWlnaHQgPT0gMCkge1xuICAgICAgb3B0aW9ucy5oZWlnaHQgPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSAtIDEwO1xuICAgIH1cblxuICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCBvcHRpb25zKTtcbiAgICB2YXIgYXV0b2RpYWxvZ0lkID0gZGlhbG9nSWQ7XG5cbiAgICB2YXIgZGlhbG9nRWxlID0gdGhpcy5fQ3JlYXRlSWZybWFlRGlhbG9nRWxlbWVudChvcGVuZXJ3aW5kb3cuZG9jdW1lbnQsIGF1dG9kaWFsb2dJZCwgdXJsKTtcblxuICAgIHZhciBkaWFsb2dPYmogPSAkKGRpYWxvZ0VsZSkuZGlhbG9nKGRlZmF1bHRvcHRpb25zKTtcbiAgICB2YXIgJGlmcmFtZW9iaiA9ICQoZGlhbG9nRWxlKS5maW5kKFwiaWZyYW1lXCIpO1xuICAgICRpZnJhbWVvYmoub24oXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChTdHJpbmdVdGlsaXR5LklzU2FtZU9yZ2luKHdpbmRvdy5sb2NhdGlvbi5ocmVmLCB1cmwpKSB7XG4gICAgICAgIHRoaXMuY29udGVudFdpbmRvdy5GcmFtZVdpbmRvd0lkID0gYXV0b2RpYWxvZ0lkO1xuICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuT3BlbmVyV2luZG93T2JqID0gb3BlbmVyd2luZG93O1xuICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuSXNPcGVuRm9yRnJhbWUgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCLot6jln59JZnJhbWUs5peg5rOV6K6+572u5bGe5oCnIVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAkaWZyYW1lb2JqLmF0dHIoXCJzcmNcIiwgdXJsKTtcbiAgICByZXR1cm4gZGlhbG9nT2JqO1xuICB9LFxuICBDbG9zZU9wZW5JZnJhbWVXaW5kb3c6IGZ1bmN0aW9uIENsb3NlT3BlbklmcmFtZVdpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkKSB7XG4gICAgb3BlbmVyd2luZG93Lk9wZW5lcldpbmRvd09iai5EaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKGRpYWxvZ0lkKTtcbiAgfSxcbiAgQ2xvc2VEaWFsb2dFbGVtOiBmdW5jdGlvbiBDbG9zZURpYWxvZ0VsZW0oZGlhbG9nRWxlbSkge1xuICAgICQoZGlhbG9nRWxlbSkuZmluZChcImlmcmFtZVwiKS5yZW1vdmUoKTtcbiAgICAkKGRpYWxvZ0VsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICgkKFwiI0ZvcmZvY3VzXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJChcIiNGb3Jmb2N1c1wiKVswXS5mb2N1cygpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH0sXG4gIENsb3NlRGlhbG9nOiBmdW5jdGlvbiBDbG9zZURpYWxvZyhkaWFsb2dJZCkge1xuICAgIHRoaXMuQ2xvc2VEaWFsb2dFbGVtKHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpKTtcbiAgfSxcbiAgT3Blbk5ld1dpbmRvdzogZnVuY3Rpb24gT3Blbk5ld1dpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSkge1xuICAgIHZhciB3aWR0aCA9IDA7XG4gICAgdmFyIGhlaWdodCA9IDA7XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgd2lkdGggPSBvcHRpb25zLndpZHRoO1xuICAgICAgaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XG4gICAgfVxuXG4gICAgdmFyIGxlZnQgPSBwYXJzZUludCgoc2NyZWVuLmF2YWlsV2lkdGggLSB3aWR0aCkgLyAyKS50b1N0cmluZygpO1xuICAgIHZhciB0b3AgPSBwYXJzZUludCgoc2NyZWVuLmF2YWlsSGVpZ2h0IC0gaGVpZ2h0KSAvIDIpLnRvU3RyaW5nKCk7XG5cbiAgICBpZiAod2lkdGgudG9TdHJpbmcoKSA9PSBcIjBcIiAmJiBoZWlnaHQudG9TdHJpbmcoKSA9PSBcIjBcIikge1xuICAgICAgd2lkdGggPSB3aW5kb3cuc2NyZWVuLmF2YWlsV2lkdGggLSAzMDtcbiAgICAgIGhlaWdodCA9IHdpbmRvdy5zY3JlZW4uYXZhaWxIZWlnaHQgLSA2MDtcbiAgICAgIGxlZnQgPSBcIjBcIjtcbiAgICAgIHRvcCA9IFwiMFwiO1xuICAgIH1cblxuICAgIHZhciB3aW5IYW5kbGUgPSB3aW5kb3cub3Blbih1cmwsIFwiXCIsIFwic2Nyb2xsYmFycz1ubyx0b29sYmFyPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPXllcyxjZW50ZXI9eWVzLGhlbHA9bm8sIHN0YXR1cz15ZXMsdG9wPSBcIiArIHRvcCArIFwicHgsbGVmdD1cIiArIGxlZnQgKyBcInB4LHdpZHRoPVwiICsgd2lkdGggKyBcInB4LGhlaWdodD1cIiArIGhlaWdodCArIFwicHhcIik7XG5cbiAgICBpZiAod2luSGFuZGxlID09IG51bGwpIHtcbiAgICAgIGFsZXJ0KFwi6K+36Kej6Zmk5rWP6KeI5Zmo5a+55pys57O757uf5by55Ye656qX5Y+j55qE6Zi75q2i6K6+572u77yBXCIpO1xuICAgIH1cbiAgfSxcbiAgX1RyeUdldFBhcmVudFdpbmRvdzogZnVuY3Rpb24gX1RyeUdldFBhcmVudFdpbmRvdyh3aW4pIHtcbiAgICBpZiAod2luLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gd2luLnBhcmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgX0ZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqOiBmdW5jdGlvbiBfRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmood2luLCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKSB7XG4gICAgaWYgKHRyeWZpbmR0aW1lID4gY3VycmVudHRyeWZpbmR0aW1lKSB7XG4gICAgICB2YXIgaXN0b3BGcmFtZXBhZ2UgPSBmYWxzZTtcbiAgICAgIGN1cnJlbnR0cnlmaW5kdGltZSsrO1xuXG4gICAgICB0cnkge1xuICAgICAgICBpc3RvcEZyYW1lcGFnZSA9IHdpbi5Jc1RvcEZyYW1lUGFnZTtcblxuICAgICAgICBpZiAoaXN0b3BGcmFtZXBhZ2UpIHtcbiAgICAgICAgICByZXR1cm4gd2luO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaih0aGlzLl9UcnlHZXRQYXJlbnRXaW5kb3cod2luKSwgdHJ5ZmluZHRpbWUsIGN1cnJlbnR0cnlmaW5kdGltZSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0ZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqKHRoaXMuX1RyeUdldFBhcmVudFdpbmRvdyh3aW4pLCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgX09wZW5XaW5kb3dJbkZyYW1lUGFnZTogZnVuY3Rpb24gX09wZW5XaW5kb3dJbkZyYW1lUGFnZShvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSkge1xuICAgIGlmIChTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkoZGlhbG9nSWQpKSB7XG4gICAgICBhbGVydChcImRpYWxvZ0lk5LiN6IO95Li656m6XCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHVybCA9IEJhc2VVdGlsaXR5LkFwcGVuZFRpbWVTdGFtcFVybCh1cmwpO1xuICAgIHZhciBhdXRvZGlhbG9nSWQgPSBcIkZyYW1lRGlhbG9nRWxlXCIgKyBkaWFsb2dJZDtcblxuICAgIGlmICgkKHRoaXMuRnJhbWVQYWdlUmVmLmRvY3VtZW50KS5maW5kKFwiI1wiICsgYXV0b2RpYWxvZ0lkKS5sZW5ndGggPT0gMCkge1xuICAgICAgdmFyIGRpYWxvZ0VsZSA9IHRoaXMuX0NyZWF0ZUlmcm1hZURpYWxvZ0VsZW1lbnQodGhpcy5GcmFtZVBhZ2VSZWYuZG9jdW1lbnQsIGF1dG9kaWFsb2dJZCwgdXJsKTtcblxuICAgICAgdmFyIGRlZmF1bHRvcHRpb25zID0ge1xuICAgICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgICAgd2lkdGg6IDYwMCxcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHRpdGxlOiBcIuezu+e7n1wiLFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgdmFyIGF1dG9kaWFsb2dJZCA9ICQodGhpcykuYXR0cihcImlkXCIpO1xuICAgICAgICAgICQodGhpcykuZmluZChcImlmcmFtZVwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAkKHRoaXMpLmRpYWxvZyhcImRlc3Ryb3lcIik7XG4gICAgICAgICAgJChcIiNcIiArIGF1dG9kaWFsb2dJZCkucmVtb3ZlKCk7XG5cbiAgICAgICAgICBpZiAoQnJvd3NlckluZm9VdGlsaXR5LklzSUU4RG9jdW1lbnRNb2RlKCkpIHtcbiAgICAgICAgICAgIENvbGxlY3RHYXJiYWdlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNsb3NlX2FmdGVyX2V2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgb3B0aW9ucy5jbG9zZV9hZnRlcl9ldmVudCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKHdodHlwZSA9PSAwKSB7XG4gICAgICAgIG9wdGlvbnMud2lkdGggPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VXaWR0aCgpIC0gMjA7XG4gICAgICAgIG9wdGlvbnMuaGVpZ2h0ID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgLSAxODA7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSAxKSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiA2MTAsXG4gICAgICAgICAgd2lkdGg6IDk4MFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDIpIHtcbiAgICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgICB3aWR0aDogODAwXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gNCkge1xuICAgICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICAgIGhlaWdodDogMzgwLFxuICAgICAgICAgIHdpZHRoOiA0ODBcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSA1KSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiAxODAsXG4gICAgICAgICAgd2lkdGg6IDMwMFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMud2lkdGggPT0gMCkge1xuICAgICAgICBvcHRpb25zLndpZHRoID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKSAtIDIwO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5oZWlnaHQgPT0gMCkge1xuICAgICAgICBvcHRpb25zLmhlaWdodCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIC0gMTgwO1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAkKGRpYWxvZ0VsZSkuZGlhbG9nKGRlZmF1bHRvcHRpb25zKTtcbiAgICAgICQoXCIudWktd2lkZ2V0LW92ZXJsYXlcIikuY3NzKFwiekluZGV4XCIsIFwiMjAwMFwiKTtcbiAgICAgICQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCBcIjIwMDFcIik7XG4gICAgICB2YXIgJGlmcmFtZW9iaiA9ICQoZGlhbG9nRWxlKS5maW5kKFwiaWZyYW1lXCIpO1xuICAgICAgJGlmcmFtZW9iai5vbihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoU3RyaW5nVXRpbGl0eS5Jc1NhbWVPcmdpbih3aW5kb3cubG9jYXRpb24uaHJlZiwgdXJsKSkge1xuICAgICAgICAgIHRoaXMuY29udGVudFdpbmRvdy5GcmFtZVdpbmRvd0lkID0gYXV0b2RpYWxvZ0lkO1xuICAgICAgICAgIHRoaXMuY29udGVudFdpbmRvdy5PcGVuZXJXaW5kb3dPYmogPSBvcGVuZXJ3aW5kb3c7XG4gICAgICAgICAgdGhpcy5jb250ZW50V2luZG93LklzT3BlbkZvckZyYW1lID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIui3qOWfn0lmcmFtZSzml6Dms5Xorr7nva7lsZ7mgKchXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgICRpZnJhbWVvYmouYXR0cihcInNyY1wiLCB1cmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKFwiI1wiICsgYXV0b2RpYWxvZ0lkKS5kaWFsb2coXCJtb3ZlVG9Ub3BcIik7XG4gICAgfVxuICB9LFxuICBfRnJhbWVfRnJhbWVQYWdlQ2xvc2VEaWFsb2c6IGZ1bmN0aW9uIF9GcmFtZV9GcmFtZVBhZ2VDbG9zZURpYWxvZyhkaWFsb2dJZCkge1xuICAgICQoXCIjXCIgKyBkaWFsb2dJZCkuZGlhbG9nKFwiY2xvc2VcIik7XG4gIH0sXG4gIEZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqOiBmdW5jdGlvbiBGcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaigpIHtcbiAgICB2YXIgdHJ5ZmluZHRpbWUgPSA1O1xuICAgIHZhciBjdXJyZW50dHJ5ZmluZHRpbWUgPSAxO1xuICAgIHJldHVybiB0aGlzLl9GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaih3aW5kb3csIHRyeWZpbmR0aW1lLCBjdXJyZW50dHJ5ZmluZHRpbWUpO1xuICB9LFxuICBGcmFtZV9BbGVydDogZnVuY3Rpb24gRnJhbWVfQWxlcnQoKSB7fSxcbiAgRnJhbWVfQ29tZmlybTogZnVuY3Rpb24gRnJhbWVfQ29tZmlybSgpIHt9LFxuICBGcmFtZV9PcGVuSWZyYW1lV2luZG93OiBmdW5jdGlvbiBGcmFtZV9PcGVuSWZyYW1lV2luZG93KG9wZW5lcndpbmRvdywgZGlhbG9nSWQsIHVybCwgb3B0aW9ucywgd2h0eXBlKSB7XG4gICAgaWYgKHVybCA9PSBcIlwiKSB7XG4gICAgICBhbGVydChcInVybOS4jeiDveS4uuepuuWtl+espuS4siFcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHdyd2luID0gdGhpcy5GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaigpO1xuICAgIHRoaXMuRnJhbWVQYWdlUmVmID0gd3J3aW47XG5cbiAgICBpZiAod3J3aW4gIT0gbnVsbCkge1xuICAgICAgdGhpcy5GcmFtZVBhZ2VSZWYuRGlhbG9nVXRpbGl0eS5GcmFtZVBhZ2VSZWYgPSB3cndpbjtcblxuICAgICAgdGhpcy5GcmFtZVBhZ2VSZWYuRGlhbG9nVXRpbGl0eS5fT3BlbldpbmRvd0luRnJhbWVQYWdlKG9wZW5lcndpbmRvdywgZGlhbG9nSWQsIHVybCwgb3B0aW9ucywgd2h0eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxlcnQoXCLmib7kuI3liLBGcmFtZVBhZ2UhIVwiKTtcbiAgICB9XG4gIH0sXG4gIEZyYW1lX0Nsb3NlRGlhbG9nOiBmdW5jdGlvbiBGcmFtZV9DbG9zZURpYWxvZyhvcGVuZXJXaW5kb3cpIHtcbiAgICB2YXIgd3J3aW4gPSB0aGlzLkZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqKCk7XG4gICAgdmFyIG9wZW5lcndpbiA9IG9wZW5lcldpbmRvdy5PcGVuZXJXaW5kb3dPYmo7XG4gICAgdmFyIGF1dG9kaWFsb2dJZCA9IG9wZW5lcldpbmRvdy5GcmFtZVdpbmRvd0lkO1xuXG4gICAgd3J3aW4uRGlhbG9nVXRpbGl0eS5fRnJhbWVfRnJhbWVQYWdlQ2xvc2VEaWFsb2coYXV0b2RpYWxvZ0lkKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERpY3Rpb25hcnlVdGlsaXR5ID0ge1xuICBfR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uOiBudWxsLFxuICBHcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb246IGZ1bmN0aW9uIEdyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbihzb3VyY2VEaWN0aW9uYXJ5SnNvbikge1xuICAgIGlmICh0aGlzLl9Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb24gPT0gbnVsbCkge1xuICAgICAgaWYgKHNvdXJjZURpY3Rpb25hcnlKc29uICE9IG51bGwpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGdyb3VwVmFsdWUgaW4gc291cmNlRGljdGlvbmFyeUpzb24pIHtcbiAgICAgICAgICByZXN1bHRbZ3JvdXBWYWx1ZV0gPSB7fTtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdFtncm91cFZhbHVlXVtzb3VyY2VEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXVtpXS5kaWN0VmFsdWVdID0gc291cmNlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV1baV0uZGljdFRleHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uID0gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb247XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjb25zb2xlID0gY29uc29sZSB8fCB7XG4gIGxvZzogZnVuY3Rpb24gbG9nKCkge30sXG4gIHdhcm46IGZ1bmN0aW9uIHdhcm4oKSB7fSxcbiAgZXJyb3I6IGZ1bmN0aW9uIGVycm9yKCkge31cbn07XG5cbmZ1bmN0aW9uIERhdGVFeHRlbmRfRGF0ZUZvcm1hdChkYXRlLCBmbXQpIHtcbiAgaWYgKG51bGwgPT0gZGF0ZSB8fCB1bmRlZmluZWQgPT0gZGF0ZSkgcmV0dXJuICcnO1xuICB2YXIgbyA9IHtcbiAgICBcIk0rXCI6IGRhdGUuZ2V0TW9udGgoKSArIDEsXG4gICAgXCJkK1wiOiBkYXRlLmdldERhdGUoKSxcbiAgICBcImgrXCI6IGRhdGUuZ2V0SG91cnMoKSxcbiAgICBcIm0rXCI6IGRhdGUuZ2V0TWludXRlcygpLFxuICAgIFwicytcIjogZGF0ZS5nZXRTZWNvbmRzKCksXG4gICAgXCJTXCI6IGRhdGUuZ2V0TWlsbGlzZWNvbmRzKClcbiAgfTtcbiAgaWYgKC8oeSspLy50ZXN0KGZtdCkpIGZtdCA9IGZtdC5yZXBsYWNlKFJlZ0V4cC4kMSwgKGRhdGUuZ2V0RnVsbFllYXIoKSArIFwiXCIpLnN1YnN0cig0IC0gUmVnRXhwLiQxLmxlbmd0aCkpO1xuXG4gIGZvciAodmFyIGsgaW4gbykge1xuICAgIGlmIChuZXcgUmVnRXhwKFwiKFwiICsgayArIFwiKVwiKS50ZXN0KGZtdCkpIGZtdCA9IGZtdC5yZXBsYWNlKFJlZ0V4cC4kMSwgUmVnRXhwLiQxLmxlbmd0aCA9PSAxID8gb1trXSA6IChcIjAwXCIgKyBvW2tdKS5zdWJzdHIoKFwiXCIgKyBvW2tdKS5sZW5ndGgpKTtcbiAgfVxuXG4gIHJldHVybiBmbXQ7XG59XG5cbkRhdGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIERhdGVFeHRlbmRfRGF0ZUZvcm1hdCh0aGlzLCAneXl5eS1NTS1kZCBtbTpoaDpzcycpO1xufTtcblxuaWYgKCFPYmplY3QuY3JlYXRlKSB7XG4gIE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgYWxlcnQoXCJFeHRlbmQgT2JqZWN0LmNyZWF0ZVwiKTtcblxuICAgIGZ1bmN0aW9uIEYoKSB7fVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ09iamVjdC5jcmVhdGUgaW1wbGVtZW50YXRpb24gb25seSBhY2NlcHRzIG9uZSBwYXJhbWV0ZXIuJyk7XG4gICAgICB9XG5cbiAgICAgIEYucHJvdG90eXBlID0gbztcbiAgICAgIHJldHVybiBuZXcgRigpO1xuICAgIH07XG4gIH0oKTtcbn1cblxuJC5mbi5vdXRlckhUTUwgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAhdGhpcy5sZW5ndGggPyB0aGlzIDogdGhpc1swXS5vdXRlckhUTUwgfHwgZnVuY3Rpb24gKGVsKSB7XG4gICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChlbC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgIHZhciBjb250ZW50cyA9IGRpdi5pbm5lckhUTUw7XG4gICAgZGl2ID0gbnVsbDtcbiAgICBhbGVydChjb250ZW50cyk7XG4gICAgcmV0dXJuIGNvbnRlbnRzO1xuICB9KHRoaXNbMF0pO1xufTtcblxuZnVuY3Rpb24gcmVmQ3NzTGluayhocmVmKSB7XG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICBzdHlsZS5yZWwgPSAnc3R5bGVzaGVldCc7XG4gIHN0eWxlLmhyZWYgPSBocmVmO1xuICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgcmV0dXJuIHN0eWxlLnNoZWV0IHx8IHN0eWxlLnN0eWxlU2hlZXQ7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBKQnVpbGQ0RENZYW1sID0ge1xuICBfY2xpZW50Q2xpZW50U3lzdGVtVGl0bGU6IG51bGwsXG4gIEdldENsaWVudFN5c3RlbVRpdGxlOiBmdW5jdGlvbiBHZXRDbGllbnRTeXN0ZW1UaXRsZSgpIHtcbiAgICB2YXIgc3RvcmVLZXkgPSBcIkpCdWlsZDREQ1lhbWwuX2NsaWVudENsaWVudFN5c3RlbVRpdGxlXCI7XG5cbiAgICBpZiAoTG9jYWxTdG9yYWdlVXRpbGl0eS5nZXRJdGVtSW5TZXNzaW9uU3RvcmFnZShzdG9yZUtleSkpIHtcbiAgICAgIHJldHVybiBMb2NhbFN0b3JhZ2VVdGlsaXR5LmdldEl0ZW1JblNlc3Npb25TdG9yYWdlKHN0b3JlS2V5KTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2NsaWVudENsaWVudFN5c3RlbVRpdGxlKSB7XG4gICAgICBpZiAoIXdpbmRvdy5wYXJlbnQuSkJ1aWxkNERDWWFtbC5fY2xpZW50Q2xpZW50U3lzdGVtVGl0bGUpIHtcbiAgICAgICAgQWpheFV0aWxpdHkuR2V0U3luYyhcIi9SZXN0L0pCdWlsZDREQ1lhbWwvR2V0Q2xpZW50U3lzdGVtVGl0bGVcIiwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuX2NsaWVudENsaWVudFN5c3RlbVRpdGxlID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgICBMb2NhbFN0b3JhZ2VVdGlsaXR5LnNldEl0ZW1JblNlc3Npb25TdG9yYWdlKHN0b3JlS2V5LCB0aGlzLl9jbGllbnRDbGllbnRTeXN0ZW1UaXRsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NsaWVudENsaWVudFN5c3RlbVRpdGxlID0gd2luZG93LnBhcmVudC5KQnVpbGQ0RENZYW1sLl9jbGllbnRDbGllbnRTeXN0ZW1UaXRsZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fY2xpZW50Q2xpZW50U3lzdGVtVGl0bGU7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBKc29uVXRpbGl0eSA9IHtcbiAgUGFyc2VBcnJheUpzb25Ub1RyZWVKc29uOiBmdW5jdGlvbiBQYXJzZUFycmF5SnNvblRvVHJlZUpzb24oY29uZmlnLCBzb3VyY2VBcnJheSwgcm9vdElkKSB7XG4gICAgdmFyIF9jb25maWcgPSB7XG4gICAgICBLZXlGaWVsZDogXCJcIixcbiAgICAgIFJlbGF0aW9uRmllbGQ6IFwiXCIsXG4gICAgICBDaGlsZEZpZWxkTmFtZTogXCJcIlxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBGaW5kSnNvbkJ5SWQoa2V5RmllbGQsIGlkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzb3VyY2VBcnJheVtpXVtrZXlGaWVsZF0gPT0gaWQpIHtcbiAgICAgICAgICByZXR1cm4gc291cmNlQXJyYXlbaV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYWxlcnQoXCJQYXJzZUFycmF5SnNvblRvVHJlZUpzb24uRmluZEpzb25CeUlkOuWcqHNvdXJjZUFycmF55Lit5om+5LiN5Yiw5oyH5a6aSWTnmoTorrDlvZVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gRmluZENoaWxkSnNvbihyZWxhdGlvbkZpZWxkLCBwaWQpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc291cmNlQXJyYXlbaV1bcmVsYXRpb25GaWVsZF0gPT0gcGlkKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goc291cmNlQXJyYXlbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gRmluZENoaWxkTm9kZUFuZFBhcnNlKHBpZCwgcmVzdWx0KSB7XG4gICAgICB2YXIgY2hpbGRqc29ucyA9IEZpbmRDaGlsZEpzb24oY29uZmlnLlJlbGF0aW9uRmllbGQsIHBpZCk7XG5cbiAgICAgIGlmIChjaGlsZGpzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHJlc3VsdFtjb25maWcuQ2hpbGRGaWVsZE5hbWVdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlc3VsdFtjb25maWcuQ2hpbGRGaWVsZE5hbWVdID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkanNvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgdG9PYmogPSB7fTtcbiAgICAgICAgICB0b09iaiA9IEpzb25VdGlsaXR5LlNpbXBsZUNsb25lQXR0cih0b09iaiwgY2hpbGRqc29uc1tpXSk7XG4gICAgICAgICAgcmVzdWx0W2NvbmZpZy5DaGlsZEZpZWxkTmFtZV0ucHVzaCh0b09iaik7XG4gICAgICAgICAgdmFyIGlkID0gdG9PYmpbY29uZmlnLktleUZpZWxkXTtcbiAgICAgICAgICBGaW5kQ2hpbGROb2RlQW5kUGFyc2UoaWQsIHRvT2JqKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIgcm9vdEpzb24gPSBGaW5kSnNvbkJ5SWQoY29uZmlnLktleUZpZWxkLCByb290SWQpO1xuICAgIHJlc3VsdCA9IHRoaXMuU2ltcGxlQ2xvbmVBdHRyKHJlc3VsdCwgcm9vdEpzb24pO1xuICAgIEZpbmRDaGlsZE5vZGVBbmRQYXJzZShyb290SWQsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgUmVzb2x2ZVNpbXBsZUFycmF5SnNvblRvVHJlZUpzb246IGZ1bmN0aW9uIFJlc29sdmVTaW1wbGVBcnJheUpzb25Ub1RyZWVKc29uKGNvbmZpZywgc291cmNlSnNvbiwgcm9vdE5vZGVJZCkge1xuICAgIGFsZXJ0KFwiSnNvblV0aWxpdHkuUmVzb2x2ZVNpbXBsZUFycmF5SnNvblRvVHJlZUpzb24g5bey5YGc55SoXCIpO1xuICB9LFxuICBTaW1wbGVDbG9uZUF0dHI6IGZ1bmN0aW9uIFNpbXBsZUNsb25lQXR0cih0b09iaiwgZnJvbU9iaikge1xuICAgIGZvciAodmFyIGF0dHIgaW4gZnJvbU9iaikge1xuICAgICAgdG9PYmpbYXR0cl0gPSBmcm9tT2JqW2F0dHJdO1xuICAgIH1cblxuICAgIHJldHVybiB0b09iajtcbiAgfSxcbiAgQ2xvbmVTaW1wbGU6IGZ1bmN0aW9uIENsb25lU2ltcGxlKHNvdXJjZSkge1xuICAgIHZhciBuZXdKc29uID0galF1ZXJ5LmV4dGVuZCh0cnVlLCB7fSwgc291cmNlKTtcbiAgICByZXR1cm4gbmV3SnNvbjtcbiAgfSxcbiAgQ2xvbmVTdHJpbmdpZnk6IGZ1bmN0aW9uIENsb25lU3RyaW5naWZ5KHNvdXJjZSkge1xuICAgIHZhciBuZXdKc29uID0gdGhpcy5Kc29uVG9TdHJpbmcoc291cmNlKTtcbiAgICByZXR1cm4gdGhpcy5TdHJpbmdUb0pzb24obmV3SnNvbik7XG4gIH0sXG4gIEpzb25Ub1N0cmluZzogZnVuY3Rpb24gSnNvblRvU3RyaW5nKG9iaikge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICB9LFxuICBKc29uVG9TdHJpbmdGb3JtYXQ6IGZ1bmN0aW9uIEpzb25Ub1N0cmluZ0Zvcm1hdChvYmopIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCAyKTtcbiAgfSxcbiAgU3RyaW5nVG9Kc29uOiBmdW5jdGlvbiBTdHJpbmdUb0pzb24oc3RyKSB7XG4gICAgcmV0dXJuIGV2YWwoXCIoXCIgKyBzdHIgKyBcIilcIik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBMaXN0UGFnZVV0aWxpdHkgPSB7XG4gIERlZmF1bHRMaXN0SGVpZ2h0OiBmdW5jdGlvbiBEZWZhdWx0TGlzdEhlaWdodCgpIHtcbiAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgPiA3ODApIHtcbiAgICAgIHJldHVybiA2Nzg7XG4gICAgfSBlbHNlIGlmIChQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSA+IDY4MCkge1xuICAgICAgcmV0dXJuIDU3ODtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDM3ODtcbiAgICB9XG4gIH0sXG4gIERlZmF1bHRMaXN0SGVpZ2h0XzUwOiBmdW5jdGlvbiBEZWZhdWx0TGlzdEhlaWdodF81MCgpIHtcbiAgICByZXR1cm4gdGhpcy5EZWZhdWx0TGlzdEhlaWdodCgpIC0gNTA7XG4gIH0sXG4gIERlZmF1bHRMaXN0SGVpZ2h0XzgwOiBmdW5jdGlvbiBEZWZhdWx0TGlzdEhlaWdodF84MCgpIHtcbiAgICByZXR1cm4gdGhpcy5EZWZhdWx0TGlzdEhlaWdodCgpIC0gODA7XG4gIH0sXG4gIERlZmF1bHRMaXN0SGVpZ2h0XzEwMDogZnVuY3Rpb24gRGVmYXVsdExpc3RIZWlnaHRfMTAwKCkge1xuICAgIHJldHVybiB0aGlzLkRlZmF1bHRMaXN0SGVpZ2h0KCkgLSAxMDA7XG4gIH0sXG4gIEdldEdlbmVyYWxQYWdlSGVpZ2h0OiBmdW5jdGlvbiBHZXRHZW5lcmFsUGFnZUhlaWdodChmaXhIZWlnaHQpIHtcbiAgICB2YXIgcGFnZUhlaWdodCA9IGpRdWVyeShkb2N1bWVudCkuaGVpZ2h0KCk7XG5cbiAgICBpZiAoJChcIiNsaXN0LXNpbXBsZS1zZWFyY2gtd3JhcFwiKS5sZW5ndGggPiAwKSB7XG4gICAgICBwYWdlSGVpZ2h0ID0gcGFnZUhlaWdodCAtICQoXCIjbGlzdC1zaW1wbGUtc2VhcmNoLXdyYXBcIikub3V0ZXJIZWlnaHQoKSArIGZpeEhlaWdodCAtICQoXCIjbGlzdC1idXR0b24td3JhcFwiKS5vdXRlckhlaWdodCgpIC0gJChcIiNsaXN0LXBhZ2VyLXdyYXBcIikub3V0ZXJIZWlnaHQoKSAtIDMwO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYWdlSGVpZ2h0ID0gcGFnZUhlaWdodCAtICQoXCIjbGlzdC1idXR0b24td3JhcFwiKS5vdXRlckhlaWdodCgpICsgZml4SGVpZ2h0IC0gKCQoXCIjbGlzdC1wYWdlci13cmFwXCIpLmxlbmd0aCA+IDAgPyAkKFwiI2xpc3QtcGFnZXItd3JhcFwiKS5vdXRlckhlaWdodCgpIDogMCkgLSAzMDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFnZUhlaWdodDtcbiAgfSxcbiAgR2V0Rml4SGVpZ2h0OiBmdW5jdGlvbiBHZXRGaXhIZWlnaHQoKSB7XG4gICAgcmV0dXJuIC03MDtcbiAgfSxcbiAgSVZpZXdUYWJsZVJlbmRlcmVyOiB7XG4gICAgVG9EYXRlWVlZWV9NTV9ERDogZnVuY3Rpb24gVG9EYXRlWVlZWV9NTV9ERChoLCBkYXRldGltZSkge1xuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRldGltZSk7XG4gICAgICB2YXIgZGF0ZVN0ciA9IERhdGVVdGlsaXR5LkZvcm1hdChkYXRlLCAneXl5eS1NTS1kZCcpO1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIGRhdGVTdHIpO1xuICAgIH0sXG4gICAgU3RyaW5nVG9EYXRlWVlZWV9NTV9ERDogZnVuY3Rpb24gU3RyaW5nVG9EYXRlWVlZWV9NTV9ERChoLCBkYXRldGltZSkge1xuICAgICAgdmFyIGRhdGVTdHIgPSBkYXRldGltZS5zcGxpdChcIiBcIilbMF07XG4gICAgICByZXR1cm4gaCgnZGl2JywgZGF0ZVN0cik7XG4gICAgfSxcbiAgICBUb1N0YXR1c0VuYWJsZTogZnVuY3Rpb24gVG9TdGF0dXNFbmFibGUoaCwgc3RhdHVzKSB7XG4gICAgICBpZiAoc3RhdHVzID09IDApIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi56aB55SoXCIpO1xuICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT0gMSkge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLlkK/nlKhcIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBUb1llc05vRW5hYmxlOiBmdW5jdGlvbiBUb1llc05vRW5hYmxlKGgsIHN0YXR1cykge1xuICAgICAgaWYgKHN0YXR1cyA9PSAwKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuWQplwiKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09IDEpIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5pivXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgVG9EaWN0aW9uYXJ5VGV4dDogZnVuY3Rpb24gVG9EaWN0aW9uYXJ5VGV4dChoLCBkaWN0aW9uYXJ5SnNvbiwgZ3JvdXBWYWx1ZSwgZGljdGlvbmFyeVZhbHVlKSB7XG4gICAgICB2YXIgc2ltcGxlRGljdGlvbmFyeUpzb24gPSBEaWN0aW9uYXJ5VXRpbGl0eS5Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb24oZGljdGlvbmFyeUpzb24pO1xuXG4gICAgICBpZiAoZGljdGlvbmFyeVZhbHVlID09IG51bGwgfHwgZGljdGlvbmFyeVZhbHVlID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwiXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2ltcGxlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChzaW1wbGVEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXSkge1xuICAgICAgICAgIGlmIChzaW1wbGVEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXVtkaWN0aW9uYXJ5VmFsdWVdKSB7XG4gICAgICAgICAgICByZXR1cm4gaCgnZGl2Jywgc2ltcGxlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV1bZGljdGlvbmFyeVZhbHVlXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuaJvuS4jeWIsOijheaNoueahFRFWFRcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuaJvuS4jeWIsOijheaNoueahOWIhue7hFwiKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5om+5LiN5Yiw6KOF5o2i55qE5YiG57uEXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWQ6IGZ1bmN0aW9uIElWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkKHNlbGVjdGlvblJvd3MpIHtcbiAgICBpZiAoc2VsZWN0aW9uUm93cyAhPSBudWxsICYmIHNlbGVjdGlvblJvd3MubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGhlbjogZnVuY3Rpb24gdGhlbihmdW5jKSB7XG4gICAgICAgICAgZnVuYyhzZWxlY3Rpb25Sb3dzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5Lit6ZyA6KaB5pON5L2c55qE6KGMIVwiLCBudWxsKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4oZnVuYykge31cbiAgICAgIH07XG4gICAgfVxuICB9LFxuICBJVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZE9uZTogZnVuY3Rpb24gSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWRPbmUoc2VsZWN0aW9uUm93cykge1xuICAgIGlmIChzZWxlY3Rpb25Sb3dzICE9IG51bGwgJiYgc2VsZWN0aW9uUm93cy5sZW5ndGggPiAwICYmIHNlbGVjdGlvblJvd3MubGVuZ3RoID09IDEpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4oZnVuYykge1xuICAgICAgICAgIGZ1bmMoc2VsZWN0aW9uUm93cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieS4remcgOimgeaTjeS9nOeahOihjO+8jOavj+asoeWPquiDvemAieS4reS4gOihjCFcIiwgbnVsbCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKGZ1bmMpIHt9XG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXM6IGZ1bmN0aW9uIElWaWV3Q2hhbmdlU2VydmVyU3RhdHVzKHVybCwgc2VsZWN0aW9uUm93cywgaWRGaWVsZCwgc3RhdHVzTmFtZSwgcGFnZUFwcE9iaikge1xuICAgIHZhciBpZEFycmF5ID0gbmV3IEFycmF5KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGlvblJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlkQXJyYXkucHVzaChzZWxlY3Rpb25Sb3dzW2ldW2lkRmllbGRdKTtcbiAgICB9XG5cbiAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgaWRzOiBpZEFycmF5LmpvaW4oXCI7XCIpLFxuICAgICAgc3RhdHVzOiBzdGF0dXNOYW1lXG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgICBwYWdlQXBwT2JqLnJlbG9hZERhdGEoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICB9XG4gICAgfSwgcGFnZUFwcE9iaik7XG4gIH0sXG4gIElWaWV3TW92ZUZhY2U6IGZ1bmN0aW9uIElWaWV3TW92ZUZhY2UodXJsLCBzZWxlY3Rpb25Sb3dzLCBpZEZpZWxkLCB0eXBlLCBwYWdlQXBwT2JqKSB7XG4gICAgdGhpcy5JVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZE9uZShzZWxlY3Rpb25Sb3dzKS50aGVuKGZ1bmN0aW9uIChzZWxlY3Rpb25Sb3dzKSB7XG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgICByZWNvcmRJZDogc2VsZWN0aW9uUm93c1swXVtpZEZpZWxkXSxcbiAgICAgICAgdHlwZTogdHlwZVxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBwYWdlQXBwT2JqLnJlbG9hZERhdGEoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBwYWdlQXBwT2JqKTtcbiAgICB9KTtcbiAgfSxcbiAgSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXNGYWNlOiBmdW5jdGlvbiBJVmlld0NoYW5nZVNlcnZlclN0YXR1c0ZhY2UodXJsLCBzZWxlY3Rpb25Sb3dzLCBpZEZpZWxkLCBzdGF0dXNOYW1lLCBwYWdlQXBwT2JqKSB7XG4gICAgdGhpcy5JVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZChzZWxlY3Rpb25Sb3dzKS50aGVuKGZ1bmN0aW9uIChzZWxlY3Rpb25Sb3dzKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXModXJsLCBzZWxlY3Rpb25Sb3dzLCBpZEZpZWxkLCBzdGF0dXNOYW1lLCBwYWdlQXBwT2JqKTtcbiAgICB9KTtcbiAgfSxcbiAgSVZpZXdUYWJsZURlbGV0ZVJvdzogZnVuY3Rpb24gSVZpZXdUYWJsZURlbGV0ZVJvdyh1cmwsIHJlY29yZElkLCBwYWdlQXBwT2JqKSB7XG4gICAgRGlhbG9nVXRpbGl0eS5Db25maXJtKHdpbmRvdywgXCLnoa7orqTopoHliKDpmaTlvZPliY3orrDlvZXlkJfvvJ9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgQWpheFV0aWxpdHkuRGVsZXRlKHVybCwge1xuICAgICAgICByZWNvcmRJZDogcmVjb3JkSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLnJlbG9hZERhdGEoKTtcbiAgICAgICAgICB9LCBwYWdlQXBwT2JqKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgICAgfVxuICAgICAgfSwgcGFnZUFwcE9iaik7XG4gICAgfSwgcGFnZUFwcE9iaik7XG4gIH0sXG4gIElWaWV3VGFibGVCaW5kRGF0YUJ5U2VhcmNoOiBmdW5jdGlvbiBJVmlld1RhYmxlQmluZERhdGFCeVNlYXJjaChfY29uZmlnKSB7XG4gICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgIHVybDogXCJcIixcbiAgICAgIHBhZ2VOdW06IDEsXG4gICAgICBwYWdlU2l6ZTogMTIsXG4gICAgICBzZWFyY2hDb25kaXRpb246IG51bGwsXG4gICAgICBwYWdlQXBwT2JqOiBudWxsLFxuICAgICAgdGFibGVMaXN0OiBudWxsLFxuICAgICAgaWRGaWVsZDogXCJcIixcbiAgICAgIGF1dG9TZWxlY3RlZE9sZFJvd3M6IGZhbHNlLFxuICAgICAgc3VjY2Vzc0Z1bmM6IG51bGwsXG4gICAgICBsb2FkRGljdDogZmFsc2UsXG4gICAgICBjdXN0UGFyYXM6IHt9XG4gICAgfTtcbiAgICBjb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgY29uZmlnLCBfY29uZmlnKTtcblxuICAgIGlmICghY29uZmlnLnRhYmxlTGlzdCkge1xuICAgICAgY29uZmlnLnRhYmxlTGlzdCA9IGNvbmZpZy5wYWdlQXBwT2JqO1xuICAgIH1cblxuICAgIDtcbiAgICB2YXIgc2VuZERhdGEgPSB7XG4gICAgICBcInBhZ2VOdW1cIjogY29uZmlnLnBhZ2VOdW0sXG4gICAgICBcInBhZ2VTaXplXCI6IGNvbmZpZy5wYWdlU2l6ZSxcbiAgICAgIFwic2VhcmNoQ29uZGl0aW9uXCI6IFNlYXJjaFV0aWxpdHkuU2VyaWFsaXphdGlvblNlYXJjaENvbmRpdGlvbihjb25maWcuc2VhcmNoQ29uZGl0aW9uKSxcbiAgICAgIFwibG9hZERpY3RcIjogY29uZmlnLmxvYWREaWN0XG4gICAgfTtcblxuICAgIGZvciAodmFyIGtleSBpbiBjb25maWcuY3VzdFBhcmFzKSB7XG4gICAgICBzZW5kRGF0YVtrZXldID0gY29uZmlnLmN1c3RQYXJhc1trZXldO1xuICAgIH1cblxuICAgIEFqYXhVdGlsaXR5LlBvc3QoY29uZmlnLnVybCwgc2VuZERhdGEsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5zdWNjZXNzRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBjb25maWcuc3VjY2Vzc0Z1bmMuY2FsbChjb25maWcucGFnZUFwcE9iaiwgcmVzdWx0LCBjb25maWcucGFnZUFwcE9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIGNvbmZpZy50YWJsZUxpc3QucGFnZVRvdGFsID0gcmVzdWx0LmRhdGEudG90YWw7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5hdXRvU2VsZWN0ZWRPbGRSb3dzKSB7XG4gICAgICAgICAgaWYgKGNvbmZpZy50YWJsZUxpc3Quc2VsZWN0aW9uUm93cyAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy50YWJsZUxpc3QudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29uZmlnLnRhYmxlTGlzdC5zZWxlY3Rpb25Sb3dzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZy50YWJsZUxpc3Quc2VsZWN0aW9uUm93c1tqXVtjb25maWcuaWRGaWVsZF0gPT0gY29uZmlnLnRhYmxlTGlzdC50YWJsZURhdGFbaV1bY29uZmlnLmlkRmllbGRdKSB7XG4gICAgICAgICAgICAgICAgICBjb25maWcudGFibGVMaXN0LnRhYmxlRGF0YVtpXS5fY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcywgXCJqc29uXCIpO1xuICB9LFxuICBJVmlld1RhYmxlTG9hZERhdGFTZWFyY2g6IGZ1bmN0aW9uIElWaWV3VGFibGVMb2FkRGF0YVNlYXJjaCh1cmwsIHBhZ2VOdW0sIHBhZ2VTaXplLCBzZWFyY2hDb25kaXRpb24sIHBhZ2VBcHBPYmosIGlkRmllbGQsIGF1dG9TZWxlY3RlZE9sZFJvd3MsIHN1Y2Nlc3NGdW5jLCBsb2FkRGljdCwgY3VzdFBhcmFzKSB7XG4gICAgYWxlcnQoXCJMaXN0UGFnZVV0aWxpdHkuSVZpZXdUYWJsZUxvYWREYXRhU2VhcmNo5pa55rOV5bey57uP6KKr5bqf5byDLOivt+i9rOiwg0lWaWV3VGFibGVCaW5kRGF0YUJ5U2VhcmNoXCIpO1xuICAgIHJldHVybjtcblxuICAgIGlmIChsb2FkRGljdCA9PSB1bmRlZmluZWQgfHwgbG9hZERpY3QgPT0gbnVsbCkge1xuICAgICAgbG9hZERpY3QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIWN1c3RQYXJhcykge1xuICAgICAgY3VzdFBhcmFzID0ge307XG4gICAgfVxuXG4gICAgdmFyIHNlbmREYXRhID0ge1xuICAgICAgXCJwYWdlTnVtXCI6IHBhZ2VOdW0sXG4gICAgICBcInBhZ2VTaXplXCI6IHBhZ2VTaXplLFxuICAgICAgXCJzZWFyY2hDb25kaXRpb25cIjogU2VhcmNoVXRpbGl0eS5TZXJpYWxpemF0aW9uU2VhcmNoQ29uZGl0aW9uKHNlYXJjaENvbmRpdGlvbiksXG4gICAgICBcImxvYWREaWN0XCI6IGxvYWREaWN0XG4gICAgfTtcblxuICAgIGZvciAodmFyIGtleSBpbiBjdXN0UGFyYXMpIHtcbiAgICAgIHNlbmREYXRhW2tleV0gPSBjdXN0UGFyYXNba2V5XTtcbiAgICB9XG5cbiAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwgc2VuZERhdGEsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBpZiAodHlwZW9mIHN1Y2Nlc3NGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHN1Y2Nlc3NGdW5jKHJlc3VsdCwgcGFnZUFwcE9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIHBhZ2VBcHBPYmoucGFnZVRvdGFsID0gcmVzdWx0LmRhdGEudG90YWw7XG5cbiAgICAgICAgaWYgKGF1dG9TZWxlY3RlZE9sZFJvd3MpIHtcbiAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZUFwcE9iai50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzW2pdW2lkRmllbGRdID09IHBhZ2VBcHBPYmoudGFibGVEYXRhW2ldW2lkRmllbGRdKSB7XG4gICAgICAgICAgICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YVtpXS5fY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge31cbiAgICB9LCB0aGlzLCBcImpzb25cIik7XG4gIH0sXG4gIElWaWV3VGFibGVMb2FkRGF0YU5vU2VhcmNoOiBmdW5jdGlvbiBJVmlld1RhYmxlTG9hZERhdGFOb1NlYXJjaCh1cmwsIHBhZ2VOdW0sIHBhZ2VTaXplLCBwYWdlQXBwT2JqLCBpZEZpZWxkLCBhdXRvU2VsZWN0ZWRPbGRSb3dzLCBzdWNjZXNzRnVuYykge1xuICAgIGFsZXJ0KFwiTGlzdFBhZ2VVdGlsaXR5LklWaWV3VGFibGVMb2FkRGF0YVNlYXJjaOaWueazleW3sue7j+iiq+W6n+W8gyzor7fovazosINJVmlld1RhYmxlQmluZERhdGFCeVNlYXJjaFwiKTtcbiAgICByZXR1cm47XG4gICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHtcbiAgICAgIHBhZ2VOdW06IHBhZ2VOdW0sXG4gICAgICBwYWdlU2l6ZTogcGFnZVNpemVcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGEgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGEgPSByZXN1bHQuZGF0YS5saXN0O1xuICAgICAgICBwYWdlQXBwT2JqLnBhZ2VUb3RhbCA9IHJlc3VsdC5kYXRhLnRvdGFsO1xuXG4gICAgICAgIGlmIChhdXRvU2VsZWN0ZWRPbGRSb3dzKSB7XG4gICAgICAgICAgaWYgKHBhZ2VBcHBPYmouc2VsZWN0aW9uUm93cyAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VBcHBPYmoudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2VBcHBPYmouc2VsZWN0aW9uUm93c1tqXVtpZEZpZWxkXSA9PSBwYWdlQXBwT2JqLnRhYmxlRGF0YVtpXVtpZEZpZWxkXSkge1xuICAgICAgICAgICAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGFbaV0uX2NoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygc3VjY2Vzc0Z1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgc3VjY2Vzc0Z1bmMocmVzdWx0LCBwYWdlQXBwT2JqKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIFwianNvblwiKTtcbiAgfSxcbiAgSVZpZXdUYWJsZUlubmVyQnV0dG9uOiB7XG4gICAgVmlld0J1dHRvbjogZnVuY3Rpb24gVmlld0J1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmopIHtcbiAgICAgIHJldHVybiBoKCdUb29sdGlwJywge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGNvbnRlbnQ6IFwi5p+l55yLXCJcbiAgICAgICAgfVxuICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIHZpZXdcIixcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLnZpZXcocGFyYW1zLnJvd1tpZEZpZWxkXSwgcGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXSk7XG4gICAgfSxcbiAgICBFZGl0QnV0dG9uOiBmdW5jdGlvbiBFZGl0QnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ1Rvb2x0aXAnLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgY29udGVudDogXCLkv67mlLlcIlxuICAgICAgICB9XG4gICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gZWRpdFwiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmouZWRpdChwYXJhbXMucm93W2lkRmllbGRdLCBwYXJhbXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSldKTtcbiAgICB9LFxuICAgIERlbGV0ZUJ1dHRvbjogZnVuY3Rpb24gRGVsZXRlQnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ1Rvb2x0aXAnLCB7XG4gICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgY29udGVudDogXCLliKDpmaRcIlxuICAgICAgICB9XG4gICAgICB9LCBbaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gZGVsXCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai5kZWwocGFyYW1zLnJvd1tpZEZpZWxkXSwgcGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXSk7XG4gICAgfSxcbiAgICBNb3ZlVXBCdXR0b246IGZ1bmN0aW9uIE1vdmVVcEJ1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmopIHtcbiAgICAgIHJldHVybiBoKCdUb29sdGlwJywge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGNvbnRlbnQ6IFwi5LiK56e7XCJcbiAgICAgICAgfVxuICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIG1vdmUtdXBcIixcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLm1vdmVVcChwYXJhbXMucm93W2lkRmllbGRdLCBwYXJhbXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSldKTtcbiAgICB9LFxuICAgIE1vdmVEb3duQnV0dG9uOiBmdW5jdGlvbiBNb3ZlRG93bkJ1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmopIHtcbiAgICAgIHJldHVybiBoKCdUb29sdGlwJywge1xuICAgICAgICBwcm9wczoge1xuICAgICAgICAgIGNvbnRlbnQ6IFwi5LiL56e7XCJcbiAgICAgICAgfVxuICAgICAgfSwgW2goJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIG1vdmUtZG93blwiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmoubW92ZURvd24ocGFyYW1zLnJvd1tpZEZpZWxkXSwgcGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXSk7XG4gICAgfSxcbiAgICBTZWxlY3RlZEJ1dHRvbjogZnVuY3Rpb24gU2VsZWN0ZWRCdXR0b24oaCwgcGFyYW1zLCBpZEZpZWxkLCBwYWdlQXBwT2JqKSB7XG4gICAgICByZXR1cm4gaCgnVG9vbHRpcCcsIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBjb250ZW50OiBcIumAieaLqVwiXG4gICAgICAgIH1cbiAgICAgIH0sIFtoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbiBzZWxlY3RlZFwiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmouc2VsZWN0ZWQocGFyYW1zLnJvd1tpZEZpZWxkXSwgcGFyYW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXSk7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgTG9jYWxTdG9yYWdlVXRpbGl0eSA9IHtcbiAgaXNTdXBwb3J0OiBmdW5jdGlvbiBpc1N1cHBvcnQoKSB7XG4gICAgaWYgKHR5cGVvZiBTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcbiAgc2V0SXRlbTogZnVuY3Rpb24gc2V0SXRlbShrZXksIHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuaXNTdXBwb3J0KCkpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgfSxcbiAgZ2V0SXRlbTogZnVuY3Rpb24gZ2V0SXRlbShrZXkpIHtcbiAgICBpZiAodGhpcy5pc1N1cHBvcnQoKSkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIHNldEl0ZW1JblNlc3Npb25TdG9yYWdlOiBmdW5jdGlvbiBzZXRJdGVtSW5TZXNzaW9uU3RvcmFnZShrZXksIHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuaXNTdXBwb3J0KCkpIHtcbiAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgfVxuICB9LFxuICBnZXRJdGVtSW5TZXNzaW9uU3RvcmFnZTogZnVuY3Rpb24gZ2V0SXRlbUluU2Vzc2lvblN0b3JhZ2Uoa2V5KSB7XG4gICAgaWYgKHRoaXMuaXNTdXBwb3J0KCkpIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQYWdlU3R5bGVVdGlsaXR5ID0ge1xuICBHZXRQYWdlSGVpZ2h0OiBmdW5jdGlvbiBHZXRQYWdlSGVpZ2h0KCkge1xuICAgIHJldHVybiBqUXVlcnkod2luZG93LmRvY3VtZW50KS5oZWlnaHQoKTtcbiAgfSxcbiAgR2V0UGFnZVdpZHRoOiBmdW5jdGlvbiBHZXRQYWdlV2lkdGgoKSB7XG4gICAgcmV0dXJuIGpRdWVyeSh3aW5kb3cuZG9jdW1lbnQpLndpZHRoKCk7XG4gIH0sXG4gIEdldFdpbmRvd0hlaWdodDogZnVuY3Rpb24gR2V0V2luZG93SGVpZ2h0KCkge1xuICAgIHJldHVybiAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gIH0sXG4gIEdldFdpbmRvd1dpZHRoOiBmdW5jdGlvbiBHZXRXaW5kb3dXaWR0aCgpIHtcbiAgICByZXR1cm4gJCh3aW5kb3cpLndpZHRoKCk7XG4gIH0sXG4gIEdldExpc3RCdXR0b25PdXRlckhlaWdodDogZnVuY3Rpb24gR2V0TGlzdEJ1dHRvbk91dGVySGVpZ2h0KCkge1xuICAgIGFsZXJ0KFwiUGFnZVN0eWxlVXRpbGl0eS5HZXRMaXN0QnV0dG9uT3V0ZXJIZWlnaHQg5bey5YGc55SoXCIpO1xuICAgIHJldHVybiBqUXVlcnkoXCIubGlzdC1idXR0b24tb3V0ZXItY1wiKS5vdXRlckhlaWdodCgpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgU2VhcmNoVXRpbGl0eSA9IHtcbiAgU2VhcmNoRmllbGRUeXBlOiB7XG4gICAgSW50VHlwZTogXCJJbnRUeXBlXCIsXG4gICAgTnVtYmVyVHlwZTogXCJOdW1iZXJUeXBlXCIsXG4gICAgRGF0YVR5cGU6IFwiRGF0ZVR5cGVcIixcbiAgICBMaWtlU3RyaW5nVHlwZTogXCJMaWtlU3RyaW5nVHlwZVwiLFxuICAgIExlZnRMaWtlU3RyaW5nVHlwZTogXCJMZWZ0TGlrZVN0cmluZ1R5cGVcIixcbiAgICBSaWdodExpa2VTdHJpbmdUeXBlOiBcIlJpZ2h0TGlrZVN0cmluZ1R5cGVcIixcbiAgICBTdHJpbmdUeXBlOiBcIlN0cmluZ1R5cGVcIixcbiAgICBEYXRhU3RyaW5nVHlwZTogXCJEYXRlU3RyaW5nVHlwZVwiLFxuICAgIEFycmF5TGlrZVN0cmluZ1R5cGU6IFwiQXJyYXlMaWtlU3RyaW5nVHlwZVwiXG4gIH0sXG4gIFNlcmlhbGl6YXRpb25TZWFyY2hDb25kaXRpb246IGZ1bmN0aW9uIFNlcmlhbGl6YXRpb25TZWFyY2hDb25kaXRpb24oc2VhcmNoQ29uZGl0aW9uKSB7XG4gICAgaWYgKHNlYXJjaENvbmRpdGlvbikge1xuICAgICAgdmFyIHNlYXJjaENvbmRpdGlvbkNsb25lID0gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUoc2VhcmNoQ29uZGl0aW9uKTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNlYXJjaENvbmRpdGlvbkNsb25lKSB7XG4gICAgICAgIGlmIChzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnR5cGUgPT0gU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuQXJyYXlMaWtlU3RyaW5nVHlwZSkge1xuICAgICAgICAgIGlmIChzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnZhbHVlICE9IG51bGwgJiYgc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnZhbHVlID0gc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZS5qb2luKFwiO1wiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzZWFyY2hDb25kaXRpb25DbG9uZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBKQnVpbGQ0RFNlbGVjdFZpZXcgPSB7XG4gIFNlbGVjdEVudlZhcmlhYmxlOiB7XG4gICAgZm9ybWF0VGV4dDogZnVuY3Rpb24gZm9ybWF0VGV4dCh0eXBlLCB0ZXh0KSB7XG4gICAgICBpZiAodHlwZSA9PSBcIkNvbnN0XCIpIHtcbiAgICAgICAgcmV0dXJuIFwi6Z2Z5oCB5YC8OuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJEYXRlVGltZVwiKSB7XG4gICAgICAgIHJldHVybiBcIuaXpeacn+aXtumXtDrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiQXBpVmFyXCIpIHtcbiAgICAgICAgcmV0dXJuIFwiQVBJ5Y+Y6YePOuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJOdW1iZXJDb2RlXCIpIHtcbiAgICAgICAgcmV0dXJuIFwi5bqP5Y+357yW56CBOuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJJZENvZGVyXCIpIHtcbiAgICAgICAgcmV0dXJuIFwi5Li76ZSu55Sf5oiQOuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJcIikge1xuICAgICAgICByZXR1cm4gXCLjgJDml6DjgJFcIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFwi5pyq55+l57G75Z6LXCIgKyB0ZXh0O1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFNlc3Npb25VdGlsaXR5ID0ge1xuICBfY3VycmVudFNlc3Npb25Vc2VyOiBudWxsLFxuICBfY3VycmVudFNlc3Npb25Vc2VyTW9jazoge1xuICAgIG9yZ2FuSWQ6IFwiXCIsXG4gICAgb3JnYW5OYW1lOiBcIlwiLFxuICAgIHVzZXJJZDogXCJcIixcbiAgICB1c2VyTmFtZTogXCJcIixcbiAgICBtYWluRGVwYXJ0bWVudElkOiBcIlwiLFxuICAgIG1haW5EZXBhcnRtZW50TmFtZTogXCJcIixcbiAgICBhY2NvdW50SWQ6IFwiXCIsXG4gICAgYWNjb3VudE5hbWU6IFwiXCJcbiAgfSxcbiAgQ2xlYXJDbGllbnRTZXNzaW9uU3RvcmVTZXNzaW9uVXNlcjogZnVuY3Rpb24gQ2xlYXJDbGllbnRTZXNzaW9uU3RvcmVTZXNzaW9uVXNlcigpIHt9LFxuICBHZXRTZXNzaW9uVXNlclN5bmM6IGZ1bmN0aW9uIEdldFNlc3Npb25Vc2VyU3luYygpIHtcbiAgICBpZiAodGhpcy5fY3VycmVudFNlc3Npb25Vc2VyID09IG51bGwpIHtcbiAgICAgIGlmICh3aW5kb3cucGFyZW50LlNlc3Npb25VdGlsaXR5Ll9jdXJyZW50U2Vzc2lvblVzZXIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LnBhcmVudC5TZXNzaW9uVXRpbGl0eS5fY3VycmVudFNlc3Npb25Vc2VyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQWpheFV0aWxpdHkuUG9zdFN5bmMoXCIvUmVzdC9TZXNzaW9uL1VzZXIvR2V0TXlTZXNzaW9uVXNlclwiLCB7fSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgU2Vzc2lvblV0aWxpdHkuX2N1cnJlbnRTZXNzaW9uVXNlciA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIH0gZWxzZSB7fVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRTZXNzaW9uVXNlcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRTZXNzaW9uVXNlcjtcbiAgICB9XG4gIH0sXG4gIEdldFNlc3Npb25Vc2VyOiBmdW5jdGlvbiBHZXRTZXNzaW9uVXNlcihmdW5jKSB7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50U2Vzc2lvblVzZXIpIHtcbiAgICAgIEFqYXhVdGlsaXR5LkdldChcIi9SZXN0L1Nlc3Npb24vVXNlci9HZXRNeVNlc3Npb25Vc2VyXCIsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIGZ1bmMocmVzdWx0LmRhdGEpO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFNlc3Npb25Vc2VyO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG52YXIgU3RyaW5nVXRpbGl0eSA9IHtcbiAgR3VpZFNwbGl0OiBmdW5jdGlvbiBHdWlkU3BsaXQoc3BsaXQpIHtcbiAgICB2YXIgZ3VpZCA9IFwiXCI7XG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAzMjsgaSsrKSB7XG4gICAgICBndWlkICs9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2LjApLnRvU3RyaW5nKDE2KTtcbiAgICAgIGlmIChpID09IDggfHwgaSA9PSAxMiB8fCBpID09IDE2IHx8IGkgPT0gMjApIGd1aWQgKz0gc3BsaXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGd1aWQ7XG4gIH0sXG4gIEd1aWQ6IGZ1bmN0aW9uIEd1aWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuR3VpZFNwbGl0KFwiLVwiKTtcbiAgfSxcbiAgVGltZXN0YW1wOiBmdW5jdGlvbiBUaW1lc3RhbXAoKSB7XG4gICAgdmFyIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHJldHVybiB0aW1lc3RhbXAudG9TdHJpbmcoKS5zdWJzdHIoNCwgMTApO1xuICB9LFxuICBUcmltOiBmdW5jdGlvbiBUcmltKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvKF5b44CAXFxzXSopfChb44CAXFxzXSokKS9nLCBcIlwiKTtcbiAgfSxcbiAgUmVtb3ZlTGFzdENoYXI6IGZ1bmN0aW9uIFJlbW92ZUxhc3RDaGFyKHN0cikge1xuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKDAsIHN0ci5sZW5ndGggLSAxKTtcbiAgfSxcbiAgSXNOdWxsT3JFbXB0eTogZnVuY3Rpb24gSXNOdWxsT3JFbXB0eShvYmopIHtcbiAgICByZXR1cm4gb2JqID09IHVuZGVmaW5lZCB8fCBvYmogPT0gXCJcIiB8fCBvYmogPT0gbnVsbCB8fCBvYmogPT0gXCJ1bmRlZmluZWRcIiB8fCBvYmogPT0gXCJudWxsXCI7XG4gIH0sXG4gIEdldEZ1bnRpb25OYW1lOiBmdW5jdGlvbiBHZXRGdW50aW9uTmFtZShmdW5jKSB7XG4gICAgaWYgKHR5cGVvZiBmdW5jID09IFwiZnVuY3Rpb25cIiB8fCBfdHlwZW9mKGZ1bmMpID09IFwib2JqZWN0XCIpIHZhciBmTmFtZSA9IChcIlwiICsgZnVuYykubWF0Y2goL2Z1bmN0aW9uXFxzKihbXFx3XFwkXSopXFxzKlxcKC8pO1xuICAgIGlmIChmTmFtZSAhPT0gbnVsbCkgcmV0dXJuIGZOYW1lWzFdO1xuICB9LFxuICBUb0xvd2VyQ2FzZTogZnVuY3Rpb24gVG9Mb3dlckNhc2Uoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpO1xuICB9LFxuICB0b1VwcGVyQ2FzZTogZnVuY3Rpb24gdG9VcHBlckNhc2Uoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpO1xuICB9LFxuICBFbmRXaXRoOiBmdW5jdGlvbiBFbmRXaXRoKHN0ciwgZW5kU3RyKSB7XG4gICAgdmFyIGQgPSBzdHIubGVuZ3RoIC0gZW5kU3RyLmxlbmd0aDtcbiAgICByZXR1cm4gZCA+PSAwICYmIHN0ci5sYXN0SW5kZXhPZihlbmRTdHIpID09IGQ7XG4gIH0sXG4gIElzU2FtZU9yZ2luOiBmdW5jdGlvbiBJc1NhbWVPcmdpbih1cmwxLCB1cmwyKSB7XG4gICAgdmFyIG9yaWdpbjEgPSAvXFwvXFwvW1xcdy0uXSsoOlxcZCspPy9pLmV4ZWModXJsMSlbMF07XG4gICAgdmFyIG9wZW4gPSAvXFwvXFwvW1xcdy0uXSsoOlxcZCspPy9pLmV4ZWModXJsMik7XG5cbiAgICBpZiAob3BlbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG9yaWdpbjIgPSBvcGVuWzBdO1xuXG4gICAgICBpZiAob3JpZ2luMSA9PSBvcmlnaW4yKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgWE1MVXRpbGl0eSA9IHt9OyJdfQ==
