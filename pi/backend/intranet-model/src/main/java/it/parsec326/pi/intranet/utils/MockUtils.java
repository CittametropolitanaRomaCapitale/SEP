package it.parsec326.pi.intranet.utils;

import it.parsec326.pi.intranet.dto.common.ReferenteOutputDTO;
import it.parsec326.pi.intranet.dto.ReferentiOutputDTO;
import it.parsec326.pi.intranet.model.PecPeo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MockUtils {

  public static List<PecPeo> buildDestinatariPecPeo() {
    List<String> emailList = Arrays.asList(
            "notification@parsec326.it",
            "andrea.dematteis@parsec326.it",
            "lorenzo.petraroli@parsec326.it",
            "simone.spinelli@parsec326.it",
            "salvatore.versienti@parsec326.it",
            "gioacchino.defusco@parsec326.it",
            "sviluppo@pec.parsec326.it",
            "roberto.pisan0@pec.it");

    return emailList.stream()
            .map(email -> {
              PecPeo pecPeo = new PecPeo();
              pecPeo.setIndirizzoEmail(email);
              return pecPeo;
            }).toList();

  }

  public static String getIdUtenteForStorico() {
      return "1";
  }
  public static String getUtenteForStorico() {
      return "PI User";
  }

  public static ReferentiOutputDTO getOrganigrammaOutputDTO() {

      List<ReferenteOutputDTO> uffici = new ArrayList<>();
      ReferenteOutputDTO ufficio1 = new ReferenteOutputDTO();
      ufficio1.setId("AVV0000");
      ufficio1.setLabel("AVV0000 - (U.E. Avvocatura)");
      ufficio1.setTipo("ufficio");

      List<ReferenteOutputDTO> avv_utenti = new ArrayList<>();
      ReferenteOutputDTO avv_utente1 = new ReferenteOutputDTO();
      avv_utente1.setId("123456");
      avv_utente1.setTipo("utente");
      avv_utente1.setLabel("Utente mock 1");
      avv_utenti.add(avv_utente1);
      ufficio1.setChildren(avv_utenti);

      uffici.add(ufficio1);

      ReferentiOutputDTO output = new ReferentiOutputDTO();
      output.setReferenti(uffici);
      output.setPageCount(1);
      return output;
  }
}

