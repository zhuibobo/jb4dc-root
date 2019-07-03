package com.jb4dc.core.base.encryption.digitaldigest;

import com.jb4dc.core.base.encryption.Bytes2HexStringUtility;

import java.security.MessageDigest;
import java.util.Base64;

//import sun.misc.BASE64Encoder;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/6
 * To change this template use File | Settings | File Templates.
 */
public class SHAUtility {
    public final static String EncryptionWithBase64(String s) throws Exception{
        try {
            MessageDigest sha1=MessageDigest.getInstance("SHA-1");
            byte[] bytes=sha1.digest(s.getBytes("utf8"));
            //BASE64Encoder base64=new BASE64Encoder();
            //return base64.encode(bytes);

            Base64.Encoder encoder = Base64.getEncoder();
            return encoder.encodeToString(bytes);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public final static String EncryptionWithHex(String s) throws Exception{
        try {
            MessageDigest sha1=MessageDigest.getInstance("SHA-1");
            byte[] bytes=sha1.digest(s.getBytes("utf8"));
            return Bytes2HexStringUtility.bytesToHexString(bytes);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}