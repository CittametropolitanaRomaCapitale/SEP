package it.parsec326.pi.intranet.service;

import it.parsec326.pi.intranet.client.StradarioClient;
import it.parsec326.pi.intranet.dto.client.raccomandata.LoginRaccomandataDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@ApplicationScoped
public class StradarioService {

    @Inject
    StradarioClient client;

    @Inject
    ConfigurazioneService configurazioneService;

    private boolean checkSessionOrLogin() {
        boolean sessioneAttiva = client.sessionCheck();
        if (!sessioneAttiva) {
            log.info("Sessione non attiva, eseguo login...");
            LoginRaccomandataDTO login = configurazioneService.getLoginRaccomandata();
            return client.login(login);
        }
        return true;
    }

    public Set<String> listaCAP(String prefix) {
        if (!checkSessionOrLogin()) return Collections.emptySet();
        return new HashSet<>(client.listaCAP(prefix));
    }

    public Set<String> cittaDaCap(String cap, String prefix) {
        if (!checkSessionOrLogin()) return Collections.emptySet();
        return new HashSet<>(client.cittaDaCap(cap, prefix));
    }

    public Set<String[]> listaCAPDaCittaEstesa(String prefix, String citta, String tipoRicerca) {
        if (!checkSessionOrLogin()) return Collections.emptySet();
        return new HashSet<>(client.listaCAPDaCittaEstesa(prefix, citta, tipoRicerca));
    }

    public Set<String> listaVieDaCAP(String cap, String prefix) {
        if (!checkSessionOrLogin()) return Collections.emptySet();
        List<String> listaVie = client.listaVieDaCAP(cap);
        if(prefix != null){
            listaVie = listaVie.stream().filter(x -> x.toLowerCase().contains(prefix.toLowerCase())).toList();
        }
        return new HashSet<>(listaVie);
    }

    public Set<String> listaVieDaCitta(String citta) {
        if (!checkSessionOrLogin()) return Collections.emptySet();
        return new HashSet<>(client.listaVieDaCitta(citta));
    }
}
