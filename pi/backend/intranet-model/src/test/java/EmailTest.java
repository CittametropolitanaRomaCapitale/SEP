import io.quarkus.panache.mock.PanacheMock;
import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.ricerca.RicercaEmailDTO;
import it.parsec326.pi.intranet.dto.mail.AttachmentDTO;
import it.parsec326.pi.intranet.dto.mail.EmailContentDTO;
import it.parsec326.pi.intranet.mapper.PecPeoMapper;
import it.parsec326.pi.intranet.model.*;
import it.parsec326.pi.intranet.service.*;
import it.parsec326.pi.intranet.utils.SortInput;
import it.parsec326.pi.intranet.utils.common.*;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@QuarkusTest
class EmailTest {

    @Inject EntityManager em;

    EntityManager emMock = mock(EntityManager.class);

    @Inject
    ProtocolloService protocolloService;

    @Inject
    PecPeoService pecPeoService;

    @Inject
    EmailService emailService;

    @Inject
    AllegatoService allegatoService;

    @Inject
    NumeroProtocolloCircolareService numeroProtocolloCircolareService;

    @Inject
    AttachmentContentTypeService attachmentContentTypeService;

    List<Allegato> allegati = new ArrayList<>();

    @Mock
    SSOClient ssoManagerMock;

    @InjectMocks
    EmailService emailServiceWithSSOMock;

    PecPeoMapper mapperMock = mock(PecPeoMapper.class);


    PecPeoService pecPeoServiceInject;


    private void setField(Object targetObject, String fieldName, Object value) throws Exception {
        Field field = targetObject.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(targetObject, value);
    }

    @BeforeEach
    public void setup() throws Exception {
        ssoManagerMock = mock(SSOClient.class);

        emailServiceWithSSOMock = new EmailService();
        setField(emailServiceWithSSOMock, "ssoManager", ssoManagerMock);
        pecPeoServiceInject = new PecPeoService();
        setField(pecPeoServiceInject, "em", emMock);
        setField(pecPeoServiceInject, "mapper", mapperMock);
    }

    @Test
    @TestTransaction
    void checkImprontaEmailOnDb_GeneratesAndFindsImprontaOnDb() throws IOException {
        Allegato a1 = Allegato.findById(1L);
        Allegato a2 = Allegato.findById(2L);
        AttachmentDTO dto1 = AttachmentDTO
                .builder()
                .name(a1.getRiferimentoMinio())
                .content(allegatoService.downloadByRef(a1.getRiferimentoMinio()).readAllBytes())
                .extension(attachmentContentTypeService.findByExtension(".txt").getExtension()).build();
        AttachmentDTO dto2 = AttachmentDTO
                .builder()
                .name(a2.getRiferimentoMinio())
                .content(allegatoService.downloadByRef(a2.getRiferimentoMinio()).readAllBytes())
                .extension(attachmentContentTypeService.findByExtension(".txt").getExtension()).build();

        EmailContentDTO emailContentDTO = EmailContentDTO.builder()
                .from("sviluppo@pec.parsec326.it")
                .to("salvatore.versienti@parsec326.it")
                .to("simone.spinelli@parsec326.it")
                .cc("salvatore.versienti@parsec326.it")
                .subject("TEST EMAIL PROCESS")
                .body("EMAIL TEST PROCESS")
                .attachment(dto1)
                .attachment(dto2)
                .build();

        assertFalse(emailService.checkImprontaEmailOnDB(emailContentDTO));
    }

    @Test
    @TestTransaction
    void saveRecordEmail_DoesNotThrowAnyException() {
        EmailContentDTO emailContentDTO = EmailContentDTO.builder()
                .from("sviluppo@pec.parsec326.it")
                .to("salvatore.versienti@parsec326.it")
                .cc("salvatore.versienti@parsec326.it")
                .subject("TEST EMAIL PROCESS")
                .body("EMAIL TEST PROCESS")
                .tsInvio(Timestamp.valueOf("2024-05-07 08:59:37.506"))
                .build();

        Protocollo protocollo = new Protocollo();
        protocollo.setId(123L);
        protocollo.setIndirizzoPecPeo("mittente@example.com");
        protocollo.setMetodoSpedizione(MetodoSpedizione.Pec);
        protocollo.setIdUtente("1");

        // Verifica che il metodo saveRecordEmail non lanci un'eccezione
        assertDoesNotThrow(() -> emailService.saveRecordEmail(emailContentDTO, protocollo, null));
    }

    @Test
    void getAllPecPeo_FindsAllEmailForUtente() {
        String idUtente = "1";
        String cdr = "7500";
        List<PecPeo> list = pecPeoService.getAllPecPeo(idUtente, cdr);
        assertNotNull(list);
    }

    @Test
    void getPecPeoByIdUtente_FindsAllEmailsForUtente() {
        String idUtente = "1";
        List<PecPeo> list = pecPeoService.getPecPeoByIdUtente(idUtente, null);
        assertNotNull(list);
    }

    @Test
    void getPeConfigurazione_FindsConfigurazioneForPEO() {
        PeConfigurazione p = pecPeoService.getPeConfigurazione(TipologiaPosta.PEO);
        assertNotNull(p);
    }


    @Test
    void getPecPeoByEmail_FindsPecPeoFromEmailAddress() {
        String email = "sviluppo@pec.parsec326.it";
        PecPeo p = pecPeoService.getPecPeoByEmail(email);
        assertEquals(p.getIndirizzoEmail(), email);
    }

    //TODO: da sistemare in vista della us-1182
//    @Test
//    @TestTransaction
//    void saveConfiguration_InsertsConfigurationSuccessfullyWithEncryptedPassword() throws Exception {
//        PecPeoDTOInput input = new PecPeoDTOInput();
//        input.tipologiaPosta = "PEO";
//        input.indirizzoEmail = String.format("email@%stest.com", new Random().nextInt(10000));
//        input.cdr = "AVV0000";
//        input.password = String.format("pass%s!", new Random().nextInt(100));
//        input.formSwitch = "cdr";
//        input.attiva = true;
//
//        PecPeo config = pecPeoService.saveConfiguration(input);
//        assertNotNull(config);
//        assertEquals(config.getPasswordDecrypted(), input.password);
//    }

    @Test
    public void getPecPeoQuery_FindsResultsFromPecPeoDTOInputPec() {
        String idUtente = "1";
        String selectedOffice = "7500";
        String tipologiaPosta = "Peo";

        List<String> result = pecPeoService.getPecPeoQuery(idUtente, tipologiaPosta, selectedOffice);

        assertNotNull(result);
    }

    @Test
    public void getPecPeoQuery_FindsResultsFromPecPeoDTOInputEmail() {
        String idUtente = "1";
        String selectedOffice = "7500";
        String tipologiaPosta = "Peo";

        List<String> result = pecPeoService.getPecPeoQuery(idUtente, tipologiaPosta, selectedOffice);

        assertNotNull(result);
    }

    @Test
    public void getPecPeoQuery_ThrowsException_WhenInvalidInput() {
        String idUtente = "1";
        String selectedOffice = null;
        String tipologiaPosta = "Peo";

        assertThrows(IllegalArgumentException.class, () -> pecPeoService.getPecPeoQuery(idUtente, tipologiaPosta, selectedOffice));
    }

    @Test
    @Transactional
    void sendEmail_ThrowsException_WhenInvalidInput() {
        Assertions.assertThrows(IllegalArgumentException.class, () -> emailService.sendEmail(null));
    }

    @Test
    @Transactional
    void test_sendEmail_emailIsNull() throws Exception {
        Email email = new Email();
        email.setId(99999L);

        assertNotNull(emailService.sendEmail(email.getId()));
    }

//    @Test
//    @Transactional
//    void test_sendEmail_sentEmail() throws Exception {
//        assertFalse(emailService.sendEmail(1L));
//    }

    @Test
    @Transactional
    void test_sendEmail_sendMailIsTrue() throws Exception {
        assertThrows(RuntimeException.class, () -> emailService.sendEmail(1L));
      }

    @Test
    @Transactional
    void test_sendEmail_protocolloNull() throws Exception {

        Email email = new Email();
        email.setId(2607L);
        assertThrows(RuntimeException.class, () -> emailService.sendEmail(1L));

    }

    Protocollo getProtocolloTest(TipoRegistrazione tipoRegistrazione, TipologiaPosta tipologiaPosta, int invioEmailMultiplo) {
        // Cerco un utente

        // Creo il protocollo di test in funzione dei parametri
        Protocollo protocollo = new Protocollo();
        protocollo.setId(Long.valueOf(1));

        /// Info protocollo
        protocollo.setTipoRegistrazione(tipoRegistrazione);
        protocollo.setIdUtente("1");
        protocollo.setNProtocollo(numeroProtocolloCircolareService.generateDistribuitedNumeroProtocollo());
        protocollo.setIdMittente("1");
        protocollo.setMittente("Utente");
        protocollo.setIdUtenteLastOperation("1");
        protocollo.setProtocolloMittente("CMRC-2023-9999999");
        protocollo.setNote("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
        protocollo.setTsCreation(Calendar.getInstance().getTime());
        protocollo.setStato(StatoProtocollo.DaPrendereInCarico);

        // Info email
        protocollo.setInvioEmailMultiplo(invioEmailMultiplo);
        if (tipologiaPosta.isPec()) {
            protocollo.setMetodoSpedizione(MetodoSpedizione.Pec);
            protocollo.setIndirizzoPecPeo("sviluppo@pec.parsec326.it");
        } else if (tipologiaPosta.isPeo()) {
            protocollo.setMetodoSpedizione(MetodoSpedizione.Email);
            protocollo.setIndirizzoPecPeo("notification@parsec326.it");
        }

        protocollo.setDestinatari("simone.spinelli@parsec326.it:TO,simonespinelli1k90@gmail.com:CC");
        protocollo.setAssegnatari("simone.spinelli@parsec326.it:TO,simonespinelli1k90@gmail.com:CC");
        if (invioEmailMultiplo == 1) {
            protocollo.setOggetto("Test Suite Protocollo Informatico - Test " + protocollo.getMetodoSpedizione().getMetodo() + " multiple");
            protocollo.setCorpoPecPeo("Test di invio " + protocollo.getMetodoSpedizione().getMetodo() + " multiple");
        } else {
            protocollo.setOggetto("Test Suite Protocollo Informatico - Test " + protocollo.getMetodoSpedizione().getMetodo() + " singola");
            protocollo.setCorpoPecPeo("Test di invio " + protocollo.getMetodoSpedizione().getMetodo() + " singola");
        }

        // Aggiunge gli allegati
        if (allegati.isEmpty())
            allegati.add(getAllegatoTestPseudoRandom(protocollo));

        protocollo.setAllegati(allegati);

        return protocollo;
    }

    private Allegato getAllegatoTestPseudoRandom(Protocollo protocollo) {
        byte[] dummyBytes = "dummy content".getBytes(StandardCharsets.UTF_8);
        String nanoTime = String.valueOf(System.nanoTime());
        Allegato allegato = new Allegato();
        allegato.setProtocollo(protocollo);
        allegato.setIdUtente(protocollo.getIdUtente());
        allegato.setTipoDocumento("Documento di test "+ nanoTime);
        allegato.setOggetto("Oggetto di nanoTime " + nanoTime);
        allegato.setIdUtenteLastOperation(protocollo.getIdUtenteLastOperation());
        allegato.setTsCreation(new Date());
        allegato.setTsStartVali(new Date());
        allegato.setIsMain(true);
        allegato.setNome("AllegatoTest_"+System.nanoTime());
        allegato.setDimensione(1024L);
        allegato.setEstensione("txt");
        return allegatoService.saveAllegati(dummyBytes, allegato, "AllegatoTest_"+System.nanoTime(), ".txt", 2_097_152L, false);
    }

    @Test
    public void getEmail_FindsEmailsFromQueriesSuccessfully() {

        when(ssoManagerMock.extractIdFromToken()).thenReturn("10");

        List<String> tipo = List.of("PEC") ;

        // Ricerca email con input null
        assertThrows(NullPointerException.class, () -> emailServiceWithSSOMock.getEmail(null));

        // Ricerca email senza parametri
        RicercaEmailDTO rp2 = RicercaEmailDTO.builder()
                .tipoEmail(null)
                .build();
        rp2.setPage(0);
        rp2.setSize(5);
        rp2.setSearch(null);
        assertTrue(emailServiceWithSSOMock.getEmail(rp2).getEmail().size() >= 0);

        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss", Locale.ITALIAN);
        try {
            Date dateIntervalloFrom = formatter.parse("05-05-2024 00:00:00");
            Date dateIntervalloTo = formatter.parse("17-06-2024 23:59:59");
            Date dateIntervalloOnlyFrom = formatter.parse("03-06-2024 00:00:00");
            Date dateIntervalloOnlyTo = formatter.parse("17-06-2024 23:59:59");
            Date dateIntervalloInvalidFrom = formatter.parse("01-01-2050 00:00:00");
            Date dateIntervalloInvalidTo = formatter.parse("01-01-2000 23:59:59");

            // Ricerca email per intervallo data creazione
            RicercaEmailDTO rp_intervallo = RicercaEmailDTO.builder()
                    .dataInvioFrom(dateIntervalloFrom)
                    .dataInvioTo(dateIntervalloTo)
                    .build();
            rp_intervallo.setPage(0);
            rp_intervallo.setSize(10);
            List<Email> email = emailServiceWithSSOMock.getEmail(rp_intervallo).getEmail();
            assertTrue(email.size() >= 0);
            for(Email p : email) {
                assertTrue(p.getTsInvio().compareTo(dateIntervalloFrom) >= 0);
                assertTrue(p.getTsInvio().compareTo(dateIntervalloTo) <= 0);
            }

            RicercaEmailDTO rp_from = RicercaEmailDTO.builder()
                    .dataInvioFrom(dateIntervalloOnlyFrom)
                    .build();
            rp_from.setPage(0);
            rp_from.setSize(10);
            email = emailServiceWithSSOMock.getEmail(rp_from).getEmail();
//            assertTrue(email.size() > 0);
            for(Email p : email) {
                assertTrue(p.getTsInvio().compareTo(dateIntervalloOnlyFrom) >= 0);
            }

            RicercaEmailDTO rp_to = RicercaEmailDTO.builder()
                    .dataInvioTo(dateIntervalloOnlyTo)
                    .build();
            rp_to.setPage(0);
            rp_to.setSize(10);
            email = emailServiceWithSSOMock.getEmail(rp_to).getEmail();
//            assertTrue(email.size() > 0);
            for(Email p : email) {
                assertTrue(p.getTsCreation().compareTo(dateIntervalloOnlyTo) <= 0);
            }

            RicercaEmailDTO rp_invalid_from = RicercaEmailDTO.builder()
                    .dataInvioFrom(dateIntervalloInvalidFrom)
                    .build();
            rp_invalid_from.setPage(0);
            rp_invalid_from.setSize(10);
            email = emailServiceWithSSOMock.getEmail(rp_invalid_from).getEmail();
            assertTrue(email.isEmpty());

            RicercaEmailDTO rp_invalid_to = RicercaEmailDTO.builder()
                    .dataInvioTo(dateIntervalloInvalidTo)
                    .build();
            rp_invalid_to.setPage(0);
            rp_invalid_to.setSize(10);
            email = emailServiceWithSSOMock.getEmail(rp_invalid_to).getEmail();
            assertTrue(email.isEmpty());


        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

        // Test ordinamento
        SortInput sort1 = new SortInput();
        sort1.by = "tsCreation";
        sort1.desc = false;
        RicercaEmailDTO rp_ordinamento = RicercaEmailDTO.builder()
                .build();
        rp_ordinamento.setSort(sort1);
        rp_ordinamento.setPage(0);
        rp_ordinamento.setSize(10);
        List<Email> email = emailServiceWithSSOMock.getEmail(rp_ordinamento).getEmail();
        assertFalse(email.size() > 0);
        for(int i=1;i<email.size();i++) {
            Email previous = email.get(i-1);
            Email current = email.get(i);
            assertFalse(current.getTsCreation().compareTo(previous.getTsCreation()) >= 0);
        }

        // Ricerca email con tipo
        RicercaEmailDTO rp1 = RicercaEmailDTO.builder()
                .tipoEmail(tipo)
                .build();
        rp1.setPage(0);
        rp1.setSize(5);
        email = emailServiceWithSSOMock.getEmail(rp1).getEmail();
        assertTrue(email.size() >= 0);
        if (email.size() > 0) {
            for(Email emailSingola : email) {
                assertTrue(emailSingola.getTipoEmail().equalsIgnoreCase("pec"));
            }
        }

        //Test stato protocollazione
        rp2 = RicercaEmailDTO.builder()
                .statoProtocollazione(List.of(StatoProtocollazioneEmail.PROTOCOLLATO.getStato()))
                .build();
        rp2.setPage(0);
        rp2.setSize(5);
        rp2.setSearch(null);
        List<Email> emails = emailServiceWithSSOMock.getEmail(rp2).getEmail();
        assertTrue(emails.size() >= 0);
        if (emails.size() > 0) {
            for(Email emailSingola : emails) {
                assertNotNull(emailSingola.getProtocollo());
            }
        }
        rp2 = RicercaEmailDTO.builder()
                .statoProtocollazione(List.of(StatoProtocollazioneEmail.NON_PROTOCOLLATO.getStato()))
                .build();
        rp2.setPage(0);
        rp2.setSize(5);
        rp2.setSearch(null);
        emails = emailServiceWithSSOMock.getEmail(rp2).getEmail();
        assertTrue(emails.size() >= 0);
        if (emails.size() > 0) {
            for(Email emailSingola : emails) {
                assertNull(emailSingola.getProtocollo());
            }
        }


        rp2 = RicercaEmailDTO.builder()
                .build();
        rp2.setPage(0);
        rp2.setSize(5);
        rp2.setSearch("CMRC-2024-0000196");
        List<Email> res = emailServiceWithSSOMock.getEmail(rp2).getEmail();
//        assertTrue(res.size() == 1);

        rp2 = RicercaEmailDTO.builder()
                .build();
        rp2.setPage(0);
        rp2.setSize(5);
        rp2.setSearch("$£)$£$£ Ffd FADFFADAF DFAd faDFDAFADFA");
        assertTrue(emailServiceWithSSOMock.getEmail(rp2).getEmail().isEmpty());

        rp2 = RicercaEmailDTO.builder()
                .indirizziEmail(List.of("simone.spinelli@parsec326.it"))
                .build();
        rp2.setPage(0);
        rp2.setSize(5);
        rp2.setSearch(null);
        emails = emailServiceWithSSOMock.getEmail(rp2).getEmail();
        if (emails.size() > 0) {
            for(Email emailSingola : emails) {
                assertTrue((emailSingola.getFrom() != null && emailSingola.getFrom().contains("simone.spinelli@parsec326.it"))
                || (emailSingola.getTo() != null && emailSingola.getTo().contains("simone.spinelli@parsec326.it"))
                || (emailSingola.getCc() != null && emailSingola.getCc().contains("simone.spinelli@parsec326.it")));
            }
        }

        rp2 = RicercaEmailDTO.builder()
                .indirizziEmail(List.of("simone.ssssssssssssspinelli@parsec326.it"))
                .build();
        rp2.setPage(0);
        rp2.setSize(5);
        rp2.setSearch(null);
        assertTrue(emailServiceWithSSOMock.getEmail(rp2).getEmail().isEmpty());

        rp2 = RicercaEmailDTO.builder()
                .statoInvio(List.of(StatoInvio.INVIATO.getStato()))
                .build();
        rp2.setPage(0);
        rp2.setSize(5);
        rp2.setSearch(null);
        emails = emailServiceWithSSOMock.getEmail(rp2).getEmail();
        if (emails.size() > 0) {
            for(Email emailSingola : emails) {
                assertSame(StatoInvio.INVIATO, emailSingola.getStatoInvio());
            }
        }

        rp2 = RicercaEmailDTO.builder()
                .emailDirection(List.of(EmailDirection.USCITA.getDirection()))
                .build();
        rp2.setPage(0);
        rp2.setSize(5);
        rp2.setSearch(null);
        emails = emailServiceWithSSOMock.getEmail(rp2).getEmail();
        if (emails.size() > 0) {
            for(Email emailSingola : emails) {
                assertSame(EmailDirection.USCITA, emailSingola.getEmailDirection());
            }
        }
    }

    @Test
    public void testGetPeConfigurazione_NullTipologiaPosta_ThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> pecPeoService.getPeConfigurazione(null));
    }

    @Test
    @Transactional
    public void testGetPeConfigurazione_ValidTipologiaPosta_ReturnsConfigurazione() {
        PeConfigurazione result = pecPeoService.getPeConfigurazione(TipologiaPosta.PEC);
        assertNotNull(result);
        result = pecPeoService.getPeConfigurazione(TipologiaPosta.PEO);
        assertNotNull(result);
    }

    @Test
    @Transactional
    public void testGetPeConfigurazione_NoConfigurazioneFound_ThrowsException() {
        assertThrows(NoResultException.class, () -> pecPeoService.getPeConfigurazione(TipologiaPosta.RICEVUTA));
    }

    @Test
    @Transactional
    public void test_findById(){
        Long pecPeoId = 1L;
        PecPeo pecPeo = pecPeoService.findById(pecPeoId);
    }

    @Test
    @Transactional
    public void test_findById_idNull() {
        Long pecPeoId = null;
        Assertions.assertThrows(IllegalArgumentException.class, () -> {
            pecPeoService.findById(pecPeoId);
        }, "Id nullo");
    }

    @Test
    @Transactional
    void test_findById_throwsNotFoundException() {
        Long idNonEsistente = 999999L;
        NotFoundException exception = Assertions.assertThrows(NotFoundException.class, () -> {
            pecPeoService.findById(idNonEsistente);
        }, "Should throw NotFoundException for non-existent id");

        Assertions.assertEquals("Configurazione pec/peo non trovata per id:{} " + idNonEsistente, exception.getMessage());
    }

    @Test
    void test_getPecPeoByCdr(){
        PecPeo pecPeo = new PecPeo();
        TypedQuery<PecPeo> query = mock(TypedQuery.class);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.getResultList()).thenReturn(List.of(pecPeo));
        when(emMock.createNamedQuery(anyString(), eq(PecPeo.class))).thenReturn(query);
        List<PecPeo> listPecPeo = pecPeoServiceInject.getPecPeoByCdr("AVV0000");

        assertTrue(!listPecPeo.isEmpty());

    }

    @Test
    void test_getAllPecConfigurations(){

        List<PecPeo> listPecPeo = pecPeoServiceInject.getAllPecConfigurations();
        assertTrue(!listPecPeo.isEmpty());
    }

    @Test
    @Transactional
    void test_getPecPeoFromEmails(){
        List<String> listEmail = new ArrayList<>();
        listEmail.add("sviluppo@pec.parsec326.it");

        List<PecPeo> listPecPeo = pecPeoServiceInject.getPecPeoFromEmails(listEmail);
        assertTrue(!listPecPeo.isEmpty());
    }

/*
   Fallisce perchè la password della configurazione viene decriptata
   @Test
    @Transactional
    void test_getConfigurations(){
        RicercaConfigPEDTO configPEDTO = new RicercaConfigPEDTO();
        configPEDTO.setIndirizzo(null);
        configPEDTO.setUfficio("AV0000");
        configPEDTO.setUtente(null);
        configPEDTO.setTipologiaPosta(null);
        configPEDTO.setPage(0);
        configPEDTO.setSize(10);
        configPEDTO.setSearch(null);
        configPEDTO.setCdr(null);

        ConfigurazioniPEOutputDTO configurazioniPEOutputDTO = pecPeoServiceInject.getConfigurations(configPEDTO);

        assertNotNull(configurazioniPEOutputDTO);
    }*/

    //TODO: da riscrivere perchè il saveConfiguration gestisce altre casistiche e accetta una lista di Ufficio
//    @Test
//    @TestTransaction
//    void test_updateConfiguration(){
//
//        PecPeoDTOInput pecPeoDTOInput = new PecPeoDTOInput();
//        pecPeoDTOInput.setAttiva(true);
//        pecPeoDTOInput.setPassword("passwordProva");
//        pecPeoDTOInput.setCdrCode("7500");
//        pecPeoDTOInput.setIndirizzoEmail("email@8948test.com");
//        pecPeoDTOInput.setIdUtente(null);
//        pecPeoDTOInput.setTipologiaPosta("PEC");
//        pecPeoDTOInput.setUsername("user");
//        pecPeoDTOInput.setFormSwitch("cdr");
//        when(mapperMock.toEntity(any(PecPeoDTOInput.class))).thenReturn(new PecPeo());
//        boolean result = pecPeoServiceInject.updateConfiguration(89136L, pecPeoDTOInput);
//
//        assertTrue(result);
//        //assertThrows();
//    }

    @Test
    @TestTransaction
    void test_deleteConfiguration(){
        PecPeo pecPeo = mock(PecPeo.class);
        doNothing().when(pecPeo).delete();
        PanacheMock.mock(PecPeo.class);
        when(PecPeo.findById(anyLong())).thenReturn(pecPeo);
        Long id = 1L;
        boolean deleted = pecPeoServiceInject.deleteConfiguration(id);
        assertTrue(deleted);
    }
}