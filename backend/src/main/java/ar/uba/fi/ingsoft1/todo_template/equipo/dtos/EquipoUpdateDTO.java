package ar.uba.fi.ingsoft1.todo_template.equipo.dtos;

import java.util.Optional;

import ar.uba.fi.ingsoft1.todo_template.equipo.Equipo;

import jakarta.validation.constraints.NotBlank;

public record EquipoUpdateDTO(
    @NotBlank String teamName,
    Optional<String> category,
    Optional<String> mainColors,
    Optional<String> secondaryColors
){
    public void updateEquipo(Equipo equipo) {
        equipo.update(teamName, category, mainColors, secondaryColors);
    }
}
