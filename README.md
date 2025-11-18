# SEP - DEVELOP
Smart E-governament Platform

## Architettura

Il sistema distribuito è composto da una serie di moduli interconnessi fra loro secondo un'architettura a microservizi, da pubblicare in ambienti distribuiti, preferibilmente su cluster Kubernetes.

I moduli che compongono il sistema sono:

 - **SSO**: sistema di single sign on che permette di gestire le autorizzazioni degli utenti

 - **Protocollo Informatico**: sistema di gestione dei protocolli informatici

 - **Keycloak** (https://www.keycloak.org): dipendenza esterna per la gestione dell'autenticazione degli utenti

 - **MinIO** (https://www.min.io): dipendenza esterna per la gestione dello storage

 - **PostgreSQL** (https://www.postgresql.org): database relazionale per l'immagazzinamento dei dati 

## Contenuti

- **pi**
	- **backend**: directory contenente il codice sorgente del servizio web, scritto in Java su framework Quarkus
	- **screenshot**: una serie di screen esemplificativi della UI del protocollo

- **sso**
	- **backend**: directory contenente il codice sorgente del servizio web di SSO, scritto in Java su framework Quarkus
	- **screenshot**: una serie di screen esemplificativi della UI di SSO

- **ui**: codice sorgente multiprogetto dei front-end degli applicativi PI e SSO, scritti in Typescript con framework Next.js
