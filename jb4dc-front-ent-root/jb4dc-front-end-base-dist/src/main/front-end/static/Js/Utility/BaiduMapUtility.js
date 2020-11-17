var BaiduMapUtility= {
    LoadJsCompleted: function (cbFuncName) {
        AjaxUtility.Get("/Rest/Props/SystemProperties/GetBaiduMapJsUrl", {}, function (result) {
            if (result.success) {
                var url = result.data;
                var script = document.createElement("script");
                script.src = url + "&callback=" + cbFuncName;
                document.body.appendChild(script);
            }
        })
    },
    GetLatLngCenter: function (polygonPathArray) {
        var ary=[];
        for (var i = 0; i < polygonPathArray.length; i++) {
            ary.push([polygonPathArray[i].lng,polygonPathArray[i].lat]);
        }
        //console.log(ary);
        var polygon = turf.polygon([ary]);
        var center = turf.center(polygon);
        //console.log(center);
        return {lng:center.geometry.coordinates[0],lat:center.geometry.coordinates[1]};
    }
}