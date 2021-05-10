package com.jb4dc.base.client;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jb4dc.base.ymls.JBuild4DCYaml;
import feign.Logger;
import feign.codec.Decoder;
import feign.codec.Encoder;
import feign.form.FormEncoder;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.cloud.openfeign.support.ResponseEntityDecoder;
import org.springframework.cloud.openfeign.support.SpringDecoder;
import org.springframework.cloud.openfeign.support.SpringEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/27
 * To change this template use File | Settings | File Templates.
 */
@Configuration
public class FeignClientConfig {

    @Autowired
    JBuild4DCYaml jBuild4DCYaml;

    /*@Autowired
    private ObjectFactory<HttpMessageConverters> messageConverters;*/

    @Bean
    Logger.Level feignLoggerLevel() {
        if(JBuild4DCYaml.getFeignLoggerLevel().equals("BASIC")) {
            return Logger.Level.BASIC;
        }
        else if(JBuild4DCYaml.getFeignLoggerLevel().equals("HEADERS")) {
            return Logger.Level.HEADERS;
        }
        else if(JBuild4DCYaml.getFeignLoggerLevel().equals("NONE")) {
            return Logger.Level.NONE;
        }
        else {
            return Logger.Level.FULL;
        }
    }

    @Bean
    public Decoder feignDecoder() {
        HttpMessageConverter jacksonConverter = new MappingJackson2HttpMessageConverter(objectMapper());
        ObjectFactory<HttpMessageConverters> objectFactory = () -> new HttpMessageConverters(jacksonConverter);
        return new ResponseEntityDecoder(new SpringDecoder(objectFactory));
    }

    /*@Bean
    public Encoder feignFormEncoder(){
        return new FormEncoder(new SpringEncoder(messageConverters));
    }*/

    @Bean
    public Encoder feignEncoder(){
        HttpMessageConverter jacksonConverter = new MappingJackson2HttpMessageConverter(objectMapper());

        ObjectFactory<HttpMessageConverters> objectFactory = () -> {
            HttpMessageConverters httpMessageConverters = new HttpMessageConverters(jacksonConverter);
            //httpMessageConverters.getConverters().add()
            //httpMessageConverters.getConverters().add(new FormEncoder());
            return httpMessageConverters;
        };
        SpringEncoder springEncoder = new SpringEncoder(objectFactory);
        return new FormEncoder(springEncoder);
    }

    public ObjectMapper objectMapper(){
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
        return objectMapper;
    }

    //@Autowired
    //private ObjectFactory<HttpMessageConverters> messageConverters;
    // new一个form编码器，实现支持form表单提交
    //@Bean
    //public Encoder feignFormEncoder() {
    //    return new SpringFormEncoder(new SpringEncoder(messageConverters));
    //}
}
