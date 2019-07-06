package com.jb4dc.base.tools;

public class PathUtility {

    /*public static String getAppPath(){
        ApplicationHome home = new ApplicationHome(PathUtility.class);
        File jarFile = home.getSource();
        return jarFile.getPath();
    }*/

    public static String getThreadRunRootPath(){
        String path = Thread.currentThread().getContextClassLoader().getResource("").getPath();
        return path.substring(0,path.length()-1);
    }

    /*private static WebApplicationContext context;

    public static WebApplicationContext getContext() {
        return context;
    }

    public static void setContext(WebApplicationContext _context) {
        context = _context;
    }

    public static ServletContext getServletContext(){
        return context.getServletContext();
    }

    public static String getServletContextRealPath(){
        return getServletContext().getRealPath("");
    }

    public static String getServletContextRealPath(String path){
        return getServletContext().getRealPath(path);
    }

    public static String getAbsoluteUrl(String path){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        return  "http://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+path;
    }

    public static String getWebInfPath(){
        //return Thread.currentThread().getContextClassLoader().getResource("").getPath();
        return getServletContextRealPath("WEB-INF");
    }

    public static URL getResource(String path) throws MalformedURLException {
        return getServletContext().getResource(path);
    }*/
}
