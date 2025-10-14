package it.parsec326.pi.intranet.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.client.SendNotificaClient;
import it.parsec326.pi.intranet.dto.DettaglioProtocolloDTO;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSSO;
import it.parsec326.pi.intranet.dto.input.StatoProtocolloInput;
import it.parsec326.pi.intranet.dto.output.ReferentiProtocolloDTO;
import it.parsec326.pi.intranet.dto.output.ReferentiProtocolloOutputDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaReferentiProtocolloDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.exception.ExceptionChecked;
import it.parsec326.pi.intranet.model.*;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.utils.LogUtils;
import it.parsec326.pi.intranet.utils.SortInput;
import it.parsec326.pi.intranet.utils.Utils;
import it.parsec326.pi.intranet.utils.common.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.util.*;

@Slf4j
@ApplicationScoped
public class ReferentiProtocolloService  implements PanacheCustomEntityServiceInterface<Protocollo> {

  @Inject
  EntityManager em;

  @Inject
  @Getter
  UserTransaction transaction;

  @Inject
  SSOClient ssoManager;

  @Inject
  StoricoService storicoService;

  @Inject
  ProtocolloService protocolloService;

  @Inject
  NotificaService notificaService;

  @Inject
  ConfigurazioneService configurazioneService;

  @Inject
  EmailTemplateService emailTemplateService;

  @Inject
  SendNotificaClient sendNotificaClient;

  @Inject
  PecOperationService pecOperationService;

  private PanacheQuery<ReferentiProtocollo> getQueryForAssegnatariIdProtocollo(Long idProtocollo, boolean addIsAssegnato) {
    StringBuilder query = new StringBuilder();
    Map<String, Object> params = new HashMap<>();

    query.append("idProtocollo = :idProtocollo and lower(attribuzione) = 'competenza' and lower(tipoDestinatario) IN ('ufficio', 'utente')");
    if (addIsAssegnato) query.append(" and isAssegnato");
    params.put("idProtocollo", idProtocollo);

    Sort sortCriteria = Sort.ascending("tsCreation");

    return ReferentiProtocollo.find(query.toString(), sortCriteria, params);
  }

  public List<ReferentiProtocollo> getAllAssegnatariForProtocollo(Long idProtocollo) {
    return getQueryForAssegnatariIdProtocollo(idProtocollo, true).list();
  }

  @Transactional
  public void updateIsAssegnatoFalse(Long idToRemove){
    em.createNamedQuery("updateIsAssegnatoFalse").setParameter("id", idToRemove).executeUpdate();
  }

  @Transactional
  public boolean updateStatoProtocollo(Protocollo protocollo, StatoProtocollo statoProtocollo, Operazione operazione, String selectedOffice, String note) {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);
    boolean success = false;

    DatiUtenteSSO datiUtenteSSO = ssoManager.getDatiUtente();

    if (datiUtenteSSO == null) {
      throw CustomException.get(CustomException.ErrorCode.UNAUTHORIZED, "Utente non autorizzato");
    }

    String idDestinatario = ssoManager.extractIdFromToken();
    String nomeDestinatario = ssoManager.extractNameFromToken();
    String cdrName = em.createNamedQuery("findOfficeByCdrCode", Ufficio.class)
                    .setParameter("cdrCode", selectedOffice)
                    .getSingleResult()
                    .getCdr();

    // true se utente è protocollatore / archivista per l'ufficio selezionato
    boolean canWorkProtocolAsProtocollatoreArchivista = ssoManager.extractOfficesByRoles(datiUtenteSSO).contains(selectedOffice);
    boolean canPrendereInCaricoFromPec = protocollo.getMetodoSpedizione().equals(MetodoSpedizione.Pec) && protocollo.getTipoRegistrazione().equals(TipoRegistrazione.Entrata) && canWorkProtocolAsProtocollatoreArchivista;

    if (ssoManager.isUtenteAdmin() && !canWorkProtocolAsProtocollatoreArchivista) {
      throw CustomException.get(CustomException.ErrorCode.UNAUTHORIZED, "Abilitare l'Admin con ruoli di Protocollatore/Archivista");
    }

    ReferentiProtocollo referentiProtocolloToRemove = null;
    String idMittenteReferenteProtocollo = null;
    String nomeMittenteReferenteProtocollo = null;
    String idMittenteReferenteProtocolloPerUfficio = null;
    String nomeMittenteReferenteProtocolloPerUfficio = null;
    StringBuilder assegnatariSb = new StringBuilder();

    PanacheQuery<ReferentiProtocollo> queryAssegnatari = getQueryForAssegnatariIdProtocollo(protocollo.getId(), false);
    List<ReferentiProtocollo> listAssegnatari = queryAssegnatari.list();

    // true se utente deve essere inserito in referenti protocollo
    boolean mustInsertUser = false;

    // true se utente è già assegnatario diretto del protocollo
    boolean userIsAssegnatario = false;
    for (ReferentiProtocollo rp : listAssegnatari) {
      if (rp.getIdDestinatario().equalsIgnoreCase(idDestinatario) && rp.getTipoDestinatario().equalsIgnoreCase(TipoDestinatarioReferente.UTENTE.getNome())) {
        idMittenteReferenteProtocollo = rp.getIdMittente();
        nomeMittenteReferenteProtocollo = rp.getNomeMittente();

        rp.setStatoProtocollo(statoProtocollo);
        rp.setTsStatoProtocollo(Date.from(Instant.now()));
        rp.setUfficioLavorazione(cdrName);
        rp.persist();
        userIsAssegnatario = true;
      }
      else {
        if (canWorkProtocolAsProtocollatoreArchivista && rp.getIdDestinatario().equalsIgnoreCase(selectedOffice) && rp.getTipoDestinatario().equalsIgnoreCase(TipoDestinatarioReferente.UFFICIO.getNome())) {
          idMittenteReferenteProtocolloPerUfficio = rp.getIdMittente();
          nomeMittenteReferenteProtocolloPerUfficio = rp.getNomeMittente();
          mustInsertUser = true;
          referentiProtocolloToRemove = rp;
        }
      }
      if (!rp.getStatoProtocollo().equals(StatoProtocollo.Rifiutato))
        assegnatariSb.append(rp.getNomeDestinatario()).append(", ");
    }

    if(referentiProtocolloToRemove != null) {
      Long finalOfficeIdToRemove = referentiProtocolloToRemove.getId();
      listAssegnatari.removeIf(a -> a.getId().equals(finalOfficeIdToRemove));
      //if(referentiProtocolloToRemove.isCreationOption()){
        referentiProtocolloToRemove.setAssegnato(false);
        referentiProtocolloToRemove.persistAndFlush();
      //}else {
      //  ReferentiProtocollo.deleteById(referentiProtocolloToRemove.getId());
      //}
    }

    if (canPrendereInCaricoFromPec && !mustInsertUser && !userIsAssegnatario) {
      mustInsertUser = true;
    }

    if (mustInsertUser && !userIsAssegnatario) {
      idMittenteReferenteProtocollo = idMittenteReferenteProtocolloPerUfficio;
      nomeMittenteReferenteProtocollo = nomeMittenteReferenteProtocolloPerUfficio;

      ReferentiProtocollo rpNew = ReferentiProtocollo.builder()
              .idProtocollo(protocollo.getId())
              .idDestinatario(idDestinatario)
              .statoProtocollo(statoProtocollo)
              .tsStatoProtocollo(Date.from(Instant.now()))
              .attribuzione(TipoAttribuzione.COMPETENZA.getNome())
              .tsCreation(Date.from(Instant.now()))
              .tsStartVali(Date.from(Instant.now()))
              .nomeDestinatario(nomeDestinatario)
              .idMittente(idMittenteReferenteProtocolloPerUfficio)
              .nomeMittente(nomeMittenteReferenteProtocolloPerUfficio)
              .isAssegnato(true)
              .tipoDestinatario("utente")
              .creationOption(false)
              .ufficioLavorazione(cdrName)
              .build();
      rpNew.persist();
      listAssegnatari.add(rpNew);

      if (!rpNew.getStatoProtocollo().equals(StatoProtocollo.Rifiutato)) {
        assegnatariSb.append(nomeDestinatario).append(", ");
      }
    }

    protocollo.setAssegnatari(assegnatariSb.length() > 2 ? assegnatariSb.substring(0, assegnatariSb.length() - 2) : "");
    boolean isTag = listAssegnatari.stream().anyMatch(r -> r.getTipoDestinatario() != null && r.getTipoDestinatario().equalsIgnoreCase("tag"));
    protocollo.setStato(protocollo.computeStatoProtocollo(listAssegnatari, isTag));
    protocollo.persistAndFlush();

    storicoService.insertNewStoricoForNumeroProtocollo(protocollo, idDestinatario, nomeDestinatario, String.format("%s dall'Ufficio: %s",statoProtocollo.getOperation(TipoRegistrazione.Circolare.equals(protocollo.getTipoRegistrazione())), cdrName), note == null || note.isEmpty() ? "" : note);

    //NOTA: se l'operazione è di presa in carico non si invia la notifica!
    if (operazione.equals(Operazione.presaInCarico)) {
      if (protocollo.getMetodoSpedizione().equals(MetodoSpedizione.Pec))
        pecOperationService.insertPecOperation(protocollo, selectedOffice, idDestinatario, nomeDestinatario, operazione);
      LogUtils.exiting(LogUtils.LogLevel.DEBUG);
      return true;
    }

    // Lista che conterrà tutti gli id delle notifiche da inviare
    List<Long> notificheToSendList = new ArrayList<>();

    //NOTA: notifica da parte dell'utente loggato all'utente creatore del protocollo
    PecPeo peoInvioNotifica = notificaService.getConfigurazioneForInvioNotifiche();

    if (peoInvioNotifica != null) {
      log.info("[updateStatoProtocollo] - Estrazione peoInvioNotifica: {}, per l'elaborazione delle notifiche.", peoInvioNotifica.getIndirizzoEmail());

      List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
      String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);
      String basePublicClientUrl = configurazioneService.getBasePublicUrl(configurazioniGlobali);
      DatiUtenteSSO recipientUser = null;

      //NOTA: destinatario della notifica di presa in carico è l'utente che ha effettuato l'assegnazione!
      try {
        recipientUser = ssoManager.getUserByAuthId(idMittenteReferenteProtocollo, Integer.parseInt(applicationId));
      }
      catch (Exception ignored) {
        log.error("[updateStatoProtocollo] - Errore imprevisto durante estrazione del metodo 'getUserByAuthId' per l'utente: {}, per il protocollo con id: {}",idMittenteReferenteProtocollo, protocollo.getId());
      }

      EmailTemplate template = emailTemplateService.getTemplate(operazione, "notifica");
      if (recipientUser != null && template != null) {
        String oggettoEmailNotifica = template.getOggetto().replace("{{numero}}", protocollo.getNProtocollo());
        String sbCorpoEmailNotifica = template.getCorpo()
                .replace("{{headerCorpo}}", oggettoEmailNotifica)
                .replace("{{cognomeUtenteTO}}", recipientUser.lastName)
                .replace("{{nomeUtenteTO}}", recipientUser.firstName)
                .replace("{{nomeUtenteOperation}}", ssoManager.extractNameFromToken())
                .replace("{{data}}", Utils.fromDateToString(Date.from(Instant.now()), Utils.DateFormat.DMY_HM))
                .replace("{{numero}}", protocollo.getNProtocollo())
                .replace("{{motivo}}", note != null ? note : "-")
                .replace("{{link}}", basePublicClientUrl.concat("/protocolli/" + protocollo.getNProtocollo()));

        Long idNotifica = notificaService.newNotifica(
                protocollo.getId(),
                peoInvioNotifica.getIndirizzoEmail(),
                recipientUser.email,
                oggettoEmailNotifica,
                sbCorpoEmailNotifica,
                operazione.name());

        if (idNotifica != null) {
          notificheToSendList.add(idNotifica);
        }
      } else {
        StringBuilder errorSb = new StringBuilder("[Attenzione] - Problematica durante la preparazione delle notifiche peo ")
                .append("in fase di: [%s] - ")
                .append("del protocollo: [%s] - ")
                .append("Template: %s - " )
                .append("peoInvioNotifica: %s - ");

        String fullMessage = String.format(
                errorSb.toString(),
                operazione,
                protocollo.getId(),
                template == null ? "null" : template.getId(),
                peoInvioNotifica.getIndirizzoEmail());

        log.error(fullMessage);
      }
      success = true;
    }

    // si inviano in blocco tutte le notifiche per garantire il contesto delle transactions
    sendNotificaClient.sendNotifiche(notificheToSendList);

    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return success;
  }

  public boolean isProtocolAuthor(String token, String idUtente){
    return token.equalsIgnoreCase(idUtente);
  }

  public boolean prendiInCaricoMassiva(List<String> numbers, String selectedOffice){
    LogUtils.entering(LogUtils.LogLevel.DEBUG);

    if(numbers.isEmpty()){
      CustomException.get(CustomException.ErrorCode.INTERNAL, "Nessun Protocollo/Circolare selezionato per la Presa in Carico").boom();
    }
    Map<String, Long> protccolloMap = new HashMap<>();

    // Eseguiamo un primo ciclo per intercettare eventuali incongruenze in riferimento alla presa in carico del protocollo
    for(String nProtocollo : numbers){
      try {
        DettaglioProtocolloDTO dettaglioProtocolloDTO = protocolloService.getDettaglioProtocollo(nProtocollo, selectedOffice);
        String tipologia = TipoRegistrazione.Circolare.equals(dettaglioProtocolloDTO.getProtocollo().getTipoRegistrazione()) ? "La Circolare" : "Il Protocollo";

        // Mappiamo il numero protocollo al rispettivo id per evitare di invocare nuovamente il servizio di dettaglio nel secondo ciclo
        protccolloMap.put(nProtocollo, dettaglioProtocolloDTO.getProtocollo().getId());

        if(dettaglioProtocolloDTO.getProtocollo().getStato().equals(StatoProtocollo.Annullato)){
          CustomException.get(CustomException.ErrorCode.INTERNAL,
                  String.format("Errore durante l'operazione di presa in carico. %s con numero: %s risulta Annullato",tipologia, nProtocollo)).boom();
        }

        boolean isPecEntrataFascicolabile = dettaglioProtocolloDTO.getProtocollo().getMetodoSpedizione().equals(MetodoSpedizione.Pec) && dettaglioProtocolloDTO.getProtocollo().getTipoRegistrazione().equals(TipoRegistrazione.Entrata) && dettaglioProtocolloDTO.isCanPrendereInCaricoFromPec();

        if(!isPecEntrataFascicolabile && !dettaglioProtocolloDTO.getStatoProtocollo().equalsIgnoreCase(StatoProtocollo.DaPrendereInCarico.toString())){
          CustomException.get(CustomException.ErrorCode.INTERNAL,
                  String.format("Errore durante l'operazione di presa in carico. %s con numero: %s risulta %s",tipologia, nProtocollo, dettaglioProtocolloDTO.getStatoProtocollo())).boom();
        }

      }catch (Exception e){
        LogUtils.exiting(LogUtils.LogLevel.ERROR);
        CustomException.get(CustomException.ErrorCode.INTERNAL, e.getMessage()).boom();
      }
    }

    // Eseguiamo il secondo ciclo per effettuare l'effettiva presa in carico
    for(String nProtocollo : numbers){
      try {
        this.prendiInCarico(new StatoProtocolloInput(protccolloMap.get(nProtocollo), StatoProtocollo.PresoInCarico.toString(), selectedOffice));
      }catch (Exception e){
        LogUtils.exiting(LogUtils.LogLevel.ERROR);
        CustomException.get(CustomException.ErrorCode.INTERNAL,
                String.format("Errore durante la presa in carico del Protocollo/Circolare %s", nProtocollo)).boom();
      }
    }

    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return true;
  }

  @Transactional
  public boolean prendiInCarico(StatoProtocolloInput input) {
    Protocollo protocollo = Protocollo.findById(input.idProtocollo);
    log.info("[prendiInCarico] - Operazione di presa in carico del protocollo con id: {} - da parte dell'utente: {} - nell'ufficio: {}",
            protocollo.getId(),
            ssoManager.extractNameFromToken(),
            input.getSelectedOffice());

   return updateStatoProtocollo(protocollo, StatoProtocollo.PresoInCarico, Operazione.presaInCarico, input.selectedOffice, null);
  }

  private PanacheQuery<ReferentiProtocollo> getQueryForAssegnatariIdProtocollo(Long idProtocollo, String selectedOffice, Optional<ReferentiProtocollo> optional) {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);

    StringBuilder query = new StringBuilder();
    Map<String, Object> params = new HashMap<>();

    query.append("idProtocollo = :idProtocollo and lower(attribuzione) = 'competenza'");
    if(optional.isPresent()){
      query.append("and lower(idDestinatario) != :selectedOffice");
      params.put("selectedOffice", selectedOffice);
    }
    params.put("idProtocollo", idProtocollo);

    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return ReferentiProtocollo.find(query.toString(), params);
  }

  /**
   * Servizio che restituisce una lista di referentiProtocollo paginata
   * accetta la ricerca globale, sort, paginazione e filtri ritorna
   * @param dto - conterrà tutti i parametri in input che vengono dai filtri
   * @return
   */
  @ExceptionChecked
  public ReferentiProtocolloOutputDTO getReferenti(RicercaReferentiProtocolloDTO dto) {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);

    if (dto == null) throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());

    PanacheQuery<ReferentiProtocollo> query = getAssegnatariQuery(dto);
    List<ReferentiProtocollo> referenteList = query.page(Page.of(dto.getPage(), dto.getSize())).list();

    long totalResults = query.count();
    ReferentiProtocolloOutputDTO outputDTO = new ReferentiProtocolloOutputDTO(null, getPagesCount(totalResults, dto.getSize()), totalResults);

    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return outputDTO;
  }

  public ReferentiProtocolloOutputDTO getReferentiDto(RicercaReferentiProtocolloDTO dto) {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);

    if (dto == null) throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());
    String idUtente = ssoManager.extractIdFromToken();

    PanacheQuery<ReferentiProtocollo> query = getAssegnatariQuery(dto);
    List<ReferentiProtocolloDTO> referenteList = query.page(Page.of(dto.getPage(), dto.getSize()))
            .list()
            .stream()
            .map(r -> convertToDto(r, idUtente))
            .toList();

    long totalResults = query.count();
    ReferentiProtocolloOutputDTO outputDTO = new ReferentiProtocolloOutputDTO(referenteList, getPagesCount(totalResults, dto.getSize()), totalResults);

    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return outputDTO;
  }

  private ReferentiProtocolloDTO convertToDto(ReferentiProtocollo entity, String idUtente) {
    String ufficioLavorazione = entity.getUfficioLavorazione() != null ? String.format(" (%s)", entity.getUfficioLavorazione()) : "";
    return ReferentiProtocolloDTO.builder()
            .id(entity.getId())
            .idProtocollo(entity.getIdProtocollo())
            .idMittente(entity.getIdMittente())
            .nomeMittente(entity.getNomeMittente())
            .idDestinatario(entity.getIdDestinatario())
            .nomeDestinatario( entity.getNomeDestinatario() + ufficioLavorazione)
            .attribuzione(entity.getAttribuzione())
            .isAssegnato(entity.isAssegnato())
            .tipoDestinatario(entity.getTipoDestinatario())
            .tsCreation(entity.getTsCreation())
            .tsStartVali(entity.getTsStartVali())
            .statoProtocollo(entity.getStatoProtocollo())
            .tsStatoProtocollo(entity.getTsStatoProtocollo())
            .creationOption(entity.isCreationOption())
            .revocabile(checkRevocaAssegnazione(idUtente, entity.getIdMittente(), entity.getStatoProtocollo(), entity.getTipoDestinatario()))
            .noteAssegnazione(entity.getNoteAssegnazione())
            .build();
  }

  private boolean checkRevocaAssegnazione(String idUtente, String idMittente, StatoProtocollo statoProtocollo, String tipoDestinatario){
    return idUtente != null && !idUtente.isEmpty()
            && idMittente != null && !idMittente.isEmpty() && idMittente.equalsIgnoreCase(idUtente)
            && (tipoDestinatario.equalsIgnoreCase("ufficio") && StatoProtocollo.Assegnato.toString().equalsIgnoreCase(statoProtocollo.toString())
            || (tipoDestinatario.equalsIgnoreCase("utente") && StatoProtocollo.DaPrendereInCarico.toString().equalsIgnoreCase(statoProtocollo.toString())));
  }

  @Transactional
  public List<String> getNomeDestinatariInizialiPerCompetenza(Long idProtocollo){
    List<ReferentiProtocollo> rpList = em.createNamedQuery("getDestinatariInizialiByIdProtocollo")
            .setParameter("idProtocollo", idProtocollo)
            .getResultList();
    return rpList.stream().map(rp -> rp.getNomeDestinatario()).toList();
  }

  private PanacheQuery<ReferentiProtocollo> getAssegnatariQuery(RicercaReferentiProtocolloDTO ricercaDTO){
    LogUtils.entering(LogUtils.LogLevel.DEBUG);

    Sort sortCriteria = SortInput.getSortOrDefault(ricercaDTO.hasSort() ? ricercaDTO.getSort() : ricercaDTO.getDefaultSort());

    Map<String, Object> params = new HashMap<>();
    StringBuilder query = new StringBuilder("id is not null and isAssegnato ");

    if (ricercaDTO.isEmpty() && !ricercaDTO.hasSearch() && !ricercaDTO.isExcludeStatoRifiutato()) {
      return ReferentiProtocollo.find(query.toString(), sortCriteria, params);
    }

    if(ricercaDTO.hasSearch()){
      query.append("and (:search = '' ")
              .append("or lower(statoProtocollo) like LOWER(concat('%', :search, '%')) " )
              .append("or lower(nomeDestinatario) like LOWER(concat('%', :search, '%')) )");
      params.put("search", ricercaDTO.getSearch().trim());
    }

    if (ricercaDTO.hasNumero()) {
      Protocollo protocollo = protocolloService.getProtocolloByNumero(ricercaDTO.getNumero());
      query.append("and idProtocollo = :idProtocollo ");
      params.put("idProtocollo", protocollo.getId());
    }

    if (ricercaDTO.hasAttribuzioneList()) {
      query.append("and lower(attribuzione) in (:attribuzioneList) ");
      params.put("attribuzioneList", ricercaDTO.getAttribuzioneList());
    }

    if (ricercaDTO.hasNomeDestinatario()) {
      query.append("and lower(nomeDestinatario) like LOWER(concat('%', :nomeDestinatario, '%')) ");
      params.put("nomeDestinatario", ricercaDTO.getNomeDestinatario());
    }

    if (ricercaDTO.hasStatoProtocollo()) {
      query.append("and statoProtocollo IN :statoProtocollo ");
      params.put("statoProtocollo", ricercaDTO.getStatoProtocollo());
    }

    if (ricercaDTO.isExcludeStatoRifiutato()) {
      query.append("and statoProtocollo != :exclude ");
      params.put("exclude", StatoProtocollo.Rifiutato);
    }

    if(ricercaDTO.hasTipoUtenteList()){
      query.append("and lower(tipoDestinatario) IN (:tipoUtenteList) ");
      params.put("tipoUtenteList", ricercaDTO.getTipoUtenteList());
    }

    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return ReferentiProtocollo.find(query.toString(), sortCriteria, params);
  }

  @Transactional
  public boolean deleteAllReferentiProtocollo(Protocollo protocollo) {
    List<ReferentiProtocollo> referentiList = getAllAssegnatariForProtocollo(protocollo.getId());

    if (referentiList == null || referentiList.isEmpty()) {
      return true;
    }

    try {
      for(ReferentiProtocollo referente : referentiList){
        referente.delete();
      }
      return true;
    } catch (Exception e) {
      CustomException.get(CustomException.ErrorCode.INTERNAL,
              String.format("Errore nella cancellazione degli assegnatari del protocollo/circolare: %s",protocollo.getId())).boom();
      return false;

    }finally {
      LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    }
  }

  @Override
  public PanacheQuery<Protocollo> getFindAllQuery(String search, SortInput sort) {
    return null;
  }

  @Override
  public PanacheQuery<Protocollo> getFindByIdQuery(Long id) {
    return null;
  }
}
