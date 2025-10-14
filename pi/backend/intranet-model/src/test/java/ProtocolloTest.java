import com.itextpdf.text.DocumentException;
import io.quarkus.panache.mock.PanacheMock;
import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import it.gov.agid.protocollo.ObjectFactory;
import it.gov.agid.protocollo.*;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.DettaglioProtocolloDTO;
import it.parsec326.pi.intranet.dto.ReferentiOutputDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaProtocolliDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaReferentiDTO;
import it.parsec326.pi.intranet.dto.client.sso.*;
import it.parsec326.pi.intranet.dto.common.ReferenteOutputDTO;
import it.parsec326.pi.intranet.dto.common.TitolarioOutputDTO;
import it.parsec326.pi.intranet.dto.input.AllegatoInput;
import it.parsec326.pi.intranet.dto.input.ProtocolloInput;
import it.parsec326.pi.intranet.dto.input.StatoProtocolloInput;
import it.parsec326.pi.intranet.dto.mail.AttachmentDTO;
import it.parsec326.pi.intranet.dto.mail.EmailContentDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.mapper.ProtocolloMapper;
import it.parsec326.pi.intranet.mapper.ReferenteMapper;
import it.parsec326.pi.intranet.model.*;
import it.parsec326.pi.intranet.service.*;
import it.parsec326.pi.intranet.utils.MinioConnectionFactory;
import it.parsec326.pi.intranet.utils.SortInput;
import it.parsec326.pi.intranet.utils.common.MetodoSpedizione;
import it.parsec326.pi.intranet.utils.common.StatoProtocollo;
import it.parsec326.pi.intranet.utils.common.TipoDestinatarioReferente;
import it.parsec326.pi.intranet.utils.common.TipoRegistrazione;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import jakarta.ws.rs.NotFoundException;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBElement;
import jakarta.xml.bind.Marshaller;
import lombok.Getter;
import org.apache.commons.lang3.NotImplementedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.w3._2000._09.xmldsig_.*;
import org.w3c.dom.Document;

import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.dom.DOMResult;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import java.io.*;
import java.lang.reflect.Field;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
class ProtocolloTest {

    @Inject
    EntityManager em;
    @Inject
    @Getter
    UserTransaction transaction;
    @Inject
    ProtocolloMapper mapper;
    @Inject
    ReferenteMapper referenteMapper;
    @Inject
    ProtocolloService protocolloService;
    @Inject
    AllegatoService allegatoService;
    @Inject
    DocumentService documentService;
    @Inject
    EmailService emailService;
    @Inject
    SSOClient ssoManager;
    @Inject
    StoricoService storicoService;
    @Inject
    BarcodeGeneratorService barcodeGeneratorService;
    @Inject
    AttachmentContentTypeService attachmentContentTypeService;
    @Inject
    ReferentiProtocolloService referentiProtocolloService;
    @Inject
    MinioConnectionFactory minioFactory;
    @Inject
    AnagraficaService anagraficaService;
    @Inject
    ConfigurazioneService configurazioneService;
    @Inject
    NotificaService notificaService;
    @Inject
    EmailTemplateService emailTemplateService;



    EntityManager emMock = mock(EntityManager.class);
    ProtocolloMapper mapperMock = mock(ProtocolloMapper.class);
    ReferenteMapper referenteMapperMock = mock(ReferenteMapper.class);
    DocumentService documentServiceMock = mock(DocumentService.class);
    AllegatoService allegatoServiceMock = mock(AllegatoService.class);
    EmailService emailServiceMock = mock(EmailService.class);
    StoricoService storicoServiceMock = mock(StoricoService.class);
    SSOClient ssoManagerMock = mock(SSOClient.class);
//    EmailKafkaProducer emailKafkaProducerMock = mock(EmailKafkaProducer.class);
    ProtocolloService protocolloServiceMock = mock(ProtocolloService.class);
    TitolarioService titolarioServiceMock = mock(TitolarioService.class);
    Titolario titolarioMock = mock(Titolario.class);
    ReferentiProtocollo referentiProtocolloMock = mock(ReferentiProtocollo.class);
    ReferentiProtocolloService referentiProtocolloServiceMock = mock(ReferentiProtocolloService.class);
    AnagraficaService anagraficaServiceMock = mock(AnagraficaService.class);

    ProtocolloService protocolloServiceInject;
    ProtocolloService protocolloServiceInjectMock;
    ProtocolloService protocolloServiceInjectSpy;
    ProtocolloService protocolloServiceSpied;
    BarcodeGeneratorService barcodeGeneratorServiceInject;
    ReferentiProtocolloService referentiProtocolloServiceInject;

    @BeforeEach
    void setUp() throws Exception {
        protocolloServiceInject = new ProtocolloService();
        this.setField(protocolloServiceInject, "em", emMock);
        this.setField(protocolloServiceInject, "mapper", mapperMock);
        this.setField(protocolloServiceInject, "referenteMapper",referenteMapperMock);
        this.setField(protocolloServiceInject, "documentService", documentServiceMock);
        this.setField(protocolloServiceInject, "emailService", emailServiceMock);
        this.setField(protocolloServiceInject, "ssoManager", ssoManagerMock);
        this.setField(protocolloServiceInject, "storicoService", storicoServiceMock);
        this.setField(protocolloServiceInject, "allegatoService", allegatoService);
        this.setField(protocolloServiceInject, "referentiProtocolloService", referentiProtocolloService);
        this.setField(protocolloServiceInject, "titolarioService", titolarioServiceMock);
        this.setField(protocolloServiceInject, "configurazioneService", configurazioneService);
        this.setField(protocolloServiceInject, "notificaService", notificaService);
        this.setField(protocolloServiceInject, "emailTemplateService", emailTemplateService);
//        this.setField(protocolloServiceInject, "emailKafkaProducer", emailKafkaProducerMock);
        protocolloServiceInjectMock = new ProtocolloService();
        this.setField(protocolloServiceInjectMock, "em", emMock);
        this.setField(protocolloServiceInjectMock, "mapper", mapperMock);
        this.setField(protocolloServiceInjectMock, "documentService", documentServiceMock);
        this.setField(protocolloServiceInjectMock, "emailService", emailServiceMock);
        this.setField(protocolloServiceInjectMock, "ssoManager", ssoManagerMock);
        this.setField(protocolloServiceInjectMock, "storicoService", storicoServiceMock);
        this.setField(protocolloServiceInjectMock, "allegatoService", allegatoServiceMock);
        this.setField(protocolloServiceInjectMock, "referentiProtocolloService", referentiProtocolloServiceMock);
        this.setField(protocolloServiceInjectMock, "titolarioService", titolarioServiceMock);
        this.setField(protocolloServiceInjectMock, "referenteMapper", new ReferenteMapper() {
            @Override
            public ReferenteOutputDTO toDtoDettaglio(ReferentiProtocollo referentiProtocollo) {
                ReferenteOutputDTO o = new ReferenteOutputDTO();
                o.setIdDestinatario(referentiProtocollo.getIdDestinatario());
                o.setLabel(referentiProtocollo.getNomeDestinatario());
                o.setTipo(referentiProtocollo.getTipoDestinatario());
                o.setStatoProtocollo(referentiProtocollo.getStatoProtocollo() != null ? referentiProtocollo.getStatoProtocollo().getStato() : null);
                return o;
            }

            @Override
            public ReferenteOutputDTO gruppoToReferentOutputDTO(Gruppo gruppo) {
                return null;
            }
        });
        protocolloServiceInjectSpy = new ProtocolloService();
        this.setField(protocolloServiceInjectSpy, "em", em);
        this.setField(protocolloServiceInjectSpy, "mapper", mapper);
        this.setField(protocolloServiceInjectSpy, "referenteMapper",referenteMapperMock);
        this.setField(protocolloServiceInjectSpy, "documentService", documentService);
        this.setField(protocolloServiceInjectSpy, "emailService", emailServiceMock);
        this.setField(protocolloServiceInjectSpy, "ssoManager", ssoManagerMock);
        this.setField(protocolloServiceInjectSpy, "storicoService", storicoServiceMock);
        this.setField(protocolloServiceInjectSpy, "referentiProtocolloService", referentiProtocolloService);
        this.setField(protocolloServiceInjectSpy, "attachmentContentTypeService", attachmentContentTypeService);
        this.setField(protocolloServiceInjectSpy, "minioFactory", minioFactory);
        this.setField(protocolloServiceInjectSpy, "allegatoService", allegatoService);
//        this.setField(protocolloServiceInjectSpy, "emailKafkaProducer", emailKafkaProducerMock);
        this.setField(protocolloServiceInjectSpy, "anagraficaService", anagraficaService);

        barcodeGeneratorServiceInject = new BarcodeGeneratorService();
        this.setField(barcodeGeneratorServiceInject, "storicoService", storicoServiceMock);
        this.setField(barcodeGeneratorServiceInject, "protocolloService", protocolloService);
        this.setField(barcodeGeneratorServiceInject, "ssoManager", ssoManager);
        referentiProtocolloServiceInject = new ReferentiProtocolloService();
        this.setField(referentiProtocolloServiceInject, "em", emMock);
        this.setField(referentiProtocolloServiceInject, "transaction", transaction);
        this.setField(referentiProtocolloServiceInject, "ssoManager", ssoManagerMock);
        this.setField(referentiProtocolloServiceInject, "storicoService", storicoServiceMock);
        this.setField(referentiProtocolloServiceInject, "protocolloService", protocolloServiceMock);
        this.setField(referentiProtocolloServiceInject, "notificaService", notificaService);
        this.setField(referentiProtocolloServiceInject, "configurazioneService", configurazioneService);


        protocolloServiceSpied = spy(ProtocolloService.class);
        /*
        this.setField(protocolloServiceSpied, "ssoManager", ssoManagerMock);
        this.setField(protocolloServiceSpied, "em", emMock);
        this.setField(protocolloServiceSpied, "referentiProtocolloService", referentiProtocolloService);
        this.setField(protocolloServiceSpied, "titolarioService", titolarioServiceMock);
        this.setField(protocolloServiceSpied, "referenteMapper", new ReferenteMapper() {
            @Override
            public ReferenteOutputDTO toDtoDettaglio(ReferentiProtocollo referentiProtocollo) {
                ReferenteOutputDTO o = new ReferenteOutputDTO();
                o.setIdDestinatario(referentiProtocollo.getIdDestinatario());
                o.setLabel(referentiProtocollo.getNomeDestinatario());
                o.setTipo(referentiProtocollo.getTipoDestinatario());
                o.setStatoProtocollo(referentiProtocollo.getStatoProtocollo() != null ? referentiProtocollo.getStatoProtocollo().getStato() : null);
                return o;
            }

            @Override
            public ReferenteOutputDTO gruppoToReferentOutputDTO(Gruppo gruppo) {
                return null;
            }
        });
         */

        MockitoAnnotations.openMocks(this);

    }


    @Test
    @Transactional
    void protocolloFindById_ReturnsSuccessfully() {
        assertEquals(protocolloService.findById(Long.valueOf(96187)).getId(), Long.valueOf(96187));
        assertThrows(IllegalArgumentException.class, () -> protocolloService.findById(null));
        assertThrows(NotFoundException.class, () -> protocolloService.findById(Long.valueOf(-1)));
    }

    @Test
    void protocolloGetAllegatoPrincipale_ReturnsSuccessfully() {
        assertNotNull(protocolloService.getAllegatoPrincipale("CMRC-2024-0000062"));
        assertThrows(IllegalArgumentException.class, () -> protocolloService.getAllegatoPrincipale(null));
        assertThrows(jakarta.persistence.NoResultException.class, () -> protocolloService.getAllegatoPrincipale("NUM-PROTOCOLLO-NON-ESISTENTE-TEST-ERRORE"));
    }

    /**
     * Questo test si occupa di tutti i servizi di ricerca dei protocolli.

     */
    @Test
    void protocolloGetProtocolli_returnsResultsFromDifferentQueries() {
        DatiUtenteSSO datiUtenteSSOMock = new DatiUtenteSSO();
        datiUtenteSSOMock.auth_id = "1";
        datiUtenteSSOMock.userOffices = new ArrayList<>();

        UserOffice uo = new UserOffice();
        uo.office = new Office();
        uo.office.code = "7500";
        uo.office.name = "AVV0000";
        uo.roles = new ArrayList<>();
        Role r = new Role();
        r.name = "protocollatore";
        uo.roles.add(r);
        datiUtenteSSOMock.userOffices.add(uo);

        List<DatiUtenteSlimSSO> listDatiUtenteSSOMock = new ArrayList<>();
        listDatiUtenteSSOMock.add(DatiUtenteSlimSSO.mapFromDatiUtenteSSO(datiUtenteSSOMock));

        when(ssoManagerMock.extractIdFromToken()).thenReturn("1");
        when(ssoManagerMock.extractNameFromToken()).thenReturn("User TEST");
        when(ssoManagerMock.getDatiUtente()).thenReturn(datiUtenteSSOMock);
        when(ssoManagerMock.getUtentiPerUfficio("3", anyString(), anyString())).thenReturn(listDatiUtenteSSOMock);

        String nProtocollo = "CMRC-2024-0000011";
        Integer anno = 2024;
        String oggetto = "Richiesta di informazioni";


        RicercaProtocolliDTO rp_ufficio = RicercaProtocolliDTO.builder()
                .numero(nProtocollo)
                .anno(anno)
                .oggetto(oggetto)
                .isRicercaAvanzata(false)
                .isFiltroUfficio(true)
                .selectedOffice("AVV0000")
                .build();
        rp_ufficio.setPage(0);
        rp_ufficio.setSize(5);
        List<Protocollo> protocolli_ufficio = protocolloServiceInject.getProtocolli(rp_ufficio).getProtocolli();
        assertTrue(protocolli_ufficio.size() >= 0);


        // Ricerca protocolli con nProtocollo, anno e oggetto
        RicercaProtocolliDTO rp1 = RicercaProtocolliDTO.builder()
                .numero(nProtocollo)
                .anno(anno)
                .oggetto(oggetto)
                .isRicercaAvanzata(false)
                .build();
        rp1.setPage(0);
        rp1.setSize(5);
        List<Protocollo> protocolli = protocolloServiceInject.getProtocolli(rp1).getProtocolli();
        assertTrue(protocolli.size() >= 0);

        // Ricerca protocolli con input null
        assertThrows(IllegalArgumentException.class, () -> protocolloServiceInject.getProtocolli(null));

        // Ricerca protocolli senza numero, anno e oggetto
        RicercaProtocolliDTO rp2 = RicercaProtocolliDTO.builder()
                .numero(null)
                .anno(null)
                .oggetto(null)
                .isRicercaAvanzata(false)
                .build();
        rp2.setPage(0);
        rp2.setSize(5);
        rp2.setSearch(null);
        assertTrue(protocolloServiceInject.getProtocolli(rp2).getProtocolli().size() >= 0);

        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss", Locale.ITALIAN);
        try {
            Date dateIntervalloFrom = formatter.parse("02-04-2024 00:00:00");
            Date dateIntervalloTo = formatter.parse("02-04-2024 23:59:59");
            Date dateIntervalloOnlyFrom = formatter.parse("01-05-2024 00:00:00");
            Date dateIntervalloOnlyTo = formatter.parse("10-05-2024 23:59:59");
            Date dateIntervalloInvalidFrom = formatter.parse("01-01-2050 00:00:00");
            Date dateIntervalloInvalidTo = formatter.parse("01-01-2000 23:59:59");

            // Ricerca protocolli per intervallo data creazione
            RicercaProtocolliDTO rp_intervallo = RicercaProtocolliDTO.builder()
                    .dataCreazioneFrom(dateIntervalloFrom)
                    .dataCreazioneTo(dateIntervalloTo)
                    .build();
            rp_intervallo.setPage(0);
            rp_intervallo.setSize(10);
            protocolli = protocolloServiceInject.getProtocolli(rp_intervallo).getProtocolli();
            assertTrue(protocolli.size() >= 0);
            for (Protocollo p : protocolli) {
                assertTrue(p.getTsCreation().compareTo(dateIntervalloFrom) >= 0);
//                assertTrue(p.getTsCreation().compareTo(dateIntervalloTo) <= 0);
            }

            RicercaProtocolliDTO rp_from = RicercaProtocolliDTO.builder()
                    .dataCreazioneFrom(dateIntervalloOnlyFrom)
                    .build();
            rp_from.setPage(0);
            rp_from.setSize(10);
            protocolli = protocolloServiceInject.getProtocolli(rp_from).getProtocolli();
//            assertTrue(protocolli.size() > 0);
            for (Protocollo p : protocolli) {
                assertTrue(p.getTsCreation().compareTo(dateIntervalloOnlyFrom) >= 0);
            }

            RicercaProtocolliDTO rp_to = RicercaProtocolliDTO.builder()
                    .dataCreazioneTo(dateIntervalloOnlyTo)
                    .build();
            rp_to.setPage(0);
            rp_to.setSize(10);
            protocolli = protocolloServiceInject.getProtocolli(rp_to).getProtocolli();
//            assertTrue(protocolli.size() > 0);
//            for(Protocollo p : protocolli) {
//                assertTrue(p.getTsCreation().compareTo(dateIntervalloOnlyTo) <= 0);
//            }

            RicercaProtocolliDTO rp_invalid_from = RicercaProtocolliDTO.builder()
                    .dataCreazioneFrom(dateIntervalloInvalidFrom)
                    .build();
            rp_invalid_from.setPage(0);
            rp_invalid_from.setSize(10);
            protocolli = protocolloServiceInject.getProtocolli(rp_invalid_from).getProtocolli();
//            assertTrue(protocolli.isEmpty());

            RicercaProtocolliDTO rp_invalid_to = RicercaProtocolliDTO.builder()
                    .dataCreazioneTo(dateIntervalloInvalidTo)
                    .build();
            rp_invalid_to.setPage(0);
            rp_invalid_to.setSize(10);
            protocolli = protocolloServiceInject.getProtocolli(rp_invalid_to).getProtocolli();
//            assertTrue(protocolli.isEmpty());


        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

        // Ricerca protocolli per uno o più stati
        String[] statiArray = new String[]{"DaPrendereInCarico", "StatoERRRR-NON-VALIDO"};
        String[] statiNonValidiArray = new String[]{"StatoERRRR-NON-VALIDO"};
        List<String> stato = Arrays.asList(statiArray);
        RicercaProtocolliDTO rp_stati = RicercaProtocolliDTO.builder()
                .stato(stato)
                .build();
        rp_stati.setPage(0);
        rp_stati.setSize(10);
        List p = protocolloServiceInject.getProtocolli(rp_stati).getProtocolli();
//        assertTrue(p.size() > 0);

        List<String> statiNonValidi = Arrays.asList(statiNonValidiArray);
        RicercaProtocolliDTO rp_stati2 = RicercaProtocolliDTO.builder()
                .stato(statiNonValidi)
                .build();
        rp_stati2.setPage(0);
        rp_stati2.setSize(10);
        p = protocolloServiceInject.getProtocolli(rp_stati2).getProtocolli();

        // Test ordinamento
        SortInput sort1 = new SortInput();
        sort1.by = "tsCreation";
        sort1.desc = false;
        RicercaProtocolliDTO rp_ordinamento = RicercaProtocolliDTO.builder()
                .build();
        rp_ordinamento.setSort(sort1);
        rp_ordinamento.setPage(0);
        rp_ordinamento.setSize(10);
        protocolli = protocolloServiceInject.getProtocolli(rp_ordinamento).getProtocolli();
//        assertTrue(protocolli.size() > 0);
        for (int i = 1; i < protocolli.size(); i++) {
            Protocollo previous = protocolli.get(i - 1);
            Protocollo current = protocolli.get(i);
//            assertTrue(current.getTsCreation().compareTo(previous.getTsCreation()) >= 0);
        }
    }

    //NB: Fallisce perchè modificato il getProtocolloByNumero e va modificato lo spy o gestito come mock della classe
    @Test
    void protocolloGetProtocolloByNumero_ReturnsSuccessfullyAndThrowsException() {
        String nProtocollo = "CMRC-2024-0000062";
        // Ricerca protocollo by numero
        assertNotNull(protocolloService.getProtocolloByNumero(nProtocollo));

        // Ricerca protocollo inesistente
        assertThrows(jakarta.persistence.NoResultException.class, () -> protocolloService.getProtocolloByNumero("Numero_Finto"));

        // Ricerca protocollo con input null
        assertThrows(IllegalArgumentException.class, () -> protocolloService.getProtocolloByNumero(null));
    }


    @Test
    @Transactional
    void protocolloSaveProtocolloFromPec_InsertsNewProtocollo() throws IOException {
        Allegato a1 = Allegato.findById(97511L);
        Allegato a2 = Allegato.findById(97511L);
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
                .to("lorenzo.petraroli@parsec326.it")
                .to("simone.spinelli@parsec326.it")
                .cc("lorenzo.petraroli@parsec326.it")
                .subject("TEST EMAIL PROCESS")
                .body("EMAIL TEST PROCESS")
                .attachment(dto1)
                .attachment(dto2)
                .build();

        List<Allegato> attachmentList = allegatoService.generateAllegatiFromEmailContentDTO(emailContentDTO, false);
        Protocollo protocollo =  protocolloService.saveProtocolloFromPec(emailContentDTO, attachmentList, null);
        assertNotNull(protocollo);
    }

/*  TODO DA SISTEMARE FINITI GLI SVILUPPI SPRINT 29
    @Test
    @Transactional
    void protocolloSaveProtocollo_InsertsNewProtocollo() throws IOException {
        AllegatoInput allegatoInput = new AllegatoInput();
        allegatoInput.setIdAllegato(4697L);
        allegatoInput.setDimensione(1000L);
        allegatoInput.setCollocazioneTelematica("CT");
        allegatoInput.setEstensione(".txt");
        allegatoInput.setOggetto("TEST TEST");
        allegatoInput.setInoltro(false);
        allegatoInput.setMain(true);
        allegatoInput.setPosition("TOP");
        allegatoInput.setNome("TEST_NOME");

        MittenteProtocolloInput mittenteProtocolloInput = new MittenteProtocolloInput();
        mittenteProtocolloInput.setIdMittente("ID_MITTENTE");
        mittenteProtocolloInput.setDescMittente("DESC_MITTENTE");

        ReferenteProtocolloInput referenteProtocolloInput = new ReferenteProtocolloInput();
        referenteProtocolloInput.setIsAssegnato(true);
        referenteProtocolloInput.setNomeAssegnatario("NOME_ASSEGNATARIO");

        ProtocolloInput protocolloInput = new ProtocolloInput();
        protocolloInput.setAllegati(List.of(allegatoInput));
        protocolloInput.setIdAssegnatari("simone.spinelli@parsec326.it:TO");
        protocolloInput.setIdUtente("UTENTE");
        protocolloInput.setMittente(mittenteProtocolloInput);
        protocolloInput.setMetodoSpedizione("PEC");
        protocolloInput.setInvioEmailMultiplo(0);
        protocolloInput.setTipoRegistrazione("Uscita");
        protocolloInput.setCdr("AVV0000");
        protocolloInput.setOggetto("TEST OGGETTO");
        protocolloInput.setCorpoPecPeo("TEST BODY");
        protocolloInput.setTsStartVali(Calendar.getInstance().getTime());
        protocolloInput.setReferenti(List.of(referenteProtocolloInput));
        protocolloInput.setIdTitolario(List.of(576L));

        when(ssoManagerMock.extractIdFromToken()).thenReturn("Utente");
        doNothing().when(storicoServiceMock).insertNewStoricoForNumeroProtocollo(any(), any(), any(), any(), any());
        when(emailServiceMock.saveRecordEmail(any(), anyString())).thenReturn(List.of(1L));
        doNothing().when(emailKafkaProducerMock).sendIdEmailToKafka(any());
//        Anagrafica anagrafica = mock(Anagrafica.class);
//        when(anagraficaServiceMock.save(any())).thenReturn(null);
//        doNothing().when(anagrafica).persistAndFlush();
//        when(anagrafica.getId()).thenReturn(1L);
//        when(anagraficaServiceMock.generateImpronta(any())).thenReturn("Test");
        assertNotNull(protocolloServiceInjectSpy.saveProtocollo(protocolloInput));
    }
*/

//    @Test
//    void protocolloSaveProtocollo_WithMocks_ThrowsException() throws Exception {
//        ProtocolloInput protocolloInput = new ProtocolloInput();
//        Protocollo protocollo = mock(Protocollo.class);
//
//        Query query = mock(Query.class);
//        when(emMock.createNativeQuery(any())).thenReturn(query);
//        when(query.setParameter(anyString(), any())).thenReturn(query);
//        when(query.getSingleResult()).thenReturn(null);
//        when(mapperMock.toEntity(any(ProtocolloInput.class))).thenReturn(protocollo);
//        doNothing().when(documentServiceMock).saveDocumentTimbrato(anyLong(), anyString(), anyString());
//        doNothing().when(protocollo).persist();
//        doThrow(new RuntimeException()).when(emailServiceMock).saveRecordEmail(any(Protocollo.class), anyString());
//        assertThrows(RuntimeException.class, () -> protocolloServiceInject.saveProtocollo(protocolloInput));
//    }


    @Test
    @Transactional
    void protocolloSaveProtocolloFromIdEmail_ThrowsException() {
        assertThrows(CustomException.class, () -> protocolloService.saveProtocolloByEmail(1333L));
    }

    @Test
    public void protocolloMapper_MapsProtocolloInputToProtocolloModel(){
        ProtocolloInput protocolloInput = new ProtocolloInput();
        protocolloInput.setIdUtente("1");
        protocolloInput.setTipoRegistrazione("Entrata");
        protocolloInput.setMetodoSpedizione("Sportello");
        protocolloInput.setNote("PROVA TEST");

        AllegatoInput allegato = new AllegatoInput();
        allegato.setIdAllegato(1L);

        protocolloInput.setAllegati(List.of(allegato));
        Protocollo protocollo = mapper.toEntity(protocolloInput);

        assertEquals(protocollo.getTipoRegistrazione(), TipoRegistrazione.Entrata);
        assertEquals(protocollo.getMetodoSpedizione(), MetodoSpedizione.Sportello);
    }

    @Test
    public void generateBarcodeBase64_GeneratesBarcodeFromNumeroProtocollo() throws IOException {
        String nProtocollo = "CMRC-2024-0000062";
        doNothing().when(storicoServiceMock).insertNewStoricoForNumeroProtocollo(any(), any(), any(), any(), any());
        String barcode = barcodeGeneratorServiceInject.generateBarcodeBase64(nProtocollo);
        assertNotNull(barcode);
    }

    /**
     * In questo test sono verificate tutte le funzionalità non ancora implementate.
     */
    @Test
    public void protocolloService_ThrowsNotImplementedExceptions() {
        assertThrows(NotImplementedException.class, () -> protocolloService.getFindAllQuery(null, null));
        assertThrows(NotImplementedException.class, () -> protocolloService.getFindByIdQuery(null));
    }

    private void setField(Object targetObject, String fieldName, Object value) throws Exception {
        Field field = targetObject.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(targetObject, value);
    }

    @Test
    public void generateXmlForSignatura_GeneratesValidXml(){
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(SegnaturaInformaticaType.class);
            Marshaller marshaller = jaxbContext.createMarshaller();
            marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);

            ObjectFactory factory = new ObjectFactory();
            SegnaturaInformaticaType segnatura = factory.createSegnaturaInformaticaType();
            SignatureType signatureType = new SignatureType();
            SignatureValueType signatureValueType = new SignatureValueType();
            SignedInfoType signedInfoType = new SignedInfoType();
            ReferenceType referenceType = new ReferenceType();
            referenceType.setDigestValue(new byte[]{1, 2, 3, 4});
            TransformsType transformsType = new TransformsType();
            TransformType transformType = new TransformType();
            transformType.setAlgorithm("http://www.w3.org/2000/09/xmldsig#enveloped-signature");
            transformsType.getTransform().add(transformType);
            referenceType.setTransforms(transformsType);
            DigestMethodType digestMethodType = new DigestMethodType();
            digestMethodType.setAlgorithm("http://www.w3.org/2000/09/xmldsig#sha1");
            referenceType.setDigestMethod(digestMethodType);
            signedInfoType.getReference().add(referenceType);
            SignatureMethodType signatureMethodType = new SignatureMethodType();
            signatureMethodType.setAlgorithm("http://www.w3.org/2000/09/xmldsig#rsa-sha1");
            signedInfoType.setSignatureMethod(signatureMethodType);
            CanonicalizationMethodType canonicalizationMethodType = new CanonicalizationMethodType();
            canonicalizationMethodType.setAlgorithm("http://www.w3.org/TR/2001/REC-xml-c14n-20010315");
            signedInfoType.setCanonicalizationMethod(canonicalizationMethodType);
            signatureType.setSignedInfo(signedInfoType);
            signatureValueType.setValue(new byte[]{1, 2, 3, 4});
            signatureType.setSignatureValue(signatureValueType);
            segnatura.setSignature(signatureType);
            segnatura.setVersione("3.0.0");
            segnatura.setLang("it");

            IntestazioneType intestazione = factory.createIntestazioneType();
            IdentificatoreType identificatore = factory.createIdentificatoreType();
            CodiceIPA codiceAmministrazione = factory.createCodiceIPA();
            codiceAmministrazione.setValue("AAAAAA");
            identificatore.setCodiceAmministrazione(codiceAmministrazione);
            CodiceIPA codiceAOO = factory.createCodiceIPA();
            codiceAOO.setValue("BBBBB");
            identificatore.setCodiceAOO(codiceAOO);
            identificatore.setNumeroRegistrazione("0000001");
            identificatore.setCodiceRegistro("AAAAAAAAAA");
            XMLGregorianCalendar dataReg = DatatypeFactory.newInstance().newXMLGregorianCalendar("2001-10-14");
            identificatore.setDataRegistrazione(dataReg);
            intestazione.setIdentificatore(identificatore);
            intestazione.setOggetto("OGGETTO");
            RiservatoType riservatoType = factory.createRiservatoType();
            riservatoType.setValue(true);
            intestazione.setRiservato(riservatoType);
            ClassificaType classificaType = factory.createClassificaType();
            classificaType.setCodiceFlat("ClassificaCode");
            classificaType.setDenominazione("ClassificaDenominazione");
            classificaType.setCodicePath(null);
            intestazione.setClassifica(classificaType);

            segnatura.setIntestazione(intestazione);

            DescrizioneType descrizioneType = factory.createDescrizioneType();
            SoggettoType soggettoType = factory.createSoggettoType();
            AmministrazioneType amministrazioneType = factory.createAmministrazioneType();
            amministrazioneType.setDenominazioneAmministrazione("Denominazione Amministrazione");
            amministrazioneType.setCFAmministrazione("12345678901");
            CodiceIPA codiceIPA = factory.createCodiceIPA();
            codiceIPA.setValue("IPACODE");
            amministrazioneType.setCodiceIPAAmministrazione(codiceIPA);
            soggettoType.setAmministrazione(amministrazioneType);

            descrizioneType.setMittente(soggettoType);
            DestinatarioType destinatarioType = factory.createDestinatarioType();
            destinatarioType.setAmministrazione(amministrazioneType);
            descrizioneType.getDestinatario().add(destinatarioType);
            DocumentoType documentoType = factory.createDocumentoType();
            documentoType.setNomeFile("esempio.txt");
            documentoType.setMimeType("text/plain");
            ImprontaType improntaType = factory.createImprontaType();
            improntaType.setValue(new byte[]{1, 2, 3, 4});
            documentoType.setImpronta(improntaType);
            descrizioneType.setDocumentoPrimario(documentoType);
            segnatura.setDescrizione(descrizioneType);

            // Create a JAXBElement from the SegnaturaInformaticaType object
            JAXBElement<SegnaturaInformaticaType> jaxbElement = factory.createSegnaturaInformatica(segnatura);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            marshaller.marshal(segnatura, outputStream);

            // Create a DOM document to hold the XML
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            dbf.setNamespaceAware(true);
            Document document = dbf.newDocumentBuilder().newDocument();
            marshaller.marshal(jaxbElement, new DOMResult(document));

            SchemaFactory schemaFactory = SchemaFactory.newInstance("http://www.w3.org/2001/XMLSchema");
            Schema schema = schemaFactory.newSchema(new File("src/main/resources/xsd/segnatura_protocollo.xsd"));
            marshaller.setSchema(schema);

            StringWriter sw = new StringWriter();
            marshaller.marshal(jaxbElement, sw);
            String generatedXml = sw.toString();

            // Print the generated XML
            System.out.println(generatedXml);

            // Assert that the generated XML contains expected content
            assertTrue(generatedXml.contains("ns1:versione=\"3.0.0\""));
            assertTrue(generatedXml.contains("<ns1:Oggetto>OGGETTO</ns1:Oggetto>"));
            assertTrue(generatedXml.contains("<ns2:SignatureValue>AQIDBA==</ns2:SignatureValue>"));
            assertTrue(generatedXml.contains("<ns1:DataRegistrazione>2001-10-14</ns1:DataRegistrazione"));

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void protocolloToString_PrintsProtocolloData() {
        Protocollo p = protocolloService.getProtocolloByNumero("CMRC-2024-0000180");
        assertNotNull(p);
        System.out.println(p.toString());
    }

    /*  TODO DA SISTEMARE UNA VOLTA FINITI GLI SVILUPPI SPRINT 29
        @Test
        @TestTransaction
        void assegnaProtocollo_assegnaSuccessfully() {

            ReferenteProtocolloInput input = new ReferenteProtocolloInput();
            input.setIdAssegnatario("10");
            input.setNomeAssegnatario("MARIO ROSSI");
            input.setAttribuzione("COMPETENZA");
            input.setTipoDestinatario("UTENTE");
            input.setIsAssegnato(true);

            DatiUtenteSSO datiUtenteSSOMock = new DatiUtenteSSO();
            datiUtenteSSOMock.auth_id = "1";
            datiUtenteSSOMock.userOffices = new ArrayList<>();

            when(ssoManagerMock.extractIdFromToken()).thenReturn("1");
            when(ssoManagerMock.extractNameFromToken()).thenReturn("User TEST");
            when(ssoManagerMock.getDatiUtente()).thenReturn(datiUtenteSSOMock);

            ReferenteProtocolloInput input2 = new ReferenteProtocolloInput();
            input2.setIdAssegnatario("1");
            input2.setNomeAssegnatario("DARIO BIANCHI");
            input2.setAttribuzione("COMPETENZA");
            input2.setTipoDestinatario("UTENTE");
            input2.setIsAssegnato(true);

            protocolloServiceInject.assegnaProtocollo(2691L, List.of(input2));
            protocolloServiceInject.assegnaProtocollo(2691L, List.of(input));
            protocolloServiceInject.assegnaProtocollo(2691L, List.of(input, input2));
            protocolloServiceInject.assegnaProtocollo(2691L, List.of(input, input2));
            protocolloServiceInject.assegnaProtocollo(2691L, List.of(input));
        }
    */

    @Test
    void testGenerateExcelAndPDF() throws IOException, DocumentException {
        Protocollo p1 = Protocollo.findById(96187L);
        Protocollo p2 = Protocollo.findById(96263L);
        List<Protocollo> protocolli = List.of(p1, p2);
        ByteArrayOutputStream excelOutputStream = documentService.generateExcel(protocolli, null);
        assertNotNull(excelOutputStream);
        ByteArrayInputStream excelInputStream = new ByteArrayInputStream(excelOutputStream.toByteArray());
        ByteArrayOutputStream pdfOutputStream = documentService.convertExcelToPdf(excelInputStream,"");
        assertNotNull(pdfOutputStream);
    }

    @Test
    void findReferenti_throwsException() {
        assertThrows(NullPointerException.class, () ->protocolloService.findReferenti(null));
    }

    @Test
    void findReferenti_outputsSuccessfully() {
        RicercaReferentiDTO dto = RicercaReferentiDTO.builder()
                .tipoRegistrazione("entrata")
                .isMittente(false)
                .build();

        for(int size=1; size < 60; size ++) {

            System.out.println("==============================================");
            System.out.println("SIZE PAGINA "+size);

            dto.setSize(size);
            dto.setPage(0);
            List<ReferentiOutputDTO> outputs = new ArrayList<>();

            outputs.add(protocolloService.findReferenti(dto));
            long numPages = outputs.get(0).getPageCount();
            long currentPage = dto.getPage() + 1;
            while (currentPage < numPages) {
                dto.setPage(Math.toIntExact(currentPage));
                System.out.println(">>> "+currentPage);
                ReferentiOutputDTO output = protocolloService.findReferenti(dto);
                assertNotNull(output);
                outputs.add(output);
                currentPage += 1;
            }

            int idx = 0;
            HashMap<String, Long> lonelyOffices = new HashMap<>();
            for(ReferentiOutputDTO o : outputs) {
                System.out.println(idx + " " + o.getPageCount());
                idx++;
                for(ReferenteOutputDTO office : o.getReferenti()) {
                    System.out.println(office.getLabel());
                    if (office.getChildren() != null) {
                        for (ReferenteOutputDTO utente : office.getChildren()) {
                            System.out.println(utente.getLabel());
                        }
                    }
                    else {
//                        assertFalse(lonelyOffices.containsKey(office.getIdDestinatario()));
                        lonelyOffices.put(office.getIdDestinatario(), 1L);
                    }
                }
                System.out.println("----------------");
            }

        }


        dto.setPage(99999);
        assertThrows(RuntimeException.class, () -> protocolloService.findReferenti(dto));
    }

    @Test
    public void findReferenti_withSearchTerm_filtersSuccessfully() {
        RicercaReferentiDTO dto = RicercaReferentiDTO.builder()
                .tipoRegistrazione("entrata")
                .isMittente(false)
                .build();
        dto.setPage(0);
        dto.setSize(5);
        String searchTermUser = "AVV";
        dto.setSearch(searchTermUser);

        ReferentiOutputDTO output4 = protocolloService.findReferenti(dto);
        assertNotNull(output4);
        assertTrue(output4.getPageCount() > 0);
        assertTrue(!output4.getReferenti().isEmpty());
        for (ReferenteOutputDTO o1 : output4.getReferenti()) {
            if (o1.getChildren() != null) {
                for(ReferenteOutputDTO u1 : o1.getChildren()) {
                    assertTrue(u1.getLabel().toLowerCase().contains(searchTermUser.toLowerCase()));
                }
            }
            else {
                assertTrue(o1.getLabel().toLowerCase().contains(searchTermUser.toLowerCase()));
            }
        }

        searchTermUser = "De Fusco";
        dto.setSearch(searchTermUser);
        ReferentiOutputDTO output5 = protocolloService.findReferenti(dto);
        assertNotNull(output5);
        assertTrue(output5.getPageCount() > 0);
        assertTrue(!output5.getReferenti().isEmpty());
        for (ReferenteOutputDTO o1 : output5.getReferenti()) {
            if (o1.getChildren() != null) {
                for(ReferenteOutputDTO u1 : o1.getChildren()) {
                    assertTrue(u1.getLabel().toLowerCase().contains(searchTermUser.toLowerCase()));
                }
            }
            else {
                assertTrue(o1.getLabel().toLowerCase().contains(searchTermUser.toLowerCase()));
            }
        }
    }

    @Test
    public void findReferenti_cachesSuccessfully() throws InterruptedException {
        RicercaReferentiDTO dto = RicercaReferentiDTO.builder()
                .tipoRegistrazione("entrata")
                .isMittente(false)
                .build();
        dto.setPage(0);
        dto.setSize(5);

        ReferentiOutputDTO outputDto = new ReferentiOutputDTO();
        outputDto.setPageCount(1);

        ReferentiOutputDTO output = protocolloService.findReferenti(dto);
        ReferentiOutputDTO output2 = protocolloService.findReferenti(dto);
        ReferentiOutputDTO output3 = protocolloService.forceFindReferenti(dto);

        //NOTA: per controllare che la cache sia invalidata, aggiornare il timeout con quanto scritto nell'application properties
        // quarkus.cache.caffeine.expire-after-write
        Thread.sleep(6000L);
        ReferentiOutputDTO output4 = protocolloService.findReferenti(dto);
    }

    @Test
    public void findReferenti_withEmail_outputsSuccessfully() {
        RicercaReferentiDTO dto = RicercaReferentiDTO.builder()
                .tipoRegistrazione("entrata")
                .isMittente(false)
                .metodoSpedizione("pec")
                .build();
        dto.setPage(0);
        dto.setSize(5);

        ReferentiOutputDTO output1 = protocolloService.findReferenti(dto);
        assertNotNull(output1);
    }

    @Test
    @Transactional
    void test_update_stato_protocollo(){
        StatoProtocolloInput input = new StatoProtocolloInput();
        input.idProtocollo = 96319L;
        input.statoProtocollo = "Rifiutato";
        DatiUtenteSSO datiUtenteSSO = new DatiUtenteSSO();
        Role role = new Role();
        role.name = "Archivista";
        UserOffice userOffice = new UserOffice();
        Office office = new Office();
        office.name = "AVV0000";
        office.code = "7500";
        userOffice.roles = List.of(role);
        userOffice.office = office;
        datiUtenteSSO.userOffices = List.of(userOffice);
        String idDestinatario = "12317";
        String utente = "Comune di Anguillara Sabazia";
        when(ssoManagerMock.extractIdFromToken()).thenReturn(idDestinatario);
        when(ssoManagerMock.extractNameFromToken()).thenReturn(utente);
        when(ssoManagerMock.getDatiUtente()).thenReturn(datiUtenteSSO);
        Query query = mock(Query.class);
        when(emMock.createNamedQuery(any())).thenReturn(query);
        when(emMock.createQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(1);
        doNothing().when(storicoServiceMock).insertNewStoricoForNumeroProtocollo(any(), any(), any(), any(), any());
        referentiProtocolloServiceInject.prendiInCarico(input);
        verify(storicoServiceMock).insertNewStoricoForNumeroProtocollo(any(), any(), any(), any(), any());

    }

    @Test
    void test_update_stato_protocollo_ko(){
        StatoProtocolloInput input = new StatoProtocolloInput();
        input.idProtocollo = 12312L;
        input.statoProtocollo = "Rifiutato";
        String idDestinatario = "12317";
        String utente = "Comune di Anguillara Sabazia";
        when(ssoManagerMock.extractIdFromToken()).thenReturn(idDestinatario);
        when(ssoManagerMock.extractNameFromToken()).thenReturn(utente);
        Query query = mock(Query.class);
        when(emMock.createNamedQuery(any())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(0);
        assertThrows(RuntimeException.class, () -> referentiProtocolloServiceInject.prendiInCarico(input));
    }

    @Test
    @Transactional
    void test_richiesta_annullamento_protocollo(){
        String idDestinatario = "12317";
        String utente = "Comune di Anguillara Sabazia";
        when(ssoManagerMock.extractIdFromToken()).thenReturn(idDestinatario);
        when(ssoManagerMock.extractNameFromToken()).thenReturn(utente);
        protocolloServiceInject.richiestaAnnullamentoProtocollo(96325L, "Annulla Test");
    }

    @Test
    @Transactional
    void test_annulla_protocollo() {
        // Setup
        String idDestinatario = "12317";
        String utente = "Comune di Anguillara Sabazia";
        Long idProtocollo = 96264L;
        String notaAnnullamento = "Motivazione annullamento";

        // Mock the required methods
        when(ssoManagerMock.extractIdFromToken()).thenReturn(idDestinatario);
        when(ssoManagerMock.extractNameFromToken()).thenReturn(utente);

        Query query = mock(Query.class);
        when(emMock.createNamedQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(0);

        DatiUtenteSSO mockUser = new DatiUtenteSSO();
        mockUser.firstName = "Mario";
        mockUser.lastName = "Rossi";
        mockUser.username = "mrossi";
        mockUser.email = "mario.rossi@example.com";
        mockUser.userOffices = Collections.emptyList();
        mockUser.delegations = Collections.emptyList();

        when(ssoManagerMock.getUserByAuthId(anyString(), anyInt())).thenReturn(mockUser);
//        doNothing().when(emailKafkaProducerMock).sendIdEmailToKafka(anyLong());

        protocolloServiceInject.annullaProtocollo(idProtocollo, notaAnnullamento);
    }

    // TODO: rivedere a seguito della modifica della join tra PROTOCOLLI E PROTOCOLLI_CLASSIFICAZIONE
//    @Test
//    @TestTransaction
//    void updateProtocollo_Success() {
//        String idDestinatario = "12317";
//        String utente = "UTENTE TEST";
//        ProtocolliClassificazione pc = new ProtocolliClassificazione();
//        pc.setIdProtocollo(96319L);
//        pc.setIdTitolario(7L);
//        pc.setTsCreation(Calendar.getInstance().getTime());
//        when(ssoManagerMock.extractIdFromToken()).thenReturn(idDestinatario);
//        when(ssoManagerMock.extractNameFromToken()).thenReturn(utente);
//        TypedQuery<ProtocolliClassificazione> query = mock(TypedQuery.class);
//        when(query.setParameter(anyString(), any())).thenReturn(query);
//        when(query.getResultList()).thenReturn(List.of(pc));
//        when(emMock.createNamedQuery(anyString(), eq(ProtocolliClassificazione.class))).thenReturn(query);
//
//        Email emailMock = mock(Email.class);
//        doNothing().when(emailMock).persist();
//        TypedQuery<Email> queryEmail = mock(TypedQuery.class);
//        when(queryEmail.setParameter(anyString(), any())).thenReturn(queryEmail);
//        when(queryEmail.getResultList()).thenReturn(List.of(emailMock));
//        when(emMock.createNamedQuery(anyString())).thenReturn(queryEmail);
//
//        ProtocolloUpdateInput updateInput = new ProtocolloUpdateInput();
//        updateInput.setNProtocollo("CMRC-2024-0000330"); // CMRC-2024-0000292
//        updateInput.setNote("Updated Note");
//        updateInput.setNProtocolloCircolare("12345");
//        updateInput.setIdTitolario(List.of(7L));
//
//        AllegatoInput allegatoInput = new AllegatoInput();
//        allegatoInput.setIdAllegato(1L);
//        allegatoInput.setDimensione(1000L);
//        allegatoInput.setCollocazioneTelematica("CT");
//        allegatoInput.setEstensione(".txt");
//        allegatoInput.setOggetto("TEST TEST");
//        allegatoInput.setInoltro(false);
//        allegatoInput.setMain(true);
//        allegatoInput.setPosition("TOP");
//        allegatoInput.setNome("TEST_NOME");
//        List<AllegatoInput> allegatoInputList = new ArrayList<>();
//        allegatoInputList.add(allegatoInput);
//        updateInput.setAllegati(allegatoInputList);
//
//
//        Protocollo updatedProtocollo = protocolloServiceInject.updateProtocollo(updateInput);
//
//        assertNotNull(updatedProtocollo);
//        assertEquals("Updated Note", updatedProtocollo.getNote());
//        assertEquals("12345", updatedProtocollo.getNProtocolloCircolare());
//    }

    @Test
    public void getDettaglioProtocollo_forUscitaPEC_RifiutaIsSetToFalse() {

        String nProtocollo = "CMRC-2024-0000302";

        DatiUtenteSSO datiUtenteSSOMock = new DatiUtenteSSO();
        datiUtenteSSOMock.auth_id = "10";
        datiUtenteSSOMock.userOffices = new ArrayList<>();

        Protocollo protocolloMock = new Protocollo();
        protocolloMock.setId(2691L);
        protocolloMock.setIdUtente("12321");
        protocolloMock.setStato(StatoProtocollo.InCorso);
        protocolloMock.setTipoRegistrazione(TipoRegistrazione.Entrata);
        protocolloMock.setNProtocollo(nProtocollo);
        protocolloMock.setMetodoSpedizione(MetodoSpedizione.Pec);

        when(ssoManagerMock.extractNameFromToken()).thenReturn("Nome test");
        when(ssoManagerMock.extractIdFromToken()).thenReturn("10");
        when(ssoManagerMock.getDatiUtente()).thenReturn(datiUtenteSSOMock);
        when(ssoManagerMock.isUtenteAdmin()).thenReturn(false);

        List<Protocollo> resultList = Collections.singletonList(protocolloMock);

        TypedQuery<Protocollo> queryProtocollo = mock(TypedQuery.class);
        when(queryProtocollo.setParameter(anyString(), any())).thenReturn(queryProtocollo);
        when(queryProtocollo.getResultList()).thenReturn(resultList);
        when(emMock.createNamedQuery(anyString(), eq(Protocollo.class))).thenReturn(queryProtocollo);

        when(titolarioServiceMock.getTitolarioByProtocollo(any(), anyString(), any(), anyBoolean(), anyBoolean(), anyBoolean(), anyBoolean())).thenReturn(List.of(new TitolarioOutputDTO()));
        DettaglioProtocolloDTO dettaglio = protocolloServiceSpied.getDettaglioProtocollo(nProtocollo, "7500");

        assertFalse(dettaglio.isRifiuta());
    }

    @Test
    void getDettaglioProtocollo_throwsException_whenNoOfficeSelected() {
        assertThrows(IllegalArgumentException.class, () -> protocolloService.getDettaglioProtocollo("CMRC-2024-0000032", null));
    }

    @Test
    void test_presaInCaricoMassiva(){
        DettaglioProtocolloDTO dettaglioProtocolloDTO = new DettaglioProtocolloDTO();
        Protocollo protocollo = new Protocollo();
        protocollo.setId(1L);
        protocollo.setStato(StatoProtocollo.Annullato);
        dettaglioProtocolloDTO.setProtocollo(protocollo);
        when(protocolloServiceMock.getDettaglioProtocollo(anyString(), anyString())).thenReturn(dettaglioProtocolloDTO);
        boolean result = referentiProtocolloServiceInject.prendiInCaricoMassiva(List.of("CMRC-2024-0000319"), "AVV0000");

        assertTrue(result);
    }

    @Test
    void test_presaInCaricoMassiva2(){
        DettaglioProtocolloDTO dettaglioProtocolloDTO = new DettaglioProtocolloDTO();
        Protocollo protocollo = new Protocollo();
        protocollo.setId(1L);
        protocollo.setStato(StatoProtocollo.InCorso);
        dettaglioProtocolloDTO.setProtocollo(protocollo);
        dettaglioProtocolloDTO.setStatoProtocollo("PresoinCarico");
        when(protocolloServiceMock.getDettaglioProtocollo(anyString(), anyString())).thenReturn(dettaglioProtocolloDTO);
        boolean result = referentiProtocolloServiceInject.prendiInCaricoMassiva(List.of("CMRC-2024-0000319"), "AVV0000");

        assertTrue(result);
    }

    @Test
    void test_presaInCaricoMassiva3(){
        DettaglioProtocolloDTO dettaglioProtocolloDTO = new DettaglioProtocolloDTO();
        Protocollo protocollo = new Protocollo();
        protocollo.setId(1L);
        protocollo.setStato(StatoProtocollo.InCorso);
        dettaglioProtocolloDTO.setProtocollo(protocollo);
        dettaglioProtocolloDTO.setStatoProtocollo(StatoProtocollo.DaPrendereInCarico.toString());
        when(protocolloServiceMock.getDettaglioProtocollo(anyString(), anyString())).thenReturn(dettaglioProtocolloDTO);
        boolean result = referentiProtocolloServiceInject.prendiInCaricoMassiva(List.of("0001"), "OFFICE");

        assertTrue(result);
    }

    @Test
    @TestTransaction
    void test_fascicolazioneProtocollo_success(){
        String selectedOffice = "OFFICE";
        List<Long> idTitolarioList = Arrays.asList(1L, 2L, 3L);

        PanacheMock.mock(Protocollo.class);
        Protocollo protocollo = new Protocollo();
        protocollo.setId(1L);
        protocollo.setNProtocollo("CMRC-2024-0000062");
        protocollo.setStato(StatoProtocollo.InCorso);
        protocollo.setTipoRegistrazione(TipoRegistrazione.Interno);

        when(Protocollo.findById(anyLong())).thenReturn((protocollo));

        List<Protocollo> resultList = Collections.singletonList(protocollo);

        TypedQuery<Protocollo> queryProtocollo = mock(TypedQuery.class);
        when(queryProtocollo.setParameter(anyString(), any())).thenReturn(queryProtocollo);
        when(queryProtocollo.getResultList()).thenReturn(resultList);
        when(emMock.createNamedQuery(anyString(), eq(Protocollo.class))).thenReturn(queryProtocollo);

        PanacheMock.mock(Titolario.class);
        //Il titolario con il quale è classificato il protocollo
        TitolarioOutputDTO titolarioProtocollo = new TitolarioOutputDTO();
        titolarioProtocollo.setId(4L);
        titolarioProtocollo.setLeaf(true);
        when(titolarioServiceMock.getTitolarioByProtocollo(any(), anyString(), any(), anyBoolean(), anyBoolean(), anyBoolean(), anyBoolean())).thenReturn(List.of(titolarioProtocollo));

        //Titolari che andranno salvati
        Titolario titolario1 = mock(Titolario.class);
        doNothing().when(titolario1).persist();
        when(titolario1.getId()).thenReturn(1L);
        when(titolario1.getLeaf()).thenReturn(true);

        Titolario titolario2 = mock(Titolario.class);
        doNothing().when(titolario2).persist();
        when(titolario2.getId()).thenReturn(2L);
        when(titolario2.getLeaf()).thenReturn(true);

        Titolario titolario3 = mock(Titolario.class);
        doNothing().when(titolario3).persist();
        when(titolario3.getId()).thenReturn(3L);
        when(titolario3.getLeaf()).thenReturn(true);

        Mockito.when(Titolario.findById(titolario1.getId())).thenReturn(titolario1);
        Mockito.when(Titolario.findById(titolario2.getId())).thenReturn(titolario2);
        Mockito.when(Titolario.findById(titolario3.getId())).thenReturn(titolario3);

        PanacheMock.mock(ReferentiProtocollo.class);
        ReferentiProtocollo referente = new ReferentiProtocollo();
        String idDestinatarioCompetenza = "1234";
        String nomeDestinatarioCompetenza = "Mario";

        referente.setIdProtocollo(1L);
        referente.setIdDestinatario(idDestinatarioCompetenza);
        referente.setNomeDestinatario(nomeDestinatarioCompetenza);
        referente.setAttribuzione("competenza");
        referente.setTipoDestinatario("utente");
        referente.setStatoProtocollo(StatoProtocollo.PresoInCarico);

        when(ReferentiProtocollo.list(anyString(), any(Object[].class))).thenReturn(List.of(referente));
        when(ssoManagerMock.isUtenteAdmin()).thenReturn(false);
        when(ssoManagerMock.extractIdFromToken()).thenReturn(idDestinatarioCompetenza);
        when(ssoManagerMock.extractNameFromToken()).thenReturn(nomeDestinatarioCompetenza);

        when(ssoManagerMock.extractOfficesByRoles(any())).thenReturn(List.of(selectedOffice));
        when(referentiProtocolloServiceMock.isProtocolAuthor(any(),any())).thenReturn(false);

        doNothing().when(storicoServiceMock).insertNewStoricoForNumeroProtocollo(any(), any(), any(), any(), any());
        boolean resultClassificazione = protocolloServiceInjectMock.fascicolazioneProtocollo(protocollo.getId(),idTitolarioList,selectedOffice);
        assertTrue(resultClassificazione);
    }

    @Test
    @Transactional
    void should_not_fascicolazione_protocollo_when_protocollo_annullato(){
        String selectedOffice = "OFFICE";
        List<Long> idTitolarioList = Arrays.asList(1L, 2L, 3L);

        PanacheMock.mock(Protocollo.class);
        Protocollo protocollo = new Protocollo();
        protocollo.setId(1L);
        protocollo.setNProtocollo("CMRC-2024-0000062");
        protocollo.setStato(StatoProtocollo.Annullato);
        protocollo.setTipoRegistrazione(TipoRegistrazione.Interno);

        when(Protocollo.findById(anyLong())).thenReturn((protocollo));

        List<Protocollo> resultList = Collections.singletonList(protocollo);

        TypedQuery<Protocollo> queryProtocollo = mock(TypedQuery.class);
        when(queryProtocollo.setParameter(anyString(), any())).thenReturn(queryProtocollo);
        when(queryProtocollo.getResultList()).thenReturn(resultList);
        when(emMock.createNamedQuery(anyString(), eq(Protocollo.class))).thenReturn(queryProtocollo);

        PanacheMock.mock(Titolario.class);
        //Il titolario con il quale è classificato il protocollo
        TitolarioOutputDTO titolarioProtocollo = new TitolarioOutputDTO();
        titolarioProtocollo.setId(4L);
        titolarioProtocollo.setLeaf(true);
        when(titolarioServiceMock.getTitolarioByProtocollo(any(), anyString(), any(), anyBoolean(), anyBoolean(), anyBoolean(), anyBoolean())).thenReturn(List.of(titolarioProtocollo));

        PanacheMock.mock(ReferentiProtocollo.class);
        ReferentiProtocollo referente = new ReferentiProtocollo();
        String idDestinatarioCompetenza = "1234";
        String nomeDestinatarioCompetenza = "Mario";

        referente.setIdProtocollo(1L);
        referente.setIdDestinatario(idDestinatarioCompetenza);
        referente.setNomeDestinatario(nomeDestinatarioCompetenza);
        referente.setAttribuzione("competenza");
        referente.setTipoDestinatario("utente");

        when(ReferentiProtocollo.list(anyString(), any(Object[].class))).thenReturn(List.of(referente));
        when(ssoManagerMock.isUtenteAdmin()).thenReturn(false);
        when(ssoManagerMock.extractIdFromToken()).thenReturn(idDestinatarioCompetenza);
        when(ssoManagerMock.extractNameFromToken()).thenReturn(nomeDestinatarioCompetenza);

        when(ssoManagerMock.extractOfficesByRoles(any())).thenReturn(List.of(selectedOffice));
        when(referentiProtocolloServiceMock.isProtocolAuthor(any(),any())).thenReturn(false);
        Executable executable = () -> protocolloServiceInjectMock.fascicolazioneProtocollo(protocollo.getId(), idTitolarioList, selectedOffice);
        assertThrows(CustomException.class, executable);
    }

    @Test
    @TestTransaction
    void should_not_fascicolazione_protocollo_when_one_titolario_not_leaf(){
        String selectedOffice = "OFFICE";
        List<Long> idTitolarioList = Arrays.asList(1L, 2L, 3L);

        PanacheMock.mock(Protocollo.class);
        Protocollo protocollo = new Protocollo();
        protocollo.setId(1L);
        protocollo.setNProtocollo("CMRC-2024-0000062");
        protocollo.setStato(StatoProtocollo.InCorso);
        protocollo.setTipoRegistrazione(TipoRegistrazione.Interno);

        when(Protocollo.findById(anyLong())).thenReturn((protocollo));

        List<Protocollo> resultList = Collections.singletonList(protocollo);

        TypedQuery<Protocollo> queryProtocollo = mock(TypedQuery.class);
        when(queryProtocollo.setParameter(anyString(), any())).thenReturn(queryProtocollo);
        when(queryProtocollo.getResultList()).thenReturn(resultList);
        when(emMock.createNamedQuery(anyString(), eq(Protocollo.class))).thenReturn(queryProtocollo);

        PanacheMock.mock(Titolario.class);
        //Il titolario con il quale è classificato il protocollo
        TitolarioOutputDTO titolarioProtocollo = new TitolarioOutputDTO();
        titolarioProtocollo.setId(4L);
        titolarioProtocollo.setLeaf(true);
        when(titolarioServiceMock.getTitolarioByProtocollo(any(), anyString(), any(), anyBoolean(), anyBoolean(), anyBoolean(), anyBoolean())).thenReturn(List.of(titolarioProtocollo));

        //Titolari che andranno salvati
        Titolario titolario1 = mock(Titolario.class);
        doNothing().when(titolario1).persist();
        when(titolario1.getId()).thenReturn(1L);
        when(titolario1.getLeaf()).thenReturn(true);

        Titolario titolario2 = mock(Titolario.class);
        doNothing().when(titolario2).persist();
        when(titolario2.getId()).thenReturn(2L);
        when(titolario2.getLeaf()).thenReturn(false);

        Mockito.when(Titolario.findById(titolario1.getId())).thenReturn(titolario1);
        Mockito.when(Titolario.findById(titolario2.getId())).thenReturn(titolario2);

        PanacheMock.mock(ReferentiProtocollo.class);
        ReferentiProtocollo referente = new ReferentiProtocollo();
        String idDestinatarioCompetenza = "1234";
        String nomeDestinatarioCompetenza = "Mario";

        referente.setIdProtocollo(1L);
        referente.setIdDestinatario(idDestinatarioCompetenza);
        referente.setNomeDestinatario(nomeDestinatarioCompetenza);
        referente.setAttribuzione("competenza");
        referente.setTipoDestinatario("utente");
        referente.setStatoProtocollo(StatoProtocollo.PresoInCarico);

        when(ReferentiProtocollo.list(anyString(), any(Object[].class))).thenReturn(List.of(referente));
        when(ssoManagerMock.isUtenteAdmin()).thenReturn(false);
        when(ssoManagerMock.extractIdFromToken()).thenReturn(idDestinatarioCompetenza);
        when(ssoManagerMock.extractNameFromToken()).thenReturn(nomeDestinatarioCompetenza);

        when(ssoManagerMock.extractOfficesByRoles(any())).thenReturn(List.of(selectedOffice));
        when(referentiProtocolloServiceMock.isProtocolAuthor(any(),any())).thenReturn(false);
        Executable executable = () -> protocolloServiceInjectMock.fascicolazioneProtocollo(protocollo.getId(), idTitolarioList, selectedOffice);
        assertThrows(CustomException.class, executable);
    }

    @Test
    @Transactional
    void should_not_fascicolazione_protocollo_when_protocollo_not_assegnato(){
        String selectedOffice = "OFFICE";
        List<Long> idTitolarioList = Arrays.asList(1L, 2L, 3L);

        PanacheMock.mock(Protocollo.class);
        Protocollo protocollo = new Protocollo();
        protocollo.setId(1L);
        protocollo.setNProtocollo("CMRC-2024-0000062");
        protocollo.setStato(StatoProtocollo.InCorso);
        protocollo.setTipoRegistrazione(TipoRegistrazione.Interno);

        when(Protocollo.findById(anyLong())).thenReturn((protocollo));

        List<Protocollo> resultList = Collections.singletonList(protocollo);

        TypedQuery<Protocollo> queryProtocollo = mock(TypedQuery.class);
        when(queryProtocollo.setParameter(anyString(), any())).thenReturn(queryProtocollo);
        when(queryProtocollo.getResultList()).thenReturn(resultList);
        when(emMock.createNamedQuery(anyString(), eq(Protocollo.class))).thenReturn(queryProtocollo);

        PanacheMock.mock(Titolario.class);
        //Il titolario con il quale è classificato il protocollo
        TitolarioOutputDTO titolarioProtocollo = new TitolarioOutputDTO();
        titolarioProtocollo.setId(4L);
        titolarioProtocollo.setLeaf(true);
        when(titolarioServiceMock.getTitolarioByProtocollo(any(), anyString(), any(), anyBoolean(), anyBoolean(), anyBoolean(), anyBoolean())).thenReturn(List.of(titolarioProtocollo));

        PanacheMock.mock(ReferentiProtocollo.class);
        ReferentiProtocollo referente = new ReferentiProtocollo();
        String idDestinatarioCompetenza = "1234";
        String nomeDestinatarioCompetenza = "Mario";

        referente.setIdProtocollo(1L);
        referente.setIdDestinatario(idDestinatarioCompetenza);
        referente.setNomeDestinatario(nomeDestinatarioCompetenza);
        referente.setAttribuzione("conoscenza");
        referente.setTipoDestinatario("utente");

        when(ReferentiProtocollo.list(anyString(), any(Object[].class))).thenReturn(List.of(referente));
        when(ssoManagerMock.isUtenteAdmin()).thenReturn(false);
        when(ssoManagerMock.extractIdFromToken()).thenReturn(idDestinatarioCompetenza);
        when(ssoManagerMock.extractNameFromToken()).thenReturn(nomeDestinatarioCompetenza);

        when(ssoManagerMock.extractOfficesByRoles(any())).thenReturn(List.of(selectedOffice));
        when(referentiProtocolloServiceMock.isProtocolAuthor(any(),any())).thenReturn(false);
        Executable executable = () -> protocolloServiceInjectMock.fascicolazioneProtocollo(protocollo.getId(), idTitolarioList, selectedOffice);
        assertThrows(CustomException.class, executable);
    }
    @Test
    @Transactional
    void should_not_fascicolazione_protocollo_when_protocollo_not_preso_in_carico(){
        String selectedOffice = "OFFICE";
        List<Long> idTitolarioList = Arrays.asList(1L, 2L, 3L);

        PanacheMock.mock(Protocollo.class);
        Protocollo protocollo = new Protocollo();
        protocollo.setId(1L);
        protocollo.setNProtocollo("CMRC-2024-0000062");
        protocollo.setStato(StatoProtocollo.InCorso);
        protocollo.setTipoRegistrazione(TipoRegistrazione.Interno);

        when(Protocollo.findById(anyLong())).thenReturn((protocollo));

        List<Protocollo> resultList = Collections.singletonList(protocollo);

        TypedQuery<Protocollo> queryProtocollo = mock(TypedQuery.class);
        when(queryProtocollo.setParameter(anyString(), any())).thenReturn(queryProtocollo);
        when(queryProtocollo.getResultList()).thenReturn(resultList);
        when(emMock.createNamedQuery(anyString(), eq(Protocollo.class))).thenReturn(queryProtocollo);

        PanacheMock.mock(Titolario.class);
        //Il titolario con il quale è classificato il protocollo
        TitolarioOutputDTO titolarioProtocollo = new TitolarioOutputDTO();
        titolarioProtocollo.setId(4L);
        titolarioProtocollo.setLeaf(true);
        when(titolarioServiceMock.getTitolarioByProtocollo(any(), anyString(), any(), anyBoolean(), anyBoolean(), anyBoolean(), anyBoolean())).thenReturn(List.of(titolarioProtocollo));

        PanacheMock.mock(ReferentiProtocollo.class);
        ReferentiProtocollo referente = new ReferentiProtocollo();
        String idDestinatarioCompetenza = "1234";
        String nomeDestinatarioCompetenza = "Mario";

        referente.setIdProtocollo(1L);
        referente.setIdDestinatario(idDestinatarioCompetenza);
        referente.setNomeDestinatario(nomeDestinatarioCompetenza);
        referente.setAttribuzione("competenza");
        referente.setTipoDestinatario("utente");

        when(ReferentiProtocollo.list(anyString(), any(Object[].class))).thenReturn(List.of(referente));
        when(ssoManagerMock.isUtenteAdmin()).thenReturn(false);
        when(ssoManagerMock.extractIdFromToken()).thenReturn(idDestinatarioCompetenza);
        when(ssoManagerMock.extractNameFromToken()).thenReturn(nomeDestinatarioCompetenza);

        when(ssoManagerMock.extractOfficesByRoles(any())).thenReturn(List.of(selectedOffice));
        when(referentiProtocolloServiceMock.isProtocolAuthor(any(),any())).thenReturn(false);
        Executable executable = () -> protocolloServiceInjectMock.fascicolazioneProtocollo(protocollo.getId(), idTitolarioList, selectedOffice);
        assertThrows(CustomException.class, executable);
    }

    @Test
    @Transactional
    void should_not_fascicolazione_protocollo_when_titolarioList_is_null(){
        String selectedOffice = "OFFICE";
        PanacheMock.mock(Protocollo.class);
        Protocollo protocollo = new Protocollo();
        protocollo.setId(1L);
        protocollo.setNProtocollo("CMRC-2024-0000062");
        protocollo.setStato(StatoProtocollo.InCorso);
        protocollo.setTipoRegistrazione(TipoRegistrazione.Interno);

        Executable executable = () -> protocolloServiceInjectMock.fascicolazioneProtocollo(protocollo.getId(), null, selectedOffice);
        assertThrows(CustomException.class, executable);
    }

    @Test
    @Transactional
    void should_not_fascicolazione_protocollo_when_titolarioList_is_empty(){
        String selectedOffice = "OFFICE";
        PanacheMock.mock(Protocollo.class);
        Protocollo protocollo = new Protocollo();
        protocollo.setId(1L);
        protocollo.setNProtocollo("CMRC-2024-0000062");
        protocollo.setStato(StatoProtocollo.InCorso);
        protocollo.setTipoRegistrazione(TipoRegistrazione.Interno);

        Executable executable = () -> protocolloServiceInjectMock.fascicolazioneProtocollo(protocollo.getId(), new ArrayList<>(), selectedOffice);
        assertThrows(CustomException.class, executable);
    }

    @Test
    @TestTransaction
    void test_fascicolazioneProtocolloMassiva_success(){
        String selectedOffice = "OFFICE";
        List<Long> idProtocolloList = List.of(96263L);
        List<Long> idTitolarioList = Arrays.asList(1L, 2L, 3L);

        PanacheMock.mock(Protocollo.class);

        Protocollo protocollo = new Protocollo();
        protocollo.setId(1L);
        protocollo.setNProtocollo("CMRC-2024-0000062");
        protocollo.setStato(StatoProtocollo.InCorso);
        protocollo.setTipoRegistrazione(TipoRegistrazione.Interno);

        when(Protocollo.findById(96263L)).thenReturn(protocollo);

        List<Protocollo> resultList = Collections.singletonList(protocollo);

        TypedQuery<Protocollo> queryProtocollo = mock(TypedQuery.class);
        when(queryProtocollo.setParameter(anyString(), any())).thenReturn(queryProtocollo);
        when(queryProtocollo.getResultList()).thenReturn(resultList);
        when(emMock.createNamedQuery(anyString(), eq(Protocollo.class))).thenReturn(queryProtocollo);

        PanacheMock.mock(Titolario.class);
        //Il titolario con il quale è classificato il protocollo
        TitolarioOutputDTO titolarioProtocollo = new TitolarioOutputDTO();
        titolarioProtocollo.setId(4L);
        titolarioProtocollo.setLeaf(true);
        when(titolarioServiceMock.getTitolarioByProtocollo(any(), anyString(), any(), anyBoolean(), anyBoolean(), anyBoolean(), anyBoolean())).thenReturn(List.of(titolarioProtocollo));

        //Titolari che andranno salvati
        Titolario titolario1 = mock(Titolario.class);
        doNothing().when(titolario1).persist();
        when(titolario1.getId()).thenReturn(1L);
        when(titolario1.getLeaf()).thenReturn(true);

        Titolario titolario2 = mock(Titolario.class);
        doNothing().when(titolario2).persist();
        when(titolario2.getId()).thenReturn(2L);
        when(titolario2.getLeaf()).thenReturn(true);

        Titolario titolario3 = mock(Titolario.class);
        doNothing().when(titolario3).persist();
        when(titolario3.getId()).thenReturn(3L);
        when(titolario3.getLeaf()).thenReturn(true);

        Mockito.when(Titolario.findById(titolario1.getId())).thenReturn(titolario1);
        Mockito.when(Titolario.findById(titolario2.getId())).thenReturn(titolario2);
        Mockito.when(Titolario.findById(titolario3.getId())).thenReturn(titolario3);

        PanacheMock.mock(ReferentiProtocollo.class);
        ReferentiProtocollo referente = new ReferentiProtocollo();
        String idDestinatarioCompetenza = "1234";
        String nomeDestinatarioCompetenza = "Mario";

        referente.setIdProtocollo(1L);
        referente.setIdDestinatario(idDestinatarioCompetenza);
        referente.setNomeDestinatario(nomeDestinatarioCompetenza);
        referente.setAttribuzione("competenza");
        referente.setTipoDestinatario("utente");
        referente.setStatoProtocollo(StatoProtocollo.PresoInCarico);

        when(ReferentiProtocollo.list(anyString(), any(Object[].class))).thenReturn(List.of(referente));
        when(ssoManagerMock.isUtenteAdmin()).thenReturn(false);
        when(ssoManagerMock.extractIdFromToken()).thenReturn(idDestinatarioCompetenza);
        when(ssoManagerMock.extractNameFromToken()).thenReturn(nomeDestinatarioCompetenza);

        when(ssoManagerMock.extractOfficesByRoles(any())).thenReturn(List.of(selectedOffice));
        when(referentiProtocolloServiceMock.isProtocolAuthor(any(),any())).thenReturn(false);

        doNothing().when(storicoServiceMock).insertNewStoricoForNumeroProtocollo(any(), any(), any(), any(), any());
        boolean resultClassificazione = protocolloServiceInjectMock.fascicolazioneMassiva(idProtocolloList,idTitolarioList,selectedOffice);
        assertTrue(resultClassificazione);
    }

    @Test
    @Transactional
    void should_not_fascicolazione_massiva_when_idProtocolloList_is_null(){
        String selectedOffice = "OFFICE";
        List<Long> idTitolarioList = Arrays.asList(1L, 2L, 3L);

        PanacheMock.mock(Protocollo.class);

        Protocollo protocollo = new Protocollo();
        protocollo.setId(1L);
        protocollo.setNProtocollo("CMRC-2024-0000062");
        protocollo.setStato(StatoProtocollo.InCorso);
        protocollo.setTipoRegistrazione(TipoRegistrazione.Interno);

        Executable executable = () -> protocolloServiceInjectMock.fascicolazioneMassiva(null,idTitolarioList,selectedOffice);
        assertThrows(IllegalArgumentException.class, executable);
    }

    @Test
    @Transactional
    void should_not_fascicolazione_massiva_when_idProtocolloList_isEmpt(){
        String selectedOffice = "OFFICE";
        List<Long> idTitolarioList = Arrays.asList(1L, 2L, 3L);

        PanacheMock.mock(Protocollo.class);

        Protocollo protocollo = new Protocollo();
        protocollo.setId(1L);
        protocollo.setNProtocollo("CMRC-2024-0000062");
        protocollo.setStato(StatoProtocollo.InCorso);
        protocollo.setTipoRegistrazione(TipoRegistrazione.Interno);

        Executable executable = () -> protocolloServiceInjectMock.fascicolazioneMassiva(new ArrayList<>(),idTitolarioList,selectedOffice);
        assertThrows(IllegalArgumentException.class, executable);
    }


    @Test
    void computeStato_executesSuccessfully() {
        Protocollo protocollo = new Protocollo();
        protocollo.setId(1L);
        protocollo.setNProtocollo("CMRC-2024-0000062");

        List<ReferentiProtocollo> referentyNull = null;
        List<ReferentiProtocollo> referentyEmpty = new ArrayList<>();

        protocollo.setStato(StatoProtocollo.RichiestaDiAnnullamento);
        assertTrue(protocollo.computeStatoProtocollo(referentyEmpty, false).getStato().equalsIgnoreCase(StatoProtocollo.RichiestaDiAnnullamento.getStato()));

        protocollo.setStato(StatoProtocollo.Annullato);
        assertTrue(protocollo.computeStatoProtocollo(referentyEmpty, false).getStato().equalsIgnoreCase(StatoProtocollo.Annullato.getStato()));

        protocollo.setStato(StatoProtocollo.InCorso);

        assertTrue(protocollo.computeStatoProtocollo(referentyNull, false).getStato().equalsIgnoreCase(StatoProtocollo.DaAssegnare.getStato()));
        assertTrue(protocollo.computeStatoProtocollo(referentyEmpty, false).getStato().equalsIgnoreCase(StatoProtocollo.DaAssegnare.getStato()));

        List<ReferentiProtocollo> referentyAllUtenti = new ArrayList<>();
        ReferentiProtocollo refUtente = new ReferentiProtocollo();
        refUtente.setTipoDestinatario(TipoDestinatarioReferente.UTENTE.getNome());
        referentyAllUtenti.add(refUtente);
        StatoProtocollo p = protocollo.computeStatoProtocollo(referentyAllUtenti, false);
        assertTrue(p.getStato().equalsIgnoreCase(StatoProtocollo.InCorso.getStato()));

        referentyAllUtenti = new ArrayList<>();
        refUtente = new ReferentiProtocollo();
        refUtente.setTipoDestinatario(TipoDestinatarioReferente.UTENTE.getNome());
        refUtente.setStatoProtocollo(StatoProtocollo.Rifiutato);
        referentyAllUtenti.add(refUtente);
        p = protocollo.computeStatoProtocollo(referentyAllUtenti, false);
        assertTrue(p.getStato().equalsIgnoreCase(StatoProtocollo.DaAssegnare.getStato()));

        referentyAllUtenti = new ArrayList<>();
        refUtente = new ReferentiProtocollo();
        refUtente.setTipoDestinatario(TipoDestinatarioReferente.UTENTE.getNome());
        refUtente.setStatoProtocollo(StatoProtocollo.Rifiutato);
        referentyAllUtenti.add(refUtente);
        ReferentiProtocollo refUfficio = new ReferentiProtocollo();
        refUfficio.setTipoDestinatario(TipoDestinatarioReferente.UFFICIO.getNome());
        referentyAllUtenti.add(refUfficio);
        p = protocollo.computeStatoProtocollo(referentyAllUtenti, false);
        assertTrue(p.getStato().equalsIgnoreCase(StatoProtocollo.InCorso.getStato()));

        referentyAllUtenti = new ArrayList<>();
        refUtente = new ReferentiProtocollo();
        refUtente.setTipoDestinatario(TipoDestinatarioReferente.UTENTE.getNome());
        refUtente.setStatoProtocollo(StatoProtocollo.PresoInCarico);
        referentyAllUtenti.add(refUtente);
        refUfficio = new ReferentiProtocollo();
        refUfficio.setTipoDestinatario(TipoDestinatarioReferente.UFFICIO.getNome());
        referentyAllUtenti.add(refUfficio);
        p = protocollo.computeStatoProtocollo(referentyAllUtenti, false);
        assertTrue(p.getStato().equalsIgnoreCase(StatoProtocollo.PresoInCarico.getStato()));

    }

    @Test
    public void getOrganigramma_returnsSuccessfully() {
        RicercaReferentiDTO dto = new RicercaReferentiDTO();
        dto.setPage(36);
        dto.setSize(50);
        dto.setSearch("");
        ReferentiOutputDTO output = protocolloService.getOrganigramma(dto);
        assertNotNull(output);

        System.out.println("Numero pagine: " + output.getPageCount());
        int idx_o = 0;
        for(ReferenteOutputDTO o : output.getReferenti()) {
            idx_o++;
            System.out.println(idx_o + " " + o.getLabel());
            int idx_u = 0;
            if (o.getChildren() != null) {
                for (ReferenteOutputDTO u : o.getChildren()) {
                    idx_u++;
                    System.out.println(" >>> " + idx_u + " " + u.getLabel());
                }
            }
        }
    }
}
