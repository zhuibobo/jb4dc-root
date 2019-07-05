package com.jb4dc.code.generate.webserver;

import com.jb4dc.base.tools.FileUtility;
import com.jb4dc.base.tools.XMLUtility;
import com.jb4dc.code.generate.vo.DataSourceConfigVo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.system.ApplicationHome;
import org.springframework.context.annotation.ComponentScan;

import javax.xml.bind.JAXBException;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.InputStream;

@SpringBootApplication(exclude= {DataSourceAutoConfiguration.class})
@ComponentScan("com.jb4dc")
public class ApplicationCodeGenerateWebServer {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationCodeGenerateWebServer.class, args);

        /*try {
            InputStream is = FileUtility.getStreamByLevel("/config/db-source.xml");
            try {
                DataSourceConfigVo configVo=XMLUtility.toObject(is, DataSourceConfigVo.class);
                System.out.println(configVo.getDesc());
            } catch (JAXBException e) {
                e.printStackTrace();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }*/
        //ApplicationHome home = new ApplicationHome(ApplicationCodeGenerateWebServer.class);
        //File jarFile = home.getSource();
        //System.out.println("输入出目录:"+jarFile.getParentFile().toString());
        //FileUtility.getStrama("");
    }
}
