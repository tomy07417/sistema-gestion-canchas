package ar.uba.fi.ingsoft1.todo_template.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class CanchaConReservasFuturasException extends RuntimeException {
    public CanchaConReservasFuturasException(Long canchaId) {
        super("No se puede eliminar la cancha con id " + canchaId + " porque tiene reservas futuras.");
    }
}
