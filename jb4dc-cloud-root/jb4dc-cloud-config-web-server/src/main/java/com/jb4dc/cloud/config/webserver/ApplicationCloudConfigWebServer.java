package com.jb4dc.cloud.config.webserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.config.server.EnableConfigServer;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/4
 * To change this template use File | Settings | File Templates.
 */
@EnableDiscoveryClient
@EnableConfigServer
@SpringBootApplication
public class ApplicationCloudConfigWebServer {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationCloudConfigWebServer.class, args);
    }
}
