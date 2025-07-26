package ar.uba.fi.ingsoft1.todo_template.torneo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InscripcionRepository extends JpaRepository<Inscripciones, InscripcionesId> {
    
}
