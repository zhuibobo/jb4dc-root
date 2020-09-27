package com.jb4dc.base.tools;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.TimeZone;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2020/9/25
 * To change this template use File | Settings | File Templates.
 */
public class URLUtility {

    public static String encode(String source) throws JBuild4DCGenerallyException {
        try {
            String encodeString = URLEncoder.encode(source,"utf-8");
            encodeString = encodeString.replaceAll("\\+", "%20");
            return encodeString;
        } catch (UnsupportedEncodingException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,e.getMessage());
        }
    }

    public static String decode(String source) throws JBuild4DCGenerallyException {
        try {
            String decodeString = URLDecoder.decode(source,"utf-8");
            return decodeString;
        } catch (UnsupportedEncodingException e) {
            throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,e.getMessage());
        }
    }

}
