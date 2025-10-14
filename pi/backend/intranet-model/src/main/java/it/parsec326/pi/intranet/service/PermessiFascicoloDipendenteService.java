package it.parsec326.pi.intranet.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.model.PermessiFascicoloDipendente;
import it.parsec326.pi.intranet.model.Titolario;
import it.parsec326.pi.intranet.model.Ufficio;
import it.parsec326.pi.intranet.service.common.PanacheCustomEntityServiceInterface;
import it.parsec326.pi.intranet.utils.SortInput;
import it.parsec326.pi.intranet.utils.common.PermessoFascicoloDipendente;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.transaction.UserTransaction;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@ApplicationScoped
public class PermessiFascicoloDipendenteService implements PanacheCustomEntityServiceInterface<PermessiFascicoloDipendente> {

    @Inject
    @Getter
    UserTransaction transaction;

    @Inject
    SSOClient ssoMananager;

    @Transactional
    public void addNew(){

        PermessiFascicoloDipendente permessoToSave = new PermessiFascicoloDipendente();
        Titolario titolario1= Titolario.findById(29526L); // ASSUNZIONE
        permessoToSave.setTitolario(titolario1);
        permessoToSave.setVisibilitaUtente(PermessoFascicoloDipendente.visualizzazione);
        permessoToSave.setVisibilitaArchivista(PermessoFascicoloDipendente.protocollazione);
        permessoToSave.setVisibilitaProtocollatore(PermessoFascicoloDipendente.protocollazione);
        permessoToSave.setVisibilitaDirigente(null);
        permessoToSave.setVisibilitaDipendente(null);

        Ufficio direzioneUC1 = Ufficio.find("cdrCode","8100").firstResult();
        Ufficio ucServ1 = Ufficio.find("cdrCode","8110").firstResult();
        Ufficio ucServ2 = Ufficio.find("cdrCode","8120").firstResult();

        Set<Ufficio> ufficioSet = new HashSet<>();
        ufficioSet.add(direzioneUC1);
        ufficioSet.add(ucServ1);
        ufficioSet.add(ucServ2);

        permessoToSave.setUffici(ufficioSet);
        permessoToSave.persist();
        log.info("Salvataggio permesso: {}",permessoToSave.id);

        PermessiFascicoloDipendente permessoToSave2 = new PermessiFascicoloDipendente();
        Titolario titolario2= Titolario.findById(29530L); // ASSUNZIONE
        permessoToSave2.setTitolario(titolario2); // Comandi e mobilita/Entrata Mobilità
        permessoToSave2.setVisibilitaDirigente(PermessoFascicoloDipendente.protocollazione);
        permessoToSave2.setVisibilitaArchivista(PermessoFascicoloDipendente.no);
        permessoToSave2.setVisibilitaProtocollatore(PermessoFascicoloDipendente.no);
        permessoToSave2.setVisibilitaDipendente(PermessoFascicoloDipendente.visualizzazione);
        permessoToSave2.setVisibilitaUtente(null);

        Set<Ufficio> ufficioSet2 = new HashSet<>();
        Ufficio avvocatura = Ufficio.find("cdrCode","7500").firstResult();

        ufficioSet2.add(avvocatura);
        permessoToSave2.setUffici(ufficioSet2);
        permessoToSave2.persistAndFlush();
        log.info("Salvataggio permesso: {}",permessoToSave2.id);
    }


    public List<PermessiFascicoloDipendente> getAll(){
        return PermessiFascicoloDipendente.listAll();
    }






    @Override
    public PanacheQuery<PermessiFascicoloDipendente> getFindAllQuery(String search, SortInput sort) {
        return null;
    }

    @Override
    public PanacheQuery<PermessiFascicoloDipendente> getFindByIdQuery(Long id) {
        return null;
    }
}
