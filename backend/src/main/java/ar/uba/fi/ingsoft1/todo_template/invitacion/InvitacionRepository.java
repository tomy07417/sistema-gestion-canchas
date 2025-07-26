package ar.uba.fi.ingsoft1.todo_template.invitacion;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InvitacionRepository extends JpaRepository<Invitacion, Long> {
    Optional<Invitacion> findByToken(String token);
}
