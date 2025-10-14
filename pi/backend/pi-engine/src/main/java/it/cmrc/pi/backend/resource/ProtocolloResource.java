package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.DettaglioProtocolloDTO;
import it.parsec326.pi.intranet.dto.ProtocolliOutputDTO;
import it.parsec326.pi.intranet.dto.ProtocolloEmergenzaDTO;
import it.parsec326.pi.intranet.dto.excel.ImportResult;
import it.parsec326.pi.intranet.dto.ricerca.RicercaProtocolliDTO;
import it.parsec326.pi.intranet.dto.input.ProtocolloInput;
import it.parsec326.pi.intranet.dto.input.ProtocolloUpdateInput;
import it.parsec326.pi.intranet.dto.input.ReferenteProtocolloInput;
import it.parsec326.pi.intranet.dto.input.StatoProtocolloInput;
import it.parsec326.pi.intranet.model.Allegato;
import it.parsec326.pi.intranet.model.Protocollo;
import it.parsec326.pi.intranet.model.ReferentiProtocollo;
import it.parsec326.pi.intranet.service.DocumentService;
import it.parsec326.pi.intranet.service.ProtocolloService;
import it.parsec326.pi.intranet.service.ReferentiProtocolloService;
import it.parsec326.pi.intranet.utils.LogUtils;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;

@GraphQLApi
//@Authenticated
@Slf4j
public class ProtocolloResource {

    @Inject
    ProtocolloService protocolloService;
    @Inject
    DocumentService documentService;
    @Inject
    ReferentiProtocolloService referentiProtocolloService;

    @Query(value = "getProtocolloById")
    public Protocollo findById(@Name("id") long id) {
        return protocolloService.findById(id);
    }

    @Query(value = "protocolloByNumero")
    public Protocollo getProtocolloByNumero(@Name("nProtocollo") String nProtocollo) {
        return protocolloService.getProtocolloByNumero(nProtocollo);
    }

    @Query(value = "dettaglioProtocollo")
    public DettaglioProtocolloDTO getDettaglioProtocollo(@Name("nProtocollo") String nProtocollo, @Name("selectedOffice") String selectedOffice) {
        return protocolloService.getDettaglioProtocollo(nProtocollo, selectedOffice);
    }

    @Query(value = "getProtocolli")
    public ProtocolliOutputDTO getProtocolli(@Name("ricerca_protocolli") RicercaProtocolliDTO ricercaProtocolliDTO) {
        //return protocolloService.getProtocolli(ricercaProtocolliDTO);
        return protocolloService.getProtocolliNative(ricercaProtocolliDTO);
    }
    @Query(value = "getProtocolliNative")
    public ProtocolliOutputDTO getProtocolliNative(@Name("ricerca_protocolli") RicercaProtocolliDTO ricercaProtocolliDTO) {
        return protocolloService.getProtocolliNative(ricercaProtocolliDTO);
    }

    @Query(value = "getProtocolloAllegatoPrincipale")
    public Allegato getAllegatoPrincipale(@Name("nProtocollo") String nProtocollo) {
        return protocolloService.getAllegatoPrincipale(nProtocollo);
    }

    @Mutation(value = "saveProtocollo")
    public Protocollo saveProtocollo(@Name("protocollo_input") ProtocolloInput protocolloinput) {
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        Protocollo protocollo = protocolloService.saveProtocollo(protocolloinput);
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return protocollo;
    }

    @Mutation(value = "saveProtocolloByEmail")
    public Protocollo saveProtocolloByEmail(@Name("idEmail") Long idEmail){
        LogUtils.entering(LogUtils.LogLevel.DEBUG);
        Protocollo protocollo = protocolloService.saveProtocolloByEmail(idEmail);
        LogUtils.exiting(LogUtils.LogLevel.DEBUG);
        return protocollo;
    }

    @Mutation(value = "assegnaProtocollo")
    public boolean assegnaProtocollo(@Name("idProtocollo") Long idProtocollo, @Name("assegnatari") List<ReferenteProtocolloInput> referenti, @Name("selectedOffice") String selectedOffice, @Name("noteAssegnazione") String noteAssegnazione) {
        return protocolloService.assegnaProtocollo(idProtocollo, referenti, selectedOffice, noteAssegnazione);
    }

    @Mutation(value = "revocaAssegnazioneProtocollo")
    public boolean revocaAssegnazioneProtocollo(@Name("referentiProtocolloId") Long referentiProtocolloId) {
        return protocolloService.revocaAssegnazioneProtocollo(referentiProtocolloId);
    }

    @Mutation(value = "richiestaAssegnazioneProtocollo")
    public boolean richiestaAssegnazioneProtocollo(@Name("idProtocollo") Long idProtocollo, @Name("note") String note) {
        return protocolloService.richiestaAssegnazioneProtocollo(idProtocollo, note);
    }

    @Mutation(value = "exportListaProtocolli")
    public String exportListaProtocolli(@Name("dto") RicercaProtocolliDTO dto, @Name("formato") String formato, @Name("idProtocolliSelezionati") List<Long> idProtocolliSelezionati) {
        return documentService.exportListaProtocolli(dto, formato, idProtocolliSelezionati);
    }

    @Mutation(value = "updateStatoProtocollo")
    public boolean updateStatoProtocollo(@Name("stato_protocollo_input") StatoProtocolloInput input) {
        return referentiProtocolloService.prendiInCarico(input);
    }

    @Mutation(value = "richiestaAnnullamentoProtocollo")
    public boolean richiestaAnnullamentoProtocollo(@Name("idProtocollo") Long idProtocollo, @Name("notaAnnullamento") String notaAnnullamento) {
        return protocolloService.richiestaAnnullamentoProtocollo(idProtocollo, notaAnnullamento);
    }

    @Mutation(value = "annullaProtocollo")
    public boolean annullaProtocollo(@Name("idProtocollo") Long idProtocollo, @Name("notaAnnullamento") String notaAnnullamento) {
        return protocolloService.annullaProtocollo(idProtocollo, notaAnnullamento);
    }


    @Mutation(value = "gestioneAnnullamento")
    public boolean gestioneAnnullamento(@Name("idProtocollo") Long nProtocollo, @Name("isAnnulla") boolean isAnnulla, @Name("nota") String nota) {
        return protocolloService.gestioneAnnullamento(nProtocollo, isAnnulla, nota);
    }

    @Mutation(value = "updateNoteProtocollo")
    public boolean updateNoteProtocollo(@Name("updateInput") ProtocolloUpdateInput input) {
        return protocolloService.updateNoteProtocollo(input);
    }

    @Mutation(value = "updateProtocollo")
    public Protocollo updateProtocollo(@Name("updateInput") ProtocolloUpdateInput input) {
        return protocolloService.updateProtocollo(input);
    }

    @Mutation(value = "rifiutaProtocollo")
    public boolean rifiutaProtocollo(@Name("nProtocollo") String nProtocollo, @Name("note") String note, @Name("selectedOffice") String selectedOffice) {
        return protocolloService.rifiutaProtocollo(nProtocollo, note, selectedOffice);
    }

    @Mutation(value = "presaInCaricoProtocolloMassiva")
    public boolean presaInCaricoProtocolloMassiva(@Name("numbers") List<String> numbers, @Name("selectedOffice") String selectedOffice) {
        return referentiProtocolloService.prendiInCaricoMassiva(numbers, selectedOffice);
    }

    @Mutation(value = "assegnazioneProtocolloMassiva")
    public boolean assegnazioneProtocolloMassiva(@Name("numbers") List<String> numbers, @Name("selectedOffice") String selectedOffice, @Name("assegnatari") List<ReferenteProtocolloInput> referenti, @Name("noteAssegnazione") String noteAssegnazione) {
        return protocolloService.assegnaProtocolloMassiva(numbers, selectedOffice, referenti, noteAssegnazione);
    }

    @Mutation(value = "rifiutaProtocolloMassiva")
    public boolean rifiutaProtocolloMassiva(@Name("numbers") List<String> numbers, @Name("selectedOffice") String selectedOffice, @Name("note") String note) {
        return protocolloService.rifiutoProtocolloMassiva(numbers, selectedOffice, note);
    }

    @Mutation(value = "fascicolazioneProtocollo")
    public boolean fascicolazioneProtocollo(@Name("idProtocollo") Long idProtocollo, @Name("idTitolarioList") List<Long> idTitolarioList, @Name("selectedOffice") String selectedOffice){
        return protocolloService.fascicolazioneProtocollo(idProtocollo, idTitolarioList, selectedOffice);
    }

    @Mutation(value = "fascicolazioneMassivaProtocollo")
    public boolean fascicolazioneMassivaProtocollo(
            @Name("idProtocolloList") List<Long> idProtocolloList,
            @Name("idTitolarioList") List<Long> idTitolarioList,
            @Name("selectedOffice") String selectedOffice){
        return protocolloService.fascicolazioneMassiva(idProtocolloList, idTitolarioList, selectedOffice);
    }

    @Query(value = "getAssegnatariTooltipForProtocollo")
    public List<ReferentiProtocollo> getAssegnatariTooltipForProtocollo(@Name("idProtocollo") Long idProtocollo) {
        if (idProtocollo == null) {
            throw new NotFoundException("Protocollo richiesto non valido");
        }
        Protocollo protocollo = Protocollo.findById(idProtocollo);
        if (protocollo == null) {
            throw new NotFoundException("Protocollo richiesto non trovato");
        }

        return referentiProtocolloService.getAllAssegnatariForProtocollo(idProtocollo);
    }

    @Mutation(value = "importProtocolliEmergenzaFromBase64")
    public List<ProtocolloEmergenzaDTO> importProtocolliEmergenzaFromBase64(@Name("fileBase64") String fileBase64, @Name("selectedOffice") String cdrCode, @Name("cdr") String cdr) {
        ImportResult result = protocolloService.importProtocolliEmergenzaFromBase64(fileBase64, cdrCode, cdr);

        if (result.getIdoneo()) {
            return result.getLista();
        }
        return null;
    }
}
