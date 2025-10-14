package it.parsec326.pi.intranet.service;


import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.ProtocolloEmergenzaDTO;
import it.parsec326.pi.intranet.dto.StoricoOutputDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaProtocolliDTO;
import it.parsec326.pi.intranet.dto.common.ListProtocolloDTOForRegistro;
import it.parsec326.pi.intranet.dto.common.ProtocolloForRegistroDTO;
import it.parsec326.pi.intranet.dto.common.TitolarioOutputDTO;
import it.parsec326.pi.intranet.dto.excel.ErrorRecord;
import it.parsec326.pi.intranet.dto.excel.ImportResult;
import it.parsec326.pi.intranet.dto.ricerca.RicercaStoricoDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.model.*;
import it.parsec326.pi.intranet.service.common.PageNumerationEvent;
import it.parsec326.pi.intranet.utils.HeaderFooterPageEvent;
import it.parsec326.pi.intranet.utils.LogUtils;
import it.parsec326.pi.intranet.utils.Utils;
import it.parsec326.pi.intranet.utils.common.MetodoSpedizione;
import it.parsec326.pi.intranet.utils.common.StoricoOperazione;
import it.parsec326.pi.intranet.utils.common.TipoRegistrazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.color.PDDeviceRGB;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.*;

@ApplicationScoped
@Slf4j
public class DocumentService {

    @Inject
    ProtocolloService protocolloService;

    @Inject
    AllegatoService allegatoService;

    @Inject
    StoricoService storicoService;

    @Inject
    BarcodeGeneratorService barcodeGeneratorService;

    @Inject
    TitolarioService titolarioService;

    @Inject
    SSOClient ssoManager;

    @Inject
    EntityManager em;
    @Inject
    ReferentiProtocolloService referentiProtocolloService;

    public void saveDocumentTimbrato(Long idAllegato, String filigrana, String position, String nProtocollo) throws IOException {
        Allegato allegato = Allegato.findById(idAllegato);
        saveDocumentTimbrato(allegato, filigrana, position, nProtocollo);
    }

    public void saveDocumentTimbrato(Allegato allegato, String filigrana, String position, String nProtocollo) throws IOException {
        String minioRef = allegato.getRiferimentoMinio();
        String fileName = allegato.getNome();
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex >= 0) {
            String extension = allegato.getNome().substring(dotIndex);
            if (extension.equalsIgnoreCase(".pdf")) {
                position = position == null || position.equals("") ? "top" : position;
                InputStream minioResult = allegatoService.downloadByRef(minioRef);

                PDDocument document = null;
                try {
                    document = PDDocument.load(minioResult);
                }
                catch (Exception ex) {
                    log.error("Documento {} corrotto - Impossibile eseguire la timbratura di protocollo: {}", allegato.getNome(), ex.getMessage());
                    updateAllegatoFirmato(allegato.getId(), "Documento corrotto");
                    return;
                }
                /* COMMENTATO IL CHECK PER IL PDF FIRMATO
                try{
                    document = PDDocument.load(minioResult);
                    if(document.getSignatureDictionaries() != null && !document.getSignatureDictionaries().isEmpty()){
                        log.info("Documento {} firmato digitalmente", allegato.getNome());
                        updateAllegatoFirmato(allegato.getId(), "Documento firmato digitalmente");
                        return;
                    }
                }catch (Exception e){
                    log.error("[saveDocumentTimbrato] - Errore durante la timbratura del file: {} per il protocollo: {}. \n Error Message: {}", fileName, filigrana.split(" del")[0], e.getMessage());
                    return;
                }*/
                if(document != null && !document.isEncrypted()){
                    for (PDPage page : document.getPages()) {
                        this.addFiligrana(document, page, filigrana, position);
                    }
                    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                    try (outputStream) {
                        document.save(outputStream);
                        document.close();
                        allegatoService.saveAllegati(new ByteArrayInputStream(outputStream.toByteArray()), minioRef, extension, allegato.getId(), nProtocollo);
                    } catch (Exception e) {
                        log.error("[saveDocumentTimbrato] ERROR - ", e);
                        throw new RuntimeException(String.format("Errore nella timbratura del documento con id: %s, Error Message: %s ", allegato.getId(), e.getMessage()));
                    }finally {
                        outputStream.close();
                    }
                }else {
                    log.info("[saveDocumentTimbrato] - Il documento: {} per il protocollo: {} non e' stato timbrato perche' criptato.", fileName, filigrana.split(" del")[0]);
                }
            }
        }
    }

    @Transactional
    public void updateAllegatoFirmato(Long idAllegato, String cause){
        em.createNamedQuery("updateTipoDocumentoFirmato")
                .setParameter("tipoDocumento", cause)
                .setParameter("id", idAllegato)
                .executeUpdate();
    }

    public void addFiligrana(PDDocument document, PDPage page, String text, String position) throws IOException {

        try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true, true)) {
            position = position == null ? "top" : position;
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
            final float border = 25;
            float x = border;
            float y = page.getMediaBox().getHeight() - border;

            if (position.equalsIgnoreCase("top")) {
                x = (page.getMediaBox().getWidth() - (PDType1Font.HELVETICA_BOLD.getStringWidth(text) / 1000 * 12)) / 2;
                y = page.getMediaBox().getHeight() - border;
            } else if (position.equalsIgnoreCase("down")) {
                x = (page.getMediaBox().getWidth() - (PDType1Font.HELVETICA_BOLD.getStringWidth(text) / 1000 * 12)) / 2;
                y = border;
            } else if (position.equalsIgnoreCase("right")) {
                x = page.getMediaBox().getWidth() - border;
                y = (page.getMediaBox().getHeight() - (PDType1Font.HELVETICA_BOLD.getStringWidth(text) / 1000 * 12)) / 2;
            } else if (position.equalsIgnoreCase("left")) {
                x = border;
                y = (page.getMediaBox().getHeight() - (PDType1Font.HELVETICA_BOLD.getStringWidth(text) / 1000 * 12)) / 2;
            }

            /* GENERAZIONE RETTANGOLO DI SFONDO ALLA TIMBRATURA
            float textWidth = PDType1Font.HELVETICA_BOLD.getStringWidth(text) / 1000 * 12;
            float textHeight = PDType1Font.HELVETICA_BOLD.getFontDescriptor().getFontBoundingBox().getHeight() / 1000 * 12;
            float rectX, rectY, rectWidth, rectHeight;
            if (position.equalsIgnoreCase("right") || position.equalsIgnoreCase("left")) {
                rectX = (x - textHeight);
                rectY = ((page.getMediaBox().getHeight() - (PDType1Font.HELVETICA_BOLD.getStringWidth(text) / 1000 * 12)) / 2) - 5;
                rectWidth = textHeight + 5;
                rectHeight = textWidth + 10;
            } else {
                rectX = x - 5;
                rectY = y - 5;
                rectWidth = textWidth + 10;
                rectHeight = textHeight + 5;
            }
            contentStream.setNonStrokingColor(255, 255, 255);
            contentStream.fillRect(rectX, rectY, rectWidth, rectHeight);
            */

            contentStream.beginText();
            contentStream.newLineAtOffset(x, y);

            if (position.equalsIgnoreCase("left") || position.equalsIgnoreCase("right")) {
                contentStream.setTextRotation(Math.PI / 2, x, y);
            }

            contentStream.setNonStrokingColor(0);
            contentStream.showText(text);
            contentStream.endText();
        }
    }
    @Transactional
    public Email getEmailtoFieldRicevuta(Long idProtocollo) {
        return em.createNamedQuery("getFromProtocolloId", Email.class)
                .setParameter("idProtocollo", idProtocollo)
                .getResultStream()
                .findFirst()
                .orElse(null);
    }

    public String createPdfRicevuta(Protocollo protocollo) throws IOException {
        try{
            String numProtocollo = protocollo.getNProtocollo();
            boolean isPecEntrata = TipoRegistrazione.Entrata.toString().equalsIgnoreCase(protocollo.getTipoRegistrazione().toString())
                    && MetodoSpedizione.Pec.toString().equalsIgnoreCase(protocollo.getMetodoSpedizione().toString());
            Email email = new Email();
            if(isPecEntrata){
                email = getEmailtoFieldRicevuta(protocollo.getId());
                if(email == null){
                    CustomException.get(CustomException.ErrorCode.INTERNAL, "Email di riferimento al Protocollo non trovata").boom();
                }
            }

            Map<Integer, String> fieldValues = new HashMap<>();
            fieldValues.put(1, "Città metropolitana di Roma Capitale");
            fieldValues.put(2, "CMRC");
            fieldValues.put(3, String.format("%s del %s", protocollo.getNProtocollo(), new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(protocollo.getTsCreation())));
            fieldValues.put(4, isPecEntrata ? email.getFrom() : protocollo.getCdr());
            fieldValues.put(5, isPecEntrata ? email.getTo() : String.join(", ", referentiProtocolloService.getNomeDestinatariInizialiPerCompetenza(protocollo.getId())));
            fieldValues.put(6, protocollo.getOggetto());

            StringBuilder classificazione = new StringBuilder();
            for (ProtocolliClassificazione pc : protocollo.getProtocolliClassificazioneList()) {
                Titolario titolario = Titolario.findById(pc.getIdTitolario());
                List<TitolarioOutputDTO> titolari = titolarioService.getHierarchyForTitolarioId(pc.getIdTitolario()).getTitolario();
                titolari.forEach(t -> classificazione.append(t.getLabel()).append(" > "));
                classificazione.append(titolario.getNome()).append("\n \n");
            }

            fieldValues.put(7, classificazione.toString());

            int margin = 20;
            float rectWidth = 550;
            float rectHeight = 65;
            int rectSize = 7;

            try (PDDocument document = new PDDocument()) {
                PDPage page = new PDPage(PDRectangle.A4);
                document.addPage(page);

                PDImageXObject pdImage = null;
                PDImageXObject barcodeImage = null;
                try (InputStream logoStream = getClass().getResourceAsStream("/files/logo.png")) {
                    if (logoStream != null) {
                        pdImage = PDImageXObject.createFromByteArray(document, logoStream.readAllBytes(), "logo");
                    } else {
                        CustomException.get(CustomException.ErrorCode.INTERNAL, "Logo non trovato nei file di risorse").boom();
                    }
                }
                try {
                    byte[] decodedBytes = java.util.Base64.getDecoder().decode(barcodeGeneratorService.generateBarcodeOnlyBase64(numProtocollo));
                    barcodeImage = PDImageXObject.createFromByteArray(document, decodedBytes, "barcode");
                } catch (Exception e) {
                    CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nella generazione del codice a barre: " + e.getMessage()).boom();
                }

                try (PDPageContentStream contents = new PDPageContentStream(document, page)) {
                    if (pdImage != null) {
                        float scale = 0.25f;
                        float logoWidth = pdImage.getWidth() * scale;
                        float logoHeight = pdImage.getHeight() * scale;
                        float logoX = page.getMediaBox().getWidth() - logoWidth - margin - 15;
                        float logoY = page.getMediaBox().getHeight() - logoHeight - margin - 25;
                        contents.drawImage(pdImage, logoX, logoY, logoWidth, logoHeight);
                    }

                    if (barcodeImage != null) {
                        float barcodeWidth = 300;
                        float barcodeHeight = 30;
                        float barcodeX = margin + 5;
                        float barcodeY = page.getMediaBox().getHeight() - barcodeHeight - margin - 50;
                        contents.drawImage(barcodeImage, barcodeX, barcodeY, barcodeWidth, barcodeHeight);
                    }

                    contents.setStrokingColorSpace(PDDeviceRGB.INSTANCE);
                    contents.setNonStrokingColorSpace(PDDeviceRGB.INSTANCE);

                    float startY = (page.getMediaBox().getHeight() * 2 / 3) + 50;
                    float rectX = (page.getMediaBox().getWidth() - rectWidth) / 2;

                    for (int i = 0; i < rectSize; i++) {
                        float rectY;
                        if (i < rectSize - 1) {
                            rectY = startY - i * rectHeight;
                            contents.setNonStrokingColor(1.0f, 1.0f, 1.0f);
                            rectHeight = i == 5 ? rectHeight + 15 : rectHeight;
                            rectY = i == 5 ? rectY - 15 : rectY;
                            contents.addRect(rectX, rectY, rectWidth, rectHeight);
                            contents.fill();
                            contents.setStrokingColor(0.0f, 0.0f, 1.0f);
                            contents.setLineWidth(0.2f);
                            contents.addRect(rectX, rectY, rectWidth, rectHeight);
                            contents.stroke();
                        } else {
                            rectY = startY - ((i - 1) * rectHeight);
                        }

                        contents.beginText();
                        contents.setNonStrokingColor(0.0f, 0.0f, 0.0f);
                        contents.setFont(PDType1Font.HELVETICA, 12);
                        String textField = getRicevutaField(i + 1);
                        String textValues = fieldValues.get(i + 1);
                        float textX = i < rectSize - 1 ? rectX + 10 : rectX;
                        float textY = i < rectSize - 1 ? rectY + rectHeight - 20 : rectY + rectHeight - 40;
                        contents.newLineAtOffset(textX, textY);
                        contents.showText(sanitizeText(textField));
//                    log.info("textValues: {}", textValues);
                        for (String s : splitStringAtFirstSpaceAfter80Chars(textValues)) {
                            contents.newLineAtOffset(0, -15);
                            contents.showText(Utils.sanitizeCheckText(s));
                        }

                        contents.endText();
                    }
                }
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                document.save(byteArrayOutputStream);
                document.close();
                String base64String = Base64.getEncoder().encodeToString(byteArrayOutputStream.toByteArray());

                storicoService.insertNewStoricoForNumeroProtocollo(protocollo, ssoManager.extractIdFromToken(), ssoManager.extractNameFromToken(), StoricoOperazione.GenerazioneRicevuta.getStatoParameter(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()) ? "Circolare" : "Protocollo"), null);
                //storicoService.insertNewStoricoForNumeroProtocolloWithUtenteMock(protocollo, StoricoOperazione.GenerazioneRicevuta.getStato());

                return base64String;
            }

        } catch (Exception e) {
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore durante la generazione della Ricevuta: " + e.getMessage());
        }
    }

    private String sanitizeText(String text) {
        return text.replaceAll("[\\r\\n]", " ");
    }

    private byte[] toByteArray(InputStream inputStream) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int nRead;
        byte[] data = new byte[1024];
        while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }
        buffer.flush();
        return buffer.toByteArray();
    }

    private String getRicevutaField(Integer i) {
        Map<Integer, String> fields = new HashMap<>();
        fields.put(1, "Ente:");
        fields.put(2, "Codice Area Organizzativa Omogenea:");
        fields.put(3, "Numero:");
        fields.put(4, "Mittente:");
        fields.put(5, "Destinatari:");
        fields.put(6, "Oggetto:");
        fields.put(7, "Classificazione:");

        return fields.get(i);
    }

    public List<String> splitStringAtFirstSpaceAfter80Chars(String x) {
        List<String> result = new ArrayList<>();

        if (x == null || x.isEmpty()) {
            result.add("-");
            return result;
        }

        String[] lines = x.split("\\n"); // Spezza per righe esistenti
        for (String line : lines) {
            if (line.length() <= 80) {  // Se la riga è già corta, la aggiungiamo così com'è
                result.add(line);
            } else {  // Spezza solo se la lunghezza supera 80 caratteri
                int length = line.length();
                int start = 0;
                while (start < length) {
                    int end = Math.min(start + 80, length);
                    if (end < length) {
                        int spaceIndex = line.lastIndexOf(' ', end);
                        if (spaceIndex > start) {
                            end = spaceIndex; // Spezza alla prima spazio prima del limite
                        }
                    }
                    result.add(line.substring(start, end).trim());
                    start = end + 1;
                }
            }
        }

        return result;
    }

    @Transactional
    public String exportStorico (RicercaStoricoDTO dto, String formato){

        StoricoOutputDTO storico = storicoService.getLogStorici(dto,"export");
        List<Storico> logStorici = storico.getLogStorici();

        if(logStorici == null || logStorici.isEmpty()){
            CustomException.get(CustomException.ErrorCode.INTERNAL, "La ricerca non ha prodotto risultati da esportare").boom();
        }

        ByteArrayOutputStream excelOutputStream;
        ByteArrayOutputStream pdfOutputStream;

        try {
            excelOutputStream = this.generateExcelStorico(logStorici);
            if(formato.equalsIgnoreCase("EXCEL")){
                return org.apache.commons.codec.binary.Base64.encodeBase64String(excelOutputStream.toByteArray());
            }else if (formato.equalsIgnoreCase("PDF")){
                ByteArrayInputStream excelInputStream = new ByteArrayInputStream(excelOutputStream.toByteArray());
                pdfOutputStream = this.convertExcelToPdf(excelInputStream, "exportStorico");
                return org.apache.commons.codec.binary.Base64.encodeBase64String(pdfOutputStream.toByteArray());
            }else {
                CustomException.get(CustomException.ErrorCode.INTERNAL, "Formato export non supportato").boom();
            }

        } catch (IOException | DocumentException e) {
            log.error("Error generating Document file", e);
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Error generating Document file - " + e.getMessage()).boom();
        }
        return null;
    }

    @Transactional
    public String exportListaProtocolli (RicercaProtocolliDTO dto, String formato, List<Long> idProtocolliSelezionati){
        List<Protocollo> protocolli = protocolloService.getProtocolliToExport(dto, idProtocolliSelezionati != null && !idProtocolliSelezionati.isEmpty());
        if(protocolli == null || protocolli.isEmpty()){
            CustomException.get(CustomException.ErrorCode.INTERNAL, "La ricerca non ha prodotto risultati da esportare").boom();
        }

        List<Protocollo> protocolliToExport = new ArrayList<>();
        //se lista vuota o nulla -> si prendono tutti i protocolli tornati dalla ricerca
        if (idProtocolliSelezionati == null || idProtocolliSelezionati.isEmpty()) {
            protocolliToExport = protocolli;
        }
        //se la lista è piena -> si filtra la lista sugli id che sono stati selezionati
        else {
            if (idProtocolliSelezionati.size() > 150) {
                throw new RuntimeException("Numero risultati superiore al limite di 150.");
            }
            protocolliToExport = protocolli.stream().filter(p -> idProtocolliSelezionati.contains(p.getId())).toList();
        }

        //Colleziono tutti i fascicoli per poi poterli scrivere immediatamente nel file Excel
        Set<Long> idFascicoli = new HashSet<>();
        for(Protocollo p : protocolliToExport) {
            if (p.getProtocolliClassificazioneList() == null)
                continue;
            for(ProtocolliClassificazione pc : p.getProtocolliClassificazioneList()) {
                idFascicoli.add(pc.getIdTitolario());
            }
        }
        List<Titolario> fascicoli = Titolario.find("id in ?1", idFascicoli).list();

        Map<Long, String> mapFascicoliForHierachyString = new HashMap<>();
        for(Titolario fascicolo : fascicoli) {
            StringBuilder classificazione = new StringBuilder();
            List<TitolarioOutputDTO> titolari = titolarioService.getHierarchyForTitolarioId(fascicolo.getId()).getTitolario();
            titolari.forEach(t -> classificazione.append(t.getLabel()).append(" / "));
            classificazione.append(fascicolo.getNome());

            mapFascicoliForHierachyString.put(fascicolo.getId(), classificazione.toString());
        }

        ByteArrayOutputStream excelOutputStream;
        ByteArrayOutputStream pdfOutputStream;

        try {
            excelOutputStream = this.generateExcel(protocolliToExport, mapFascicoliForHierachyString);
            if(formato.equalsIgnoreCase("EXCEL")){
                return org.apache.commons.codec.binary.Base64.encodeBase64String(excelOutputStream.toByteArray());
            }else if (formato.equalsIgnoreCase("PDF")){
                ByteArrayInputStream excelInputStream = new ByteArrayInputStream(excelOutputStream.toByteArray());
                pdfOutputStream = this.convertExcelToPdf(excelInputStream, "exportProtocolli");
                return org.apache.commons.codec.binary.Base64.encodeBase64String(pdfOutputStream.toByteArray());
            }else {
                CustomException.get(CustomException.ErrorCode.INTERNAL, "Formato export non supportato").boom();
            }

        } catch (IOException | DocumentException e) {
            log.error("Error generating Document file", e);
            CustomException.get(CustomException.ErrorCode.INTERNAL, "Error generating Document file - " + e.getMessage()).boom();
        }
        return null;
    }

    public ByteArrayOutputStream generateExcelStorico(List<Storico> storico) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Storico");

        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setColor(IndexedColors.WHITE.getIndex());
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        CellStyle alternateRowStyle = workbook.createCellStyle();
        alternateRowStyle.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.getIndex());
        alternateRowStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        Row headerRow = sheet.createRow(0);
        String[] headers = {"UTENTE", "OPERAZIONE","DATA", "NOTE"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        int rowNum = 1;
        for (Storico logStorico : storico) {
            Row row = sheet.createRow(rowNum);
            CellStyle rowStyle = rowNum % 2 == 1 ? alternateRowStyle : null;

            createCell(row, 0, logStorico.getUtente(), rowStyle);
            createCell(row, 1, logStorico.getOperazione(), rowStyle);
            createCell(row, 2, Utils.fromDateToString(logStorico.getTsCreation(), Utils.DateFormat.DMY_HM), rowStyle);
            createCell(row, 3, logStorico.getNote(), rowStyle);
            rowNum++;
        }

        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream;
    }

    public ByteArrayOutputStream generateExcel(List<Protocollo> protocolli, Map<Long, String> mapFascicoliForHierachyString) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Protocolli");

        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setColor(IndexedColors.WHITE.getIndex());
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        CellStyle alternateRowStyle = workbook.createCellStyle();
        alternateRowStyle.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.getIndex());
        alternateRowStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        Row headerRow = sheet.createRow(0);
        String[] headers = {"NUMERO", "TIPO DI REGISTRAZIONE", "METODO DI SPEDIZIONE", "DATA INSERIMENTO",
                "OGGETTO", "MITTENTE", "ASSEGNATARIO", "STATO", "CLASSIFICAZIONE"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        int rowNum = 1;
        for (Protocollo protocollo : protocolli) {
            Row row = sheet.createRow(rowNum);
            CellStyle rowStyle = rowNum % 2 == 1 ? alternateRowStyle : null;

            createCell(row, 0, protocollo.getNProtocollo(), rowStyle);
            createCell(row, 1, protocollo.getTipoRegistrazione().getTipoRegistrazione(), rowStyle);
            createCell(row, 2, protocollo.getMetodoSpedizione().getMetodo(), rowStyle);
            createCell(row, 3, Utils.fromDateToString(protocollo.getTsCreation(), Utils.DateFormat.DMY_HM), rowStyle);
            createCell(row, 4, protocollo.getOggetto(), rowStyle);
            createCell(row, 5, protocollo.getMittente(), rowStyle);
            createCell(row, 6, protocollo.getAssegnatari(), rowStyle);
            createCell(row, 7, protocollo.getStato().getStato(), rowStyle);

            StringBuilder strClassificazioneProtocollo = new StringBuilder();
            if (mapFascicoliForHierachyString != null && protocollo.getProtocolliClassificazioneList() != null) {
                for(ProtocolliClassificazione pc : protocollo.getProtocolliClassificazioneList()) {
                    String fascicolo = mapFascicoliForHierachyString.getOrDefault(pc.getIdTitolario(), "");
                    strClassificazioneProtocollo.append(fascicolo).append("; ");
                }
            }
            createCell(row, 8, strClassificazioneProtocollo.isEmpty() ? "" : strClassificazioneProtocollo.substring(0, strClassificazioneProtocollo.length()-2), rowStyle);

            rowNum++;
        }

        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream;
    }

    private void createCell(Row row, int column, String value, CellStyle style) {
        Cell cell = row.createCell(column);
        cell.setCellValue(value);
        if (style != null) {
            cell.setCellStyle(style);
        }
    }

    public ByteArrayOutputStream convertExcelToPdf(InputStream excelInputStream, String from) throws IOException, DocumentException {
        Workbook workbook = WorkbookFactory.create(excelInputStream);
        Sheet sheet = workbook.getSheetAt(0);

        int totalRecords = sheet.getLastRowNum(); // Calculate the number of records

        // First pass to count the total pages
        Document tempDocument = new Document(PageSize.A4.rotate());
        PdfWriter tempWriter = PdfWriter.getInstance(tempDocument, new ByteArrayOutputStream());
        tempDocument.open();
        PdfPTable tempTable = createTableFromSheet(sheet);
        addTableToDocument(tempDocument, tempTable);
        int totalPages = tempWriter.getPageNumber();
        tempDocument.close();

        // Second pass to write the actual content
        ByteArrayOutputStream pdfOutputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter writer = PdfWriter.getInstance(document, pdfOutputStream);

        // Create page event and set it to the writer
        HeaderFooterPageEvent event = new HeaderFooterPageEvent(totalRecords, from);
        event.setTotalPages(totalPages); // Set the total pages before opening the document
        writer.setPageEvent(event);

        document.open();
        PdfPTable table = createTableFromSheet(sheet);
        addTableToDocument(document, table);
        document.close();

        workbook.close();
        return pdfOutputStream;
    }

    private PdfPTable createTableFromSheet(Sheet sheet) throws DocumentException {
        PdfPTable table = new PdfPTable(sheet.getRow(0).getLastCellNum());
        table.setWidthPercentage(100);

        // Add header row
        Row headerRow = sheet.getRow(0);
        for (Cell cell : headerRow) {
            PdfPCell pdfCell = new PdfPCell(new Phrase(getCellText(cell, false), FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.WHITE)));
            pdfCell.setBackgroundColor(BaseColor.BLUE);
            pdfCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            pdfCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            table.addCell(pdfCell);
        }

        // Add data rows
        for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
            Row row = sheet.getRow(rowIndex);
            if (row != null) {
                for (Cell cell : row) {
                    PdfPCell pdfCell = new PdfPCell(new Phrase(getCellText(cell, false)));
                    if (rowIndex % 2 == 1) {
                        pdfCell.setBackgroundColor(new BaseColor(240, 248, 255)); // Light blue color for alternate rows
                    }
                    table.addCell(pdfCell);
                }
            }
        }

        return table;
    }

    private void addTableToDocument(Document document, PdfPTable table) throws DocumentException {
        document.add(table);
        document.newPage();
    }

    private String getCellText(Cell cell, boolean isHeader) {
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return Double.toString(cell.getNumericCellValue());
                }
            case BOOLEAN:
                return Boolean.toString(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return isHeader ? "" : "";
        }
    }

    public ImportResult validazioneExcelProtocolloEmergenza(InputStream inputStream) {
        List<ProtocolloEmergenzaDTO> protocolli = new ArrayList<>();
        List<ErrorRecord> errors = new ArrayList<>();
        Long rowIndex = 2L;

        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();


            // Skip the first row (header)
            if (rowIterator.hasNext()) {
                rowIterator.next();
            }
            int emptyRowCount = 0;
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();

                // Controlla se la riga è vuota
                if (isRowEmpty(row)) {
                    emptyRowCount++;
                    if (emptyRowCount >= 20) {
                        break; // Ferma il ciclo dopo 20 righe vuote consecutive
                    }
                    continue; // Salta all'iterazione successiva
                } else {
                    emptyRowCount = 0; // Resetta il contatore se la riga non è vuota
                }


                List<String> rowErrors = new ArrayList<>();
                ProtocolloEmergenzaDTO protocolloEmergenzaDTO = new ProtocolloEmergenzaDTO();

                // * Numero autorizzazione
                // * Numero protocollo emergenza
                // * Tipologia di protocollo
                // * Modalità di spedizione
                // * Data protocollo emergenza
                // Classificazione
                // Data prot. Mittente
                // Numero protocollo mittente
                // * Mittente
                // * Destinatario
                // * Oggetto

                for (Cell cell : row) {
                    switch (cell.getColumnIndex()) {
                        case 0:
                            protocolloEmergenzaDTO.setNAutorizzazione(getCellValue(null, cell, "UNKNOWN", rowErrors));
                            break;
                        case 1:
                            if (cell.getCellType().equals(CellType.FORMULA)) {
                                CellValue val = evaluator.evaluate(cell);
                                String nProtocolloEmergenza = String.valueOf((int)Math.round(val.getNumberValue()));
                                protocolloEmergenzaDTO.setNProtocolloEmergenza(nProtocolloEmergenza);
                            }
                            else {
                                protocolloEmergenzaDTO.setNProtocolloEmergenza(getCellValue(null, cell, "UNKNOWN", rowErrors));
                            }
                            break;
                        case 2:
                            protocolloEmergenzaDTO.setTipologia(getCellValue(null, cell, "UNKNOWN", rowErrors));
                            break;
                        case 3:
                            protocolloEmergenzaDTO.setMetodo(getCellValue(null, cell, "UNKNOWN", rowErrors));
                            break;
                        case 4:
                        {
                            if (DateUtil.isCellDateFormatted(cell)) {
                                protocolloEmergenzaDTO.setDataProtocolloEmergenza(cell.getDateCellValue());
                            }
                            else {
                                String dateProtocolloEmergenza = getCellValue(null, cell, "UNKNOWN", rowErrors);
                                if (dateProtocolloEmergenza != null) {
                                    protocolloEmergenzaDTO.setDataProtocolloEmergenza(Utils.parseDate(dateProtocolloEmergenza, "dd/MM/yyyy"));
                                }
                            }
                        }
                            break;
                        case 5:
                            protocolloEmergenzaDTO.setTitolario(getCellValue(null, cell, "UNKNOWN", rowErrors));
                            break;
                        case 6:
                        {
                            if (DateUtil.isCellDateFormatted(cell)) {
                                protocolloEmergenzaDTO.setDataProtocolloMittente(cell.getDateCellValue());
                            }
                            else {
                                String dateProtocolloMittente = getCellValue(null, cell, "UNKNOWN", rowErrors);
                                if (dateProtocolloMittente != null) {
                                    protocolloEmergenzaDTO.setDataProtocolloMittente(Utils.parseDate(dateProtocolloMittente, "dd/MM/yyyy"));
                                }
                            }
                        }
                            break;
                        case 7:
                            protocolloEmergenzaDTO.setNProtocolloMittente(getCellValue(null, cell, "UNKNOWN", rowErrors));
                            break;
                        case 8:
                            protocolloEmergenzaDTO.setMittente(getCellValue(null, cell, "UNKNOWN", rowErrors));
                            break;
                        case 9:
                            protocolloEmergenzaDTO.setDestinatari(getCellValue(null, cell, "UNKNOWN", rowErrors));
                            break;
                        case 10:
                            protocolloEmergenzaDTO.setOggetto(getCellValue(null, cell, "UNKNOWN", rowErrors));
                            break;
                        default:
                            break;
                    }
                }

                if (protocolloEmergenzaDTO.isEmpty()) {
                    rowIndex++;
                    continue;
                }

                if (!protocolloEmergenzaDTO.isEmpty() && !protocolloEmergenzaDTO.isValid()) {
                    rowErrors.add("Protocollo di emergenza in riga " + rowIndex + " non valido");
                }

                if (rowErrors.isEmpty()) {
                    protocolli.add(protocolloEmergenzaDTO);
                } else {
                    Long finalRowIndex = rowIndex;
                    rowErrors.forEach(e -> log.error("{}: {}", finalRowIndex, e));
                    errors.add(new ErrorRecord(rowIndex, String.join(", ", rowErrors)));
                }

                rowIndex++;
            }
        } catch (IOException e) {
            errors.clear();
            errors.add(new ErrorRecord(-1L, "Errore nella lettura del file Excel: " + e.getMessage()));
        }

        return !errors.isEmpty() ? new ImportResult<>(false, errors) : new ImportResult<>(true, protocolli);
    }

    public ImportResult validazioneExcelAnagrafica(InputStream inputStream) {
        List<Anagrafica> contatti = new ArrayList<>();
        List<ErrorRecord> errors = new ArrayList<>();
        Long rowIndex = 2L;

        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            // Skip the first row (header)
            if (rowIterator.hasNext()) {
                rowIterator.next();
            }
            int emptyRowCount = 0;
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();

                // Controlla se la riga è vuota
                if (isRowEmpty(row)) {
                    emptyRowCount++;
                    if (emptyRowCount >= 20) {
                        break; // Ferma il ciclo dopo 20 righe vuote consecutive
                    }
                    continue; // Salta all'iterazione successiva
                } else {
                    emptyRowCount = 0; // Resetta il contatore se la riga non è vuota
                }


                List<String> rowErrors = new ArrayList<>();
                Anagrafica anagrafica = new Anagrafica();

                for (Cell cell : row) {
                    switch (cell.getColumnIndex()) {
                        case 0:
                            anagrafica.setRagioneSociale(getCellValue(anagrafica, cell, "DES_COMPANY_NAME", rowErrors));
                            break;
                        case 1:
                            anagrafica.setNome(getCellValue(anagrafica, cell, "DES_NOME", rowErrors));
                            break;
                        case 2:
                            anagrafica.setCognome(getCellValue(anagrafica,cell, "DES_COGNOME", rowErrors));
                            break;
                        case 3:
                            anagrafica.setCfPiva(getCellValue(anagrafica,cell, "PFS_PERS_FSC_CODE", rowErrors));
                            break;
                        case 4:
                            anagrafica.setIndirizzo(getCellValue(anagrafica,cell, "DES_ADDRESS_ROW_1", rowErrors));
                            break;
                        case 5:
                            anagrafica.setCitta(getCellValue(anagrafica,cell, "DES_CITTA", rowErrors));
                            break;
                        case 6:
                            anagrafica.setCap(getCellValue(anagrafica,cell, "ZIP_ZIPCODE", rowErrors));
                            break;
                        case 7:
                            anagrafica.setProvincia(getCellValue(anagrafica,cell, "DES_PROVINCIA", rowErrors));
                            break;
                        case 8:
                            anagrafica.setEmail(getCellValue(anagrafica,cell, "DES_E_MAIL", rowErrors));
                            break;
                        case 9:
                            anagrafica.setPec(getCellValue(anagrafica,cell, "pec", rowErrors));
                            break;
                        case 10:
                            anagrafica.setTelefono(getCellValue(anagrafica,cell, "DES_TELEPHONE", rowErrors));
                            break;
                        case 11:
                            anagrafica.setFax(getCellValue(anagrafica,cell, "DES_FAX", rowErrors));
                            break;
                        case 12:
                            anagrafica.setNote("Contatto importato da excel " + getCellValue(anagrafica,cell, "DES_NOTE", rowErrors));
                            break;
                        default:
                            break;
                    }
                }

                if (rowErrors.isEmpty() && rowErrors.size() <= 0) {
                    anagrafica.setCertificato(true);
                    contatti.add(anagrafica);
                } else {
                    Long finalRowIndex = rowIndex;
                    rowErrors.forEach(e -> log.error("{}: {}", finalRowIndex, e));
                    errors.add(new ErrorRecord(rowIndex, String.join(", ", rowErrors)));
                }

                rowIndex++;
            }

        } catch (IOException e) {
            errors.clear();
            errors.add(new ErrorRecord(-1L, "Errore nella lettura del file Excel: " + e.getMessage()));
        }

        return !errors.isEmpty() ? new ImportResult<>(false, errors) : new ImportResult<>(true, contatti);
    }

    private String getCellValue(Anagrafica anagrafica, Cell cell, String fieldName, List<String> rowErrors) {
        String value;
        boolean isEmailNull = false;
        try {
            switch (cell.getCellType()) {
                case STRING:
                    value = cell.getStringCellValue().trim();
                    break;
                case NUMERIC:
                    double cellValue = cell.getNumericCellValue();
                    if (cellValue > 1e10 || cellValue < -1e10) {
                        value = BigDecimal.valueOf(cellValue).toPlainString();
                    } else if (cellValue % 1 == 0) {
                        value = String.valueOf((long) cellValue);
                    }else {
                        value = String.valueOf(cellValue);
                    }
                    break;
                case BOOLEAN:
                    value = String.valueOf(cell.getBooleanCellValue()).trim();
                    break;
                case FORMULA:
                    value = cell.getCellFormula().trim();
                    break;
                case BLANK:
                    value = "";
                    break;
                default:
                    value = null;
                    break;
            }

            if (fieldName.equalsIgnoreCase("DES_COMPANY_NAME")) {
                if (value == null || value.isEmpty()) {
                    rowErrors.add("Campo 'DES_COMPANY_NAME' obbligatorio");
                }
            /*
            } else if (fieldName.equalsIgnoreCase("PFS_PERS_FSC_CODE")) {
                if (value == null || value.isEmpty()) {
                    rowErrors.add("Campo 'PFS_PERS_FSC_CODE' obbligatorio");
                }
            } else if (fieldName.equalsIgnoreCase("DES_ADDRESS_ROW_1")) {
                if (value == null || value.isEmpty()) {
                    rowErrors.add("Campo 'DES_ADDRESS_ROW_1' obbligatorio");
                }
            */
            }
            else if(fieldName.equalsIgnoreCase("DES_E_MAIL"))
            {
                // Validazione Email
                if (value != null && !value.isEmpty()) {
                    value = Utils.sanitize(value);
                    if(!Utils.isValidEmail(value)){
                        rowErrors.add("Formato email non valido");
                    }
                }
            }
            else if (fieldName.equalsIgnoreCase("pec")) {
                // Validazione PEC
                if (value != null && !value.isEmpty()) {
                    value = Utils.sanitize(value);
                    if(!Utils.isValidEmail(value)){
                        rowErrors.add("Formato PEC non valido");
                    }
                }
                else if ((value == null || value.isEmpty() || !Utils.isValidEmail(value)) && (anagrafica.getEmail() == null || anagrafica.getEmail().isEmpty() || !Utils.isValidEmail(anagrafica.getEmail()))){
                    rowErrors.add("Almeno un campo tra 'pec' o 'email' obbligatorio");
                }
            } else if (fieldName.equalsIgnoreCase("DES_TELEPHONE")) {
                if (value != null && value.length() >= 20) {
                    rowErrors.add("Numero di telefono troppo lungo");
                }
            } else if (fieldName.equalsIgnoreCase("DES_FAX")) {
                if (value != null && value.length() >= 20) {
                    rowErrors.add("Numero di fax troppo lungo");
                }
            }

        } catch (Exception e) {
            rowErrors.add(String.format("Errore nella lettura del campo %s", fieldName));
            CustomException.get(CustomException.ErrorCode.INTERNAL, String.format("Errore nella lettura del campo %s, Error message:", fieldName, e.getMessage())).boom();
            return null;
        }

        return value;
    }

    private boolean isRowEmpty(Row row) {
        if (row == null) {
            return true;
        }

        for (Cell cell : row) {
            if (cell.getCellType() != CellType.BLANK) {
                return false;
            }
        }
        return true;
    }


    /**
     * Permette di ridurre la lunghezza del fileName
     *
     * @param {string} fileName - il nome completo del file, inclusa l'estensione
     * @param {number} maxLength - la lunghezza massima del nome del file
     * @return {string} - il nome del file troncato con "..." se necessario, seguito dall'estensione
     */
    public String shortenFileName(String fileName, Integer maxLength) {

        if (fileName == null || fileName.isEmpty()) {
            throw new IllegalArgumentException("Il nome del file non può essere nullo o vuoto");
        }

        String shortFileName = fileName;
        if (fileName.length() > maxLength) {
            int dotIndex = fileName.lastIndexOf('.');
            String extension = (dotIndex > 0) ? fileName.substring(dotIndex) : "";
            String baseName = (dotIndex > 0) ? fileName.substring(0, dotIndex) : fileName;

            // Controlla che `baseName` non sia più corto di `maxLength` altrimenti scatena una index out of bound
            if (baseName.length() > maxLength - 3) {
                baseName = baseName.substring(0, maxLength - 3);
            }

            shortFileName = baseName + "..." + extension;
        }

        return shortFileName;
    }

    public String createPdfRegistro(ListProtocolloDTOForRegistro protocolli, String titolo) throws IOException, DocumentException {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter writer = PdfWriter.getInstance(document, baos);

            if (titolo.isEmpty() || titolo == null)
                throw new IllegalArgumentException("Il Titolo non può essere vuoto");

            writer.setPageEvent(new PageNumerationEvent());

            document.open();

            // Carica il logo e aggiungilo al documento
            PDImageXObject pdImage = null;
            try (InputStream logoStream = getClass().getResourceAsStream("/files/logo.png")) {
                if (logoStream != null) {
                    byte[] logoBytes = logoStream.readAllBytes();
                    Image logo = Image.getInstance(logoBytes);
                    logo.scaleToFit(100, 100); // Ridimensiona il logo se necessario
                    logo.setAlignment(Element.ALIGN_CENTER); // Centra il logo
                    document.add(logo);
                }
            }

            // Definisci colori
            BaseColor headerBackgroundColor = new BaseColor(63, 169, 245);
            BaseColor rowBackgroundColor = new BaseColor(235, 245, 251);
            BaseColor borderColor = new BaseColor(200, 200, 200);

            // Aggiungi un titolo al documento
            com.itextpdf.text.Font titleFont = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 16, com.itextpdf.text.Font.BOLD);
            Paragraph title = new Paragraph(titolo, titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

        /*// Aggiungi un’intestazione
        com.itextpdf.text.Font headerFont = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 10, com.itextpdf.text.Font.ITALIC);
        Paragraph header = new Paragraph("RE", headerFont);
        header.setAlignment(Element.ALIGN_CENTER);
        header.setSpacingAfter(10);
        document.add(header);*/

            // Aggiungi una tabella con 6 colonne per i campi del protocollo
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2, 2, 4, 4, 4});

            // Aggiungi intestazioni alla tabella con stile
            com.itextpdf.text.Font headerCellFont = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 10, com.itextpdf.text.Font.BOLD, BaseColor.WHITE);
            String[] headers = {"Numero", "Data", "Oggetto", "Mittente/Destinatario", "Titolo"};
            for (String headerText : headers) {
                PdfPCell headerCell = new PdfPCell(new Phrase(headerText, headerCellFont));
                headerCell.setBackgroundColor(headerBackgroundColor);
                headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                headerCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                headerCell.setBorderColor(borderColor);
                table.addCell(headerCell);
            }

            // Alterna i colori delle righe
            boolean rowColorToggle = false;

            // Popola la tabella con i protocolli
            for (ProtocolloForRegistroDTO protocollo : protocolli.getProtocolli()) {
                BaseColor backgroundColor = rowColorToggle ? rowBackgroundColor : BaseColor.WHITE;
                rowColorToggle = !rowColorToggle;

                table.addCell(createStyledCell(protocollo.nProtocollo, backgroundColor, borderColor));
                LocalDateTime localDateTime = protocollo.dataCreazione.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                table.addCell(createStyledCell(localDateTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")), backgroundColor, borderColor));
                table.addCell(createStyledCell(protocollo.oggetto, backgroundColor, borderColor));


                // Costruisce la stringa Mittente/Destinatari
                StringBuilder mittenteDestinatari = new StringBuilder(protocollo.mittente == null ? "N.D." : protocollo.mittente);
                String destinatari = protocollo.getStringDestinatari();
                if (!destinatari.isEmpty())
                    mittenteDestinatari.append(" / ").append(destinatari);

                // Aggiungi la cella Mittente/Destinatari
                table.addCell(createStyledCell(mittenteDestinatari.toString(), backgroundColor, borderColor));

                List<String> fascicoli = protocolli.getHierarchiesForProtocollo(protocollo.id);
                StringBuilder cellTitolo = new StringBuilder();

                //genera stringa delle n classificazioni
                for (int i = 0; i < fascicoli.size(); i++) {
                    cellTitolo.append(fascicoli.get(i));
                    if (i < fascicoli.size() - 1)
                        cellTitolo.append(" ## ");
                }

                table.addCell(createStyledCell(cellTitolo.toString(), backgroundColor, borderColor));
            }

            // Aggiungi la tabella al documento
            document.add(table);

        /*// Aggiungi un piè di pagina
        com.itextpdf.text.Font footerFont = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 8);
        Paragraph footer = new Paragraph("Generato il: " + java.time.LocalDate.now(), footerFont);
        footer.setAlignment(Element.ALIGN_RIGHT);
        footer.setSpacingBefore(20);
        document.add(footer);*/

            // Chiudi il documento
            document.close();

            // Converte il PDF in stringa Base64
            return Base64.getEncoder().encodeToString(baos.toByteArray());
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    // Funzione per creare celle stilizzate
    private PdfPCell createStyledCell(String content, BaseColor backgroundColor, BaseColor borderColor) {
        com.itextpdf.text.Font cellFont = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 10);
        PdfPCell cell = new PdfPCell(new Phrase(content, cellFont));
        cell.setBackgroundColor(backgroundColor);
        cell.setBorderColor(borderColor);
        cell.setPadding(5);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        return cell;
    }

    public String getPdfRegistroGiornaliero(Date data) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        try {
            Calendar calStart = Calendar.getInstance();
            calStart.setTime(data);
            calStart.set(Calendar.HOUR_OF_DAY, 0);
            calStart.set(Calendar.MINUTE, 0);
            calStart.set(Calendar.SECOND, 0);
            calStart.set(Calendar.MILLISECOND, 0);
            Date tsCreation_DA = calStart.getTime();
            // Aggiungi un giorno per ottenere il giorno successivo alle 00:00:00
            calStart.add(Calendar.DAY_OF_MONTH, 1);
            Date tsCreation_A = calStart.getTime();

            String nativeQuery = "select p.id, p.n_protocollo, p.ts_creation, p.oggetto, p.mittente, rp.nome_destinatario, rp.assegnato, t.id as id_fascicolo, t.nome as nome_fascicolo " +
                    "from protocolli p " +
                    "left join referenti_protocollo rp on (p.id = rp.id_protocollo) " +
                    "left join protocolli_classificazione pc on (p.id = pc.id_protocollo) " +
                    "left join titolario t on (pc.id_titolario = t.id) " +
                    "where p.tipo_registrazione != 'Circolare' and p.ts_creation >= :ts_creation_from and p.ts_creation < :ts_creation_to " +
                    "order by n_protocollo";
            List<Object[]> rowsFromDb = em.createNativeQuery(nativeQuery)
                    .setParameter("ts_creation_from", tsCreation_DA)
                    .setParameter("ts_creation_to", tsCreation_A)
                    .getResultList();

            ListProtocolloDTOForRegistro listProtocolloDTOForRegistro = new ListProtocolloDTOForRegistro();
            for(Object[] row  : rowsFromDb) {
                Long idProtocollo = (Long) row[0];
                String nProtocollo = (String) row[1];
                Date tsCreation = (Date) row[2];
                String oggetto = (String) row[3];
                String mittente = (String) row[4];
                String destinatario = (String) row[5];
                boolean assegnato = (Boolean) (row[6] == null ? false : row[6]);
                Long idFascicolo = (Long) row[7];
                String nomeFascicolo = (String) row[8];
                if (destinatario != null && !assegnato)
                    continue;
                listProtocolloDTOForRegistro.addProtocolloFromDbRow(idProtocollo, nProtocollo, tsCreation, oggetto, mittente, destinatario, idFascicolo, nomeFascicolo);
            }
            Set<Long> idFascicoli = listProtocolloDTOForRegistro.getFascicoliId();

            Map<Long, String> fullHierarchies = new HashMap<>();
            for(Long idFascicolo : idFascicoli) {
                List<Titolario> t = titolarioService.getHierarchyTitolarioForTitolarioId(idFascicolo);
                StringBuilder fullHierarchy = new StringBuilder("TITOLI / ");
                for(int i=t.size()-1;i>=0;i--) {
                    fullHierarchy.append(t.get(i).getNome()).append(" / ");
                }
                fullHierarchies.put(idFascicolo, fullHierarchy.substring(0, fullHierarchy.length() - 3).toString());
            }
            listProtocolloDTOForRegistro.setFascicoliHierachies(fullHierarchies);


            LogUtils.exiting(LogUtils.LogLevel.DEBUG);

            LocalDate localDate = data.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            return createPdfRegistro(listProtocolloDTOForRegistro, "REGISTRO GIORNALIERO DEL " + localDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        } catch (Exception e) {
            LogUtils.exiting(LogUtils.LogLevel.ERROR);
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}

