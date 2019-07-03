package com.jb4dc.code.generate.webserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.jb4dc")
public class ApplicationCodeGenerateWebServer {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationCodeGenerateWebServer.class, args);
    }
}
