package it.parsec326.pi.intranet.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.client.sso.DatiUtenteSlimSSO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaStoricoDTO;
import it.parsec326.pi.intranet.dto.StoricoOutputDTO;
import it.parsec326.pi.intranet.exception.ExceptionChecked;
import it.parsec326.pi.intranet.model.*;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.utils.LogUtils;
import it.parsec326.pi.intranet.utils.SortInput;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import java.util.stream.Collectors;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@ApplicationScoped
public class StoricoService implements PanacheCustomEntityServiceInterface<Storico> {

  @Inject
  @Getter
  UserTransaction transaction;

  @Inject
  SSOClient ssoManager;

  @Inject
  ConfigurazioneService configurazioneService;

  /**
   * Servizio che restituisce tutta la lista dello storico del protocollo, paginata
   * accetta sort
   * @param dto - conterrà tutti i parametri in input che vengono dai filtri
   * @return
   */
  @ExceptionChecked
  public StoricoOutputDTO getLogStorici(RicercaStoricoDTO dto, String from) {
    LogUtils.entering(LogUtils.LogLevel.DEBUG);

    if (!ssoManager.hasJwtToken()) {
      return new StoricoOutputDTO(new ArrayList<>(), 0, 0);
    }

    if (dto == null) throw new IllegalArgumentException("Parametro dto obbligatorio in " + LogUtils.getCallerInfo());


    if(dto.getIdProtocollo() == null && dto.getIdTitolario() == null && dto.getIdRegistroGiornaliero() == null){
      return new StoricoOutputDTO(new ArrayList<>(), 0, 0);
    }

    PanacheQuery<Storico> query = getLogStoricoQuery(dto);

    List<Storico> logStorici;
    long totalResults = query.count();
    StoricoOutputDTO outputDTO;

    if("export".equals(from)){
      logStorici = query.list();
      outputDTO = new StoricoOutputDTO(logStorici, getPagesCount(totalResults, totalResults), totalResults);
    } else{
      logStorici = query.page(Page.of(dto.getPage(), dto.getSize())).list();
      outputDTO = new StoricoOutputDTO(logStorici, getPagesCount(totalResults, dto.getSize()), totalResults);
    }

    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    return outputDTO;
  }


  /**
   * Servizio che costruisce una query dinamica per la restituzione della lista di storico per protocollo
   * accetta sort
   * @param dto - conterrà tutti i parametri in input che vengono dai filtri
   * @return
   */
  public PanacheQuery<Storico> getLogStoricoQuery(RicercaStoricoDTO dto) {
    Sort sortCriteria = SortInput.getSortOrDefault(dto.hasSort() ? dto.getSort() : dto.getDefaultSort());

    Map<String, Object> params = new HashMap<>();
    StringBuilder query = new StringBuilder("id is not null ");

    if (dto.hasProtocollo()) {
      query.append("and idProtocollo = :idProtocollo ");
      params.put("idProtocollo", dto.getIdProtocollo());
    }

    if(dto.hasCdrCode() && dto.hasCdrFilter() && Boolean.TRUE.equals(dto.getIsFilteredByCdr())){
      List<Configurazione> configurazioniGlobali = configurazioneService.getAllConfigurazioniByCategoria("global");
      String applicationId = configurazioneService.getApplicationId(configurazioniGlobali);
      List<DatiUtenteSlimSSO> users = ssoManager.getUsersByCdrCode(applicationId, dto.getCdrCode());
      if (users != null && !users.isEmpty()) {
        List<String> usersId = users.stream()
                .map(user -> user.authId)
                .collect(Collectors.toList());
        query.append("and idUtente IN :usersId ");
        params.put("usersId", usersId);
      }
    }
    if (dto.hasTitolario()) {
      query.append("and idTitolario = :id_titolario ");
      params.put("id_titolario", dto.getIdTitolario());
    }
    if (dto.hasRegistroGiornaliero()) {
      query.append("and idRegistroGiornaliero = :id_registro_giornaliero ");
      params.put("id_registro_giornaliero", dto.getIdRegistroGiornaliero());
    }

    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
    log.info("[getLogStoricoQuery] - Params: {}", params);
    return Storico.find(query.toString(), sortCriteria, params);
  }


  @Transactional
  public void insertNewStoricoForEntita(Protocollo protocollo, Titolario titolario, RegistroGiornaliero registroGiornaliero, String idUtente, String utente, String operazione, String note) throws RuntimeException {
    if (operazione == null) {
      throw new RuntimeException("Operazione non può essere null");
    }
    if (utente == null || utente.length() > 255) {
      throw new RuntimeException("Utente non può essere null e deve essere minore di 255 caratteri");
    }

    LogUtils.entering(LogUtils.LogLevel.DEBUG);
    Storico storico = new Storico();
    if (protocollo != null) storico.setIdProtocollo(protocollo.getId());
    else if (titolario != null) storico.setIdTitolario(titolario.getId());
    else if (registroGiornaliero != null) storico.setIdRegistroGiornaliero(registroGiornaliero.getId());
    storico.setOperazione(operazione);
    storico.setUtente(utente);

    if (idUtente != null) storico.setIdUtente(idUtente);
    if(note != null) storico.setNote(note);

    storico.persist();
    LogUtils.exiting(LogUtils.LogLevel.DEBUG);
  }

  @Transactional
  public void insertNewStoricoForNumeroProtocollo(Protocollo protocollo, String idUtente, String utente, String operazione, String note) throws RuntimeException {
    insertNewStoricoForEntita(protocollo, null, null, idUtente, utente, operazione, note);
  }

  @Transactional
  public void insertNewStoricoForIdTitolario(Titolario titolario, String idUtente, String utente, String operazione, String note) throws RuntimeException {
    insertNewStoricoForEntita(null, titolario, null, idUtente, utente, operazione, note);
  }

  @Transactional
  public void insertNewStoricoForIdRegistroGiornaliero(RegistroGiornaliero registroGiornaliero, String idUtente, String utente, String operazione, String note) throws RuntimeException {
    insertNewStoricoForEntita(null, null,  registroGiornaliero, idUtente, utente, operazione, note);
  }

  @Transactional
  public void insertNewStoricoForNumeroProtocolloWithUtenteSistema(Protocollo protocollo, String operazione) throws RuntimeException {
    insertNewStoricoForEntita(protocollo, null, null, "0", "Sistema", operazione, null);
  }
  @Transactional
  public void insertNewStoricoForTitolarioWithUtenteSistema(Titolario titolario, String operazione) throws RuntimeException {
    insertNewStoricoForEntita(null, titolario, null, "0", "Sistema", operazione, null);
  }
  @Transactional
  public void insertNewStoricoForIdRegistroGiornalieroWithUtenteSistema(RegistroGiornaliero registroGiornaliero, String operazione, String note) throws RuntimeException {
    insertNewStoricoForEntita(null, null, registroGiornaliero, "0", "Sistema", operazione, note);
  }
  @Transactional
  public void insertNewStoricoForIdDiscardResumeAllegati(Protocollo protocollo, String idUtente, String nomeUtente, String operazione, String note) throws RuntimeException {
    insertNewStoricoForEntita(protocollo, null, null, idUtente, nomeUtente, operazione, note);
  }
  @Transactional
  public void insertNewStoricoForOperazioneUtente(String idUtente, String nomUtente, String operazione, String note) throws RuntimeException {
    insertNewStoricoForEntita(null, null, null, idUtente, nomUtente, operazione, note);
  }

  /**
   * Metodo inserito da utilizzare fino a quando non sarà gestita l'autenticazione
   */
  /*
  @Transactional
  public void insertNewStoricoForNumeroProtocolloWithUtenteMock(Protocollo protocollo, String operazione) throws RuntimeException {
    insertNewStoricoForNumeroProtocollo(protocollo, MockUtils.getIdUtenteForStorico(), MockUtils.getUtenteForStorico(), operazione);
  }
  */

  @Override
  public PanacheQuery<Storico> getFindAllQuery(String search, SortInput sort) {
    return null;
  }

  @Override
  public PanacheQuery<Storico> getFindByIdQuery(Long id) {
    return null;
  }
}
