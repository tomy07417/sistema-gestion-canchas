package ar.uba.fi.ingsoft1.todo_template.partido;

import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;
import ar.uba.fi.ingsoft1.todo_template.canchas.CanchaRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
import ar.uba.fi.ingsoft1.todo_template.invitacion.InvitacionService;
import ar.uba.fi.ingsoft1.todo_template.partido.dtos.PartidoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.reserva.ReservaId;
import ar.uba.fi.ingsoft1.todo_template.reserva.ReservaRepository;
import ar.uba.fi.ingsoft1.todo_template.reserva.ReservaService;
import ar.uba.fi.ingsoft1.todo_template.user.verificacion.EmailService;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import java.util.ArrayList;


import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PartidoService {

    private final PartidoRepository partidoRepository;
    private final EmailService      emailService;
    private final UserRepository    userRepository;
    private final ReservaRepository reservaRepository;
    private final CanchaRepository  canchaRepository;
    private final PartidoFactory    partidoFactory;
    private final ReservaService    reservaService;
    private final InvitacionService invitacionService;

    @Autowired
    public PartidoService(
            PartidoRepository partidoRepository,
            EmailService emailService,
            UserRepository userRepository,
            ReservaRepository reservaRepository,
            CanchaRepository canchaRepository,
            PartidoFactory partidoFactory,
            ReservaService reservaService,
            InvitacionService invitacionService
    ) {
        this.partidoRepository = partidoRepository;
        this.emailService      = emailService;
        this.userRepository    = userRepository;
        this.reservaRepository = reservaRepository;
        this.canchaRepository  = canchaRepository;
        this.partidoFactory    = partidoFactory;
        this.reservaService    = reservaService;
        this.invitacionService = invitacionService;
    }

    private User autentificarUser() {
        JwtUserDetails infoUser = (JwtUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        User organizador = userRepository.findByEmail(infoUser.email())
                .orElseThrow(() -> new NotFoundException("El email no está registrado"));

        if (!organizador.isVerified())
            throw new IllegalStateException("Antes de crear un partido debe estar registrado");
        return organizador;
    }

    private boolean reservaExiste(Long canchaId, LocalDate fecha, LocalTime horaInicio) {
        LocalTime horaFin = horaInicio.plusHours(1);
        Cancha cancha = canchaRepository.findById(canchaId)
                .orElseThrow(() -> new NotFoundException("Cancha no encontrada"));
        ReservaId reservaId = new ReservaId(cancha, fecha, horaInicio, horaFin);
        return reservaRepository.existsById(reservaId);
    }

    private void envioDeEmailPorCreacion(String email, Partido partido) {
        emailService.sendCreationPartido(
                email,
                partido.getCancha().getNombre(),
                partido.getFechaPartido().toString(),
                partido.getHoraPartido().toString(),
                partido.getTipoPartido().name()
        );
    }

    @Transactional
    public Partido crearPartido(PartidoCreateDTO dto) {
        User organizador = autentificarUser();

        if (!reservaExiste(dto.canchaId(), dto.fechaPartido(), dto.horaPartido()))
            throw new IllegalStateException("No se encuentra reserva para la cancha y franja horaria");

        Cancha cancha = canchaRepository.findById(dto.canchaId())
                .orElseThrow(() -> new NotFoundException("Cancha no encontrada"));

        Partido partido = partidoFactory.crearPartido(dto, cancha, organizador);

        partido.inscribirJugador(organizador);

        Partido partidoGuardado = partidoRepository.save(partido);

        reservaService.ocuparReserva(
                cancha,
                dto.fechaPartido(),
                dto.horaPartido(),
                dto.horaPartido().plusHours(1),
                partidoGuardado
        );

        envioDeEmailPorCreacion(organizador.getEmail(), partidoGuardado);
        return partidoGuardado;
    }

    public List<Partido> obtenerPartidosAbiertos() {
        return partidoRepository.findAll()
                .stream()
                .filter(p -> p.getTipoPartido() == TipoPartido.ABIERTO)
                .toList();
    }

    @Transactional
    public List<PartidoAbiertoResponseDTO> obtenerPartidosAbiertosIncluyendoInscripcion(String userId) {
        return obtenerPartidosAbiertos().stream()
                .peek(pa -> pa.setEstadoPartido(pa.calcularEstadoPartido()))
                .filter(pa -> pa.getEstadoPartido() != EstadoPartido.TERMINADO)
                .map(pa -> PartidoAbiertoResponseDTO.fromEntity(pa, userId))
                .toList();
    }

    public List<Partido> obtenerPartidoCerrados() {
        return partidoRepository.findAll()
                .stream()
                .filter(p -> p.getTipoPartido() == TipoPartido.CERRADO)
                .toList();
    }

    @Transactional
    public List<Partido> historialPartidosAbiertosPorUsuario(String userId) {
        List<Partido> comoOrganizador = partidoRepository
                .findByTipoPartidoAndOrganizadorUsername(TipoPartido.ABIERTO, userId);

        List<Partido> comoJugador = partidoRepository
                .findByTipoPartidoAndJugadores_Username(TipoPartido.ABIERTO, userId);

        Set<Partido> todos = new HashSet<>(comoOrganizador);
        todos.addAll(comoJugador);

        todos.forEach(p -> p.getJugadores().size());

        return new ArrayList<>(todos);
    }


    @Transactional
    public List<Partido> historialPartidosCerradosPorUsuario(String userId) {
        return partidoRepository
                .findByTipoPartidoAndOrganizadorUsername(TipoPartido.CERRADO, userId);
    }


    @Transactional
    public void inscribirAAbierto(PartidoId partidoId, String userId) {
        Partido partido = partidoRepository.findById(partidoId)
                .orElseThrow(() -> new NotFoundException("Partido abierto no encontrado"));

        if (partido.getTipoPartido() != TipoPartido.ABIERTO)
            throw new IllegalStateException("El partido no es de tipo abierto.");

        LocalDate hoy   = LocalDate.now();
        LocalTime ahora = LocalTime.now();
        boolean yaEmpezo = partido.getFechaPartido().isBefore(hoy) ||
                (partido.getFechaPartido().isEqual(hoy) && partido.getHoraPartido().isBefore(ahora));
        if (yaEmpezo)
            throw new IllegalStateException("No se puede inscribir, el partido ya comenzó.");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        if (!partido.inscribirJugador(user))
            throw new IllegalStateException("No hay cupos disponibles o el usuario ya está inscripto.");

        if (partido.getJugadores().size() >= partido.getMinJugadores())
            partido.setPartidoConfirmado(true);

        partidoRepository.save(partido);

        emailService.sendInscripcionPartido(
                user.getEmail(),
                partido.getCancha().getNombre(),
                partido.getFechaPartido().toString(),
                partido.getHoraPartido().toString()
        );
    }

    @Transactional
    public void desinscribirDeAbierto(PartidoId partidoId, String userId) {
        Partido partido = partidoRepository.findById(partidoId)
                .orElseThrow(() -> new NotFoundException("Partido abierto no encontrado"));

        if (partido.getTipoPartido() != TipoPartido.ABIERTO)
            throw new IllegalStateException("El partido no es de tipo abierto.");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));

        LocalDate hoy   = LocalDate.now();
        LocalTime ahora = LocalTime.now();
        boolean yaEmpezo = partido.getFechaPartido().isBefore(hoy) ||
                (partido.getFechaPartido().isEqual(hoy) && partido.getHoraPartido().isBefore(ahora));

        if (partido.isPartidoConfirmado() || yaEmpezo)
            throw new IllegalStateException("No se puede dar de baja, el partido ya está confirmado o comenzó.");

        if (!partido.desinscribirJugador(user))
            throw new IllegalStateException("El usuario no está inscripto en este partido.");

        partidoRepository.save(partido);

        emailService.sendDesinscripcionPartido(
                user.getEmail(),
                partido.getCancha().getNombre(),
                partido.getFechaPartido().toString(),
                partido.getHoraPartido().toString()
        );
    }


    public String generarInvitacion(Long canchaId, LocalDate fecha, LocalTime hora, String email) {
        PartidoId partidoId = new PartidoId(canchaId, fecha, hora);
        return invitacionService.generarInvitacion(partidoId, email);
    }


}
