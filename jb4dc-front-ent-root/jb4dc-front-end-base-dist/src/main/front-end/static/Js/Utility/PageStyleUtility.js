//页面样式辅助功能类
var PageStyleUtility = {
    //页面高度宽度,如果为iframe,则为iframe的高度宽度
    GetPageHeight: function () {
        return jQuery(window.document).height();
    },
    GetPageWidth: function () {
        return jQuery(window.document).width();
    },
    GetWindowHeight:function () {
        alert("GetWindowHeight:未实现");
        throw "GetWindowHeight:未实现";
        //return $(window).height();
    },
    GetWindowWidth:function () {
        alert("GetWindowWidth:未实现");
        throw "GetWindowWidth:未实现";
        //return $(window).width();
    },
    //分辨率
    GetScreenHeight:function () {
        return screen.height;
    },
    GetScreenWidth:function () {
        return screen.width;
    },
    AutoElemHeight:function(elemSelector,fixHeight) {
        var pageHeight=PageStyleUtility.GetPageHeight();
        var newHeight=pageHeight-fixHeight;
        $(elemSelector).height(newHeight);
    },
    AutoElemHeightInTableLayout:function(elemSelector,tableSelector) {
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
    GetListButtonOuterHeight: function () {
        alert("PageStyleUtility.GetListButtonOuterHeight 已停用");
        return jQuery(".list-button-outer-c").outerHeight();
    }
};