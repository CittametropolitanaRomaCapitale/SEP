package it.parsec326.pi.intranet.service;

import io.quarkus.cache.CacheInvalidate;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Parameters;
import io.quarkus.panache.common.Sort;
import it.parsec326.pi.intranet.client.IpaClient;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.*;
import it.parsec326.pi.intranet.dto.common.GruppoOutputDTO;
import it.parsec326.pi.intranet.dto.common.ReferenteOutputDTO;
import it.parsec326.pi.intranet.dto.excel.ErrorRecord;
import it.parsec326.pi.intranet.dto.excel.ImportResult;
import it.parsec326.pi.intranet.dto.input.AnagraficaInput;
import it.parsec326.pi.intranet.dto.input.AnagraficaShaBuilder;
import it.parsec326.pi.intranet.dto.ipa.json_mapper.DataResponseIpaAOO;
import it.parsec326.pi.intranet.dto.ipa.json_mapper.DataResponseIpaInfo;
import it.parsec326.pi.intranet.dto.ipa.json_mapper.DataResponseIpaUOInfo;
import it.parsec326.pi.intranet.dto.output.AnagraficaDTO;
import it.parsec326.pi.intranet.dto.output.GruppoDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaAnagraficaDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaGruppiDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.exception.ExceptionChecked;
import it.parsec326.pi.intranet.mapper.AnagraficaMapper;
import it.parsec326.pi.intranet.mapper.GruppoMapper;
import it.parsec326.pi.intranet.mapper.ReferenteMapper;
import it.parsec326.pi.intranet.model.Anagrafica;
import it.parsec326.pi.intranet.model.Gruppo;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.utils.LogUtils;
import it.parsec326.pi.intranet.utils.SortInput;
import it.parsec326.pi.intranet.utils.Utils;
import it.parsec326.pi.intranet.utils.common.MetodoSpedizione;
import it.parsec326.pi.intranet.utils.common.TipoDestinatarioReferente;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@ApplicationScoped
public class AnagraficaService implements PanacheCustomEntityServiceInterface<Anagrafica> {

  @Inject
  @Getter
  UserTransaction transaction;

  @Inject
  AnagraficaMapper anagraficaMapper;

  @Inject
  ReferenteMapper referenteMapper;

  @Inject
  DocumentService documentService;

  @Inject

  IpaClient ipaClient;

  @Inject
  EntityManager em;

  @Inject
  SSOClient ssoManager;

  @Inject
  GruppoMapper gruppoMapper;

  /**
   * Servizio che restituisce tutta la lista della anagrafica paginata
   * accetta sort e ricerca globale
   * @param dto - conterrà tutti i parametri in input che vengono dai filtri
   * @return
   */
  @ExceptionChecked
  public AnagraficaOutputDTO getAllAnagrafica(RicercaAnagraficaDTO dto) {
    if (dto == null) throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());

    PanacheQuery<Anagrafica> query = getAnagraficaQuery(dto);
    List<Anagrafica> anagraficaList = query.page(Page.of(dto.getPage(), dto.getSize())).list();

    long totalResults = query.count();
    AnagraficaOutputDTO outputDTO = new AnagraficaOutputDTO(anagraficaList, getPagesCount(totalResults, dto.getSize()), totalResults);
    return outputDTO;
  }

  @ExceptionChecked
  public AnagraficaDTOList getAllAnagraficaDTO(RicercaAnagraficaDTO dto) {
    if (dto == null) throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());

    PanacheQuery<Anagrafica> query = getAnagraficaQuery(dto);
    List<AnagraficaDTO> anagraficaList = query.page(Page.of(dto.getPage(), dto.getSize()))
            .list()
            .stream()
            .map(this::convertToAnagraficaDTO)
            .toList();

    long totalResults = query.count();
    AnagraficaDTOList outputDTO = new AnagraficaDTOList(anagraficaList, getPagesCount(totalResults, dto.getSize()), totalResults);

    return outputDTO;
  }

  public AnagraficaDTO convertToAnagraficaDTO(Anagrafica entity) {
    return AnagraficaDTO.builder()
            .id(entity.getId())
            .ragioneSociale(entity.getRagioneSociale())
            .nome(entity.getNome())
            .cognome(entity.getCognome())
            .cfPiva(entity.getCfPiva())
            .indirizzo(entity.getIndirizzo())
            .citta(entity.getCitta())
            .cap(entity.getCap())
            .provincia(entity.getProvincia())
            .email(entity.getEmail())
            .pec(entity.getPec())
            .telefono(entity.getTelefono())
            .fax(entity.getFax())
            .note(entity.getNote())
            .tsCreation(entity.getTsCreation())
            .tsStartVali(entity.getTsStartVali())
            .cancellato(entity.isCancellato())
            .certificato(entity.isCertificato())
            .impronta(entity.getImpronta())
            .idIpaInad(entity.getIdIpaInad())
            .gruppi(findGruppiByAnagrafica(entity.getId()))
            .build();
  }

  @Transactional
  public List<GruppoDTO> findGruppiByAnagrafica(Long anagraficaId) {
    TypedQuery<Gruppo> query = em.createNamedQuery("findGruppiByAnagraficaId", Gruppo.class);
    query.setParameter("anagraficaId", anagraficaId);
    List<Gruppo> gruppi = query.getResultList();

    return gruppi.stream()
            .map(this::convertToDTO)
            .toList();
  }

  public GruppoDTO convertToDTO(Gruppo gruppo) {
    return GruppoDTO.builder()
            .id(gruppo.getId())
            .nome(gruppo.getNome())
            .build();
  }

  /**
   * Servizio che costruisce una query dinamica per la restituzione della lista di tutta la anagrafica
   * accetta sort, e un parametro search per la ricerca globale sui campi:
   * 'ragioneSociale','nome','cognome','cfPiva','email','pec',
   * @param dto - conterrà tutti i parametri in input che vengono dal dto di ricerca
   * @return
   */
  public PanacheQuery<Anagrafica> getAnagraficaQuery(RicercaAnagraficaDTO dto) {
    Sort sortCriteria = SortInput.getSortOrDefault(dto.hasSort() ? dto.getSort() : dto.getDefaultSort());

    Map<String, Object> params = new HashMap<>();
    StringBuilder query = new StringBuilder("id is not null and cancellato = false ");


    if(dto.hasSearch()){
      String search = dto.getSearch().trim().toLowerCase().replace(" ", "");

      query.append("and (:search = '' ")
              .append("or lower(REPLACE(ragioneSociale, ' ', '')) like LOWER(concat('%', :search, '%')) ")
              .append("or lower(REPLACE(nome, ' ', '')) like LOWER(concat('%', :search, '%')) ")
              .append("or lower(REPLACE(cognome, ' ', '')) like LOWER(concat('%', :search, '%')) ")
              .append("or lower(cfPiva) like LOWER(concat('%', :search, '%')) ")
              .append("or lower(email) like LOWER(concat('%', :search, '%')) ")
              .append("or lower(pec) like LOWER(concat('%', :search, '%')) ")
              .append("or lower(REPLACE(concat(nome, cognome), ' ', '')) like LOWER(concat('%', :search, '%')) ")
              .append("or lower(REPLACE(concat(cognome, nome), ' ', '')) like LOWER(concat('%', :search, '%')) ")
              .append(")");
      params.put("search", search);
    }

    if (dto.hasGruppoId()) {
      query.append(" and id IN (select a.id from Gruppo g join g.contatti a where g.id = :groupId) ");
      params.put("groupId", dto.getGruppoId());
    }

    if (dto.hasOnlyCertified()) {
      query.append(" and certificato = true ");
    }

    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return Anagrafica.find(query.toString(), sortCriteria, params);
  }

  public String generateImpronta(Anagrafica anagrafica) {
    return AnagraficaShaBuilder.builder()
            .ragioneSociale(normalize(anagrafica.getRagioneSociale()))
            .cf_piva(normalize(anagrafica.getCfPiva()))
            .indirizzo(normalize(anagrafica.getIndirizzo()))
            .citta(normalize(anagrafica.getCitta()))
            .cap(normalize(anagrafica.getCap()))
            .pec(normalize(anagrafica.getPec()))
            .build()
            .getImpronta();
  }

  private String normalize(String value) {
    return value != null ? value.toLowerCase() : null;
  }


  @Transactional
  public Anagrafica getContattoEsistenteConCampiUnivoci(String impronta) {
    Optional<Anagrafica> anagraficaOptional = Anagrafica.find("impronta", impronta).firstResultOptional();
    return anagraficaOptional.orElse(null);
  }

  @CacheInvalidate(cacheName = "findReferenti")
  @Transactional
  public Anagrafica saveContattoInput(AnagraficaInput input) {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);
    if(input == null) CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nell'elaborazione dell contatto").boom();

    boolean isRagioneSocialeEmpty = input.getRagioneSociale() == null || input.getRagioneSociale().isEmpty();
    boolean isEmailEmpty = input.getEmail() == null || input.getEmail().isEmpty();
    boolean isPecEmpty = input.getPec() == null || input.getPec().isEmpty();
    boolean isCittaEmpty = input.getCitta() == null || input.getCitta().isEmpty();
    boolean isIndirizzoEmpty = input.getIndirizzo() == null || input.getIndirizzo().isEmpty();

    if (isRagioneSocialeEmpty) {
      CustomException.get(CustomException.ErrorCode.INTERNAL, "Ragione sociale è un campo obbligatorio").boom();
    }

    if (isEmailEmpty && isPecEmpty && (isCittaEmpty || isIndirizzoEmpty)) {
      CustomException.get(CustomException.ErrorCode.INTERNAL, "Ragione sociale è un campo obbligatorio").boom();
    }

    // Validazione Email
    if (!isEmailEmpty) {
      if (!Utils.isValidEmail(input.getEmail())) {
        CustomException.get(CustomException.ErrorCode.INTERNAL, "Formato email non valido").boom();
      }
    }

    // Validazione PEC
    if (!isPecEmpty) {
      if (!Utils.isValidEmail(input.getPec())) {
        CustomException.get(CustomException.ErrorCode.INTERNAL, "Formato PEC non valido").boom();
      }
    }

    Anagrafica contattoAnagrafica = saveContatto(anagraficaMapper.toEntity(input));
    if(input.getGruppiIds() != null && !input.getGruppiIds().isEmpty())
      addAnagraficaToGroups(contattoAnagrafica, input.getGruppiIds());
    return contattoAnagrafica;
  }

  @Transactional
  public void addAnagraficaToGroups(Anagrafica contattoAnagrafica, List<Long> groupIds) {
    if (contattoAnagrafica == null) {
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Contatto anagrafica non può essere null.");
    }

    // Recupera i gruppi attualmente associati all'anagrafica
    List<Gruppo> gruppiAssociati = Gruppo.find("SELECT g FROM Gruppo g JOIN g.contatti a WHERE a.id = :anagraficaId",
            Parameters.with("anagraficaId", contattoAnagrafica.getId())).list();

    // Converte gli ID dei gruppi associati in un set per confronto rapido
    Set<Long> gruppiAssociatiIds = gruppiAssociati.stream()
            .map(Gruppo::getId)
            .collect(Collectors.toSet());

    // Se la lista `groupIds` è null o vuota, rimuove tutte le relazioni
    if (groupIds == null || groupIds.isEmpty()) {
      for (Gruppo gruppo : gruppiAssociati) {
        if (gruppo.getContatti() != null && gruppo.getContatti().contains(contattoAnagrafica)) {
          gruppo.getContatti().remove(contattoAnagrafica);
          gruppo.persistAndFlush();
        }
      }
      return; // Fine metodo, tutte le relazioni sono state rimosse
    }

    // Converte la lista di `groupIds` in un set per confronto rapido
    Set<Long> groupIdsInput = new HashSet<>(groupIds);

    // Rimuove le relazioni non confermate dall'input
    for (Gruppo gruppo : gruppiAssociati) {
      if (!groupIdsInput.contains(gruppo.getId())) {
        if (gruppo.getContatti() != null && gruppo.getContatti().contains(contattoAnagrafica)) {
          gruppo.getContatti().remove(contattoAnagrafica);
          gruppo.persistAndFlush();
        }
      }
    }

    // Aggiunge l'anagrafica ai nuovi gruppi specificati nell'input
    for (Long gruppoId : groupIds) {
      if (!gruppiAssociatiIds.contains(gruppoId)) {
        Gruppo gruppo = Gruppo.findById(gruppoId);
        if (gruppo != null) {
          if (gruppo.getContatti() == null) {
            gruppo.setContatti(new ArrayList<>());
          }
          gruppo.getContatti().add(contattoAnagrafica);
          gruppo.persistAndFlush();
        } else {
          log.error("Gruppo con ID: {} non trovato", gruppoId);
          throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Gruppo selezionato non trovato.");
        }
      }
    }
  }

  @Transactional
  public Anagrafica saveContatto(Anagrafica contattoAnagrafica){
    String impronta = generateImpronta(contattoAnagrafica);
    Anagrafica anagraficaTrovata = getContattoEsistenteConCampiUnivoci(impronta);
    if (anagraficaTrovata != null) {
      if (!anagraficaTrovata.isCancellato()) {
        CustomException.get(CustomException.ErrorCode.INTERNAL, "Esiste già un contatto con gli stessi campi univoci.").boom();
      }

      anagraficaTrovata.updateFieldsIfNeeded(contattoAnagrafica);
      anagraficaTrovata.setCancellato(false);

      // se il contatto non è certificato setta 'certificato' a false sul record precedentemente cancellato
      if(!contattoAnagrafica.isCertificato())
        anagraficaTrovata.setCertificato(false);
      anagraficaTrovata.persistAndFlush();
      return anagraficaTrovata;
    }

    contattoAnagrafica.setImpronta(impronta);

    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return save(contattoAnagrafica);
  }

  @CacheInvalidate(cacheName = "findReferenti")
  @Transactional
  public Anagrafica updateContattoInput(Long id, AnagraficaInput input) {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);
    if (id == null) throw new IllegalArgumentException("id è un parametro obbligatorio in " + LogUtils.getCallerInfo());
    if (input == null) throw new IllegalArgumentException("input è un parametro obbligatorio in " + LogUtils.getCallerInfo());

    boolean isRagioneSocialeEmpty = input.getRagioneSociale() == null || input.getRagioneSociale().isEmpty();
    boolean isEmailEmpty = input.getEmail() == null || input.getEmail().isEmpty();
    boolean isPecEmpty = input.getPec() == null || input.getPec().isEmpty();
    boolean isCittaEmpty = input.getCitta() == null || input.getCitta().isEmpty();
    boolean isIndirizzoEmpty = input.getIndirizzo() == null || input.getIndirizzo().isEmpty();

    if (isRagioneSocialeEmpty) {
      CustomException.get(CustomException.ErrorCode.INTERNAL, "Ragione sociale è un campo obbligatorio").boom();
    }

    if (isEmailEmpty && isPecEmpty && (isCittaEmpty || isIndirizzoEmpty)) {
      CustomException.get(CustomException.ErrorCode.INTERNAL, "Ragione sociale è un campo obbligatorio").boom();
    }

    // Validazione Email
    if (!isEmailEmpty) {
      if(!Utils.isValidEmail(input.getEmail())){
        CustomException.get(CustomException.ErrorCode.INTERNAL, "Formato email non valido").boom();
      }
    }

    // Validazione PEC
    if (!isPecEmpty) {
      if(!Utils.isValidEmail(input.getPec())){
        CustomException.get(CustomException.ErrorCode.INTERNAL, "Formato PEC non valido").boom();
      }
    }
    Anagrafica contattoAnagrafica = updateContatto(id, anagraficaMapper.toEntity(input));
    addAnagraficaToGroups(contattoAnagrafica, input.getGruppiIds());

    return contattoAnagrafica;
  }

  @Transactional
  public Anagrafica updateContatto(Long id, Anagrafica contattoAnagrafica) {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);
    log.info("Aggiornamento contatto anagrafica con id: {}",id);

    String impronta = generateImpronta(contattoAnagrafica);
    Anagrafica anagraficaTrovata = getContattoEsistenteConCampiUnivoci(impronta);
    Anagrafica contattoToUpdate = null;

    //se esiste un'anagrafica con gli stessi campi univoci
    if (anagraficaTrovata != null) {
      log.info("Trovato utente anagrafica esistente con id: {}", id);

      // se trovo un'anltra anagrafica con la stessa impronta controllo inizialmente se è cancellata:
      // caso 1: Cancellata -> ripristino il contatto cancellato e cancello il contatto in fase di modifica
      // caso 2: Non cancellata -> Errore in quanto Esiste già un'anagrafica con gli stessi campi univoci

      // se id diverso da quello specificato-> si lancia eccezione
      if (!Objects.equals(anagraficaTrovata.getId(), id)) {
        if(anagraficaTrovata.isCancellato())
        {
          em.createNamedQuery("updateCancellatoById")
                  .setParameter("cancellato", false)
                  .setParameter("id", anagraficaTrovata.id)
                  .executeUpdate();
          em.createNamedQuery("updateCancellatoById")
                  .setParameter("cancellato", true)
                  .setParameter("id", id)
                  .executeUpdate();

          return anagraficaTrovata;
        }
        else
          CustomException.get(CustomException.ErrorCode.INTERNAL, "Esiste già un'anagrafica con gli stessi campi univoci.").boom();
      }
      else {
        // se id uguale allora il contatto da aggiornare lo abbiamo già
        contattoToUpdate = anagraficaTrovata;

        // Verifico se il contatto è diventato certificato a seguito della modifica dalla sezione anagrafica (solo per gli Admin)
        if(contattoAnagrafica.isCertificato())
          contattoToUpdate.setCertificato(true);
      }
    }
    else {
      //se non è stata trovata alcuna anagrafica con gli stessi campi univoci -> si prende dal db
      contattoToUpdate = Anagrafica.findById(id);

      // Verifico se il contatto è diventato certificato a seguito della modifica dalla sezione anagrafica (solo per gli Admin)
      if(contattoAnagrafica.isCertificato())
        contattoToUpdate.setCertificato(true);
    }

    contattoToUpdate.updateFieldsIfNeeded(contattoAnagrafica);
    contattoToUpdate.setImpronta(impronta);
    if (contattoToUpdate.isDirty()) {
      contattoToUpdate.persistAndFlush();
    }

    log.info("Aggiornamento utente anagrafica esistente con id: {} avvenuto con successo", id);
    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return contattoToUpdate;
  }

  public Anagrafica importContattoInput(AnagraficaInput input) {
    if (input == null) throw new IllegalArgumentException("input è un parametro obbligatorio in " + LogUtils.getCallerInfo());
    Anagrafica contattoAnagrafica = anagraficaMapper.toEntity(input);
    return importContatto(contattoAnagrafica);
  }

  @Transactional
  public Anagrafica importContatto(Anagrafica contattoAnagrafica) {

    String impronta = generateImpronta(contattoAnagrafica);
    Anagrafica anagraficaTrovata = getContattoEsistenteConCampiUnivoci(impronta);
    if (anagraficaTrovata != null) {
      anagraficaTrovata.updateFieldsIfNeeded(contattoAnagrafica);
      // ...si aggiorna l'anagrafica già presente, settando il flag "cancellato" a false e certificato a true
      anagraficaTrovata.setCancellato(false);
      anagraficaTrovata.setCertificato(true);
      if (anagraficaTrovata.isDirty()) {
        anagraficaTrovata.persistAndFlush();
      }
      return anagraficaTrovata;
    }

    contattoAnagrafica.setImpronta(impronta);
    return save(contattoAnagrafica);
  }

  @CacheInvalidate(cacheName = "findReferenti")
  @Transactional
  public boolean deleteContatto(Long id){
    LogUtils.entering(LogUtils.LogLevel.DEBUG);
    if(id == null) CustomException.get(CustomException.ErrorCode.INTERNAL, "Parametro id obbligatori non trovato").boom();

    Anagrafica contattoAnagrafica = Anagrafica.findById(id);
    if (contattoAnagrafica == null) {
      LogUtils.exiting(LogUtils.LogLevel.DEBUG);
      CustomException.get(CustomException.ErrorCode.NOT_FOUND, "Contatto da cancellare non trovato").boom();
    }

    // se contatto già cancellato non si fa nulla e si ritorna true
    if (contattoAnagrafica.isCancellato()) {
      return true;
    }

    contattoAnagrafica.setCancellato(true);

    //verifico se il contatto è presente in qualche gruppo
    List<Gruppo> gruppiAssociati = Gruppo.find("SELECT g FROM Gruppo g JOIN g.contatti a WHERE a.id = :anagraficaId",
            Parameters.with("anagraficaId", contattoAnagrafica.getId())).list();

    for (Gruppo gruppo : gruppiAssociati) {
      if (gruppo.getContatti() != null && gruppo.getContatti().contains(contattoAnagrafica)) {
        // se presente in un gruppo viene eliminato
        gruppo.getContatti().remove(contattoAnagrafica);
        gruppo.persistAndFlush();
      }
    }

    try {
      contattoAnagrafica.persistAndFlush();
    } catch (Exception e) {
      LogUtils.exiting(LogUtils.LogLevel.DEBUG);
      CustomException.get(CustomException.ErrorCode.INTERNAL,"Errore nella cancellazione del contatto").boom();
      return false;
    }

    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return true;
  }

  public AnagraficaDTO getDettaglioContatto(Long id) {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);
    if(id == null) CustomException.get(CustomException.ErrorCode.INTERNAL, "Parametro id obbligatori non trovato").boom();

    Anagrafica contattoAnagrafica = Anagrafica.findById(id);
    if (contattoAnagrafica == null) {
      LogUtils.exiting(LogUtils.LogLevel.DEBUG);
      CustomException.get(CustomException.ErrorCode.NOT_FOUND, "Contatto non trovato").boom();
    }
    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return convertToAnagraficaDTO(contattoAnagrafica);
  }

  @Transactional(Transactional.TxType.REQUIRES_NEW)
  public void processBatch(List<Anagrafica> batch) {
    batch.forEach(contatto -> {
      try {
        importContatto(contatto);
      } catch (Exception e) {
        CustomException.get(CustomException.ErrorCode.INTERNAL, CustomException.extractPsError(e.getMessage())).boom();
      }
    });
  }

  @CacheInvalidate(cacheName = "findReferenti")
  public ImportResult importContattiAnagraficaFromExcel(String fileBase64) {
    byte[] decodedBytes = Base64.decodeBase64(fileBase64);
    InputStream inputStream = new ByteArrayInputStream(decodedBytes);
    ImportResult result = documentService.validazioneExcelAnagrafica(inputStream);
    if (!result.getIdoneo()) {
      List<ErrorRecord> errors = result.getLista();
      String errorMessage = String.format("Errore a riga %s: %s", errors.get(0).getRowNumber(), errors.get(0).getErrorMessage());
      CustomException.get(CustomException.ErrorCode.INTERNAL, errorMessage).boom();
    } else {
      log.info("Importazione contatti anagrafica da file excel");

      List<Anagrafica> contatti = result.getLista();
      int batchSize = 50;

      ExecutorService executor = Executors.newFixedThreadPool(10);

      List<CompletableFuture<Void>> futures = IntStream.range(0, (contatti.size() + batchSize - 1) / batchSize)
              .mapToObj(i -> contatti.subList(i * batchSize, Math.min(contatti.size(), (i + 1) * batchSize)))
              .map(batch -> CompletableFuture.runAsync(() -> processBatch(batch), executor))
              .collect(Collectors.toList());

      CompletableFuture<Void> allOf = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
      allOf.join();

      executor.shutdown();
      try {
        if (!executor.awaitTermination(1, TimeUnit.HOURS)) {
          executor.shutdownNow();
        }
      } catch (InterruptedException e) {
        executor.shutdownNow();
        Thread.currentThread().interrupt();
      }
    }
    return result;
  }

  @Transactional
  public Anagrafica mapInfoEnteToAnagrafica(String codAmm) {
    DataResponseIpaInfo response = ipaClient.infoEnteIpa(codAmm).getData();
    Anagrafica anagrafica = Anagrafica.find("idIpaInad", codAmm).firstResult();

    if (anagrafica == null) {
      anagrafica = Anagrafica.builder()
              .tsCreation(Calendar.getInstance().getTime())
              .tsStartVali(Calendar.getInstance().getTime())
              .certificato(false)
              .idIpaInad(codAmm)
              .build();
    }

    anagrafica.updateFieldsIfNeeded(Anagrafica.builder()
            .ragioneSociale(response.getDesAmm())
            .cfPiva(response.getCfPiva())
            .indirizzo(response.getIndirizzo())
            .citta(response.getComune())
            .cap(response.getCap())
            .provincia(response.getProvincia())
            .pec(response.getMail1())
            .build());

    if(anagrafica.isCancellato())
      anagrafica.setCancellato(false);
    anagrafica.setImpronta(generateImpronta(anagrafica));
    anagrafica.persistAndFlush();

    return anagrafica;
  }


  @Transactional
  public Anagrafica mapInfoUOToAnagrafica(String codUniOu) {
    DataResponseIpaUOInfo response = ipaClient.infoUnitaOrganizzative(codUniOu).getData();
    Anagrafica anagrafica = Anagrafica.find("idIpaInad", codUniOu).firstResult();

    if (anagrafica == null) {
      anagrafica = Anagrafica.builder()
              .tsCreation(Calendar.getInstance().getTime())
              .tsStartVali(Calendar.getInstance().getTime())
              .certificato(false)
              .idIpaInad(codUniOu)
              .build();
    }

    anagrafica.updateFieldsIfNeeded(Anagrafica.builder()
            .ragioneSociale(response.getDesOu())
            .cfPiva(response.getCf())
            .indirizzo(response.getIndirizzo())
            .citta(response.getComune())
            .cap(response.getCap())
            .provincia(response.getProvincia())
            .pec(response.getMail1())
            .telefono(response.getTel())
            .fax(response.getFax())
            .build());

    if(anagrafica.isCancellato())
      anagrafica.setCancellato(false);
    anagrafica.setImpronta(generateImpronta(anagrafica));
    anagrafica.persistAndFlush();

    return anagrafica;
  }


  @Transactional
  public Anagrafica mapAooToAnagrafica(String codAmm, String codAoo) {
    String cfPiva = ipaClient.infoEnteIpa(codAmm).getData().getCfPiva();
    DataResponseIpaAOO response = ipaClient.ricercaAreaOrganizzativaOmogenea(codAmm, codAoo).getData().get(0);
    Anagrafica anagrafica = Anagrafica.find("idIpaInad", codAoo).firstResult();

    if (anagrafica == null) {
      anagrafica = Anagrafica.builder()
              .tsCreation(Calendar.getInstance().getTime())
              .tsStartVali(Calendar.getInstance().getTime())
              .certificato(false)
              .idIpaInad(codAoo)
              .build();
    }

    anagrafica.updateFieldsIfNeeded(Anagrafica.builder()
            .ragioneSociale(response.getDesAoo())
            .cfPiva(cfPiva)
            .indirizzo(response.getIndirizzo())
            .citta(response.getComune())
            .cap(response.getCap())
            .provincia(response.getProvincia())
            .pec(response.getMail1())
            .telefono(response.getTel())
            .fax(response.getFax())
            .build());

    if(anagrafica.isCancellato())
      anagrafica.setCancellato(false);
    anagrafica.setImpronta(generateImpronta(anagrafica));
    anagrafica.persistAndFlush();

    return anagrafica;
  }

  @CacheInvalidate(cacheName = "findReferenti")
  @Transactional
  public Gruppo saveGruppoContatti(GruppoAnagraficaDTO input) {
    try {
      if (input.getNome() == null || input.getNome().isEmpty()) {
        throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Nome del Gruppo contatti obbligatorio");
      }
      if(Gruppo.find("nome", input.getNome()).firstResult() != null) {
        throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Già presente il gruppo: " + input.getNome());
      }
      Gruppo gruppo = Gruppo.builder()
              .nome(input.getNome())
              .note(input.getNote() != null ? input.getNote() : "")
              .idUtenteLastOperation(ssoManager.extractIdFromToken())
              .tsCreation(Calendar.getInstance().getTime())
              .build();

      if (input.getAnagraficaIds() != null && !input.getAnagraficaIds().isEmpty()) {
        List<Anagrafica> contatti = new ArrayList<>();
        input.getAnagraficaIds().forEach(a -> {
          Anagrafica anagrafica = Anagrafica.findById(a);
          if (anagrafica != null) {
            contatti.add(anagrafica);
          }else {
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Non è presente nessuna contatto per l'id: " + a);
          }
        });
        gruppo.setContatti(contatti);
      }
      gruppo.persistAndFlush();
      return gruppo;
    } catch (CustomException e) {
      // Log dell'errore personalizzato
      log.error("Errore durante il salvataggio del gruppo: " + e.getMessage());
      throw e;
    } catch (Exception e) {
      // Gestione generale degli errori
      log.error("Errore imprevisto durante il salvataggio del gruppo", e);
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore imprevisto durante il salvataggio del gruppo");
    }
  }

  @CacheInvalidate(cacheName = "findReferenti")
  @Transactional
  public Gruppo updateGruppoContatti(Long groupId, GruppoAnagraficaDTO input) {
    try {
      if (input.getNome() == null || input.getNome().isEmpty()) {
        throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Nome del Gruppo contatti obbligatorio");
      }
      Gruppo checkExist = Gruppo.find("nome", input.getNome()).firstResult();
      if(checkExist != null && !checkExist.getId().equals(groupId)) {
        throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Gia presente il gruppo: " + input.getNome());
      }

      Gruppo gruppo = Gruppo.findById(groupId);
      gruppo.setNome(input.getNome());
      gruppo.setNote(input.getNote());
      gruppo.setIdUtenteLastOperation(ssoManager.extractIdFromToken());
      gruppo.setTsUpdate(Calendar.getInstance().getTime());

      gruppo.persistAndFlush();
      return gruppo;

    } catch (CustomException e) {
      log.error("Errore durante la modifica del gruppo: {}", e.getMessage());
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, e.getMessage());
    } catch (Exception e) {
      log.error("Errore imprevisto durante la modifica del gruppo", e);
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore imprevisto durante la modifica del gruppo");
    }
  }

  @CacheInvalidate(cacheName = "findReferenti")
  @Transactional
  public boolean deleteGruppo(Long gruppoId) {
    if (gruppoId == null) {
      log.error("deleteGruppo con input NULL");
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Nessun Gruppo selezionato");
    }
    Gruppo gruppo = Gruppo.findById(gruppoId);
    if (gruppo == null) {
      log.error("Gruppo con ID: {} non trovato", gruppoId);
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Gruppo non presente");
    }
    if (gruppo.getContatti() != null && !gruppo.getContatti().isEmpty()) {
      gruppo.getContatti().clear();
    }

    gruppo.delete();
    log.info("Gruppo con ID: {} e tutte le sue associazioni sono state eliminate.", gruppoId);
    return true;
  }

  @Transactional
  public GruppoOutputDTO getDettaglioGruppo(Long gruppoId) {
    if(gruppoId == null) {
      log.error("Parametro di input obbligatiorio, gruppoId is null");
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Parametro di input obbligatiorio");
    }
    Gruppo gruppo = Gruppo.findById(gruppoId);
    log.info("Richiesta dettaglio per il gruppo: {} - da parte dell'utente: {}",
            gruppo.getNome(),
            ssoManager.extractNameFromToken());

    GruppoOutputDTO outputDTO = gruppoMapper.toDto(gruppo);
    return outputDTO;
  }

  @CacheInvalidate(cacheName = "findReferenti")
  @Transactional
  public boolean addContactsToGroup(Long groupId, List<Long> contactIds) {
    if(groupId == null || contactIds == null || contactIds.isEmpty()) {
      log.error("Errore dati in input: groupId {}, contactIds {}", groupId, contactIds);
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nella selezione di contatti");
    }

    Gruppo gruppo = em.find(Gruppo.class, groupId);

    if (gruppo == null) {
      log.error("Il gruppo con ID {} non esiste.", groupId);
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Il gruppo con ID " + groupId + " non esiste.");
    }

    List<Anagrafica> contatti = em.createQuery("SELECT a FROM Anagrafica a WHERE a.id IN :ids", Anagrafica.class)
                      .setParameter("ids", contactIds)
                      .getResultList();

    contatti.forEach(c -> {
      if(!c.isCertificato()){
        log.error("Il contatto {} non risulta certificato.", c.getNome());
        throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Il contatto " + c.getNome() + " non risulta certificato.");      }
    });

    if (contatti.isEmpty()) {
      log.error("Nessun contatto trovato con gli ID forniti: {}", contactIds);
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore generico nella selezione dei contatti selezionati");
    }

    if(gruppo.getContatti() == null)
      gruppo.setContatti(new ArrayList<>());

    for (Anagrafica contatto : contatti) {
      if (!gruppo.getContatti().contains(contatto)) {
        gruppo.getContatti().add(contatto);
      }
    }

    em.merge(gruppo);

    return true;
  }

  @CacheInvalidate(cacheName = "findReferenti")
  @Transactional
  public boolean removeContactFromGroup(Long groupId, Long contactId) {
    if(groupId == null || contactId == null) {
      log.error("Errore dati in input: groupId {}, contactId {}", groupId, contactId);
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nella selezione di contatti");
    }

    Gruppo gruppo = em.find(Gruppo.class, groupId);

    if (gruppo == null) {
      log.error("Il gruppo con ID {} non esiste.", groupId);
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Il gruppo con ID " + groupId + " non esiste.");
    }

    if(gruppo.getContatti() == null)
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Nessun contatto presente per il gruppo " + gruppo.getNome());

    Anagrafica contatto = em.find(Anagrafica.class, contactId);

    if (contatto == null) {
      log.error("Il contatto con ID {} non esiste.", contactId);
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nella selezione del contatto da rimuovere");
    }

    boolean removed = gruppo.getContatti().remove(contatto);

    if (!removed) {
      log.error("Il contatto con ID {} non è presente nel gruppo {}.", contactId, gruppo.getNome());
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nella rimozione del contatto dal gruppo " + gruppo.getNome());    }

    em.merge(gruppo);

    return true;
  }


  /*@Transactional
  public ReferentiOutputDTO getAllReferentiByGruppiIds(List<Long> ids, String msInput) {
    ReferentiOutputDTO outputDTO = new ReferentiOutputDTO();
    outputDTO.setPageCount(0);
    List<ReferenteOutputDTO> referenti = new ArrayList<>();

    try {
      if (ids == null || ids.isEmpty()) {
        throw new IllegalArgumentException("La lista degli ID non può essere vuota o nulla.");
      }

      List<Gruppo> gruppi = em.createNamedQuery("findGruppoByIds", Gruppo.class)
              .setParameter("ids", ids)
              .getResultList();

      for (Gruppo gruppo : gruppi) {
        if (gruppo.getContatti() == null) {
          continue;
        }

        referenti = mapAnagraficaToReferenteOutputDTO(msInput, gruppo);
      }

      outputDTO.setReferenti(referenti);
      return outputDTO;

    } catch (IllegalArgumentException e) {
      log.error("Errore di input: {}", e.getMessage(), e);
      throw e;

    } catch (NoResultException e) {
      log.warn("Nessun risultato trovato per gli ID forniti: {}", ids, e);
      return outputDTO;

    } catch (PersistenceException e) {
      log.error("Errore di persistenza durante l'esecuzione della query: {}", e.getMessage(), e);
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore durante il recupero dei dati dai gruppi.", e);

    } catch (Exception e) {
      log.error("Errore generico durante l'elaborazione della richiesta: {}", e.getMessage(), e);
      throw CustomException.get(CustomException.ErrorCode.INTERNAL, e.getMessage(), e);
    }
  }*/

  public List<ReferenteOutputDTO> mapAnagraficaToReferenteOutputDTO(String msInput, Gruppo gruppo) {
    List<ReferenteOutputDTO> referenti = new ArrayList<>();

    for (Anagrafica contattoInterno : gruppo.getContatti()) {
      ReferenteOutputDTO referenteDto = new ReferenteOutputDTO();
      referenteDto.setTipo(TipoDestinatarioReferente.ANAGRAFICA_INTERNA.getNome());
      referenteDto.setId(contattoInterno.getId().toString());
      referenteDto.setIdDestinatario(contattoInterno.getId().toString());
      referenteDto.setChildren(null);
      referenteDto.setRagioneSociale(contattoInterno.getRagioneSociale());
      referenteDto.setCognome(contattoInterno.getCognome());
      referenteDto.setNome(contattoInterno.getNome());
      referenteDto.setCfPiva(contattoInterno.getCfPiva());
      referenteDto.setPec(contattoInterno.getPec());
      referenteDto.setEmail(contattoInterno.getEmail());

      // Costruzione del campo `label`
      StringBuilder lblToOutput = new StringBuilder(contattoInterno.getRagioneSociale());
      if (contattoInterno.getCfPiva() != null && !contattoInterno.getCfPiva().isEmpty()) {
        lblToOutput.append(" ").append(contattoInterno.getCfPiva());
      }

      if (msInput.equalsIgnoreCase(String.valueOf(MetodoSpedizione.Pec))) {
        String contatto = contattoInterno.getPecToUseForRecipient();

        if (contatto == null || contatto.isEmpty()) {
          continue;
        }
        lblToOutput.append(" (").append(contatto).append(")");
      }

      if(msInput.equalsIgnoreCase(String.valueOf(MetodoSpedizione.Email))){
        if (contattoInterno.getEmail() == null || contattoInterno.getEmail().isEmpty()) {
          continue;
        }
        lblToOutput.append(" (").append(contattoInterno.getEmail()).append(")");
      }

      if (contattoInterno.getIndirizzo() != null && !contattoInterno.getIndirizzo().isEmpty()) {
        lblToOutput.append(" - ").append(contattoInterno.getIndirizzo());
      }

      if (contattoInterno.getCitta() != null && !contattoInterno.getCitta().isEmpty()) {
        lblToOutput.append(", ").append(contattoInterno.getCitta());
      }

      if (contattoInterno.getCap() != null && !contattoInterno.getCap().isEmpty()) {
        lblToOutput.append(" ").append(contattoInterno.getCap());
      }

      referenteDto.setLabel(lblToOutput.toString());
      referenti.add(referenteDto);
    }

    return referenti;
  }


  /**
   * Servizio che restituisce tutta la lista dei gruppi paginata
   * accetta sort e ricerca globale
   * @param dto - conterrà tutti i parametri in input che vengono dai filtri
   * @return
   */
  @ExceptionChecked
  public GruppiOutputDTO getAllGruppi(RicercaGruppiDTO dto) {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);

    if (dto == null) throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());

    PanacheQuery<Gruppo> query = getGruppiQuery(dto);
    List<Gruppo> gruppiList = query.page(Page.of(dto.getPage(), dto.getSize())).list();

    long totalResults = query.count();
    GruppiOutputDTO outputDTO = new GruppiOutputDTO(gruppiList, getPagesCount(totalResults, dto.getSize()), totalResults);

    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return outputDTO;
  }

  public PanacheQuery<Gruppo> getGruppiQuery(RicercaGruppiDTO dto) {
    Sort sortCriteria = SortInput.getSortOrDefault(dto.hasSort() ? dto.getSort() : dto.getDefaultSort());

    Map<String, Object> params = new HashMap<>();
    StringBuilder query = new StringBuilder("id is not null ");


    if(dto.hasSearch()){
      String search = dto.getSearch().trim().toLowerCase().replace(" ", "");

      query.append("and (:search = '' ")
              .append("or lower(REPLACE(nome, ' ', '')) like LOWER(concat('%', :search, '%')) ")
              .append(")");
      params.put("search", search);
    }

    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return Gruppo.find(query.toString(), sortCriteria, params);
  }

  @Transactional
  public ReferentiOutputDTO getAllGruppiMappedToReferentiOutputDTO(String metodoSpedizione, RicercaGruppiDTO ricercaDTO){

    GruppiOutputDTO gruppi = getAllGruppi(ricercaDTO);
    List<ReferenteOutputDTO> referentiFromGroup = new ArrayList<>();
    
    for(Gruppo gruppo : gruppi.getGruppiList()){
      ReferenteOutputDTO referenteToMap = referenteMapper.gruppoToReferentOutputDTO(gruppo);
      referenteToMap.setChildren(mapAnagraficaToReferenteOutputDTO(metodoSpedizione, gruppo));
      referentiFromGroup.add(referenteToMap);
    }

    ReferentiOutputDTO mappedOutput = new ReferentiOutputDTO();

    mappedOutput.setReferenti(referentiFromGroup);
    mappedOutput.setPageCount(gruppi.getPageCount());

    return mappedOutput;
  }

  @Override
  public PanacheQuery<Anagrafica> getFindAllQuery(String search, SortInput sort) {
    return null;
  }

  @Override
  public PanacheQuery<Anagrafica> getFindByIdQuery(Long id) {
    return null;
  }

  @CacheInvalidate(cacheName = "findReferenti")
  @Transactional
  public void deleteAnagraficaWithoutCertificazione (){

    // cancellazione logica dei contatti non certificati
    em.createNamedQuery("deleteAllContattiNonCertificati")
            .executeUpdate();
    /*
   List<Anagrafica> anagrafiche = Anagrafica.list("certificato is false");
    for (Anagrafica anagrafica : anagrafiche) {
      anagrafica.delete();
    }

     */
  }
}
