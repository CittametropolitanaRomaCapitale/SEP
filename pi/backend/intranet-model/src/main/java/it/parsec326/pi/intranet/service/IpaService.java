package it.parsec326.pi.intranet.service;

import it.parsec326.pi.intranet.client.IpaClient;
import it.parsec326.pi.intranet.dto.ReferentiOutputDTO;
import it.parsec326.pi.intranet.dto.common.ReferenteOutputDTO;
import it.parsec326.pi.intranet.dto.ipa.IpaResponseDTO;
import it.parsec326.pi.intranet.dto.ipa.TipologiaIpaResponse;
import it.parsec326.pi.intranet.dto.ipa.json_mapper.ApiResponseIpa;
import it.parsec326.pi.intranet.dto.ipa.json_mapper.DataResponseIpaAOO;
import it.parsec326.pi.intranet.dto.ipa.json_mapper.DataResponseIpaSearch;
import it.parsec326.pi.intranet.dto.ipa.json_mapper.DataResponseIpaUO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@ApplicationScoped
public class IpaService {

    @Inject
    IpaClient ipaClient;

    //TODO: vedere se i dati ritornati sono sufficienti per la selezione lato client
    public ReferentiOutputDTO getOutputDTOFromIpaAOO(String codAmm, String codAoo, String search, Integer size, Integer page) {
        String cfPiva = ipaClient.infoEnteIpa(codAmm).getData().getCfPiva();
        if (cfPiva == null) {
            throw new RuntimeException("CF / P. Iva assente dalla response IPA");
        }

        ApiResponseIpa<DataResponseIpaAOO> responseAoo = ipaClient.ricercaAreaOrganizzativaOmogenea(codAmm, codAoo);
        List<ReferenteOutputDTO> referenti = responseAoo.getData().stream().map(r -> {
            ReferenteOutputDTO referente = new ReferenteOutputDTO();
            IpaResponseDTO input = IpaResponseDTO.builder()
                    .tipologiaIpaResponse(TipologiaIpaResponse.AOO)
                    .cfPiva(cfPiva)
                    .pec(r.getMail1())
                    .ragioneSociale(r.getDesAoo())
                    .indirizzo(r.getIndirizzo())
                    .citta(r.getComune())
                    .provincia(r.getProvincia())
                    .cap(r.getCap())
                    .telefono(r.getTel())
                    .fax(r.getFax())
                    .codAmm(r.getCodAmm())
                    .codAOO(r.getCodAoo())
                    .build();

            referente.setId(UUID.randomUUID().toString());
            referente.setTipo("ipa_aoo");
            referente.setLabel(r.getDesAoo());
            referente.setIdDestinatario(r.getCodAoo());
            referente.setIpaResponseDTO(input);

            return referente;
        }).collect(Collectors.toList());

        // Filter the list based on the search parameter, if provided
        if (search != null && !search.isEmpty()) {
            referenti = referenti.stream().filter(referente -> containsSearchAoo(referente, search)).collect(Collectors.toList());
        }

        // Pagination logic
        int totalItems = referenti.size();
        int totalPages = getPagesCount(totalItems, size);
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalItems);

        // Handle cases where the page number might be out of bounds
        List<ReferenteOutputDTO> paginatedList;
        if (fromIndex >= totalItems || fromIndex < 0) {
            paginatedList = Collections.emptyList();
        } else {
            paginatedList = referenti.subList(fromIndex, toIndex);
        }

        return new ReferentiOutputDTO(paginatedList, totalPages, totalItems);
    }


    public ReferentiOutputDTO getOutputDTOFromIpaUO(String codAmm, String search, Integer size, Integer page) {
        ApiResponseIpa<DataResponseIpaUO> responseUo = ipaClient.ricercaUnitaOrganizzative(codAmm);
        if (responseUo == null || responseUo.getData() == null) {
            return new ReferentiOutputDTO(new ArrayList<>(), 0, 0);
        }

        List<ReferenteOutputDTO> referenti = responseUo.getData().stream().map(r -> {
            ReferenteOutputDTO referente = new ReferenteOutputDTO();
            IpaResponseDTO input = IpaResponseDTO.builder()
                    .tipologiaIpaResponse(TipologiaIpaResponse.UO)
                    .codAmm(r.getCodAmm())
                    .codUniOU(r.getCodUniOu())
                    .codAOO(r.getCodAoo())
                    .cfPiva(r.getCf())
                    .statoCanale(r.getStatoCanale())
                    .datValCanaleTrasmSfe(r.getDatValCanaleTrasmSfe())
                    .dataVerificaOF(r.getDtVerificaCf())
                    .build();

            referente.setId(UUID.randomUUID().toString());
            referente.setTipo("ipa_uo");
            referente.setLabel(r.getDesOu());
            referente.setIdDestinatario(r.getCodUniOu());
            referente.setIpaResponseDTO(input);

            return referente;
        }).toList();

        // Filter the list based on the search parameter, if provided
        if (search != null && !search.isEmpty()) {
            referenti = referenti.stream()
                    .filter(referente -> containsSearchUo(referente, search))
                    .collect(Collectors.toList());
        }

        // Pagination logic (starting from page 0)
        int totalItems = referenti.size();
        int totalPages = getPagesCount(totalItems, size);
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalItems);

        // Handle cases where the page number might be out of bounds
        List<ReferenteOutputDTO> paginatedList;
        if (fromIndex >= totalItems || fromIndex < 0) {
            paginatedList = Collections.emptyList();
        } else {
            paginatedList = referenti.subList(fromIndex, toIndex);
        }

        return new ReferentiOutputDTO(paginatedList, totalPages, totalItems);
    }

    public ReferentiOutputDTO getOutputDTOFromIpaEnte(String desc, Integer size, Integer page) {
        ApiResponseIpa<DataResponseIpaSearch> responseEnte = ipaClient.ricercaDescEnte(desc);
        if (responseEnte == null || responseEnte.getData() == null) {
            return new ReferentiOutputDTO(new ArrayList<>(), 0, 0);
        }

        List<ReferenteOutputDTO> referenti = responseEnte.getData().stream().map(r -> {
            ReferenteOutputDTO referente = new ReferenteOutputDTO();
            IpaResponseDTO input = IpaResponseDTO.builder()
                    .tipologiaIpaResponse(TipologiaIpaResponse.ENTE)
                    .codAmm(r.getCodAmm())
                    .descAmm(r.getDescAmm())
                    .acronimo(r.getAcronimo())
                    .build();

            referente.setId(UUID.randomUUID().toString());
            referente.setTipo("ipa_ente");
            referente.setLabel(r.getDescAmm());
            referente.setIdDestinatario(r.getCodAmm());
            referente.setIpaResponseDTO(input);
            return referente;
        }).toList();

        // Pagination logic (starting from page 0)
        int totalItems = referenti.size();
        int totalPages = getPagesCount(totalItems, size);
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalItems);

        // Handle cases where the page number might be out of bounds
        List<ReferenteOutputDTO> paginatedList;
        if (fromIndex >= totalItems || fromIndex < 0) {
            paginatedList = Collections.emptyList();
        } else {
            paginatedList = referenti.subList(fromIndex, toIndex);
        }

        return new ReferentiOutputDTO(paginatedList, totalPages, totalItems);
    }


    private boolean containsSearchAoo(ReferenteOutputDTO referente, String search) {
        search = search.toLowerCase();
        return (referente.getIpaResponseDTO().getRagioneSociale() != null && referente.getIpaResponseDTO().getRagioneSociale().toLowerCase().contains(search)) ||
                (referente.getIpaResponseDTO().getCfPiva() != null && referente.getIpaResponseDTO().getCfPiva().toLowerCase().contains(search)) ||
                (referente.getIpaResponseDTO().getPec() != null && referente.getIpaResponseDTO().getPec().toLowerCase().contains(search)) ||
                (referente.getIpaResponseDTO().getIndirizzo() != null && referente.getIpaResponseDTO().getIndirizzo().toLowerCase().contains(search)) ||
                (referente.getIpaResponseDTO().getCitta() != null && referente.getIpaResponseDTO().getCitta().toLowerCase().contains(search));
    }
    private boolean containsSearchUo(ReferenteOutputDTO referente, String search) {
        search = search.toLowerCase();
        return (referente.getLabel() != null && referente.getLabel().toLowerCase().contains(search)) ||
                (referente.getIdDestinatario() != null && referente.getIdDestinatario().toLowerCase().contains(search)) ||
                (referente.getIpaResponseDTO().getCfPiva() != null && referente.getIpaResponseDTO().getCfPiva().toLowerCase().contains(search));
    }

    private int getPagesCount(long count, double size){
        return (int) Math.ceil(count == 0 ? 0 : count / size);
    }
}
