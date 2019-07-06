package com.jb4dc.core.base.exenum;

public interface BaseEnum<E extends Enum<?>, T> {
    public T getValue();
    public String getDisplayName();
}