var LocalStorageUtility={
    isSupport:function(){
        if (typeof(Storage) !== "undefined") {
            return true;
        } else {
            return false;
        }
    },
    setItem:function (key, value) {
        if (this.isSupport()) {
            localStorage.setItem(key, value);
        }
    },
    getItem:function (key) {
        if (this.isSupport()) {
            return localStorage.getItem(key);
        }
        return null;
    },
    setItemInSessionStorage:function (key, value) {
        if (this.isSupport()) {
            sessionStorage.setItem(key, value);
        }
    },
    getItemInSessionStorage:function (key) {
        if (this.isSupport()) {
            return sessionStorage.getItem(key);
        }
        return null;
    }
}