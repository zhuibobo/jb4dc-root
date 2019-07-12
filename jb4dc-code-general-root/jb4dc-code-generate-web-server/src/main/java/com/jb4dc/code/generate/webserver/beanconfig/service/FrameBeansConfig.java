package com.jb4dc.code.generate.webserver.beanconfig.service;

import com.jb4dc.base.service.provide.IFrameMenuProvide;
import com.jb4dc.code.generate.service.impl.FrameMenuImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/9
 * To change this template use File | Settings | File Templates.
 */

@Configuration
public class FrameBeansConfig {

    @Bean
    public IFrameMenuProvide frameMenu(){
        IFrameMenuProvide frameMenu=new FrameMenuImpl();
        return frameMenu;
    }


}
