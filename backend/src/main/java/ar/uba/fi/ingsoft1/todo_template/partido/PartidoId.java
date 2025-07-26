package ar.uba.fi.ingsoft1.todo_template.partido;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class PartidoId implements Serializable{
    
    @Column(name = "cancha_id", nullable = false)
    private Long canchaId;

    @Column(name = "fecha_partido", nullable = false)
    private LocalDate fechaPartido;

    @Column(name = "hora_partido", nullable = false)
    private LocalTime horaPartido;

    public PartidoId() {
    }

    public PartidoId(Long canchaId, LocalDate fechaPartido, LocalTime horaPartido) {
        this.canchaId = canchaId;
        this.fechaPartido = fechaPartido;
        this.horaPartido = horaPartido;
    }

      @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PartidoId)) return false;

        PartidoId partidoId = (PartidoId) o;

        return canchaId.equals(partidoId.canchaId) &&
               fechaPartido.equals(partidoId.fechaPartido) &&
               horaPartido.equals(partidoId.horaPartido);

    }

    @Override
    public int hashCode() {
        return Objects.hash(canchaId, fechaPartido, horaPartido);
    }

    public void setCanchaId(Long canchaId) {
        this.canchaId = canchaId;
    }
    public void setFechaPartido(LocalDate fechaPartido) {
        this.fechaPartido = fechaPartido;
    }
    public void setHoraPartido(LocalTime horaPartido) {
        this.horaPartido = horaPartido;
    }

    public Long getCanchaId() {
        return canchaId;
    }

    public LocalDate getFechaPartido() {
        return fechaPartido;
    }

    public LocalTime getHoraPartido() {
        return horaPartido;
    }
  
}
