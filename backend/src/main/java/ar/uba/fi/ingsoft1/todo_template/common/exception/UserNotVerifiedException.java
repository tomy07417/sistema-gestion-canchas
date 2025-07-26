package ar.uba.fi.ingsoft1.todo_template.common.exception;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class UserNotVerifiedException extends RuntimeException{
    public UserNotVerifiedException() {
        super("User not verified");
    }
}
