package ar.uba.fi.ingsoft1.todo_template.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TorneoNotEditableException extends RuntimeException {
    public TorneoNotEditableException(String nombre) {
        super("El torneo con nombre " + nombre + " no se puede editar/eliminar en su estado actual.");
    }
}
