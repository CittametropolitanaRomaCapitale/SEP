INSERT INTO public.email_templates
(id, tipologia, operazione, oggetto, corpo)
VALUES(2, 'notifica', 'assegnazione', 'Nuova richiesta di lavorazione - {{numero}}', '<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .header {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.5;
        }
        .link {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .signature {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">{{headerCorpo}}</div>
        <div class="content">
            <p>Gentile {{cognomeUtenteTO}} {{nomeUtenteTO}},</p>
            <p>Le viene richiesta una lavorazione su <a href="{{link}}" class="link">{{numero}}</a> da parte di {{nomeUtenteOperation}} in data {{data}}.</p>
            <p><strong>Obiettivo di lavorazione:</strong> {{obiettivoLavorazione}}</p>
            <p><strong>Oggetto:</strong> {{oggetto}}</p>
        </div>
        <div class="signature">
            <p>Cordiali saluti</p>
        </div>
    </div>
</body>
</html>
');
INSERT INTO public.email_templates
(id, tipologia, operazione, oggetto, corpo)
VALUES(5, 'notifica', 'richiestaAnnullamento', 'Richiesta di annullamento - {{numero}}', '<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .header {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.5;
        }
        .link {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .signature {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">{{headerCorpo}}</div>
        <div class="content">
            <p>Gentile {{cognomeUtenteTO}} {{nomeUtenteTO}},</p>
            <p>Le viene <b>richiesto l''annullamento</b> di <a href="{{link}}" class="link">{{numero}}</a> da parte dell''utente {{nomeUtenteOperation}} in data {{data}}.</p>
            <p><strong>Note:</strong> {{motivo}}</p>
        </div>
        <div class="signature">
            <p>Cordiali saluti</p>
        </div>
    </div>
</body>
</html>
');
INSERT INTO public.email_templates
(id, tipologia, operazione, oggetto, corpo)
VALUES(7, 'notifica', 'assegnazioneAutomatica', 'Nuova richiesta di lavorazione - {{numero}}', '<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .header {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.5;
        }
        .link {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .signature {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">{{headerCorpo}}</div>
        <div class="content">
            <p>Gentile {{cognomeUtenteTO}} {{nomeUtenteTO}},</p>
            <p>Le viene richiesta una lavorazione su <a href="{{link}}" class="link">{{numero}}</a> da parte del sistema in data {{data}}.</p>
            <p><strong>Obiettivo di lavorazione:</strong> {{obiettivoLavorazione}}</p>
            <p><strong>Oggetto:</strong> {{oggetto}}</p>
        </div>
        <div class="signature">
            <p>Cordiali saluti</p>
        </div>
    </div>
</body>
</html>
');
INSERT INTO public.email_templates
(id, tipologia, operazione, oggetto, corpo)
VALUES(3, 'notifica', 'presaInCarico', 'Presa in carico - {{numero}}', '<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .header {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.5;
        }
        .link {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .signature {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">{{headerCorpo}}</div>
        <div class="content">
            <p>Gentile {{cognomeUtenteTO}} {{nomeUtenteTO}},</p>
            <p>Si notifica la <b>presa in carico</b> di <a href="{{link}}" class="link">{{numero}}</a> da parte dell''utente {{nomeUtenteOperation}} in data {{data}}.</p>
        </div>
        <div class="signature">
            <p>Cordiali saluti</p>
        </div>
    </div>
</body>
</html>
');
INSERT INTO public.email_templates
(id, tipologia, operazione, oggetto, corpo)
VALUES(1, 'notifica', 'rifiuto', 'Rifiuto - {{numero}}', '<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .header {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.5;
        }
        .link {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .signature {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">{{headerCorpo}}</div>
        <div class="content">
            <p>Gentile {{cognomeUtenteTO}} {{nomeUtenteTO}},</p>
            <p>Si notifica il <b>rifiuto</b> di <a href="{{link}}" class="link">{{numero}}</a> da parte dell''utente {{nomeUtenteOperation}} in data {{data}}.</p>
            <p><strong>Note:</strong> {{motivo}}</p>
        </div>
        <div class="signature">
            <p>Cordiali saluti</p>
        </div>
    </div>
</body>
</html>
');
INSERT INTO public.email_templates
(id, tipologia, operazione, oggetto, corpo)
VALUES(4, 'notifica', 'annullamento', 'Annullamento - {{numero}}', '<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .header {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.5;
        }
        .link {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .signature {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">{{headerCorpo}}</div>
        <div class="content">
            <p>Gentile {{cognomeUtenteTO}} {{nomeUtenteTO}},</p>
            <p>Si notifica l''<b>annullamento</b> di <a href="{{link}}" class="link">{{numero}}</a> da parte dell''utente {{nomeUtenteOperation}} in data {{data}}.</p>
            <p><strong>Note:</strong> {{nota}}</p>
        </div>
        <div class="signature">
            <p>Cordiali saluti</p>
        </div>
    </div>
</body>
</html>
');
INSERT INTO public.email_templates
(id, tipologia, operazione, oggetto, corpo)
VALUES(8, 'notifica', 'rifiutoAnnullamento', 'Rifiuto richiesta di annullamento - {{numero}}', '<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .header {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.5;
        }
        .link {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .signature {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">{{headerCorpo}}</div>
        <div class="content">
            <p>Gentile {{cognomeUtenteTO}} {{nomeUtenteTO}},</p>
            <p>Si informa che la sua richiesta di annullamento relativa a <a href="{{link}}" class="link">{{numero}}</a> è stata <b>rifiutata</b> da parte dell''utente {{nomeUtenteOperation}} in data {{data}}.</p>
            <p><strong>Note:</strong> {{nota}}</p>
        </div>
        <div class="signature">
            <p>Cordiali saluti</p>
        </div>
    </div>
</body>
</html>
');
INSERT INTO public.email_templates
(id, tipologia, operazione, oggetto, corpo)
VALUES(6, 'notifica', 'erroreGenerazioneRegistroGiornaliero', 'Errore generazione registro giornaliero', '<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .header {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.5;
        }
        .link {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .signature {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">{{headerCorpo}}</div>
        <div class="content">
            <p>Gentile {{cognomeUtenteTO}} {{nomeUtenteTO}},</p>
            <p>Si informa che il sistema non è riuscito a generare correttamente il registro giornaliero in data {{data}}.
        </div>
        <div class="signature">
            <p>Cordiali saluti</p>
        </div>
    </div>
</body>
</html>
');
INSERT INTO public.email_templates
(id, tipologia, operazione, oggetto, corpo)
VALUES(9, 'notifica', 'erroreInvioPecPeo', 'Errore Invio PEC/PEO - {{numero}}', '<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .header {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.5;
        }
        .link {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .signature {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">{{headerCorpo}}</div>
        <div class="content">
            <p>Gentile {{cognomeUtenteTO}} {{nomeUtenteTO}},</p>
            <p>In data {{data}}, si notifica un errore di invio della mail PEC/PEO in riferimento a <a href="{{link}}" class="link">{{numero}}</a>, avente come oggetto: {{oggetto}}.</p>
            <p>Causa errore: {{msgErrore}}</p>
        </div>
        <div class="signature">
            <p>Cordiali saluti</p>
        </div>
    </div>
</body>
</html>
');
INSERT INTO public.email_templates
(id, tipologia, operazione, oggetto, corpo)
VALUES(10, 'notifica', 'revoca', 'Revoca assegnazione - {{numero}}', '<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .header {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.5;
        }
        .link {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .signature {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">{{headerCorpo}}</div>
        <div class="content">
            <p>Gentile {{cognomeUtenteTO}} {{nomeUtenteTO}},</p>
            <p>{{nomeUtenteOperation}} le ha revocato il compito precedentemente assegnato per il protocollo {{numero}} avente il seguente oggetto:</p>
            <p>{{oggetto}}</p>
        </div>
        <div class="signature">
            <p>Cordiali saluti</p>
        </div>
    </div>
</body>
</html>
');


INSERT INTO public.email_templates
(id, tipologia, operazione, oggetto, corpo)
VALUES(12, 'notifica', 'protocollazioneAutomatica', 'Risposta automatica di protocollazione - {{numero}}', 'RISPOSTA AUTOMATICA DI PROTOCOLLAZIONE
La sua richiesta, avente come oggetto "{{oggetto}}", è stata protocollata con n. {{numero}} in data {{data}}.

Cordiali saluti
');

INSERT INTO public.email_templates
(id, tipologia, operazione, oggetto, corpo)
VALUES(13, 'notifica', 'regolaPecNonValida', 'Regola PEC non valida - {{regola}}', '<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .header {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.5;
        }
        .link {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .signature {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">{{headerCorpo}}</div>
        <div class="content">
            <p>Gentile amministratore,</p>
            <p>la casella PEC {{emailAddress}} ha violato la regola in oggetto in data: {{data}}</p>
        </div>
        <div class="signature">
            <p>Cordiali saluti</p>
        </div>
    </div>
</body>
</html>
');