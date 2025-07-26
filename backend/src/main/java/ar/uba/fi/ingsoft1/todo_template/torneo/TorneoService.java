package ar.uba.fi.ingsoft1.todo_template.torneo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.LocalDate;
import java.util.List;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.TorneoAlreadyExistsException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.TorneoNotEditableException;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoDTO;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoUpdateDTO;

@Service
public class TorneoService {
    private final TorneoRepository torneoRepo;
    private final UserRepository userRepo;

    public TorneoService(
        TorneoRepository torneoRepo,
        UserRepository userRepo
    ) {
        this.torneoRepo = torneoRepo;
        this.userRepo = userRepo;
    }

    public void iniciarTorneo(String nombreTorneo) {
        Torneo torneo = torneoRepo.findByNombre(nombreTorneo)
            .orElseThrow(() -> new NotFoundException("Torneo con nombre: '" + nombreTorneo + "' no encontrado."));

        if (!torneo.getFechaInicio().isEqual(LocalDate.now())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La fecha de inicio del torneo debe ser la fecha actual para poder iniciarlo."
            );
        }

        torneo.setEstado(EstadoTorneo.EN_CURSO);
        torneoRepo.save(torneo);
    }

    public void finalizarTorneo(String nombreTorneo) {
        Torneo torneo = torneoRepo.findByNombre(nombreTorneo)
            .orElseThrow(() -> new NotFoundException("Torneo con nombre: '" + nombreTorneo + "' no encontrado."));

        if (!torneo.getFechaFin().isEqual(LocalDate.now()) || torneo.getFechaFin().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La fecha de fin del torneo debe ser la fecha actual para poder finalizarlo."
            );
        }

        torneo.setEstado(EstadoTorneo.FINALIZADO);
        torneoRepo.save(torneo);
    }

    @Transactional
    public Torneo createTorneo(TorneoCreateDTO dto, String emailOrganizador) {
        if (torneoRepo.existsByNombre(dto.nombre())) {
            throw new TorneoAlreadyExistsException(dto.nombre());
        }

        User organizador = userRepo.findByEmail(emailOrganizador)
            .orElseThrow(() -> new NotFoundException("Usuario no encontrado."));

        Torneo torneo = dto.asTorneo();
        torneo.setOrganizador(organizador);
        
        return torneoRepo.save(torneo);
    }

    @Transactional(readOnly = true)
    public List<Torneo> listTorneos() {
        return torneoRepo.findAll();
    }

    public List<TorneoDTO> listTorneosPorOrganizador(String email) {
        User organizador = userRepo.findByEmail(email)
            .orElseThrow(() -> new NotFoundException("Usuario con email: '" + email + "' no encontrado."));

        return torneoRepo.findByOrganizadorEmail(organizador.getEmail())
            .orElseThrow(() -> new NotFoundException("No se encontraron torneos para el organizador con email: " + email))
            .stream()
            .map(Torneo::toDTO)
            .toList();
    }

    @Transactional
    public Torneo updateTorneo(String nombre, TorneoUpdateDTO dto, String emailOrganizador) {
        Torneo torneo = torneoRepo.findByNombre(nombre)
            .orElseThrow(() -> new NotFoundException("Torneo con nombre: '" + nombre + "' no encontrado."));

        if (!torneo.getOrganizador().getEmail().equals(emailOrganizador)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo el organizador puede editar este torneo.");
        }
        
        if (dto.nombre().isPresent() && torneoRepo.existsById(dto.nombre().get())) {
            throw new TorneoAlreadyExistsException(dto.nombre().get());
        }

        if (!dto.isDateValid(torneo.getFechaInicio(), torneo.getFechaFin())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La fecha de inicio no puede ser posterior a la fecha de fin."
            );
        }

        if (dto.formato().isPresent() && torneo.isStarted()) {
            throw new TorneoNotEditableException(nombre);
        }

        dto.update(torneo);

        return torneoRepo.save(torneo);
    }

    @Transactional
    public void deleteTorneo(String nombre) {
        Torneo torneo = torneoRepo.findById(nombre)
            .orElseThrow(() -> new NotFoundException("Torneo con nombre: '" + nombre + "' no encontrado."));

        if (torneo.isStarted()) {
            throw new TorneoNotEditableException(nombre);
        }

        torneoRepo.delete(torneo);
    }
}
