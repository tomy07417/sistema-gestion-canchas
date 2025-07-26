package ar.uba.fi.ingsoft1.todo_template.reserva.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import ar.uba.fi.ingsoft1.todo_template.partido.TipoPartido;

public record ReservaDTO(
        Long canchaId,
        String canchaName,
        String zona,
        String direccion,
        LocalDate fecha,
        LocalTime inicioTurno,
        LocalTime finTurno,
        String state,
        @JsonFormat(shape = JsonFormat.Shape.STRING)
        TipoPartido tipoPartido,
        String emailOrganizador,
        Integer duracionMinutos
)  {}
