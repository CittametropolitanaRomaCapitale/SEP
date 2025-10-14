package it.cmrc.pi.backend.resource;

import it.parsec326.pi.intranet.dto.EmailOutputDTO;
import it.parsec326.pi.intranet.dto.NotificaProtocolloPecPeoInput;
import it.parsec326.pi.intranet.dto.ricerca.RicercaEmailDTO;
import it.parsec326.pi.intranet.dto.mail.InoltraRispondi;
import it.parsec326.pi.intranet.service.EmailService;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Query;

@GraphQLApi
//@Authenticated
@Slf4j
public class EmailResource {
  @Inject
  EmailService emailService;

  @Query(value = "getEmails")
  public EmailOutputDTO getEmails(@Name("ricerca") RicercaEmailDTO ricercaEmailDTO) {
    return emailService.getEmail(ricercaEmailDTO);
  }

  @Mutation(value = "inoltraRispondiEmail")
  public boolean inoltraRispondiEmail(@Name("dto") InoltraRispondi input) {
    return emailService.sendEmailRispondiInoltra(input);
  }

  @Mutation(value = "notificaProtocollo")
  public boolean notificaProtocollo(@Name("input") NotificaProtocolloPecPeoInput input) {
    return emailService.sendNotificaProtocolloPecPeo(input);
  }

  @Mutation(value = "reinviaEmail")
  public String reinviaEmail(@Name("idEmail") Long idEmail) throws Exception {
    return emailService.sendEmail(idEmail);
  }

  @Mutation(value = "sendEmailToQueue")
  public String sendEmailToQueue(@Name("idEmail") Long idEmail) {
    emailService.sendEmailToQueue(idEmail);
    return "OK";
  }
}

