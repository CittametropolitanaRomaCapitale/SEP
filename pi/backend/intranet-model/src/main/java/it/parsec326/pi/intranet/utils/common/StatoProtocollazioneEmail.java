package it.parsec326.pi.intranet.utils.common;

import lombok.Getter;

@Getter
public enum StatoProtocollazioneEmail {
  PROTOCOLLATO("PROTOCOLLATO"),
  NON_PROTOCOLLATO("NON_PROTOCOLLATO");

  final String stato;

  StatoProtocollazioneEmail(String stato) {this.stato = stato;}
}

