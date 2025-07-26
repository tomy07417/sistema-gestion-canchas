package ar.uba.fi.ingsoft1.todo_template.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class CanchaAlreadyExistsException extends RuntimeException {
    public CanchaAlreadyExistsException(String nombre, String zona, String direccion) {
        super(String.format("La cancha '%s' en '%s, %s' ya existe.", nombre, zona, direccion));
    }
}