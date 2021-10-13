package com.jb4dc.base.service.search;

public class SearchModel {
    int pageNum;
    int pageSize;
    boolean loadDict;

    public int getPageNum() {
        return pageNum;
    }

    public void setPageNum(int pageNum) {
        this.pageNum = pageNum;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public boolean isLoadDict() {
        return loadDict;
    }

    public void setLoadDict(boolean loadDict) {
        this.loadDict = loadDict;
    }
}
