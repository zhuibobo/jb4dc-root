package com.jb4dc.core.base.encryption.symmetric;

//import sun.misc.BASE64Decoder;
//import sun.misc.BASE64Encoder;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.Base64.Encoder;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/6
 * To change this template use File | Settings | File Templates.
 */
public class DESUtility {
    public static String genKeyDES() throws Exception{
        try {
            KeyGenerator keyGen=KeyGenerator.getInstance("DES");
            keyGen.init(56);
            SecretKey key=keyGen.generateKey();
            //BASE64Encoder base64=new BASE64Encoder();
            //String Base64Str=base64.encode(key.getEncoded());
            //return Base64Str;

            Encoder encoder = Base64.getEncoder();
            return encoder.encodeToString(key.getEncoded());
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    private static SecretKey CreateKey(String base64Key) throws Exception {
        try {
            Decoder decoder = Base64.getDecoder();
            byte[] bytes=decoder.decode(base64Key);
            //BASE64Decoder base64=new BASE64Decoder();
            //byte[] bytes=base64.decodeBuffer(base64Key);
            //byte[] bytes= key.getBytes("utf8");
            SecretKey skey=new SecretKeySpec(bytes,"DES");
            return skey;
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    /*
    key 8位
     */
    public static String Encryption(String s,String key) throws Exception {
        try {
            Cipher cipher=Cipher.getInstance("DES");
            cipher.init(Cipher.ENCRYPT_MODE,CreateKey(key));
            byte[] bytes=cipher.doFinal(s.getBytes("utf8"));
            //BASE64Encoder base64=new BASE64Encoder();
            //return base64.encode(bytes);

            Encoder encoder = Base64.getEncoder();
            return encoder.encodeToString(bytes);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            throw e;
        }
    }
    public static String Decryption(String s,String key) throws Exception{
        try {
            //BASE64Decoder base64=new BASE64Decoder();
            //byte[] encodeByte=base64.decodeBuffer(s);

            Decoder decoder = Base64.getDecoder();
            byte[] encodeByte=decoder.decode(s);
            Cipher cipher=Cipher.getInstance("DES");
            cipher.init(Cipher.DECRYPT_MODE,CreateKey(key));
            byte[] bytes=cipher.doFinal(encodeByte);
            return new String(bytes, "utf-8");
        }
        catch (Exception e)
        {
            e.printStackTrace();
            throw e;
        }
    }
}
