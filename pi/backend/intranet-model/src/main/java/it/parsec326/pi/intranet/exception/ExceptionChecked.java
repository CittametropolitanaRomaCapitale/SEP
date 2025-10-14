package it.parsec326.pi.intranet.exception;

import jakarta.interceptor.InterceptorBinding;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

@InterceptorBinding
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RUNTIME)
public @interface ExceptionChecked {
}
