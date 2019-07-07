package com.jb4dc.devmock.webserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/7
 * To change this template use File | Settings | File Templates.
 */

@SpringBootApplication(exclude= {DataSourceAutoConfiguration.class})
@ComponentScan("com.jb4dc")
public class ApplicationDevMockWebServer {

    public static void main(String[] args) {
        SpringApplication.run(ApplicationDevMockWebServer.class, args);
    }

}
