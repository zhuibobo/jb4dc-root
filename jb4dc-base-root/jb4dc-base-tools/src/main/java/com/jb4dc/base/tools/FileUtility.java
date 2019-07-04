package com.jb4dc.base.tools;

import org.springframework.boot.system.ApplicationHome;

import java.io.*;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/4
 * To change this template use File | Settings | File Templates.
 */
public class FileUtility {

    public static InputStream getStreamByLevel(String filePath) throws FileNotFoundException {
        //"/builder/htmldesign/DesignThemesConfig.xml"
        ApplicationHome home = new ApplicationHome(FileUtility.class);
        File jarFile = home.getSource();
        String fullPath=jarFile.getPath()+filePath;
        File file=new File(fullPath);
        if(file.exists()){
            return new FileInputStream(file);
        }
        else{
            InputStream is = FileUtility.class.getResourceAsStream(filePath);
            return is;
        }
        //System.out.println("输入出目录:"+jarFile.getParentFile().toString());
        //return null;
    }

}
