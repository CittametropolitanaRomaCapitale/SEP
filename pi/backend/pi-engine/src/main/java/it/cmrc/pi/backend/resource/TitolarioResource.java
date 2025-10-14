package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.*;
import it.parsec326.pi.intranet.dto.common.TitolarioOutputDTO;
import it.parsec326.pi.intranet.dto.input.TitolarioInput;
import it.parsec326.pi.intranet.dto.input.VisibilitaTitolarioInput;
import it.parsec326.pi.intranet.dto.output.PermessiVisibilitaOutputDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaPermessiVisibilitaDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaProtocolliDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaTitolarioDTO;
import it.parsec326.pi.intranet.model.Protocollo;
import it.parsec326.pi.intranet.model.Titolario;
import it.parsec326.pi.intranet.service.TitolarioService;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;
import java.util.Set;

@GraphQLApi
@Slf4j
public class TitolarioResource {

    @Inject
    TitolarioService titolarioService;

    @Query(value = "getTitolario")
    public TitolariOutputDTO getTitolario(RicercaTitolarioDTO dto) {
        return titolarioService.getTitolarioSection(dto);
    }

    @Query(value = "forceGetTitolario")
    public TitolariOutputDTO forceGetTitolario(RicercaTitolarioDTO dto) {
        return titolarioService.forceGetTitolarioSection(dto);
    }

    @Query(value = "getPathForTitolarioItem")
    public String getPathForTitolarioItem(@Name("id") long id) {
        return titolarioService.getPathForTitolarioItem(id);
    }

    @Query(value = "titolarioFindById")
    public Titolario findById(@Name("id") Long id){
        return Titolario.findById(id);
    }

    @Mutation(value = "insertTitolario")
    public boolean insertTitolario(@Name("titolarioInput") TitolarioInput input) {
        return titolarioService.insertTitolario(input);
    }

    @Mutation(value = "updateTitolario")
    public boolean updateTitolario(@Name("titolarioInput") TitolarioInput input) {
        return titolarioService.updateTitolario(input);
    }

    @Mutation(value = "deleteTitolario")
    public boolean deleteTitolario(@Name("idTitolario") Long idTitolario) {
        return titolarioService.deleteTitolario(idTitolario, false);
    }

    @Mutation(value = "dropTitolario")
    public boolean dropTitolario(@Name("idTitolario") Long idTitolario) {
        return titolarioService.deleteTitolario(idTitolario, true);
    }

    @Query(value = "getAllProtocolliByFascicolo")
    public List<Protocollo> getAllProtocolliByFascicolo(@Name("idFascicolo") Long idFascicolo) {
        return titolarioService.getAllProtocolliByFascicolo(idFascicolo);
    }

    @Mutation(value = "spostaProtocollo")
    public boolean spostaProtocollo(@Name("idProtocolli") List<Long> idProtocolli, @Name("idFascicoloOld") Long idFascicoloOld, @Name("idFascicoloNew") Long idFascicoloNew) {
        return titolarioService.spostaProtocollo(idProtocolli, idFascicoloOld, idFascicoloNew);
    }

    @Mutation(value = "spostaFascicolo")
    public boolean spostaFascicolo(@Name("idFascicoliList") List <Long> idFascicoliList, @Name("idFascicoloPadre") Long idFascicoloPadre, @Name("cdr") String cdr, @Name("cdrCode") String cdrCode) {
       return titolarioService.spostaFascicolo(idFascicoliList, idFascicoloPadre, cdr, cdrCode);
    }

    @Mutation(value = "insertVisibilitatitolario")
    public boolean insertVisibilitatitolario(@Name("visibilitaTitolarioInput") VisibilitaTitolarioInput visibilitaTitolario) {
        return titolarioService.insertVisibilitaTitolario(visibilitaTitolario);
    }

    @Mutation(value = "deleteVisibilitaTitolario")
    public boolean deleteVisibilitaTitolario(@Name("deleteVisibilitaTitolario") List<Long> idVisibilitaList) {
        return titolarioService.deleteVisibilitaTitolario(idVisibilitaList);
    }

    @Query(value = "getProtocolliByFascicolo")
    public ProtocolliOutputDTO getProtocolliByFascicolo(@Name("ricerca_protocolli") RicercaProtocolliDTO ricercaProtocolliDTO) {
        return titolarioService.getProtocolliByFascicolo(ricercaProtocolliDTO);
    }

    @Query(value = "getTitolarioById")
    public Titolario getTitolarioById(@Name("idTitolario") Long idTitolario) {
        return titolarioService.getTitolarioById(idTitolario);
    }

    @Query(value = "dettaglioTitolario")
    public TitolarioOutputDTO getDettaglioTitolario(@Name("idTitolario") Long idTitolario) {
        return titolarioService.getDettaglioTitolario(idTitolario);
    }

    @Query(value = "getPermessiVisibilita")
    public PermessiVisibilitaOutputDTO getPermessiVisibilita(@Name("visibilitaDTO") RicercaPermessiVisibilitaDTO visibilitaDTO) {
        return titolarioService.getPermessiVisibilita(visibilitaDTO);
    }

    @Mutation(value = "spostaAllegatiFascicolo")
    public boolean spostaAllegatiFascicolo(@Name("allegatiIds") List<Long> allegatiIds, @Name("oldTitolarioId") Long oldTitolarioId, @Name("newTitolarioId") Long newTitolarioId){
        return titolarioService.spostaAllegatiFascicolo(allegatiIds, oldTitolarioId, newTitolarioId);
    }

    @Query(value = "createFascicoliDipendenti")
    public boolean createFascicoliDipendenti(@Name("userAuthId") String userId, @Name("forceRewritePermessi")Boolean rewritePermessi, @Name("forceRewritePermessiExDipendenti")Boolean rewritePermessiExDipendenti, @Name("startIndex")Long start, @Name("endIndex")Long end) {
        titolarioService.createFascicoliDipendenti(rewritePermessi, rewritePermessiExDipendenti, start, end, userId);
        return true;
    }

    @Query(value = "createFascicoliFattureDetermine")
    public boolean createFascicoliFattureDetermine() {
        titolarioService.createFascicoliFattureDetermine();
        return true;
    }

    @Query(value = "getAllTitolarioByName")
    public Set<Long> getAllTitolarioByName(@Name("nome")String nome){
        return titolarioService.getAllTitolarioByName(nome);
    }

    @Query(value = "getClassificazioneStringByIdProtocollo")
    public List<TitolarioOutputDTO> getHierarchyStringByIdProtocollo(@Name("idProtocollo")Long idProtocollo){
        return titolarioService.getHierarchyStringByIdProtocollo(idProtocollo);
    }

    @Query(value = "getMaxLivelloFascicolazioneForTitolario")
    public int getMaxLivelloFascicolazioneForTitolario() {
        return titolarioService.getMaxLivelloFascicolazioneForTitolario();
    }

    @Mutation(value = "setMaxLivelloFascicolazioneForTitolario")
    public boolean getMaxLivelloFascicolazioneForTitolario(@Name("livello")Integer livello) {
        return titolarioService.setMaxLivelloFascicolazioneForTitolario(livello);
    }
}
