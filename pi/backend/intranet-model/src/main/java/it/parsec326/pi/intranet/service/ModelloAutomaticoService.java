package it.parsec326.pi.intranet.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import it.parsec326.pi.intranet.client.SSOClient;
import it.parsec326.pi.intranet.dto.ModelloAutomaticoDTO;
import it.parsec326.pi.intranet.dto.ModelloAutomaticoInputDTO;
import it.parsec326.pi.intranet.dto.ModelloAutomaticoOutputDTO;
import it.parsec326.pi.intranet.dto.ricerca.RicercaModelloAutomaticoDTO;
import it.parsec326.pi.intranet.exception.CustomException;
import it.parsec326.pi.intranet.model.ModelloAutomatico;
import it.parsec326.pi.intranet.model.Titolario;
import it.parsec326.pi.intranet.model.Ufficio;
import it.parsec326.pi.intranet.utils.SortInput;
import it.parsec326.pi.intranet.utils.common.MetodoSpedizione;
import it.parsec326.pi.intranet.utils.common.TipoRegistrazione;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.*;

@ApplicationScoped
@Slf4j
public class ModelloAutomaticoService {

    @Inject
    EntityManager em;

    @Inject
    TitolarioService titolarioService;

    @Inject
    SSOClient ssoManager;


    public ModelloAutomaticoOutputDTO getModelliAutomatici(RicercaModelloAutomaticoDTO dto) {
        if (dto == null) throw new IllegalArgumentException("Parametro dto obbligatorio");

        PanacheQuery<ModelloAutomatico> query = getModelliAutomaticiQuery(dto);
        List<ModelloAutomaticoDTO> dtoList = query
                .page(Page.of(dto.getPage(), dto.getSize()))
                .list()
                .stream()
                .map(ModelloAutomaticoDTO::fromModel)
                .toList();

        List<Ufficio> uffici = Ufficio.findAll().list();
        for(ModelloAutomaticoDTO dtoItem : dtoList) {
            if (dtoItem.getTitolario() != null) {
                dtoItem.hierarchyStringTitolario = titolarioService.buildHierarchyString(titolarioService.getHierarchyForTitolarioId(dtoItem.getTitolario().getId()).getTitolario());
            }
            for(Ufficio ufficio : uffici) {
                if (dtoItem.getCdrCode() != null && dtoItem.getCdrCode().equalsIgnoreCase(ufficio.getCdrCode())) {
                    dtoItem.cdr = ufficio.getCdr();
                    break;
                }
            }
        }

        long totalResults = query.count();
        return new ModelloAutomaticoOutputDTO(dtoList, getPagesCount(totalResults, dto.getSize()), totalResults);
    }

    public PanacheQuery<ModelloAutomatico> getModelliAutomaticiQuery(RicercaModelloAutomaticoDTO dto) {
        Sort sortCriteria = SortInput.getSortOrDefault(dto.hasSort() ? dto.getSort() : dto.getDefaultSort());

        Map<String, Object> params = new HashMap<>();
        StringBuilder query = new StringBuilder("1=1 ");

        if (dto.getNomeModello() != null && !dto.getNomeModello().isEmpty()) {
            query.append("and lower(nomeModello) like :nomeModello ");
            params.put("nomeModello", "%" + dto.getNomeModello().toLowerCase() + "%");
        }

        if (dto.getOggettoProtocollo() != null && !dto.getOggettoProtocollo().isEmpty()) {
            query.append("and lower(oggettoProtocollo) like :oggettoProtocollo ");
            params.put("oggettoProtocollo", "%" + dto.getOggettoProtocollo().toLowerCase() + "%");
        }

        if (dto.getMetodoSpedizione() != null) {
            query.append("and metodoSpedizione = :metodoSpedizione ");
            params.put("metodoSpedizione", MetodoSpedizione.valueOf(dto.getMetodoSpedizione()));
        }

        if (dto.getTipoRegistrazione() != null) {
            query.append("and tipoRegistrazione = :tipoRegistrazione ");
            params.put("tipoRegistrazione", TipoRegistrazione.valueOf(dto.getTipoRegistrazione()));
        }

        if (dto.getCdr() != null && !dto.getCdr().isEmpty()) {
            query.append("and cdrCode IN :cdrCode ");
            params.put("cdrCode", dto.getCdr());
        }

        if (dto.hasSearch()) {
            String search = dto.getSearch().trim().toLowerCase();
            query.append("and (lower(nomeModello) like :search or lower(oggettoProtocollo) like :search) ");
            params.put("search", "%" + search + "%");
        }

        return ModelloAutomatico.find(query.toString(), sortCriteria, params);
    }


    public List<ModelloAutomaticoDTO> getModelliAutomaticiByCdrCode(String cdrCode){
        try {
            Set<String> cdrCodes = ssoManager.getRelatedCdrCodes(cdrCode);
            List<ModelloAutomatico> models = em.createNamedQuery("getModelliAutomaticiByCdrCode", ModelloAutomatico.class)
                    .setParameter("cdrCodes", cdrCodes)
                    .getResultList();

            List<Ufficio> uffici = Ufficio.findAll().list();

            List<ModelloAutomaticoDTO> results = new ArrayList<>();
            for(ModelloAutomatico model : models) {
                ModelloAutomaticoDTO result = ModelloAutomaticoDTO.fromModel(model);
                if (model.getTitolario() != null) {
                    result.hierarchyStringTitolario = titolarioService.buildHierarchyString(titolarioService.getHierarchyForTitolarioId(model.getTitolario().getId()).getTitolario());
                }
                if (model.getCdrCode() != null) {
                    for(Ufficio ufficio : uffici) {
                        if (ufficio.getCdrCode().equalsIgnoreCase(model.getCdrCode())) {
                            result.cdr = ufficio.getCdr();
                        }
                    }
                }
                results.add(result);
            }
            return results;
        }catch (Exception e){
           throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Errore nella selezione del modello automatico");
        }
    }

    @Transactional
    public ModelloAutomaticoDTO createModelloAutomatico(ModelloAutomaticoInputDTO dto) {
        if (dto == null) throw new IllegalArgumentException("DTO non può essere null");

        Titolario titolario = dto.getIdTitolario() != null ? Titolario.findById(dto.getIdTitolario()) : null;
        ModelloAutomatico modello = ModelloAutomatico.builder()
                .nomeModello(dto.getNomeModello())
                .oggettoProtocollo(dto.getOggettoProtocollo())
                .metodoSpedizione(dto.getMetodoSpedizione() != null ? MetodoSpedizione.valueFromStringName(dto.getMetodoSpedizione()) : null)
                .tipoRegistrazione(dto.getTipoRegistrazione() != null ? TipoRegistrazione.valueOfString(dto.getTipoRegistrazione()) : null)
                .cdrCode(dto.getCdrCode())
                .titolario(titolario)
                .build();
        modello.persist();
        return ModelloAutomaticoDTO.fromModel(modello);
    }

    @Transactional
    public ModelloAutomaticoDTO updateModelloAutomatico(Long id, ModelloAutomaticoInputDTO dto) {
        if (id == null || dto == null) {
            throw new IllegalArgumentException("ID e DTO sono obbligatori");
        }

        ModelloAutomatico existing = ModelloAutomatico.findById(id);
        if (existing == null) {
            throw CustomException.get(CustomException.ErrorCode.NOT_FOUND, "ModelloAutomatico non trovato");
        }

        Titolario titolario = dto.getIdTitolario() != null ? Titolario.findById(dto.getIdTitolario()) : null;

        // Aggiorna i campi modificabili
        existing.setNomeModello(dto.getNomeModello());
        existing.setOggettoProtocollo(dto.getOggettoProtocollo());
        existing.setMetodoSpedizione(dto.getMetodoSpedizione() != null ? MetodoSpedizione.valueFromStringName(dto.getMetodoSpedizione()) : null);
        existing.setTipoRegistrazione(dto.getTipoRegistrazione() != null ? TipoRegistrazione.valueOfString(dto.getTipoRegistrazione()) : null);
        existing.setCdrCode(dto.getCdrCode());
        existing.setTitolario(titolario);

        existing.persist();
        return ModelloAutomaticoDTO.fromModel(existing);
    }

    @Transactional
    public void deleteModelloAutomatico(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID obbligatorio");
        }

        ModelloAutomatico existing = ModelloAutomatico.findById(id);
        if (existing == null) {
            throw CustomException.get(CustomException.ErrorCode.NOT_FOUND, "ModelloAutomatico non trovato");
        }

        existing.delete();
    }




    @Transactional
    public void saveModelliAutomaticiFromExcel(String fileBase64){
        byte[] decodedBytes = Base64.decodeBase64(fileBase64);
        InputStream inputStream = new ByteArrayInputStream(decodedBytes);
        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            // Skip the first row (header)
            if (rowIterator.hasNext()) {
                rowIterator.next();
            }

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();

                ModelloAutomatico modelloAutomatico = new ModelloAutomatico();

                for (Cell cell : row) {
                    switch (cell.getColumnIndex()) {
                        case 0:
                            modelloAutomatico.setNomeModello(getCellValue(cell));
                            break;
                        case 1:
                            modelloAutomatico.setOggettoProtocollo(getCellValue(cell));
                            break;
                        case 2:
                            String valueMetodoSpedizione = cell.getStringCellValue();
                            if(valueMetodoSpedizione != null && !valueMetodoSpedizione.isEmpty() && !valueMetodoSpedizione.equalsIgnoreCase("nessuno")){
                                MetodoSpedizione metodoSpedizione;
                                if(valueMetodoSpedizione.equalsIgnoreCase("e-mail") || valueMetodoSpedizione.equalsIgnoreCase("mail")){
                                    metodoSpedizione = MetodoSpedizione.Email;
                                } else if (valueMetodoSpedizione.equalsIgnoreCase("accreditamento web")) {
                                    metodoSpedizione = MetodoSpedizione.AccreditamentoWeb;
                                } else if (valueMetodoSpedizione.equalsIgnoreCase("pec")) {
                                    metodoSpedizione = MetodoSpedizione.Pec;
                                } else if (valueMetodoSpedizione.equalsIgnoreCase("sportello")) {
                                    metodoSpedizione = MetodoSpedizione.Sportello;
                                } else if (valueMetodoSpedizione.equalsIgnoreCase("tracciabilità")) {
                                    metodoSpedizione = MetodoSpedizione.Tracciabilita;
                                } else if (valueMetodoSpedizione.equalsIgnoreCase("a mano")) {
                                    metodoSpedizione = MetodoSpedizione.AMano;
                                } else if (valueMetodoSpedizione.equalsIgnoreCase("raccomandata")){
                                    metodoSpedizione = MetodoSpedizione.Raccomandata;
                                } else {
                                    metodoSpedizione = MetodoSpedizione.valueOfString(valueMetodoSpedizione);
                                }

                                if(metodoSpedizione != null){
                                    modelloAutomatico.setMetodoSpedizione(metodoSpedizione);
                                }
                            }
                            break;
                        case 3:
                            String valueTipoRegistrazione = getCellValue(cell);
                            if(valueTipoRegistrazione != null && !valueTipoRegistrazione.isEmpty()) {
                                TipoRegistrazione tipoRegistrazione;
                                if(valueTipoRegistrazione.equalsIgnoreCase("Entrata")){
                                    tipoRegistrazione = TipoRegistrazione.Entrata;
                                } else if (valueTipoRegistrazione.equalsIgnoreCase("Uscita")) {
                                    tipoRegistrazione = TipoRegistrazione.Uscita;
                                } else if (valueTipoRegistrazione.equalsIgnoreCase("Interno")) {
                                    tipoRegistrazione = TipoRegistrazione.Interno;
                                } else if (valueTipoRegistrazione.equalsIgnoreCase("Circolare")) {
                                    tipoRegistrazione = TipoRegistrazione.Circolare;
                                }else {
                                    tipoRegistrazione = TipoRegistrazione.valueOfString(valueTipoRegistrazione);
                                }

                                if(tipoRegistrazione != null){
                                    modelloAutomatico.setTipoRegistrazione(tipoRegistrazione);
                                }
                            }
                            break;
                        case 4:
                            String cdrCode = getCellValue(cell);
                            if(cdrCode != null && !cdrCode.isEmpty() && !cdrCode.equalsIgnoreCase("TUTTI")) {
                                modelloAutomatico.setCdrCode(getCellValue(cell));
                            }
                            break;
                        default:
                            break;
                    }
                }
                modelloAutomatico.persist();
            }
        } catch (IOException e) {
            throw CustomException.get(CustomException.ErrorCode.INTERNAL, "Import error");
        }
    }

    private String getCellValue(Cell cell) {
        String value;
        try {
            switch (cell.getCellType()) {
                case STRING:
                    value = cell.getStringCellValue().trim();
                    break;
                case NUMERIC:
                    double cellValue = cell.getNumericCellValue();
                    if (cellValue > 1e10 || cellValue < -1e10) {
                        value = BigDecimal.valueOf(cellValue).toPlainString();
                    } else if (cellValue % 1 == 0) {
                        value = String.valueOf((long) cellValue);
                    }else {
                        value = String.valueOf(cellValue);
                    }
                    break;
                case BOOLEAN:
                    value = String.valueOf(cell.getBooleanCellValue()).trim();
                    break;
                case FORMULA:
                    value = cell.getCellFormula().trim();
                    break;
                case BLANK:
                    value = "";
                    break;
                default:
                    value = null;
                    break;
            }

        } catch (Exception e) {
            CustomException.get(CustomException.ErrorCode.INTERNAL, String.format("Errore nella lettura del campo %s, Error message:", e.getMessage())).boom();
            return null;
        }

        return value;
    }

    private int getPagesCount(long count, double size){
        return (int) Math.ceil(count == 0 ? 0 : count / size);
    }
}
