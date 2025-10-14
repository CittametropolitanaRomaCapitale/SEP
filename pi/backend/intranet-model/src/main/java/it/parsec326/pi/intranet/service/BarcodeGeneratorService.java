package it.parsec326.pi.intranet.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.oned.Code128Writer;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.model.Protocollo;
import it.parsec326.pi.intranet.utils.LogUtils;
import it.parsec326.pi.intranet.utils.Utils;
import it.parsec326.pi.intranet.utils.common.StoricoOperazione;
import it.parsec326.pi.intranet.utils.common.TipoRegistrazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.ParseException;
import java.util.Base64;

@ApplicationScoped
@Slf4j
public class BarcodeGeneratorService {

    private static final int imageMargin = 20;
    private static final int widthTotal = (int) (350 * 96 / 25.4);
    private static final int heightTotal = (int) (167 * 96 / 25.4);
    private static final int widthBarcode = widthTotal;
    private static final int heightBarcode = heightTotal/2;
    private static final int fontSizeNProtocollo = 100;
    private static final int fontSizeTsCreation = 80;

    @Inject
    ProtocolloService protocolloService;

    @Inject
    StoricoService storicoService;

    @Inject
    SSOClient ssoManager;

    /**
     * Genera un barcode in formato base 64 senza le informazioni sul numero di protocollo e il timestamp creation.
     * @param nProtocollo
     * @return
     * @throws IOException
     */
    public String generateBarcodeOnlyBase64(String nProtocollo) throws IOException {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);

        if (nProtocollo == null || nProtocollo.isEmpty())
            throw new IllegalArgumentException("Numero protocollo assente in " + LogUtils.getCallerInfo());

        // Creazione del codice a barre Code128
        BitMatrix bitMatrix = new Code128Writer().encode(nProtocollo, BarcodeFormat.CODE_128, widthBarcode, heightBarcode, null);

        // Conversione del BitMatrix in BufferedImage
        BufferedImage barcodeImage = new BufferedImage(bitMatrix.getWidth(), bitMatrix.getHeight(), BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < bitMatrix.getWidth(); x++) {
            for (int y = 0; y < bitMatrix.getHeight(); y++) {
                barcodeImage.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
            }
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(barcodeImage, "PNG", baos);
        baos.flush();
        byte[] imageBytes = baos.toByteArray();
        baos.close();

        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return Base64.getEncoder().encodeToString(imageBytes);
    }

    /**
     * Genera un barcode in formato base 64 con le informazioni sul numero di protocollo e il timestamp creation.
     * @param nProtocollo
     * @return
     * @throws IOException
     */
    public String generateBarcodeBase64(String nProtocollo) throws IOException {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        try (PDDocument document = new PDDocument()) {

            Protocollo protocollo = protocolloService.getProtocolloByNumero(nProtocollo);

            // Recupera il timestamp creation del protocollo
            String tsCreation = String.valueOf(protocollo.getTsCreation());
            tsCreation = Utils.formatDate(tsCreation, Utils.DateFormat.YMD_HMSM, Utils.DateFormat.DMY_HMS);

            if (tsCreation == null || tsCreation.isEmpty())
                throw new IllegalArgumentException("Timestamp creation non è presente per il protocollo numero " + nProtocollo + " in " + LogUtils.getCallerInfo());

            // Crea un oggetto PDRectangle con le dimensioni desiderate
            PDRectangle customPageSize = new PDRectangle(widthTotal, heightTotal);

            // Crea una nuova pagina utilizzando le dimensioni personalizzate
            PDPage page = new PDPage(customPageSize);
            document.addPage(page);
            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            // Calcola le coordinate per posizionare il barcode in alto al centro
            float barcodeX = imageMargin; // Coordinata X per centrare il barcode orizzontalmente
            float barcodeY = heightBarcode+imageMargin*2; // Coordinata Y per posizionare il barcode in alto

            // Aggiungi il barcode
            byte[] decodedBytes = java.util.Base64.getDecoder().decode(generateBarcodeOnlyBase64(nProtocollo));
            contentStream.drawImage(PDImageXObject.createFromByteArray(document, decodedBytes, "barcode"), barcodeX, barcodeY, widthBarcode-imageMargin-imageMargin, heightBarcode/2);

            // Aggiungi il numero del protocollo centrato
            float numeroProtocolloWidth = PDType1Font.HELVETICA.getStringWidth(nProtocollo) / 1000f * fontSizeNProtocollo; // Larghezza del testo del protocollo con font size 60
            float numeroProtocolloX = (page.getMediaBox().getWidth() - numeroProtocolloWidth) / 2; // Calcolo della coordinata X per centrare il testo
            contentStream.beginText();
            contentStream.setFont(PDType1Font.HELVETICA, fontSizeNProtocollo);
            contentStream.newLineAtOffset(numeroProtocolloX, heightTotal - heightBarcode - imageMargin*5); // Posizione del testo
            contentStream.showText(nProtocollo);
            contentStream.endText();

            // Aggiungi il timestamp di creazione centrato
            float tsCreationWidth = PDType1Font.HELVETICA.getStringWidth(tsCreation) / 1000f * fontSizeTsCreation; // Larghezza del testo del timestamp con font size 50
            float tsCreationX = (page.getMediaBox().getWidth() - tsCreationWidth) / 2; // Calcolo della coordinata X per centrare il testo
            contentStream.beginText();
            contentStream.setFont(PDType1Font.HELVETICA, fontSizeTsCreation);
            contentStream.newLineAtOffset(tsCreationX, heightTotal - heightBarcode - imageMargin*10); // Posizione del testo
            contentStream.showText(tsCreation);
            contentStream.endText();

            // Chiude il pdf
            contentStream.close();

            // Versienti: Riga lasciata a scopo di test/debug
            // document.save("C:\\apps\\cmrc\\Barcode-"+nProtocollo+".pdf");

            // Prende il byte[]
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            byte[] pdfBytes = baos.toByteArray();
            String base64String = Base64.getEncoder().encodeToString(pdfBytes);


            storicoService.insertNewStoricoForNumeroProtocollo(protocollo, ssoManager.extractIdFromToken(), ssoManager.extractNameFromToken(), StoricoOperazione.GenerazioneBarCode.getStatoParameter(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione()) ? "Circolare" : "Protocollo"), null);
            //storicoService.insertNewStoricoForNumeroProtocolloWithUtenteMock(protocollo, StoricoOperazione.GenerazioneBarCode.getStato());

            LogUtils.exiting(LogUtils.LogLevel.DEBUG);
            return base64String;
        } catch (ParseException e) {
            LogUtils.entering(LogUtils.LogLevel.ERROR);
            throw new RuntimeException(e);
        }
    }
}