# Intranet-model

Questo modulo di pi-backend centralizza il modello del sistema back-end. Gestisce la classi model/entity, i transfer object e logiche di business condivise tra microservizi. 

La struttura del progetto è la seguente:
- it.parsec...., contenente la logica di business condivisa tra diversi microservizi;
- dto, contenente le classi transfer object utili al back-end
- model, contenente le classi entity per mappare le tabella della base dati.

In assenza di un repository artifactory custom per il conaf, per poter condividere questa libreria è necessario installarla nel repository locale. 

Apri il terminale nella root del modulo
Installa il jar

```mvn clean install```

Installa il jar nel repository

---

# DOCUMENTAZIONE ORIGINALE - intranet-model Project

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: https://quarkus.io/ .

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:
```shell script
./mvnw compile quarkus:dev
```

> **_NOTE:_**  Quarkus now ships with a Dev UI, which is available in dev mode only at http://localhost:8080/q/dev/.

## Packaging and running the application

The application can be packaged using:
```shell script
./mvnw package
```
It produces the `quarkus-run.jar` file in the `target/quarkus-app/` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/quarkus-app/lib/` directory.

The application is now runnable using `java -jar target/quarkus-app/quarkus-run.jar`.

If you want to build an _über-jar_, execute the following command:
```shell script
./mvnw package -Dquarkus.package.type=uber-jar
```

The application, packaged as an _über-jar_, is now runnable using `java -jar target/*-runner.jar`.

## Creating a native executable

You can create a native executable using: 
```shell script
./mvnw package -Pnative
```

Or, if you don't have GraalVM installed, you can run the native executable build in a container using: 
```shell script
./mvnw package -Pnative -Dquarkus.native.container-build=true
```

You can then execute your native executable with: `./target/intranet-model-1.0.0-SNAPSHOT-runner`

If you want to learn more about building native executables, please consult https://quarkus.io/guides/maven-tooling.
