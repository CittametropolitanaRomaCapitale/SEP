package it.parsec326.pi.intranet.utils.apolloUtils;

import com.apollographql.apollo.ApolloCall;
import com.apollographql.apollo.api.Response;

import java.util.concurrent.CompletableFuture;

public interface ApolloClientService {
    <T> CompletableFuture<Response<T>> toCompletableFuture(ApolloCall<T> apolloCall);
}
