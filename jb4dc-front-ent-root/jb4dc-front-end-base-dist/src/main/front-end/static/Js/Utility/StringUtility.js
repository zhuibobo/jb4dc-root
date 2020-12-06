//字符串操作类
var StringUtility = {
    GuidSplit: function (split) {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            guid += Math.floor(Math.random() * 16.0).toString(16);
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += split;
        }
        return guid;
    },
    Guid: function () {
        return this.GuidSplit("-");
    },
    Timestamp: function () {
        var timestamp = new Date().getTime();
        return timestamp.toString().substr(4, 10);
    },
    Trim: function (str) {
        return str.replace(/(^[　\s]*)|([　\s]*$)/g, "");
    },
    RemoveLastChar: function (str) {
        return str.substring(0, str.length - 1)
    },
    IsNullOrEmptyTrim:function (obj){
        if(obj){
            obj=this.Trim(obj.toString());
        }
        return this.IsNullOrEmpty(obj);
    },
    IsNullOrEmpty: function (obj) {
        return obj == undefined || obj == "" || obj == null || obj == "undefined" || obj == "null"
    },
    IsNotNullOrEmpty:function(obj){
        return !(this.IsNullOrEmpty(obj));
    },
    GetFunctionName: function (func) {
        if (typeof func == "function" || typeof func == "object")
            var fName = ("" + func).match(
                /function\s*([\w\$]*)\s*\(/
            );
        if (fName !== null) return fName[1];
    },
    ToLowerCase: function (str) {
        return str.toLowerCase();
    },
    toUpperCase: function (str) {
        return str.toUpperCase();
    },
    EndWith:function (str,endStr) {
        var d=str.length-endStr.length;
        //alert(str.lastIndexOf(endStr)==d);
        return (d>=0&&str.lastIndexOf(endStr)==d);
    },
    /*GetURLHost:function (url) {
        var origin = /\/\/[\w-.]+(:\d+)?/i.exec(url)[0];
        return origin;
    },*/
    IsSameDomain:function (url1, url2) {
        var origin1 = /\/\/[\w-.]+(:\d+)?/i.exec(url1)[0];

        var open=/\/\/[\w-.]+(:\d+)?/i.exec(url2);
        if(open==null){
            return true;
        }
        else {
            var origin2 = open[0];
            if (origin1 == origin2) {
                return true;
            }
            return false;
        }
    },
    FirstCharLetter:function (str) {
        var str1 = str.replace(str[0],str[0].toLowerCase());
        return str1;
    },
    FirstCharUpper:function (str) {
        var str1 =  str.replace(str[0],str[0].toUpperCase());
        return str1;
    },
    RemoveScript:function (str) {
        return str.replace(/<script.*?>.*?<\/script>/ig, '');
    },
    EncodeHtml:function (str) {
        var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
        //str = (str != undefined) ? str : this.toString();
        return (typeof str != "string") ? str :
            str.replace(REGX_HTML_ENCODE,
                function($0){
                    var c = $0.charCodeAt(0), r = ["&#"];
                    c = (c == 0x20) ? 0xA0 : c;
                    r.push(c); r.push(";");
                    return r.join("");
                });
    },
    DecodeHtml:function (str) {
        var REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;
        var HTML_DECODE = {
            "&lt;" : "<",
            "&gt;" : ">",
            "&amp;" : "&",
            "&nbsp;": " ",
            "&quot;": "\"",
            "©": ""
            // Add more
        };

        return (typeof str != "string") ? str :
            str.replace(REGX_HTML_DECODE,
                function($0, $1){
                    var c = HTML_DECODE[$0];
                    if(c == undefined){
                        // Maybe is Entity Number
                        if(!isNaN($1)){
                            c = String.fromCharCode(($1 == 160) ? 32:$1);
                        }else{
                            c = $0;
                        }
                    }
                    return c;
                });
    },
    GetFileExName:function (fileName) {
        var ext = fileName.substring(fileName.lastIndexOf("."), fileName.length);
        return ext;
    },
    ReplaceSPCharL1:function (source) {
        var reg=/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\、|\^|\$|\!|\~|\`|\|/g;
        var temp = source.replace(reg,"");
        return temp;
    },
    ReplaceSPCharL2:function (source) {
        var reg=/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|,|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g;
        var temp = source.replace(reg,"");
        return temp;
    }
};