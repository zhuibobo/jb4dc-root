package com.jb4dc.code.generate.webserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.system.ApplicationHome;
import org.springframework.context.annotation.ComponentScan;

import java.io.File;

@SpringBootApplication
@ComponentScan("com.jb4dc")
public class ApplicationCodeGenerateWebServer {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationCodeGenerateWebServer.class, args);

        ApplicationHome home = new ApplicationHome(ApplicationCodeGenerateWebServer.class);
        File jarFile = home.getSource();
        System.out.println("输入出目录:"+jarFile.getParentFile().toString());
    }
}
