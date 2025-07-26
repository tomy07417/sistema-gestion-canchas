package ar.uba.fi.ingsoft1.todo_template.common.exception;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class EquipoAlreadyExistsException extends RuntimeException {
    public EquipoAlreadyExistsException(String equipo) {
        super(String.format("Equipo con nombre %s ya existe", equipo));
    }
}