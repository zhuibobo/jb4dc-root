package com.jb4dc.files.po;

public class SimpleFilePathPO {
    private String fullFileStorePath;
    private String relativeFileStorePath;
    private String fileStoreName;

    public String getFullFileStorePath() {
        return fullFileStorePath;
    }

    public void setFullFileStorePath(String fullFileStorePath) {
        this.fullFileStorePath = fullFileStorePath;
    }

    public String getRelativeFileStorePath() {
        return relativeFileStorePath;
    }

    public void setRelativeFileStorePath(String relativeFileStorePath) {
        this.relativeFileStorePath = relativeFileStorePath;
    }

    public String getFileStoreName() {
        return fileStoreName;
    }

    public void setFileStoreName(String fileStoreName) {
        this.fileStoreName = fileStoreName;
    }
}
