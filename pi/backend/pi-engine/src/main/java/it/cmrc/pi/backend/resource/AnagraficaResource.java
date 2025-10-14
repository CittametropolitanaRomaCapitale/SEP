package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.*;
import it.parsec326.pi.intranet.dto.common.GruppoOutputDTO;
import it.parsec326.pi.intranet.dto.excel.ImportResult;
import it.parsec326.pi.intranet.dto.input.AnagraficaInput;
import it.parsec326.pi.intranet.dto.output.AnagraficaDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaAnagraficaDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaGruppiDTO;
import it.parsec326.pi.intranet.model.Anagrafica;
import it.parsec326.pi.intranet.model.Gruppo;
import it.parsec326.pi.intranet.service.AnagraficaService;
import jakarta.inject.Inject;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;

@GraphQLApi
//@Authenticated
public class AnagraficaResource {

  @Inject
  AnagraficaService anagraficaService;

  @Query(value="getDettaglioAnagrafica")
  public AnagraficaDTO getDettaglioAnagrafica(@Name("id") Long id) {
    return anagraficaService.getDettaglioContatto(id);
  }

  @Query(value="getAllAnagrafica")
  public AnagraficaDTOList getAllAnagrafica(@Name("ricercaAnagrafica") RicercaAnagraficaDTO ricercaAnagraficaDTO){
    return anagraficaService.getAllAnagraficaDTO(ricercaAnagraficaDTO);
  }

  // Commentato perchè non usato, i contatti sono ritornati direttamente dalla getReferenti
  /*@Query(value="getAllReferentiByGruppiIds")
  public ReferentiOutputDTO getAllReferentiByGruppiIds(@Name("gruppiIds")List<Long> gruppiIds, @Name("metodoSpedizione") String metodoSpedizione){
    return anagraficaService.getAllReferentiByGruppiIds(gruppiIds, metodoSpedizione);
  }*/

  @Query(value="getAllGruppi")
  public GruppiOutputDTO getAllGruppi(@Name("ricercaGruppi") RicercaGruppiDTO ricercaGruppiDTO){
    return anagraficaService.getAllGruppi(ricercaGruppiDTO);
  }

  @Mutation(value="saveContatto")
  public Anagrafica saveContatto(@Name("anagraficaInput")AnagraficaInput input){
    return anagraficaService.saveContattoInput(input);
  }

  @Mutation(value="deleteContatto")
  public boolean deleteContatto(@Name("id")Long id) {
    return anagraficaService.deleteContatto(id);
  }

  @Mutation(value = "updateContatto")
  public Anagrafica updateContatto(@Name("id") Long id, @Name("anagraficaInput") AnagraficaInput input) {
    return anagraficaService.updateContattoInput(id,input);
  }

  @Mutation
  public boolean importAnagraficaFromBase64(@Name("fileBase64") String fileBase64) {
      ImportResult result = anagraficaService.importContattiAnagraficaFromExcel(fileBase64);
      return result.getIdoneo();
  }

  @Mutation
  public String deleteAnagraficaWithoutCertificazione() {
    anagraficaService.deleteAnagraficaWithoutCertificazione();
    return "Operazione completata";
  }


  @Mutation(value="saveGruppo")
  public Gruppo saveGruppo(@Name("gruppoAnagraficaDTO") GruppoAnagraficaDTO input){
    return anagraficaService.saveGruppoContatti(input);
  }

  @Mutation(value="updateGruppo")
  public Gruppo updateGruppo(@Name("groupId") Long groupId, @Name("gruppoAnagraficaDTO") GruppoAnagraficaDTO input){
    return anagraficaService.updateGruppoContatti(groupId, input);
  }

  @Mutation(value = "deleteGruppo")
  public boolean deleteGruppo(@Name("groupId") Long groupId) {
    return anagraficaService.deleteGruppo(groupId);
  }

  @Mutation(value = "addContactsToGroup")
  public boolean addContactsToGroup(@Name("groupId") Long groupId, @Name("contactIds") List<Long> contactIds) {
    return anagraficaService.addContactsToGroup(groupId, contactIds);
  }

  @Mutation(value = "removeContactFromGroup")
  public boolean removeContactFromGroup(@Name("groupId") Long groupId, @Name("contactId") Long contactId) {
    return anagraficaService.removeContactFromGroup(groupId, contactId);
  }

  @Query(value = "dettaglioGruppo")
  public GruppoOutputDTO getDettaglioGruppo(@Name("groupId") Long groupId) {
    return anagraficaService.getDettaglioGruppo(groupId);
  }


}
