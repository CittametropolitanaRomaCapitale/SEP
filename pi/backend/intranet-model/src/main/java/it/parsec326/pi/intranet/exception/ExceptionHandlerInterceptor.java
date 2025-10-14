package it.parsec326.pi.intranet.exception;

import jakarta.annotation.Priority;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;

@Interceptor
@ExceptionChecked
@Priority(Interceptor.Priority.APPLICATION)
@Slf4j
public class ExceptionHandlerInterceptor implements Serializable {


    @AroundInvoke
    public Object beforeInvokation(InvocationContext invocationContext) {
        try {
            return invocationContext.proceed();
        } catch (CustomException e){
            e.boom();
            return null;
        } catch (Exception e){
            log.error("Intercettato un errore interno alla chiamata della classe {} metodo {}", invocationContext.getTarget().getClass().getSimpleName(), invocationContext.getMethod().getName());
            CustomException.get(CustomException.ErrorCode.INTERNAL, e).boom();
            return null;
        }
    }


}
