package com.jb4dc.files.dao;


import com.jb4dc.base.dbaccess.dao.BaseMapper;
import com.jb4dc.files.dbentities.FileInfoEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface FileInfoMapper extends BaseMapper<FileInfoEntity> {
    int selectMaxVersion(@Param("objId") String objId,@Param("objName")  String objName);

    FileInfoEntity selectVersionFileInfo(@Param("objId") String objId,@Param("objName")  String objName,@Param("version") int version);

    List<FileInfoEntity> selectFileInfoList(@Param("objId") String objId,@Param("objName")  String objName);

    String selectMaxCodeByObjectId(@Param("objId") String objId);

    List<FileInfoEntity> selectFileInfoListByObjectId(@Param("objId") String objId,@Param("category")  String category);
}
