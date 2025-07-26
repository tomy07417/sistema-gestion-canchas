package ar.uba.fi.ingsoft1.todo_template.equipo.dtos;

import ar.uba.fi.ingsoft1.todo_template.equipo.Equipo;
import ar.uba.fi.ingsoft1.todo_template.user.User;

import jakarta.validation.constraints.NotBlank;

public record EquipoDTO(
    @NotBlank String teamName,
    String category,
    String mainColors,
    String secondaryColors,
    String captainId
){
    public Equipo asEquipo(User captain) {
        return new Equipo(teamName, captain, category, mainColors, secondaryColors);
    }
}