package com.jb4dc.base.tools;

import com.sun.org.apache.xerces.internal.impl.PropertyManager;
import com.sun.org.apache.xerces.internal.impl.XMLStreamReaderImpl;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import java.io.InputStream;
import java.io.StringReader;
import java.io.StringWriter;

public class XMLUtility {

    public static <T> T toObject(InputStream is,Class<T> _class) throws JAXBException {
        JAXBContext context = JAXBContext.newInstance(_class);
        Unmarshaller unmarshaller = context.createUnmarshaller();
        T vo = (T) unmarshaller.unmarshal(is);
        return vo;
    }

    public static <T> T toObject(String xml,Class<T> _class) throws JAXBException, XMLStreamException {
        JAXBContext context = JAXBContext.newInstance(_class);
        Unmarshaller unmarshaller = context.createUnmarshaller();
        StringReader reader = new StringReader(xml);
        //XMLStreamReader reader1=new XMLStreamReaderImpl(reader, new PropertyManager(PropertyManager.CONTEXT_READER));
        T vo = (T) unmarshaller.unmarshal(reader);
        return vo;
    }

    public static <T> String toXMLString(T obj) throws JAXBException {
        JAXBContext context = JAXBContext.newInstance(obj.getClass());
        Marshaller jaxbMarshaller = context.createMarshaller();
        jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
        StringWriter sw = new StringWriter();
        jaxbMarshaller.marshal(obj, sw);
        String xmlContent = sw.toString();
        return xmlContent;
    }
}
