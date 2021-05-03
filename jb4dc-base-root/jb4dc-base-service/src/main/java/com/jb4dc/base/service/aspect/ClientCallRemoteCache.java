package com.jb4dc.base.service.aspect;

import com.jb4dc.base.service.cache.JB4DCCacheManagerV2;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ClientCallRemoteCache {
    int expirationTimeSeconds() default 300;
}
