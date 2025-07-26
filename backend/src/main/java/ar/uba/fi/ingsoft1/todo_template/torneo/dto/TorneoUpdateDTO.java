package ar.uba.fi.ingsoft1.todo_template.torneo.dto;

import java.time.LocalDate;
import java.util.Optional;

import ar.uba.fi.ingsoft1.todo_template.torneo.Torneo;
import ar.uba.fi.ingsoft1.todo_template.torneo.TorneoFormato;

public record TorneoUpdateDTO(
    Optional<String> nombre,
    Optional<LocalDate> fechaInicio,
    Optional<LocalDate> fechaFin,
    Optional<TorneoFormato> formato,
    Optional<Integer> cantidadMaximaEquipos
) {
    public boolean isDateValid(LocalDate fechaInicio, LocalDate fechaFin) {
        if (this.fechaInicio.isEmpty() && this.fechaFin.isEmpty()) {
            return true;
        }

        else if (this.fechaInicio.isEmpty() && this.fechaFin.isPresent()) {
            return !fechaInicio.isAfter(this.fechaFin.get());
        }

        else if (this.fechaFin.isEmpty() && this.fechaInicio.isPresent()) {
            return !this.fechaInicio.get().isAfter(fechaFin);
        }

        return !this.fechaInicio.get().isAfter(this.fechaFin.get());
    }

    public void update(Torneo torneo) {
        nombre.ifPresent(torneo::setNombre);
        fechaInicio.ifPresent(torneo::setFechaInicio);
        fechaFin.ifPresent(torneo::setFechaFin);
        formato.ifPresent(torneo::setFormato);
        cantidadMaximaEquipos.ifPresent(torneo::setCantidadMaximaEquipos);
    }
}
