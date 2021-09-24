package com.jb4dc.files.po;

import org.apache.commons.io.FilenameUtils;

import java.io.InputStream;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/10/12
 * To change this template use File | Settings | File Templates.
 */
public class SimpleFilePO {
    private String fileName;
    private byte[] fileByte;
    private InputStream inputStream;
    private String extensionName;
    private int size;

    public SimpleFilePO(String fileName, byte[] fileByte) {
        this.fileName = fileName;
        this.fileByte = fileByte;
        this.extensionName= FilenameUtils.getExtension(fileName);
        this.size=fileByte.length;
    }

    public SimpleFilePO(String fileName, byte[] fileByte, InputStream inputStream) {
        this(fileName,fileByte);
        this.inputStream = inputStream;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public byte[] getFileByte() {
        return fileByte;
    }

    public void setFileByte(byte[] fileByte) {
        this.fileByte = fileByte;
    }

    public String getExtensionName() {
        return extensionName;
    }

    public void setExtensionName(String extensionName) {
        this.extensionName = extensionName;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public InputStream getInputStream() {
        return inputStream;
    }

    public void setInputStream(InputStream inputStream) {
        this.inputStream = inputStream;
    }
}
