package ar.uba.fi.ingsoft1.todo_template.reserva.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record ReservaCreateDTO(
    @NotNull Long canchaId,
    @NotNull LocalDate fechaInicial,
    @NotNull LocalDate fechaFinal,
    @NotNull LocalTime horarioInicio,
    @NotNull LocalTime horarioFin,
    @NotNull Integer minutos
) {}
