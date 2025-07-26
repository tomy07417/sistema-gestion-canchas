package ar.uba.fi.ingsoft1.todo_template.reserva;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;
import ar.uba.fi.ingsoft1.todo_template.partido.Partido;
import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaDTO;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "reservas")
public class Reserva {
    @EmbeddedId
    private ReservaId id;

    @Embedded
    private StateReserva stateReserva;

    @NotNull
    private Integer duracionMinutos;

    public Reserva() {}

    public Reserva(ReservaId id, StateReserva stateReserva, int minutos) {
        this.id = id;
        this.stateReserva = stateReserva;
        this.duracionMinutos = minutos;
    }
    public Integer getDuracionMinutos() {
        return duracionMinutos;
    }


    public Cancha getCancha() { return id.getCanchaId(); }

    public StateReserva getStateReserva() { return stateReserva; }
    public void setStateReserva(Partido partido) { this.stateReserva = this.stateReserva.changeState(partido); }

    public LocalDate getFecha() { return id.getFecha(); }

    public LocalTime getHoraInicio() { return id.getHoraInicio(); }

    public LocalTime getHoraFin() { return id.getHoraFin(); }

    public ReservaDTO toDTO() {
        Cancha c = this.id.getCanchaId();

        return new ReservaDTO(
                c.getId(),
                c.getNombre(),
                c.getZona(),
                c.getDireccion(),
                this.id.getFecha(),
                this.id.getHoraInicio(),
                this.id.getHoraFin(),
                this.stateReserva.getState(),
                this.stateReserva.getTipoPartido(),
                this.stateReserva.getOrganizadorEmail(),
                this.getDuracionMinutos()
        );
    }
}
