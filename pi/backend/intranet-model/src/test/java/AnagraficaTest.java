import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import it.parsec326.pi.intranet.dto.excel.ErrorRecord;
import it.parsec326.pi.intranet.dto.excel.ImportResult;
import it.parsec326.pi.intranet.dto.input.AnagraficaInput;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.mapper.AnagraficaMapper;
import it.parsec326.pi.intranet.model.Anagrafica;
import it.parsec326.pi.intranet.service.AnagraficaService;
import it.parsec326.pi.intranet.service.DocumentService;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

@QuarkusTest
public class AnagraficaTest {

    @Inject
    EntityManager em;
    @Inject
    AnagraficaService anagraficaService;
    @Inject
    DocumentService documentService;

    Anagrafica contattoAnagrafica = mock(Anagrafica.class);
    AnagraficaMapper anagraficaMapperMock = mock(AnagraficaMapper.class);

    @Test
    public void anagraficaModel_checksTipoPersonaSuccessfully() {
        Anagrafica fisica = new Anagrafica();
        fisica.setNome("Nome");
        fisica.setCognome("Cognome");
        fisica.setCfPiva("AAAAAA00A00A000A");
        assertTrue((fisica.isPersonaFisica()) && (!fisica.isPersonaGiuridica()));

        Anagrafica giuridica = new Anagrafica();
        giuridica.setRagioneSociale("Società");
        giuridica.setCfPiva("12345678901");
        assertTrue((!giuridica.isPersonaFisica()) && (giuridica.isPersonaGiuridica()));

        Anagrafica no_tipo = new Anagrafica();
        no_tipo.setRagioneSociale("Società");
        no_tipo.setNome("Nome");
        giuridica.setCfPiva("");
        assertTrue((!no_tipo.isPersonaFisica()) && (!no_tipo.isPersonaGiuridica()));

    }

    @Test
    @TestTransaction
    public void insertAnagrafica_insertsSuccessfully_thenThrowsExceptionForSameInput() {

        AnagraficaInput input = new AnagraficaInput();
        input.setRagioneSociale("");
        input.setNome("Nome test");
        input.setCognome("Cognome test");
        input.setCfPiva("AAAAAA00A00A000A");
        input.setIndirizzo("Indirizzo test");
        input.setCitta("Roma");
        input.setCap("00100");
        input.setProvincia("RM");
        input.setEmail("mail@mail.test");
        input.setPec("pec@pec.test");
        input.setTelefono("123456");
        input.setFax("fax");
        input.setNote("");

        //inserimento in db
        Anagrafica entity = anagraficaService.saveContattoInput(input);
        Assertions.assertNotNull(entity);

        //lancio eccezione (record già esistente)
        Assertions.assertThrows(CustomException.class, () -> anagraficaService.saveContattoInput(input));

        //lancio eccezione con input null
        assertThrows(NullPointerException.class, () -> anagraficaService.saveContattoInput(null));
    }

    @Test
    @TestTransaction
    public void insertAnagrafica_restoresDeletedAnagraficaSuccessfully() {

        AnagraficaInput input = new AnagraficaInput();
        input.setRagioneSociale("");
        input.setNome("Nome test");
        input.setCognome("Cognome test");
        input.setCfPiva("AAAAAA00A00A000A");
        input.setIndirizzo("Indirizzo test");
        input.setCitta("Roma");
        input.setCap("00100");
        input.setProvincia("RM");
        input.setEmail("mail@mail.test");
        input.setPec("pec@pec.test");
        input.setTelefono("123456");
        input.setFax("fax");
        input.setNote("");

        //inserimento in db
        Anagrafica entity = anagraficaService.saveContattoInput(input);
        Assertions.assertNotNull(entity);

        //cancello logicamente il contatto
        Assertions.assertTrue(anagraficaService.deleteContatto(entity.getId()));

        input.setProvincia("FR");
        Anagrafica entity2 = anagraficaService.saveContattoInput(input);

        Assertions.assertEquals(entity2.getProvincia(), "FR");
        assertFalse(entity.isCancellato());
    }


    @Test
    @TestTransaction
    public void updateAnagrafica_throwsException() {
        assertThrows(IllegalArgumentException.class, () -> anagraficaService.updateContattoInput(null, null));
        assertThrows(IllegalArgumentException.class, () -> anagraficaService.updateContattoInput(1L, null));
    }

    @Test
    @TestTransaction
    public void updateAnagrafica_updatesSuccessfully() {
        AnagraficaInput input = new AnagraficaInput();
        input.setRagioneSociale("");
        input.setNome("Nome test");
        input.setCognome("Cognome test");
        input.setCfPiva("AAAAAA00A00A000A");
        input.setIndirizzo("Indirizzo test");
        input.setCitta("Roma");
        input.setCap("00100");
        input.setProvincia("RM");
        input.setEmail("mail@mail.test");
        input.setPec("pec@pec.test");
        input.setTelefono("123456");
        input.setFax("fax");
        input.setNote("");
        Anagrafica entity = anagraficaService.saveContattoInput(input);
        Assertions.assertNotNull(entity);

        input.setRagioneSociale("Ragione sociale 2");
        input.setCfPiva("AAAAAA00A00A000B");
        Anagrafica entity2 = anagraficaService.saveContattoInput(input);
        Assertions.assertNotNull(entity2);

        // ==============================================
        // test update con findbyid
        input.setNote("Aggiornata ragione sociale");
        input.setCfPiva("AAAAAA00A00A000A");
        input.setRagioneSociale("Ragione sociale 1");
        entity = anagraficaService.updateContattoInput(entity.getId(), input);
        Assertions.assertNotNull(entity);
        Assertions.assertEquals("Ragione sociale 1", entity.getRagioneSociale());

        // test update che ritorna eccezione
        assertThrows(CustomException.class, () -> anagraficaService.updateContattoInput(entity2.getId(), input));

        // test update con find by campi univoci
        input.setNote("Aggiornata ragione sociale nuova");
        entity = anagraficaService.updateContattoInput(entity.getId(), input);
        Assertions.assertNotNull(entity);
        Assertions.assertEquals("Ragione sociale 1", entity.getRagioneSociale());

        // test update che non cambia nulla
        entity = anagraficaService.updateContattoInput(entity.getId(), input);
        Assertions.assertNotNull(entity);
    }

    @Test
    @TestTransaction
    public void importAnagrafica_importsSuccessfully() {
        AnagraficaInput input = new AnagraficaInput();
        input.setRagioneSociale("");
        input.setNome("Nome test");
        input.setCognome("Cognome test");
        input.setCfPiva("AAAAAA00A00A000A");
        input.setIndirizzo("Indirizzo test");
        input.setCitta("Roma");
        input.setCap("00100");
        input.setProvincia("RM");
        input.setEmail("mail@mail.test");
        input.setPec("pec@pec.test");
        input.setTelefono("123456");
        input.setFax("fax");
        input.setNote("");

        //import nuovo contatto
        Anagrafica entity = anagraficaService.importContattoInput(input);
        Assertions.assertNotNull(entity);

        //import contatto -> aggiorna campo
        input.setProvincia("FR");
        Anagrafica entity2 = anagraficaService.importContattoInput(input);
        Assertions.assertNotNull(entity2);
        Assertions.assertEquals("FR", entity2.getProvincia());

        //import contatto -> non fa nulla
        Anagrafica entity3 = anagraficaService.importContattoInput(input);
        Assertions.assertNotNull(entity3);
    }

    @Test
    @TestTransaction
    public void importAnagrafica_throwsException() {
        assertThrows(IllegalArgumentException.class, () -> anagraficaService.importContattoInput(null));
    }

    @Test
    @TestTransaction
    public void deleteAnagrafica_throwsException() {
        assertThrows(NullPointerException.class, () -> anagraficaService.deleteContatto(null));
        assertThrows(CustomException.class, () -> anagraficaService.deleteContatto(-1L));
    }
    @Test
    @TestTransaction
    public void deleteAnagrafica_deletesSuccessfully() {

        AnagraficaInput input = new AnagraficaInput();
        input.setRagioneSociale("");
        input.setNome("Nome test");
        input.setCognome("Cognome test");
        input.setCfPiva("AAAAAA00A00A000A");
        input.setIndirizzo("Indirizzo test");
        input.setCitta("Roma");
        input.setCap("00100");
        input.setProvincia("RM");
        input.setEmail("mail@mail.test");
        input.setPec("pec@pec.test");
        input.setTelefono("123456");
        input.setFax("fax");
        input.setNote("");


        //Primo delete -> contatto cancellato dal db
        Anagrafica entity = anagraficaService.saveContattoInput(input);
        Assertions.assertNotNull(entity);
        assertTrue(anagraficaService.deleteContatto(entity.getId()));

        //Secondo delete -> contatto già cancellato
        assertTrue(anagraficaService.deleteContatto(entity.getId()));
    }

/*    @Test
    void ricercaAnagrafica_searchSuccessfully() {
        assertThrows(CustomException.class, () -> anagraficaService.getAllAnagrafica(null));

        RicercaAnagraficaDTO dto = new RicercaAnagraficaDTO();
        dto.setSize(10);
        dto.setPage(0);
        AnagraficaOutputDTO output = anagraficaService.getAllAnagrafica(dto);
        assertNotNull(output.getAnagraficaList());

        dto.setSearch("testo non esistente ERRORERERER EROERO ROE R");
        output = anagraficaService.getAllAnagrafica(dto);
        assertTrue(output.getAnagraficaList().isEmpty());

        String searchTerm = "test";
        dto.setSearch(searchTerm);
        output = anagraficaService.getAllAnagrafica(dto);
        for (Anagrafica item : output.getAnagraficaList()) {
            boolean has_company = item.getRagioneSociale() != null && item.getRagioneSociale().toLowerCase().contains(searchTerm);
            boolean has_nome = item.getNome() != null && item.getNome().toLowerCase().contains(searchTerm);
            boolean has_cognome = item.getCognome() != null && item.getCognome().toLowerCase().contains(searchTerm);
            boolean has_cfpiva = item.getCfPiva() != null && item.getCfPiva().toLowerCase().contains(searchTerm);
            boolean has_email = item.getEmail() != null && item.getEmail().toLowerCase().contains(searchTerm);
            boolean has_pec = item.getPec() != null && item.getPec().toLowerCase().contains(searchTerm);

            assertTrue(has_company || has_nome || has_cognome || has_cfpiva || has_email || has_pec);
        }

    }*/

/*  TODO CAPIRE PERCHE PARTANO I SISTEMI KAFKA
    @Test
    @TestTransaction
    void testImportAnagraficaExcelOK() throws URISyntaxException, IOException {
        byte[] pdfBytes = Files.readAllBytes(Paths.get(getClass().getResource("/test_anagrafica_ok.xlsx").toURI()));
        InputStream excelStream = new ByteArrayInputStream(pdfBytes);
        anagraficaService.importContattiAnagraficaFromExcel(excelStream);
    }*/

    @Test
    @Transactional
    void testImportAnagraficaExcelKO() throws URISyntaxException, IOException {
        byte[] pdfBytes = Files.readAllBytes(Paths.get(getClass().getResource("/test_anagrafica_ko.xlsx").toURI()));
        InputStream excelStream = new ByteArrayInputStream(pdfBytes);
        ImportResult result = documentService.validazioneExcelAnagrafica(excelStream);
        if(result.getIdoneo()){
            List<Anagrafica> anagraficaList = result.getLista();
            anagraficaList.forEach(a -> System.out.println(a.getRagioneSociale()));
        }else {
            List<ErrorRecord> errors = result.getLista();
            errors.forEach(e -> System.out.println(String.format("Errore a riga %s, Error Message: %s", e.getRowNumber(), e.getErrorMessage())));
        }
    }

    @Test
    @Transactional
    void testDeleteContatti() {
        anagraficaService.deleteAnagraficaWithoutCertificazione();
    }

    @Test
    @Transactional
    void testMapInfoUOToAnagrafica() {
        String codUO = "RG91EK";
        em.createNativeQuery("DELETE FROM Anagrafica WHERE id_ipa_inad = ?1")
                .setParameter(1,codUO)
                .executeUpdate();
        Anagrafica anagrafica = anagraficaService.mapInfoUOToAnagrafica(codUO);

        assertNotNull(anagrafica);


    }

    @Test
    @Transactional
    void testMapAooToAnagrafica(){

        String codAOO = "acba_le";
        String codEnte ="acba_le";
        em.createNativeQuery("DELETE FROM Anagrafica WHERE id_ipa_inad = ?1")
                .setParameter(1,codAOO)
                .executeUpdate();

        Anagrafica anagrafica = anagraficaService.mapAooToAnagrafica(codEnte,codAOO);

        assertNotNull(anagrafica);
    }

    @Test
    @Transactional
    void testMapInfoEnteToAnagrafica(){

        String codEnte = "c_ans";
        em.createNativeQuery("DELETE FROM Anagrafica WHERE id_ipa_inad = ?1")
                .setParameter(1,codEnte)
                .executeUpdate();

        Anagrafica anagrafica = anagraficaService.mapInfoEnteToAnagrafica(codEnte);

        assertNotNull(anagrafica);
    }
}
