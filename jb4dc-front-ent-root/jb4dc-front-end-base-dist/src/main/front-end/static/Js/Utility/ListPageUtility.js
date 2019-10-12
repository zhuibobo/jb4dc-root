//列表页面处理工具类
var ListPageUtility = {
    DefaultListHeight: function () {
        //alert(PageStyleUtility.GetPageHeight());
        if (PageStyleUtility.GetPageHeight() > 780) {
            return 678;
        } else if (PageStyleUtility.GetPageHeight() > 680) {
            return 578;
        } else {
            return 378;
        }
    },
    DefaultListHeight_50: function () {
        return this.DefaultListHeight() - 50;
    },
    DefaultListHeight_80: function () {
        return this.DefaultListHeight() - 80;
    },
    DefaultListHeight_100: function () {
        return this.DefaultListHeight() - 100;
    },
    GetGeneralPageHeight: function (fixHeight) {
        var pageHeight = jQuery(document).height();
        //alert(pageHeight);
        //alert(pageHeight);
        //debugger;
        if ($("#list-simple-search-wrap").length > 0) {
            //alert($("#list-button-wrap").height()+"||"+$("#list-simple-search-wrap").outerHeight());
            pageHeight = pageHeight - $("#list-simple-search-wrap").outerHeight() + fixHeight - $("#list-button-wrap").outerHeight() - $("#list-pager-wrap").outerHeight() - 30;
        } else {
            pageHeight = pageHeight - $("#list-button-wrap").outerHeight() + fixHeight - ($("#list-pager-wrap").length > 0 ? $("#list-pager-wrap").outerHeight() : 0) - 30;
        }
        //alert(pageHeight);
        return pageHeight;
    },
    GetFixHeight: function () {
        return -70;
    },
    IViewTableRenderer: {
        ToDateYYYY_MM_DD: function (h, datetime) {
            //debugger;
            var date = new Date(datetime);
            var dateStr = DateUtility.Format(date, 'yyyy-MM-dd');
            //var dateStr=datetime.split(" ")[0];
            return h('div', dateStr);
        },
        StringToDateYYYY_MM_DD: function (h, datetime) {
            //debugger;
            //debugger;
            //var date=new Date(datetime);
            //var dateStr=DateUtility.Format(date,'yyyy-MM-dd');
            var dateStr = datetime.split(" ")[0];
            return h('div', dateStr);
        },
        ToStatusEnable: function (h, status) {
            if (status == 0) {
                return h('div', "禁用");
            } else if (status == 1) {
                return h('div', "启用");
            }
        },
        ToYesNoEnable: function (h, status) {
            if (status == 0) {
                return h('div', "否");
            } else if (status == 1) {
                return h('div', "是");
            }
        },
        ToDictionaryText: function (h, dictionaryJson, groupValue, dictionaryValue) {
            //debugger;
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
    IViewTableMareSureSelected: function (selectionRows) {
        if (selectionRows != null && selectionRows.length > 0) {
            return {
                then: function (func) {
                    func(selectionRows);
                }
            }
        } else {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选中需要操作的行!", null);
            return {
                then: function (func) {
                }
            }
        }
    },
    IViewTableMareSureSelectedOne: function (selectionRows,caller) {
        if (selectionRows != null && selectionRows.length > 0 && selectionRows.length == 1) {
            return {
                then: function (func) {
                    if(caller){
                        func.call(caller,selectionRows);
                    }
                    else {
                        func(selectionRows);
                    }
                }
            }
        } else {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选中需要操作的行，每次只能选中一行!", null);
            return {
                then: function (func) {
                }
            }
        }
    },
    IViewChangeServerStatus: function (url, selectionRows, idField, statusName, pageAppObj) {
        var idArray = new Array();
        for (var i = 0; i < selectionRows.length; i++) {
            idArray.push(selectionRows[i][idField]);
        }
        AjaxUtility.Post(url,
            {
                ids: idArray.join(";"),
                status: statusName
            },
            function (result) {
                if (result.success) {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                    });
                    pageAppObj.reloadData();
                } else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                }
            }, pageAppObj
        );
    },
    //上下移动封装
    IViewMoveFace: function (url, selectionRows, idField, type, pageAppObj) {
        this.IViewTableMareSureSelectedOne(selectionRows).then(function (selectionRows) {
            //debugger;
            AjaxUtility.Post(url,
                {
                    recordId: selectionRows[0][idField],
                    type: type
                },
                function (result) {
                    if (result.success) {
                        pageAppObj.reloadData();
                    } else {
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
                    }
                }, pageAppObj
            );
        });
    },
    //改变状态封装
    IViewChangeServerStatusFace: function (url, selectionRows, idField, statusName, pageAppObj) {
        this.IViewTableMareSureSelected(selectionRows).then(function (selectionRows) {
            ListPageUtility.IViewChangeServerStatus(url, selectionRows, idField, statusName, pageAppObj);
        });
    },
    IViewTableDeleteRow: function (url, recordId, pageAppObj) {
        DialogUtility.Confirm(window, "确认要删除当前记录吗？", function () {
            AjaxUtility.Delete(url, {recordId: recordId}, function (result) {
                if (result.success) {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                        pageAppObj.reloadData();
                    }, pageAppObj);
                } else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                    });
                }
            }, pageAppObj);
        }, pageAppObj);
    },

    //列表查询加载
    IViewTableBindDataBySearch: function (_config) {
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
        AjaxUtility.Post(config.url,
            sendData,
            function (result) {
                if (result.success) {
                    if (typeof (config.successFunc) == "function") {
                        config.successFunc.call(config.pageAppObj, result,config.pageAppObj);
                        //successFunc(result,pageAppObj);
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

    IViewTableLoadDataSearch: function (url, pageNum, pageSize, searchCondition, pageAppObj, idField, autoSelectedOldRows, successFunc, loadDict, custParas) {
        alert("ListPageUtility.IViewTableLoadDataSearch方法已经被废弃,请转调IViewTableBindDataBySearch");
        return;
        //var loadDict=false;
        //if(pageNum===1) {
        //    loadDict = true;
        //}
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
        //debugger;
        AjaxUtility.Post(url,
            sendData,
            function (result) {
                if (result.success) {
                    if (typeof (successFunc) == "function") {
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
                } else {
                    //DialogUtility.AlertError(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                }
            }, this, "json");
    },
    IViewTableLoadDataNoSearch: function (url, pageNum, pageSize, pageAppObj, idField, autoSelectedOldRows, successFunc) {
        //debugger;
        alert("ListPageUtility.IViewTableLoadDataSearch方法已经被废弃,请转调IViewTableBindDataBySearch");
        return;
        AjaxUtility.Post(url,
            {
                pageNum: pageNum,
                pageSize: pageSize
            },
            function (result) {
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
                    if (typeof (successFunc) == "function") {
                        successFunc(result, pageAppObj);
                    }
                }
            }, "json");
    },
    IViewTableInnerButton: {
        ViewButton: function (h, params, idField, pageAppObj) {
            return h('Tooltip', {
                props:{
                    content:"查看"
                }
            },[
                h('div',{
                    class: "list-row-button view",
                    on: {
                        click: function () {
                            //debugger;
                            pageAppObj.view(params.row[idField], params);
                        }
                    }
                })
            ]);
        },
        EditButton: function (h, params, idField, pageAppObj) {
            return h('Tooltip', {
                props:{
                    content:"修改"
                }
            },[
                h('div',{
                    class: "list-row-button edit",
                    on: {
                        click: function () {
                            //debugger;
                            pageAppObj.edit(params.row[idField], params);
                        }
                    }
                })
            ]);
        },
        DeleteButton: function (h, params, idField, pageAppObj) {
            return h('Tooltip', {
                props:{
                    content:"删除"
                }
            },[
                h('div',{
                    class: "list-row-button del",
                    on: {
                        click: function () {
                            //debugger;
                            pageAppObj.del(params.row[idField], params);
                        }
                    }
                })
            ]);
        },
        MoveUpButton: function (h, params, idField, pageAppObj) {
            return h('Tooltip', {
                props:{
                    content:"上移"
                }
            },[
                h('div',{
                    class: "list-row-button move-up",
                    on: {
                        click: function () {
                            //debugger;
                            pageAppObj.moveUp(params.row[idField], params);
                        }
                    }
                })
            ]);
        },
        MoveDownButton: function (h, params, idField, pageAppObj) {
            return h('Tooltip', {
                props:{
                    content:"下移"
                }
            },[
                h('div',{
                    class: "list-row-button move-down",
                    on: {
                        click: function () {
                            //debugger;
                            pageAppObj.moveDown(params.row[idField], params);
                        }
                    }
                })
            ]);
        },
        SelectedButton: function (h, params, idField, pageAppObj,clickEvent) {
            return h('Tooltip', {
                props:{
                    content:"选择"
                }
            },[
                h('div',{
                    class: "list-row-button selected",
                    on: {
                        click: function () {
                            if(typeof(clickEvent)=="function"){
                                clickEvent(params.row[idField], params);
                            }
                            else{
                                pageAppObj.selected(params.row[idField], params);
                            }
                        }
                    }
                })
            ]);
        }
    }
}