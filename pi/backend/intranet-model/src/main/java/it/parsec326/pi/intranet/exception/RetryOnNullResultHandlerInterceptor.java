package it.parsec326.pi.intranet.exception;

import jakarta.annotation.Priority;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;

@Interceptor
@RetryOnNullResult
@Priority(Interceptor.Priority.APPLICATION)
@Slf4j
public class RetryOnNullResultHandlerInterceptor implements Serializable {


    @AroundInvoke
    public Object beforeInvokation(InvocationContext invocationContext) throws Exception {
        try {
            int cont = 5;
            Object result = invocationContext.proceed();
            while (result == null && --cont > 0) {
                log.error("[Tentativo {}] La chiamata della classe {} metodo {} ha restituito null", (5 - cont), invocationContext.getTarget().getClass().getSimpleName(), invocationContext.getMethod().getName());
                result = invocationContext.proceed();
            }
            log.info("[Tentativi esauriti] La chiamata della classe {} metodo {} ha restituito {}", invocationContext.getTarget().getClass().getSimpleName(), invocationContext.getMethod().getName(), result);
            return result;
        }catch (Exception e){
            e.printStackTrace();
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }

    }
}
