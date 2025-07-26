package ar.uba.fi.ingsoft1.todo_template.user.recuperacion.dto;

import jakarta.validation.constraints.NotBlank;

public record EmailDTO(
    @NotBlank String email
) {

}
