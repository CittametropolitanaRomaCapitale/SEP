package it.cmrc.sso.provider;

import org.apache.http.conn.ssl.SSLSocketFactory;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;

import javax.enterprise.context.ApplicationScoped;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

public class KeycloakProvider {


    @ConfigProperty(name = "keycloak.url")
    String keycloakUrl;

    @ConfigProperty(name = "keycloak.realm")
    String keycloakrealm;

    @ConfigProperty(name = "keycloak.client")
    String keycloakClient;

    @ConfigProperty(name = "keycloak.secret")
    String keycloakSecret;


    @ApplicationScoped
    public RealmResource provide() throws NoSuchAlgorithmException, KeyStoreException, KeyManagementException {


        SSLContext ctx = SSLContext.getInstance("TLS");
        X509TrustManager tm = new X509TrustManager() {

            public void checkClientTrusted(X509Certificate[] xcs, String string) throws CertificateException {
            }

            public void checkServerTrusted(X509Certificate[] xcs, String string) throws CertificateException {
            }

            public X509Certificate[] getAcceptedIssuers() {
                return null;
            }
        };
        ctx.init(null, new TrustManager[]{tm}, null);

        Keycloak keycloak = KeycloakBuilder.builder()
                .resteasyClient((ResteasyClient) ResteasyClientBuilder.newBuilder().sslContext(ctx).hostnameVerifier(SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER).build())
                .serverUrl(keycloakUrl)
                .realm(keycloakrealm)
                .clientId(keycloakClient)
                .clientSecret(keycloakSecret)
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                .build();
        return keycloak.realm(keycloakrealm);
    }
}