package ar.uba.fi.ingsoft1.todo_template.torneo;

import java.io.Serializable;

import ar.uba.fi.ingsoft1.todo_template.equipo.Equipo;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Embeddable
public class InscripcionesId implements Serializable {
    @ManyToOne
    @JoinColumn(name = "torneo_id", nullable = false)   
    private Torneo torneo;

    @ManyToOne
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;

    public InscripcionesId() {}

    public InscripcionesId(Torneo torneo, Equipo equipoName) {
        this.torneo = torneo;
        this.equipo = equipoName;
    }

    public Torneo getTorneo() {
        return torneo;
    }
    
    public String getTeam() {
        return equipo.getId();
    }
}