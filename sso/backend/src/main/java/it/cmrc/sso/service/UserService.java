package it.cmrc.sso.service;

import it.cmrc.sso.entity.OfficeHistory;
import it.cmrc.sso.entity.UserHistory;
import it.cmrc.sso.entity.UserOffice;
import it.cmrc.sso.entity.common.RecordState;
import it.cmrc.sso.entity.common.RecordType;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;
import java.util.UUID;

@ApplicationScoped
public class UserService {

    public String getCdrFromKeycloakDepartment(String kcCdrName) {
        if (kcCdrName == null) return null;

        String lowerKcCdr = kcCdrName.toLowerCase();

        switch (lowerKcCdr) {
            case "pensionati" : return "P00000";
            case "hub 2 - it0001 - impianti termici" : return "IT0001";
            case "avvocatura": return "AVV0000";
            case "avvocatura - direzione amministrativa": return "AVV0001";
            case "hub 3 - dip 01 - dir - edilizia scolastica": return "DPT0100";
            case "hub 3 - dip 01 - serv 1 - edilizia scolastica zona est": return "DPT0101";
            case "hub 3 - dip 01 - serv 2 - edilizia scolastica zona sud": return "DPT0102";
            case "hub 3 - dip 01 - serv 3 - edilizia scolastica zona nord": return "DPT0103";
            case "hub 2 - dip 02 - dir - viabilità e mobilità": return "DPT0200";
            case "hub 2 - dip 02 - serv 1 - viabilità - gestione amministrativa": return "DPT0201";
            case "hub 2 - dip 02 - serv 2 - viabilità zona nord": return "DPT0202";
            case "hub 2 - dip 02 - serv 3 - viabilità zona sud": return "DPT0203";
            case "hub 2 - dip 02 - serv 4 - autoriz mobilità privata e trasporti": return "DPT0204";
            case "hub 2 - dip 03 - dir - ambiente e tutela del territorio": return "DPT0300";
            case "hub 2 - dip 03 - serv 1 - gestione rifiuti, raccolta diff.ta": return "DPT0301";
            case "hub 2 - dip 03 - serv 2 - tutela risorse idriche, aria, energia": return "DPT0302";
            case "hub 2 - dip 11 - serv 1 - aree protette - tutela biodiversità": return "DPT1101";
            case "hub 2 - dip 04 - dir - pianificaz strategica, governo territorio": return "DPT0400";
            case "hub 2 - dip 04 - serv 1 - urbanistica e attuazione ptmg": return "DPT0401";
            case "hub 1 - dip 06 - dir - transizione digitale": return "DPT0600";
            case "hub 1 - dip 06 - serv 1 - reti e sistemi informatici": return "DPT0601";
            case "hub 3 - dip 07 - dir - pnrr formazione professionale": return "DPT0700";
            case "hub 3 - dip 07 - serv 1 - servizi formazione professionale": return "DPT0701";
            case "hub 1 - dip 08 - dir - risorse strumentali, manutenz patrimonio": return "DPT0800";
            case "hub 1 - dip 08 - serv 1 - provveditorato ed economato": return "DPT0801";
            case "hub 1 - dip 08 - serv 2 - manutenzioni patrimoniali": return "DPT0802";
            case "hub 1 - dip 09 - dir - risorse umane": return "DPT0900";
            case "hub 1 - dip 09 - serv 1 - trattamento giuridico ed economico": return "DPT0901";
            case "hub 1 - dip 10 - dir - ragioneria generale": return "DPT1000";
            case "hub 1 - dip 10 - serv 1 - rendiconto e controllo spesa": return "DPT1001";
            case "hub 1 - dip 10 - serv 2 - entrate - finanza, gestione debito": return "DPT1002";
            case "hub 2 - dip 11 - dir - difesa del suolo e aree protette": return "DPT1100";
            case "hub 2 - dip 11 - serv 2 - opere idrauliche e di bonifica - rischi idraulici": return "DPT1102";
            case "direz generale - serv 1 - contr strategico/gestione - statistica": return "GEN0001";
            case "hub 1 - dip 05 - dir - appalti e contratti": return "DPT0500";
            case "hub 1 - dip 05 - serv 1 - stazione unica appaltante": return "DPT0501";
            case "capo di gabinetto": return "SUP0000"; //NOTA: dirottamento da CAPOGAB a SUP0000
            case "hub 1 - armonia gestionale e innovazione": return "HUB0100";
            case "hub 2 - sostenibilità territoriale": return "HUB0200";
            case "hub 3 - officina del futuro": return "HUB0300";
            case "comandati": return "COMANDATI";
            case "polizia metropolitana": return "POL0000";
            case "polizia metropolitana - supporto amministrativo": return "POL0001";
            case "supporto al segretario generale": return "SEG0000";
            case "difensore civico": return "DIFCIV";
            case "segretario generale - serv 1 - supporto consiglio metropolitano": return "SEG0001";
            case "supporto al sindaco metropolitano": return "SUP0000";
            case "supporto al sindaco - serv 1 - urp - comunicazione": return "SUP0001";
            case "supporto al sindaco - serv 2 - svil socio-cult.le - cerimoniale": return "SUP0002";

            //vecchie nomenclature (pre riorganizzazione 01/03/2025) mappate a CDR post riorganizzazione 01/03/2025
            case "dip 1 - direzione": return "DPT0100";
            case "dip 1 - serv 1":
            case "dip 1 - serv.1": return "DPT0101";
            case "dip 1 - serv 2":
            case "dip 1 - serv.2": return "DPT0102";
            case "dip 1 - serv 3":
            case "dip 1 - serv.3": return "DPT0103";
            case "dip 2 - direzione": return "DPT0200";
            case "dip 2 - serv 1":
            case "dip 2 - serv.1": return "DPT0201";
            case "dip 2 - serv 2":
            case "dip 2 - serv.2": return "DPT0202";
            case "dip 2 - serv 3":
            case "dip 2 - serv.3": return "DPT0203";
            case "dip 2 - serv 4":
            case "dip 2 - serv.4": return "DPT0204";
            case "dip 3 - direzione": return "DPT0300";
            case "dip 3 - serv 1":
            case "dip 3 - serv.1": return "DPT0301";
            case "dip 3 - serv 2":
            case "dip 3 - serv.2": return "DPT0302";
            case "dip 3 - serv 3":
            case "dip 3 - serv.3": return "DPT1101";
            case "dip 5 - direzione": return "DPT0500";
            case "dip 5 - serv 1":
            case "dip 5 - serv.1": return "DPT0501";
            case "dip 6 - direzione": return "DPT0600";
            case "dip 6 - serv 1":
            case "dip 6 - serv.1": return "DPT0601";
            case "dip 7 - direzione": return "DPT0700";
            case "dip 7 - serv 1":
            case "dip 7 - serv.1": return "DPT0701";
            case "dir gen - serv 1": return "GEN0001";
            case "dip 4 - direzione": return "DPT0400";
            case "dip 4 - serv 1":
            case "dip 4 - serv.1": return "DPT0401";
            case "dip 4 - serv 2":
            case "dip 4 - serv.2": return "DPT1100";
            case "dip 4 - serv 3":
            case "dip 4 - serv.3": return "DPT1102";
            case "polizia metropolitana - comando": return "POL0000";
            case "polizia metropolitana - serv 1": return "POL0000";
            case "polizia metropolitana - serv 2": return "POL0001";
            case "rag gen - direzione": return "DPT1000";
            case "rag gen - serv 1": return "DPT1001";
            case "rag gen - serv 2": return "DPT1002";
            case "uc 2 - direzione": return "DPT0800";
            case "uc 2 - serv 1":
            case "uc 2 - serv.1": return "DPT0801";
            case "uc 2 - serv 2":
            case "uc 2 - serv.2": return "DPT0802";
            case "uc 1 - direzione": return "DPT0900";
            case "uc 1 - serv 1":
            case "uc 1 - serv.1": return "DPT0901";
            case "uc 1 - serv 2":
            case "uc 1 - serv.2": return "DPT0901";
            case "seg gen - direzione": return "SEG0000";
            case "seg gen - serv 1": return "SEG0001";
            case "ue - supporto al sindaco metropolit": return "SUP0000";
            case "supp sindaco metropolitano - serv 1": return "SUP0001";
            case "supp sindaco metropolitano - serv 2": return "SUP0002";
            case "polizia giudiziaria": return "POLGIUD";

            default: return null;
        }
    }
    public String getCdrFromKeylcoakCdr(String kcCdr) {
        if (kcCdr == null) return null;

        String lowerKcCdr = kcCdr.toLowerCase();

        switch (lowerKcCdr) {
            case "p00000" : return "P00000";
            case "avc000": return "AVV0000";
            case "avc001": return "AVV0001";
            case "avc002": return "AVV0001";
            case "d01000": return "DPT0100";
            case "d01100": return "DPT0101";
            case "d01200": return "DPT0102";
            case "d01300": return "DPT0103";
            case "d02000": return "DPT0200";
            case "d02100": return "DPT0201";
            case "d02200": return "DPT0202";
            case "d02201": return "DPT0202";
            case "d02202": return "DPT0202";
            case "d02203": return "DPT0202";
            case "d02204": return "DPT0202";
            case "d02300": return "DPT0203";
            case "d02305": return "DPT0203";
            case "d02306": return "DPT0203";
            case "d02307": return "DPT0203";
            case "d02308": return "DPT0203";
            case "d02400": return "DPT0204";
            case "d03000": return "DPT0300";
            case "d03100": return "DPT0301";
            case "d03200": return "DPT0302";
            case "d03300": return "DPT1101";
            case "d04000": return "DPT0400";
            case "d04100": return "DPT0401";
            case "d06000": return "DPT0600";
            case "d06100": return "DPT0601";
            case "d07000": return "DPT0700";
            case "d07100": return "DPT0701";
            case "d07101": return "DPT0701";
            case "d07102": return "DPT0701";
            case "d07103": return "DPT0701";
            case "d07104": return "DPT0701";
            case "d07105": return "DPT0701";
            case "d07106": return "DPT0701";
            case "d08000": return "DPT0800";
            case "d08100": return "DPT0801";
            case "d08200": return "DPT0802";
            case "d09000": return "DPT0900";
            case "d09100": return "DPT0901";
            case "d10000": return "DPT1000";
            case "d10100": return "DPT1001";
            case "d10200": return "DPT1002";
            case "d11000": return "DPT1100";
            case "d11100": return "DPT1101";
            case "d11200": return "DPT1102";
            case "dgg100": return "GEN0001";
            case "dp5000": return "DPT0500";
            case "dp5001": return "DPT0500";
            case "dp5002": return "DPT0500";
            case "dp5100": return "DPT0501";
            case "gbp000": return "SUP0000"; //NOTA: dirottamento da CAPOGAB a SUP0000
            case "hub100": return "HUB0100";
            case "hub200": return "HUB0200";
            case "hub300": return "HUB0300";
            case "l01": return "COMANDATI";
            case "o4a400": return "DPT0300";
            case "o4a500": return "DPT1101";
            case "o7a200": return "DPT0202";
            case "plm000": return "POL0000";
            case "plm001": return "POL0000";
            case "plm002": return "POL0000";
            case "plm003": return "POL0000";
            case "plm004": return "POL0000";
            case "plm005": return "POL0000";
            case "plm006": return "POL0000";
            case "plm007": return "POL0000";
            case "plm008": return "POL0000";
            case "plm009": return "POL0000";
            case "plm011": return "POL0000";
            case "plm100": return "POL0001";
            case "plm101": return "POL0001";
            case "sgg000": return "SEG0000";
            case "sgg004": return "DIFCIV";
            case "sgg100": return "SEG0001";
            case "sgg109": return "SEG0001";
            case "sgg110": return "SEG0001";
            case "sgg111": return "SEG0001";
            case "sgg112": return "SEG0001";
            case "sgg114": return "SEG0001";
            case "sgg115": return "SEG0001";
            case "sgg116": return "SEG0001";
            case "sgg117": return "SEG0001";
            case "sgg118": return "SEG0001";
            case "sgg119": return "SEG0001";
            case "sgg122": return "SEG0001";
            case "sgg123": return "SEG0001";
            case "ssm000": return "SUP0000";
            case "ssm001": return "SUP0000";
            case "ssm002": return "SUP0000";
            case "ssm100": return "SUP0001";
            case "ssm200": return "SUP0002";
            default: return null;
        }
    }

    @Transactional
    public UserOffice addUserToOffice(Long userId, Long officeId) {
        UserOffice userOffice = new UserOffice();
        userOffice.setOffice_id(officeId);
        userOffice.setUser_id(userId);
        userOffice.persistAndFlush();

        String uuid = UUID.randomUUID().toString();

        UserHistory userHistory = new UserHistory();
        userHistory.record_type = RecordType.OFFICE;
        userHistory.correlation = uuid;
        userHistory.office_id = officeId;
        userHistory.user_id = userId;
        userHistory.state = RecordState.IN;
        userHistory.persistAndFlush();

        OfficeHistory officeHistory = new OfficeHistory();
        officeHistory.record_type = RecordType.OFFICE;
        officeHistory.correlation = uuid;
        officeHistory.office_id = officeId;
        officeHistory.user_id = userId;
        officeHistory.state = RecordState.IN;
        officeHistory.persistAndFlush();

        return userOffice;
    }
}
