package ar.uba.fi.ingsoft1.todo_template.equipo;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.UserNotFoundException;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
import ar.uba.fi.ingsoft1.todo_template.equipo.dtos.EquipoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.equipo.dtos.EquipoDTO;
import ar.uba.fi.ingsoft1.todo_template.equipo.dtos.EquipoUpdateDTO;

@Service
public class EquipoService {
    private final UserRepository userRepo;
    private final EquipoRepository equipoRepo;

    public EquipoService(UserRepository userRepo, EquipoRepository equipoRepo) {
        this.userRepo = userRepo;
        this.equipoRepo = equipoRepo;
    }

    public EquipoDTO crearEquipo(EquipoCreateDTO equipoDTO) {
        if (equipoRepo.existsById(equipoDTO.teamName())){
            throw new UserNotFoundException("Ya existe un equipo con ese nombre");
        }
        
        JwtUserDetails userDetails = (JwtUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User captain = userRepo.findByEmail(userDetails.email())
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        Equipo equipoNuevo = equipoDTO.asEquipo(captain);
        equipoRepo.save(equipoNuevo);
        
        return equipoNuevo.asEquipoDTO();
    }

    public EquipoDTO actualizarEquipo(EquipoUpdateDTO equipoDTO) {
        JwtUserDetails userDetails = (JwtUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Equipo equipo = equipoRepo.findById(equipoDTO.teamName())
                .orElseThrow(() -> new UserNotFoundException("Equipo no encontrado"));

        if (!equipo.getCaptain().getEmail().equals(userDetails.email())) {
            throw new UserNotFoundException("Solo el capitán del equipo puede actualizarlo");
        }

        equipoDTO.updateEquipo(equipo);
        equipoRepo.save(equipo);

        return equipo.asEquipoDTO();
    }

    public List<EquipoDTO> obtenerEquipos() {
        JwtUserDetails userDetails = (JwtUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Equipo> equipos = equipoRepo.findByCaptainUsername(userDetails.username())
                .orElseThrow(() -> new UserNotFoundException("No se encontraron equipos para el usuario"));
    
        return equipos.stream().map(Equipo::asEquipoDTO).toList();
    }


}
