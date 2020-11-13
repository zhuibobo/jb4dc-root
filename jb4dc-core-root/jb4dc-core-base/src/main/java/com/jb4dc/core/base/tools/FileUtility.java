package com.jb4dc.core.base.tools;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.URISyntaxException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/4
 * To change this template use File | Settings | File Templates.
 */
public class FileUtility {

    static Logger logger= LoggerFactory.getLogger(FileUtility.class);

    static String jarPath;
    static String jarRootPath;

    public static InputStream getStreamByLevel(String filePath) throws FileNotFoundException, URISyntaxException {
        //"/builder/htmldesign/DesignThemesConfig.xml"
        //ApplicationHome home = new ApplicationHome(FileUtility.class);
        //ApplicationHome home=new ApplicationHome();
        //System.out.println("getDir:"+home.getDir().getPath());
        //File jarFile = home.getSource();
        String fullPath= PathBaseUtility.getThreadRunRootPath()+filePath;
        //System.out.println(fullPath);
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

    public static String getRootPath() throws FileNotFoundException, URISyntaxException {
        String path = PathBaseUtility.getThreadRunRootPath();
        logger.info("FileUtility.getRootPath:getThreadRunRootPath" + path);
        if (path.indexOf("classes!") > 0) {
            path=getJarRootPath()+ File.separator;
            logger.info("FileUtility.getRootPath:getJarRootPath" + path);
        }
        return path.substring(0, path.length() - 1);
    }

    public static String getJarPath() {
        return jarPath;
    }

    public static void setJarPath(String jarPath) {
        FileUtility.jarPath = jarPath;
    }

    public static String getJarRootPath() {
        return jarRootPath;
    }

    public static void setJarRootPath(String jarRootPath) {
        FileUtility.jarRootPath = jarRootPath;
    }
}
