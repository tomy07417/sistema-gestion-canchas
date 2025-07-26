package ar.uba.fi.ingsoft1.todo_template.equipo.dtos;

import java.util.Optional;

import ar.uba.fi.ingsoft1.todo_template.equipo.Equipo;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import jakarta.validation.constraints.NotBlank;

public record EquipoCreateDTO(
    @NotBlank
    String teamName,
    Optional<String> category,
    Optional<String> mainColors,
    Optional<String> secondaryColors
) {
    public Equipo asEquipo(User captain) {
        return new Equipo(teamName, captain, 
                          category.orElse(null), 
                          mainColors.orElse(null), 
                          secondaryColors.orElse(null));
    }
}
