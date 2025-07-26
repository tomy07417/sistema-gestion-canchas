package ar.uba.fi.ingsoft1.todo_template.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class InvitacionInvalidaException extends RuntimeException {
    public InvitacionInvalidaException() {
        super("No se pudo aceptar la invitacion al partido.");
    }
}
