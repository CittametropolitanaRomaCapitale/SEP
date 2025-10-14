package it.cmrc.sso.service;

import it.cmrc.sso.entity.*;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import javax.enterprise.context.ApplicationScoped;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class DocumentService {

    public ByteArrayOutputStream generateExcelFromUsers(List<User> users, Long applicationId, List<Long> roles, List<String> types, List<Long> officeIds) throws IOException {
        Workbook workbook = new HSSFWorkbook(); // formato .xls
        Sheet sheet = workbook.createSheet("Utenti");

        // Imposta intestazioni
        String[] headers = {"Username", "Nome", "Cognome", "Email", "Abilitato", "Note", "Ufficio", "Ruolo", "Tipo", "Data assegnazione"};
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }

        // Imposta larghezze fisse
        sheet.setColumnWidth(0, 20 * 256); // Username
        sheet.setColumnWidth(1, 20 * 256); // Nome
        sheet.setColumnWidth(2, 20 * 256); // Cognome
        sheet.setColumnWidth(3, 30 * 256); // Email
        sheet.setColumnWidth(4, 10 * 256); // Abilitato
        sheet.setColumnWidth(5, 30 * 256); // Note
        sheet.setColumnWidth(6, 15 * 256); // Nome ufficio
        sheet.setColumnWidth(7, 15 * 256); // Ruolo
        sheet.setColumnWidth(8, 15 * 256); // Tipo
        sheet.setColumnWidth(9, 25 * 256); // Data assegnazione


        List<String[]> rowsToWrite = new ArrayList<>();

        for (User user : users) {
            List<UserOffice> suos = applicationId != null ? user.getStoricUserOffices(applicationId) : user.getStoricUserOffices();
            for(UserOffice uo : suos) {
                if (uo.isDeleted()) {
                    continue;
                }
                if (officeIds != null && !officeIds.isEmpty() && !officeIds.contains(uo.office_id)) {
                    continue;
                }

                List<Permit> urs = applicationId != null ? uo.getUserOfficeRoles(applicationId) : uo.getUserOfficeRoles();
                for(Permit ur : urs) {
                    if (officeIds != null && !officeIds.isEmpty() && !officeIds.contains(ur.office_id)) {
                        continue;
                    }
                    if (roles != null && !roles.isEmpty() && !roles.contains(ur.role_id)) {
                        continue;
                    }
                    if (types != null && !types.isEmpty() && !types.contains(ur.type.toString())) {
                        continue;
                    }

                    Map<String, Object> params = new HashMap<>();
                    params.put("uid", ur.user_id);
                    params.put("oid", ur.office_id);
                    params.put("rid", ur.role_id);
                    UserHistory oh = (UserHistory)UserHistory.find("user_id = :uid and office_id = :oid and role_id = :rid", params).firstResultOptional().orElse(null);


                    String[] rowToWrite = new String[10];
                    rowToWrite[0] = nonNull(user.getUsername());
                    rowToWrite[1] = nonNull(user.getFirstName());
                    rowToWrite[2] = nonNull(user.getLastName());
                    rowToWrite[3] = nonNull(user.getEmail());
                    rowToWrite[4] = user.getEnabled() == null || user.getEnabled() ? "Sì" : "No";
                    rowToWrite[5] = nonNull(user.getNote());
                    rowToWrite[6] = nonNull(uo.getOfficeById().name);
                    rowToWrite[7] = nonNull(ur.getRole().name);
                    rowToWrite[8] = nonNull(ur.type.toString());
                    rowToWrite[9] = oh != null ? oh.created_at.toString() : "";

                    rowsToWrite.add(rowToWrite);
                }
            }
        }

        int rowNum = 1;
        for(String[] rowToWrite : rowsToWrite) {
            Row row = sheet.createRow(rowNum++);
            for(int i=0;i<rowToWrite.length;i++) {
                row.createCell(i).setCellValue(rowToWrite[i]);
            }
        }

        // Scrive su stream
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return outputStream;
    }

    private String nonNull(String value) {
        return value != null ? value : "";
    }
}

