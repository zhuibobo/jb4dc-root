package com.jb4dc.code.generate.webserver.unit;

import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.parser.ImageRenderInfo;
import com.itextpdf.text.pdf.parser.PdfReaderContentParser;
import com.itextpdf.text.pdf.parser.RenderListener;
import com.itextpdf.text.pdf.parser.TextRenderInfo;
import com.jb4dc.core.base.ymls.JBuild4DCYaml;
import org.junit.Test;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/8
 * To change this template use File | Settings | File Templates.
 */
public class JBuild4DCYamlUnitTest {

    @Test
    public void getTableGenerateCodeTest() throws Exception {
        System.out.println(JBuild4DCYaml.getValue("client:systemTitle"));
    }

    @Test
    public void readPdf() throws Exception {

        PdfReader reader = new PdfReader("D:\\文件阅签单.pdf");
        /*PdfDocument pdfDoc = new PdfDocument(reader);

        //URL url = this.getClass().getResource("/fonts/simsun.ttc");
        //PdfFont sysFont = PdfFontFactory.createFont("c://windows//fonts//simsun.ttc,1", PdfEncodings.IDENTITY_H, false);//中文设置,解决特殊字符错误，
        //PdfFont sysFont = PdfFontFactory.createFont("STSongStd-Light", "UniGB-UCS2-H", false);
        //pdfDoc.addFont(sysFont);

        LocationTextExtractionStrategy strategy = new LocationTextExtractionStrategy();
        //strategy.
        //PdfCanvasProcessor parser = new PdfCanvasProcessor(strategy);

        PdfCanvasProcessor parser = new PdfCanvasProcessor(new IEventListener() {
            @Override
            public void eventOccurred(IEventData iEventData, EventType eventType) {
                if (eventType.equals(EventType.RENDER_TEXT)) {
                    TextRenderInfo renderInfo = (TextRenderInfo) iEventData;
                    System.out.println(renderInfo.getText());
                    *//*LineSegment segment = renderInfo.getBaseline();
                    if (renderInfo.getRise() != 0.0F) {
                        Matrix riseOffsetTransform = new Matrix(0.0F, -renderInfo.getRise());
                        segment = segment.transformBy(riseOffsetTransform);
                    }*//*
                }
            }

            @Override
            public Set<EventType> getSupportedEvents() {
                return null;
            }
        });

        parser.processPageContent(pdfDoc.getFirstPage());
        byte[] array = strategy.getResultantText().getBytes("GB2312");
        String str=new String(array,"GB2312");
        System.out.println(str);*/

        PdfReaderContentParser parser = new PdfReaderContentParser(reader);
        //reader.
        //PrintWriter out = new PrintWriter(new FileOutputStream(txt));
        //TextExtractionStrategy strategy;
        for (int i = 1; i <= reader.getNumberOfPages(); i++) {
            parser.processContent(i, new RenderListener() {
                @Override
                public void beginTextBlock() {

                }

                @Override
                public void renderText(TextRenderInfo textRenderInfo) {
                    System.out.println(textRenderInfo.getPdfString());
                    //String s=new String(textRenderInfo.getText(),0,"gbk");
                }

                @Override
                public void endTextBlock() {

                }

                @Override
                public void renderImage(ImageRenderInfo imageRenderInfo) {

                }
            });
            //System.out.println(strategy.getResultantText());
            //out.println(strategy.getResultantText());
        }
    }
}
