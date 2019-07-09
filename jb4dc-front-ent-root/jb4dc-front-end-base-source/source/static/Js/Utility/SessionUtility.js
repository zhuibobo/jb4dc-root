var SessionUtility={
    _currentSessionUser:null,
    _currentSessionUserMock:{
        organId:"",
        organName:"",
        userId:"",
        userName:"",
        mainDepartmentId:"",
        mainDepartmentName:"",
        accountId:"",
        accountName:""
    },
    GetSessionUser:function () {

        if(!this._currentSessionUser){
            var storeKey="SessionUtility._currentSessionUser";
            if(LocalStorageUtility.getItemInSessionStorage(storeKey)){
                var storeSessionUserData=LocalStorageUtility.getItemInSessionStorage(storeKey);
                this._currentSessionUser=JsonUtility.StringToJson(storeSessionUserData);
                //return this._currentSessionUser;
            }
            else if(!window.parent.SessionUtility._currentSessionUser){
                AjaxUtility.GetSync("/Rest/Session/User/GetMySessionUser",{},function (result) {
                    if(result.success){
                        console.log(result.data);
                        this._currentSessionUser=result.data;
                        LocalStorageUtility.setItemInSessionStorage(storeKey,JsonUtility.JsonToString(this._currentSessionUser));
                    }
                },this);
            }
            else{
                this._currentSessionUser=window.parent.SessionUtility._currentSessionUser;
            }
        }
        return this._currentSessionUser;
    }
}