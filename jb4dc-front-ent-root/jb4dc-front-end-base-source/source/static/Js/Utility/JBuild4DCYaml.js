var JBuild4DCYaml={
    _clientClientSystemTitle:null,
    GetClientSystemTitle:function () {
        debugger;
        var storeKey="JBuild4DCYaml._clientClientSystemTitle";
        if(LocalStorageUtility.getItemInSessionStorage(storeKey)){
            return LocalStorageUtility.getItemInSessionStorage(storeKey);
        }

        if(!this._clientClientSystemTitle){
            if(!window.parent.JBuild4DCYaml._clientClientSystemTitle){
                AjaxUtility.GetSync("/Rest/JBuild4DCYaml/GetClientSystemTitle",{},function (result) {
                    if(result.success){
                        this._clientClientSystemTitle=result.data;
                        LocalStorageUtility.setItemInSessionStorage(storeKey,this._clientClientSystemTitle);
                    }
                },this);
            }
            else{
                this._clientClientSystemTitle=window.parent.JBuild4DCYaml._clientClientSystemTitle;
            }
        }
        return this._clientClientSystemTitle;
    }
}