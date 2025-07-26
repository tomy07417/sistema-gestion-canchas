package ar.uba.fi.ingsoft1.todo_template.torneo;

import org.springframework.stereotype.Service;

import ar.uba.fi.ingsoft1.todo_template.common.exception.EquipoAlreadyExistsException;
import ar.uba.fi.ingsoft1.todo_template.equipo.Equipo;
import ar.uba.fi.ingsoft1.todo_template.equipo.EquipoRepository;
import ar.uba.fi.ingsoft1.todo_template.equipo.dtos.EquipoDTO;

@Service
public class InscripcionService {
    private final InscripcionRepository InscripcionesRepo;
    private final TorneoRepository TorneoRepo;
    private final EquipoRepository EquipoRepo;

    public InscripcionService(InscripcionRepository InscripcionesRepo, TorneoRepository TorneoRepo, EquipoRepository EquipoRepo) {
        this.InscripcionesRepo = InscripcionesRepo;
        this.TorneoRepo = TorneoRepo;
        this.EquipoRepo = EquipoRepo;
    }

    public String inscribirEquipo(String idTorneo, EquipoDTO equipoDTO) {
        Torneo torneo = TorneoRepo.findById(idTorneo)
                .orElseThrow(() -> new IllegalArgumentException("Torneo no encontrado: " + idTorneo));
        Equipo equipo = EquipoRepo.findById(equipoDTO.teamName())
                .orElseThrow(() -> new IllegalArgumentException("Equipo no encontrado: " + equipoDTO.teamName()));

        InscripcionesId id = new InscripcionesId(torneo, equipo);

        if (InscripcionesRepo.existsById(id)) {
            throw new EquipoAlreadyExistsException("El equipo ya está inscripto en el torneo.");
        }

        Inscripciones inscripcion = new Inscripciones(id);
        InscripcionesRepo.save(inscripcion);

        return "Equipo " + equipo.getId() + " inscrito en el torneo " + torneo.getNombre() + ".";
    }
}
