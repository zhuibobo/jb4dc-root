package com.jb4dc.base.client;

import feign.Logger;
import feign.codec.Encoder;
import feign.form.spring.SpringFormEncoder;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.cloud.openfeign.support.SpringEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/27
 * To change this template use File | Settings | File Templates.
 */
@Configuration
public class FeignClientConfig {
    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    //@Autowired
    //private ObjectFactory<HttpMessageConverters> messageConverters;
    // new一个form编码器，实现支持form表单提交
    //@Bean
    //public Encoder feignFormEncoder() {
    //    return new SpringFormEncoder(new SpringEncoder(messageConverters));
    //}
}
