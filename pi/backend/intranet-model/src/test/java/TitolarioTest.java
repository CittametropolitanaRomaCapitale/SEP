import io.quarkus.panache.mock.PanacheMock;
import io.quarkus.test.TestTransaction;
import io.quarkus.test.junit.QuarkusTest;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.*;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSSO;
import it.parsec326.pi.intranet.dto.common.TitolarioOutputDTO;
import it.parsec326.pi.intranet.dto.input.TitolarioInput;
import it.parsec326.pi.intranet.dto.input.UtenteVisibilitaInput;
import it.parsec326.pi.intranet.dto.input.VisibilitaTitolarioInput;
import it.parsec326.pi.intranet.dto.ricerca.RicercaAllegatiDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaProtocolliDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaTitolarioDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.mapper.TitolarioMapper;
import it.parsec326.pi.intranet.model.Allegato;
import it.parsec326.pi.intranet.model.Protocollo;
import it.parsec326.pi.intranet.model.Titolario;
import it.parsec326.pi.intranet.model.VisibilitaTitolario;
import it.parsec326.pi.intranet.service.AllegatoService;
import it.parsec326.pi.intranet.service.DocumentService;
import it.parsec326.pi.intranet.service.StoricoService;
import it.parsec326.pi.intranet.service.TitolarioService;
import it.parsec326.pi.intranet.utils.SortInput;
import it.parsec326.pi.intranet.utils.common.TipologiaTitolario;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import lombok.Getter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.lang.reflect.Field;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
public class TitolarioTest {

    @Inject
    @Getter
    UserTransaction transaction;
    @Inject
    EntityManager em;
    @Inject
    TitolarioMapper mapper;
    @Inject
    StoricoService storicoService;
    StoricoService storicoServiceMock = mock(StoricoService.class);
    AllegatoService allegatoServiceMock = mock(AllegatoService.class);
    DocumentService documentServiceMock = mock(DocumentService.class);
    SSOClient ssoManagerMock = mock(SSOClient.class);
    EntityManager emMock = mock(EntityManager.class);

    TitolarioService titolarioServiceInject;
    TitolarioService titolarioServiceMock;
    @Inject
    TitolarioService titolarioService;

    @Inject
    AllegatoService allegatoService;

    Titolario titolarioMock = mock(Titolario.class);


    @BeforeEach
    void setUp() throws Exception {
        titolarioServiceInject = new TitolarioService();
        this.setField(titolarioServiceInject, "em", em);
        this.setField(titolarioServiceInject, "transaction", transaction);
        this.setField(titolarioServiceInject, "mapper", mapper);
        this.setField(titolarioServiceInject, "ssoManager", ssoManagerMock);
        this.setField(titolarioServiceInject, "storicoService", storicoServiceMock);

        titolarioServiceMock = new TitolarioService();
        this.setField(titolarioServiceMock, "em", emMock);
        this.setField(titolarioServiceMock, "ssoManager", ssoManagerMock);
        this.setField(titolarioServiceMock, "storicoService", storicoServiceMock);
        this.setField(titolarioServiceMock, "allegatoService", allegatoServiceMock);
        this.setField(titolarioServiceMock, "documentService", documentServiceMock);


    }

    private void setField(Object targetObject, String fieldName, Object value) throws Exception {
        Field field = targetObject.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(targetObject, value);
    }

    private void traverseSection(Long idPadre, int level, int maxLevel) throws Exception {
        if (level > maxLevel) { //per testare il fatto che il titolario non abbia collegamenti ciroclari
            throw new Exception("Max level reached");
        }
        RicercaTitolarioDTO dto = new RicercaTitolarioDTO();
        dto.setSize(10000);
        dto.setPage(0);
        dto.setIdPadre(idPadre);

        System.out.println("----------------");
        System.out.println("Cerco per id padre: " + idPadre);
        TitolariOutputDTO titolari = titolarioService.getTitolarioSection(dto);
        assertNotNull(titolari);

        for (TitolarioOutputDTO t : titolari.getTitolario()) {
            assertEquals(Long.valueOf(t.getIdPadre()), idPadre == null ? 0L : idPadre);

            System.out.println("Elemento trovato {Id: " + t.getId() + " Label: " + t.getLabel() + " Padre: " + t.getIdPadre() + " Foglia: " + t.isLeaf() + "}");
            traverseSection(t.getId(), level + 1, maxLevel);
        }
        System.out.println("=================");
    }

    @Test
    public void findTitolario_traverseSuccessfullyAllTitolario() {
        try {
            traverseSection(null, 1, 60);
        } catch (Exception e) {
            assertFalse(false);
        }
    }

    @Test
    public void findTitolario_searchesSuccessfully() {
        RicercaTitolarioDTO dto = new RicercaTitolarioDTO();
        dto.setSize(10000);
        dto.setPage(0);
        dto.setIdPadre(null);
        dto.setSearch("NON ESISTENTETET T£$ T£$T£$T£$T$£GFGFDGFDGFDGDF");

        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_SSO");
        when(ssoManagerMock.isUtenteAdmin()).thenReturn(true);
        TitolariOutputDTO titolari = titolarioServiceInject.getTitolarioSection(dto);
        assertNotNull(titolari);
        assertTrue(titolari.getTitolario().isEmpty());
    }

    @Test
    public void findTitolario_searchesSuccessfullyWithHierarchy() {
        RicercaTitolarioDTO dto = new RicercaTitolarioDTO();
        dto.setSize(10000);
        dto.setPage(0);
        dto.setIdPadre(1L);
        dto.setSearch("fascicolo");
        dto.setCdrCode("7500");

        Mockito.when(titolarioMock.getIdUtenteCreatore()).thenReturn("ID_UTENTE_CREATORE");
        Mockito.when(titolarioMock.getCdrCode()).thenReturn("7500");
        Mockito.when(titolarioMock.getTipologiaTitolario()).thenReturn(TipologiaTitolario.FascicoloLv1);

        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_SSO");
        when(ssoManagerMock.isUtenteAdmin()).thenReturn(true);
        when(ssoManagerMock.hasMatchingRoleAndCdr(any(),anyList(), anyString())).thenReturn(true);

        TitolariOutputDTO titolari = titolarioServiceInject.getTitolarioSection(dto);
        assertNotNull(titolari);
        assertFalse(!titolari.getTitolario().isEmpty());
    }

    @Test
    public void getDescendants_returnsSuccessfully() {
        List<Long> id = titolarioService.getDescendantsForTitolarioId(92650L);
        assertNotNull(id);
        assertTrue(id.isEmpty());

        id = titolarioService.getDescendantsForTitolarioId(-1L);
        assertTrue(id.isEmpty());

        TitolariOutputDTO dto = titolarioService.getHierarchyForTitolarioId(92650L);
        assertNotNull(dto);
    }

    @Test
    @Transactional
    void should_insertTitolario_ok() {
        TitolarioInput input = new TitolarioInput();
        input.setIdPadre(130L);
        input.setNome("FASCICOLO_TEST" + UUID.randomUUID().toString());
        input.setLeaf(false);
        input.setNote("TEST FASCICOLO MOCK" + UUID.randomUUID().toString());
        input.setTipologia("FascicoloLvN");
//        input.setTsChiusura(Calendar.getInstance().getTime());
        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_SSO");
        when(ssoManagerMock.extractNameFromToken()).thenReturn("PARSEC");
        assertTrue(titolarioServiceInject.insertTitolario(input));
        verify(ssoManagerMock, times(3)).extractIdFromToken();

    }

    @Test
    @Transactional
    void should_insertTitolario_ko() {
        TitolarioInput input = new TitolarioInput();
        input.setIdPadre(130L);
        input.setNome("FASCICOLO_TEST");
        input.setLeaf(false);
        input.setNote("TEST FASCICOLO MOCK");
        input.setTsChiusura(Calendar.getInstance().getTime());
        when(ssoManagerMock.extractIdFromToken()).thenThrow(new RuntimeException("SSO MANAGER KO"));
        assertThrows(RuntimeException.class, () -> {
            titolarioServiceInject.insertTitolario(input);
        });
    }

    @Test
    @Transactional
    void should_updateTitolario() {
        TitolarioInput input = new TitolarioInput();
        input.setId(30101L);
        input.setIdPadre(59L);
        input.setTipologia("FascicoloLv1");
        input.setNome("FASCICOLO_TEST_UPDATE");
        input.setLeaf(false);
        input.setNote("TEST FASCICOLO MOCK UPDATE");
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.MONTH, Calendar.DECEMBER);
        cal.set(Calendar.DAY_OF_MONTH, 15);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 11);
        cal.set(Calendar.SECOND, 25);
        cal.set(Calendar.MILLISECOND, 222);
        input.setTsChiusura(cal.getTime());
        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_SSO");
        when(ssoManagerMock.extractNameFromToken()).thenReturn("PARSEC");
        titolarioServiceInject.updateTitolario(input);
    }

    @Test
    @Transactional
    void should_updateTitolario2() {
        TitolarioInput input = new TitolarioInput();
        input.setId(30101L);
        input.setIdPadre(59L);
        input.setTipologia("FascicoloLv1");
        input.setNome("FASCICOLO_TEST_UPDATE");
        input.setLeaf(true);
        input.setNote("TEST FASCICOLO MOCK UPDATE");
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.MONTH, Calendar.DECEMBER);
        cal.set(Calendar.DAY_OF_MONTH, 15);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 11);
        cal.set(Calendar.SECOND, 25);
        cal.set(Calendar.MILLISECOND, 222);
        input.setTsChiusura(cal.getTime());
        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_SSO");
        when(ssoManagerMock.extractNameFromToken()).thenReturn("PARSEC");
        titolarioServiceInject.updateTitolario(input);
    }

    @Test
    @Transactional
    void should_updateTitolario_ko() {
        TitolarioInput input = new TitolarioInput();
        input.setId(92650L);
        input.setIdPadre(130L);
        input.setNome("FASCICOLO_TEST_UPDATE");
        input.setLeaf(false);
        input.setNote("TEST FASCICOLO MOCK UPDATE");
        when(ssoManagerMock.extractIdFromToken()).thenThrow(new RuntimeException("SSO MANAGER KO"));
        assertThrows(RuntimeException.class, () -> {
            titolarioServiceInject.updateTitolario(input);
        });
    }

    @Test
    @Transactional
    void should_spostaTitolario() {
        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_SSO");
        when(ssoManagerMock.extractNameFromToken()).thenReturn("PARSEC");
        titolarioServiceInject.spostaFascicolo(List.of(33738L), 3L, "7500", "AVV000");
    }


    @Test
    @TestTransaction
    void spostaFascicolo_deletesPermessi() {
        Titolario t1 = new Titolario();
        t1.setTipologiaTitolario(TipologiaTitolario.SottoSezione);
        t1.setNome("TEST FASCICOLO");
        t1.setIdPadre(null);
        t1.setTsCreation(new Date());
        t1.setLeaf(false);
        t1.persist();

        Titolario f1 = new Titolario();
        f1.setTipologiaTitolario(TipologiaTitolario.FascicoloLv1);
        f1.setNome("TEST FASCICOLO I");
        f1.setIdPadre(t1.getId());
        f1.setTsCreation(new Date());
        f1.setLeaf(false);
        f1.persist();

        VisibilitaTitolario vf1 = new VisibilitaTitolario();
        vf1.setTitolario(f1);
        vf1.setCdr("TEST");
        vf1.setWrite(true);
        vf1.setNote("Note test");
        vf1.persist();

        Titolario f2 = new Titolario();
        f2.setTipologiaTitolario(TipologiaTitolario.FascicoloLvN);
        f2.setNome("TEST FASCICOLO II");
        f2.setIdPadre(f1.getId());
        f2.setTsCreation(new Date());
        f2.setLeaf(false);
        f2.persist();

        Titolario f3 = new Titolario();
        f3.setTipologiaTitolario(TipologiaTitolario.FascicoloLvN);
        f3.setNome("TEST FASCICOLO II");
        f3.setIdPadre(f2.getId());
        f3.setTsCreation(new Date());
        f3.setLeaf(false);
        f3.persist();

        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_SSO");
        when(ssoManagerMock.extractNameFromToken()).thenReturn("PARSEC");
        titolarioServiceInject.spostaFascicolo(List.of(f2.getId()), t1.getId(), "7500", "AVV0000");

        Map<String, Object> p = new HashMap<>();
        p.put("t", f2);
        VisibilitaTitolario vf2 = VisibilitaTitolario.find("titolario = :t", p).firstResult();
        assertEquals(vf2.getNote(), vf1.getNote());

        titolarioServiceInject.spostaFascicolo(List.of(f2.getId()), f1.getId(), "7500", "AVV0000");

        long shouldBeZero = VisibilitaTitolario.find("titolario = :t", p).count();
        assertEquals(0, shouldBeZero);
    }

    @Test
    @Transactional
    void should_getAllIdProtocolloByFascicolo() {
        List<Protocollo> result = titolarioService.getAllProtocolliByFascicolo(573L);
        assertFalse(!result.isEmpty());
    }

    @Test
    @Transactional
    void should_spostaProtocollo() {
        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_SSO");
        when(ssoManagerMock.extractNameFromToken()).thenReturn("PARSEC");
        titolarioServiceInject.spostaProtocollo(List.of(96187L), 30101L, 35434L);
    }

    @Test
    @Transactional
    void should_deleteFascicoloWithProtoccolliAssociati() {
        boolean response = titolarioServiceInject.deleteTitolario(36238L, false);
//      assertTrue(response);
    }

    @Test
    @Transactional
    void should_deleteFascicoloOK() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, 2030);
        cal.set(Calendar.MONTH, Calendar.DECEMBER);
        cal.set(Calendar.DAY_OF_MONTH, 15);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 11);
        cal.set(Calendar.SECOND, 25);
        cal.set(Calendar.MILLISECOND, 222);
        PanacheMock.mock(Titolario.class);
        when(Titolario.findById(anyLong())).thenReturn(titolarioMock);
        when(titolarioMock.getTsChiusura()).thenReturn(cal.getTime());
        when(titolarioMock.getLeaf()).thenReturn(false);
        when(titolarioMock.getTipologiaTitolario()).thenReturn(TipologiaTitolario.FascicoloLv1);
        doNothing().when(titolarioMock).persistAndFlush();
        doNothing().when(storicoServiceMock).insertNewStoricoForIdTitolario(any(), anyString(), anyString(), anyString(), anyString());
        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_SSO");
        when(ssoManagerMock.extractNameFromToken()).thenReturn("PARSEC");
        boolean response = titolarioServiceInject.deleteTitolario(1234L, false);
//      assertFalse(response);
    }

    @Test
    @Transactional
    void should_deleteFascicolo2OK() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, 2030);
        cal.set(Calendar.MONTH, Calendar.DECEMBER);
        cal.set(Calendar.DAY_OF_MONTH, 15);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 11);
        cal.set(Calendar.SECOND, 25);
        cal.set(Calendar.MILLISECOND, 222);
        PanacheMock.mock(Titolario.class);
        Mockito.when(Titolario.findById(anyLong())).thenReturn(titolarioMock);
        Mockito.when(titolarioMock.getTsChiusura()).thenReturn(cal.getTime());
        Mockito.when(titolarioMock.getId()).thenReturn(577L);
        Mockito.when(titolarioMock.getLeaf()).thenReturn(true);
        Mockito.when(titolarioMock.getTipologiaTitolario()).thenReturn(TipologiaTitolario.FascicoloLv1);
        doNothing().when(titolarioMock).persistAndFlush();
        doNothing().when(storicoServiceMock).insertNewStoricoForIdTitolario(any(), anyString(), anyString(), anyString(), anyString());
        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_SSO");
        when(ssoManagerMock.extractNameFromToken()).thenReturn("PARSEC");
        boolean response = titolarioServiceInject.deleteTitolario(577L, false);
//      assertFalse(response);
    }


    @Test
    @Transactional
    void should_getProtocolloByFascicolo() {

        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss", Locale.ITALIAN);
        try {
            Date dateIntervalloFrom = formatter.parse("01-09-2024 00:00:00");
            Date dateIntervalloTo = formatter.parse("03-09-2024 23:59:59");

            RicercaProtocolliDTO dto = RicercaProtocolliDTO.builder()
                    .numero("CMRC-2024-0000353")
                    .anno(2024)
                    .oggetto("TEST OGGETTO")
                    .stato(List.of("InCorso"))
                    .tipoRegistrazione(List.of("Uscita"))
                    .metodoSpedizione(List.of("Pec"))
                    .assegnatari("NOME_ASSEGNATARIO")
                    .mittente("DESC_MITTENTE")
                    .idFascicolo(573L)
                    .isRicercaAvanzata(true)
                    .dataCreazioneFrom(dateIntervalloFrom)
                    .dataCreazioneTo(dateIntervalloTo)
                    .build();
            dto.setPage(0);
            dto.setSize(5);

            SortInput sort1 = new SortInput();
            sort1.by = "tsCreation";
            sort1.desc = false;
            dto.setSort(sort1);

            when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_SSO");
            when(ssoManagerMock.extractNameFromToken()).thenReturn("PARSEC");
            when(ssoManagerMock.isUtenteAdmin()).thenReturn(true);
            when(ssoManagerMock.hasMatchingRoleAndCdr(any(DatiUtenteSSO.class), anyList(), anyString())).thenReturn(true);

            ProtocolliOutputDTO result = titolarioServiceInject.getProtocolliByFascicolo(dto);
            assertFalse(!result.getProtocolli().isEmpty());

        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    @Transactional
    void test_insertVisibilitaTitolario() {
        VisibilitaTitolarioInput input = new VisibilitaTitolarioInput();
        input.idTitolario = 92877L;
        input.utenteAuthIdList = List.of("aaaa-bbbb");
        input.cdr = "7500";
        input.permesso="scrittura";

        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_SSO");
        when(ssoManagerMock.extractNameFromToken()).thenReturn("PARSEC");

// hasMatchingRoleAndCdr no Mock
//        doReturn(true).when(ssoManagerMock).hasMatchingRoleAndCdr(datiUtenteSSO, List.of("archivista"), "7500").thenReturn(true);

        assertThrows(CustomException.class, () -> {
            titolarioService.insertVisibilitaTitolario(input);
        });
    }

    @Test
    @Transactional
    void test_insertVisibilitaTitolario_AllConditionsKO() {
        // Caso 1: input nullo
        assertThrows(RuntimeException.class, () -> {
            titolarioService.insertVisibilitaTitolario(null);
        });

        // Prepara un oggetto input valido per testare gli altri if
        VisibilitaTitolarioInput input = new VisibilitaTitolarioInput();
        input.idTitolario = 123L;

        // Caso 2: Titolario nullo
        PanacheMock.mock(Titolario.class);
        Mockito.when(Titolario.findById(anyLong())).thenReturn(null);
        assertThrows(RuntimeException.class, () -> {
            titolarioService.insertVisibilitaTitolario(input);
        });

        // Simula un titolario esistente
        PanacheMock.mock(Titolario.class);
        Mockito.when(Titolario.findById(anyLong())).thenReturn(titolarioMock);

        // Caso 3: Lista utenti vuota
        input.utenti = List.of();
        assertThrows(RuntimeException.class, () -> {
            titolarioService.insertVisibilitaTitolario(input);
        });

        // Caso 4: CDR nullo o vuoto
        input.utenti = List.of(new UtenteVisibilitaInput("idUtente", "username", "nome"));
        input.cdr = "";
        assertThrows(RuntimeException.class, () -> {
            titolarioService.insertVisibilitaTitolario(input);
        });

        // Caso 5: idUtente nullo o vuoto
        input.cdr = "7500";
        input.utenti = List.of(new UtenteVisibilitaInput(null, "username", "nome"));
        assertThrows(RuntimeException.class, () -> {
            titolarioService.insertVisibilitaTitolario(input);
        });

        // Caso 6: usernameUtente nullo o vuoto
        input.utenti = List.of(new UtenteVisibilitaInput("idUtente", "", "nome"));
        assertThrows(RuntimeException.class, () -> {
            titolarioService.insertVisibilitaTitolario(input);
        });

        // Caso 7: nomeUtente nullo o vuoto
        input.utenti = List.of(new UtenteVisibilitaInput("idUtente", "username", ""));
        assertThrows(RuntimeException.class, () -> {
            titolarioService.insertVisibilitaTitolario(input);
        });
    }

    @Test
    @Transactional
    void test_deleteVisibilitaTitolario(){
        PanacheMock.mock(VisibilitaTitolario.class);
        titolarioService.deleteVisibilitaTitolario(List.of(92910L));
    }

    @Test
    @Transactional
    void test_deleteVisibilitaTitolarioKO(){
        PanacheMock.mock(VisibilitaTitolario.class);
        assertThrows(RuntimeException.class, () -> {
            titolarioService.deleteVisibilitaTitolario(List.of());
        });
    }

    @Test
    @Transactional
    void testGetAllegati() {
        RicercaAllegatiDTO dto = RicercaAllegatiDTO.builder()
                .idTitolario(574L)
                .build();
        dto.setPage(0);
        dto.setSize(5);
        dto.setSearch("CMRC-2024-0000266_2");

        AllegatiOutputDTO result = allegatoService.getAllegati(dto);
        assertFalse(!result.getAllegati().isEmpty());
    }

    @Test
    void testGetAllegatiKO() {
        // Test KO: parametro dto nullo
        assertThrows(RuntimeException.class, () -> {
            allegatoService.getAllegati(null);
        });

        // Test KO: idTitolario nullo
        RicercaAllegatiDTO dto = new RicercaAllegatiDTO();
        dto.setIdTitolario(null);
        assertThrows(RuntimeException.class, () -> {
            allegatoService.getAllegati(dto);
        });
    }

    @Test
    @Transactional
    void spostaAllegatiFascicolo(){
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, 2030);
        cal.set(Calendar.MONTH, Calendar.DECEMBER);
        cal.set(Calendar.DAY_OF_MONTH, 15);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 11);
        cal.set(Calendar.SECOND, 25);
        cal.set(Calendar.MILLISECOND, 222);
        Query query = mock(Query.class);
        when(emMock.createNamedQuery(any())).thenReturn(query);
        when(emMock.createQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(2);
        PanacheMock.mock(Allegato.class);
        Allegato a = new Allegato();
        a.setNome("Allegato speciale");
        when(Allegato.findById(anyLong())).thenReturn(a);
        when(ssoManagerMock.extractIdFromToken()).thenReturn("ID_UTENTE_SSO");
        when(ssoManagerMock.isUtenteAdmin()).thenReturn(true);
        PanacheMock.mock(Titolario.class);
        Titolario t = new Titolario();
        t.setNome("Titolario Importantissimo");
        t.setTsChiusura(cal.getTime());
        t.setLeaf(true);
        when(Titolario.findById(anyLong())).thenReturn(t);
        doNothing().when(storicoServiceMock).insertNewStoricoForIdTitolario(any(), anyString(), anyString(), anyString(), anyString());
        when(allegatoServiceMock.spostaAllegatoTitolario(any(), anyLong())).thenReturn(false);
        when(documentServiceMock.shortenFileName(anyString(), anyInt())).thenReturn("TEST");
        boolean result = titolarioServiceMock.spostaAllegatiFascicolo(List.of(2372L, 2369L), 577L, 576L);
        assertTrue(result);
    }
    @Test
    @Transactional
    void spostaAllegatiFascicoloKO(){
        CustomException thrown = assertThrows(CustomException.class, () -> {
            titolarioService.spostaAllegatiFascicolo(List.of(2372L, 2369L), 577L, 576L);        });
        assertNotNull( thrown.getMessage());
    }


//    Test con problematica di Transaction
//    @Test
//    @TestTransaction
//    void createFascicoloDipendente_successfully_creates() {
//        titolarioService.createFascicoliDipendenti();
//    }
}
