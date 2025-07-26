package ar.uba.fi.ingsoft1.todo_template.canchas.dto;

public record CanchaDTO(
    Long id,
    String nombre,
    String tipoCesped,
    Boolean iluminacion,
    String zona,
    String direccion,
    String propietarioId,
    Boolean activa
) {}
