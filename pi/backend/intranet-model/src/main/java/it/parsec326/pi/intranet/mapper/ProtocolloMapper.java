package it.parsec326.pi.intranet.mapper;

import it.parsec326.pi.intranet.dto.input.AllegatoInput;
import it.parsec326.pi.intranet.dto.input.ProtocolloInput;
import it.parsec326.pi.intranet.dto.input.ReferenteProtocolloInput;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.model.Allegato;
import it.parsec326.pi.intranet.model.Protocollo;
import it.parsec326.pi.intranet.service.AllegatoService;
import it.parsec326.pi.intranet.utils.common.MetodoSpedizione;
import it.parsec326.pi.intranet.utils.common.TipoRegistrazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@ApplicationScoped
@Slf4j
public class ProtocolloMapper  {

    @Inject
    AllegatoService allegatoService;

    public Protocollo toEntity(ProtocolloInput protocolloInput){
        List<Allegato> allegati = new ArrayList<>();

        if(protocolloInput.getReferenti() != null && (!protocolloInput.getReferenti().isEmpty()) && protocolloInput.getMetodoSpedizione().equalsIgnoreCase("email")){
            protocolloInput.getReferenti().forEach(referente -> {
                if(Boolean.TRUE.equals(referente.isIpa)){
                    CustomException.get(CustomException.ErrorCode.INTERNAL, "Impossibile selezionare contatti IPA con il metodo di spedizione selezionato").boom();
                }
            });
        }

        try{
            Protocollo protocollo = new Protocollo();
            protocollo.setIdUtente(protocolloInput.getIdUtente());
            protocollo.setUtente(protocolloInput.getUtente());
            if(protocolloInput.getMittente() != null){
                if(protocolloInput.getMittente().getIdMittente() != null){
                    protocollo.setIdMittente(protocolloInput.getMittente().getIdMittente());
                }
                if(protocolloInput.getMittente().getDescMittente() != null){
                    protocollo.setMittente(protocolloInput.getMittente().getDescMittente());
                }
            }
            protocollo.setTipoRegistrazione(getTipologiaRegistrazione(protocolloInput.getTipoRegistrazione()));
            protocollo.setOggetto(protocolloInput.getOggetto());
            if(protocolloInput.getIdUtenteLastOperation() != null){
                protocollo.setIdUtenteLastOperation(protocolloInput.getIdUtenteLastOperation());
            }
            protocollo.setTsStartVali(protocolloInput.getTsStartVali());
            protocollo.setMetodoSpedizione(getMetodoSpedizione(protocolloInput.getMetodoSpedizione()));
            protocollo.setProtocolloMittente(protocolloInput.getProtocolloMittente());
            protocollo.setDataProtocolloMittente(protocolloInput.getDataProtocolloMittente());
            protocollo.setNote(protocolloInput.getNote());
            protocollo.setNProtocolloCircolare(protocolloInput.getNProtocolloCircolare());
            protocollo.setIndirizzoPecPeo(protocolloInput.getIndirizzoPecPeo());
            protocollo.setCorpoPecPeo(protocolloInput.getCorpoPecPeo());
            protocollo.setInvioEmailMultiplo(protocolloInput.getInvioEmailMultiplo());
            protocollo.setCdr(protocolloInput.getCdr());
            protocollo.setCdrCode(protocolloInput.getCdrCode());

            StringBuilder assegnatariSb = new StringBuilder();
            if( protocolloInput.getReferenti() != null && (!protocolloInput.getReferenti().isEmpty()) ) {
                for (ReferenteProtocolloInput input : protocolloInput.getReferenti()) {
                    if (Boolean.TRUE.equals(input.getIsAssegnato())) {
                        assegnatariSb.append(input.getNomeAssegnatario())
                                .append(", ");
                    }
                }
            }
            protocollo.setAssegnatari(assegnatariSb.length() > 2 ? assegnatariSb.substring(0, assegnatariSb.length() - 2) : "");
            protocollo.setDestinatari(assegnatariSb.length() > 2 ? assegnatariSb.substring(0, assegnatariSb.length() - 2) : "");

            for(AllegatoInput input : protocolloInput.getAllegati()) {
                allegati.add(allegatoService.updateAllegato(input));
            }

            protocollo.setAllegati(allegati);
            return protocollo;
        }catch (Exception e){
            log.error("DTO PARSING ERROR:" + e.getMessage());
        }

        return null;
    }

    public TipoRegistrazione getTipologiaRegistrazione(String input){
        return Arrays.stream(TipoRegistrazione.values())
                .filter(x -> x.toString().equalsIgnoreCase(input))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("TipoRegistrazione non valido: " + input));
    }

    public MetodoSpedizione getMetodoSpedizione(String input){
        return Arrays.stream(MetodoSpedizione.values())
                .filter(x -> x.toString().equalsIgnoreCase(input))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("MetodoSpedizione non valido: " + input));
    }

    public MetodoSpedizione getMetodoSpedizioneWithNormalization(String normalizedInput) {
        for(String metodo : MetodoSpedizione.getAll()) {
            if (Normalizer.normalize(metodo, Normalizer.Form.NFC).equalsIgnoreCase(normalizedInput))
                return MetodoSpedizione.valueOfString(metodo);
        }
        throw new IllegalArgumentException("MetodoSpedizione non valido: " + normalizedInput);
    }
}
