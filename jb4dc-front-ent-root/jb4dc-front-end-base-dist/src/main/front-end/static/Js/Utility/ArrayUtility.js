var ArrayUtility = {
    Delete:function (ary, index) {
        ary.splice(index, 1);
    },
    SwapItems:function (ary,index1, index2) {
        //debugger;
        ary[index1] = ary.splice(index2, 1, ary[index1])[0];
        return ary;
    },
    MoveUp:function(arr, $index) {
        if($index == 0) {
            return;
        }
        this.SwapItems(arr, $index, $index - 1);
    },
    MoveDown:function(arr, $index) {
        if($index == arr.length -1) {
            return;
        }
        this.SwapItems(arr, $index, $index + 1);
    },
    Unique:function(arr){
        var n = []; //一个新的临时数组
        //遍历当前数组
        for(var i = 0; i < arr.length; i++){
            //如果当前数组的第i已经保存进了临时数组，那么跳过，
            //否则把当前项push到临时数组里面
            if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
        }
        return n;
    },
    Exist:function (arr,condition) {
        for(var i=0;i<arr.length;i++){
            if(condition(arr[i])){
                return true;
            }
        }
        return false;
    },
    PushWhenNotExist:function (arr,item,condition) {
        if(!this.Exist(condition)){
            arr.push(item);
        }
        return arr;
    },
    Where:function (arr, condition) {
        var result=[];
        for (var i = 0; i < arr.length; i++) {
            if(condition(arr[i])){
                result.push(arr[i]);
            }
        }
        return result;
    },
    WhereSingle:function (arr,condition) {
        var temp = this.Where(arr, condition);
        if(temp.length==0){
            return null;
        }
        return temp[0];
    },
    Push:function (source, append) {
        //debugger;
        if(Array.isArray(append) ){
            for (let i = 0; i < append.length; i++) {
                source.push(append[i]);
            }
        }
        else
        {
            source.push(append);
        }
    },
    True:function (source,condition) {
        for (var i = 0; i < source.length; i++) {
            if(condition(source[i])){
                return true;
            }
        }
        return false;
    }
}