package ar.uba.fi.ingsoft1.todo_template.torneo;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;

@Entity
public class Inscripciones {
    @EmbeddedId
    private InscripcionesId id;
    
    public Inscripciones() {}

    public Inscripciones(InscripcionesId id) {
        this.id = id;
    }

    public String getTeam() {
        return id.getTeam();
    }

    public Torneo getTorneo() {
        return id.getTorneo();
    }
}
