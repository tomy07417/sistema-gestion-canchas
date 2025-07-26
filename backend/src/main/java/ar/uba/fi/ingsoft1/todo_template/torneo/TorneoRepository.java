package ar.uba.fi.ingsoft1.todo_template.torneo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TorneoRepository extends JpaRepository<Torneo, String> {
    Optional<List<Torneo>> findByOrganizadorEmail(String email);
    Boolean existsByNombre(String nombre);
    Optional<Torneo> findByNombre(String nombre);
}
