package ar.uba.fi.ingsoft1.todo_template.partido;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
public interface PartidoRepository extends JpaRepository<Partido, PartidoId> {
    List<Partido> findByTipoPartidoAndOrganizadorUsername(TipoPartido tipoPartido, String organizadorId);
    List<Partido> findByTipoPartidoAndJugadores_Username(TipoPartido tipo, String username);


}
