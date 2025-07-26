package ar.uba.fi.ingsoft1.todo_template.reserva;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaDTO;
import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaIdDTO;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;
import ar.uba.fi.ingsoft1.todo_template.canchas.CanchaRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
import ar.uba.fi.ingsoft1.todo_template.partido.Partido;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepo;
    private final CanchaRepository canchaRepo;
    private final UserRepository userRepo;

    public ReservaService(
        ReservaRepository reservaRepo,
        CanchaRepository canchaRepo,
        UserRepository userRepo
    ) {
        this.reservaRepo = reservaRepo;
        this.canchaRepo = canchaRepo;
        this.userRepo = userRepo;
    }

    public String crearReservas(ReservaCreateDTO dto) {
        Cancha cancha = canchaRepo.findById(dto.canchaId())
            .orElseThrow(() -> new NotFoundException("Cancha con ID: '" + dto.canchaId() + "' no encontrada."));
        
        List<Reserva> reservas = new ArrayList<>();
        
        for (LocalDate fecha = dto.fechaInicial(); !fecha.isAfter(dto.fechaFinal()); fecha = fecha.plusDays(1)) {
            for (LocalTime hr = dto.horarioInicio(); !hr.isAfter(dto.horarioFin()); hr = hr.plusMinutes(dto.minutos())) {
                ReservaId reservaId = new ReservaId(cancha, fecha, hr, hr.plusMinutes(dto.minutos()));
                reservas.add(new Reserva(reservaId, new StateReserva(),dto.minutos()));
            }
        }

        reservaRepo.saveAll(reservas);

        return "Reservas creadas exitosamente.";
    }

    public ReservaDTO actualizarReserva(ReservaIdDTO dto) {
        Cancha cancha = canchaRepo.findByNombre(dto.canchaName())
            .orElseThrow(() -> new NotFoundException("Cancha con nombre: '" + dto.canchaName() + "' no encontrada."));
    
        ReservaId reservaId = new ReservaId(cancha, dto.fecha(), dto.horaInicio(), dto.horaFin());
        Reserva reserva = reservaRepo.findById(reservaId)
            .orElseThrow(() -> new NotFoundException("Reserva con ID: '" + reservaId + "' no encontrada."));
    
        reserva.setStateReserva(null);

        reservaRepo.save(reserva);

        return reserva.toDTO();
    }

    public List<ReservaDTO> obtenerReserva() {
        JwtUserDetails userInfo = (JwtUserDetails) SecurityContextHolder.getContext()
            .getAuthentication().getPrincipal();

        User user = userRepo.findByEmail(userInfo.email())
            .orElseThrow(() -> new NotFoundException("Usuario con email: '" + userInfo.email() + "' no encontrado."));
            
        List<Cancha> canchas = canchaRepo.findByPropietarioUsername(user.getUsername());
        List<Reserva> reservas = new ArrayList<>();
        
        canchas.forEach(cancha -> reservas.addAll(reservaRepo.findByCanchaId(cancha.getId())));

        return reservas.stream().map(Reserva::toDTO).toList();
    }

    public List<ReservaDTO> obtenerDisponibles(LocalDate fecha, String zona) {
        LocalDate hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();

        return reservaRepo.findDisponibles(fecha, zona)
                .stream()
                .filter(reserva -> {
                    if (fecha.isEqual(hoy)) {
                        return !reserva.getHoraInicio().isBefore(ahora);
                    }
                    return fecha.isAfter(hoy);
                })
                .map(Reserva::toDTO)
                .toList();
    }


    public void ocuparReserva(Cancha cancha, LocalDate fecha,
                              LocalTime inicio, LocalTime fin, Partido partido) {
        ReservaId id = new ReservaId(cancha, fecha, inicio, fin);
        Reserva reserva  = reservaRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Reserva no encontrada"));
        
        reserva.setStateReserva(partido);
        
        reservaRepo.save(reserva);
    }

}

