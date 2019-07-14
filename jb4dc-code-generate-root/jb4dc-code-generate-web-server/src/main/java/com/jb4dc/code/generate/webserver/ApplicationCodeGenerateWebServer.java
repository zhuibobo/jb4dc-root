package com.jb4dc.code.generate.webserver;

import com.jb4dc.base.tools.PathUtility;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(exclude= {DataSourceAutoConfiguration.class})
@ComponentScan("com.jb4dc")
public class ApplicationCodeGenerateWebServer {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationCodeGenerateWebServer.class, args);

        //System.out.println("ApplicationHome Path:"+PathUtility.getAppPath());
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
