var TreeUtility={
    BuildNodePathName:function (treeNode,name,appendText,beginIndex) {
        if(!beginIndex){
            beginIndex=0;
        }
        var ary = [];
        var pathNode = treeNode.getPath();
        for (var i = beginIndex; i < pathNode.length; i++) {
            ary.push(StringUtility.ReplaceSPCharL2(pathNode[i][name]));
        }
        //ary.push(treeNode[name]);
        if(StringUtility.IsNullOrEmpty(appendText)){
            return ary.join("▷▷");
        }
        return ary.join("▷▷")+"▷▷"+StringUtility.ReplaceSPCharL2(appendText);
    }
}