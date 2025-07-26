package ar.uba.fi.ingsoft1.todo_template.canchas;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface CanchaRepository extends JpaRepository<Cancha,Long> {
    boolean existsByNombreAndZonaAndDireccion(String nombre, String zona, String direccion);
    List<Cancha> findByPropietarioUsername(String propietarioId);
    Optional<Cancha> findByNombre(String nombre);

}
