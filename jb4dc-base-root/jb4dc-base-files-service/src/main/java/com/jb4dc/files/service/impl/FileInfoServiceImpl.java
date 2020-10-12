package com.jb4dc.files.service.impl;

import com.jb4dc.base.service.exenum.EnableTypeEnum;
import com.jb4dc.base.service.IAddBefore;
import com.jb4dc.base.service.impl.BaseServiceImpl;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.tools.DateUtility;
import com.jb4dc.core.base.tools.PathBaseUtility;
import com.jb4dc.core.base.tools.StringUtility;
import com.jb4dc.core.base.tools.UUIDUtility;
import com.jb4dc.files.dao.FileContentMapper;
import com.jb4dc.files.dao.FileInfoMapper;
import com.jb4dc.files.dao.FileRefMapper;
import com.jb4dc.files.dbentities.FileContentEntity;
import com.jb4dc.files.dbentities.FileInfoEntity;
import com.jb4dc.files.dbentities.FileRefEntity;
import com.jb4dc.files.service.IFileInfoService;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.tomcat.jni.FileInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FileInfoServiceImpl extends BaseServiceImpl<FileInfoEntity> implements IFileInfoService
{
    FileInfoMapper fileInfoMapper;
    FileContentMapper contentMapper;
    FileRefMapper fileRefMapper;

    String fileRootPath;

    public String getFileRootPath() {
        return fileRootPath;
    }

    @Value("${jb4dc.file.root-path}")
    public void setFileRootPath(String fileRootPath) {
        this.fileRootPath = fileRootPath;
    }

    @Autowired
    public FileInfoServiceImpl(FileInfoMapper _defaultBaseMapper, FileContentMapper _contentMapper, FileRefMapper _fileRefMapper){
        super(_defaultBaseMapper);
        fileInfoMapper=_defaultBaseMapper;
        contentMapper=_contentMapper;
        fileRefMapper=_fileRefMapper;
    }

    @Override
    public int saveSimple(JB4DCSession jb4DSession, String id, FileInfoEntity record) throws JBuild4DCGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<FileInfoEntity>() {
            @Override
            public FileInfoEntity run(JB4DCSession jb4DSession,FileInfoEntity sourceEntity) throws JBuild4DCGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public FileInfoEntity getLastVersionFileInfo(JB4DCSession session, String objId, String objName){
        int maxVersion=fileInfoMapper.selectMaxVersion(objId,objName);
        return fileInfoMapper.selectVersionFileInfo(objId,objName,maxVersion);
    }

    @Override
    public List<FileInfoEntity> getFileInfoList(JB4DCSession session, String objId, String objName){
        return fileInfoMapper.selectFileInfoList(objId,objName);
    }

    @Override
    public FileInfoEntity addSmallFileToDB(JB4DCSession session,String fileName, byte[] fileByte,String objId,String objName,String objType,String fileCategory) throws IOException, JBuild4DCGenerallyException {
        String fileId= UUIDUtility.getUUID();

        int nextVersion=1;
        if(StringUtility.isNotEmpty(objId)&&StringUtility.isNotEmpty(objName)) {
            nextVersion=fileInfoMapper.selectMaxVersion(objId, objName) + 1;
        }

        String extensionName=FilenameUtils.getExtension(fileName);
        if(StringUtility.isEmpty(extensionName)){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"扩展名不能为空!");
        }

        FileInfoEntity fileInfoEntity=new FileInfoEntity();
        fileInfoEntity.setFileId(fileId);
        fileInfoEntity.setFileCreateTime(new Date());
        fileInfoEntity.setFileCreatorName(session.getUserName());
        fileInfoEntity.setFileCreatorId(session.getUserId());
        fileInfoEntity.setFileName(fileName);
        fileInfoEntity.setFileSize((long) fileByte.length);
        fileInfoEntity.setFileStoreType("DB");
        fileInfoEntity.setFileStorePath("");
        fileInfoEntity.setFileStoreName("");
        fileInfoEntity.setFileOrganId(session.getOrganId());
        fileInfoEntity.setFileOrganName(session.getOrganName());
        fileInfoEntity.setFileExtension(extensionName);
        fileInfoEntity.setFileDescription("");
        fileInfoEntity.setFileReadTime(0);
        fileInfoEntity.setFileCategory(fileCategory);
        fileInfoEntity.setFileStatus(EnableTypeEnum.enable.getDisplayName());
        fileInfoEntity.setFileVersion(nextVersion);

        FileContentEntity fileContentEntity=new FileContentEntity();
        fileContentEntity.setFileId(fileId);
        fileContentEntity.setFileContent(fileByte);

        FileRefEntity refEntity=new FileRefEntity();
        refEntity.setRefId(fileId);
        refEntity.setRefFileId(fileId);
        refEntity.setRefObjId(objId);
        refEntity.setRefObjName(objName);
        refEntity.setRefObjType(objType);
        refEntity.setRefOrderNum(0);
        refEntity.setRefStatus(EnableTypeEnum.enable.getDisplayName());
        fileRefMapper.insertSelective(refEntity);

        fileInfoMapper.insertSelective(fileInfoEntity);
        contentMapper.insertSelective(fileContentEntity);
        return fileInfoEntity;
    }

    @Override
    public FileInfoEntity addSmallFileToDB(JB4DCSession session, MultipartFile file,String objId,String objName,String objType,String fileCategory) throws IOException, JBuild4DCGenerallyException {
        return this.addSmallFileToDB(session,file.getOriginalFilename(),file.getBytes(),objId,objName,objType,fileCategory);
    }

    @Override
    public FileInfoEntity addFileToFileSystem(JB4DCSession session, String fileName, byte[] fileByte, String objId, String objName, String objType, String fileCategory) throws JBuild4DCGenerallyException, IOException {

        String fileId= UUIDUtility.getUUID();

        int nextVersion=1;
        if(StringUtility.isNotEmpty(objId)&&StringUtility.isNotEmpty(objName)) {
            nextVersion=fileInfoMapper.selectMaxVersion(objId, objName) + 1;
        }

        String extensionName=FilenameUtils.getExtension(fileName);
        if(StringUtility.isEmpty(extensionName)){
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"扩展名不能为空!");
        }

        Map<String,String> fileSaveInfo=buildRelativeFileSavePath(fileId,extensionName);
        File file=new File(fileSaveInfo.get(FULL_FILE_STORE_PATH));
        FileUtils.writeByteArrayToFile(file,fileByte);

        FileInfoEntity fileInfoEntity=new FileInfoEntity();
        fileInfoEntity.setFileId(fileId);
        fileInfoEntity.setFileCreateTime(new Date());
        fileInfoEntity.setFileCreatorName(session.getUserName());
        fileInfoEntity.setFileCreatorId(session.getUserId());
        fileInfoEntity.setFileName(fileName);
        fileInfoEntity.setFileSize((long) fileByte.length);
        fileInfoEntity.setFileStoreType("FileSystem");
        fileInfoEntity.setFileStorePath(fileSaveInfo.get(RELATIVE_FILE_STORE_PATH));
        fileInfoEntity.setFileStoreName(fileSaveInfo.get(FILE_STORE_NAME));
        fileInfoEntity.setFileOrganId(session.getOrganId());
        fileInfoEntity.setFileOrganName(session.getOrganName());
        fileInfoEntity.setFileExtension(extensionName);
        fileInfoEntity.setFileDescription("");
        fileInfoEntity.setFileReadTime(0);
        fileInfoEntity.setFileCategory(fileCategory);
        fileInfoEntity.setFileStatus(EnableTypeEnum.enable.getDisplayName());
        fileInfoEntity.setFileVersion(nextVersion);

        FileRefEntity refEntity=new FileRefEntity();
        refEntity.setRefId(fileId);
        refEntity.setRefFileId(fileId);
        refEntity.setRefObjId(objId);
        refEntity.setRefObjName(objName);
        refEntity.setRefObjType(objType);
        refEntity.setRefOrderNum(0);
        refEntity.setRefStatus(EnableTypeEnum.enable.getDisplayName());
        fileRefMapper.insertSelective(refEntity);

        fileInfoMapper.insertSelective(fileInfoEntity);
        return fileInfoEntity;
    }

    @Override
    public FileInfoEntity addFileToFileSystem(JB4DCSession session, MultipartFile file,String objId,String objName,String objType,String fileCategory) throws IOException, JBuild4DCGenerallyException {
        return this.addFileToFileSystem(session,file.getOriginalFilename(),file.getBytes(),objId,objName,objType,fileCategory);
    }

    private String FULL_FILE_STORE_PATH="FULL_FILE_STORE_PATH";
    private String RELATIVE_FILE_STORE_PATH="RELATIVE_FILE_STORE_PATH";
    private String FILE_STORE_NAME="FILE_STORE_NAME";

    private Map<String,String> buildRelativeFileSavePath(String fileId, String extensionName){
        Map<String,String> result=new HashMap<>();
        String base_path= PathBaseUtility.getThreadRunRootPath()+File.separator+fileRootPath;
        String file_name=fileId+"."+extensionName.replaceAll("/.","");
        String relative_file_store_path=DateUtility.getDate_yyyy_MM()+File.separator+file_name;

        result.put(FULL_FILE_STORE_PATH,base_path+File.separator+relative_file_store_path);
        result.put(RELATIVE_FILE_STORE_PATH,relative_file_store_path);
        result.put(FILE_STORE_NAME,file_name);
        return result;
    }

    @Override
    public String buildFilePath(FileInfoEntity fileInfoEntity){
        String _path= PathBaseUtility.getThreadRunRootPath()+File.separator+fileRootPath+File.separator+fileInfoEntity.getFileStorePath();
        return _path;
    }

    @Override
    public byte[] getContentInDB(String fileId) {
        return contentMapper.selectByPrimaryKey(fileId).getFileContent();
    }
}
