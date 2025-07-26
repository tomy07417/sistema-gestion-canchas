package ar.uba.fi.ingsoft1.todo_template.torneo.dto;

import jakarta.validation.constraints.NotBlank;

public record InscripcionDTO (
    @NotBlank String teamName
){}
