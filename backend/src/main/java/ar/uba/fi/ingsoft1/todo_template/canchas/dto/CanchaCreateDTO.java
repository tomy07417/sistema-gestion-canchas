package ar.uba.fi.ingsoft1.todo_template.canchas.dto;

import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import jakarta.validation.constraints.NotBlank;

public record CanchaCreateDTO(
    @NotBlank String nombre,
    @NotBlank String tipoCesped,
    boolean iluminacion,
    @NotBlank String zona,
    @NotBlank String direccion
) {
    public Cancha asCancha(User propietario) {
        return new Cancha(nombre, tipoCesped, iluminacion, zona, direccion, propietario);
    }
}
