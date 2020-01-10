var ValidateUtility={
    ValidateType:{
        NotEmpty:"",
        Int:"",
        Number:"",
        SimpleCode:"",
        EMail:"",
        Mobile:"",
        GeneralWord:""

    },

    ValidateSingle:function (value,type,caption,message,errorCallBack) {
        var result={
            success:true,
            messageArray:[],
            message:""
        };
        switch (type) {
            case this.ValidateType.NotEmpty:{
                var val = StringUtility.Trim(value);
                if (val == "") {
                    var msg = "【" + caption + "】不能为空！";
                    DialogUtility.AlertError(window,DialogUtility.DialogAlertErrorId,{},msg,null,null);
                    result.success=false;
                    result.message=msg;
                }
            } break;
            case this.ValidateType.SimpleCode:{
                var reg = /^[a-zA-Z0-9_]{0,}$/;
                if (!reg.test(value)) {
                    var msg = "【" + caption + "】请使用英文,数字,或者_！";
                    DialogUtility.AlertError(window,DialogUtility.DialogAlertErrorId,{},msg,null,null);
                    result.success=false;
                    result.message=msg;
                }
            }
        }
        return result;
    }
}