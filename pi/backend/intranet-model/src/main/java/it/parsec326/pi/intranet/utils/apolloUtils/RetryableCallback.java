package it.parsec326.pi.intranet.utils.apolloUtils;

import com.apollographql.apollo.ApolloCall;
import com.apollographql.apollo.api.Response;
import com.apollographql.apollo.exception.ApolloException;
import it.parsec326.pi.intranet.exception.RetryOnNullResult;
import org.jetbrains.annotations.NotNull;

import java.util.concurrent.CompletableFuture;

public class RetryableCallback<T> extends ApolloCall.Callback<T> {
    private final CompletableFuture<Response<T>> completableFuture;

    public RetryableCallback(CompletableFuture<Response<T>> completableFuture) {
        this.completableFuture = completableFuture;
    }

    @Override
    public void onResponse(@NotNull Response<T> response) {
        completableFuture.complete(response);
    }

    @RetryOnNullResult
    @Override
    public void onFailure(@NotNull ApolloException e) {
        if (e.getCause() instanceof NullPointerException) {
            completableFuture.completeExceptionally(new IllegalArgumentException("ApolloCall cannot be null"));
        } else {
            completableFuture.completeExceptionally(e);
        }
    }
}
