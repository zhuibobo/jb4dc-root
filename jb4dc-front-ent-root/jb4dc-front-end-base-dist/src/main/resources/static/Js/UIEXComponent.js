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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkpzL0NvbmZpZy5qcyIsIkpzL0VkaXRUYWJsZS5qcyIsIkpzL1JlbmRlcmVycy9FZGl0VGFibGVfQ2hlY2tCb3guanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX0Zvcm1hdHRlci5qcyIsIkpzL1JlbmRlcmVycy9FZGl0VGFibGVfTGFiZWwuanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX1JhZGlvLmpzIiwiSnMvUmVuZGVyZXJzL0VkaXRUYWJsZV9TZWxlY3QuanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX1NlbGVjdFJvd0NoZWNrQm94LmpzIiwiSnMvUmVuZGVyZXJzL0VkaXRUYWJsZV9UZXh0Qm94LmpzIiwiZGVtby9UcmVlVGFibGVDb25maWcuanMiLCJKcy9UcmVlVGFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0ckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiVUlFWENvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5pZiAoIU9iamVjdC5jcmVhdGUpIHtcbiAgT2JqZWN0LmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBGKCkge31cblxuICAgIHJldHVybiBmdW5jdGlvbiAobykge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ09iamVjdC5jcmVhdGUgaW1wbGVtZW50YXRpb24gb25seSBhY2NlcHRzIG9uZSBwYXJhbWV0ZXIuJyk7XG4gICAgICB9XG5cbiAgICAgIEYucHJvdG90eXBlID0gbztcbiAgICAgIHJldHVybiBuZXcgRigpO1xuICAgIH07XG4gIH0oKTtcbn1cblxudmFyIEVkaXRUYWJsZUNvbmZpZyA9IHtcbiAgU3RhdHVzOiBcIkVkaXRcIixcbiAgVGVtcGxhdGVzOiBbe1xuICAgIFRpdGxlOiBcIuihqOWQjTFcIixcbiAgICBGaWVsZE5hbWU6IFwiVGFibGVGaWVsZFwiLFxuICAgIFJlbmRlcmVyOiBcIkVkaXRUYWJsZV9UZXh0Qm94XCIsXG4gICAgVGl0bGVDZWxsQ2xhc3NOYW1lOiBcIlRpdGxlQ2VsbFwiLFxuICAgIEhpZGRlbjogZmFsc2UsXG4gICAgVGl0bGVDZWxsQXR0cnM6IHt9XG4gIH0sIHtcbiAgICBUaXRsZTogXCLlrZfmrrXnsbvlnotcIixcbiAgICBGaWVsZE5hbWU6IFwiVGFibGVGaWVsZFwiLFxuICAgIFJlbmRlcmVyOiBcIkVkaXRUYWJsZV9UZXh0Qm94XCIsXG4gICAgSGlkZGVuOiBmYWxzZVxuICB9LCB7XG4gICAgVGl0bGU6IFwi5aSH5rOoXCIsXG4gICAgRmllbGROYW1lOiBcIlRhYmxlRmllbGRcIixcbiAgICBSZW5kZXJlcjogXCJFZGl0VGFibGVfVGV4dEJveFwiLFxuICAgIEhpZGRlbjogZmFsc2VcbiAgfV0sXG4gIFJvd0lkQ3JlYXRlcjogZnVuY3Rpb24gUm93SWRDcmVhdGVyKCkge30sXG4gIFRhYmxlQ2xhc3M6IFwiRWRpdFRhYmxlXCIsXG4gIFJlbmRlcmVyVG86IFwiZGl2VHJlZVRhYmxlXCIsXG4gIFRhYmxlSWQ6IFwiRWRpdFRhYmxlXCIsXG4gIFRhYmxlQXR0cnM6IHtcbiAgICBjZWxscGFkZGluZzogXCIxXCIsXG4gICAgY2VsbHNwYWNpbmc6IFwiMVwiLFxuICAgIGJvcmRlcjogXCIxXCJcbiAgfVxufTtcbnZhciBFZGl0VGFibGVEYXRhID0ge307IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGUgPSB7XG4gIF8kUHJvcF9UYWJsZUVsZW06IG51bGwsXG4gIF8kUHJvcF9SZW5kZXJlclRvRWxlbTogbnVsbCxcbiAgX1Byb3BfQ29uZmlnTWFuYWdlcjogbnVsbCxcbiAgX1Byb3BfSnNvbkRhdGE6IG5ldyBPYmplY3QoKSxcbiAgXyRQcm9wX0VkaXRpbmdSb3dFbGVtOiBudWxsLFxuICBfU3RhdHVzOiBcIkVkaXRcIixcbiAgSW5pdGlhbGl6YXRpb246IGZ1bmN0aW9uIEluaXRpYWxpemF0aW9uKF9jb25maWcpIHtcbiAgICB0aGlzLl9Qcm9wX0NvbmZpZ01hbmFnZXIgPSBPYmplY3QuY3JlYXRlKEVkaXRUYWJsZUNvbmZpZ01hbmFnZXIpO1xuXG4gICAgdGhpcy5fUHJvcF9Db25maWdNYW5hZ2VyLkluaXRpYWxpemF0aW9uQ29uZmlnKF9jb25maWcpO1xuXG4gICAgdmFyIF9DID0gdGhpcy5fUHJvcF9Db25maWdNYW5hZ2VyLkdldENvbmZpZygpO1xuXG4gICAgdGhpcy5fJFByb3BfUmVuZGVyZXJUb0VsZW0gPSAkKFwiI1wiICsgX0MuUmVuZGVyZXJUbyk7XG4gICAgdGhpcy5fJFByb3BfVGFibGVFbGVtID0gdGhpcy5DcmVhdGVUYWJsZSgpO1xuXG4gICAgdGhpcy5fJFByb3BfVGFibGVFbGVtLmFwcGVuZCh0aGlzLkNyZWF0ZVRhYmxlVGl0bGVSb3coKSk7XG5cbiAgICB0aGlzLl8kUHJvcF9SZW5kZXJlclRvRWxlbS5hcHBlbmQodGhpcy5fJFByb3BfVGFibGVFbGVtKTtcblxuICAgIGlmIChfQy5TdGF0dXMpIHtcbiAgICAgIHRoaXMuX1N0YXR1cyA9IF9DLlN0YXR1cztcbiAgICB9XG4gIH0sXG4gIExvYWRKc29uRGF0YTogZnVuY3Rpb24gTG9hZEpzb25EYXRhKGpzb25EYXRhKSB7XG4gICAgaWYgKGpzb25EYXRhICE9IG51bGwgJiYganNvbkRhdGEgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGpzb25EYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0ganNvbkRhdGFbaV07XG4gICAgICAgIHZhciByb3dJZCA9IHRoaXMuQWRkRWRpdGluZ1Jvd0J5VGVtcGxhdGUoanNvbkRhdGEsIGl0ZW0pO1xuICAgICAgICB0aGlzLl9Qcm9wX0pzb25EYXRhW3Jvd0lkXSA9IGl0ZW07XG4gICAgICB9XG5cbiAgICAgIHRoaXMuQ29tcGxldGVkRWRpdGluZ1JvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhbGVydChcIkpzb24gRGF0YSBPYmplY3QgRXJyb3JcIik7XG4gICAgfVxuICB9LFxuICBDcmVhdGVUYWJsZTogZnVuY3Rpb24gQ3JlYXRlVGFibGUoKSB7XG4gICAgdmFyIF9DID0gdGhpcy5fUHJvcF9Db25maWdNYW5hZ2VyLkdldENvbmZpZygpO1xuXG4gICAgdmFyIF9lZGl0VGFibGUgPSAkKFwiPHRhYmxlIC8+XCIpO1xuXG4gICAgX2VkaXRUYWJsZS5hZGRDbGFzcyhfQy5UYWJsZUNsYXNzKTtcblxuICAgIF9lZGl0VGFibGUuYXR0cihcIklkXCIsIF9DLlRhYmxlSWQpO1xuXG4gICAgX2VkaXRUYWJsZS5hdHRyKF9DLlRhYmxlQXR0cnMpO1xuXG4gICAgcmV0dXJuIF9lZGl0VGFibGU7XG4gIH0sXG4gIENyZWF0ZVRhYmxlVGl0bGVSb3c6IGZ1bmN0aW9uIENyZWF0ZVRhYmxlVGl0bGVSb3coKSB7XG4gICAgdmFyIF9DID0gdGhpcy5fUHJvcF9Db25maWdNYW5hZ2VyLkdldENvbmZpZygpO1xuXG4gICAgdmFyIF90aXRsZVJvdyA9ICQoXCI8dHIgaXNIZWFkZXI9J3RydWUnIC8+XCIpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfQy5UZW1wbGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IF9DLlRlbXBsYXRlc1tpXTtcbiAgICAgIHZhciB0aXRsZSA9IHRlbXBsYXRlLlRpdGxlO1xuICAgICAgdmFyIHRoID0gJChcIjx0aD5cIiArIHRpdGxlICsgXCI8L3RoPlwiKTtcblxuICAgICAgaWYgKHRlbXBsYXRlLlRpdGxlQ2VsbENsYXNzTmFtZSkge1xuICAgICAgICB0aC5hZGRDbGFzcyh0ZW1wbGF0ZS5UaXRsZUNlbGxDbGFzc05hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGVtcGxhdGUuVGl0bGVDZWxsQXR0cnMpIHtcbiAgICAgICAgdGguYXR0cih0ZW1wbGF0ZS5UaXRsZUNlbGxBdHRycyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuSGlkZGVuICE9ICd1bmRlZmluZWQnICYmIHRlbXBsYXRlLkhpZGRlbiA9PSB0cnVlKSB7XG4gICAgICAgIHRoLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgX3RpdGxlUm93LmFwcGVuZCh0aCk7XG4gICAgfVxuXG4gICAgdmFyIF90aXRsZVJvd0hlYWQgPSAkKFwiPHRoZWFkPjwvdGhlYWQ+XCIpO1xuXG4gICAgX3RpdGxlUm93SGVhZC5hcHBlbmQoX3RpdGxlUm93KTtcblxuICAgIHJldHVybiBfdGl0bGVSb3dIZWFkO1xuICB9LFxuICBBZGRFbXB0eUVkaXRpbmdSb3dCeVRlbXBsYXRlOiBmdW5jdGlvbiBBZGRFbXB0eUVkaXRpbmdSb3dCeVRlbXBsYXRlKGNhbGxiYWNrZnVuKSB7XG4gICAgdmFyIHJvd0lkID0gdGhpcy5BZGRFZGl0aW5nUm93QnlUZW1wbGF0ZShudWxsKTtcbiAgICB0aGlzLl9Qcm9wX0pzb25EYXRhW3Jvd0lkXSA9IG51bGw7XG4gIH0sXG4gIEFkZEVkaXRpbmdSb3dCeVRlbXBsYXRlOiBmdW5jdGlvbiBBZGRFZGl0aW5nUm93QnlUZW1wbGF0ZShqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgaWYgKHRoaXMuQ29tcGxldGVkRWRpdGluZ1JvdygpKSB7XG4gICAgICB2YXIgcm93SWQgPSBTdHJpbmdVdGlsaXR5Lkd1aWQoKTtcbiAgICAgIHZhciAkcm93RWxlbSA9ICQoXCI8dHIgLz5cIik7XG4gICAgICAkcm93RWxlbS5hdHRyKFwiaWRcIiwgcm93SWQpO1xuICAgICAgdGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW0gPSAkcm93RWxlbTtcblxuICAgICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCAmJiBqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlLmVkaXRFYWJsZSA9PSBmYWxzZSkge30gZWxzZSB7XG4gICAgICAgIHZhciBldmVudF9kYXRhID0ge1xuICAgICAgICAgIGhvc3Q6IHRoaXNcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5fU3RhdHVzICE9IFwiVmlld1wiKSB7XG4gICAgICAgICAgJHJvd0VsZW0uYmluZChcImNsaWNrXCIsIGV2ZW50X2RhdGEsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIHJvd1N0YXR1cyA9ICRyb3dFbGVtLmF0dHIoXCJzdGF0dXNcIik7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygcm93U3RhdHVzICE9ICd1bmRlZmluZWQnICYmIHJvd1N0YXR1cyA9PSBcImRpc2FibGVkXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX2hvc3QgPSBldmVudC5kYXRhLmhvc3Q7XG5cbiAgICAgICAgICAgIGlmIChfaG9zdC5fJFByb3BfRWRpdGluZ1Jvd0VsZW0gIT0gbnVsbCAmJiAkKHRoaXMpLmF0dHIoXCJpZFwiKSA9PSBfaG9zdC5fJFByb3BfRWRpdGluZ1Jvd0VsZW0uYXR0cihcImlkXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF9DID0gX2hvc3QuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBfQy5Sb3dDbGljayAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgX0MuUm93Q2xpY2sgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBfQy5Sb3dDbGljaygpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSAndW5kZWZpbmVkJyAmJiByZXN1bHQgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBhbGVydChcIl9DLlJvd0NsaWNrKCkgRXJyb3JcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF9ob3N0LkNvbXBsZXRlZEVkaXRpbmdSb3coKSkge1xuICAgICAgICAgICAgICBfaG9zdC5fJFByb3BfRWRpdGluZ1Jvd0VsZW0gPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgIF9ob3N0LlNldFJvd0lzRWRpdFN0YXR1cyhfaG9zdC5fJFByb3BfRWRpdGluZ1Jvd0VsZW0pO1xuXG4gICAgICAgICAgICAgIHZhciBfcm93ID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICBfcm93LmZpbmQoXCJ0ZFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRkID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSAkdGQuYXR0cihcInJlbmRlcmVyXCIpO1xuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUlkID0gJHRkLmF0dHIoXCJ0ZW1wbGF0ZUlkXCIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gX2hvc3QuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcblxuICAgICAgICAgICAgICAgIHZhciByZW5kZXJlck9iaiA9IGV2YWwoXCJPYmplY3QuY3JlYXRlKFwiICsgcmVuZGVyZXIgKyBcIilcIik7XG4gICAgICAgICAgICAgICAgdmFyICRodG1sZWxlbSA9IHJlbmRlcmVyT2JqLkdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9DLCB0ZW1wbGF0ZSwgJHRkLCBfcm93LCB0aGlzLl8kUHJvcF9UYWJsZUVsZW0sICR0ZC5jaGlsZHJlbigpKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuSGlkZGVuICE9ICd1bmRlZmluZWQnICYmIHRlbXBsYXRlLkhpZGRlbiA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAkdGQuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuU3R5bGUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICR0ZC5jc3ModGVtcGxhdGUuU3R5bGUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICR0ZC5odG1sKFwiXCIpO1xuICAgICAgICAgICAgICAgICR0ZC5hcHBlbmQoJGh0bWxlbGVtKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIF9DID0gdGhpcy5fUHJvcF9Db25maWdNYW5hZ2VyLkdldENvbmZpZygpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9DLlRlbXBsYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdGVtcGxhdGUgPSBfQy5UZW1wbGF0ZXNbaV07XG4gICAgICAgIHZhciByZW5kZXJlciA9IG51bGw7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZW5kZXJlciA9IHRlbXBsYXRlLlJlbmRlcmVyO1xuICAgICAgICAgIHZhciByZW5kZXJlck9iaiA9IGV2YWwoXCJPYmplY3QuY3JlYXRlKFwiICsgcmVuZGVyZXIgKyBcIilcIik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBhbGVydChcIuWunuS+i+WMllwiICsgcmVuZGVyZXIgKyBcIuWksei0pSFcIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgJHRkRWxlbSA9IG51bGw7XG4gICAgICAgICR0ZEVsZW0gPSAkKFwiPHRkIC8+XCIpO1xuICAgICAgICAkdGRFbGVtLmF0dHIoXCJyZW5kZXJlclwiLCByZW5kZXJlcik7XG4gICAgICAgICR0ZEVsZW0uYXR0cihcInRlbXBsYXRlSWRcIiwgdGVtcGxhdGUuVGVtcGxhdGVJZCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5IaWRkZW4gIT0gJ3VuZGVmaW5lZCcgJiYgdGVtcGxhdGUuSGlkZGVuID09IHRydWUpIHtcbiAgICAgICAgICAkdGRFbGVtLmhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuV2lkdGggIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAkdGRFbGVtLmNzcyhcIndpZHRoXCIsIHRlbXBsYXRlLldpZHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuQWxpZ24gIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAkdGRFbGVtLmF0dHIoXCJhbGlnblwiLCB0ZW1wbGF0ZS5BbGlnbik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgJGVsZW0gPSByZW5kZXJlck9iai5HZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfQywgdGVtcGxhdGUsICR0ZEVsZW0sICRyb3dFbGVtLCB0aGlzLl8kUHJvcF9UYWJsZUVsZW0sIG51bGwsIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuU3R5bGUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAkdGRFbGVtLmNzcyh0ZW1wbGF0ZS5TdHlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICAkdGRFbGVtLmFwcGVuZCgkZWxlbSk7XG4gICAgICAgICRyb3dFbGVtLmFwcGVuZCgkdGRFbGVtKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fJFByb3BfVGFibGVFbGVtLmFwcGVuZCgkcm93RWxlbSk7XG5cbiAgICAgIGlmICh0eXBlb2YgX0MuQWRkQWZ0ZXJSb3dFdmVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIF9DLkFkZEFmdGVyUm93RXZlbnQgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBfQy5BZGRBZnRlclJvd0V2ZW50KCRyb3dFbGVtKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJvd0lkO1xuICAgIH1cbiAgfSxcbiAgU2V0VG9WaWV3U3RhdHVzOiBmdW5jdGlvbiBTZXRUb1ZpZXdTdGF0dXMoKSB7XG4gICAgdGhpcy5fU3RhdHVzID0gXCJWaWV3XCI7XG4gIH0sXG4gIFNldFJvd0lzRWRpdFN0YXR1czogZnVuY3Rpb24gU2V0Um93SXNFZGl0U3RhdHVzKHRyKSB7XG4gICAgJCh0cikuYXR0cihcIkVkaXRTdGF0dXNcIiwgXCJFZGl0U3RhdHVzXCIpO1xuICB9LFxuICBTZXRSb3dJc0NvbXBsZXRlZFN0YXR1czogZnVuY3Rpb24gU2V0Um93SXNDb21wbGV0ZWRTdGF0dXModHIpIHtcbiAgICAkKHRyKS5hdHRyKFwiRWRpdFN0YXR1c1wiLCBcIkNvbXBsZXRlZFN0YXR1c1wiKTtcbiAgfSxcbiAgUm93SXNFZGl0U3RhdHVzOiBmdW5jdGlvbiBSb3dJc0VkaXRTdGF0dXModHIpIHtcbiAgICByZXR1cm4gJCh0cikuYXR0cihcIkVkaXRTdGF0dXNcIikgPT0gXCJFZGl0U3RhdHVzXCI7XG4gIH0sXG4gIFJvd0lzQ29tcGxldGVkU3RhdHVzOiBmdW5jdGlvbiBSb3dJc0NvbXBsZXRlZFN0YXR1cyh0cikge1xuICAgIHJldHVybiAkKHRyKS5hdHRyKFwiRWRpdFN0YXR1c1wiKSA9PSBcIkNvbXBsZXRlZFN0YXR1c1wiO1xuICB9LFxuICBDb21wbGV0ZWRFZGl0aW5nUm93OiBmdW5jdGlvbiBDb21wbGV0ZWRFZGl0aW5nUm93KCkge1xuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtICE9IG51bGwpIHtcbiAgICAgIGlmICghdGhpcy5Sb3dJc0NvbXBsZXRlZFN0YXR1cyh0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSkpIHtcbiAgICAgICAgdmFyIF9DID0gdGhpcy5fUHJvcF9Db25maWdNYW5hZ2VyLkdldENvbmZpZygpO1xuXG4gICAgICAgIHZhciBfaG9zdCA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHRoaXMuVmFsaWRhdGVDb21wbGV0ZWRFZGl0aW5nUm93RW5hYmxlKHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtKSkge1xuICAgICAgICAgIHZhciBfcm93ID0gdGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW07XG4gICAgICAgICAgdGhpcy5TZXRSb3dJc0NvbXBsZXRlZFN0YXR1cyhfcm93KTtcblxuICAgICAgICAgIF9yb3cuZmluZChcInRkXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICR0ZCA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSAkdGQuYXR0cihcInJlbmRlcmVyXCIpO1xuICAgICAgICAgICAgdmFyIHRlbXBsYXRlSWQgPSAkdGQuYXR0cihcInRlbXBsYXRlSWRcIik7XG5cbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IF9ob3N0Ll9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0VGVtcGxhdGUodGVtcGxhdGVJZCk7XG5cbiAgICAgICAgICAgIHZhciByZW5kZXJlck9iaiA9IGV2YWwoXCJPYmplY3QuY3JlYXRlKFwiICsgcmVuZGVyZXIgKyBcIilcIik7XG4gICAgICAgICAgICB2YXIgJGh0bWxlbGVtID0gcmVuZGVyZXJPYmouR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfQywgdGVtcGxhdGUsICR0ZCwgX3JvdywgdGhpcy5fJFByb3BfVGFibGVFbGVtLCAkdGQuY2hpbGRyZW4oKSk7XG4gICAgICAgICAgICAkdGQuaHRtbChcIlwiKTtcbiAgICAgICAgICAgICR0ZC5hcHBlbmQoJGh0bWxlbGVtKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIFZhbGlkYXRlQ29tcGxldGVkRWRpdGluZ1Jvd0VuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVDb21wbGV0ZWRFZGl0aW5nUm93RW5hYmxlKGVkaXRSb3cpIHtcbiAgICB2YXIgX0MgPSB0aGlzLl9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0Q29uZmlnKCk7XG5cbiAgICB2YXIgX2hvc3QgPSB0aGlzO1xuXG4gICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgdmFyIHZhbGlkYXRlTXNnID0gXCJcIjtcbiAgICB2YXIgdGRzID0gJChlZGl0Um93KS5maW5kKFwidGRcIik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRkcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyICR0ZCA9ICQodGRzW2ldKTtcbiAgICAgIHZhciByZW5kZXJlciA9ICR0ZC5hdHRyKFwicmVuZGVyZXJcIik7XG4gICAgICB2YXIgdGVtcGxhdGVJZCA9ICR0ZC5hdHRyKFwidGVtcGxhdGVJZFwiKTtcblxuICAgICAgdmFyIHRlbXBsYXRlID0gX2hvc3QuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcblxuICAgICAgdmFyIHJlbmRlcmVyT2JqID0gZXZhbChcIk9iamVjdC5jcmVhdGUoXCIgKyByZW5kZXJlciArIFwiKVwiKTtcbiAgICAgIHZhciB2YWxyZXN1bHQgPSByZW5kZXJlck9iai5WYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9DLCB0ZW1wbGF0ZSwgJHRkLCBlZGl0Um93LCB0aGlzLl8kUHJvcF9UYWJsZUVsZW0sICR0ZC5jaGlsZHJlbigpKTtcblxuICAgICAgaWYgKHZhbHJlc3VsdC5TdWNjZXNzID09IGZhbHNlKSB7XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICB2YWxpZGF0ZU1zZyA9IHZhbHJlc3VsdC5Nc2c7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcmVzdWx0ICYmIHZhbGlkYXRlTXNnICE9IG51bGwpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCB2YWxpZGF0ZU1zZywgbnVsbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgUmVtb3ZlUm93OiBmdW5jdGlvbiBSZW1vdmVSb3coKSB7XG4gICAgaWYgKHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtICE9IG51bGwpIHtcbiAgICAgIHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtLnJlbW92ZSgpO1xuXG4gICAgICB0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSA9IG51bGw7XG4gICAgfVxuICB9LFxuICBHZXRUYWJsZU9iamVjdDogZnVuY3Rpb24gR2V0VGFibGVPYmplY3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuXyRQcm9wX1RhYmxlRWxlbTtcbiAgfSxcbiAgR2V0Um93czogZnVuY3Rpb24gR2V0Um93cygpIHtcbiAgICBpZiAodGhpcy5fJFByb3BfVGFibGVFbGVtICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLl8kUHJvcF9UYWJsZUVsZW0uZmluZChcInRyOm5vdCg6Zmlyc3QpXCIpO1xuICAgIH1cbiAgfSxcbiAgR2V0RWRpdFJvdzogZnVuY3Rpb24gR2V0RWRpdFJvdygpIHtcbiAgICBpZiAodGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0sXG4gIEdldExhc3RSb3c6IGZ1bmN0aW9uIEdldExhc3RSb3coKSB7XG4gICAgdmFyIHJvdyA9IHRoaXMuR2V0RWRpdFJvdygpO1xuICAgIGlmIChyb3cgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgdmFyIHJvd3MgPSB0aGlzLkdldFJvd3MoKTtcbiAgICB2YXIgaW5kZXggPSByb3dzLmluZGV4KHJvdyk7XG5cbiAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICByZXR1cm4gJChyb3dzW2luZGV4IC0gMV0pO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBHZXROZXh0Um93OiBmdW5jdGlvbiBHZXROZXh0Um93KCkge1xuICAgIHZhciByb3cgPSB0aGlzLkdldEVkaXRSb3coKTtcbiAgICBpZiAocm93ID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIHZhciByb3dzID0gdGhpcy5HZXRSb3dzKCk7XG4gICAgdmFyIGluZGV4ID0gcm93cy5pbmRleChyb3cpO1xuXG4gICAgaWYgKGluZGV4IDwgcm93cy5sZW5ndGggLSAxKSB7XG4gICAgICByZXR1cm4gJChyb3dzW2luZGV4ICsgMV0pO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBNb3ZlVXA6IGZ1bmN0aW9uIE1vdmVVcCgpIHtcbiAgICB2YXIgcm93ID0gdGhpcy5HZXRMYXN0Um93KCk7XG5cbiAgICBpZiAocm93ICE9IG51bGwpIHtcbiAgICAgIGlmICh0eXBlb2Ygcm93LmF0dHIoXCJzdGF0dXNcIikgIT0gXCJ1bmRlZmluZWRcIiAmJiByb3cuYXR0cihcInN0YXR1c1wiKSA9PSBcImRpc2FibGVkXCIpIHJldHVybiBmYWxzZTtcbiAgICAgIHZhciBtZSA9IHRoaXMuR2V0RWRpdFJvdygpO1xuICAgICAgdmFyIHRlbXAgPSBtZS5hdHRyKFwiY2xhc3NcIik7XG4gICAgICBtZS5hdHRyKFwiY2xhc3NcIiwgcm93LmF0dHIoXCJjbGFzc1wiKSk7XG4gICAgICByb3cuYXR0cihcImNsYXNzXCIsIHRlbXApO1xuXG4gICAgICBpZiAobWUgIT0gbnVsbCkge1xuICAgICAgICByb3cuYmVmb3JlKG1lWzBdKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIE1vdmVEb3duOiBmdW5jdGlvbiBNb3ZlRG93bigpIHtcbiAgICB2YXIgcm93ID0gdGhpcy5HZXROZXh0Um93KCk7XG5cbiAgICBpZiAocm93ICE9IG51bGwpIHtcbiAgICAgIGlmICh0eXBlb2Ygcm93LmF0dHIoXCJzdGF0ZVwiKSAhPSBcInVuZGVmaW5lZFwiICYmIHJvdy5hdHRyKFwic3RhdGVcIikgPT0gXCJkaXNhYmxlZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICB2YXIgbWUgPSB0aGlzLkdldEVkaXRSb3coKTtcbiAgICAgIHZhciB0ZW1wID0gbWUuYXR0cihcImNsYXNzXCIpO1xuICAgICAgbWUuYXR0cihcImNsYXNzXCIsIHJvdy5hdHRyKFwiY2xhc3NcIikpO1xuICAgICAgcm93LmF0dHIoXCJjbGFzc1wiLCB0ZW1wKTtcblxuICAgICAgaWYgKG1lICE9IG51bGwpIHtcbiAgICAgICAgcm93LmFmdGVyKG1lWzBdKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIFJlbW92ZUFsbFJvdzogZnVuY3Rpb24gUmVtb3ZlQWxsUm93KCkge1xuICAgIGlmICh0aGlzLl8kUHJvcF9UYWJsZUVsZW0gIT0gbnVsbCkge1xuICAgICAgdGhpcy5fJFByb3BfVGFibGVFbGVtLmZpbmQoXCJ0cjpub3QoOmZpcnN0KVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgVXBkYXRlVG9Sb3c6IGZ1bmN0aW9uIFVwZGF0ZVRvUm93KHJvd0lkLCByb3dEYXRhKSB7XG4gICAgdmFyIHRhYmxlRWxlbWVudCA9IHRoaXMuXyRQcm9wX1RhYmxlRWxlbTtcblxuICAgIHZhciBfaG9zdCA9IHRoaXM7XG5cbiAgICB0YWJsZUVsZW1lbnQuZmluZChcInRyW2lzSGVhZGVyIT0ndHJ1ZSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0ciA9ICQodGhpcyk7XG5cbiAgICAgIHZhciBfcm93SWQgPSAkdHIuYXR0cihcImlkXCIpO1xuXG4gICAgICBpZiAocm93SWQgPT0gX3Jvd0lkKSB7XG4gICAgICAgIGZvciAodmFyIGF0dHJOYW1lIGluIHJvd0RhdGEpIHtcbiAgICAgICAgICAkdHIuZmluZChcInRkXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICR0ZCA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgJGRpc3BsYXlFbGVtID0gJHRkLmZpbmQoXCJbSXNTZXJpYWxpemU9J3RydWUnXVwiKTtcbiAgICAgICAgICAgIHZhciBiaW5kTmFtZSA9ICRkaXNwbGF5RWxlbS5hdHRyKFwiQmluZE5hbWVcIik7XG5cbiAgICAgICAgICAgIGlmIChhdHRyTmFtZSA9PSBiaW5kTmFtZSkge1xuICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVJZCA9ICR0ZC5hdHRyKFwidGVtcGxhdGVJZFwiKTtcblxuICAgICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSBfaG9zdC5fUHJvcF9Db25maWdNYW5hZ2VyLkdldFRlbXBsYXRlKHRlbXBsYXRlSWQpO1xuXG4gICAgICAgICAgICAgIHZhciB0ZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgdmFyIHZhbCA9IHJvd0RhdGFbYmluZE5hbWVdO1xuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuRm9ybWF0dGVyICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiB0ZW1wbGF0ZS5Gb3JtYXR0ZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRleHQgPSB0ZW1wbGF0ZS5Gb3JtYXR0ZXIodmFsKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICh0ZXh0ID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gdmFsO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKCRkaXNwbGF5RWxlbS5wcm9wKCd0YWdOYW1lJykgPT0gXCJJTlBVVFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRkaXNwbGF5RWxlbS5hdHRyKFwidHlwZVwiKS50b0xvd2VyQ2FzZSgpID09IFwiY2hlY2tib3hcIikge30gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAkZGlzcGxheUVsZW0udmFsKHRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgJGRpc3BsYXlFbGVtLnRleHQodGV4dCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgYWxlcnQoXCJVcGRhdGVUb1JvdyAkbGFiZWwudGV4dCh0ZXh0KSBFcnJvciFcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJGRpc3BsYXlFbGVtLmF0dHIoXCJWYWx1ZVwiLCB2YWwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgR2V0U2VsZWN0Um93RGF0YUJ5Um93SWQ6IGZ1bmN0aW9uIEdldFNlbGVjdFJvd0RhdGFCeVJvd0lkKHJvd0lkKSB7XG4gICAgdmFyIHRhYmxlRWxlbWVudCA9IHRoaXMuXyRQcm9wX1RhYmxlRWxlbTtcbiAgICB2YXIgcm93RGF0YSA9IHt9O1xuICAgIHRhYmxlRWxlbWVudC5maW5kKFwidHJbaXNIZWFkZXIhPSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRyID0gJCh0aGlzKTtcblxuICAgICAgdmFyIF9yb3dJZCA9ICR0ci5hdHRyKFwiaWRcIik7XG5cbiAgICAgIGlmIChyb3dJZCA9PSBfcm93SWQpIHtcbiAgICAgICAgJHRyLmZpbmQoXCJbSXNTZXJpYWxpemU9J3RydWUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiVmFsdWVcIikgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByb3dEYXRhWyQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpXSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByb3dEYXRhWyQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpXSA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcm93RGF0YTtcbiAgfSxcbiAgR2V0U2VsZWN0Um93QnlSb3dJZDogZnVuY3Rpb24gR2V0U2VsZWN0Um93QnlSb3dJZChyb3dJZCkge1xuICAgIHZhciB0YWJsZUVsZW1lbnQgPSB0aGlzLl8kUHJvcF9UYWJsZUVsZW07XG4gICAgcmV0dXJuIHRhYmxlRWxlbWVudC5maW5kKFwidHJbaWQ9J1wiICsgcm93SWQgKyBcIiddXCIpO1xuICB9LFxuICBHZXRBbGxSb3dEYXRhOiBmdW5jdGlvbiBHZXRBbGxSb3dEYXRhKCkge1xuICAgIHZhciB0YWJsZUVsZW1lbnQgPSB0aGlzLl8kUHJvcF9UYWJsZUVsZW07XG4gICAgdmFyIHJvd0RhdGFzID0gbmV3IEFycmF5KCk7XG4gICAgdGFibGVFbGVtZW50LmZpbmQoXCJ0cltpc0hlYWRlciE9J3RydWUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdHIgPSAkKHRoaXMpO1xuICAgICAgdmFyIHJvd0RhdGEgPSB7fTtcbiAgICAgICR0ci5maW5kKFwiW0lzU2VyaWFsaXplPSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJvd0RhdGFbJCh0aGlzKS5hdHRyKFwiQmluZE5hbWVcIildID0gJCh0aGlzKS5hdHRyKFwiVmFsdWVcIik7XG4gICAgICAgIHJvd0RhdGFbJCh0aGlzKS5hdHRyKFwiQmluZE5hbWVcIikgKyBcIl9fX1RleHRcIl0gPSAkKHRoaXMpLmF0dHIoXCJUZXh0XCIpO1xuICAgICAgfSk7XG4gICAgICByb3dEYXRhcy5wdXNoKHJvd0RhdGEpO1xuICAgIH0pO1xuICAgIHJldHVybiByb3dEYXRhcztcbiAgfSxcbiAgR2V0U2VyaWFsaXplSnNvbjogZnVuY3Rpb24gR2V0U2VyaWFsaXplSnNvbihmaWVsZE5hbWVGaXJzdENoYXJMZXR0ZXIpIHtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KCk7XG4gICAgdmFyIHRhYmxlID0gdGhpcy5fJFByb3BfVGFibGVFbGVtO1xuICAgIHRhYmxlLmZpbmQoXCJ0cltpc0hlYWRlciE9J3RydWUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciByb3dkYXRhID0gbmV3IE9iamVjdCgpO1xuICAgICAgdmFyICR0ciA9ICQodGhpcyk7XG4gICAgICAkdHIuZmluZChcIltJc1NlcmlhbGl6ZT0ndHJ1ZSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2VyaXRlbSA9ICQodGhpcyk7XG4gICAgICAgIHZhciBiaW5kTmFtZSA9IHNlcml0ZW0uYXR0cihcIkJpbmROYW1lXCIpO1xuICAgICAgICB2YXIgYmluZFZhbHVlID0gc2VyaXRlbS5hdHRyKFwiVmFsdWVcIik7XG4gICAgICAgIHZhciBiaW5kVGV4dCA9IHNlcml0ZW0uYXR0cihcIlRleHRcIik7XG5cbiAgICAgICAgaWYgKCFiaW5kVGV4dCkge1xuICAgICAgICAgIGJpbmRUZXh0ID0gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChiaW5kVGV4dCA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgYmluZFRleHQgPSBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpZWxkTmFtZUZpcnN0Q2hhckxldHRlciA9PSB0cnVlKSB7XG4gICAgICAgICAgYmluZE5hbWUgPSBTdHJpbmdVdGlsaXR5LkZpcnN0Q2hhckxldHRlcihiaW5kTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICByb3dkYXRhW2JpbmROYW1lXSA9IGJpbmRWYWx1ZTtcbiAgICAgICAgcm93ZGF0YVtiaW5kTmFtZSArIFwiX19fVGV4dFwiXSA9IGJpbmRUZXh0O1xuICAgICAgfSk7XG4gICAgICByZXN1bHQucHVzaChyb3dkYXRhKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBHZXRUYWJsZUVsZW1lbnQ6IGZ1bmN0aW9uIEdldFRhYmxlRWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fJFByb3BfVGFibGVFbGVtO1xuICB9XG59O1xudmFyIEVkaXRUYWJsZUNvbmZpZ01hbmFnZXIgPSB7XG4gIF9Qcm9wX0NvbmZpZzoge30sXG4gIEluaXRpYWxpemF0aW9uQ29uZmlnOiBmdW5jdGlvbiBJbml0aWFsaXphdGlvbkNvbmZpZyhfY29uZmlnKSB7XG4gICAgdGhpcy5fUHJvcF9Db25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5fUHJvcF9Db25maWcsIF9jb25maWcpO1xuICAgIHZhciBfdGVtcGxhdGVzID0gdGhpcy5fUHJvcF9Db25maWcuVGVtcGxhdGVzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGVtcGxhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBfdGVtcGxhdGVzW2ldO1xuICAgICAgdGVtcGxhdGUuVGVtcGxhdGVJZCA9IFN0cmluZ1V0aWxpdHkuR3VpZCgpO1xuICAgIH1cbiAgfSxcbiAgR2V0Q29uZmlnOiBmdW5jdGlvbiBHZXRDb25maWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX1Byb3BfQ29uZmlnO1xuICB9LFxuICBHZXRUZW1wbGF0ZTogZnVuY3Rpb24gR2V0VGVtcGxhdGUodGVtcGxhdGVJZCkge1xuICAgIHZhciBfdGVtcGxhdGVzID0gdGhpcy5fUHJvcF9Db25maWcuVGVtcGxhdGVzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGVtcGxhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBfdGVtcGxhdGVzW2ldO1xuXG4gICAgICBpZiAodGVtcGxhdGUuVGVtcGxhdGVJZCA9PSB0ZW1wbGF0ZUlkKSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcbnZhciBFZGl0VGFibGVWYWxpZGF0ZSA9IHtcbiAgX1NRTEtleVdvcmRBcnJheTogbmV3IEFycmF5KCksXG4gIEdldFNRTEtleVdvcmRzOiBmdW5jdGlvbiBHZXRTUUxLZXlXb3JkcygpIHtcbiAgICBpZiAodGhpcy5fU1FMS2V5V29yZEFycmF5Lmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImluc2VydFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJ1cGRhdGVcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZGVsZXRlXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcInNlbGVjdFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJhc1wiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJmcm9tXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImRpc3RpbmN0XCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcIndoZXJlXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcIm9yZGVyXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImJ5XCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImFzY1wiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJkZXNjXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImRlc2NcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiYW5kXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcIm9yXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImJldHdlZW5cIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwib3JkZXIgYnlcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiY291bnRcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZ3JvdXBcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZ3JvdXAgYnlcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiaGF2aW5nXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImFsaWFzXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImpvaW5cIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwibGVmdFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJyaWd0aFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJpbm5lZXJcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwidW5pb25cIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwic3VtXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImFsbFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJtaW51c1wiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJhbGVydFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJkcm9wXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImV4ZWNcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwidHJ1bmNhdGVcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX1NRTEtleVdvcmRBcnJheTtcbiAgfSxcbiAgVmFsaWRhdGU6IGZ1bmN0aW9uIFZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgU3VjY2VzczogdHJ1ZSxcbiAgICAgIE1zZzogXCJcIlxuICAgIH07XG4gICAgdmFyIHZhbGlkYXRlQ29uZmlnID0gdGVtcGxhdGUuVmFsaWRhdGU7XG5cbiAgICBpZiAodmFsaWRhdGVDb25maWcgIT0gdW5kZWZpbmVkICYmIHZhbGlkYXRlQ29uZmlnICE9IG51bGwpIHtcbiAgICAgIHZhciB2YWxpZGF0ZVR5cGUgPSB2YWxpZGF0ZUNvbmZpZy5UeXBlO1xuXG4gICAgICBpZiAodmFsaWRhdGVUeXBlICE9IHVuZGVmaW5lZCAmJiB2YWxpZGF0ZVR5cGUgIT0gbnVsbCkge1xuICAgICAgICBzd2l0Y2ggKHZhbGlkYXRlVHlwZSkge1xuICAgICAgICAgIGNhc2UgXCJOb3RFbXB0eVwiOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZiAodmFsID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuU3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5Nc2cgPSBcIuOAkFwiICsgdGVtcGxhdGUuVGl0bGUgKyBcIuOAkeS4jeiDveS4uuepuiFcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIFwiTFVOb09ubHlcIjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWYgKC9eW2EtekEtWl1bYS16QS1aMC05X117MCx9JC8udGVzdCh2YWwpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LlN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXN1bHQuTXNnID0gXCLjgJBcIiArIHRlbXBsYXRlLlRpdGxlICsgXCLjgJHkuI3og73kuLrnqbrkuJTlj6rog73mmK/lrZfmr43jgIHkuIvliJLnur/jgIHmlbDlrZflubbku6XlrZfmr43lvIDlpLTvvIFcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIFwiU1FMS2V5V29yZFwiOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZiAoL15bYS16QS1aXVthLXpBLVowLTlfXXswLH0kLy50ZXN0KHZhbCkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuU3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5Nc2cgPSBcIuOAkFwiICsgdGVtcGxhdGUuVGl0bGUgKyBcIuOAkeS4jeiDveS4uuepuuS4lOWPquiDveaYr+Wtl+avjeOAgeS4i+WIkue6v+OAgeaVsOWtl+W5tuS7peWtl+avjeW8gOWktO+8gVwiO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHZhbCA9IHZhbC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICB2YXIgc3FsS2V5V29yZHMgPSB0aGlzLkdldFNRTEtleVdvcmRzKCk7XG5cbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcWxLZXlXb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgPT0gc3FsS2V5V29yZHNbaV0udG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0LlN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdC5Nc2cgPSBcIuOAkFwiICsgdGVtcGxhdGUuVGl0bGUgKyBcIuOAkeivt+S4jeimgeS9v+eUqFNRTOWFs+mUruWtl+S9nOS4uuWIl+WQje+8gVwiO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn07XG52YXIgRWRpdFRhYmxlRGVmYXVsZVZhbHVlID0ge1xuICBHZXRWYWx1ZTogZnVuY3Rpb24gR2V0VmFsdWUodGVtcGxhdGUpIHtcbiAgICB2YXIgZGVmYXVsdFZhbHVlQ29uZmlnID0gdGVtcGxhdGUuRGVmYXVsdFZhbHVlO1xuXG4gICAgaWYgKGRlZmF1bHRWYWx1ZUNvbmZpZyAhPSB1bmRlZmluZWQgJiYgZGVmYXVsdFZhbHVlQ29uZmlnICE9IG51bGwpIHtcbiAgICAgIHZhciBkZWZhdWx0VmFsdWVUeXBlID0gZGVmYXVsdFZhbHVlQ29uZmlnLlR5cGU7XG5cbiAgICAgIGlmIChkZWZhdWx0VmFsdWVUeXBlICE9IHVuZGVmaW5lZCAmJiBkZWZhdWx0VmFsdWVUeXBlICE9IG51bGwpIHtcbiAgICAgICAgc3dpdGNoIChkZWZhdWx0VmFsdWVUeXBlKSB7XG4gICAgICAgICAgY2FzZSBcIkNvbnN0XCI6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWVDb25maWcuVmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlIFwiR1VJRFwiOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBcIlwiO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX0NoZWNrQm94ID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyIGJpbmRuYW1lID0gdGVtcGxhdGUuQmluZE5hbWU7XG5cbiAgICBpZiAodGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gbnVsbCkge1xuICAgICAgdmFyIHZhbCA9IEVkaXRUYWJsZURlZmF1bGVWYWx1ZS5HZXRWYWx1ZSh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtiaW5kbmFtZV07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5odG1sKCk7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gXCJcIjtcblxuICAgIGlmICh2YWwgPT0gXCLmmK9cIikge1xuICAgICAgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J2NoZWNrYm94JyBjaGVja2VkPSdjaGVja2VkJyAvPlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J2NoZWNrYm94JyAvPlwiKTtcbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHZhciAkZWxlbSA9IFwiXCI7XG5cbiAgICBpZiAodGVtcGxhdGUuSXNDTlZhbHVlKSB7XG4gICAgICBpZiAoZWRpdFN0YXVzSHRtbEVsZW0uYXR0cihcImNoZWNrZWRcIikgPT0gXCJjaGVja2VkXCIpIHtcbiAgICAgICAgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyB2YWx1ZT0n5pivJz7mmK88L2xhYmVsPlwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgdmFsdWU9J+WQpic+5ZCmPC9sYWJlbD5cIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChlZGl0U3RhdXNIdG1sRWxlbS5hdHRyKFwiY2hlY2tlZFwiKSA9PSBcImNoZWNrZWRcIikge1xuICAgICAgICAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIHZhbHVlPScxJz7mmK88L2xhYmVsPlwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgdmFsdWU9JzAnPuWQpjwvbGFiZWw+XCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX0Zvcm1hdHRlciA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIGlmICh0ZW1wbGF0ZS5Gb3JtYXR0ZXIgJiYgdHlwZW9mIHRlbXBsYXRlLkZvcm1hdHRlciA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHZhciBlZGl0RGF0YXMgPSBFZGl0VGFibGUuX1Byb3BfSnNvbkRhdGE7XG5cbiAgICAgIGlmIChlZGl0RGF0YXMpIHtcbiAgICAgICAgdmFyIHJvd0lkID0gaG9zdFJvdy5hdHRyKFwiaWRcIik7XG4gICAgICAgIHZhciByb3dEYXRhID0gZWRpdERhdGFzW3Jvd0lkXTtcblxuICAgICAgICBpZiAocm93RGF0YSkge1xuICAgICAgICAgIHJldHVybiAkKHRlbXBsYXRlLkZvcm1hdHRlcih0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgcm93RGF0YSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiXCI7XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgaWYgKHRlbXBsYXRlLkZvcm1hdHRlciAmJiB0eXBlb2YgdGVtcGxhdGUuRm9ybWF0dGVyID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFyIGVkaXREYXRhcyA9IEVkaXRUYWJsZS5fUHJvcF9Kc29uRGF0YTtcblxuICAgICAgaWYgKGVkaXREYXRhcykge1xuICAgICAgICB2YXIgcm93SWQgPSBob3N0Um93LmF0dHIoXCJpZFwiKTtcbiAgICAgICAgdmFyIHJvd0RhdGEgPSBlZGl0RGF0YXNbcm93SWRdO1xuXG4gICAgICAgIGlmIChyb3dEYXRhKSB7XG4gICAgICAgICAgcmV0dXJuICQodGVtcGxhdGUuRm9ybWF0dGVyKHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCByb3dEYXRhKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gXCJcIjtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX0xhYmVsID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyIGJpbmRuYW1lID0gdGVtcGxhdGUuQmluZE5hbWU7XG5cbiAgICBpZiAodGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gbnVsbCkge1xuICAgICAgdmFsID0gRWRpdFRhYmxlRGVmYXVsZVZhbHVlLkdldFZhbHVlKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW2JpbmRuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuRm9ybWF0ZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmh0bWwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgJGVsZW07XG5cbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkZvcm1hdGVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBUZXh0PSdcIiArIHRleHQgKyBcIicgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9J1wiICsgdmFsICsgXCInPlwiICsgdmFsICsgXCI8L2xhYmVsPlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHRleHQgPSB0ZW1wbGF0ZS5Gb3JtYXRlcih2YWwpO1xuICAgICAgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBUZXh0PVwiICsgdGV4dCArIFwiIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPVwiICsgdmFsICsgXCI+XCIgKyB0ZXh0ICsgXCI8L2xhYmVsPlwiKTtcbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyICRlbGVtO1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcblxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuRm9ybWF0ZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIFRleHQ9J1wiICsgdGV4dCArIFwiJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWwgKyBcIic+XCIgKyB2YWwgKyBcIjwvbGFiZWw+XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdGV4dCA9IHRlbXBsYXRlLkZvcm1hdGVyKHZhbCk7XG4gICAgICAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIFRleHQ9J1wiICsgdGV4dCArIFwiJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWwgKyBcIic+XCIgKyB0ZXh0ICsgXCI8L2xhYmVsPlwiKTtcbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9SYWRpbyA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciBiaW5kbmFtZSA9IHRlbXBsYXRlLkJpbmROYW1lO1xuXG4gICAgaWYgKHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHZhciB2YWwgPSBFZGl0VGFibGVEZWZhdWxlVmFsdWUuR2V0VmFsdWUodGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbYmluZG5hbWVdO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gXCJcIjtcblxuICAgIGlmIChudWxsICE9IHZpZXdTdGF1c0h0bWxFbGVtICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCAmJiB2aWV3U3RhdXNIdG1sRWxlbS5hdHRyKFwiY2hlY2tlZFwiKSA9PSBcImNoZWNrZWRcIiB8fCB2YWwgPT0gMSkge1xuICAgICAgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J3JhZGlvJyBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgbmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBjaGVja2VkPSdjaGVja2VkJyB2YWx1ZT0nMScvPlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J3JhZGlvJyBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgbmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyB2YWx1ZT0nMCcvPlwiKTtcbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHZhciAkZWxlbSA9IFwiXCI7XG5cbiAgICBpZiAoZWRpdFN0YXVzSHRtbEVsZW0uYXR0cihcImNoZWNrZWRcIikgPT0gXCJjaGVja2VkXCIpIHtcbiAgICAgICRlbGVtID0gJChcIjxpbnB1dCB0eXBlPSdyYWRpbycgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIG5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIidjaGVja2VkPSdjaGVja2VkJyAgdmFsdWU9JzEnLz5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICRlbGVtID0gJChcIjxpbnB1dCB0eXBlPSdyYWRpbycgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIG5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgdmFsdWU9JzAnLz5cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfU2VsZWN0ID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIGNvbmZpZ1NvdXJjZSA9IG51bGw7XG5cbiAgICBpZiAodGVtcGxhdGUuQ2xpZW50RGF0YVNvdXJjZSAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuQ2xpZW50RGF0YVNvdXJjZSAhPSBudWxsKSB7XG4gICAgICBjb25maWdTb3VyY2UgPSB0ZW1wbGF0ZS5DbGllbnREYXRhU291cmNlO1xuICAgIH0gZWxzZSBpZiAodGVtcGxhdGUuQ2xpZW50RGF0YVNvdXJjZUZ1bmMgIT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlLkNsaWVudERhdGFTb3VyY2VGdW5jICE9IG51bGwpIHtcbiAgICAgIGNvbmZpZ1NvdXJjZSA9IHRlbXBsYXRlLkNsaWVudERhdGFTb3VyY2VGdW5jKHRlbXBsYXRlLkNsaWVudERhdGFTb3VyY2VGdW5jUGFyYXMsIF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZ1NvdXJjZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJChcIjxsYWJlbD7mib7kuI3liLDmlbDmja7mupDorr7nva4s6K+35ZyodGVtcGxhdGXkuK3orr7nva7mlbDmja7mupA8L2xhYmVsPlwiKTtcbiAgICB9XG5cbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgdHh0ID0gXCJcIjtcbiAgICB2YXIgYmluZG5hbWUgPSB0ZW1wbGF0ZS5CaW5kTmFtZTtcblxuICAgIGlmICh0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSBudWxsKSB7XG4gICAgICB2YXIgdmFsID0gRWRpdFRhYmxlRGVmYXVsZVZhbHVlLkdldFZhbHVlKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW2JpbmRuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPHNlbGVjdCBzdHlsZT0nd2lkdGg6IDEwMCUnIC8+XCIpO1xuXG4gICAgaWYgKGNvbmZpZ1NvdXJjZVswXS5Hcm91cCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWdTb3VyY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG9wdGdyb3VwID0gJChcIjxvcHRncm91cCAvPlwiKTtcbiAgICAgICAgb3B0Z3JvdXAuYXR0cihcImxhYmVsXCIsIGNvbmZpZ1NvdXJjZVtpXS5Hcm91cCk7XG5cbiAgICAgICAgaWYgKGNvbmZpZ1NvdXJjZVtpXS5PcHRpb25zKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb25maWdTb3VyY2VbaV0uT3B0aW9ucy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIG9wdGlvbiA9ICQoXCI8b3B0aW9uIC8+XCIpO1xuICAgICAgICAgICAgb3B0aW9uLmF0dHIoXCJ2YWx1ZVwiLCBjb25maWdTb3VyY2VbaV0uT3B0aW9uc1tqXS5WYWx1ZSk7XG4gICAgICAgICAgICBvcHRpb24uYXR0cihcInRleHRcIiwgY29uZmlnU291cmNlW2ldLk9wdGlvbnNbal0uVGV4dCk7XG4gICAgICAgICAgICBvcHRpb24udGV4dChjb25maWdTb3VyY2VbaV0uT3B0aW9uc1tqXS5UZXh0KTtcbiAgICAgICAgICAgIG9wdGdyb3VwLmFwcGVuZChvcHRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRlbGVtLmFwcGVuZChvcHRncm91cCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29uZmlnU291cmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gY29uZmlnU291cmNlW2ldO1xuICAgICAgICAkZWxlbS5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIGl0ZW0uVmFsdWUgKyBcIicgdGV4dD0nXCIgKyBpdGVtLlRleHQgKyBcIic+XCIgKyBpdGVtLlRleHQgKyBcIjwvb3B0aW9uPlwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcblxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuQ2hhbmdlRXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAkZWxlbS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgICB0ZW1wbGF0ZS5DaGFuZ2VFdmVudCh0aGlzLCBfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB2YXIgdGV4dCA9IGVkaXRTdGF1c0h0bWxFbGVtLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikuYXR0cihcIlRleHRcIik7XG5cbiAgICBpZiAoIXZhbCkge1xuICAgICAgdmFsID0gXCJcIjtcbiAgICB9XG5cbiAgICBpZiAoIXRleHQpIHtcbiAgICAgIHRleHQgPSBcIlwiO1xuICAgIH1cblxuICAgIHZhciAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPSdcIiArIHZhbCArIFwiJyBUZXh0PSdcIiArIHRleHQgKyBcIic+XCIgKyB0ZXh0ICsgXCI8L2xhYmVsPlwiKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9TZWxlY3RSb3dDaGVja0JveCA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciBiaW5kbmFtZSA9IHRlbXBsYXRlLkJpbmROYW1lO1xuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtiaW5kbmFtZV07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5hdHRyKFwiVmFsdWVcIik7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gJChcIjxpbnB1dCBJc1NlcmlhbGl6ZT0ndHJ1ZScgdHlwZT0nY2hlY2tib3gnIGNoZWNrZWQ9J2NoZWNrZWQnICBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyAvPlwiKTtcbiAgICAkZWxlbS5hdHRyKFwiVmFsdWVcIiwgdmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9ICQoZWRpdFN0YXVzSHRtbEVsZW0pLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPGlucHV0IElzU2VyaWFsaXplPSd0cnVlJyB0eXBlPSdjaGVja2JveCcgIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIC8+XCIpO1xuICAgICRlbGVtLmF0dHIoXCJWYWx1ZVwiLCB2YWwpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX1RleHRCb3ggPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgYmluZG5hbWUgPSB0ZW1wbGF0ZS5CaW5kTmFtZTtcblxuICAgIGlmICh0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSBudWxsKSB7XG4gICAgICB2YXIgdmFsID0gRWRpdFRhYmxlRGVmYXVsZVZhbHVlLkdldFZhbHVlKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW2JpbmRuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmh0bWwoKTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J3RleHQnIElzU2VyaWFsaXplPSd0cnVlJyBzdHlsZT0nd2lkdGg6IDk4JScgLz5cIik7XG4gICAgJGVsZW0udmFsKHZhbCk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWwgKyBcIic+XCIgKyB2YWwgKyBcIjwvbGFiZWw+XCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG5cbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlLlZhbGlkYXRlICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiB0ZW1wbGF0ZS5WYWxpZGF0ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBTdWNjZXNzOiB0cnVlLFxuICAgICAgICBNc2c6IG51bGxcbiAgICAgIH07XG4gICAgICByZXN1bHQuU3VjY2VzcyA9IHRlbXBsYXRlLlZhbGlkYXRlKCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgVHJlZVRhYmxlQ29uZmlnID0ge1xuICBDYW5EZWxldGVXaGVuSGFzQ2hpbGQ6IGZhbHNlLFxuICBJZEZpZWxkOiBcIk9yZ2FuX0lkXCIsXG4gIFJvd0lkUHJlZml4OiBcIlRyZWVUYWJsZV9cIixcbiAgTG9hZENoaWxkSnNvblVSTDogXCJcIixcbiAgTG9hZENoaWxkRnVuYzogbnVsbCxcbiAgT3BlbkxldmVsOiAxLFxuICBDaGlsZFRlc3RGaWVsZDogXCJDaGlsZF9Db3VudFwiLFxuICBUZW1wbGF0ZXM6IFt7XG4gICAgVGl0bGU6IFwi57uE57uH5py65p6E5ZCN56ewXCIsXG4gICAgRmllbGROYW1lOiBcIk9yZ2FuX05hbWVcIixcbiAgICBUaXRsZUNlbGxDbGFzc05hbWU6IFwiVGl0bGVDZWxsXCIsXG4gICAgUmVuZGVyZXI6IFwiTGFibGVcIixcbiAgICBIaWRkZW46IGZhbHNlLFxuICAgIFRpdGxlQ2VsbEF0dHJzOiB7fSxcbiAgICBXaWR0aDogXCI1MCVcIlxuICB9LCB7XG4gICAgVGl0bGU6IFwi57uE57uH5py65p6E57yp5YaZ5ZCN56ewXCIsXG4gICAgRmllbGROYW1lOiBcIk9yZ2FuX1Nob3J0TmFtZVwiLFxuICAgIFRpdGxlQ2VsbENsYXNzTmFtZTogXCJUaXRsZUNlbGxcIixcbiAgICBSZW5kZXJlcjogXCJMYWJsZVwiLFxuICAgIEhpZGRlbjogZmFsc2UsXG4gICAgVGl0bGVDZWxsQXR0cnM6IHt9LFxuICAgIFdpZHRoOiBcIjIwJVwiXG4gIH0sIHtcbiAgICBUaXRsZTogXCLnu4Tnu4fnvJblj7dcIixcbiAgICBGaWVsZE5hbWU6IFwiT3JnYW5fQ29kZVwiLFxuICAgIFRpdGxlQ2VsbENsYXNzTmFtZTogXCJUaXRsZUNlbGxcIixcbiAgICBSZW5kZXJlcjogXCJMYWJsZVwiLFxuICAgIEhpZGRlbjogZmFsc2UsXG4gICAgVGl0bGVDZWxsQXR0cnM6IHt9LFxuICAgIFdpZHRoOiBcIjIwJVwiXG4gIH0sIHtcbiAgICBUaXRsZTogXCLnu4Tnu4dJRFwiLFxuICAgIEZpZWxkTmFtZTogXCJPcmdhbl9JZFwiLFxuICAgIFRpdGxlQ2VsbENsYXNzTmFtZTogXCJUaXRsZUNlbGxcIixcbiAgICBSZW5kZXJlcjogXCJMYWJsZVwiLFxuICAgIEhpZGRlbjogZmFsc2UsXG4gICAgVGl0bGVDZWxsQXR0cnM6IHt9LFxuICAgIFdpZHRoOiBcIjEwXCJcbiAgfV0sXG4gIFRhYmxlQ2xhc3M6IFwiVHJlZVRhYmxlXCIsXG4gIFJlbmRlcmVyVG86IFwiZGl2RWRpdFRhYmxlXCIsXG4gIFRhYmxlSWQ6IFwiVHJlZVRhYmxlXCIsXG4gIFRhYmxlQXR0cnM6IHtcbiAgICBjZWxscGFkZGluZzogXCIwXCIsXG4gICAgY2VsbHNwYWNpbmc6IFwiMFwiLFxuICAgIGJvcmRlcjogXCIwXCJcbiAgfVxufTtcbnZhciBUcmVlVGFibGVKc29uRGF0YSA9IHtcbiAgT3JnYW5fSWQ6IFwiMFwiLFxuICBPcmdhbl9OYW1lOiBcInJvb3RcIixcbiAgT3JnYW5fU2hvcnROYW1lOiBcIjJcIixcbiAgT3JnYW5fQ29kZTogXCIyXCIsXG4gIENoaWxkX0NvdW50OiAyLFxuICBOb2RlczogW3tcbiAgICBPcmdhbl9JZDogXCIxXCIsXG4gICAgT3JnYW5fTmFtZTogXCIxT3JnYW5fTmFtZVwiLFxuICAgIE9yZ2FuX1Nob3J0TmFtZTogXCIxXCIsXG4gICAgT3JnYW5fQ29kZTogXCIxXCIsXG4gICAgQ2hpbGRfQ291bnQ6IDIsXG4gICAgTm9kZXM6IFt7XG4gICAgICBPcmdhbl9JZDogXCIxLTFcIixcbiAgICAgIE9yZ2FuX05hbWU6IFwiMS0xT3JnYW5fTmFtZVwiLFxuICAgICAgT3JnYW5fU2hvcnROYW1lOiBcIjEtMVwiLFxuICAgICAgT3JnYW5fQ29kZTogXCIxLTFcIixcbiAgICAgIENoaWxkX0NvdW50OiAxLFxuICAgICAgTm9kZXM6IFt7XG4gICAgICAgIE9yZ2FuX0lkOiBcIjEtMS0xXCIsXG4gICAgICAgIE9yZ2FuX05hbWU6IFwiMS0xLTFPcmdhbl9OYW1lXCIsXG4gICAgICAgIE9yZ2FuX1Nob3J0TmFtZTogXCIxLTEtMVwiLFxuICAgICAgICBPcmdhbl9Db2RlOiBcIjEtMVwiLFxuICAgICAgICBDaGlsZF9Db3VudDogMFxuICAgICAgfV1cbiAgICB9LCB7XG4gICAgICBPcmdhbl9JZDogXCIxLTJcIixcbiAgICAgIE9yZ2FuX05hbWU6IFwiMS0yT3JnYW5fTmFtZVwiLFxuICAgICAgT3JnYW5fU2hvcnROYW1lOiBcIjEtMlwiLFxuICAgICAgT3JnYW5fQ29kZTogXCIxLTJcIixcbiAgICAgIENoaWxkX0NvdW50OiAwXG4gICAgfV1cbiAgfSwge1xuICAgIE9yZ2FuX0lkOiBcIjJcIixcbiAgICBPcmdhbl9OYW1lOiBcIjJPcmdhbl9OYW1lXCIsXG4gICAgT3JnYW5fU2hvcnROYW1lOiBcIjJcIixcbiAgICBPcmdhbl9Db2RlOiBcIjJcIixcbiAgICBDaGlsZF9Db3VudDogMFxuICB9LCB7XG4gICAgT3JnYW5fSWQ6IFwiM1wiLFxuICAgIE9yZ2FuX05hbWU6IFwiM09yZ2FuX05hbWVcIixcbiAgICBPcmdhbl9TaG9ydE5hbWU6IFwiM1wiLFxuICAgIE9yZ2FuX0NvZGU6IFwiM1wiLFxuICAgIENoaWxkX0NvdW50OiAwXG4gIH0sIHtcbiAgICBPcmdhbl9JZDogXCI0XCIsXG4gICAgT3JnYW5fTmFtZTogXCI0T3JnYW5fTmFtZVwiLFxuICAgIE9yZ2FuX1Nob3J0TmFtZTogXCI0XCIsXG4gICAgT3JnYW5fQ29kZTogXCI0XCIsXG4gICAgQ2hpbGRfQ291bnQ6IDBcbiAgfV1cbn07XG52YXIgVHJlZVRhYmxlSnNvbkRhdGFMaXN0ID0gW3tcbiAgT3JnYW5fSWQ6IFwiMFwiLFxuICBPcmdhbl9OYW1lOiBcInJvb3RcIixcbiAgT3JnYW5fU2hvcnROYW1lOiBcIjJcIixcbiAgT3JnYW5fQ29kZTogXCIyXCIsXG4gIENoaWxkX0NvdW50OiAyXG59LCB7XG4gIE9yZ2FuX0lkOiBcIjFcIixcbiAgT3JnYW5fTmFtZTogXCIxT3JnYW5fTmFtZVwiLFxuICBPcmdhbl9TaG9ydE5hbWU6IFwiMVwiLFxuICBPcmdhbl9Db2RlOiBcIjFcIixcbiAgQ2hpbGRfQ291bnQ6IDIsXG4gIFBhcmVudF9JZDogXCIwXCJcbn0sIHtcbiAgT3JnYW5fSWQ6IFwiMlwiLFxuICBPcmdhbl9OYW1lOiBcIjJPcmdhbl9OYW1lXCIsXG4gIE9yZ2FuX1Nob3J0TmFtZTogXCIyXCIsXG4gIE9yZ2FuX0NvZGU6IFwiMlwiLFxuICBDaGlsZF9Db3VudDogMCxcbiAgUGFyZW50X0lkOiBcIjBcIlxufSwge1xuICBPcmdhbl9JZDogXCIxLTFcIixcbiAgT3JnYW5fTmFtZTogXCIxLTFPcmdhbl9OYW1lXCIsXG4gIE9yZ2FuX1Nob3J0TmFtZTogXCIxLTFcIixcbiAgT3JnYW5fQ29kZTogXCIxLTFcIixcbiAgQ2hpbGRfQ291bnQ6IDEsXG4gIFBhcmVudF9JZDogXCIxXCJcbn0sIHtcbiAgT3JnYW5fSWQ6IFwiMS0yXCIsXG4gIE9yZ2FuX05hbWU6IFwiMS0yT3JnYW5fTmFtZVwiLFxuICBPcmdhbl9TaG9ydE5hbWU6IFwiMS0yXCIsXG4gIE9yZ2FuX0NvZGU6IFwiMS0yXCIsXG4gIENoaWxkX0NvdW50OiAwLFxuICBQYXJlbnRfSWQ6IFwiMVwiXG59LCB7XG4gIE9yZ2FuX0lkOiBcIjEtMS0xXCIsXG4gIE9yZ2FuX05hbWU6IFwiMS0xLTFPcmdhbl9OYW1lXCIsXG4gIE9yZ2FuX1Nob3J0TmFtZTogXCIxLTEtMVwiLFxuICBPcmdhbl9Db2RlOiBcIjEtMVwiLFxuICBDaGlsZF9Db3VudDogMCxcbiAgUGFyZW50X0lkOiBcIjEtMVwiXG59XTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFRyZWVUYWJsZSA9IHtcbiAgXyRQcm9wX1RhYmxlRWxlbTogbnVsbCxcbiAgXyRQcm9wX1JlbmRlcmVyVG9FbGVtOiBudWxsLFxuICBfUHJvcF9Db25maWc6IG51bGwsXG4gIF9Qcm9wX0pzb25EYXRhOiBudWxsLFxuICBfUHJvcF9BdXRvT3BlbkxldmVsOiAwLFxuICBfUHJvcF9GaXJzdENvbHVtbl9JbmRlbjogMjAsXG4gIF9Qcm9wX0N1cnJlbnRTZWxlY3RlZFJvd0lkOiBudWxsLFxuICBJbml0aWFsaXphdGlvbjogZnVuY3Rpb24gSW5pdGlhbGl6YXRpb24oX2NvbmZpZykge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnID0gX2NvbmZpZztcbiAgICB0aGlzLl8kUHJvcF9SZW5kZXJlclRvRWxlbSA9ICQoXCIjXCIgKyB0aGlzLl9Qcm9wX0NvbmZpZy5SZW5kZXJlclRvKTtcbiAgICB0aGlzLl8kUHJvcF9UYWJsZUVsZW0gPSB0aGlzLkNyZWF0ZVRhYmxlKCk7XG5cbiAgICB0aGlzLl8kUHJvcF9UYWJsZUVsZW0uYXBwZW5kKHRoaXMuQ3JlYXRlVGFibGVUaXRsZVJvdygpKTtcblxuICAgIHRoaXMuXyRQcm9wX1JlbmRlcmVyVG9FbGVtLmFwcGVuZCh0aGlzLl8kUHJvcF9UYWJsZUVsZW0pO1xuICB9LFxuICBMb2FkSnNvbkRhdGE6IGZ1bmN0aW9uIExvYWRKc29uRGF0YShqc29uRGF0YXMpIHtcbiAgICBpZiAoanNvbkRhdGFzICE9IG51bGwgJiYganNvbkRhdGFzICE9IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fUHJvcF9Kc29uRGF0YSA9IGpzb25EYXRhcztcbiAgICAgIHRoaXMuX1Byb3BfQXV0b09wZW5MZXZlbCA9IHRoaXMuX1Byb3BfQ29uZmlnLk9wZW5MZXZlbDtcblxuICAgICAgdmFyIHJvd0lkID0gdGhpcy5fR2V0Um93RGF0YUlkKGpzb25EYXRhcyk7XG5cbiAgICAgIHRoaXMuX0NyZWF0ZVJvb3RSb3coanNvbkRhdGFzLCByb3dJZCk7XG5cbiAgICAgIHRoaXMuX0xvb3BDcmVhdGVSb3coanNvbkRhdGFzLCBqc29uRGF0YXMuTm9kZXMsIDEsIHJvd0lkKTtcblxuICAgICAgdGhpcy5SZW5kZXJlclN0eWxlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFsZXJ0KFwiSnNvbiBEYXRhIE9iamVjdCBFcnJvclwiKTtcbiAgICB9XG4gIH0sXG4gIF9DcmVhdGVSb290Um93OiBmdW5jdGlvbiBfQ3JlYXRlUm9vdFJvdyhwYXJlbnRqc29uTm9kZSwgcGFyZW50SWRMaXN0KSB7XG4gICAgdmFyIHJvd0VsZW0gPSB0aGlzLkNyZWF0ZVJvd0VsZW0ocGFyZW50anNvbk5vZGUsIDAsIG51bGwsIHRydWUsIHBhcmVudElkTGlzdCk7XG5cbiAgICB0aGlzLl8kUHJvcF9UYWJsZUVsZW0uYXBwZW5kKHJvd0VsZW0pO1xuXG4gICAgdGhpcy5TZXRKc29uRGF0YUV4dGVuZEF0dHJfQ3VycmVudExldmVsKHBhcmVudGpzb25Ob2RlLCAwKTtcbiAgICB0aGlzLlNldEpzb25EYXRhRXh0ZW5kQXR0cl9QYXJlbnRJZExpc3QocGFyZW50anNvbk5vZGUsIHBhcmVudElkTGlzdCk7XG4gIH0sXG4gIF9Mb29wQ3JlYXRlUm93OiBmdW5jdGlvbiBfTG9vcENyZWF0ZVJvdyhwYXJlbnRqc29uTm9kZSwganNvbk5vZGVBcnJheSwgY3VycmVudExldmVsLCBwYXJlbnRJZExpc3QpIHtcbiAgICB0aGlzLl9Qcm9wX0NvbmZpZy5Jc09wZW5BTEw7XG5cbiAgICBpZiAoanNvbk5vZGVBcnJheSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwganNvbk5vZGVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IGpzb25Ob2RlQXJyYXlbaV07XG5cbiAgICAgICAgdmFyIHJvd0lzT3BlbiA9IHRoaXMuX1Rlc3RSb3dJc09wZW4oY3VycmVudExldmVsKTtcblxuICAgICAgICB2YXIgcm93SWQgPSB0aGlzLl9HZXRSb3dEYXRhSWQoaXRlbSk7XG5cbiAgICAgICAgdmFyIF9wSWRMaXN0ID0gdGhpcy5fQ3JlYXRlUGFyZW50SWRMaXN0KHBhcmVudElkTGlzdCwgcm93SWQpO1xuXG4gICAgICAgIHRoaXMuU2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbChpdGVtLCBjdXJyZW50TGV2ZWwpO1xuICAgICAgICB0aGlzLlNldEpzb25EYXRhRXh0ZW5kQXR0cl9QYXJlbnRJZExpc3QoaXRlbSwgX3BJZExpc3QpO1xuICAgICAgICB2YXIgcm93RWxlbSA9IHRoaXMuQ3JlYXRlUm93RWxlbShpdGVtLCBjdXJyZW50TGV2ZWwsIHBhcmVudGpzb25Ob2RlLCByb3dJc09wZW4sIF9wSWRMaXN0KTtcblxuICAgICAgICB0aGlzLl8kUHJvcF9UYWJsZUVsZW0uYXBwZW5kKHJvd0VsZW0pO1xuXG4gICAgICAgIGlmIChpdGVtLk5vZGVzICE9IHVuZGVmaW5lZCAmJiBpdGVtLk5vZGVzICE9IG51bGwgJiYgaXRlbS5Ob2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdmFyIF90cCA9IGN1cnJlbnRMZXZlbCArIDE7XG5cbiAgICAgICAgICB0aGlzLl9Mb29wQ3JlYXRlUm93KGl0ZW0sIGl0ZW0uTm9kZXMsIF90cCwgX3BJZExpc3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBDcmVhdGVUYWJsZTogZnVuY3Rpb24gQ3JlYXRlVGFibGUoKSB7XG4gICAgdmFyIF9DID0gdGhpcy5fUHJvcF9Db25maWc7XG5cbiAgICB2YXIgX2VkaXRUYWJsZSA9ICQoXCI8dGFibGUgLz5cIik7XG5cbiAgICBfZWRpdFRhYmxlLmFkZENsYXNzKF9DLlRhYmxlQ2xhc3MpO1xuXG4gICAgX2VkaXRUYWJsZS5hdHRyKFwiSWRcIiwgX0MuVGFibGVJZCk7XG5cbiAgICBfZWRpdFRhYmxlLmF0dHIoX0MuVGFibGVBdHRycyk7XG5cbiAgICByZXR1cm4gX2VkaXRUYWJsZTtcbiAgfSxcbiAgU2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbDogZnVuY3Rpb24gU2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbChqc29uRGF0YSwgdmFsdWUpIHtcbiAgICBqc29uRGF0YS5fRXh0ZW5kX0N1cnJlbnRMZXZlbCA9IHZhbHVlO1xuICB9LFxuICBHZXRKc29uRGF0YUV4dGVuZEF0dHJfQ3VycmVudExldmVsOiBmdW5jdGlvbiBHZXRKc29uRGF0YUV4dGVuZEF0dHJfQ3VycmVudExldmVsKGpzb25EYXRhKSB7XG4gICAgcmV0dXJuIGpzb25EYXRhLl9FeHRlbmRfQ3VycmVudExldmVsO1xuICB9LFxuICBTZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0OiBmdW5jdGlvbiBTZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0KGpzb25EYXRhLCB2YWx1ZSkge1xuICAgIGpzb25EYXRhLl9FeHRlbmRfUGFyZW50SWRMaXN0ID0gdmFsdWU7XG4gIH0sXG4gIEdldEpzb25EYXRhRXh0ZW5kQXR0cl9QYXJlbnRJZExpc3Q6IGZ1bmN0aW9uIEdldEpzb25EYXRhRXh0ZW5kQXR0cl9QYXJlbnRJZExpc3QoanNvbkRhdGEpIHtcbiAgICByZXR1cm4ganNvbkRhdGEuX0V4dGVuZF9QYXJlbnRJZExpc3Q7XG4gIH0sXG4gIENyZWF0ZVRhYmxlVGl0bGVSb3c6IGZ1bmN0aW9uIENyZWF0ZVRhYmxlVGl0bGVSb3coKSB7XG4gICAgdmFyIF9DID0gdGhpcy5fUHJvcF9Db25maWc7XG5cbiAgICB2YXIgX3RoZWFkID0gJChcIjx0aGVhZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBpc0hlYWRlcj0ndHJ1ZScgLz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cIik7XG5cbiAgICB2YXIgX3RpdGxlUm93ID0gX3RoZWFkLmZpbmQoXCJ0clwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX0MuVGVtcGxhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBfQy5UZW1wbGF0ZXNbaV07XG4gICAgICB2YXIgdGl0bGUgPSB0ZW1wbGF0ZS5UaXRsZTtcbiAgICAgIHZhciB0aCA9ICQoXCI8dGg+XCIgKyB0aXRsZSArIFwiPC90aD5cIik7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZS5UaXRsZUNlbGxDbGFzc05hbWUpIHtcbiAgICAgICAgdGguYWRkQ2xhc3ModGVtcGxhdGUuVGl0bGVDZWxsQ2xhc3NOYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRlbXBsYXRlLlRpdGxlQ2VsbEF0dHJzKSB7XG4gICAgICAgIHRoLmF0dHIodGVtcGxhdGUuVGl0bGVDZWxsQXR0cnMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkhpZGRlbiAhPSAndW5kZWZpbmVkJyAmJiB0ZW1wbGF0ZS5IaWRkZW4gPT0gdHJ1ZSkge1xuICAgICAgICB0aC5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ZW1wbGF0ZS5TdHlsZSkge1xuICAgICAgICB0aC5jc3ModGVtcGxhdGUuU3R5bGUpO1xuICAgICAgfVxuXG4gICAgICBfdGl0bGVSb3cuYXBwZW5kKHRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3RoZWFkO1xuICB9LFxuICBDcmVhdGVSb3dFbGVtOiBmdW5jdGlvbiBDcmVhdGVSb3dFbGVtKHJvd0RhdGEsIGN1cnJlbnRMZXZlbCwgcGFyZW50Um93RGF0YSwgcm93SXNPcGVuLCBwYXJlbnRJZExpc3QpIHtcbiAgICB2YXIgX2MgPSB0aGlzLl9Qcm9wX0NvbmZpZztcbiAgICB2YXIgJHRyID0gJChcIjx0ciAvPlwiKTtcblxuICAgIHZhciBlbGVtSWQgPSB0aGlzLl9DcmVhdGVFbGVtSWQocm93RGF0YSk7XG5cbiAgICB2YXIgcm93SWQgPSB0aGlzLl9HZXRSb3dEYXRhSWQocm93RGF0YSk7XG5cbiAgICB2YXIgcHJvd0lkID0gdGhpcy5fQ3JlYXRlUGFyZW50Um93SWQocGFyZW50Um93RGF0YSk7XG5cbiAgICAkdHIuYXR0cihcInJvd0lkXCIsIHJvd0lkKS5hdHRyKFwicGlkXCIsIHByb3dJZCkuYXR0cihcImlkXCIsIGVsZW1JZCkuYXR0cihcImN1cnJlbnRMZXZlbFwiLCBjdXJyZW50TGV2ZWwpLmF0dHIoXCJpc2RhdGFyb3dcIiwgXCJ0cnVlXCIpO1xuICAgIHZhciBfdGVzdGZpZWxkID0gX2MuQ2hpbGRUZXN0RmllbGQ7XG4gICAgdmFyIGhhc0NoaWxkID0gcm93RGF0YVtfdGVzdGZpZWxkXTtcblxuICAgIGlmIChoYXNDaGlsZCA9PSB0cnVlIHx8IGhhc0NoaWxkID09IFwidHJ1ZVwiIHx8IGhhc0NoaWxkID4gMCkge1xuICAgICAgJHRyLmF0dHIoXCJoYXNDaGlsZFwiLCBcInRydWVcIik7XG4gICAgfVxuXG4gICAgJHRyLmF0dHIoXCJyb3dJc09wZW5cIiwgcm93SXNPcGVuKS5hdHRyKFwicGFyZW50SWRMaXN0XCIsIHBhcmVudElkTGlzdCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9jLlRlbXBsYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIF9jYyA9IF9jLlRlbXBsYXRlc1tpXTtcbiAgICAgIHZhciBfY2QgPSByb3dEYXRhW19jYy5GaWVsZE5hbWVdO1xuICAgICAgdmFyIF93aWR0aCA9IF9jYy5XaWR0aDtcbiAgICAgIHZhciBfcmVuZGVyZXIgPSBfY2MuUmVuZGVyZXI7XG4gICAgICB2YXIgJHRkID0gJChcIjx0ZCBiaW5kRmllbGQ9XFxcIlwiICsgX2NjLkZpZWxkTmFtZSArIFwiXFxcIiBSZW5kZXJlcj0nXCIgKyBfcmVuZGVyZXIgKyBcIic+XCIgKyBfY2QgKyBcIjwvdGQ+XCIpLmNzcyhcIndpZHRoXCIsIF93aWR0aCk7XG5cbiAgICAgIGlmIChfcmVuZGVyZXIgPT0gXCJEYXRlVGltZVwiKSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoX2NkKTtcbiAgICAgICAgdmFyIGRhdGVTdHIgPSBEYXRlVXRpbGl0eS5Gb3JtYXQoZGF0ZSwgJ3l5eXktTU0tZGQnKTtcbiAgICAgICAgJHRkLnRleHQoZGF0ZVN0cik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIV9jZCkge1xuICAgICAgICAgICR0ZC50ZXh0KFwiXCIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChfY2MuVGV4dEFsaWduKSB7XG4gICAgICAgICR0ZC5jc3MoXCJ0ZXh0QWxpZ25cIiwgX2NjLlRleHRBbGlnbik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpID09IDApIHt9XG5cbiAgICAgIGlmICh0eXBlb2YgX2NjLkhpZGRlbiAhPSAndW5kZWZpbmVkJyAmJiBfY2MuSGlkZGVuID09IHRydWUpIHtcbiAgICAgICAgJHRkLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBfY2MuU3R5bGUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgJHRkLmNzcyhfY2MuU3R5bGUpO1xuICAgICAgfVxuXG4gICAgICAkdHIuYXBwZW5kKCR0ZCk7XG4gICAgfVxuXG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICR0ci5iaW5kKFwiY2xpY2tcIiwgbnVsbCwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAkKFwiLnRyLXNlbGVjdGVkXCIpLnJlbW92ZUNsYXNzKFwidHItc2VsZWN0ZWRcIik7XG4gICAgICAkKHRoaXMpLmFkZENsYXNzKFwidHItc2VsZWN0ZWRcIik7XG4gICAgICBfc2VsZi5fUHJvcF9DdXJyZW50U2VsZWN0ZWRSb3dJZCA9ICQodGhpcykuYXR0cihcInJvd0lkXCIpO1xuXG4gICAgICBpZiAodHlwZW9mIF9jLkNsaWNrUm93RXZlbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBfYy5DbGlja1Jvd0V2ZW50ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgX2MuQ2xpY2tSb3dFdmVudChyb3dJZCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgJHRyLmhvdmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcyhcInRyLXNlbGVjdGVkXCIpKSB7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJ0ci1ob3ZlclwiKTtcbiAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAkKFwiLnRyLWhvdmVyXCIpLnJlbW92ZUNsYXNzKFwidHItaG92ZXJcIik7XG4gICAgfSk7XG4gICAgcmV0dXJuICR0cjtcbiAgfSxcbiAgX1Rlc3RSb3dJc09wZW46IGZ1bmN0aW9uIF9UZXN0Um93SXNPcGVuKGN1cnJlbnRMZXZlbCkge1xuICAgIGlmICh0aGlzLl9Qcm9wX0NvbmZpZy5PcGVuTGV2ZWwgPiBjdXJyZW50TGV2ZWwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgX0NyZWF0ZUVsZW1JZDogZnVuY3Rpb24gX0NyZWF0ZUVsZW1JZChyb3dEYXRhKSB7XG4gICAgdmFyIHJvd0lkUHJlZml4ID0gXCJcIjtcblxuICAgIGlmICh0aGlzLl9Qcm9wX0NvbmZpZy5Sb3dJZFByZWZpeCAhPSB1bmRlZmluZWQgJiYgdGhpcy5fUHJvcF9Db25maWcuUm93SWRQcmVmaXggIT0gdW5kZWZpbmVkICE9IG51bGwpIHtcbiAgICAgIHJvd0lkUHJlZml4ID0gdGhpcy5fUHJvcF9Db25maWcuUm93SWRQcmVmaXg7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJvd0lkUHJlZml4ICsgdGhpcy5fR2V0Um93RGF0YUlkKHJvd0RhdGEpO1xuICB9LFxuICBfQ3JlYXRlUGFyZW50SWRMaXN0OiBmdW5jdGlvbiBfQ3JlYXRlUGFyZW50SWRMaXN0KHBhcmVudElkTGlzdCwgcm93SWQpIHtcbiAgICByZXR1cm4gcGFyZW50SWRMaXN0ICsgXCLigLtcIiArIHJvd0lkO1xuICB9LFxuICBfQ3JlYXRlUGFyZW50SWRMaXN0QnlQYXJlbnRKc29uRGF0YTogZnVuY3Rpb24gX0NyZWF0ZVBhcmVudElkTGlzdEJ5UGFyZW50SnNvbkRhdGEocGFyZW50SnNvbkRhdGEsIHNlbGZKc29uRGF0YSkge1xuICAgIHZhciBwYXJlbnRJZExpc3QgPSB0aGlzLkdldEpzb25EYXRhRXh0ZW5kQXR0cl9QYXJlbnRJZExpc3QocGFyZW50SnNvbkRhdGEpO1xuXG4gICAgdmFyIHJvd0lkID0gdGhpcy5fR2V0Um93RGF0YUlkKHNlbGZKc29uRGF0YSk7XG5cbiAgICByZXR1cm4gdGhpcy5fQ3JlYXRlUGFyZW50SWRMaXN0KHBhcmVudElkTGlzdCwgcm93SWQpO1xuICB9LFxuICBfR2V0Um93RGF0YUlkOiBmdW5jdGlvbiBfR2V0Um93RGF0YUlkKHJvd0RhdGEpIHtcbiAgICB2YXIgaWRGaWVsZCA9IHRoaXMuX1Byb3BfQ29uZmlnLklkRmllbGQ7XG5cbiAgICBpZiAocm93RGF0YVtpZEZpZWxkXSAhPSB1bmRlZmluZWQgJiYgcm93RGF0YVtpZEZpZWxkXSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gcm93RGF0YVtpZEZpZWxkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxlcnQoXCLlnKjmlbDmja7mupDkuK3mib7kuI3liLDnlKjkuo7mnoTlu7pJZOeahOWtl+aute+8jOivt+ajgOafpemFjee9ruWPiuaVsOaNrua6kFwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSxcbiAgX0NyZWF0ZVBhcmVudFJvd0lkOiBmdW5jdGlvbiBfQ3JlYXRlUGFyZW50Um93SWQocGFyZW50Um93RGF0YSkge1xuICAgIGlmIChwYXJlbnRSb3dEYXRhID09IG51bGwpIHtcbiAgICAgIHJldHVybiBcIlJvb3RcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX0dldFJvd0RhdGFJZChwYXJlbnRSb3dEYXRhKTtcbiAgICB9XG4gIH0sXG4gIFJlbmRlcmVyU3R5bGU6IGZ1bmN0aW9uIFJlbmRlcmVyU3R5bGUoKSB7XG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICQoXCJ0cltpc2RhdGFyb3c9J3RydWUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdHIgPSAkKHRoaXMpO1xuICAgICAgdmFyICRmaXJzdHRkID0gJCh0aGlzKS5maW5kKFwidGQ6Zmlyc3RcIik7XG4gICAgICB2YXIgcm93aWQgPSAkdHIuYXR0cihcInJvd0lkXCIpO1xuICAgICAgdmFyIHNvdXJjZVRleHQgPSAkZmlyc3R0ZC50ZXh0KCk7XG4gICAgICAkZmlyc3R0ZC5jc3MoXCJwYWRkaW5nLWxlZnRcIiwgX3NlbGYuX1Byb3BfRmlyc3RDb2x1bW5fSW5kZW4gKiBwYXJzZUludCgkKHRoaXMpLmF0dHIoXCJjdXJyZW50TGV2ZWxcIikpKTtcbiAgICAgIHZhciBoYXNDaGlsZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoJHRyLmF0dHIoXCJoYXNDaGlsZFwiKSA9PSBcInRydWVcIikge1xuICAgICAgICBoYXNDaGlsZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHZhciByb3dJc09wZW4gPSBmYWxzZTtcblxuICAgICAgaWYgKCR0ci5hdHRyKFwicm93SXNPcGVuXCIpID09IFwidHJ1ZVwiKSB7XG4gICAgICAgIHJvd0lzT3BlbiA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBzd2l0Y2hFbGVtID0gX3NlbGYuX0NyZWF0ZVJvd1N3aXRjaEVsZW0oaGFzQ2hpbGQsIHJvd0lzT3Blbiwgcm93aWQpO1xuXG4gICAgICAkZmlyc3R0ZC5odG1sKFwiXCIpO1xuICAgICAgJGZpcnN0dGQuYXBwZW5kKHN3aXRjaEVsZW0pLmFwcGVuZChcIjxzcGFuPlwiICsgc291cmNlVGV4dCArIFwiPC9zcGFuPlwiKTtcblxuICAgICAgaWYgKCFyb3dJc09wZW4pIHtcbiAgICAgICAgJChcInRyW3BpZD0nXCIgKyByb3dpZCArIFwiJ11cIikuaGlkZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBfR2V0SW5kZW5DbGFzczogZnVuY3Rpb24gX0dldEluZGVuQ2xhc3MoaGFzQ2hpbGQsIGlzT3Blbikge1xuICAgIGlmIChoYXNDaGlsZCAmJiBpc09wZW4pIHtcbiAgICAgIHJldHVybiBcImltZy1zd2l0Y2gtb3BlblwiO1xuICAgIH1cblxuICAgIGlmIChoYXNDaGlsZCAmJiAhaXNPcGVuKSB7XG4gICAgICByZXR1cm4gXCJpbWctc3dpdGNoLWNsb3NlXCI7XG4gICAgfVxuXG4gICAgaWYgKCFoYXNDaGlsZCkge1xuICAgICAgcmV0dXJuIFwiaW1nLXN3aXRjaC1vcGVuXCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiaW1nLXN3aXRjaC1jbG9zZVwiO1xuICB9LFxuICBfQ3JlYXRlUm93U3dpdGNoRWxlbTogZnVuY3Rpb24gX0NyZWF0ZVJvd1N3aXRjaEVsZW0oaGFzQ2hpbGQsIGlzT3Blbiwgcm93SWQpIHtcbiAgICB2YXIgZWxlbSA9ICQoXCI8ZGl2IGlzc3dpdGNoPVxcXCJ0cnVlXFxcIj48L2Rpdj5cIik7XG5cbiAgICB2YXIgY2xzID0gdGhpcy5fR2V0SW5kZW5DbGFzcyhoYXNDaGlsZCwgaXNPcGVuKTtcblxuICAgIGVsZW0uYWRkQ2xhc3MoY2xzKTtcbiAgICB2YXIgc2VuZGRhdGEgPSB7XG4gICAgICBSb3dJZDogcm93SWRcbiAgICB9O1xuICAgIGVsZW0uYmluZChcImNsaWNrXCIsIHNlbmRkYXRhLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmICghaGFzQ2hpbGQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgJHRyID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKTtcbiAgICAgIHZhciByb3dpZCA9ICR0ci5hdHRyKFwicm93SWRcIik7XG4gICAgICB2YXIgcm93SXNPcGVuID0gZmFsc2U7XG5cbiAgICAgIGlmICgkdHIuYXR0cihcInJvd0lzT3BlblwiKSA9PSBcInRydWVcIikge1xuICAgICAgICByb3dJc09wZW4gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocm93SXNPcGVuKSB7XG4gICAgICAgIHJvd0lzT3BlbiA9IGZhbHNlO1xuICAgICAgICAkKFwidHJbcGFyZW50SWRMaXN0Kj0nXCIgKyByb3dpZCArIFwi4oC7J11cIikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKFwiaW1nLXN3aXRjaC1vcGVuXCIpLmFkZENsYXNzKFwiaW1nLXN3aXRjaC1jbG9zZVwiKTtcbiAgICAgICAgJChcInRyW3BhcmVudElkTGlzdCo9J1wiICsgcm93aWQgKyBcIuKAuyddW2hhc2NoaWxkPSd0cnVlJ11cIikuZmluZChcIltpc3N3aXRjaD0ndHJ1ZSddXCIpLnJlbW92ZUNsYXNzKFwiaW1nLXN3aXRjaC1vcGVuXCIpLmFkZENsYXNzKFwiaW1nLXN3aXRjaC1jbG9zZVwiKTtcbiAgICAgICAgJChcInRyW3BhcmVudElkTGlzdCo9J1wiICsgcm93aWQgKyBcIuKAuyddW2hhc2NoaWxkPSd0cnVlJ11cIikuYXR0cihcInJvd2lzb3BlblwiLCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByb3dJc09wZW4gPSB0cnVlO1xuICAgICAgICAkKFwidHJbcGlkPSdcIiArIHJvd2lkICsgXCInXVwiKS5zaG93KCk7XG4gICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoXCJpbWctc3dpdGNoLWNsb3NlXCIpLmFkZENsYXNzKFwiaW1nLXN3aXRjaC1vcGVuXCIpO1xuICAgICAgfVxuXG4gICAgICAkdHIuYXR0cihcInJvd0lzT3BlblwiLCByb3dJc09wZW4pO1xuICAgIH0pO1xuICAgIHJldHVybiBlbGVtO1xuICB9LFxuICBHZXRDaGlsZHNSb3dFbGVtOiBmdW5jdGlvbiBHZXRDaGlsZHNSb3dFbGVtKGxvb3AsIGlkKSB7XG4gICAgaWYgKGxvb3ApIHtcbiAgICAgIHJldHVybiAkKFwidHJbcGFyZW50SWRMaXN0Kj0nXCIgKyBpZCArIFwiJ11cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAkKFwidHJbcGlkPSdcIiArIGlkICsgXCInXVwiKTtcbiAgICB9XG4gIH0sXG4gIF9Qcm9wX1NlbGVjdGVkUm93RGF0YTogbnVsbCxcbiAgX1Byb3BfVGVtcEdldFJvd0RhdGE6IG51bGwsXG4gIF9HZXRTZWxlY3RlZFJvd0RhdGE6IGZ1bmN0aW9uIF9HZXRTZWxlY3RlZFJvd0RhdGEobm9kZSwgaWQsIGlzU2V0U2VsZWN0ZWQpIHtcbiAgICB2YXIgZmllbGROYW1lID0gdGhpcy5fUHJvcF9Db25maWcuSWRGaWVsZDtcbiAgICB2YXIgZmllbGRWYWx1ZSA9IG5vZGVbZmllbGROYW1lXTtcblxuICAgIGlmIChmaWVsZFZhbHVlID09IGlkKSB7XG4gICAgICBpZiAoaXNTZXRTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLl9Qcm9wX1NlbGVjdGVkUm93RGF0YSA9IG5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9Qcm9wX1RlbXBHZXRSb3dEYXRhID0gbm9kZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG5vZGUuTm9kZXMgIT0gdW5kZWZpbmVkICYmIG5vZGUuTm9kZXMgIT0gbnVsbCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLl9HZXRTZWxlY3RlZFJvd0RhdGEobm9kZS5Ob2Rlc1tpXSwgaWQsIGlzU2V0U2VsZWN0ZWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBHZXRTZWxlY3RlZFJvd0RhdGE6IGZ1bmN0aW9uIEdldFNlbGVjdGVkUm93RGF0YSgpIHtcbiAgICBpZiAodGhpcy5fUHJvcF9DdXJyZW50U2VsZWN0ZWRSb3dJZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl9HZXRTZWxlY3RlZFJvd0RhdGEodGhpcy5fUHJvcF9Kc29uRGF0YSwgdGhpcy5fUHJvcF9DdXJyZW50U2VsZWN0ZWRSb3dJZCwgdHJ1ZSk7XG5cbiAgICByZXR1cm4gdGhpcy5fUHJvcF9TZWxlY3RlZFJvd0RhdGE7XG4gIH0sXG4gIEdldFJvd0RhdGFCeVJvd0lkOiBmdW5jdGlvbiBHZXRSb3dEYXRhQnlSb3dJZChyb3dJZCkge1xuICAgIHRoaXMuX1Byb3BfVGVtcEdldFJvd0RhdGEgPSBudWxsO1xuXG4gICAgdGhpcy5fR2V0U2VsZWN0ZWRSb3dEYXRhKHRoaXMuX1Byb3BfSnNvbkRhdGEsIHJvd0lkLCBmYWxzZSk7XG5cbiAgICByZXR1cm4gdGhpcy5fUHJvcF9UZW1wR2V0Um93RGF0YTtcbiAgfSxcbiAgQXBwZW5kQ2hpbGRSb3dUb0N1cnJlbnRTZWxlY3RlZFJvdzogZnVuY3Rpb24gQXBwZW5kQ2hpbGRSb3dUb0N1cnJlbnRTZWxlY3RlZFJvdyhyb3dEYXRhKSB7XG4gICAgdmFyIHNlbGVjdGVkUm93RGF0YSA9IHRoaXMuR2V0U2VsZWN0ZWRSb3dEYXRhKCk7XG5cbiAgICBpZiAoc2VsZWN0ZWRSb3dEYXRhLk5vZGVzICE9IHVuZGVmaW5lZCAmJiBzZWxlY3RlZFJvd0RhdGEuTm9kZXMgIT0gbnVsbCkge1xuICAgICAgc2VsZWN0ZWRSb3dEYXRhLk5vZGVzLnB1c2gocm93RGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdGVkUm93RGF0YS5Ob2RlcyA9IG5ldyBBcnJheSgpO1xuICAgICAgc2VsZWN0ZWRSb3dEYXRhLk5vZGVzLnB1c2gocm93RGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy5TZXRKc29uRGF0YUV4dGVuZEF0dHJfQ3VycmVudExldmVsKHJvd0RhdGEsIHRoaXMuR2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbChzZWxlY3RlZFJvd0RhdGEpICsgMSk7XG4gICAgdGhpcy5TZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0KHJvd0RhdGEsIHRoaXMuX0NyZWF0ZVBhcmVudElkTGlzdEJ5UGFyZW50SnNvbkRhdGEoc2VsZWN0ZWRSb3dEYXRhLCByb3dEYXRhKSk7XG4gICAgdmFyICR0ciA9IHRoaXMuQ3JlYXRlUm93RWxlbShyb3dEYXRhLCB0aGlzLkdldEpzb25EYXRhRXh0ZW5kQXR0cl9DdXJyZW50TGV2ZWwoc2VsZWN0ZWRSb3dEYXRhKSArIDEsIHNlbGVjdGVkUm93RGF0YSwgdHJ1ZSwgdGhpcy5HZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0KHJvd0RhdGEpKTtcblxuICAgIHZhciBzZWxlY3RlZFJvd0lkID0gdGhpcy5fR2V0Um93RGF0YUlkKHNlbGVjdGVkUm93RGF0YSk7XG5cbiAgICB2YXIgY3VycmVudFNlbGVjdEVsZW0gPSAkKFwidHJbcm93SWQ9J1wiICsgc2VsZWN0ZWRSb3dJZCArIFwiJ11cIik7XG4gICAgY3VycmVudFNlbGVjdEVsZW0uYXR0cihcImhhc2NoaWxkXCIsIFwidHJ1ZVwiKTtcbiAgICB2YXIgbGFzdENoaWxkcyA9ICQoXCJ0cltwYXJlbnRpZGxpc3QqPSdcIiArIHNlbGVjdGVkUm93SWQgKyBcIuKAuyddOmxhc3RcIik7XG5cbiAgICBpZiAobGFzdENoaWxkcy5sZW5ndGggPiAwKSB7XG4gICAgICBsYXN0Q2hpbGRzLmFmdGVyKCR0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRTZWxlY3RFbGVtLmF0dHIoXCJyb3dpc29wZW5cIiwgdHJ1ZSk7XG4gICAgICBjdXJyZW50U2VsZWN0RWxlbS5hZnRlcigkdHIpO1xuICAgIH1cblxuICAgIHRoaXMuUmVuZGVyZXJTdHlsZSgpO1xuICB9LFxuICBVcGRhdGVUb1JvdzogZnVuY3Rpb24gVXBkYXRlVG9Sb3cocm93SWQsIHJvd0RhdGEpIHtcbiAgICB2YXIgc2VsZWN0ZWRSb3dEYXRhID0gdGhpcy5HZXRSb3dEYXRhQnlSb3dJZChyb3dJZCk7XG5cbiAgICBmb3IgKHZhciBhdHRyTmFtZSBpbiByb3dEYXRhKSB7XG4gICAgICBpZiAoYXR0ck5hbWUgIT0gXCJOb2Rlc1wiKSB7XG4gICAgICAgIHNlbGVjdGVkUm93RGF0YVthdHRyTmFtZV0gPSByb3dEYXRhW2F0dHJOYW1lXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcm93SWQgPSB0aGlzLl9HZXRSb3dEYXRhSWQoc2VsZWN0ZWRSb3dEYXRhKTtcblxuICAgIHZhciAkdHIgPSAkKFwidHJbcm93aWQ9J1wiICsgcm93SWQgKyBcIiddXCIpO1xuICAgICR0ci5maW5kKFwidGRcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYmluZEZpZWxkID0gJCh0aGlzKS5hdHRyKFwiYmluZEZpZWxkXCIpO1xuICAgICAgdmFyIG5ld3RleHQgPSBzZWxlY3RlZFJvd0RhdGFbYmluZEZpZWxkXTtcbiAgICAgIHZhciByZW5kZXJlciA9ICQodGhpcykuYXR0cihcIlJlbmRlcmVyXCIpO1xuXG4gICAgICBpZiAocmVuZGVyZXIgPT0gXCJEYXRlVGltZVwiKSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUobmV3dGV4dCk7XG4gICAgICAgIG5ld3RleHQgPSBEYXRlVXRpbGl0eS5Gb3JtYXQoZGF0ZSwgJ3l5eXktTU0tZGQnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCQodGhpcykuZmluZChcIltpc3N3aXRjaD0ndHJ1ZSddXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJCh0aGlzKS5maW5kKFwic3BhblwiKS50ZXh0KG5ld3RleHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCh0aGlzKS50ZXh0KG5ld3RleHQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBMb2FkQ2hpbGRCeUFqYXg6IGZ1bmN0aW9uIExvYWRDaGlsZEJ5QWpheCgpIHt9LFxuICBEZWxldGVSb3c6IGZ1bmN0aW9uIERlbGV0ZVJvdyhyb3dJZCkge1xuICAgIHZhciBoYXNDaGlsZCA9IGZhbHNlO1xuXG4gICAgaWYgKCQoXCJ0cltwaWQ9J1wiICsgcm93SWQgKyBcIiddXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICghdGhpcy5fUHJvcF9Db25maWcuQ2FuRGVsZXRlV2hlbkhhc0NoaWxkKSB7XG4gICAgICAgIGFsZXJ0KFwi5oyH5a6a55qE6IqC54K55a2Y5Zyo5a2Q6IqC54K577yM6K+35YWI5Yig6Zmk5a2Q6IqC54K577yBXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgICQoXCJ0cltwYXJlbnRpZGxpc3QqPSfigLtcIiArIHJvd0lkICsgXCInXVwiKS5yZW1vdmUoKTtcbiAgICB0aGlzLl9Qcm9wX0N1cnJlbnRTZWxlY3RlZFJvd0lkID0gbnVsbDtcbiAgfSxcbiAgTW92ZVVwUm93OiBmdW5jdGlvbiBNb3ZlVXBSb3cocm93SWQpIHtcbiAgICB2YXIgdGhpc3RyID0gJChcInRyW3Jvd2lkPSdcIiArIHJvd0lkICsgXCInXVwiKTtcbiAgICB2YXIgcGlkID0gdGhpc3RyLmF0dHIoXCJwaWRcIik7XG4gICAgdmFyIG5lYXJ0ciA9ICQodGhpc3RyLnByZXZBbGwoXCJbcGlkPSdcIiArIHBpZCArIFwiJ11cIilbMF0pO1xuICAgIHZhciBtb3ZldHJzID0gJChcInRyW3BhcmVudGlkbGlzdCo9J+KAu1wiICsgcm93SWQgKyBcIiddXCIpO1xuICAgIG1vdmV0cnMuaW5zZXJ0QmVmb3JlKG5lYXJ0cik7XG4gIH0sXG4gIE1vdmVEb3duUm93OiBmdW5jdGlvbiBNb3ZlRG93blJvdyhyb3dJZCkge1xuICAgIHZhciB0aGlzdHIgPSAkKFwidHJbcm93aWQ9J1wiICsgcm93SWQgKyBcIiddXCIpO1xuICAgIHZhciBwaWQgPSB0aGlzdHIuYXR0cihcInBpZFwiKTtcbiAgICB2YXIgbmVhcnRyID0gJCh0aGlzdHIubmV4dEFsbChcIltwaWQ9J1wiICsgcGlkICsgXCInXVwiKVswXSk7XG4gICAgdmFyIG5lYXJ0cnJpZCA9IG5lYXJ0ci5hdHRyKFwicm93aWRcIik7XG4gICAgdmFyIG9mZnRycyA9ICQoXCJ0cltwYXJlbnRpZGxpc3QqPSfigLtcIiArIG5lYXJ0cnJpZCArIFwiJ11cIik7XG4gICAgdmFyIG9mZmxhc3R0ciA9ICQob2ZmdHJzW29mZnRycy5sZW5ndGggLSAxXSk7XG4gICAgdmFyIG1vdmV0cnMgPSAkKFwidHJbcGFyZW50aWRsaXN0Kj0n4oC7XCIgKyByb3dJZCArIFwiJ11cIik7XG4gICAgbW92ZXRycy5pbnNlcnRBZnRlcihvZmZsYXN0dHIpO1xuICB9LFxuICBHZXRCcm90aGVyc05vZGVEYXRhc0J5UGFyZW50SWQ6IGZ1bmN0aW9uIEdldEJyb3RoZXJzTm9kZURhdGFzQnlQYXJlbnRJZChyb3dJZCkge1xuICAgIHZhciB0aGlzdHIgPSAkKFwidHJbcm93aWQ9J1wiICsgcm93SWQgKyBcIiddXCIpO1xuICAgIHZhciBwaWQgPSB0aGlzdHIuYXR0cihcInBpZFwiKTtcbiAgICB2YXIgYnJvdGhlcnN0ciA9ICQodGhpc3RyLnBhcmVudCgpLmZpbmQoXCJbcGlkPSdcIiArIHBpZCArIFwiJ11cIikpO1xuICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnJvdGhlcnN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0LnB1c2godGhpcy5HZXRSb3dEYXRhQnlSb3dJZCgkKGJyb3RoZXJzdHJbaV0pLmF0dHIoXCJyb3dpZFwiKSkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIFJlbW92ZUFsbFJvdzogZnVuY3Rpb24gUmVtb3ZlQWxsUm93KCkge1xuICAgIGlmICh0aGlzLl8kUHJvcF9UYWJsZUVsZW0gIT0gbnVsbCkge1xuICAgICAgdGhpcy5fJFByb3BfVGFibGVFbGVtLmZpbmQoXCJ0cjpub3QoOmZpcnN0KVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufTsiXX0=
