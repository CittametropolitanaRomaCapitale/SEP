package it.parsec326.pi.intranet.utils;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

public class HeaderFooterPageEvent extends PdfPageEventHelper {
    private int totalRecords;
    private int totalPages;
    private String from;

    public HeaderFooterPageEvent(int totalRecords, String from) {
        this.totalRecords = totalRecords;
        this.from = from;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages -1;
    }

    @Override
    public void onEndPage(PdfWriter writer, Document document) {
        PdfPTable footer = new PdfPTable(2);
        footer.setTotalWidth(document.getPageSize().getWidth() - document.leftMargin() - document.rightMargin());
        footer.setWidthPercentage(100);
        try {
            footer.setWidths(new int[]{1, 1});

            // Left cell: Total records
            PdfPCell leftCell;
            if("exportStorico".equals(from)){
                leftCell = new PdfPCell(new Phrase("Operazioni storico esportate: " + totalRecords));
            }else{
                leftCell = new PdfPCell(new Phrase("Protocolli esportati: " + totalRecords));
            }
            leftCell.setBorder(Rectangle.NO_BORDER);
            footer.addCell(leftCell);

            // Right cell: Page numbers
            PdfPCell rightCell;
            if (totalPages > 1) {
                rightCell = new PdfPCell(new Phrase(String.format("Page %d/%d", writer.getPageNumber(), totalPages)));
            } else {
                rightCell = new PdfPCell(new Phrase(""));
            }
            rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            rightCell.setBorder(Rectangle.NO_BORDER);
            footer.addCell(rightCell);

            footer.writeSelectedRows(0, -1, document.leftMargin(), document.bottomMargin() - 10, writer.getDirectContent());
        } catch (DocumentException de) {
            throw new ExceptionConverter(de);
        }
    }
}
