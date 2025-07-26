package ar.uba.fi.ingsoft1.todo_template.partido;

import java.time.LocalDate;
import java.time.LocalTime;

public record PartidoResponseDTO(
        PartidoId idPartido,
        TipoPartido tipoPartido,
        String canchaNombre,
        String canchaDireccion,
        LocalDate fechaPartido,
        LocalTime horaPartido,
        String organizadorId,
        String emailOrganizador
) {
    public static PartidoResponseDTO fromEntity(Partido partido){
        return new PartidoResponseDTO(
                partido.getIdPartido(),
                partido.getTipoPartido(),
                partido.getCancha().getNombre(),
                partido.getCancha().getDireccion(),
                partido.getFechaPartido(),
                partido.getHoraPartido(),
                partido.getOrganizador().getUsername(),
                partido.getOrganizador().getEmail()
        );
    }
}
