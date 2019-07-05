package com.jb4dc.core.base.tools;

import com.jb4dc.core.base.exception.JBuild4DCSQLKeyWordException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/6
 * To change this template use File | Settings | File Templates.
 */
public class SQLKeyWordUtility {

    public static boolean validateSqlInjectForSelectOnly(String sqlString) throws JBuild4DCSQLKeyWordException {
        //boolean ReturnValue = false;
        try
        {
            if (!sqlString.equals(""))
            {

                sqlString=sqlString.toLowerCase().replaceAll("IS_DELETED","");
                String SqlStrKeyWord = "insert|update|delete|alert|drop|exec|truncate";
                SqlStrKeyWord=SqlStrKeyWord.toLowerCase();
                String[] anySqlStr = SqlStrKeyWord.split("\\|");
                for (String keyWord : anySqlStr) {
                    if(sqlString.indexOf(keyWord)>0){
                        throw new JBuild4DCSQLKeyWordException(sqlString + "中可能存在SQL关键字"+keyWord);
                    }
                }
            }
            return true;
        }
        catch(Exception ex)
        {
            throw new JBuild4DCSQLKeyWordException(ex.getMessage());
        }
    }

    public static String stringWrap(String source){
        return "'"+source.replaceAll("'","''")+"'";
    }

    public static boolean singleWord(String source) throws JBuild4DCSQLKeyWordException {
        if(StringUtility.isNotEmpty(source)){
            source=source.trim();
            if(source.indexOf(" ")>=0){
                throw new JBuild4DCSQLKeyWordException("单词"+source+"中不能存在空格");
            }
            if(source.indexOf("'")>=0){
                throw new JBuild4DCSQLKeyWordException("单词"+source+"中不能存在单引号");
            }
        }
        return true;
    }
}
