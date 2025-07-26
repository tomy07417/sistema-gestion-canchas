package ar.uba.fi.ingsoft1.todo_template.invitacion;

import ar.uba.fi.ingsoft1.todo_template.partido.*;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class InvitacionService {
    private final InvitacionRepository invitacionRepository;
    private final PartidoRepository partidoRepository;
    private final UserRepository userRepository;

    public InvitacionService(
            InvitacionRepository invitacionRepository,
            PartidoRepository partidoRepository,
            UserRepository userRepository
    ) {
        this.invitacionRepository = invitacionRepository;
        this.partidoRepository = partidoRepository;
        this.userRepository = userRepository;
    }

    public String generarInvitacion(PartidoId partidoId, String email) {
        Partido partido = partidoRepository.findById(partidoId)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));
        String token = UUID.randomUUID().toString();
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime expiracion = ahora.plusHours(6);

        Invitacion invitacion = new Invitacion(token, partido, ahora, expiracion, email);
        invitacionRepository.save(invitacion);

        return token;
    }

    public boolean validarInvitacion(String token) {
        Optional<Invitacion> opt = invitacionRepository.findByToken(token);
        if (opt.isEmpty()) return false;
        Invitacion inv = opt.get();
        if (inv.isAceptada()) return false;
        return !inv.getFechaExpiracion().isBefore(LocalDateTime.now());
    }

    public void aceptarInvitacion(String token, String username) {
        Invitacion invitacion = invitacionRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invitación no encontrada"));
        if (!validarInvitacion(token)) throw new RuntimeException("Invitación inválida o expirada");
        invitacion.setAceptada(true);
        invitacionRepository.save(invitacion);

        Partido partido = invitacion.getPartido();
        User user = userRepository.findById(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!partido.inscribirJugador(user))
            throw new RuntimeException("No hay cupos o ya está inscripto");

        partidoRepository.save(partido);
    }

}
