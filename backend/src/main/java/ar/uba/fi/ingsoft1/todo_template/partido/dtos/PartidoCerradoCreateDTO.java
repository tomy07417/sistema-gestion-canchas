package ar.uba.fi.ingsoft1.todo_template.partido.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import ar.uba.fi.ingsoft1.todo_template.partido.TipoPartido;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PartidoCerradoCreateDTO(
    @NotNull Long canchaId,
    @NotNull LocalDate fechaPartido,
    @NotNull LocalTime horaPartido,
    @NotBlank String equipo1,
    @NotBlank String equipo2,
    @NotNull Integer duracionMinutos
) implements PartidoCreateDTO {

    @Override
    public TipoPartido tipoPartido() {
        return TipoPartido.CERRADO;
    }

}