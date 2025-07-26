package ar.uba.fi.ingsoft1.todo_template.partido;

import ar.uba.fi.ingsoft1.todo_template.partido.dtos.JugadorDTO;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

public record PartidoAbiertoResponseDTO(
        PartidoId idPartido,
        Long canchaId,
        String canchaNombre,
        String canchaDireccion,
        LocalDate fechaPartido,
        LocalTime horaPartido,
        Integer minJugador,
        Integer maxJugador,
        Integer cuposDisponibles,
        String organizadorId,
        String emailOrganizador,
        boolean inscripto,
        boolean partidoConfirmado,
        List<JugadorDTO> jugadores
) {
    public static PartidoAbiertoResponseDTO fromEntity(Partido partido, String usuarioLogueadoId){
        boolean inscripto = partido.getJugadores().stream()
                .anyMatch(j -> j.getUsername().equals(usuarioLogueadoId));

        List<JugadorDTO> jugadoresDTO = partido.getJugadores().stream()
                .map(JugadorDTO::fromEntity)
                .collect(Collectors.toList());

        return new PartidoAbiertoResponseDTO(
                partido.getIdPartido(),
                partido.getCancha().getId(),
                partido.getCancha().getNombre(),
                partido.getCancha().getDireccion(),
                partido.getFechaPartido(),
                partido.getHoraPartido(),
                partido.getMinJugadores(),
                partido.getMaxJugadores(),
                partido.getCuposDisponibles(),
                partido.getOrganizador().getUsername(),
                partido.getOrganizador().getEmail(),
                inscripto,
                partido.isPartidoConfirmado(),
                jugadoresDTO
        );
    }
}
