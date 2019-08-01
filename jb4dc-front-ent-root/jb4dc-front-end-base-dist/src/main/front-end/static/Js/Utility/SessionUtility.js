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
    ClearClientSessionStoreSessionUser:function(){

    },
    GetSessionUserSync:function(){
        if(this._currentSessionUser==null){
            if(window.parent.SessionUtility._currentSessionUser!=null){
                return window.parent.SessionUtility._currentSessionUser;
            }
            else{
                AjaxUtility.PostSync("/Rest/Session/User/GetMySessionUser",{},function (result) {
                    if(result.success){
                        SessionUtility._currentSessionUser=result.data;
                    }
                    else{

                    }
                },this);
                return this._currentSessionUser;
            }
        }
        else{
            return this._currentSessionUser;
        }
    },
    GetSessionUser:function (func) {
        if(!this._currentSessionUser){
            AjaxUtility.Get("/Rest/Session/User/GetMySessionUser",{},function (result) {
                if(result.success){
                    //console.log(result.data);
                    //this._currentSessionUser=result.data;
                    //LocalStorageUtility.setItemInSessionStorage(storeKey,JsonUtility.JsonToString(this._currentSessionUser));
                    func(result.data);
                }
            },this);
            /*var storeKey="SessionUtility._currentSessionUser";
            if(LocalStorageUtility.getItemInSessionStorage(storeKey)){
                var storeSessionUserData=LocalStorageUtility.getItemInSessionStorage(storeKey);
                this._currentSessionUser=JsonUtility.StringToJson(storeSessionUserData);
                //return this._currentSessionUser;
            }
            else if(!window.parent.SessionUtility._currentSessionUser){

            }
            else{
                this._currentSessionUser=window.parent.SessionUtility._currentSessionUser;
            }*/
        }
        return this._currentSessionUser;
    }
}