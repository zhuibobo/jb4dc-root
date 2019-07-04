package com.jb4dc.cloud.eureka.webserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/4
 * To change this template use File | Settings | File Templates.
 */
@EnableEurekaServer
@SpringBootApplication
public class ApplicationCloudEurekaWebServer {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationCloudEurekaWebServer.class, args);
    }
}
