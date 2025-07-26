package ar.uba.fi.ingsoft1.todo_template.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class TorneoAlreadyExistsException extends RuntimeException {
    public TorneoAlreadyExistsException(String nombre) {
        super("El torneo '" + nombre + "' ya existe.");
    }
}
