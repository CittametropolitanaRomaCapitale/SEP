import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
class AllegatoTest {

   /* @Spy
    private EntityManager em;

    @Mock
    private MinioConnectionFactory minioFactory;

    @InjectMocks
    private AllegatoService allegatoService;

    private AllegatoService allegatoServiceMock = mock(AllegatoService.class);
    private BarcodeGeneratorService barcodeGeneratorServiceMock = mock(BarcodeGeneratorService.class);
    private  StoricoService storicoServiceMock = mock(StoricoService.class);
    private SSOClient ssoManagerMock = mock(SSOClient.class);
    ReferentiProtocolloService referentiProtocolloServiceMock = mock(ReferentiProtocolloService.class);

    @Inject
    AttachmentContentTypeService attachmentContentTypeService;

    private DocumentService documentServiceInject;

    @Inject
    private DocumentService documentService;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        documentServiceInject = new DocumentService();
        this.setField(documentServiceInject, "em", em);
        this.setField(documentServiceInject, "allegatoService", allegatoServiceMock);
        this.setField(documentServiceInject, "barcodeGeneratorService", barcodeGeneratorServiceMock);
        this.setField(documentServiceInject, "storicoService", storicoServiceMock);
        this.setField(documentServiceInject, "ssoManager", ssoManagerMock);
        this.setField(documentServiceInject, "referentiProtocolloService", referentiProtocolloServiceMock);
        this.setField(allegatoService, "attachmentContentTypeService", attachmentContentTypeService);
    }

    private void setField(Object targetObject, String fieldName, Object value) throws Exception {
        Field field = targetObject.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(targetObject, value);
    }

    @Test
    public void allegatoSaveAllegati_SavesNewAllegato() throws Exception {
        byte[] dummyBytes = "dummy content".getBytes(StandardCharsets.UTF_8);
        Allegato allegato = mock(Allegato.class);
        allegato.setDimensione(4_194_304L);
        long partSize = 2_097_152L;
        doNothing().when(allegato).persist();
        List<Allegato> sameAllegati = List.of(new Allegato());
        Query query = mock(Query.class);
        when(em.createNamedQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);  // Configure as needed
        when(query.getResultList()).thenReturn(sameAllegati);  // Assuming it returns an empty list for this example
        when(minioFactory.uploadFileWithFilename( anyString(), anyString(), anyString())).thenReturn(true);

        Allegato savedAllegato = allegatoService.saveAllegati(dummyBytes, allegato, "testFile", ".txt", partSize, false);
        assertNotNull(savedAllegato);
    }


    @Test
    void saveAllegato_UpdatesAllegatoWithNewFieldsSuccessfully() throws Exception {
        byte[] dummyBytes = "dummy content".getBytes(StandardCharsets.UTF_8);
        ByteArrayInputStream dummyArrayInputStream = new ByteArrayInputStream(dummyBytes);

        when(minioFactory.uploadFileWithFilename( anyString(), anyString(), anyString())).thenReturn(true);
        Query query = mock(Query.class);
        when(em.createNativeQuery(anyString())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(1);
        doReturn(query).when(query).setParameter(anyInt(), any());
        allegatoService.saveAllegati(dummyArrayInputStream, "testFile_timbrato", ".pdf", 2370L);
        verify(query, times(1)).executeUpdate();
    }

    @Test
    @TestTransaction
    void saveAllegatiFromUploadForm_SavesAllegatiSuccessfully() throws Exception {
        FileUploadForm fileUploadForm = new FileUploadForm();
        fileUploadForm.setFileData("dummy file data".getBytes());
        fileUploadForm.setFileName("testFile.email");
        fileUploadForm.setOggetto("Test Object");
        fileUploadForm.setCollocazioneTelematica("Test Collocazione Telematica");
        fileUploadForm.setIsMain("1");
        fileUploadForm.setDimensione(1024L);

        when(minioFactory.uploadFileWithFilename(anyString(), anyString(), anyString())).thenReturn(true);
        Query query = mock(Query.class);
        when(em.createNativeQuery(anyString())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(1);
        doReturn(query).when(query).setParameter(anyInt(), any());

        Allegato savedAllegato = allegatoService.saveAllegati(fileUploadForm);
        assertNotNull(savedAllegato);

        Allegato savedAllegato2 = allegatoService.saveAllegati(fileUploadForm);
        assertNotNull(savedAllegato2);

        Allegato savedAllegato3 = allegatoService.saveAllegati(fileUploadForm);
        assertNotNull(savedAllegato3);
    }

    @Test
    void updateAllegato_UpdatesAllegatoSuccessfully() {
        AllegatoInput input = new AllegatoInput();
        input.setIdAllegato(2L);
        input.setOggetto("New Object");
        input.setCollocazioneTelematica("New Collocazione Telematica");
        input.setMain(true);
        Query query = mock(Query.class);
        when(em.createNativeQuery(anyString())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(1);
        doReturn(query).when(query).setParameter(anyInt(), any());

        assertNotNull(allegatoService.updateAllegato(input));
    }

    @Test
    void deleteAllegato_deletesAllegatoFromFilenameSuccessfully() {
        String filename = "testFile.txt";
        when(minioFactory.deleteFile(eq("pi-docs"), anyString())).thenReturn(true);
        boolean isDeleted = allegatoService.deleteByRef(filename);
        verify(minioFactory, times(1)).deleteFile(eq("pi-docs"), anyString());
        assertTrue(isDeleted);
    }

    @Test
    void downloadAllegato_downloadsSuccessfully(){
        InputStream inputStream = mock(InputStream.class);
        when(minioFactory.downloadFile(eq("pi-docs"), anyString())).thenReturn(inputStream);
        allegatoService.downloadByRef("test.pdf");
        verify(minioFactory, times(1)).downloadFile(eq("pi-docs"), anyString());
    }

    @Test
    void  deleteAllegato_deleteById_returnsFalse() {
        boolean shouldBeDeleted = allegatoService.delete(1L);
        assertFalse(shouldBeDeleted);
    }

    *//*
    Il test è fatto per coprire l'upload di un file eml
     *//*
    @Test
    @TestTransaction
    void saveAllegati_savesEmlFileSuccessfully_thenDeletes() throws Exception {
        FileUploadForm fileUploadForm = new FileUploadForm();
        fileUploadForm.setFileData("dummy file data".getBytes());
        fileUploadForm.setFileName("testFile.eml");
        fileUploadForm.setOggetto("Test Object");
        fileUploadForm.setCollocazioneTelematica("Test Collocazione Telematica");
        fileUploadForm.setIsMain("1");
        fileUploadForm.setDimensione(1024L);

        byte[] pdfBytes = Files.readAllBytes(Paths.get(getClass().getResource("/test.pdf").toURI()));
        InputStream pdfStream = new ByteArrayInputStream(pdfBytes);
        when(minioFactory.downloadFile(anyString(), anyString())).thenReturn(pdfStream);
        when(minioFactory.uploadFileWithFilename(anyString(), anyString(), anyString())).thenReturn(true);
        Query query = mock(Query.class);
        when(em.createNativeQuery(anyString())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(1);
        doReturn(query).when(query).setParameter(anyInt(), any());

        Allegato savedAllegato = allegatoService.saveAllegati(fileUploadForm);
        Allegato savedAllegato2 = allegatoService.saveAllegati(fileUploadForm);

        assertNotNull(savedAllegato);
        assertNotNull(savedAllegato2);

        boolean shouldBeDeleted = allegatoService.delete(savedAllegato.id);
        boolean shouldBeDeleted2 = allegatoService.delete(savedAllegato2.id);
//        assertFalse(shouldBeDeleted);
        assertFalse(shouldBeDeleted2);
    }


    @Test
    void saveDocumentTimbrato_savesPdfWithTimbroOnTop() throws IOException, URISyntaxException {
        byte[] pdfBytes = Files.readAllBytes(Paths.get(getClass().getResource("/test.pdf").toURI()));
        InputStream pdfStream = new ByteArrayInputStream(pdfBytes);
        when(allegatoServiceMock.downloadByRef(anyString())).thenReturn(pdfStream);
        doNothing().when(allegatoServiceMock).saveAllegati(any(ByteArrayInputStream.class), anyString(), anyString(), anyLong());
        documentServiceInject.saveDocumentTimbrato(2L, "CMRC-2024-001122442", "top");
        verify(allegatoServiceMock).saveAllegati(any(ByteArrayInputStream.class), anyString(), anyString(), anyLong());
    }

    @Test
    void saveDocumentTimbrato_savesPdfWithTimbroOnLeft() throws IOException, URISyntaxException {
        byte[] pdfBytes = Files.readAllBytes(Paths.get(getClass().getResource("/test.pdf").toURI()));
        InputStream pdfStream = new ByteArrayInputStream(pdfBytes);
        when(allegatoServiceMock.downloadByRef(anyString())).thenReturn(pdfStream);
        doNothing().when(allegatoServiceMock).saveAllegati(any(ByteArrayInputStream.class), anyString(), anyString(), anyLong());
        documentServiceInject.saveDocumentTimbrato(2L, "CMRC-2024-001122442", "left");
        verify(allegatoServiceMock).saveAllegati(any(ByteArrayInputStream.class), anyString(), anyString(), anyLong());
    }

    @Test
    void saveDocumentTimbrato_ThrowsException() throws IOException, URISyntaxException {
        byte[] pdfBytes = Files.readAllBytes(Paths.get(getClass().getResource("/test.pdf").toURI()));
        InputStream pdfStream = new ByteArrayInputStream(pdfBytes);
        when(allegatoServiceMock.downloadByRef(anyString())).thenReturn(pdfStream);
        doThrow(RuntimeException.class).when(allegatoServiceMock).saveAllegati(any(ByteArrayInputStream.class), anyString(), anyString(), anyLong());
        assertThrows(RuntimeException.class, () -> {
            documentServiceInject.saveDocumentTimbrato(1148L, "CMRC-2024-001122442", "down");
        });
    }

    @Test
    void buildAttachmentsForEmail_createsListOfAttachmentDTOSuccessfully() {
        InputStream inputStream = mock(InputStream.class);
        when(minioFactory.downloadFile(eq("pi-docs"), anyString())).thenReturn(inputStream);
        List<Allegato> allegati = new ArrayList<>();
        allegati.add(Allegato.findById(2L));
        List<AttachmentDTO> list = allegatoService.buildAttachmentsForEmail(allegati);
        assertEquals("application/pdf", list.get(0).getType());
    }

    @Test
    void createPdfRicevuta_producesPDFBytesSuccessfullyInject() throws IOException {

        Protocollo protocollo = Protocollo.findById(96091L);
        List<ProtocolliClassificazione> pcs = new ArrayList<>();
        Query query = mock(Query.class);
        when(em.createNamedQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.getResultList()).thenReturn(pcs);
        String barcodeBase64 = "VGhpcyBpcyBhIHRlc3Qgc3RyaW5nLg=="; //""BASE64_ENCODED_IMAGE_STRING";
        when(barcodeGeneratorServiceMock.generateBarcodeOnlyBase64(anyString())).thenReturn(barcodeBase64);
        when(referentiProtocolloServiceMock.getNomeDestinatariInizialiPerCompetenza(anyLong())).thenReturn(List.of("test"));
        doNothing().when(storicoServiceMock).insertNewStoricoForNumeroProtocollo(any(), any(), any(), any(), any());


        // Istanza del protocollo presa da DB per consentire test di salvataggio storico!
        //Protocollo protocollo = new Protocollo();
        //protocollo.setNProtocollo("1234");
        //protocollo.setTsCreation(Date.from(Instant.now()));

        String pdfBase64 = documentServiceInject.createPdfRicevuta(protocollo);

        byte[] decodedBytes = Base64.getDecoder().decode(pdfBase64);

        try (PDDocument pdfDocument = PDDocument.load(decodedBytes)) {
            assertNotNull(pdfDocument);
        }
    }*/

}