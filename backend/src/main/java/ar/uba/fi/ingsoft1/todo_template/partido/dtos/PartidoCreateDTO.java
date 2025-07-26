package ar.uba.fi.ingsoft1.todo_template.partido.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import ar.uba.fi.ingsoft1.todo_template.partido.TipoPartido;



public interface PartidoCreateDTO{
        Long canchaId();
        LocalDate fechaPartido();
        LocalTime horaPartido();
        TipoPartido tipoPartido();
        Integer duracionMinutos();
}