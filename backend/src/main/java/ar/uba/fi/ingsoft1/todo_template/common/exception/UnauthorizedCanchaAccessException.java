package ar.uba.fi.ingsoft1.todo_template.common.exception;

public class UnauthorizedCanchaAccessException extends RuntimeException {
    public UnauthorizedCanchaAccessException(String mensaje){
        super(mensaje);
    }
}
