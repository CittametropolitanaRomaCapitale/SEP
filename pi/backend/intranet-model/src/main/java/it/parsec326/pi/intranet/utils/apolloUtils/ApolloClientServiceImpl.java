package it.parsec326.pi.intranet.utils.apolloUtils;

import com.apollographql.apollo.ApolloCall;
import com.apollographql.apollo.api.Response;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.concurrent.CompletableFuture;

@ApplicationScoped
public class ApolloClientServiceImpl implements ApolloClientService {
    @Override
    public <T> CompletableFuture<Response<T>> toCompletableFuture(ApolloCall<T> apolloCall) {
        if (apolloCall == null) {
            throw new IllegalArgumentException("ApolloCall cannot be null");
        }

        CompletableFuture<Response<T>> completableFuture = new CompletableFuture<>();
        completableFuture.whenComplete((tResponse, throwable) -> {
            if (completableFuture.isCancelled()) {
                completableFuture.cancel(true);
            }
        });

        apolloCall.enqueue(new RetryableCallback<>(completableFuture));
        return completableFuture;
    }
}

