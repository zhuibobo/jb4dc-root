package com.jb4dc.base.dbaccess.exenum;

public interface BaseEnum<E extends Enum<?>, T> {
    public T getValue();
    public String getDisplayName();
}