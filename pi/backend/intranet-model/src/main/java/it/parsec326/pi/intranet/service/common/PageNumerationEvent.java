package it.parsec326.pi.intranet.service.common;

import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfWriter;

public class PageNumerationEvent extends PdfPageEventHelper {
    private com.itextpdf.text.Font footerFont = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 8);

    @Override
    public void onEndPage(PdfWriter writer, Document document) {
        PdfContentByte cb = writer.getDirectContent();
        Rectangle pageSize = document.getPageSize();
        String footerText = "Pagina " + writer.getPageNumber();
        Phrase footer = new Phrase(footerText, footerFont);

        float x = (pageSize.getLeft() + pageSize.getRight()) / 2;
        float y = pageSize.getBottom() + 15;

        ColumnText.showTextAligned(cb, Element.ALIGN_CENTER, footer, x, y, 0);
    }
}
