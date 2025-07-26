package ar.uba.fi.ingsoft1.todo_template.canchas;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.core.context.SecurityContextHolder;

import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaDTO;
import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaEditDTO;

import ar.uba.fi.ingsoft1.todo_template.common.exception.CanchaAlreadyExistsException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.CanchaConReservasFuturasException;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;

import ar.uba.fi.ingsoft1.todo_template.reserva.ReservaRepository;

@Service
public class CanchaService {
    private final CanchaRepository canchaRepo;
    private final UserRepository userRepo;
    private final ReservaRepository reservaRepo;

    public CanchaService(
        CanchaRepository canchaRepo,
        UserRepository userRepo,
        ReservaRepository reservaRepo
    ) {
        this.canchaRepo = canchaRepo;
        this.userRepo   = userRepo;
        this.reservaRepo = reservaRepo;
    }

    public CanchaDTO crearCancha(CanchaCreateDTO dto) {
        if (canchaRepo.existsByNombreAndZonaAndDireccion(
                dto.nombre(), dto.zona(), dto.direccion())) {
            throw new CanchaAlreadyExistsException(
                dto.nombre(), dto.zona(), dto.direccion()
            );
        }
        
        JwtUserDetails userInfo = (JwtUserDetails) SecurityContextHolder.getContext()
            .getAuthentication().getPrincipal();
        String email = userInfo.email();

        User propietario = userRepo.findByEmail(email)
            .orElseThrow(() ->
                new NotFoundException("Usuario con email: '" + email + "' no encontrado.")
            );

        Cancha cancha = dto.asCancha(propietario);
        canchaRepo.save(cancha);

        return cancha.toDTO();
    }

    public List<CanchaDTO> listarCanchas() {
        return canchaRepo.findAll().stream()
                .filter(Cancha::getActiva)
                .map(Cancha::toDTO)
                .collect(Collectors.toList());
    }

    public List<CanchaDTO> listarTodasLasCanchas(String userId) {
        return canchaRepo.findByPropietarioUsername(userId).stream()
                .map(Cancha::toDTO)
                .collect(Collectors.toList());
    }


    public CanchaDTO obtenerCancha(Long id) {
        Cancha cancha = canchaRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Cancha con id " + id + " no encontrada."));
        return cancha.toDTO();
    }

    public CanchaDTO editarCancha(Long id, CanchaEditDTO dto) {
        Cancha cancha = canchaRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Cancha con id " + id + " no encontrada"));

        if (dto.getNombre() != null) cancha.setNombre(dto.getNombre());
        if (dto.getDireccion() != null) cancha.setDireccion(dto.getDireccion());
        if (dto.getTipoCesped() != null) cancha.setTipoCesped(dto.getTipoCesped());
        if (dto.getIluminacion() != null) cancha.setIluminacion(dto.getIluminacion());
        if (dto.getZona() != null) cancha.setZona(dto.getZona());
        if (dto.getActiva() != null) cancha.setActiva(dto.getActiva());

        canchaRepo.save(cancha);
        return cancha.toDTO();
    }

    @Transactional
    public void eliminarCancha(Long id) {
        Cancha cancha = canchaRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Cancha con id " + id + " no encontrada."));

        LocalDate hoy = LocalDate.now();
        boolean tieneReserva = reservaRepo.existsReservaFuturaPorCancha(id, hoy, "OCUPADA");
        if (tieneReserva) {
            throw new CanchaConReservasFuturasException(id);
        }

        reservaRepo.deleteAllByCanchaId(id);
        canchaRepo.delete(cancha);
    }
}
