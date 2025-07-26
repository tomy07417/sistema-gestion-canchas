package ar.uba.fi.ingsoft1.todo_template.partido.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import ar.uba.fi.ingsoft1.todo_template.partido.TipoPartido;
import jakarta.validation.constraints.NotNull;

public record PartidoAbiertoCreateDTO(
    @NotNull Long canchaId,
    @NotNull LocalDate fechaPartido,
    @NotNull LocalTime horaPartido,
    @NotNull Integer minJugadores,
    @NotNull Integer maxJugadores,
    @NotNull Integer cuposDisponibles,
    @NotNull Integer duracionMinutos
) implements PartidoCreateDTO {

    @Override
    public TipoPartido tipoPartido() {
        return TipoPartido.ABIERTO;
    }
}