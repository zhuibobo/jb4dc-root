var TreeUtility={
    BuildNodePathName:function (treeNode,name,appendText) {
        var ary = [];
        var pathNode = treeNode.getPath();
        for (var i = 0; i < pathNode.length; i++) {
            ary.push(pathNode[i][name]);
        }
        //ary.push(treeNode[name]);
        return ary.join("-->")+"-->"+appendText;
    }
}