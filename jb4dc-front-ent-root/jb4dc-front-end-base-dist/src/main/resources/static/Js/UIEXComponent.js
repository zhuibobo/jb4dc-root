"use strict";

if (!Object.create) {
  Object.create = function () {
    function F() {}

    return function (o) {
      if (arguments.length != 1) {
        throw new Error('Object.create implementation only accepts one parameter.');
      }

      F.prototype = o;
      return new F();
    };
  }();
}

var EditTableConfig = {
  Status: "Edit",
  Templates: [{
    Title: "表名1",
    FieldName: "TableField",
    Renderer: "EditTable_TextBox",
    TitleCellClassName: "TitleCell",
    Hidden: false,
    TitleCellAttrs: {}
  }, {
    Title: "字段类型",
    FieldName: "TableField",
    Renderer: "EditTable_TextBox",
    Hidden: false
  }, {
    Title: "备注",
    FieldName: "TableField",
    Renderer: "EditTable_TextBox",
    Hidden: false
  }],
  RowIdCreater: function RowIdCreater() {},
  TableClass: "EditTable",
  RendererTo: "divTreeTable",
  TableId: "EditTable",
  TableAttrs: {
    cellpadding: "1",
    cellspacing: "1",
    border: "1"
  }
};
var EditTableData = {};
"use strict";

var EditTable = {
  _$Prop_TableElem: null,
  _$Prop_RendererToElem: null,
  _Prop_ConfigManager: null,
  _Prop_JsonData: new Object(),
  _$Prop_EditingRowElem: null,
  _Status: "Edit",
  Initialization: function Initialization(_config) {
    this._Prop_ConfigManager = Object.create(EditTableConfigManager);

    this._Prop_ConfigManager.InitializationConfig(_config);

    var _C = this._Prop_ConfigManager.GetConfig();

    this._$Prop_RendererToElem = $("#" + _C.RendererTo);
    this._$Prop_TableElem = this.CreateTable();

    this._$Prop_TableElem.append(this.CreateTableTitleRow());

    this._$Prop_RendererToElem.append(this._$Prop_TableElem);

    if (_C.Status) {
      this._Status = _C.Status;
    }
  },
  LoadJsonData: function LoadJsonData(jsonData) {
    if (jsonData != null && jsonData != undefined) {
      for (var i = 0; i < jsonData.length; i++) {
        var item = jsonData[i];
        var rowId = this.AddEditingRowByTemplate(jsonData, item);
        this._Prop_JsonData[rowId] = item;
      }

      this.CompletedEditingRow();
    } else {
      alert("Json Data Object Error");
    }
  },
  CreateTable: function CreateTable() {
    var _C = this._Prop_ConfigManager.GetConfig();

    var _editTable = $("<table />");

    _editTable.addClass(_C.TableClass);

    _editTable.attr("Id", _C.TableId);

    _editTable.attr(_C.TableAttrs);

    return _editTable;
  },
  CreateTableTitleRow: function CreateTableTitleRow() {
    var _C = this._Prop_ConfigManager.GetConfig();

    var _titleRow = $("<tr isHeader='true' />");

    for (var i = 0; i < _C.Templates.length; i++) {
      var template = _C.Templates[i];
      var title = template.Title;
      var th = $("<th>" + title + "</th>");

      if (template.TitleCellClassName) {
        th.addClass(template.TitleCellClassName);
      }

      if (template.TitleCellAttrs) {
        th.attr(template.TitleCellAttrs);
      }

      if (typeof template.Hidden != 'undefined' && template.Hidden == true) {
        th.hide();
      }

      _titleRow.append(th);
    }

    var _titleRowHead = $("<thead></thead>");

    _titleRowHead.append(_titleRow);

    return _titleRowHead;
  },
  AddEmptyEditingRowByTemplate: function AddEmptyEditingRowByTemplate(callbackfun) {
    var rowId = this.AddEditingRowByTemplate(null);
    this._Prop_JsonData[rowId] = null;
  },
  AddEditingRowByTemplate: function AddEditingRowByTemplate(jsonDatas, jsonDataSingle) {
    if (this.CompletedEditingRow()) {
      var rowId = StringUtility.Guid();
      var $rowElem = $("<tr />");
      $rowElem.attr("id", rowId);
      this._$Prop_EditingRowElem = $rowElem;

      if (jsonDataSingle != undefined && jsonDataSingle != null && jsonDataSingle.editEable == false) {} else {
        var event_data = {
          host: this
        };

        if (this._Status != "View") {
          $rowElem.bind("click", event_data, function (event) {
            var rowStatus = $rowElem.attr("status");

            if (typeof rowStatus != 'undefined' && rowStatus == "disabled") {
              return false;
            }

            var _host = event.data.host;

            if (_host._$Prop_EditingRowElem != null && $(this).attr("id") == _host._$Prop_EditingRowElem.attr("id")) {
              return;
            }

            var _C = _host._Prop_ConfigManager.GetConfig();

            if (typeof _C.RowClick != 'undefined' && typeof _C.RowClick == 'function') {
              try {
                var result = _C.RowClick();

                if (result != 'undefined' && result == false) {
                  return false;
                }
              } catch (e) {
                alert("_C.RowClick() Error");
              }
            }

            if (_host.CompletedEditingRow()) {
              _host._$Prop_EditingRowElem = $(this);

              _host.SetRowIsEditStatus(_host._$Prop_EditingRowElem);

              var _row = $(this);

              _row.find("td").each(function () {
                var $td = $(this);
                var renderer = $td.attr("renderer");
                var templateId = $td.attr("templateId");

                var template = _host._Prop_ConfigManager.GetTemplate(templateId);

                var rendererObj = eval("Object.create(" + renderer + ")");
                var $htmlelem = rendererObj.Get_EditStatus_HtmlElem(_C, template, $td, _row, this._$Prop_TableElem, $td.children());

                if (typeof template.Hidden != 'undefined' && template.Hidden == true) {
                  $td.hide();
                }

                if (typeof template.Style != 'undefined') {
                  $td.css(template.Style);
                }

                $td.html("");
                $td.append($htmlelem);
              });
            }
          });
        }
      }

      var _C = this._Prop_ConfigManager.GetConfig();

      for (var i = 0; i < _C.Templates.length; i++) {
        var template = _C.Templates[i];
        var renderer = null;

        try {
          renderer = template.Renderer;
          var rendererObj = eval("Object.create(" + renderer + ")");
        } catch (e) {
          alert("实例化" + renderer + "失败!");
        }

        var $tdElem = null;
        $tdElem = $("<td />");
        $tdElem.attr("renderer", renderer);
        $tdElem.attr("templateId", template.TemplateId);

        if (typeof template.Hidden != 'undefined' && template.Hidden == true) {
          $tdElem.hide();
        }

        if (typeof template.Width != 'undefined') {
          $tdElem.css("width", template.Width);
        }

        if (typeof template.Align != 'undefined') {
          $tdElem.attr("align", template.Align);
        }

        var $elem = rendererObj.Get_EditStatus_HtmlElem(_C, template, $tdElem, $rowElem, this._$Prop_TableElem, null, jsonDatas, jsonDataSingle);

        if (typeof template.Style != 'undefined') {
          $tdElem.css(template.Style);
        }

        $tdElem.append($elem);
        $rowElem.append($tdElem);
      }

      this._$Prop_TableElem.append($rowElem);

      if (typeof _C.AddAfterRowEvent !== 'undefined' && typeof _C.AddAfterRowEvent == 'function') {
        _C.AddAfterRowEvent($rowElem);
      }

      return rowId;
    }
  },
  SetToViewStatus: function SetToViewStatus() {
    this._Status = "View";
  },
  SetRowIsEditStatus: function SetRowIsEditStatus(tr) {
    $(tr).attr("EditStatus", "EditStatus");
  },
  SetRowIsCompletedStatus: function SetRowIsCompletedStatus(tr) {
    $(tr).attr("EditStatus", "CompletedStatus");
  },
  RowIsEditStatus: function RowIsEditStatus(tr) {
    return $(tr).attr("EditStatus") == "EditStatus";
  },
  RowIsCompletedStatus: function RowIsCompletedStatus(tr) {
    return $(tr).attr("EditStatus") == "CompletedStatus";
  },
  CompletedEditingRow: function CompletedEditingRow() {
    var result = true;

    if (this._$Prop_EditingRowElem != null) {
      if (!this.RowIsCompletedStatus(this._$Prop_EditingRowElem)) {
        var _C = this._Prop_ConfigManager.GetConfig();

        var _host = this;

        if (this.ValidateCompletedEditingRowEnable(this._$Prop_EditingRowElem)) {
          var _row = this._$Prop_EditingRowElem;
          this.SetRowIsCompletedStatus(_row);

          _row.find("td").each(function () {
            var $td = $(this);
            var renderer = $td.attr("renderer");
            var templateId = $td.attr("templateId");

            var template = _host._Prop_ConfigManager.GetTemplate(templateId);

            var rendererObj = eval("Object.create(" + renderer + ")");
            var $htmlelem = rendererObj.Get_CompletedStatus_HtmlElem(_C, template, $td, _row, this._$Prop_TableElem, $td.children());
            $td.html("");
            $td.append($htmlelem);
          });

          this._$Prop_EditingRowElem = null;
        } else {
          result = false;
        }
      }
    }

    return result;
  },
  ValidateCompletedEditingRowEnable: function ValidateCompletedEditingRowEnable(editRow) {
    var _C = this._Prop_ConfigManager.GetConfig();

    var _host = this;

    var result = true;
    var validateMsg = "";
    var tds = $(editRow).find("td");

    for (var i = 0; i < tds.length; i++) {
      var $td = $(tds[i]);
      var renderer = $td.attr("renderer");
      var templateId = $td.attr("templateId");

      var template = _host._Prop_ConfigManager.GetTemplate(templateId);

      var rendererObj = eval("Object.create(" + renderer + ")");
      var valresult = rendererObj.ValidateToCompletedEnable(_C, template, $td, editRow, this._$Prop_TableElem, $td.children());

      if (valresult.Success == false) {
        result = false;
        validateMsg = valresult.Msg;
        break;
      }
    }

    if (!result && validateMsg != null) {
      DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, validateMsg, null);
    }

    return result;
  },
  RemoveRow: function RemoveRow() {
    if (this._$Prop_EditingRowElem != null) {
      this._$Prop_EditingRowElem.remove();

      this._$Prop_EditingRowElem = null;
    }
  },
  GetTableObject: function GetTableObject() {
    return this._$Prop_TableElem;
  },
  GetRows: function GetRows() {
    if (this._$Prop_TableElem != null) {
      return this._$Prop_TableElem.find("tr:not(:first)");
    }
  },
  GetEditRow: function GetEditRow() {
    if (this._$Prop_EditingRowElem != null) {
      return this._$Prop_EditingRowElem;
    } else {
      return null;
    }
  },
  GetLastRow: function GetLastRow() {
    var row = this.GetEditRow();
    if (row == null) return null;
    var rows = this.GetRows();
    var index = rows.index(row);

    if (index > 0) {
      return $(rows[index - 1]);
    }

    return null;
  },
  GetNextRow: function GetNextRow() {
    var row = this.GetEditRow();
    if (row == null) return null;
    var rows = this.GetRows();
    var index = rows.index(row);

    if (index < rows.length - 1) {
      return $(rows[index + 1]);
    }

    return null;
  },
  MoveUp: function MoveUp() {
    var row = this.GetLastRow();

    if (row != null) {
      if (typeof row.attr("status") != "undefined" && row.attr("status") == "disabled") return false;
      var me = this.GetEditRow();
      var temp = me.attr("class");
      me.attr("class", row.attr("class"));
      row.attr("class", temp);

      if (me != null) {
        row.before(me[0]);
        return true;
      }

      return false;
    }

    return false;
  },
  MoveDown: function MoveDown() {
    var row = this.GetNextRow();

    if (row != null) {
      if (typeof row.attr("state") != "undefined" && row.attr("state") == "disabled") return false;
      var me = this.GetEditRow();
      var temp = me.attr("class");
      me.attr("class", row.attr("class"));
      row.attr("class", temp);

      if (me != null) {
        row.after(me[0]);
        return true;
      }

      return false;
    }

    return false;
  },
  RemoveAllRow: function RemoveAllRow() {
    if (this._$Prop_TableElem != null) {
      this._$Prop_TableElem.find("tr:not(:first)").each(function () {
        $(this).remove();
      });
    }
  },
  UpdateToRow: function UpdateToRow(rowId, rowData) {
    var tableElement = this._$Prop_TableElem;

    var _host = this;

    tableElement.find("tr[isHeader!='true']").each(function () {
      var $tr = $(this);

      var _rowId = $tr.attr("id");

      if (rowId == _rowId) {
        for (var attrName in rowData) {
          $tr.find("td").each(function () {
            var $td = $(this);
            var $displayElem = $td.find("[IsSerialize='true']");
            var bindName = $displayElem.attr("BindName");

            if (attrName == bindName) {
              var templateId = $td.attr("templateId");

              var template = _host._Prop_ConfigManager.GetTemplate(templateId);

              var text = "";
              var val = rowData[bindName];

              if (typeof template.Formatter != 'undefined' && typeof template.Formatter == 'function') {
                text = template.Formatter(val);
              }

              if (text == "") {
                text = val;
              }

              if ($displayElem.prop('tagName') == "INPUT") {
                if ($displayElem.attr("type").toLowerCase() == "checkbox") {} else {
                  $displayElem.val(text);
                }
              } else {
                try {
                  $displayElem.text(text);
                } catch (e) {
                  alert("UpdateToRow $label.text(text) Error!");
                }

                $displayElem.attr("Value", val);
              }
            }
          });
        }
      }
    });
  },
  GetSelectRowDataByRowId: function GetSelectRowDataByRowId(rowId) {
    var tableElement = this._$Prop_TableElem;
    var rowData = {};
    tableElement.find("tr[isHeader!='true']").each(function () {
      var $tr = $(this);

      var _rowId = $tr.attr("id");

      if (rowId == _rowId) {
        $tr.find("[IsSerialize='true']").each(function () {
          if ($(this).attr("Value") != undefined) {
            rowData[$(this).attr("BindName")] = $(this).attr("Value");
          } else {
            rowData[$(this).attr("BindName")] = $(this).val();
          }
        });
      }
    });
    return rowData;
  },
  GetSelectRowByRowId: function GetSelectRowByRowId(rowId) {
    var tableElement = this._$Prop_TableElem;
    return tableElement.find("tr[id='" + rowId + "']");
  },
  GetAllRowData: function GetAllRowData() {
    var tableElement = this._$Prop_TableElem;
    var rowDatas = new Array();
    tableElement.find("tr[isHeader!='true']").each(function () {
      var $tr = $(this);
      var rowData = {};
      $tr.find("[IsSerialize='true']").each(function () {
        rowData[$(this).attr("BindName")] = $(this).attr("Value");
        rowData[$(this).attr("BindName") + "___Text"] = $(this).attr("Text");
      });
      rowDatas.push(rowData);
    });
    return rowDatas;
  },
  GetAllRowDataExUndefinedTextProp: function GetAllRowDataExUndefinedTextProp() {
    this.CompletedEditingRow();
    var allRowData = this.GetAllRowData();
    allRowData = this.Delete___UndefinedTextProp(allRowData);
    return allRowData;
  },
  Delete___UndefinedTextProp: function Delete___UndefinedTextProp(allRowJson) {
    for (var i = 0; i < allRowJson.length; i++) {
      for (var key in allRowJson[i]) {
        if (key.indexOf("___Text") > 0) {
          if (allRowJson[i][key] == undefined || allRowJson[i][key] == "undefined") {
            delete allRowJson[i][key];
          }
        }
      }
    }

    return allRowJson;
  },
  GetSerializeJson: function GetSerializeJson(fieldNameFirstCharLetter) {
    var result = new Array();
    var table = this._$Prop_TableElem;
    table.find("tr[isHeader!='true']").each(function () {
      var rowdata = new Object();
      var $tr = $(this);
      $tr.find("[IsSerialize='true']").each(function () {
        var seritem = $(this);
        var bindName = seritem.attr("BindName");
        var bindValue = seritem.attr("Value");
        var bindText = seritem.attr("Text");

        if (!bindText) {
          bindText = "";
        }

        if (bindText == "undefined") {
          bindText = "";
        }

        if (fieldNameFirstCharLetter == true) {
          bindName = StringUtility.FirstCharLetter(bindName);
        }

        rowdata[bindName] = bindValue;
        rowdata[bindName + "___Text"] = bindText;
      });
      result.push(rowdata);
    });
    return result;
  },
  GetTableElement: function GetTableElement() {
    return this._$Prop_TableElem;
  }
};
var EditTableConfigManager = {
  _Prop_Config: {},
  InitializationConfig: function InitializationConfig(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);
    var _templates = this._Prop_Config.Templates;

    for (var i = 0; i < _templates.length; i++) {
      var template = _templates[i];
      template.TemplateId = StringUtility.Guid();
    }
  },
  GetConfig: function GetConfig() {
    return this._Prop_Config;
  },
  GetTemplate: function GetTemplate(templateId) {
    var _templates = this._Prop_Config.Templates;

    for (var i = 0; i < _templates.length; i++) {
      var template = _templates[i];

      if (template.TemplateId == templateId) {
        return template;
      }
    }

    return null;
  }
};
var EditTableValidate = {
  _SQLKeyWordArray: new Array(),
  GetSQLKeyWords: function GetSQLKeyWords() {
    if (this._SQLKeyWordArray.length == 0) {
      this._SQLKeyWordArray.push("insert");

      this._SQLKeyWordArray.push("update");

      this._SQLKeyWordArray.push("delete");

      this._SQLKeyWordArray.push("select");

      this._SQLKeyWordArray.push("as");

      this._SQLKeyWordArray.push("from");

      this._SQLKeyWordArray.push("distinct");

      this._SQLKeyWordArray.push("where");

      this._SQLKeyWordArray.push("order");

      this._SQLKeyWordArray.push("by");

      this._SQLKeyWordArray.push("asc");

      this._SQLKeyWordArray.push("desc");

      this._SQLKeyWordArray.push("desc");

      this._SQLKeyWordArray.push("and");

      this._SQLKeyWordArray.push("or");

      this._SQLKeyWordArray.push("between");

      this._SQLKeyWordArray.push("order by");

      this._SQLKeyWordArray.push("count");

      this._SQLKeyWordArray.push("group");

      this._SQLKeyWordArray.push("group by");

      this._SQLKeyWordArray.push("having");

      this._SQLKeyWordArray.push("alias");

      this._SQLKeyWordArray.push("join");

      this._SQLKeyWordArray.push("left");

      this._SQLKeyWordArray.push("rigth");

      this._SQLKeyWordArray.push("inneer");

      this._SQLKeyWordArray.push("union");

      this._SQLKeyWordArray.push("sum");

      this._SQLKeyWordArray.push("all");

      this._SQLKeyWordArray.push("minus");

      this._SQLKeyWordArray.push("alert");

      this._SQLKeyWordArray.push("drop");

      this._SQLKeyWordArray.push("exec");

      this._SQLKeyWordArray.push("truncate");
    }

    return this._SQLKeyWordArray;
  },
  Validate: function Validate(val, template) {
    var result = {
      Success: true,
      Msg: ""
    };
    var validateConfig = template.Validate;

    if (validateConfig != undefined && validateConfig != null) {
      var validateType = validateConfig.Type;

      if (validateType != undefined && validateType != null) {
        switch (validateType) {
          case "NotEmpty":
            {
              if (val == "") {
                result.Success = false;
                result.Msg = "【" + template.Title + "】不能为空!";
              }
            }
            break;

          case "LUNoOnly":
            {
              if (/^[a-zA-Z][a-zA-Z0-9_]{0,}$/.test(val) == false) {
                result.Success = false;
                result.Msg = "【" + template.Title + "】不能为空且只能是字母、下划线、数字并以字母开头！";
              }
            }
            break;

          case "SQLKeyWord":
            {
              if (/^[a-zA-Z][a-zA-Z0-9_]{0,}$/.test(val) == false) {
                result.Success = false;
                result.Msg = "【" + template.Title + "】不能为空且只能是字母、下划线、数字并以字母开头！";
              }

              var val = val.toUpperCase();
              var sqlKeyWords = this.GetSQLKeyWords();

              for (var i = 0; i < sqlKeyWords.length; i++) {
                if (val == sqlKeyWords[i].toUpperCase()) {
                  result.Success = false;
                  result.Msg = "【" + template.Title + "】请不要使用SQL关键字作为列名！";
                  break;
                }
              }
            }
            break;
        }
      }
    }

    return result;
  }
};
var EditTableDefauleValue = {
  GetValue: function GetValue(template) {
    var defaultValueConfig = template.DefaultValue;

    if (defaultValueConfig != undefined && defaultValueConfig != null) {
      var defaultValueType = defaultValueConfig.Type;

      if (defaultValueType != undefined && defaultValueType != null) {
        switch (defaultValueType) {
          case "Const":
            {
              return defaultValueConfig.Value;
            }

          case "GUID":
            {
              return StringUtility.Guid();
            }
            break;
        }
      }
    }

    return "";
  }
};
"use strict";

var EditTable_CheckBox = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var bindname = template.BindName;

    if (template.DefaultValue != undefined && template.DefaultValue != null) {
      var val = EditTableDefauleValue.GetValue(template);
    }

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.html();
    }

    var $elem = "";

    if (val == "是") {
      $elem = $("<input type='checkbox' checked='checked' />");
    } else {
      $elem = $("<input type='checkbox' />");
    }

    $elem.val(val);
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    var $elem = "";

    if (template.IsCNValue) {
      if (editStausHtmlElem.attr("checked") == "checked") {
        $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' value='是'>是</label>");
      } else {
        $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' value='否'>否</label>");
      }
    } else {
      if (editStausHtmlElem.attr("checked") == "checked") {
        $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' value='1'>是</label>");
      } else {
        $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' value='0'>否</label>");
      }
    }

    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var EditTable_Formatter = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    if (template.Formatter && typeof template.Formatter == "function") {
      var editDatas = EditTable._Prop_JsonData;

      if (editDatas) {
        var rowId = hostRow.attr("id");
        var rowData = editDatas[rowId];

        if (rowData) {
          return $(template.Formatter(template, hostCell, hostRow, hostTable, rowData));
        }
      }
    }

    return "";
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem, jsonDatas, jsonDataSingle) {
    if (template.Formatter && typeof template.Formatter == "function") {
      var editDatas = EditTable._Prop_JsonData;

      if (editDatas) {
        var rowId = hostRow.attr("id");
        var rowData = editDatas[rowId];

        if (rowData) {
          return $(template.Formatter(template, hostCell, hostRow, hostTable, rowData));
        }
      }
    }

    return "";
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var EditTable_Label = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var bindname = template.BindName;

    if (template.DefaultValue != undefined && template.DefaultValue != null) {
      val = EditTableDefauleValue.GetValue(template);
    }

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      if (typeof template.Formater === 'undefined') {
        val = viewStausHtmlElem.html();
      } else {
        val = viewStausHtmlElem.attr("Value");
      }
    }

    var $elem;

    if (typeof template.Formater === 'undefined') {
      $elem = $("<label IsSerialize='true' Text='" + text + "' BindName='" + template.BindName + "' Value='" + val + "'>" + val + "</label>");
    } else {
      var text = template.Formater(val);
      $elem = $("<label IsSerialize='true' Text=" + text + " BindName='" + template.BindName + "' Value=" + val + ">" + text + "</label>");
    }

    $elem.val(val);
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var $elem;
    var val = editStausHtmlElem.val();

    if (typeof template.Formater === 'undefined') {
      $elem = $("<label IsSerialize='true' Text='" + text + "' BindName='" + template.BindName + "' Value='" + val + "'>" + val + "</label>");
    } else {
      var text = template.Formater(val);
      $elem = $("<label IsSerialize='true' Text='" + text + "' BindName='" + template.BindName + "' Value='" + val + "'>" + text + "</label>");
    }

    $elem.val(val);
    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var EditTable_Radio = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var bindname = template.BindName;

    if (template.DefaultValue != undefined && template.DefaultValue != null) {
      var val = EditTableDefauleValue.GetValue(template);
    }

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.val();
    }

    var $elem = "";

    if (null != viewStausHtmlElem && viewStausHtmlElem != undefined && viewStausHtmlElem.attr("checked") == "checked" || val == 1) {
      $elem = $("<input type='radio' IsSerialize='true' BindName='" + template.BindName + "' name='" + template.BindName + "' checked='checked' value='1'/>");
    } else {
      $elem = $("<input type='radio' IsSerialize='true' BindName='" + template.BindName + "' name='" + template.BindName + "' value='0'/>");
    }

    $elem.val(val);
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    var $elem = "";

    if (editStausHtmlElem.attr("checked") == "checked") {
      $elem = $("<input type='radio' IsSerialize='true' BindName='" + template.BindName + "' name='" + template.BindName + "'checked='checked'  value='1'/>");
    } else {
      $elem = $("<input type='radio' IsSerialize='true' BindName='" + template.BindName + "' name='" + template.BindName + "' value='0'/>");
    }

    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var EditTable_Select = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var configSource = null;

    if (template.ClientDataSource != undefined && template.ClientDataSource != null) {
      configSource = template.ClientDataSource;
    } else if (template.ClientDataSourceFunc != undefined && template.ClientDataSourceFunc != null) {
      configSource = template.ClientDataSourceFunc(template.ClientDataSourceFuncParas, _config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle);
    }

    if (configSource == null) {
      return $("<label>找不到数据源设置,请在template中设置数据源</label>");
    }

    var val = "";
    var txt = "";
    var bindname = template.BindName;

    if (template.DefaultValue != undefined && template.DefaultValue != null) {
      var val = EditTableDefauleValue.GetValue(template);
    }

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.attr("Value");
    }

    var $elem = $("<select style='width: 100%' />");

    if (configSource[0].Group) {
      for (var i = 0; i < configSource.length; i++) {
        var optgroup = $("<optgroup />");
        optgroup.attr("label", configSource[i].Group);

        if (configSource[i].Options) {
          for (var j = 0; j < configSource[i].Options.length; j++) {
            var option = $("<option />");
            option.attr("value", configSource[i].Options[j].Value);
            option.attr("text", configSource[i].Options[j].Text);
            option.text(configSource[i].Options[j].Text);
            optgroup.append(option);
          }
        }

        $elem.append(optgroup);
      }
    } else {
      for (var i = 0; i < configSource.length; i++) {
        var item = configSource[i];
        $elem.append("<option value='" + item.Value + "' text='" + item.Text + "'>" + item.Text + "</option>");
      }
    }

    $elem.val(val);

    if (typeof template.ChangeEvent == "function") {
      $elem.change(function () {
        template.ChangeEvent(this, _config, template, hostCell, hostRow, hostTable, viewStausHtmlElem);
      });
    }

    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.find("option:selected").attr("Value");
    var text = editStausHtmlElem.find("option:selected").attr("Text");

    if (!val) {
      val = "";
    }

    if (!text) {
      text = "";
    }

    var $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' Value='" + val + "' Text='" + text + "'>" + text + "</label>");
    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var EditTable_SelectRowCheckBox = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var bindname = template.BindName;

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.attr("Value");
    }

    var $elem = $("<input IsSerialize='true' type='checkbox' checked='checked'  BindName='" + template.BindName + "' />");
    $elem.attr("Value", val);
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = $(editStausHtmlElem).attr("Value");
    var $elem = $("<input IsSerialize='true' type='checkbox'  BindName='" + template.BindName + "' />");
    $elem.attr("Value", val);
    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var EditTable_TextBox = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var bindname = template.BindName;

    if (template.DefaultValue != undefined && template.DefaultValue != null) {
      var val = EditTableDefauleValue.GetValue(template);
    }

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.html();
    }

    var $elem = $("<input type='text' IsSerialize='true' style='width: 98%' />");
    $elem.val(val);
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    var $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' Value='" + val + "'>" + val + "</label>");
    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();

    if (typeof template.Validate != 'undefined' && typeof template.Validate == 'function') {
      var result = {
        Success: true,
        Msg: null
      };
      result.Success = template.Validate();
      return result;
    } else {
      return EditTableValidate.Validate(val, template);
    }
  }
};
"use strict";

var TreeTableConfig = {
  CanDeleteWhenHasChild: false,
  IdField: "Organ_Id",
  RowIdPrefix: "TreeTable_",
  LoadChildJsonURL: "",
  LoadChildFunc: null,
  OpenLevel: 1,
  ChildTestField: "Child_Count",
  Templates: [{
    Title: "组织机构名称",
    FieldName: "Organ_Name",
    TitleCellClassName: "TitleCell",
    Renderer: "Lable",
    Hidden: false,
    TitleCellAttrs: {},
    Width: "50%"
  }, {
    Title: "组织机构缩写名称",
    FieldName: "Organ_ShortName",
    TitleCellClassName: "TitleCell",
    Renderer: "Lable",
    Hidden: false,
    TitleCellAttrs: {},
    Width: "20%"
  }, {
    Title: "组织编号",
    FieldName: "Organ_Code",
    TitleCellClassName: "TitleCell",
    Renderer: "Lable",
    Hidden: false,
    TitleCellAttrs: {},
    Width: "20%"
  }, {
    Title: "组织ID",
    FieldName: "Organ_Id",
    TitleCellClassName: "TitleCell",
    Renderer: "Lable",
    Hidden: false,
    TitleCellAttrs: {},
    Width: "10"
  }],
  TableClass: "TreeTable",
  RendererTo: "divEditTable",
  TableId: "TreeTable",
  TableAttrs: {
    cellpadding: "0",
    cellspacing: "0",
    border: "0"
  }
};
var TreeTableJsonData = {
  Organ_Id: "0",
  Organ_Name: "root",
  Organ_ShortName: "2",
  Organ_Code: "2",
  Child_Count: 2,
  Nodes: [{
    Organ_Id: "1",
    Organ_Name: "1Organ_Name",
    Organ_ShortName: "1",
    Organ_Code: "1",
    Child_Count: 2,
    Nodes: [{
      Organ_Id: "1-1",
      Organ_Name: "1-1Organ_Name",
      Organ_ShortName: "1-1",
      Organ_Code: "1-1",
      Child_Count: 1,
      Nodes: [{
        Organ_Id: "1-1-1",
        Organ_Name: "1-1-1Organ_Name",
        Organ_ShortName: "1-1-1",
        Organ_Code: "1-1",
        Child_Count: 0
      }]
    }, {
      Organ_Id: "1-2",
      Organ_Name: "1-2Organ_Name",
      Organ_ShortName: "1-2",
      Organ_Code: "1-2",
      Child_Count: 0
    }]
  }, {
    Organ_Id: "2",
    Organ_Name: "2Organ_Name",
    Organ_ShortName: "2",
    Organ_Code: "2",
    Child_Count: 0
  }, {
    Organ_Id: "3",
    Organ_Name: "3Organ_Name",
    Organ_ShortName: "3",
    Organ_Code: "3",
    Child_Count: 0
  }, {
    Organ_Id: "4",
    Organ_Name: "4Organ_Name",
    Organ_ShortName: "4",
    Organ_Code: "4",
    Child_Count: 0
  }]
};
var TreeTableJsonDataList = [{
  Organ_Id: "0",
  Organ_Name: "root",
  Organ_ShortName: "2",
  Organ_Code: "2",
  Child_Count: 2
}, {
  Organ_Id: "1",
  Organ_Name: "1Organ_Name",
  Organ_ShortName: "1",
  Organ_Code: "1",
  Child_Count: 2,
  Parent_Id: "0"
}, {
  Organ_Id: "2",
  Organ_Name: "2Organ_Name",
  Organ_ShortName: "2",
  Organ_Code: "2",
  Child_Count: 0,
  Parent_Id: "0"
}, {
  Organ_Id: "1-1",
  Organ_Name: "1-1Organ_Name",
  Organ_ShortName: "1-1",
  Organ_Code: "1-1",
  Child_Count: 1,
  Parent_Id: "1"
}, {
  Organ_Id: "1-2",
  Organ_Name: "1-2Organ_Name",
  Organ_ShortName: "1-2",
  Organ_Code: "1-2",
  Child_Count: 0,
  Parent_Id: "1"
}, {
  Organ_Id: "1-1-1",
  Organ_Name: "1-1-1Organ_Name",
  Organ_ShortName: "1-1-1",
  Organ_Code: "1-1",
  Child_Count: 0,
  Parent_Id: "1-1"
}];
"use strict";

var TreeTable = {
  _$Prop_TableElem: null,
  _$Prop_RendererToElem: null,
  _Prop_Config: null,
  _Prop_JsonData: null,
  _Prop_AutoOpenLevel: 0,
  _Prop_FirstColumn_Inden: 20,
  _Prop_CurrentSelectedRowId: null,
  Initialization: function Initialization(_config) {
    this._Prop_Config = _config;
    this._$Prop_RendererToElem = $("#" + this._Prop_Config.RendererTo);
    this._$Prop_TableElem = this.CreateTable();

    this._$Prop_TableElem.append(this.CreateTableTitleRow());

    this._$Prop_RendererToElem.append(this._$Prop_TableElem);
  },
  LoadJsonData: function LoadJsonData(jsonDatas) {
    if (jsonDatas != null && jsonDatas != undefined) {
      this._Prop_JsonData = jsonDatas;
      this._Prop_AutoOpenLevel = this._Prop_Config.OpenLevel;

      var rowId = this._GetRowDataId(jsonDatas);

      this._CreateRootRow(jsonDatas, rowId);

      this._LoopCreateRow(jsonDatas, jsonDatas.Nodes, 1, rowId);

      this.RendererStyle();
    } else {
      alert("Json Data Object Error");
    }
  },
  _CreateRootRow: function _CreateRootRow(parentjsonNode, parentIdList) {
    var rowElem = this.CreateRowElem(parentjsonNode, 0, null, true, parentIdList);

    this._$Prop_TableElem.append(rowElem);

    this.SetJsonDataExtendAttr_CurrentLevel(parentjsonNode, 0);
    this.SetJsonDataExtendAttr_ParentIdList(parentjsonNode, parentIdList);
  },
  _LoopCreateRow: function _LoopCreateRow(parentjsonNode, jsonNodeArray, currentLevel, parentIdList) {
    this._Prop_Config.IsOpenALL;

    if (jsonNodeArray != undefined) {
      for (var i = 0; i < jsonNodeArray.length; i++) {
        var item = jsonNodeArray[i];

        var rowIsOpen = this._TestRowIsOpen(currentLevel);

        var rowId = this._GetRowDataId(item);

        var _pIdList = this._CreateParentIdList(parentIdList, rowId);

        this.SetJsonDataExtendAttr_CurrentLevel(item, currentLevel);
        this.SetJsonDataExtendAttr_ParentIdList(item, _pIdList);
        var rowElem = this.CreateRowElem(item, currentLevel, parentjsonNode, rowIsOpen, _pIdList);

        this._$Prop_TableElem.append(rowElem);

        if (item.Nodes != undefined && item.Nodes != null && item.Nodes.length > 0) {
          var _tp = currentLevel + 1;

          this._LoopCreateRow(item, item.Nodes, _tp, _pIdList);
        }
      }
    }
  },
  CreateTable: function CreateTable() {
    var _C = this._Prop_Config;

    var _editTable = $("<table />");

    _editTable.addClass(_C.TableClass);

    _editTable.attr("Id", _C.TableId);

    _editTable.attr(_C.TableAttrs);

    return _editTable;
  },
  SetJsonDataExtendAttr_CurrentLevel: function SetJsonDataExtendAttr_CurrentLevel(jsonData, value) {
    jsonData._Extend_CurrentLevel = value;
  },
  GetJsonDataExtendAttr_CurrentLevel: function GetJsonDataExtendAttr_CurrentLevel(jsonData) {
    return jsonData._Extend_CurrentLevel;
  },
  SetJsonDataExtendAttr_ParentIdList: function SetJsonDataExtendAttr_ParentIdList(jsonData, value) {
    jsonData._Extend_ParentIdList = value;
  },
  GetJsonDataExtendAttr_ParentIdList: function GetJsonDataExtendAttr_ParentIdList(jsonData) {
    return jsonData._Extend_ParentIdList;
  },
  CreateTableTitleRow: function CreateTableTitleRow() {
    var _C = this._Prop_Config;

    var _thead = $("<thead>\
                                <tr isHeader='true' />\
                            </thead>");

    var _titleRow = _thead.find("tr");

    for (var i = 0; i < _C.Templates.length; i++) {
      var template = _C.Templates[i];
      var title = template.Title;
      var th = $("<th>" + title + "</th>");

      if (template.TitleCellClassName) {
        th.addClass(template.TitleCellClassName);
      }

      if (template.TitleCellAttrs) {
        th.attr(template.TitleCellAttrs);
      }

      if (typeof template.Hidden != 'undefined' && template.Hidden == true) {
        th.hide();
      }

      if (template.Style) {
        th.css(template.Style);
      }

      _titleRow.append(th);
    }

    return _thead;
  },
  CreateRowElem: function CreateRowElem(rowData, currentLevel, parentRowData, rowIsOpen, parentIdList) {
    var _c = this._Prop_Config;
    var $tr = $("<tr />");

    var elemId = this._CreateElemId(rowData);

    var rowId = this._GetRowDataId(rowData);

    var prowId = this._CreateParentRowId(parentRowData);

    $tr.attr("rowId", rowId).attr("pid", prowId).attr("id", elemId).attr("currentLevel", currentLevel).attr("isdatarow", "true");
    var _testfield = _c.ChildTestField;
    var hasChild = rowData[_testfield];

    if (hasChild == true || hasChild == "true" || hasChild > 0) {
      $tr.attr("hasChild", "true");
    }

    $tr.attr("rowIsOpen", rowIsOpen).attr("parentIdList", parentIdList);

    for (var i = 0; i < _c.Templates.length; i++) {
      var _cc = _c.Templates[i];
      var _cd = rowData[_cc.FieldName];
      var _width = _cc.Width;
      var _renderer = _cc.Renderer;
      var $td = $("<td bindField=\"" + _cc.FieldName + "\" Renderer='" + _renderer + "'>" + _cd + "</td>").css("width", _width);

      if (_renderer == "DateTime") {
        var date = new Date(_cd);
        var dateStr = DateUtility.Format(date, 'yyyy-MM-dd');
        $td.text(dateStr);
      } else {
        if (!_cd) {
          $td.text("");
        }
      }

      if (_cc.TextAlign) {
        $td.css("textAlign", _cc.TextAlign);
      }

      if (i == 0) {}

      if (typeof _cc.Hidden != 'undefined' && _cc.Hidden == true) {
        $td.hide();
      }

      if (typeof _cc.Style != 'undefined') {
        $td.css(_cc.Style);
      }

      $tr.append($td);
    }

    var _self = this;

    $tr.bind("click", null, function (event) {
      $(".tr-selected").removeClass("tr-selected");
      $(this).addClass("tr-selected");
      _self._Prop_CurrentSelectedRowId = $(this).attr("rowId");

      if (typeof _c.ClickRowEvent !== 'undefined' && typeof _c.ClickRowEvent == 'function') {
        _c.ClickRowEvent(rowId);
      }
    });
    $tr.hover(function () {
      if (!$(this).hasClass("tr-selected")) {
        $(this).addClass("tr-hover");
      }
    }, function () {
      $(".tr-hover").removeClass("tr-hover");
    });
    return $tr;
  },
  _TestRowIsOpen: function _TestRowIsOpen(currentLevel) {
    if (this._Prop_Config.OpenLevel > currentLevel) {
      return true;
    }

    return false;
  },
  _CreateElemId: function _CreateElemId(rowData) {
    var rowIdPrefix = "";

    if (this._Prop_Config.RowIdPrefix != undefined && this._Prop_Config.RowIdPrefix != undefined != null) {
      rowIdPrefix = this._Prop_Config.RowIdPrefix;
    }

    return rowIdPrefix + this._GetRowDataId(rowData);
  },
  _CreateParentIdList: function _CreateParentIdList(parentIdList, rowId) {
    return parentIdList + "※" + rowId;
  },
  _CreateParentIdListByParentJsonData: function _CreateParentIdListByParentJsonData(parentJsonData, selfJsonData) {
    var parentIdList = this.GetJsonDataExtendAttr_ParentIdList(parentJsonData);

    var rowId = this._GetRowDataId(selfJsonData);

    return this._CreateParentIdList(parentIdList, rowId);
  },
  _GetRowDataId: function _GetRowDataId(rowData) {
    var idField = this._Prop_Config.IdField;

    if (rowData[idField] != undefined && rowData[idField] != null) {
      return rowData[idField];
    } else {
      alert("在数据源中找不到用于构建Id的字段，请检查配置及数据源");
      return null;
    }
  },
  _CreateParentRowId: function _CreateParentRowId(parentRowData) {
    if (parentRowData == null) {
      return "Root";
    } else {
      return this._GetRowDataId(parentRowData);
    }
  },
  RendererStyle: function RendererStyle() {
    var _self = this;

    $("tr[isdatarow='true']").each(function () {
      var $tr = $(this);
      var $firsttd = $(this).find("td:first");
      var rowid = $tr.attr("rowId");
      var sourceText = $firsttd.text();
      $firsttd.css("padding-left", _self._Prop_FirstColumn_Inden * parseInt($(this).attr("currentLevel")));
      var hasChild = false;

      if ($tr.attr("hasChild") == "true") {
        hasChild = true;
      }

      var rowIsOpen = false;

      if ($tr.attr("rowIsOpen") == "true") {
        rowIsOpen = true;
      }

      var switchElem = _self._CreateRowSwitchElem(hasChild, rowIsOpen, rowid);

      $firsttd.html("");
      $firsttd.append(switchElem).append("<span>" + sourceText + "</span>");

      if (!rowIsOpen) {
        $("tr[pid='" + rowid + "']").hide();
      }
    });
  },
  _GetIndenClass: function _GetIndenClass(hasChild, isOpen) {
    if (hasChild && isOpen) {
      return "img-switch-open";
    }

    if (hasChild && !isOpen) {
      return "img-switch-close";
    }

    if (!hasChild) {
      return "img-switch-open";
    }

    return "img-switch-close";
  },
  _CreateRowSwitchElem: function _CreateRowSwitchElem(hasChild, isOpen, rowId) {
    var elem = $("<div isswitch=\"true\"></div>");

    var cls = this._GetIndenClass(hasChild, isOpen);

    elem.addClass(cls);
    var senddata = {
      RowId: rowId
    };
    elem.bind("click", senddata, function (event) {
      if (!hasChild) {
        return;
      }

      var $tr = $(this).parent().parent();
      var rowid = $tr.attr("rowId");
      var rowIsOpen = false;

      if ($tr.attr("rowIsOpen") == "true") {
        rowIsOpen = true;
      }

      if (rowIsOpen) {
        rowIsOpen = false;
        $("tr[parentIdList*='" + rowid + "※']").hide();
        $(this).removeClass("img-switch-open").addClass("img-switch-close");
        $("tr[parentIdList*='" + rowid + "※'][haschild='true']").find("[isswitch='true']").removeClass("img-switch-open").addClass("img-switch-close");
        $("tr[parentIdList*='" + rowid + "※'][haschild='true']").attr("rowisopen", false);
      } else {
        rowIsOpen = true;
        $("tr[pid='" + rowid + "']").show();
        $(this).removeClass("img-switch-close").addClass("img-switch-open");
      }

      $tr.attr("rowIsOpen", rowIsOpen);
    });
    return elem;
  },
  GetChildsRowElem: function GetChildsRowElem(loop, id) {
    if (loop) {
      return $("tr[parentIdList*='" + id + "']");
    } else {
      return $("tr[pid='" + id + "']");
    }
  },
  _Prop_SelectedRowData: null,
  _Prop_TempGetRowData: null,
  _GetSelectedRowData: function _GetSelectedRowData(node, id, isSetSelected) {
    var fieldName = this._Prop_Config.IdField;
    var fieldValue = node[fieldName];

    if (fieldValue == id) {
      if (isSetSelected) {
        this._Prop_SelectedRowData = node;
      } else {
        this._Prop_TempGetRowData = node;
      }
    } else {
      if (node.Nodes != undefined && node.Nodes != null) {
        for (var i = 0; i < node.Nodes.length; i++) {
          this._GetSelectedRowData(node.Nodes[i], id, isSetSelected);
        }
      }
    }
  },
  GetSelectedRowData: function GetSelectedRowData() {
    if (this._Prop_CurrentSelectedRowId == null) {
      return null;
    }

    this._GetSelectedRowData(this._Prop_JsonData, this._Prop_CurrentSelectedRowId, true);

    return this._Prop_SelectedRowData;
  },
  GetRowDataByRowId: function GetRowDataByRowId(rowId) {
    this._Prop_TempGetRowData = null;

    this._GetSelectedRowData(this._Prop_JsonData, rowId, false);

    return this._Prop_TempGetRowData;
  },
  AppendChildRowToCurrentSelectedRow: function AppendChildRowToCurrentSelectedRow(rowData) {
    var selectedRowData = this.GetSelectedRowData();

    if (selectedRowData.Nodes != undefined && selectedRowData.Nodes != null) {
      selectedRowData.Nodes.push(rowData);
    } else {
      selectedRowData.Nodes = new Array();
      selectedRowData.Nodes.push(rowData);
    }

    this.SetJsonDataExtendAttr_CurrentLevel(rowData, this.GetJsonDataExtendAttr_CurrentLevel(selectedRowData) + 1);
    this.SetJsonDataExtendAttr_ParentIdList(rowData, this._CreateParentIdListByParentJsonData(selectedRowData, rowData));
    var $tr = this.CreateRowElem(rowData, this.GetJsonDataExtendAttr_CurrentLevel(selectedRowData) + 1, selectedRowData, true, this.GetJsonDataExtendAttr_ParentIdList(rowData));

    var selectedRowId = this._GetRowDataId(selectedRowData);

    var currentSelectElem = $("tr[rowId='" + selectedRowId + "']");
    currentSelectElem.attr("haschild", "true");
    var lastChilds = $("tr[parentidlist*='" + selectedRowId + "※']:last");

    if (lastChilds.length > 0) {
      lastChilds.after($tr);
    } else {
      currentSelectElem.attr("rowisopen", true);
      currentSelectElem.after($tr);
    }

    this.RendererStyle();
  },
  UpdateToRow: function UpdateToRow(rowId, rowData) {
    var selectedRowData = this.GetRowDataByRowId(rowId);

    for (var attrName in rowData) {
      if (attrName != "Nodes") {
        selectedRowData[attrName] = rowData[attrName];
      }
    }

    var rowId = this._GetRowDataId(selectedRowData);

    var $tr = $("tr[rowid='" + rowId + "']");
    $tr.find("td").each(function () {
      var bindField = $(this).attr("bindField");
      var newtext = selectedRowData[bindField];
      var renderer = $(this).attr("Renderer");

      if (renderer == "DateTime") {
        var date = new Date(newtext);
        newtext = DateUtility.Format(date, 'yyyy-MM-dd');
      }

      if ($(this).find("[isswitch='true']").length > 0) {
        $(this).find("span").text(newtext);
      } else {
        $(this).text(newtext);
      }
    });
  },
  LoadChildByAjax: function LoadChildByAjax() {},
  DeleteRow: function DeleteRow(rowId) {
    var hasChild = false;

    if ($("tr[pid='" + rowId + "']").length > 0) {
      if (!this._Prop_Config.CanDeleteWhenHasChild) {
        alert("指定的节点存在子节点，请先删除子节点！");
      }
    }

    $("tr[parentidlist*='※" + rowId + "']").remove();
    this._Prop_CurrentSelectedRowId = null;
  },
  MoveUpRow: function MoveUpRow(rowId) {
    var thistr = $("tr[rowid='" + rowId + "']");
    var pid = thistr.attr("pid");
    var neartr = $(thistr.prevAll("[pid='" + pid + "']")[0]);
    var movetrs = $("tr[parentidlist*='※" + rowId + "']");
    movetrs.insertBefore(neartr);
  },
  MoveDownRow: function MoveDownRow(rowId) {
    var thistr = $("tr[rowid='" + rowId + "']");
    var pid = thistr.attr("pid");
    var neartr = $(thistr.nextAll("[pid='" + pid + "']")[0]);
    var neartrrid = neartr.attr("rowid");
    var offtrs = $("tr[parentidlist*='※" + neartrrid + "']");
    var offlasttr = $(offtrs[offtrs.length - 1]);
    var movetrs = $("tr[parentidlist*='※" + rowId + "']");
    movetrs.insertAfter(offlasttr);
  },
  GetBrothersNodeDatasByParentId: function GetBrothersNodeDatasByParentId(rowId) {
    var thistr = $("tr[rowid='" + rowId + "']");
    var pid = thistr.attr("pid");
    var brotherstr = $(thistr.parent().find("[pid='" + pid + "']"));
    var result = new Array();

    for (var i = 0; i < brotherstr.length; i++) {
      result.push(this.GetRowDataByRowId($(brotherstr[i]).attr("rowid")));
    }

    return result;
  },
  RemoveAllRow: function RemoveAllRow() {
    if (this._$Prop_TableElem != null) {
      this._$Prop_TableElem.find("tr:not(:first)").each(function () {
        $(this).remove();
      });
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkpzL0NvbmZpZy5qcyIsIkpzL0VkaXRUYWJsZS5qcyIsIkpzL1JlbmRlcmVycy9FZGl0VGFibGVfQ2hlY2tCb3guanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX0Zvcm1hdHRlci5qcyIsIkpzL1JlbmRlcmVycy9FZGl0VGFibGVfTGFiZWwuanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX1JhZGlvLmpzIiwiSnMvUmVuZGVyZXJzL0VkaXRUYWJsZV9TZWxlY3QuanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX1NlbGVjdFJvd0NoZWNrQm94LmpzIiwiSnMvUmVuZGVyZXJzL0VkaXRUYWJsZV9UZXh0Qm94LmpzIiwiZGVtby9UcmVlVGFibGVDb25maWcuanMiLCJKcy9UcmVlVGFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJVSUVYQ29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmlmICghT2JqZWN0LmNyZWF0ZSkge1xuICBPYmplY3QuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEYoKSB7fVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignT2JqZWN0LmNyZWF0ZSBpbXBsZW1lbnRhdGlvbiBvbmx5IGFjY2VwdHMgb25lIHBhcmFtZXRlci4nKTtcbiAgICAgIH1cblxuICAgICAgRi5wcm90b3R5cGUgPSBvO1xuICAgICAgcmV0dXJuIG5ldyBGKCk7XG4gICAgfTtcbiAgfSgpO1xufVxuXG52YXIgRWRpdFRhYmxlQ29uZmlnID0ge1xuICBTdGF0dXM6IFwiRWRpdFwiLFxuICBUZW1wbGF0ZXM6IFt7XG4gICAgVGl0bGU6IFwi6KGo5ZCNMVwiLFxuICAgIEZpZWxkTmFtZTogXCJUYWJsZUZpZWxkXCIsXG4gICAgUmVuZGVyZXI6IFwiRWRpdFRhYmxlX1RleHRCb3hcIixcbiAgICBUaXRsZUNlbGxDbGFzc05hbWU6IFwiVGl0bGVDZWxsXCIsXG4gICAgSGlkZGVuOiBmYWxzZSxcbiAgICBUaXRsZUNlbGxBdHRyczoge31cbiAgfSwge1xuICAgIFRpdGxlOiBcIuWtl+auteexu+Wei1wiLFxuICAgIEZpZWxkTmFtZTogXCJUYWJsZUZpZWxkXCIsXG4gICAgUmVuZGVyZXI6IFwiRWRpdFRhYmxlX1RleHRCb3hcIixcbiAgICBIaWRkZW46IGZhbHNlXG4gIH0sIHtcbiAgICBUaXRsZTogXCLlpIfms6hcIixcbiAgICBGaWVsZE5hbWU6IFwiVGFibGVGaWVsZFwiLFxuICAgIFJlbmRlcmVyOiBcIkVkaXRUYWJsZV9UZXh0Qm94XCIsXG4gICAgSGlkZGVuOiBmYWxzZVxuICB9XSxcbiAgUm93SWRDcmVhdGVyOiBmdW5jdGlvbiBSb3dJZENyZWF0ZXIoKSB7fSxcbiAgVGFibGVDbGFzczogXCJFZGl0VGFibGVcIixcbiAgUmVuZGVyZXJUbzogXCJkaXZUcmVlVGFibGVcIixcbiAgVGFibGVJZDogXCJFZGl0VGFibGVcIixcbiAgVGFibGVBdHRyczoge1xuICAgIGNlbGxwYWRkaW5nOiBcIjFcIixcbiAgICBjZWxsc3BhY2luZzogXCIxXCIsXG4gICAgYm9yZGVyOiBcIjFcIlxuICB9XG59O1xudmFyIEVkaXRUYWJsZURhdGEgPSB7fTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZSA9IHtcbiAgXyRQcm9wX1RhYmxlRWxlbTogbnVsbCxcbiAgXyRQcm9wX1JlbmRlcmVyVG9FbGVtOiBudWxsLFxuICBfUHJvcF9Db25maWdNYW5hZ2VyOiBudWxsLFxuICBfUHJvcF9Kc29uRGF0YTogbmV3IE9iamVjdCgpLFxuICBfJFByb3BfRWRpdGluZ1Jvd0VsZW06IG51bGwsXG4gIF9TdGF0dXM6IFwiRWRpdFwiLFxuICBJbml0aWFsaXphdGlvbjogZnVuY3Rpb24gSW5pdGlhbGl6YXRpb24oX2NvbmZpZykge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlciA9IE9iamVjdC5jcmVhdGUoRWRpdFRhYmxlQ29uZmlnTWFuYWdlcik7XG5cbiAgICB0aGlzLl9Qcm9wX0NvbmZpZ01hbmFnZXIuSW5pdGlhbGl6YXRpb25Db25maWcoX2NvbmZpZyk7XG5cbiAgICB2YXIgX0MgPSB0aGlzLl9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0Q29uZmlnKCk7XG5cbiAgICB0aGlzLl8kUHJvcF9SZW5kZXJlclRvRWxlbSA9ICQoXCIjXCIgKyBfQy5SZW5kZXJlclRvKTtcbiAgICB0aGlzLl8kUHJvcF9UYWJsZUVsZW0gPSB0aGlzLkNyZWF0ZVRhYmxlKCk7XG5cbiAgICB0aGlzLl8kUHJvcF9UYWJsZUVsZW0uYXBwZW5kKHRoaXMuQ3JlYXRlVGFibGVUaXRsZVJvdygpKTtcblxuICAgIHRoaXMuXyRQcm9wX1JlbmRlcmVyVG9FbGVtLmFwcGVuZCh0aGlzLl8kUHJvcF9UYWJsZUVsZW0pO1xuXG4gICAgaWYgKF9DLlN0YXR1cykge1xuICAgICAgdGhpcy5fU3RhdHVzID0gX0MuU3RhdHVzO1xuICAgIH1cbiAgfSxcbiAgTG9hZEpzb25EYXRhOiBmdW5jdGlvbiBMb2FkSnNvbkRhdGEoanNvbkRhdGEpIHtcbiAgICBpZiAoanNvbkRhdGEgIT0gbnVsbCAmJiBqc29uRGF0YSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwganNvbkRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBqc29uRGF0YVtpXTtcbiAgICAgICAgdmFyIHJvd0lkID0gdGhpcy5BZGRFZGl0aW5nUm93QnlUZW1wbGF0ZShqc29uRGF0YSwgaXRlbSk7XG4gICAgICAgIHRoaXMuX1Byb3BfSnNvbkRhdGFbcm93SWRdID0gaXRlbTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5Db21wbGV0ZWRFZGl0aW5nUm93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFsZXJ0KFwiSnNvbiBEYXRhIE9iamVjdCBFcnJvclwiKTtcbiAgICB9XG4gIH0sXG4gIENyZWF0ZVRhYmxlOiBmdW5jdGlvbiBDcmVhdGVUYWJsZSgpIHtcbiAgICB2YXIgX0MgPSB0aGlzLl9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0Q29uZmlnKCk7XG5cbiAgICB2YXIgX2VkaXRUYWJsZSA9ICQoXCI8dGFibGUgLz5cIik7XG5cbiAgICBfZWRpdFRhYmxlLmFkZENsYXNzKF9DLlRhYmxlQ2xhc3MpO1xuXG4gICAgX2VkaXRUYWJsZS5hdHRyKFwiSWRcIiwgX0MuVGFibGVJZCk7XG5cbiAgICBfZWRpdFRhYmxlLmF0dHIoX0MuVGFibGVBdHRycyk7XG5cbiAgICByZXR1cm4gX2VkaXRUYWJsZTtcbiAgfSxcbiAgQ3JlYXRlVGFibGVUaXRsZVJvdzogZnVuY3Rpb24gQ3JlYXRlVGFibGVUaXRsZVJvdygpIHtcbiAgICB2YXIgX0MgPSB0aGlzLl9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0Q29uZmlnKCk7XG5cbiAgICB2YXIgX3RpdGxlUm93ID0gJChcIjx0ciBpc0hlYWRlcj0ndHJ1ZScgLz5cIik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9DLlRlbXBsYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRlbXBsYXRlID0gX0MuVGVtcGxhdGVzW2ldO1xuICAgICAgdmFyIHRpdGxlID0gdGVtcGxhdGUuVGl0bGU7XG4gICAgICB2YXIgdGggPSAkKFwiPHRoPlwiICsgdGl0bGUgKyBcIjwvdGg+XCIpO1xuXG4gICAgICBpZiAodGVtcGxhdGUuVGl0bGVDZWxsQ2xhc3NOYW1lKSB7XG4gICAgICAgIHRoLmFkZENsYXNzKHRlbXBsYXRlLlRpdGxlQ2VsbENsYXNzTmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ZW1wbGF0ZS5UaXRsZUNlbGxBdHRycykge1xuICAgICAgICB0aC5hdHRyKHRlbXBsYXRlLlRpdGxlQ2VsbEF0dHJzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5IaWRkZW4gIT0gJ3VuZGVmaW5lZCcgJiYgdGVtcGxhdGUuSGlkZGVuID09IHRydWUpIHtcbiAgICAgICAgdGguaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBfdGl0bGVSb3cuYXBwZW5kKHRoKTtcbiAgICB9XG5cbiAgICB2YXIgX3RpdGxlUm93SGVhZCA9ICQoXCI8dGhlYWQ+PC90aGVhZD5cIik7XG5cbiAgICBfdGl0bGVSb3dIZWFkLmFwcGVuZChfdGl0bGVSb3cpO1xuXG4gICAgcmV0dXJuIF90aXRsZVJvd0hlYWQ7XG4gIH0sXG4gIEFkZEVtcHR5RWRpdGluZ1Jvd0J5VGVtcGxhdGU6IGZ1bmN0aW9uIEFkZEVtcHR5RWRpdGluZ1Jvd0J5VGVtcGxhdGUoY2FsbGJhY2tmdW4pIHtcbiAgICB2YXIgcm93SWQgPSB0aGlzLkFkZEVkaXRpbmdSb3dCeVRlbXBsYXRlKG51bGwpO1xuICAgIHRoaXMuX1Byb3BfSnNvbkRhdGFbcm93SWRdID0gbnVsbDtcbiAgfSxcbiAgQWRkRWRpdGluZ1Jvd0J5VGVtcGxhdGU6IGZ1bmN0aW9uIEFkZEVkaXRpbmdSb3dCeVRlbXBsYXRlKGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICBpZiAodGhpcy5Db21wbGV0ZWRFZGl0aW5nUm93KCkpIHtcbiAgICAgIHZhciByb3dJZCA9IFN0cmluZ1V0aWxpdHkuR3VpZCgpO1xuICAgICAgdmFyICRyb3dFbGVtID0gJChcIjx0ciAvPlwiKTtcbiAgICAgICRyb3dFbGVtLmF0dHIoXCJpZFwiLCByb3dJZCk7XG4gICAgICB0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSA9ICRyb3dFbGVtO1xuXG4gICAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkICYmIGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUuZWRpdEVhYmxlID09IGZhbHNlKSB7fSBlbHNlIHtcbiAgICAgICAgdmFyIGV2ZW50X2RhdGEgPSB7XG4gICAgICAgICAgaG9zdDogdGhpc1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0aGlzLl9TdGF0dXMgIT0gXCJWaWV3XCIpIHtcbiAgICAgICAgICAkcm93RWxlbS5iaW5kKFwiY2xpY2tcIiwgZXZlbnRfZGF0YSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgcm93U3RhdHVzID0gJHJvd0VsZW0uYXR0cihcInN0YXR1c1wiKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiByb3dTdGF0dXMgIT0gJ3VuZGVmaW5lZCcgJiYgcm93U3RhdHVzID09IFwiZGlzYWJsZWRcIikge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfaG9zdCA9IGV2ZW50LmRhdGEuaG9zdDtcblxuICAgICAgICAgICAgaWYgKF9ob3N0Ll8kUHJvcF9FZGl0aW5nUm93RWxlbSAhPSBudWxsICYmICQodGhpcykuYXR0cihcImlkXCIpID09IF9ob3N0Ll8kUHJvcF9FZGl0aW5nUm93RWxlbS5hdHRyKFwiaWRcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX0MgPSBfaG9zdC5fUHJvcF9Db25maWdNYW5hZ2VyLkdldENvbmZpZygpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIF9DLlJvd0NsaWNrICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiBfQy5Sb3dDbGljayA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IF9DLlJvd0NsaWNrKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9ICd1bmRlZmluZWQnICYmIHJlc3VsdCA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiX0MuUm93Q2xpY2soKSBFcnJvclwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX2hvc3QuQ29tcGxldGVkRWRpdGluZ1JvdygpKSB7XG4gICAgICAgICAgICAgIF9ob3N0Ll8kUHJvcF9FZGl0aW5nUm93RWxlbSA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgX2hvc3QuU2V0Um93SXNFZGl0U3RhdHVzKF9ob3N0Ll8kUHJvcF9FZGl0aW5nUm93RWxlbSk7XG5cbiAgICAgICAgICAgICAgdmFyIF9yb3cgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgIF9yb3cuZmluZChcInRkXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciAkdGQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgIHZhciByZW5kZXJlciA9ICR0ZC5hdHRyKFwicmVuZGVyZXJcIik7XG4gICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlSWQgPSAkdGQuYXR0cihcInRlbXBsYXRlSWRcIik7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSBfaG9zdC5fUHJvcF9Db25maWdNYW5hZ2VyLkdldFRlbXBsYXRlKHRlbXBsYXRlSWQpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyT2JqID0gZXZhbChcIk9iamVjdC5jcmVhdGUoXCIgKyByZW5kZXJlciArIFwiKVwiKTtcbiAgICAgICAgICAgICAgICB2YXIgJGh0bWxlbGVtID0gcmVuZGVyZXJPYmouR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX0MsIHRlbXBsYXRlLCAkdGQsIF9yb3csIHRoaXMuXyRQcm9wX1RhYmxlRWxlbSwgJHRkLmNoaWxkcmVuKCkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5IaWRkZW4gIT0gJ3VuZGVmaW5lZCcgJiYgdGVtcGxhdGUuSGlkZGVuID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICR0ZC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5TdHlsZSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgJHRkLmNzcyh0ZW1wbGF0ZS5TdHlsZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJHRkLmh0bWwoXCJcIik7XG4gICAgICAgICAgICAgICAgJHRkLmFwcGVuZCgkaHRtbGVsZW0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgX0MgPSB0aGlzLl9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0Q29uZmlnKCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX0MuVGVtcGxhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IF9DLlRlbXBsYXRlc1tpXTtcbiAgICAgICAgdmFyIHJlbmRlcmVyID0gbnVsbDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJlbmRlcmVyID0gdGVtcGxhdGUuUmVuZGVyZXI7XG4gICAgICAgICAgdmFyIHJlbmRlcmVyT2JqID0gZXZhbChcIk9iamVjdC5jcmVhdGUoXCIgKyByZW5kZXJlciArIFwiKVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGFsZXJ0KFwi5a6e5L6L5YyWXCIgKyByZW5kZXJlciArIFwi5aSx6LSlIVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciAkdGRFbGVtID0gbnVsbDtcbiAgICAgICAgJHRkRWxlbSA9ICQoXCI8dGQgLz5cIik7XG4gICAgICAgICR0ZEVsZW0uYXR0cihcInJlbmRlcmVyXCIsIHJlbmRlcmVyKTtcbiAgICAgICAgJHRkRWxlbS5hdHRyKFwidGVtcGxhdGVJZFwiLCB0ZW1wbGF0ZS5UZW1wbGF0ZUlkKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkhpZGRlbiAhPSAndW5kZWZpbmVkJyAmJiB0ZW1wbGF0ZS5IaWRkZW4gPT0gdHJ1ZSkge1xuICAgICAgICAgICR0ZEVsZW0uaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5XaWR0aCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICR0ZEVsZW0uY3NzKFwid2lkdGhcIiwgdGVtcGxhdGUuV2lkdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5BbGlnbiAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICR0ZEVsZW0uYXR0cihcImFsaWduXCIsIHRlbXBsYXRlLkFsaWduKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciAkZWxlbSA9IHJlbmRlcmVyT2JqLkdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9DLCB0ZW1wbGF0ZSwgJHRkRWxlbSwgJHJvd0VsZW0sIHRoaXMuXyRQcm9wX1RhYmxlRWxlbSwgbnVsbCwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5TdHlsZSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICR0ZEVsZW0uY3NzKHRlbXBsYXRlLlN0eWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgICR0ZEVsZW0uYXBwZW5kKCRlbGVtKTtcbiAgICAgICAgJHJvd0VsZW0uYXBwZW5kKCR0ZEVsZW0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl8kUHJvcF9UYWJsZUVsZW0uYXBwZW5kKCRyb3dFbGVtKTtcblxuICAgICAgaWYgKHR5cGVvZiBfQy5BZGRBZnRlclJvd0V2ZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgX0MuQWRkQWZ0ZXJSb3dFdmVudCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIF9DLkFkZEFmdGVyUm93RXZlbnQoJHJvd0VsZW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcm93SWQ7XG4gICAgfVxuICB9LFxuICBTZXRUb1ZpZXdTdGF0dXM6IGZ1bmN0aW9uIFNldFRvVmlld1N0YXR1cygpIHtcbiAgICB0aGlzLl9TdGF0dXMgPSBcIlZpZXdcIjtcbiAgfSxcbiAgU2V0Um93SXNFZGl0U3RhdHVzOiBmdW5jdGlvbiBTZXRSb3dJc0VkaXRTdGF0dXModHIpIHtcbiAgICAkKHRyKS5hdHRyKFwiRWRpdFN0YXR1c1wiLCBcIkVkaXRTdGF0dXNcIik7XG4gIH0sXG4gIFNldFJvd0lzQ29tcGxldGVkU3RhdHVzOiBmdW5jdGlvbiBTZXRSb3dJc0NvbXBsZXRlZFN0YXR1cyh0cikge1xuICAgICQodHIpLmF0dHIoXCJFZGl0U3RhdHVzXCIsIFwiQ29tcGxldGVkU3RhdHVzXCIpO1xuICB9LFxuICBSb3dJc0VkaXRTdGF0dXM6IGZ1bmN0aW9uIFJvd0lzRWRpdFN0YXR1cyh0cikge1xuICAgIHJldHVybiAkKHRyKS5hdHRyKFwiRWRpdFN0YXR1c1wiKSA9PSBcIkVkaXRTdGF0dXNcIjtcbiAgfSxcbiAgUm93SXNDb21wbGV0ZWRTdGF0dXM6IGZ1bmN0aW9uIFJvd0lzQ29tcGxldGVkU3RhdHVzKHRyKSB7XG4gICAgcmV0dXJuICQodHIpLmF0dHIoXCJFZGl0U3RhdHVzXCIpID09IFwiQ29tcGxldGVkU3RhdHVzXCI7XG4gIH0sXG4gIENvbXBsZXRlZEVkaXRpbmdSb3c6IGZ1bmN0aW9uIENvbXBsZXRlZEVkaXRpbmdSb3coKSB7XG4gICAgdmFyIHJlc3VsdCA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW0gIT0gbnVsbCkge1xuICAgICAgaWYgKCF0aGlzLlJvd0lzQ29tcGxldGVkU3RhdHVzKHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtKSkge1xuICAgICAgICB2YXIgX0MgPSB0aGlzLl9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0Q29uZmlnKCk7XG5cbiAgICAgICAgdmFyIF9ob3N0ID0gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5WYWxpZGF0ZUNvbXBsZXRlZEVkaXRpbmdSb3dFbmFibGUodGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW0pKSB7XG4gICAgICAgICAgdmFyIF9yb3cgPSB0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbTtcbiAgICAgICAgICB0aGlzLlNldFJvd0lzQ29tcGxldGVkU3RhdHVzKF9yb3cpO1xuXG4gICAgICAgICAgX3Jvdy5maW5kKFwidGRcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJHRkID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciByZW5kZXJlciA9ICR0ZC5hdHRyKFwicmVuZGVyZXJcIik7XG4gICAgICAgICAgICB2YXIgdGVtcGxhdGVJZCA9ICR0ZC5hdHRyKFwidGVtcGxhdGVJZFwiKTtcblxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gX2hvc3QuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcblxuICAgICAgICAgICAgdmFyIHJlbmRlcmVyT2JqID0gZXZhbChcIk9iamVjdC5jcmVhdGUoXCIgKyByZW5kZXJlciArIFwiKVwiKTtcbiAgICAgICAgICAgIHZhciAkaHRtbGVsZW0gPSByZW5kZXJlck9iai5HZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9DLCB0ZW1wbGF0ZSwgJHRkLCBfcm93LCB0aGlzLl8kUHJvcF9UYWJsZUVsZW0sICR0ZC5jaGlsZHJlbigpKTtcbiAgICAgICAgICAgICR0ZC5odG1sKFwiXCIpO1xuICAgICAgICAgICAgJHRkLmFwcGVuZCgkaHRtbGVsZW0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW0gPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgVmFsaWRhdGVDb21wbGV0ZWRFZGl0aW5nUm93RW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZUNvbXBsZXRlZEVkaXRpbmdSb3dFbmFibGUoZWRpdFJvdykge1xuICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgIHZhciBfaG9zdCA9IHRoaXM7XG5cbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICB2YXIgdmFsaWRhdGVNc2cgPSBcIlwiO1xuICAgIHZhciB0ZHMgPSAkKGVkaXRSb3cpLmZpbmQoXCJ0ZFwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgJHRkID0gJCh0ZHNbaV0pO1xuICAgICAgdmFyIHJlbmRlcmVyID0gJHRkLmF0dHIoXCJyZW5kZXJlclwiKTtcbiAgICAgIHZhciB0ZW1wbGF0ZUlkID0gJHRkLmF0dHIoXCJ0ZW1wbGF0ZUlkXCIpO1xuXG4gICAgICB2YXIgdGVtcGxhdGUgPSBfaG9zdC5fUHJvcF9Db25maWdNYW5hZ2VyLkdldFRlbXBsYXRlKHRlbXBsYXRlSWQpO1xuXG4gICAgICB2YXIgcmVuZGVyZXJPYmogPSBldmFsKFwiT2JqZWN0LmNyZWF0ZShcIiArIHJlbmRlcmVyICsgXCIpXCIpO1xuICAgICAgdmFyIHZhbHJlc3VsdCA9IHJlbmRlcmVyT2JqLlZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX0MsIHRlbXBsYXRlLCAkdGQsIGVkaXRSb3csIHRoaXMuXyRQcm9wX1RhYmxlRWxlbSwgJHRkLmNoaWxkcmVuKCkpO1xuXG4gICAgICBpZiAodmFscmVzdWx0LlN1Y2Nlc3MgPT0gZmFsc2UpIHtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIHZhbGlkYXRlTXNnID0gdmFscmVzdWx0Lk1zZztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFyZXN1bHQgJiYgdmFsaWRhdGVNc2cgIT0gbnVsbCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHZhbGlkYXRlTXNnLCBudWxsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBSZW1vdmVSb3c6IGZ1bmN0aW9uIFJlbW92ZVJvdygpIHtcbiAgICBpZiAodGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW0gIT0gbnVsbCkge1xuICAgICAgdGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW0ucmVtb3ZlKCk7XG5cbiAgICAgIHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtID0gbnVsbDtcbiAgICB9XG4gIH0sXG4gIEdldFRhYmxlT2JqZWN0OiBmdW5jdGlvbiBHZXRUYWJsZU9iamVjdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fJFByb3BfVGFibGVFbGVtO1xuICB9LFxuICBHZXRSb3dzOiBmdW5jdGlvbiBHZXRSb3dzKCkge1xuICAgIGlmICh0aGlzLl8kUHJvcF9UYWJsZUVsZW0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5maW5kKFwidHI6bm90KDpmaXJzdClcIik7XG4gICAgfVxuICB9LFxuICBHZXRFZGl0Um93OiBmdW5jdGlvbiBHZXRFZGl0Um93KCkge1xuICAgIGlmICh0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSxcbiAgR2V0TGFzdFJvdzogZnVuY3Rpb24gR2V0TGFzdFJvdygpIHtcbiAgICB2YXIgcm93ID0gdGhpcy5HZXRFZGl0Um93KCk7XG4gICAgaWYgKHJvdyA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgICB2YXIgcm93cyA9IHRoaXMuR2V0Um93cygpO1xuICAgIHZhciBpbmRleCA9IHJvd3MuaW5kZXgocm93KTtcblxuICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgIHJldHVybiAkKHJvd3NbaW5kZXggLSAxXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIEdldE5leHRSb3c6IGZ1bmN0aW9uIEdldE5leHRSb3coKSB7XG4gICAgdmFyIHJvdyA9IHRoaXMuR2V0RWRpdFJvdygpO1xuICAgIGlmIChyb3cgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgdmFyIHJvd3MgPSB0aGlzLkdldFJvd3MoKTtcbiAgICB2YXIgaW5kZXggPSByb3dzLmluZGV4KHJvdyk7XG5cbiAgICBpZiAoaW5kZXggPCByb3dzLmxlbmd0aCAtIDEpIHtcbiAgICAgIHJldHVybiAkKHJvd3NbaW5kZXggKyAxXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIE1vdmVVcDogZnVuY3Rpb24gTW92ZVVwKCkge1xuICAgIHZhciByb3cgPSB0aGlzLkdldExhc3RSb3coKTtcblxuICAgIGlmIChyb3cgIT0gbnVsbCkge1xuICAgICAgaWYgKHR5cGVvZiByb3cuYXR0cihcInN0YXR1c1wiKSAhPSBcInVuZGVmaW5lZFwiICYmIHJvdy5hdHRyKFwic3RhdHVzXCIpID09IFwiZGlzYWJsZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgdmFyIG1lID0gdGhpcy5HZXRFZGl0Um93KCk7XG4gICAgICB2YXIgdGVtcCA9IG1lLmF0dHIoXCJjbGFzc1wiKTtcbiAgICAgIG1lLmF0dHIoXCJjbGFzc1wiLCByb3cuYXR0cihcImNsYXNzXCIpKTtcbiAgICAgIHJvdy5hdHRyKFwiY2xhc3NcIiwgdGVtcCk7XG5cbiAgICAgIGlmIChtZSAhPSBudWxsKSB7XG4gICAgICAgIHJvdy5iZWZvcmUobWVbMF0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgTW92ZURvd246IGZ1bmN0aW9uIE1vdmVEb3duKCkge1xuICAgIHZhciByb3cgPSB0aGlzLkdldE5leHRSb3coKTtcblxuICAgIGlmIChyb3cgIT0gbnVsbCkge1xuICAgICAgaWYgKHR5cGVvZiByb3cuYXR0cihcInN0YXRlXCIpICE9IFwidW5kZWZpbmVkXCIgJiYgcm93LmF0dHIoXCJzdGF0ZVwiKSA9PSBcImRpc2FibGVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgIHZhciBtZSA9IHRoaXMuR2V0RWRpdFJvdygpO1xuICAgICAgdmFyIHRlbXAgPSBtZS5hdHRyKFwiY2xhc3NcIik7XG4gICAgICBtZS5hdHRyKFwiY2xhc3NcIiwgcm93LmF0dHIoXCJjbGFzc1wiKSk7XG4gICAgICByb3cuYXR0cihcImNsYXNzXCIsIHRlbXApO1xuXG4gICAgICBpZiAobWUgIT0gbnVsbCkge1xuICAgICAgICByb3cuYWZ0ZXIobWVbMF0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgUmVtb3ZlQWxsUm93OiBmdW5jdGlvbiBSZW1vdmVBbGxSb3coKSB7XG4gICAgaWYgKHRoaXMuXyRQcm9wX1RhYmxlRWxlbSAhPSBudWxsKSB7XG4gICAgICB0aGlzLl8kUHJvcF9UYWJsZUVsZW0uZmluZChcInRyOm5vdCg6Zmlyc3QpXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBVcGRhdGVUb1JvdzogZnVuY3Rpb24gVXBkYXRlVG9Sb3cocm93SWQsIHJvd0RhdGEpIHtcbiAgICB2YXIgdGFibGVFbGVtZW50ID0gdGhpcy5fJFByb3BfVGFibGVFbGVtO1xuXG4gICAgdmFyIF9ob3N0ID0gdGhpcztcblxuICAgIHRhYmxlRWxlbWVudC5maW5kKFwidHJbaXNIZWFkZXIhPSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRyID0gJCh0aGlzKTtcblxuICAgICAgdmFyIF9yb3dJZCA9ICR0ci5hdHRyKFwiaWRcIik7XG5cbiAgICAgIGlmIChyb3dJZCA9PSBfcm93SWQpIHtcbiAgICAgICAgZm9yICh2YXIgYXR0ck5hbWUgaW4gcm93RGF0YSkge1xuICAgICAgICAgICR0ci5maW5kKFwidGRcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJHRkID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciAkZGlzcGxheUVsZW0gPSAkdGQuZmluZChcIltJc1NlcmlhbGl6ZT0ndHJ1ZSddXCIpO1xuICAgICAgICAgICAgdmFyIGJpbmROYW1lID0gJGRpc3BsYXlFbGVtLmF0dHIoXCJCaW5kTmFtZVwiKTtcblxuICAgICAgICAgICAgaWYgKGF0dHJOYW1lID09IGJpbmROYW1lKSB7XG4gICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUlkID0gJHRkLmF0dHIoXCJ0ZW1wbGF0ZUlkXCIpO1xuXG4gICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IF9ob3N0Ll9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0VGVtcGxhdGUodGVtcGxhdGVJZCk7XG5cbiAgICAgICAgICAgICAgdmFyIHRleHQgPSBcIlwiO1xuICAgICAgICAgICAgICB2YXIgdmFsID0gcm93RGF0YVtiaW5kTmFtZV07XG5cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5Gb3JtYXR0ZXIgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHRlbXBsYXRlLkZvcm1hdHRlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IHRlbXBsYXRlLkZvcm1hdHRlcih2YWwpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHRleHQgPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIHRleHQgPSB2YWw7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoJGRpc3BsYXlFbGVtLnByb3AoJ3RhZ05hbWUnKSA9PSBcIklOUFVUXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoJGRpc3BsYXlFbGVtLmF0dHIoXCJ0eXBlXCIpLnRvTG93ZXJDYXNlKCkgPT0gXCJjaGVja2JveFwiKSB7fSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICRkaXNwbGF5RWxlbS52YWwodGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAkZGlzcGxheUVsZW0udGV4dCh0ZXh0KTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICBhbGVydChcIlVwZGF0ZVRvUm93ICRsYWJlbC50ZXh0KHRleHQpIEVycm9yIVwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkZGlzcGxheUVsZW0uYXR0cihcIlZhbHVlXCIsIHZhbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBHZXRTZWxlY3RSb3dEYXRhQnlSb3dJZDogZnVuY3Rpb24gR2V0U2VsZWN0Um93RGF0YUJ5Um93SWQocm93SWQpIHtcbiAgICB2YXIgdGFibGVFbGVtZW50ID0gdGhpcy5fJFByb3BfVGFibGVFbGVtO1xuICAgIHZhciByb3dEYXRhID0ge307XG4gICAgdGFibGVFbGVtZW50LmZpbmQoXCJ0cltpc0hlYWRlciE9J3RydWUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdHIgPSAkKHRoaXMpO1xuXG4gICAgICB2YXIgX3Jvd0lkID0gJHRyLmF0dHIoXCJpZFwiKTtcblxuICAgICAgaWYgKHJvd0lkID09IF9yb3dJZCkge1xuICAgICAgICAkdHIuZmluZChcIltJc1NlcmlhbGl6ZT0ndHJ1ZSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJWYWx1ZVwiKSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJvd0RhdGFbJCh0aGlzKS5hdHRyKFwiQmluZE5hbWVcIildID0gJCh0aGlzKS5hdHRyKFwiVmFsdWVcIik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJvd0RhdGFbJCh0aGlzKS5hdHRyKFwiQmluZE5hbWVcIildID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByb3dEYXRhO1xuICB9LFxuICBHZXRTZWxlY3RSb3dCeVJvd0lkOiBmdW5jdGlvbiBHZXRTZWxlY3RSb3dCeVJvd0lkKHJvd0lkKSB7XG4gICAgdmFyIHRhYmxlRWxlbWVudCA9IHRoaXMuXyRQcm9wX1RhYmxlRWxlbTtcbiAgICByZXR1cm4gdGFibGVFbGVtZW50LmZpbmQoXCJ0cltpZD0nXCIgKyByb3dJZCArIFwiJ11cIik7XG4gIH0sXG4gIEdldEFsbFJvd0RhdGE6IGZ1bmN0aW9uIEdldEFsbFJvd0RhdGEoKSB7XG4gICAgdmFyIHRhYmxlRWxlbWVudCA9IHRoaXMuXyRQcm9wX1RhYmxlRWxlbTtcbiAgICB2YXIgcm93RGF0YXMgPSBuZXcgQXJyYXkoKTtcbiAgICB0YWJsZUVsZW1lbnQuZmluZChcInRyW2lzSGVhZGVyIT0ndHJ1ZSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0ciA9ICQodGhpcyk7XG4gICAgICB2YXIgcm93RGF0YSA9IHt9O1xuICAgICAgJHRyLmZpbmQoXCJbSXNTZXJpYWxpemU9J3RydWUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcm93RGF0YVskKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKV0gPSAkKHRoaXMpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgICAgcm93RGF0YVskKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKSArIFwiX19fVGV4dFwiXSA9ICQodGhpcykuYXR0cihcIlRleHRcIik7XG4gICAgICB9KTtcbiAgICAgIHJvd0RhdGFzLnB1c2gocm93RGF0YSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvd0RhdGFzO1xuICB9LFxuICBHZXRBbGxSb3dEYXRhRXhVbmRlZmluZWRUZXh0UHJvcDogZnVuY3Rpb24gR2V0QWxsUm93RGF0YUV4VW5kZWZpbmVkVGV4dFByb3AoKSB7XG4gICAgdGhpcy5Db21wbGV0ZWRFZGl0aW5nUm93KCk7XG4gICAgdmFyIGFsbFJvd0RhdGEgPSB0aGlzLkdldEFsbFJvd0RhdGEoKTtcbiAgICBhbGxSb3dEYXRhID0gdGhpcy5EZWxldGVfX19VbmRlZmluZWRUZXh0UHJvcChhbGxSb3dEYXRhKTtcbiAgICByZXR1cm4gYWxsUm93RGF0YTtcbiAgfSxcbiAgRGVsZXRlX19fVW5kZWZpbmVkVGV4dFByb3A6IGZ1bmN0aW9uIERlbGV0ZV9fX1VuZGVmaW5lZFRleHRQcm9wKGFsbFJvd0pzb24pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbFJvd0pzb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhbGxSb3dKc29uW2ldKSB7XG4gICAgICAgIGlmIChrZXkuaW5kZXhPZihcIl9fX1RleHRcIikgPiAwKSB7XG4gICAgICAgICAgaWYgKGFsbFJvd0pzb25baV1ba2V5XSA9PSB1bmRlZmluZWQgfHwgYWxsUm93SnNvbltpXVtrZXldID09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBhbGxSb3dKc29uW2ldW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFsbFJvd0pzb247XG4gIH0sXG4gIEdldFNlcmlhbGl6ZUpzb246IGZ1bmN0aW9uIEdldFNlcmlhbGl6ZUpzb24oZmllbGROYW1lRmlyc3RDaGFyTGV0dGVyKSB7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheSgpO1xuICAgIHZhciB0YWJsZSA9IHRoaXMuXyRQcm9wX1RhYmxlRWxlbTtcbiAgICB0YWJsZS5maW5kKFwidHJbaXNIZWFkZXIhPSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcm93ZGF0YSA9IG5ldyBPYmplY3QoKTtcbiAgICAgIHZhciAkdHIgPSAkKHRoaXMpO1xuICAgICAgJHRyLmZpbmQoXCJbSXNTZXJpYWxpemU9J3RydWUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNlcml0ZW0gPSAkKHRoaXMpO1xuICAgICAgICB2YXIgYmluZE5hbWUgPSBzZXJpdGVtLmF0dHIoXCJCaW5kTmFtZVwiKTtcbiAgICAgICAgdmFyIGJpbmRWYWx1ZSA9IHNlcml0ZW0uYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB2YXIgYmluZFRleHQgPSBzZXJpdGVtLmF0dHIoXCJUZXh0XCIpO1xuXG4gICAgICAgIGlmICghYmluZFRleHQpIHtcbiAgICAgICAgICBiaW5kVGV4dCA9IFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYmluZFRleHQgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGJpbmRUZXh0ID0gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWVsZE5hbWVGaXJzdENoYXJMZXR0ZXIgPT0gdHJ1ZSkge1xuICAgICAgICAgIGJpbmROYW1lID0gU3RyaW5nVXRpbGl0eS5GaXJzdENoYXJMZXR0ZXIoYmluZE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcm93ZGF0YVtiaW5kTmFtZV0gPSBiaW5kVmFsdWU7XG4gICAgICAgIHJvd2RhdGFbYmluZE5hbWUgKyBcIl9fX1RleHRcIl0gPSBiaW5kVGV4dDtcbiAgICAgIH0pO1xuICAgICAgcmVzdWx0LnB1c2gocm93ZGF0YSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgR2V0VGFibGVFbGVtZW50OiBmdW5jdGlvbiBHZXRUYWJsZUVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuXyRQcm9wX1RhYmxlRWxlbTtcbiAgfVxufTtcbnZhciBFZGl0VGFibGVDb25maWdNYW5hZ2VyID0ge1xuICBfUHJvcF9Db25maWc6IHt9LFxuICBJbml0aWFsaXphdGlvbkNvbmZpZzogZnVuY3Rpb24gSW5pdGlhbGl6YXRpb25Db25maWcoX2NvbmZpZykge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuX1Byb3BfQ29uZmlnLCBfY29uZmlnKTtcbiAgICB2YXIgX3RlbXBsYXRlcyA9IHRoaXMuX1Byb3BfQ29uZmlnLlRlbXBsYXRlcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3RlbXBsYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRlbXBsYXRlID0gX3RlbXBsYXRlc1tpXTtcbiAgICAgIHRlbXBsYXRlLlRlbXBsYXRlSWQgPSBTdHJpbmdVdGlsaXR5Lkd1aWQoKTtcbiAgICB9XG4gIH0sXG4gIEdldENvbmZpZzogZnVuY3Rpb24gR2V0Q29uZmlnKCkge1xuICAgIHJldHVybiB0aGlzLl9Qcm9wX0NvbmZpZztcbiAgfSxcbiAgR2V0VGVtcGxhdGU6IGZ1bmN0aW9uIEdldFRlbXBsYXRlKHRlbXBsYXRlSWQpIHtcbiAgICB2YXIgX3RlbXBsYXRlcyA9IHRoaXMuX1Byb3BfQ29uZmlnLlRlbXBsYXRlcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3RlbXBsYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRlbXBsYXRlID0gX3RlbXBsYXRlc1tpXTtcblxuICAgICAgaWYgKHRlbXBsYXRlLlRlbXBsYXRlSWQgPT0gdGVtcGxhdGVJZCkge1xuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG52YXIgRWRpdFRhYmxlVmFsaWRhdGUgPSB7XG4gIF9TUUxLZXlXb3JkQXJyYXk6IG5ldyBBcnJheSgpLFxuICBHZXRTUUxLZXlXb3JkczogZnVuY3Rpb24gR2V0U1FMS2V5V29yZHMoKSB7XG4gICAgaWYgKHRoaXMuX1NRTEtleVdvcmRBcnJheS5sZW5ndGggPT0gMCkge1xuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJpbnNlcnRcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwidXBkYXRlXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImRlbGV0ZVwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJzZWxlY3RcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiYXNcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZnJvbVwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJkaXN0aW5jdFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJ3aGVyZVwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJvcmRlclwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJieVwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJhc2NcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZGVzY1wiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJkZXNjXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImFuZFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJvclwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJiZXR3ZWVuXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcIm9yZGVyIGJ5XCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImNvdW50XCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImdyb3VwXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImdyb3VwIGJ5XCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImhhdmluZ1wiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJhbGlhc1wiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJqb2luXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImxlZnRcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwicmlndGhcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiaW5uZWVyXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcInVuaW9uXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcInN1bVwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJhbGxcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwibWludXNcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiYWxlcnRcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZHJvcFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJleGVjXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcInRydW5jYXRlXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9TUUxLZXlXb3JkQXJyYXk7XG4gIH0sXG4gIFZhbGlkYXRlOiBmdW5jdGlvbiBWYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIFN1Y2Nlc3M6IHRydWUsXG4gICAgICBNc2c6IFwiXCJcbiAgICB9O1xuICAgIHZhciB2YWxpZGF0ZUNvbmZpZyA9IHRlbXBsYXRlLlZhbGlkYXRlO1xuXG4gICAgaWYgKHZhbGlkYXRlQ29uZmlnICE9IHVuZGVmaW5lZCAmJiB2YWxpZGF0ZUNvbmZpZyAhPSBudWxsKSB7XG4gICAgICB2YXIgdmFsaWRhdGVUeXBlID0gdmFsaWRhdGVDb25maWcuVHlwZTtcblxuICAgICAgaWYgKHZhbGlkYXRlVHlwZSAhPSB1bmRlZmluZWQgJiYgdmFsaWRhdGVUeXBlICE9IG51bGwpIHtcbiAgICAgICAgc3dpdGNoICh2YWxpZGF0ZVR5cGUpIHtcbiAgICAgICAgICBjYXNlIFwiTm90RW1wdHlcIjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWYgKHZhbCA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LlN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXN1bHQuTXNnID0gXCLjgJBcIiArIHRlbXBsYXRlLlRpdGxlICsgXCLjgJHkuI3og73kuLrnqbohXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSBcIkxVTm9Pbmx5XCI6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlmICgvXlthLXpBLVpdW2EtekEtWjAtOV9dezAsfSQvLnRlc3QodmFsKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5TdWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmVzdWx0Lk1zZyA9IFwi44CQXCIgKyB0ZW1wbGF0ZS5UaXRsZSArIFwi44CR5LiN6IO95Li656m65LiU5Y+q6IO95piv5a2X5q+N44CB5LiL5YiS57q/44CB5pWw5a2X5bm25Lul5a2X5q+N5byA5aS077yBXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSBcIlNRTEtleVdvcmRcIjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWYgKC9eW2EtekEtWl1bYS16QS1aMC05X117MCx9JC8udGVzdCh2YWwpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LlN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXN1bHQuTXNnID0gXCLjgJBcIiArIHRlbXBsYXRlLlRpdGxlICsgXCLjgJHkuI3og73kuLrnqbrkuJTlj6rog73mmK/lrZfmr43jgIHkuIvliJLnur/jgIHmlbDlrZflubbku6XlrZfmr43lvIDlpLTvvIFcIjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciB2YWwgPSB2YWwudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgdmFyIHNxbEtleVdvcmRzID0gdGhpcy5HZXRTUUxLZXlXb3JkcygpO1xuXG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3FsS2V5V29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsID09IHNxbEtleVdvcmRzW2ldLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdC5TdWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICByZXN1bHQuTXNnID0gXCLjgJBcIiArIHRlbXBsYXRlLlRpdGxlICsgXCLjgJHor7fkuI3opoHkvb/nlKhTUUzlhbPplK7lrZfkvZzkuLrliJflkI3vvIFcIjtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59O1xudmFyIEVkaXRUYWJsZURlZmF1bGVWYWx1ZSA9IHtcbiAgR2V0VmFsdWU6IGZ1bmN0aW9uIEdldFZhbHVlKHRlbXBsYXRlKSB7XG4gICAgdmFyIGRlZmF1bHRWYWx1ZUNvbmZpZyA9IHRlbXBsYXRlLkRlZmF1bHRWYWx1ZTtcblxuICAgIGlmIChkZWZhdWx0VmFsdWVDb25maWcgIT0gdW5kZWZpbmVkICYmIGRlZmF1bHRWYWx1ZUNvbmZpZyAhPSBudWxsKSB7XG4gICAgICB2YXIgZGVmYXVsdFZhbHVlVHlwZSA9IGRlZmF1bHRWYWx1ZUNvbmZpZy5UeXBlO1xuXG4gICAgICBpZiAoZGVmYXVsdFZhbHVlVHlwZSAhPSB1bmRlZmluZWQgJiYgZGVmYXVsdFZhbHVlVHlwZSAhPSBudWxsKSB7XG4gICAgICAgIHN3aXRjaCAoZGVmYXVsdFZhbHVlVHlwZSkge1xuICAgICAgICAgIGNhc2UgXCJDb25zdFwiOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlQ29uZmlnLlZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSBcIkdVSURcIjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZ1V0aWxpdHkuR3VpZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gXCJcIjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9DaGVja0JveCA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciBiaW5kbmFtZSA9IHRlbXBsYXRlLkJpbmROYW1lO1xuXG4gICAgaWYgKHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHZhciB2YWwgPSBFZGl0VGFibGVEZWZhdWxlVmFsdWUuR2V0VmFsdWUodGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbYmluZG5hbWVdO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0uaHRtbCgpO1xuICAgIH1cblxuICAgIHZhciAkZWxlbSA9IFwiXCI7XG5cbiAgICBpZiAodmFsID09IFwi5pivXCIpIHtcbiAgICAgICRlbGVtID0gJChcIjxpbnB1dCB0eXBlPSdjaGVja2JveCcgY2hlY2tlZD0nY2hlY2tlZCcgLz5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICRlbGVtID0gJChcIjxpbnB1dCB0eXBlPSdjaGVja2JveCcgLz5cIik7XG4gICAgfVxuXG4gICAgJGVsZW0udmFsKHZhbCk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICB2YXIgJGVsZW0gPSBcIlwiO1xuXG4gICAgaWYgKHRlbXBsYXRlLklzQ05WYWx1ZSkge1xuICAgICAgaWYgKGVkaXRTdGF1c0h0bWxFbGVtLmF0dHIoXCJjaGVja2VkXCIpID09IFwiY2hlY2tlZFwiKSB7XG4gICAgICAgICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgdmFsdWU9J+aYryc+5pivPC9sYWJlbD5cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIHZhbHVlPSflkKYnPuWQpjwvbGFiZWw+XCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZWRpdFN0YXVzSHRtbEVsZW0uYXR0cihcImNoZWNrZWRcIikgPT0gXCJjaGVja2VkXCIpIHtcbiAgICAgICAgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyB2YWx1ZT0nMSc+5pivPC9sYWJlbD5cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIHZhbHVlPScwJz7lkKY8L2xhYmVsPlwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9Gb3JtYXR0ZXIgPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICBpZiAodGVtcGxhdGUuRm9ybWF0dGVyICYmIHR5cGVvZiB0ZW1wbGF0ZS5Gb3JtYXR0ZXIgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YXIgZWRpdERhdGFzID0gRWRpdFRhYmxlLl9Qcm9wX0pzb25EYXRhO1xuXG4gICAgICBpZiAoZWRpdERhdGFzKSB7XG4gICAgICAgIHZhciByb3dJZCA9IGhvc3RSb3cuYXR0cihcImlkXCIpO1xuICAgICAgICB2YXIgcm93RGF0YSA9IGVkaXREYXRhc1tyb3dJZF07XG5cbiAgICAgICAgaWYgKHJvd0RhdGEpIHtcbiAgICAgICAgICByZXR1cm4gJCh0ZW1wbGF0ZS5Gb3JtYXR0ZXIodGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHJvd0RhdGEpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBcIlwiO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIGlmICh0ZW1wbGF0ZS5Gb3JtYXR0ZXIgJiYgdHlwZW9mIHRlbXBsYXRlLkZvcm1hdHRlciA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHZhciBlZGl0RGF0YXMgPSBFZGl0VGFibGUuX1Byb3BfSnNvbkRhdGE7XG5cbiAgICAgIGlmIChlZGl0RGF0YXMpIHtcbiAgICAgICAgdmFyIHJvd0lkID0gaG9zdFJvdy5hdHRyKFwiaWRcIik7XG4gICAgICAgIHZhciByb3dEYXRhID0gZWRpdERhdGFzW3Jvd0lkXTtcblxuICAgICAgICBpZiAocm93RGF0YSkge1xuICAgICAgICAgIHJldHVybiAkKHRlbXBsYXRlLkZvcm1hdHRlcih0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgcm93RGF0YSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiXCI7XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9MYWJlbCA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciBiaW5kbmFtZSA9IHRlbXBsYXRlLkJpbmROYW1lO1xuXG4gICAgaWYgKHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHZhbCA9IEVkaXRUYWJsZURlZmF1bGVWYWx1ZS5HZXRWYWx1ZSh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtiaW5kbmFtZV07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkZvcm1hdGVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5odG1sKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5hdHRyKFwiVmFsdWVcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyICRlbGVtO1xuXG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5Gb3JtYXRlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgVGV4dD0nXCIgKyB0ZXh0ICsgXCInIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPSdcIiArIHZhbCArIFwiJz5cIiArIHZhbCArIFwiPC9sYWJlbD5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB0ZXh0ID0gdGVtcGxhdGUuRm9ybWF0ZXIodmFsKTtcbiAgICAgICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgVGV4dD1cIiArIHRleHQgKyBcIiBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT1cIiArIHZhbCArIFwiPlwiICsgdGV4dCArIFwiPC9sYWJlbD5cIik7XG4gICAgfVxuXG4gICAgJGVsZW0udmFsKHZhbCk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciAkZWxlbTtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG5cbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkZvcm1hdGVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBUZXh0PSdcIiArIHRleHQgKyBcIicgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9J1wiICsgdmFsICsgXCInPlwiICsgdmFsICsgXCI8L2xhYmVsPlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHRleHQgPSB0ZW1wbGF0ZS5Gb3JtYXRlcih2YWwpO1xuICAgICAgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBUZXh0PSdcIiArIHRleHQgKyBcIicgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9J1wiICsgdmFsICsgXCInPlwiICsgdGV4dCArIFwiPC9sYWJlbD5cIik7XG4gICAgfVxuXG4gICAgJGVsZW0udmFsKHZhbCk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfUmFkaW8gPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgYmluZG5hbWUgPSB0ZW1wbGF0ZS5CaW5kTmFtZTtcblxuICAgIGlmICh0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSBudWxsKSB7XG4gICAgICB2YXIgdmFsID0gRWRpdFRhYmxlRGVmYXVsZVZhbHVlLkdldFZhbHVlKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW2JpbmRuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIH1cblxuICAgIHZhciAkZWxlbSA9IFwiXCI7XG5cbiAgICBpZiAobnVsbCAhPSB2aWV3U3RhdXNIdG1sRWxlbSAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQgJiYgdmlld1N0YXVzSHRtbEVsZW0uYXR0cihcImNoZWNrZWRcIikgPT0gXCJjaGVja2VkXCIgfHwgdmFsID09IDEpIHtcbiAgICAgICRlbGVtID0gJChcIjxpbnB1dCB0eXBlPSdyYWRpbycgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIG5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgY2hlY2tlZD0nY2hlY2tlZCcgdmFsdWU9JzEnLz5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICRlbGVtID0gJChcIjxpbnB1dCB0eXBlPSdyYWRpbycgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIG5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgdmFsdWU9JzAnLz5cIik7XG4gICAgfVxuXG4gICAgJGVsZW0udmFsKHZhbCk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICB2YXIgJGVsZW0gPSBcIlwiO1xuXG4gICAgaWYgKGVkaXRTdGF1c0h0bWxFbGVtLmF0dHIoXCJjaGVja2VkXCIpID09IFwiY2hlY2tlZFwiKSB7XG4gICAgICAkZWxlbSA9ICQoXCI8aW5wdXQgdHlwZT0ncmFkaW8nIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBuYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInY2hlY2tlZD0nY2hlY2tlZCcgIHZhbHVlPScxJy8+XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkZWxlbSA9ICQoXCI8aW5wdXQgdHlwZT0ncmFkaW8nIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBuYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIHZhbHVlPScwJy8+XCIpO1xuICAgIH1cblxuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX1NlbGVjdCA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciBjb25maWdTb3VyY2UgPSBudWxsO1xuXG4gICAgaWYgKHRlbXBsYXRlLkNsaWVudERhdGFTb3VyY2UgIT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlLkNsaWVudERhdGFTb3VyY2UgIT0gbnVsbCkge1xuICAgICAgY29uZmlnU291cmNlID0gdGVtcGxhdGUuQ2xpZW50RGF0YVNvdXJjZTtcbiAgICB9IGVsc2UgaWYgKHRlbXBsYXRlLkNsaWVudERhdGFTb3VyY2VGdW5jICE9IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZS5DbGllbnREYXRhU291cmNlRnVuYyAhPSBudWxsKSB7XG4gICAgICBjb25maWdTb3VyY2UgPSB0ZW1wbGF0ZS5DbGllbnREYXRhU291cmNlRnVuYyh0ZW1wbGF0ZS5DbGllbnREYXRhU291cmNlRnVuY1BhcmFzLCBfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpO1xuICAgIH1cblxuICAgIGlmIChjb25maWdTb3VyY2UgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuICQoXCI8bGFiZWw+5om+5LiN5Yiw5pWw5o2u5rqQ6K6+572uLOivt+WcqHRlbXBsYXRl5Lit6K6+572u5pWw5o2u5rqQPC9sYWJlbD5cIik7XG4gICAgfVxuXG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyIHR4dCA9IFwiXCI7XG4gICAgdmFyIGJpbmRuYW1lID0gdGVtcGxhdGUuQmluZE5hbWU7XG5cbiAgICBpZiAodGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gbnVsbCkge1xuICAgICAgdmFyIHZhbCA9IEVkaXRUYWJsZURlZmF1bGVWYWx1ZS5HZXRWYWx1ZSh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtiaW5kbmFtZV07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5hdHRyKFwiVmFsdWVcIik7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gJChcIjxzZWxlY3Qgc3R5bGU9J3dpZHRoOiAxMDAlJyAvPlwiKTtcblxuICAgIGlmIChjb25maWdTb3VyY2VbMF0uR3JvdXApIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29uZmlnU291cmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBvcHRncm91cCA9ICQoXCI8b3B0Z3JvdXAgLz5cIik7XG4gICAgICAgIG9wdGdyb3VwLmF0dHIoXCJsYWJlbFwiLCBjb25maWdTb3VyY2VbaV0uR3JvdXApO1xuXG4gICAgICAgIGlmIChjb25maWdTb3VyY2VbaV0uT3B0aW9ucykge1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29uZmlnU291cmNlW2ldLk9wdGlvbnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHZhciBvcHRpb24gPSAkKFwiPG9wdGlvbiAvPlwiKTtcbiAgICAgICAgICAgIG9wdGlvbi5hdHRyKFwidmFsdWVcIiwgY29uZmlnU291cmNlW2ldLk9wdGlvbnNbal0uVmFsdWUpO1xuICAgICAgICAgICAgb3B0aW9uLmF0dHIoXCJ0ZXh0XCIsIGNvbmZpZ1NvdXJjZVtpXS5PcHRpb25zW2pdLlRleHQpO1xuICAgICAgICAgICAgb3B0aW9uLnRleHQoY29uZmlnU291cmNlW2ldLk9wdGlvbnNbal0uVGV4dCk7XG4gICAgICAgICAgICBvcHRncm91cC5hcHBlbmQob3B0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkZWxlbS5hcHBlbmQob3B0Z3JvdXApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZ1NvdXJjZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IGNvbmZpZ1NvdXJjZVtpXTtcbiAgICAgICAgJGVsZW0uYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nXCIgKyBpdGVtLlZhbHVlICsgXCInIHRleHQ9J1wiICsgaXRlbS5UZXh0ICsgXCInPlwiICsgaXRlbS5UZXh0ICsgXCI8L29wdGlvbj5cIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJGVsZW0udmFsKHZhbCk7XG5cbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkNoYW5nZUV2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgJGVsZW0uY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGVtcGxhdGUuQ2hhbmdlRXZlbnQodGhpcywgX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0uZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS5hdHRyKFwiVmFsdWVcIik7XG4gICAgdmFyIHRleHQgPSBlZGl0U3RhdXNIdG1sRWxlbS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLmF0dHIoXCJUZXh0XCIpO1xuXG4gICAgaWYgKCF2YWwpIHtcbiAgICAgIHZhbCA9IFwiXCI7XG4gICAgfVxuXG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICB0ZXh0ID0gXCJcIjtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWwgKyBcIicgVGV4dD0nXCIgKyB0ZXh0ICsgXCInPlwiICsgdGV4dCArIFwiPC9sYWJlbD5cIik7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfU2VsZWN0Um93Q2hlY2tCb3ggPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgYmluZG5hbWUgPSB0ZW1wbGF0ZS5CaW5kTmFtZTtcblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbYmluZG5hbWVdO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0uYXR0cihcIlZhbHVlXCIpO1xuICAgIH1cblxuICAgIHZhciAkZWxlbSA9ICQoXCI8aW5wdXQgSXNTZXJpYWxpemU9J3RydWUnIHR5cGU9J2NoZWNrYm94JyBjaGVja2VkPSdjaGVja2VkJyAgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgLz5cIik7XG4gICAgJGVsZW0uYXR0cihcIlZhbHVlXCIsIHZhbCk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSAkKGVkaXRTdGF1c0h0bWxFbGVtKS5hdHRyKFwiVmFsdWVcIik7XG4gICAgdmFyICRlbGVtID0gJChcIjxpbnB1dCBJc1NlcmlhbGl6ZT0ndHJ1ZScgdHlwZT0nY2hlY2tib3gnICBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyAvPlwiKTtcbiAgICAkZWxlbS5hdHRyKFwiVmFsdWVcIiwgdmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9UZXh0Qm94ID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyIGJpbmRuYW1lID0gdGVtcGxhdGUuQmluZE5hbWU7XG5cbiAgICBpZiAodGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gbnVsbCkge1xuICAgICAgdmFyIHZhbCA9IEVkaXRUYWJsZURlZmF1bGVWYWx1ZS5HZXRWYWx1ZSh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtiaW5kbmFtZV07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5odG1sKCk7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gJChcIjxpbnB1dCB0eXBlPSd0ZXh0JyBJc1NlcmlhbGl6ZT0ndHJ1ZScgc3R5bGU9J3dpZHRoOiA5OCUnIC8+XCIpO1xuICAgICRlbGVtLnZhbCh2YWwpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgdmFyICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9J1wiICsgdmFsICsgXCInPlwiICsgdmFsICsgXCI8L2xhYmVsPlwiKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuXG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5WYWxpZGF0ZSAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgdGVtcGxhdGUuVmFsaWRhdGUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgU3VjY2VzczogdHJ1ZSxcbiAgICAgICAgTXNnOiBudWxsXG4gICAgICB9O1xuICAgICAgcmVzdWx0LlN1Y2Nlc3MgPSB0ZW1wbGF0ZS5WYWxpZGF0ZSgpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFRyZWVUYWJsZUNvbmZpZyA9IHtcbiAgQ2FuRGVsZXRlV2hlbkhhc0NoaWxkOiBmYWxzZSxcbiAgSWRGaWVsZDogXCJPcmdhbl9JZFwiLFxuICBSb3dJZFByZWZpeDogXCJUcmVlVGFibGVfXCIsXG4gIExvYWRDaGlsZEpzb25VUkw6IFwiXCIsXG4gIExvYWRDaGlsZEZ1bmM6IG51bGwsXG4gIE9wZW5MZXZlbDogMSxcbiAgQ2hpbGRUZXN0RmllbGQ6IFwiQ2hpbGRfQ291bnRcIixcbiAgVGVtcGxhdGVzOiBbe1xuICAgIFRpdGxlOiBcIue7hOe7h+acuuaehOWQjeensFwiLFxuICAgIEZpZWxkTmFtZTogXCJPcmdhbl9OYW1lXCIsXG4gICAgVGl0bGVDZWxsQ2xhc3NOYW1lOiBcIlRpdGxlQ2VsbFwiLFxuICAgIFJlbmRlcmVyOiBcIkxhYmxlXCIsXG4gICAgSGlkZGVuOiBmYWxzZSxcbiAgICBUaXRsZUNlbGxBdHRyczoge30sXG4gICAgV2lkdGg6IFwiNTAlXCJcbiAgfSwge1xuICAgIFRpdGxlOiBcIue7hOe7h+acuuaehOe8qeWGmeWQjeensFwiLFxuICAgIEZpZWxkTmFtZTogXCJPcmdhbl9TaG9ydE5hbWVcIixcbiAgICBUaXRsZUNlbGxDbGFzc05hbWU6IFwiVGl0bGVDZWxsXCIsXG4gICAgUmVuZGVyZXI6IFwiTGFibGVcIixcbiAgICBIaWRkZW46IGZhbHNlLFxuICAgIFRpdGxlQ2VsbEF0dHJzOiB7fSxcbiAgICBXaWR0aDogXCIyMCVcIlxuICB9LCB7XG4gICAgVGl0bGU6IFwi57uE57uH57yW5Y+3XCIsXG4gICAgRmllbGROYW1lOiBcIk9yZ2FuX0NvZGVcIixcbiAgICBUaXRsZUNlbGxDbGFzc05hbWU6IFwiVGl0bGVDZWxsXCIsXG4gICAgUmVuZGVyZXI6IFwiTGFibGVcIixcbiAgICBIaWRkZW46IGZhbHNlLFxuICAgIFRpdGxlQ2VsbEF0dHJzOiB7fSxcbiAgICBXaWR0aDogXCIyMCVcIlxuICB9LCB7XG4gICAgVGl0bGU6IFwi57uE57uHSURcIixcbiAgICBGaWVsZE5hbWU6IFwiT3JnYW5fSWRcIixcbiAgICBUaXRsZUNlbGxDbGFzc05hbWU6IFwiVGl0bGVDZWxsXCIsXG4gICAgUmVuZGVyZXI6IFwiTGFibGVcIixcbiAgICBIaWRkZW46IGZhbHNlLFxuICAgIFRpdGxlQ2VsbEF0dHJzOiB7fSxcbiAgICBXaWR0aDogXCIxMFwiXG4gIH1dLFxuICBUYWJsZUNsYXNzOiBcIlRyZWVUYWJsZVwiLFxuICBSZW5kZXJlclRvOiBcImRpdkVkaXRUYWJsZVwiLFxuICBUYWJsZUlkOiBcIlRyZWVUYWJsZVwiLFxuICBUYWJsZUF0dHJzOiB7XG4gICAgY2VsbHBhZGRpbmc6IFwiMFwiLFxuICAgIGNlbGxzcGFjaW5nOiBcIjBcIixcbiAgICBib3JkZXI6IFwiMFwiXG4gIH1cbn07XG52YXIgVHJlZVRhYmxlSnNvbkRhdGEgPSB7XG4gIE9yZ2FuX0lkOiBcIjBcIixcbiAgT3JnYW5fTmFtZTogXCJyb290XCIsXG4gIE9yZ2FuX1Nob3J0TmFtZTogXCIyXCIsXG4gIE9yZ2FuX0NvZGU6IFwiMlwiLFxuICBDaGlsZF9Db3VudDogMixcbiAgTm9kZXM6IFt7XG4gICAgT3JnYW5fSWQ6IFwiMVwiLFxuICAgIE9yZ2FuX05hbWU6IFwiMU9yZ2FuX05hbWVcIixcbiAgICBPcmdhbl9TaG9ydE5hbWU6IFwiMVwiLFxuICAgIE9yZ2FuX0NvZGU6IFwiMVwiLFxuICAgIENoaWxkX0NvdW50OiAyLFxuICAgIE5vZGVzOiBbe1xuICAgICAgT3JnYW5fSWQ6IFwiMS0xXCIsXG4gICAgICBPcmdhbl9OYW1lOiBcIjEtMU9yZ2FuX05hbWVcIixcbiAgICAgIE9yZ2FuX1Nob3J0TmFtZTogXCIxLTFcIixcbiAgICAgIE9yZ2FuX0NvZGU6IFwiMS0xXCIsXG4gICAgICBDaGlsZF9Db3VudDogMSxcbiAgICAgIE5vZGVzOiBbe1xuICAgICAgICBPcmdhbl9JZDogXCIxLTEtMVwiLFxuICAgICAgICBPcmdhbl9OYW1lOiBcIjEtMS0xT3JnYW5fTmFtZVwiLFxuICAgICAgICBPcmdhbl9TaG9ydE5hbWU6IFwiMS0xLTFcIixcbiAgICAgICAgT3JnYW5fQ29kZTogXCIxLTFcIixcbiAgICAgICAgQ2hpbGRfQ291bnQ6IDBcbiAgICAgIH1dXG4gICAgfSwge1xuICAgICAgT3JnYW5fSWQ6IFwiMS0yXCIsXG4gICAgICBPcmdhbl9OYW1lOiBcIjEtMk9yZ2FuX05hbWVcIixcbiAgICAgIE9yZ2FuX1Nob3J0TmFtZTogXCIxLTJcIixcbiAgICAgIE9yZ2FuX0NvZGU6IFwiMS0yXCIsXG4gICAgICBDaGlsZF9Db3VudDogMFxuICAgIH1dXG4gIH0sIHtcbiAgICBPcmdhbl9JZDogXCIyXCIsXG4gICAgT3JnYW5fTmFtZTogXCIyT3JnYW5fTmFtZVwiLFxuICAgIE9yZ2FuX1Nob3J0TmFtZTogXCIyXCIsXG4gICAgT3JnYW5fQ29kZTogXCIyXCIsXG4gICAgQ2hpbGRfQ291bnQ6IDBcbiAgfSwge1xuICAgIE9yZ2FuX0lkOiBcIjNcIixcbiAgICBPcmdhbl9OYW1lOiBcIjNPcmdhbl9OYW1lXCIsXG4gICAgT3JnYW5fU2hvcnROYW1lOiBcIjNcIixcbiAgICBPcmdhbl9Db2RlOiBcIjNcIixcbiAgICBDaGlsZF9Db3VudDogMFxuICB9LCB7XG4gICAgT3JnYW5fSWQ6IFwiNFwiLFxuICAgIE9yZ2FuX05hbWU6IFwiNE9yZ2FuX05hbWVcIixcbiAgICBPcmdhbl9TaG9ydE5hbWU6IFwiNFwiLFxuICAgIE9yZ2FuX0NvZGU6IFwiNFwiLFxuICAgIENoaWxkX0NvdW50OiAwXG4gIH1dXG59O1xudmFyIFRyZWVUYWJsZUpzb25EYXRhTGlzdCA9IFt7XG4gIE9yZ2FuX0lkOiBcIjBcIixcbiAgT3JnYW5fTmFtZTogXCJyb290XCIsXG4gIE9yZ2FuX1Nob3J0TmFtZTogXCIyXCIsXG4gIE9yZ2FuX0NvZGU6IFwiMlwiLFxuICBDaGlsZF9Db3VudDogMlxufSwge1xuICBPcmdhbl9JZDogXCIxXCIsXG4gIE9yZ2FuX05hbWU6IFwiMU9yZ2FuX05hbWVcIixcbiAgT3JnYW5fU2hvcnROYW1lOiBcIjFcIixcbiAgT3JnYW5fQ29kZTogXCIxXCIsXG4gIENoaWxkX0NvdW50OiAyLFxuICBQYXJlbnRfSWQ6IFwiMFwiXG59LCB7XG4gIE9yZ2FuX0lkOiBcIjJcIixcbiAgT3JnYW5fTmFtZTogXCIyT3JnYW5fTmFtZVwiLFxuICBPcmdhbl9TaG9ydE5hbWU6IFwiMlwiLFxuICBPcmdhbl9Db2RlOiBcIjJcIixcbiAgQ2hpbGRfQ291bnQ6IDAsXG4gIFBhcmVudF9JZDogXCIwXCJcbn0sIHtcbiAgT3JnYW5fSWQ6IFwiMS0xXCIsXG4gIE9yZ2FuX05hbWU6IFwiMS0xT3JnYW5fTmFtZVwiLFxuICBPcmdhbl9TaG9ydE5hbWU6IFwiMS0xXCIsXG4gIE9yZ2FuX0NvZGU6IFwiMS0xXCIsXG4gIENoaWxkX0NvdW50OiAxLFxuICBQYXJlbnRfSWQ6IFwiMVwiXG59LCB7XG4gIE9yZ2FuX0lkOiBcIjEtMlwiLFxuICBPcmdhbl9OYW1lOiBcIjEtMk9yZ2FuX05hbWVcIixcbiAgT3JnYW5fU2hvcnROYW1lOiBcIjEtMlwiLFxuICBPcmdhbl9Db2RlOiBcIjEtMlwiLFxuICBDaGlsZF9Db3VudDogMCxcbiAgUGFyZW50X0lkOiBcIjFcIlxufSwge1xuICBPcmdhbl9JZDogXCIxLTEtMVwiLFxuICBPcmdhbl9OYW1lOiBcIjEtMS0xT3JnYW5fTmFtZVwiLFxuICBPcmdhbl9TaG9ydE5hbWU6IFwiMS0xLTFcIixcbiAgT3JnYW5fQ29kZTogXCIxLTFcIixcbiAgQ2hpbGRfQ291bnQ6IDAsXG4gIFBhcmVudF9JZDogXCIxLTFcIlxufV07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBUcmVlVGFibGUgPSB7XG4gIF8kUHJvcF9UYWJsZUVsZW06IG51bGwsXG4gIF8kUHJvcF9SZW5kZXJlclRvRWxlbTogbnVsbCxcbiAgX1Byb3BfQ29uZmlnOiBudWxsLFxuICBfUHJvcF9Kc29uRGF0YTogbnVsbCxcbiAgX1Byb3BfQXV0b09wZW5MZXZlbDogMCxcbiAgX1Byb3BfRmlyc3RDb2x1bW5fSW5kZW46IDIwLFxuICBfUHJvcF9DdXJyZW50U2VsZWN0ZWRSb3dJZDogbnVsbCxcbiAgSW5pdGlhbGl6YXRpb246IGZ1bmN0aW9uIEluaXRpYWxpemF0aW9uKF9jb25maWcpIHtcbiAgICB0aGlzLl9Qcm9wX0NvbmZpZyA9IF9jb25maWc7XG4gICAgdGhpcy5fJFByb3BfUmVuZGVyZXJUb0VsZW0gPSAkKFwiI1wiICsgdGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUbyk7XG4gICAgdGhpcy5fJFByb3BfVGFibGVFbGVtID0gdGhpcy5DcmVhdGVUYWJsZSgpO1xuXG4gICAgdGhpcy5fJFByb3BfVGFibGVFbGVtLmFwcGVuZCh0aGlzLkNyZWF0ZVRhYmxlVGl0bGVSb3coKSk7XG5cbiAgICB0aGlzLl8kUHJvcF9SZW5kZXJlclRvRWxlbS5hcHBlbmQodGhpcy5fJFByb3BfVGFibGVFbGVtKTtcbiAgfSxcbiAgTG9hZEpzb25EYXRhOiBmdW5jdGlvbiBMb2FkSnNvbkRhdGEoanNvbkRhdGFzKSB7XG4gICAgaWYgKGpzb25EYXRhcyAhPSBudWxsICYmIGpzb25EYXRhcyAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX1Byb3BfSnNvbkRhdGEgPSBqc29uRGF0YXM7XG4gICAgICB0aGlzLl9Qcm9wX0F1dG9PcGVuTGV2ZWwgPSB0aGlzLl9Qcm9wX0NvbmZpZy5PcGVuTGV2ZWw7XG5cbiAgICAgIHZhciByb3dJZCA9IHRoaXMuX0dldFJvd0RhdGFJZChqc29uRGF0YXMpO1xuXG4gICAgICB0aGlzLl9DcmVhdGVSb290Um93KGpzb25EYXRhcywgcm93SWQpO1xuXG4gICAgICB0aGlzLl9Mb29wQ3JlYXRlUm93KGpzb25EYXRhcywganNvbkRhdGFzLk5vZGVzLCAxLCByb3dJZCk7XG5cbiAgICAgIHRoaXMuUmVuZGVyZXJTdHlsZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhbGVydChcIkpzb24gRGF0YSBPYmplY3QgRXJyb3JcIik7XG4gICAgfVxuICB9LFxuICBfQ3JlYXRlUm9vdFJvdzogZnVuY3Rpb24gX0NyZWF0ZVJvb3RSb3cocGFyZW50anNvbk5vZGUsIHBhcmVudElkTGlzdCkge1xuICAgIHZhciByb3dFbGVtID0gdGhpcy5DcmVhdGVSb3dFbGVtKHBhcmVudGpzb25Ob2RlLCAwLCBudWxsLCB0cnVlLCBwYXJlbnRJZExpc3QpO1xuXG4gICAgdGhpcy5fJFByb3BfVGFibGVFbGVtLmFwcGVuZChyb3dFbGVtKTtcblxuICAgIHRoaXMuU2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbChwYXJlbnRqc29uTm9kZSwgMCk7XG4gICAgdGhpcy5TZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0KHBhcmVudGpzb25Ob2RlLCBwYXJlbnRJZExpc3QpO1xuICB9LFxuICBfTG9vcENyZWF0ZVJvdzogZnVuY3Rpb24gX0xvb3BDcmVhdGVSb3cocGFyZW50anNvbk5vZGUsIGpzb25Ob2RlQXJyYXksIGN1cnJlbnRMZXZlbCwgcGFyZW50SWRMaXN0KSB7XG4gICAgdGhpcy5fUHJvcF9Db25maWcuSXNPcGVuQUxMO1xuXG4gICAgaWYgKGpzb25Ob2RlQXJyYXkgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGpzb25Ob2RlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBqc29uTm9kZUFycmF5W2ldO1xuXG4gICAgICAgIHZhciByb3dJc09wZW4gPSB0aGlzLl9UZXN0Um93SXNPcGVuKGN1cnJlbnRMZXZlbCk7XG5cbiAgICAgICAgdmFyIHJvd0lkID0gdGhpcy5fR2V0Um93RGF0YUlkKGl0ZW0pO1xuXG4gICAgICAgIHZhciBfcElkTGlzdCA9IHRoaXMuX0NyZWF0ZVBhcmVudElkTGlzdChwYXJlbnRJZExpc3QsIHJvd0lkKTtcblxuICAgICAgICB0aGlzLlNldEpzb25EYXRhRXh0ZW5kQXR0cl9DdXJyZW50TGV2ZWwoaXRlbSwgY3VycmVudExldmVsKTtcbiAgICAgICAgdGhpcy5TZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0KGl0ZW0sIF9wSWRMaXN0KTtcbiAgICAgICAgdmFyIHJvd0VsZW0gPSB0aGlzLkNyZWF0ZVJvd0VsZW0oaXRlbSwgY3VycmVudExldmVsLCBwYXJlbnRqc29uTm9kZSwgcm93SXNPcGVuLCBfcElkTGlzdCk7XG5cbiAgICAgICAgdGhpcy5fJFByb3BfVGFibGVFbGVtLmFwcGVuZChyb3dFbGVtKTtcblxuICAgICAgICBpZiAoaXRlbS5Ob2RlcyAhPSB1bmRlZmluZWQgJiYgaXRlbS5Ob2RlcyAhPSBudWxsICYmIGl0ZW0uTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHZhciBfdHAgPSBjdXJyZW50TGV2ZWwgKyAxO1xuXG4gICAgICAgICAgdGhpcy5fTG9vcENyZWF0ZVJvdyhpdGVtLCBpdGVtLk5vZGVzLCBfdHAsIF9wSWRMaXN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgQ3JlYXRlVGFibGU6IGZ1bmN0aW9uIENyZWF0ZVRhYmxlKCkge1xuICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnO1xuXG4gICAgdmFyIF9lZGl0VGFibGUgPSAkKFwiPHRhYmxlIC8+XCIpO1xuXG4gICAgX2VkaXRUYWJsZS5hZGRDbGFzcyhfQy5UYWJsZUNsYXNzKTtcblxuICAgIF9lZGl0VGFibGUuYXR0cihcIklkXCIsIF9DLlRhYmxlSWQpO1xuXG4gICAgX2VkaXRUYWJsZS5hdHRyKF9DLlRhYmxlQXR0cnMpO1xuXG4gICAgcmV0dXJuIF9lZGl0VGFibGU7XG4gIH0sXG4gIFNldEpzb25EYXRhRXh0ZW5kQXR0cl9DdXJyZW50TGV2ZWw6IGZ1bmN0aW9uIFNldEpzb25EYXRhRXh0ZW5kQXR0cl9DdXJyZW50TGV2ZWwoanNvbkRhdGEsIHZhbHVlKSB7XG4gICAganNvbkRhdGEuX0V4dGVuZF9DdXJyZW50TGV2ZWwgPSB2YWx1ZTtcbiAgfSxcbiAgR2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbDogZnVuY3Rpb24gR2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbChqc29uRGF0YSkge1xuICAgIHJldHVybiBqc29uRGF0YS5fRXh0ZW5kX0N1cnJlbnRMZXZlbDtcbiAgfSxcbiAgU2V0SnNvbkRhdGFFeHRlbmRBdHRyX1BhcmVudElkTGlzdDogZnVuY3Rpb24gU2V0SnNvbkRhdGFFeHRlbmRBdHRyX1BhcmVudElkTGlzdChqc29uRGF0YSwgdmFsdWUpIHtcbiAgICBqc29uRGF0YS5fRXh0ZW5kX1BhcmVudElkTGlzdCA9IHZhbHVlO1xuICB9LFxuICBHZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0OiBmdW5jdGlvbiBHZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0KGpzb25EYXRhKSB7XG4gICAgcmV0dXJuIGpzb25EYXRhLl9FeHRlbmRfUGFyZW50SWRMaXN0O1xuICB9LFxuICBDcmVhdGVUYWJsZVRpdGxlUm93OiBmdW5jdGlvbiBDcmVhdGVUYWJsZVRpdGxlUm93KCkge1xuICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnO1xuXG4gICAgdmFyIF90aGVhZCA9ICQoXCI8dGhlYWQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgaXNIZWFkZXI9J3RydWUnIC8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XCIpO1xuXG4gICAgdmFyIF90aXRsZVJvdyA9IF90aGVhZC5maW5kKFwidHJcIik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9DLlRlbXBsYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRlbXBsYXRlID0gX0MuVGVtcGxhdGVzW2ldO1xuICAgICAgdmFyIHRpdGxlID0gdGVtcGxhdGUuVGl0bGU7XG4gICAgICB2YXIgdGggPSAkKFwiPHRoPlwiICsgdGl0bGUgKyBcIjwvdGg+XCIpO1xuXG4gICAgICBpZiAodGVtcGxhdGUuVGl0bGVDZWxsQ2xhc3NOYW1lKSB7XG4gICAgICAgIHRoLmFkZENsYXNzKHRlbXBsYXRlLlRpdGxlQ2VsbENsYXNzTmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ZW1wbGF0ZS5UaXRsZUNlbGxBdHRycykge1xuICAgICAgICB0aC5hdHRyKHRlbXBsYXRlLlRpdGxlQ2VsbEF0dHJzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5IaWRkZW4gIT0gJ3VuZGVmaW5lZCcgJiYgdGVtcGxhdGUuSGlkZGVuID09IHRydWUpIHtcbiAgICAgICAgdGguaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGVtcGxhdGUuU3R5bGUpIHtcbiAgICAgICAgdGguY3NzKHRlbXBsYXRlLlN0eWxlKTtcbiAgICAgIH1cblxuICAgICAgX3RpdGxlUm93LmFwcGVuZCh0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF90aGVhZDtcbiAgfSxcbiAgQ3JlYXRlUm93RWxlbTogZnVuY3Rpb24gQ3JlYXRlUm93RWxlbShyb3dEYXRhLCBjdXJyZW50TGV2ZWwsIHBhcmVudFJvd0RhdGEsIHJvd0lzT3BlbiwgcGFyZW50SWRMaXN0KSB7XG4gICAgdmFyIF9jID0gdGhpcy5fUHJvcF9Db25maWc7XG4gICAgdmFyICR0ciA9ICQoXCI8dHIgLz5cIik7XG5cbiAgICB2YXIgZWxlbUlkID0gdGhpcy5fQ3JlYXRlRWxlbUlkKHJvd0RhdGEpO1xuXG4gICAgdmFyIHJvd0lkID0gdGhpcy5fR2V0Um93RGF0YUlkKHJvd0RhdGEpO1xuXG4gICAgdmFyIHByb3dJZCA9IHRoaXMuX0NyZWF0ZVBhcmVudFJvd0lkKHBhcmVudFJvd0RhdGEpO1xuXG4gICAgJHRyLmF0dHIoXCJyb3dJZFwiLCByb3dJZCkuYXR0cihcInBpZFwiLCBwcm93SWQpLmF0dHIoXCJpZFwiLCBlbGVtSWQpLmF0dHIoXCJjdXJyZW50TGV2ZWxcIiwgY3VycmVudExldmVsKS5hdHRyKFwiaXNkYXRhcm93XCIsIFwidHJ1ZVwiKTtcbiAgICB2YXIgX3Rlc3RmaWVsZCA9IF9jLkNoaWxkVGVzdEZpZWxkO1xuICAgIHZhciBoYXNDaGlsZCA9IHJvd0RhdGFbX3Rlc3RmaWVsZF07XG5cbiAgICBpZiAoaGFzQ2hpbGQgPT0gdHJ1ZSB8fCBoYXNDaGlsZCA9PSBcInRydWVcIiB8fCBoYXNDaGlsZCA+IDApIHtcbiAgICAgICR0ci5hdHRyKFwiaGFzQ2hpbGRcIiwgXCJ0cnVlXCIpO1xuICAgIH1cblxuICAgICR0ci5hdHRyKFwicm93SXNPcGVuXCIsIHJvd0lzT3BlbikuYXR0cihcInBhcmVudElkTGlzdFwiLCBwYXJlbnRJZExpc3QpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfYy5UZW1wbGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBfY2MgPSBfYy5UZW1wbGF0ZXNbaV07XG4gICAgICB2YXIgX2NkID0gcm93RGF0YVtfY2MuRmllbGROYW1lXTtcbiAgICAgIHZhciBfd2lkdGggPSBfY2MuV2lkdGg7XG4gICAgICB2YXIgX3JlbmRlcmVyID0gX2NjLlJlbmRlcmVyO1xuICAgICAgdmFyICR0ZCA9ICQoXCI8dGQgYmluZEZpZWxkPVxcXCJcIiArIF9jYy5GaWVsZE5hbWUgKyBcIlxcXCIgUmVuZGVyZXI9J1wiICsgX3JlbmRlcmVyICsgXCInPlwiICsgX2NkICsgXCI8L3RkPlwiKS5jc3MoXCJ3aWR0aFwiLCBfd2lkdGgpO1xuXG4gICAgICBpZiAoX3JlbmRlcmVyID09IFwiRGF0ZVRpbWVcIikge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKF9jZCk7XG4gICAgICAgIHZhciBkYXRlU3RyID0gRGF0ZVV0aWxpdHkuRm9ybWF0KGRhdGUsICd5eXl5LU1NLWRkJyk7XG4gICAgICAgICR0ZC50ZXh0KGRhdGVTdHIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFfY2QpIHtcbiAgICAgICAgICAkdGQudGV4dChcIlwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoX2NjLlRleHRBbGlnbikge1xuICAgICAgICAkdGQuY3NzKFwidGV4dEFsaWduXCIsIF9jYy5UZXh0QWxpZ24pO1xuICAgICAgfVxuXG4gICAgICBpZiAoaSA9PSAwKSB7fVxuXG4gICAgICBpZiAodHlwZW9mIF9jYy5IaWRkZW4gIT0gJ3VuZGVmaW5lZCcgJiYgX2NjLkhpZGRlbiA9PSB0cnVlKSB7XG4gICAgICAgICR0ZC5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgX2NjLlN0eWxlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICR0ZC5jc3MoX2NjLlN0eWxlKTtcbiAgICAgIH1cblxuICAgICAgJHRyLmFwcGVuZCgkdGQpO1xuICAgIH1cblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAkdHIuYmluZChcImNsaWNrXCIsIG51bGwsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgJChcIi50ci1zZWxlY3RlZFwiKS5yZW1vdmVDbGFzcyhcInRyLXNlbGVjdGVkXCIpO1xuICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcInRyLXNlbGVjdGVkXCIpO1xuICAgICAgX3NlbGYuX1Byb3BfQ3VycmVudFNlbGVjdGVkUm93SWQgPSAkKHRoaXMpLmF0dHIoXCJyb3dJZFwiKTtcblxuICAgICAgaWYgKHR5cGVvZiBfYy5DbGlja1Jvd0V2ZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgX2MuQ2xpY2tSb3dFdmVudCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIF9jLkNsaWNrUm93RXZlbnQocm93SWQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgICR0ci5ob3ZlcihmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoXCJ0ci1zZWxlY3RlZFwiKSkge1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwidHItaG92ZXJcIik7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgJChcIi50ci1ob3ZlclwiKS5yZW1vdmVDbGFzcyhcInRyLWhvdmVyXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiAkdHI7XG4gIH0sXG4gIF9UZXN0Um93SXNPcGVuOiBmdW5jdGlvbiBfVGVzdFJvd0lzT3BlbihjdXJyZW50TGV2ZWwpIHtcbiAgICBpZiAodGhpcy5fUHJvcF9Db25maWcuT3BlbkxldmVsID4gY3VycmVudExldmVsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIF9DcmVhdGVFbGVtSWQ6IGZ1bmN0aW9uIF9DcmVhdGVFbGVtSWQocm93RGF0YSkge1xuICAgIHZhciByb3dJZFByZWZpeCA9IFwiXCI7XG5cbiAgICBpZiAodGhpcy5fUHJvcF9Db25maWcuUm93SWRQcmVmaXggIT0gdW5kZWZpbmVkICYmIHRoaXMuX1Byb3BfQ29uZmlnLlJvd0lkUHJlZml4ICE9IHVuZGVmaW5lZCAhPSBudWxsKSB7XG4gICAgICByb3dJZFByZWZpeCA9IHRoaXMuX1Byb3BfQ29uZmlnLlJvd0lkUHJlZml4O1xuICAgIH1cblxuICAgIHJldHVybiByb3dJZFByZWZpeCArIHRoaXMuX0dldFJvd0RhdGFJZChyb3dEYXRhKTtcbiAgfSxcbiAgX0NyZWF0ZVBhcmVudElkTGlzdDogZnVuY3Rpb24gX0NyZWF0ZVBhcmVudElkTGlzdChwYXJlbnRJZExpc3QsIHJvd0lkKSB7XG4gICAgcmV0dXJuIHBhcmVudElkTGlzdCArIFwi4oC7XCIgKyByb3dJZDtcbiAgfSxcbiAgX0NyZWF0ZVBhcmVudElkTGlzdEJ5UGFyZW50SnNvbkRhdGE6IGZ1bmN0aW9uIF9DcmVhdGVQYXJlbnRJZExpc3RCeVBhcmVudEpzb25EYXRhKHBhcmVudEpzb25EYXRhLCBzZWxmSnNvbkRhdGEpIHtcbiAgICB2YXIgcGFyZW50SWRMaXN0ID0gdGhpcy5HZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0KHBhcmVudEpzb25EYXRhKTtcblxuICAgIHZhciByb3dJZCA9IHRoaXMuX0dldFJvd0RhdGFJZChzZWxmSnNvbkRhdGEpO1xuXG4gICAgcmV0dXJuIHRoaXMuX0NyZWF0ZVBhcmVudElkTGlzdChwYXJlbnRJZExpc3QsIHJvd0lkKTtcbiAgfSxcbiAgX0dldFJvd0RhdGFJZDogZnVuY3Rpb24gX0dldFJvd0RhdGFJZChyb3dEYXRhKSB7XG4gICAgdmFyIGlkRmllbGQgPSB0aGlzLl9Qcm9wX0NvbmZpZy5JZEZpZWxkO1xuXG4gICAgaWYgKHJvd0RhdGFbaWRGaWVsZF0gIT0gdW5kZWZpbmVkICYmIHJvd0RhdGFbaWRGaWVsZF0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHJvd0RhdGFbaWRGaWVsZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGFsZXJ0KFwi5Zyo5pWw5o2u5rqQ5Lit5om+5LiN5Yiw55So5LqO5p6E5bu6SWTnmoTlrZfmrrXvvIzor7fmo4Dmn6XphY3nva7lj4rmlbDmja7mupBcIik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0sXG4gIF9DcmVhdGVQYXJlbnRSb3dJZDogZnVuY3Rpb24gX0NyZWF0ZVBhcmVudFJvd0lkKHBhcmVudFJvd0RhdGEpIHtcbiAgICBpZiAocGFyZW50Um93RGF0YSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gXCJSb290XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9HZXRSb3dEYXRhSWQocGFyZW50Um93RGF0YSk7XG4gICAgfVxuICB9LFxuICBSZW5kZXJlclN0eWxlOiBmdW5jdGlvbiBSZW5kZXJlclN0eWxlKCkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAkKFwidHJbaXNkYXRhcm93PSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRyID0gJCh0aGlzKTtcbiAgICAgIHZhciAkZmlyc3R0ZCA9ICQodGhpcykuZmluZChcInRkOmZpcnN0XCIpO1xuICAgICAgdmFyIHJvd2lkID0gJHRyLmF0dHIoXCJyb3dJZFwiKTtcbiAgICAgIHZhciBzb3VyY2VUZXh0ID0gJGZpcnN0dGQudGV4dCgpO1xuICAgICAgJGZpcnN0dGQuY3NzKFwicGFkZGluZy1sZWZ0XCIsIF9zZWxmLl9Qcm9wX0ZpcnN0Q29sdW1uX0luZGVuICogcGFyc2VJbnQoJCh0aGlzKS5hdHRyKFwiY3VycmVudExldmVsXCIpKSk7XG4gICAgICB2YXIgaGFzQ2hpbGQgPSBmYWxzZTtcblxuICAgICAgaWYgKCR0ci5hdHRyKFwiaGFzQ2hpbGRcIikgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgaGFzQ2hpbGQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgcm93SXNPcGVuID0gZmFsc2U7XG5cbiAgICAgIGlmICgkdHIuYXR0cihcInJvd0lzT3BlblwiKSA9PSBcInRydWVcIikge1xuICAgICAgICByb3dJc09wZW4gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3dpdGNoRWxlbSA9IF9zZWxmLl9DcmVhdGVSb3dTd2l0Y2hFbGVtKGhhc0NoaWxkLCByb3dJc09wZW4sIHJvd2lkKTtcblxuICAgICAgJGZpcnN0dGQuaHRtbChcIlwiKTtcbiAgICAgICRmaXJzdHRkLmFwcGVuZChzd2l0Y2hFbGVtKS5hcHBlbmQoXCI8c3Bhbj5cIiArIHNvdXJjZVRleHQgKyBcIjwvc3Bhbj5cIik7XG5cbiAgICAgIGlmICghcm93SXNPcGVuKSB7XG4gICAgICAgICQoXCJ0cltwaWQ9J1wiICsgcm93aWQgKyBcIiddXCIpLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgX0dldEluZGVuQ2xhc3M6IGZ1bmN0aW9uIF9HZXRJbmRlbkNsYXNzKGhhc0NoaWxkLCBpc09wZW4pIHtcbiAgICBpZiAoaGFzQ2hpbGQgJiYgaXNPcGVuKSB7XG4gICAgICByZXR1cm4gXCJpbWctc3dpdGNoLW9wZW5cIjtcbiAgICB9XG5cbiAgICBpZiAoaGFzQ2hpbGQgJiYgIWlzT3Blbikge1xuICAgICAgcmV0dXJuIFwiaW1nLXN3aXRjaC1jbG9zZVwiO1xuICAgIH1cblxuICAgIGlmICghaGFzQ2hpbGQpIHtcbiAgICAgIHJldHVybiBcImltZy1zd2l0Y2gtb3BlblwiO1xuICAgIH1cblxuICAgIHJldHVybiBcImltZy1zd2l0Y2gtY2xvc2VcIjtcbiAgfSxcbiAgX0NyZWF0ZVJvd1N3aXRjaEVsZW06IGZ1bmN0aW9uIF9DcmVhdGVSb3dTd2l0Y2hFbGVtKGhhc0NoaWxkLCBpc09wZW4sIHJvd0lkKSB7XG4gICAgdmFyIGVsZW0gPSAkKFwiPGRpdiBpc3N3aXRjaD1cXFwidHJ1ZVxcXCI+PC9kaXY+XCIpO1xuXG4gICAgdmFyIGNscyA9IHRoaXMuX0dldEluZGVuQ2xhc3MoaGFzQ2hpbGQsIGlzT3Blbik7XG5cbiAgICBlbGVtLmFkZENsYXNzKGNscyk7XG4gICAgdmFyIHNlbmRkYXRhID0ge1xuICAgICAgUm93SWQ6IHJvd0lkXG4gICAgfTtcbiAgICBlbGVtLmJpbmQoXCJjbGlja1wiLCBzZW5kZGF0YSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZiAoIWhhc0NoaWxkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyICR0ciA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCk7XG4gICAgICB2YXIgcm93aWQgPSAkdHIuYXR0cihcInJvd0lkXCIpO1xuICAgICAgdmFyIHJvd0lzT3BlbiA9IGZhbHNlO1xuXG4gICAgICBpZiAoJHRyLmF0dHIoXCJyb3dJc09wZW5cIikgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgcm93SXNPcGVuID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJvd0lzT3Blbikge1xuICAgICAgICByb3dJc09wZW4gPSBmYWxzZTtcbiAgICAgICAgJChcInRyW3BhcmVudElkTGlzdCo9J1wiICsgcm93aWQgKyBcIuKAuyddXCIpLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcyhcImltZy1zd2l0Y2gtb3BlblwiKS5hZGRDbGFzcyhcImltZy1zd2l0Y2gtY2xvc2VcIik7XG4gICAgICAgICQoXCJ0cltwYXJlbnRJZExpc3QqPSdcIiArIHJvd2lkICsgXCLigLsnXVtoYXNjaGlsZD0ndHJ1ZSddXCIpLmZpbmQoXCJbaXNzd2l0Y2g9J3RydWUnXVwiKS5yZW1vdmVDbGFzcyhcImltZy1zd2l0Y2gtb3BlblwiKS5hZGRDbGFzcyhcImltZy1zd2l0Y2gtY2xvc2VcIik7XG4gICAgICAgICQoXCJ0cltwYXJlbnRJZExpc3QqPSdcIiArIHJvd2lkICsgXCLigLsnXVtoYXNjaGlsZD0ndHJ1ZSddXCIpLmF0dHIoXCJyb3dpc29wZW5cIiwgZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm93SXNPcGVuID0gdHJ1ZTtcbiAgICAgICAgJChcInRyW3BpZD0nXCIgKyByb3dpZCArIFwiJ11cIikuc2hvdygpO1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKFwiaW1nLXN3aXRjaC1jbG9zZVwiKS5hZGRDbGFzcyhcImltZy1zd2l0Y2gtb3BlblwiKTtcbiAgICAgIH1cblxuICAgICAgJHRyLmF0dHIoXCJyb3dJc09wZW5cIiwgcm93SXNPcGVuKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZWxlbTtcbiAgfSxcbiAgR2V0Q2hpbGRzUm93RWxlbTogZnVuY3Rpb24gR2V0Q2hpbGRzUm93RWxlbShsb29wLCBpZCkge1xuICAgIGlmIChsb29wKSB7XG4gICAgICByZXR1cm4gJChcInRyW3BhcmVudElkTGlzdCo9J1wiICsgaWQgKyBcIiddXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJChcInRyW3BpZD0nXCIgKyBpZCArIFwiJ11cIik7XG4gICAgfVxuICB9LFxuICBfUHJvcF9TZWxlY3RlZFJvd0RhdGE6IG51bGwsXG4gIF9Qcm9wX1RlbXBHZXRSb3dEYXRhOiBudWxsLFxuICBfR2V0U2VsZWN0ZWRSb3dEYXRhOiBmdW5jdGlvbiBfR2V0U2VsZWN0ZWRSb3dEYXRhKG5vZGUsIGlkLCBpc1NldFNlbGVjdGVkKSB7XG4gICAgdmFyIGZpZWxkTmFtZSA9IHRoaXMuX1Byb3BfQ29uZmlnLklkRmllbGQ7XG4gICAgdmFyIGZpZWxkVmFsdWUgPSBub2RlW2ZpZWxkTmFtZV07XG5cbiAgICBpZiAoZmllbGRWYWx1ZSA9PSBpZCkge1xuICAgICAgaWYgKGlzU2V0U2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5fUHJvcF9TZWxlY3RlZFJvd0RhdGEgPSBub2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fUHJvcF9UZW1wR2V0Um93RGF0YSA9IG5vZGU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChub2RlLk5vZGVzICE9IHVuZGVmaW5lZCAmJiBub2RlLk5vZGVzICE9IG51bGwpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLk5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5fR2V0U2VsZWN0ZWRSb3dEYXRhKG5vZGUuTm9kZXNbaV0sIGlkLCBpc1NldFNlbGVjdGVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgR2V0U2VsZWN0ZWRSb3dEYXRhOiBmdW5jdGlvbiBHZXRTZWxlY3RlZFJvd0RhdGEoKSB7XG4gICAgaWYgKHRoaXMuX1Byb3BfQ3VycmVudFNlbGVjdGVkUm93SWQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5fR2V0U2VsZWN0ZWRSb3dEYXRhKHRoaXMuX1Byb3BfSnNvbkRhdGEsIHRoaXMuX1Byb3BfQ3VycmVudFNlbGVjdGVkUm93SWQsIHRydWUpO1xuXG4gICAgcmV0dXJuIHRoaXMuX1Byb3BfU2VsZWN0ZWRSb3dEYXRhO1xuICB9LFxuICBHZXRSb3dEYXRhQnlSb3dJZDogZnVuY3Rpb24gR2V0Um93RGF0YUJ5Um93SWQocm93SWQpIHtcbiAgICB0aGlzLl9Qcm9wX1RlbXBHZXRSb3dEYXRhID0gbnVsbDtcblxuICAgIHRoaXMuX0dldFNlbGVjdGVkUm93RGF0YSh0aGlzLl9Qcm9wX0pzb25EYXRhLCByb3dJZCwgZmFsc2UpO1xuXG4gICAgcmV0dXJuIHRoaXMuX1Byb3BfVGVtcEdldFJvd0RhdGE7XG4gIH0sXG4gIEFwcGVuZENoaWxkUm93VG9DdXJyZW50U2VsZWN0ZWRSb3c6IGZ1bmN0aW9uIEFwcGVuZENoaWxkUm93VG9DdXJyZW50U2VsZWN0ZWRSb3cocm93RGF0YSkge1xuICAgIHZhciBzZWxlY3RlZFJvd0RhdGEgPSB0aGlzLkdldFNlbGVjdGVkUm93RGF0YSgpO1xuXG4gICAgaWYgKHNlbGVjdGVkUm93RGF0YS5Ob2RlcyAhPSB1bmRlZmluZWQgJiYgc2VsZWN0ZWRSb3dEYXRhLk5vZGVzICE9IG51bGwpIHtcbiAgICAgIHNlbGVjdGVkUm93RGF0YS5Ob2Rlcy5wdXNoKHJvd0RhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RlZFJvd0RhdGEuTm9kZXMgPSBuZXcgQXJyYXkoKTtcbiAgICAgIHNlbGVjdGVkUm93RGF0YS5Ob2Rlcy5wdXNoKHJvd0RhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuU2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbChyb3dEYXRhLCB0aGlzLkdldEpzb25EYXRhRXh0ZW5kQXR0cl9DdXJyZW50TGV2ZWwoc2VsZWN0ZWRSb3dEYXRhKSArIDEpO1xuICAgIHRoaXMuU2V0SnNvbkRhdGFFeHRlbmRBdHRyX1BhcmVudElkTGlzdChyb3dEYXRhLCB0aGlzLl9DcmVhdGVQYXJlbnRJZExpc3RCeVBhcmVudEpzb25EYXRhKHNlbGVjdGVkUm93RGF0YSwgcm93RGF0YSkpO1xuICAgIHZhciAkdHIgPSB0aGlzLkNyZWF0ZVJvd0VsZW0ocm93RGF0YSwgdGhpcy5HZXRKc29uRGF0YUV4dGVuZEF0dHJfQ3VycmVudExldmVsKHNlbGVjdGVkUm93RGF0YSkgKyAxLCBzZWxlY3RlZFJvd0RhdGEsIHRydWUsIHRoaXMuR2V0SnNvbkRhdGFFeHRlbmRBdHRyX1BhcmVudElkTGlzdChyb3dEYXRhKSk7XG5cbiAgICB2YXIgc2VsZWN0ZWRSb3dJZCA9IHRoaXMuX0dldFJvd0RhdGFJZChzZWxlY3RlZFJvd0RhdGEpO1xuXG4gICAgdmFyIGN1cnJlbnRTZWxlY3RFbGVtID0gJChcInRyW3Jvd0lkPSdcIiArIHNlbGVjdGVkUm93SWQgKyBcIiddXCIpO1xuICAgIGN1cnJlbnRTZWxlY3RFbGVtLmF0dHIoXCJoYXNjaGlsZFwiLCBcInRydWVcIik7XG4gICAgdmFyIGxhc3RDaGlsZHMgPSAkKFwidHJbcGFyZW50aWRsaXN0Kj0nXCIgKyBzZWxlY3RlZFJvd0lkICsgXCLigLsnXTpsYXN0XCIpO1xuXG4gICAgaWYgKGxhc3RDaGlsZHMubGVuZ3RoID4gMCkge1xuICAgICAgbGFzdENoaWxkcy5hZnRlcigkdHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50U2VsZWN0RWxlbS5hdHRyKFwicm93aXNvcGVuXCIsIHRydWUpO1xuICAgICAgY3VycmVudFNlbGVjdEVsZW0uYWZ0ZXIoJHRyKTtcbiAgICB9XG5cbiAgICB0aGlzLlJlbmRlcmVyU3R5bGUoKTtcbiAgfSxcbiAgVXBkYXRlVG9Sb3c6IGZ1bmN0aW9uIFVwZGF0ZVRvUm93KHJvd0lkLCByb3dEYXRhKSB7XG4gICAgdmFyIHNlbGVjdGVkUm93RGF0YSA9IHRoaXMuR2V0Um93RGF0YUJ5Um93SWQocm93SWQpO1xuXG4gICAgZm9yICh2YXIgYXR0ck5hbWUgaW4gcm93RGF0YSkge1xuICAgICAgaWYgKGF0dHJOYW1lICE9IFwiTm9kZXNcIikge1xuICAgICAgICBzZWxlY3RlZFJvd0RhdGFbYXR0ck5hbWVdID0gcm93RGF0YVthdHRyTmFtZV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHJvd0lkID0gdGhpcy5fR2V0Um93RGF0YUlkKHNlbGVjdGVkUm93RGF0YSk7XG5cbiAgICB2YXIgJHRyID0gJChcInRyW3Jvd2lkPSdcIiArIHJvd0lkICsgXCInXVwiKTtcbiAgICAkdHIuZmluZChcInRkXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGJpbmRGaWVsZCA9ICQodGhpcykuYXR0cihcImJpbmRGaWVsZFwiKTtcbiAgICAgIHZhciBuZXd0ZXh0ID0gc2VsZWN0ZWRSb3dEYXRhW2JpbmRGaWVsZF07XG4gICAgICB2YXIgcmVuZGVyZXIgPSAkKHRoaXMpLmF0dHIoXCJSZW5kZXJlclwiKTtcblxuICAgICAgaWYgKHJlbmRlcmVyID09IFwiRGF0ZVRpbWVcIikge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKG5ld3RleHQpO1xuICAgICAgICBuZXd0ZXh0ID0gRGF0ZVV0aWxpdHkuRm9ybWF0KGRhdGUsICd5eXl5LU1NLWRkJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICgkKHRoaXMpLmZpbmQoXCJbaXNzd2l0Y2g9J3RydWUnXVwiKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICQodGhpcykuZmluZChcInNwYW5cIikudGV4dChuZXd0ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQodGhpcykudGV4dChuZXd0ZXh0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgTG9hZENoaWxkQnlBamF4OiBmdW5jdGlvbiBMb2FkQ2hpbGRCeUFqYXgoKSB7fSxcbiAgRGVsZXRlUm93OiBmdW5jdGlvbiBEZWxldGVSb3cocm93SWQpIHtcbiAgICB2YXIgaGFzQ2hpbGQgPSBmYWxzZTtcblxuICAgIGlmICgkKFwidHJbcGlkPSdcIiArIHJvd0lkICsgXCInXVwiKS5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAoIXRoaXMuX1Byb3BfQ29uZmlnLkNhbkRlbGV0ZVdoZW5IYXNDaGlsZCkge1xuICAgICAgICBhbGVydChcIuaMh+WumueahOiKgueCueWtmOWcqOWtkOiKgueCue+8jOivt+WFiOWIoOmZpOWtkOiKgueCue+8gVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkKFwidHJbcGFyZW50aWRsaXN0Kj0n4oC7XCIgKyByb3dJZCArIFwiJ11cIikucmVtb3ZlKCk7XG4gICAgdGhpcy5fUHJvcF9DdXJyZW50U2VsZWN0ZWRSb3dJZCA9IG51bGw7XG4gIH0sXG4gIE1vdmVVcFJvdzogZnVuY3Rpb24gTW92ZVVwUm93KHJvd0lkKSB7XG4gICAgdmFyIHRoaXN0ciA9ICQoXCJ0cltyb3dpZD0nXCIgKyByb3dJZCArIFwiJ11cIik7XG4gICAgdmFyIHBpZCA9IHRoaXN0ci5hdHRyKFwicGlkXCIpO1xuICAgIHZhciBuZWFydHIgPSAkKHRoaXN0ci5wcmV2QWxsKFwiW3BpZD0nXCIgKyBwaWQgKyBcIiddXCIpWzBdKTtcbiAgICB2YXIgbW92ZXRycyA9ICQoXCJ0cltwYXJlbnRpZGxpc3QqPSfigLtcIiArIHJvd0lkICsgXCInXVwiKTtcbiAgICBtb3ZldHJzLmluc2VydEJlZm9yZShuZWFydHIpO1xuICB9LFxuICBNb3ZlRG93blJvdzogZnVuY3Rpb24gTW92ZURvd25Sb3cocm93SWQpIHtcbiAgICB2YXIgdGhpc3RyID0gJChcInRyW3Jvd2lkPSdcIiArIHJvd0lkICsgXCInXVwiKTtcbiAgICB2YXIgcGlkID0gdGhpc3RyLmF0dHIoXCJwaWRcIik7XG4gICAgdmFyIG5lYXJ0ciA9ICQodGhpc3RyLm5leHRBbGwoXCJbcGlkPSdcIiArIHBpZCArIFwiJ11cIilbMF0pO1xuICAgIHZhciBuZWFydHJyaWQgPSBuZWFydHIuYXR0cihcInJvd2lkXCIpO1xuICAgIHZhciBvZmZ0cnMgPSAkKFwidHJbcGFyZW50aWRsaXN0Kj0n4oC7XCIgKyBuZWFydHJyaWQgKyBcIiddXCIpO1xuICAgIHZhciBvZmZsYXN0dHIgPSAkKG9mZnRyc1tvZmZ0cnMubGVuZ3RoIC0gMV0pO1xuICAgIHZhciBtb3ZldHJzID0gJChcInRyW3BhcmVudGlkbGlzdCo9J+KAu1wiICsgcm93SWQgKyBcIiddXCIpO1xuICAgIG1vdmV0cnMuaW5zZXJ0QWZ0ZXIob2ZmbGFzdHRyKTtcbiAgfSxcbiAgR2V0QnJvdGhlcnNOb2RlRGF0YXNCeVBhcmVudElkOiBmdW5jdGlvbiBHZXRCcm90aGVyc05vZGVEYXRhc0J5UGFyZW50SWQocm93SWQpIHtcbiAgICB2YXIgdGhpc3RyID0gJChcInRyW3Jvd2lkPSdcIiArIHJvd0lkICsgXCInXVwiKTtcbiAgICB2YXIgcGlkID0gdGhpc3RyLmF0dHIoXCJwaWRcIik7XG4gICAgdmFyIGJyb3RoZXJzdHIgPSAkKHRoaXN0ci5wYXJlbnQoKS5maW5kKFwiW3BpZD0nXCIgKyBwaWQgKyBcIiddXCIpKTtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJyb3RoZXJzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdC5wdXNoKHRoaXMuR2V0Um93RGF0YUJ5Um93SWQoJChicm90aGVyc3RyW2ldKS5hdHRyKFwicm93aWRcIikpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBSZW1vdmVBbGxSb3c6IGZ1bmN0aW9uIFJlbW92ZUFsbFJvdygpIHtcbiAgICBpZiAodGhpcy5fJFByb3BfVGFibGVFbGVtICE9IG51bGwpIHtcbiAgICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5maW5kKFwidHI6bm90KDpmaXJzdClcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07Il19
