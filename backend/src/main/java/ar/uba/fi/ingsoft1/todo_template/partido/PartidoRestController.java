package ar.uba.fi.ingsoft1.todo_template.partido;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import ar.uba.fi.ingsoft1.todo_template.partido.dtos.PartidoAbiertoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.partido.dtos.PartidoCerradoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;


@RestController
@RequestMapping("/partidos")
public class PartidoRestController {

    private final PartidoService partidoService;


    public PartidoRestController(PartidoService partidoService) {
        this.partidoService = partidoService;
    }

    @Operation(summary = "Crear un partido abierto")
    @PostMapping("/abierto")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<PartidoAbiertoResponseDTO> crearAbierto(@Valid @RequestBody PartidoAbiertoCreateDTO dto) {
        Partido partido = partidoService.crearPartido(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header("Location", "/partidos/" + partido.getIdPartido())
                .body(PartidoAbiertoResponseDTO.fromEntity(partido, partido.getOrganizador().getUsername()));
    }

    @Operation(summary = "Crear un partido cerrado")
    @PostMapping("/cerrado")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<PartidoCerradoResponseDTO> crearCerrado(@Valid @RequestBody PartidoCerradoCreateDTO dto) {
        Partido partido = partidoService.crearPartido(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header("Location", "/partidos/" + partido.getIdPartido())
                .body(PartidoCerradoResponseDTO.fromEntity(partido));
    }

    @Operation(summary = "Listar todos los partidos abiertos")
    @GetMapping("/abiertos")
    public ResponseEntity<List<PartidoAbiertoResponseDTO>> listarPartidosAbiertos(Authentication authentication) {
        JwtUserDetails userDetails = (JwtUserDetails) authentication.getPrincipal();
        String usuarioLogueadoId = userDetails.username();
        List<PartidoAbiertoResponseDTO> lista = partidoService.obtenerPartidosAbiertosIncluyendoInscripcion(usuarioLogueadoId);
        return ResponseEntity.ok(lista);
    }



    @Operation(summary = "Listar todos los partidos cerrados")
    @GetMapping("/cerrados")
    public ResponseEntity<List<PartidoCerradoResponseDTO>> listarPartidosCerrados() {
        List<PartidoCerradoResponseDTO> lista = partidoService
                .obtenerPartidoCerrados()
                .stream()
                .map(PartidoCerradoResponseDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(lista);
    }
    @Operation(summary = "Inscribir usuario a partido abierto")
    @PostMapping("/abierto/inscribir/{canchaId}/{fechaPartido}/{horaPartido}")
    public ResponseEntity<?> inscribirAAbierto(
        @PathVariable Long canchaId,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaPartido,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime horaPartido,
        Authentication authentication) {

        JwtUserDetails userDetails = (JwtUserDetails) authentication.getPrincipal();
        String userId = userDetails.username();

        PartidoId partidoId = new PartidoId(canchaId, fechaPartido, horaPartido);
        partidoService.inscribirAAbierto(partidoId, userId);
        return ResponseEntity.ok(Map.of("mensaje", "Inscripción exitosa"));
    }

    @Operation(summary = "Desinscribir usuario de partido abierto")
    @PostMapping("/abierto/desinscribir/{canchaId}/{fechaPartido}/{horaPartido}")
    public ResponseEntity<?> desinscribirDeAbierto(
        @PathVariable Long canchaId,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaPartido,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime horaPartido,
        Authentication authentication) {

        JwtUserDetails userDetails = (JwtUserDetails) authentication.getPrincipal();
        String userId = userDetails.username();

        PartidoId partidoId = new PartidoId(canchaId, fechaPartido, horaPartido);
        partidoService.desinscribirDeAbierto(partidoId, userId);
        return ResponseEntity.ok(Map.of("mensaje", "Desinscripción exitosa"));
    }

    @Operation(summary = "Historial de partidos del usuario autenticado")
    @GetMapping("/mis-partidos")
    public ResponseEntity<Map<String, List<?>>> miHistorial(Authentication authentication) {
        JwtUserDetails userDetails = (JwtUserDetails) authentication.getPrincipal();
        String usuarioLogueadoId = userDetails.username();

        List<PartidoAbiertoResponseDTO> partidosAbiertos =
                partidoService.historialPartidosAbiertosPorUsuario(usuarioLogueadoId)
                        .stream()
                        .map(pa -> PartidoAbiertoResponseDTO.fromEntity(pa, usuarioLogueadoId))
                        .toList();

        List<PartidoCerradoResponseDTO> partidosCerrados =
                partidoService.historialPartidosCerradosPorUsuario(usuarioLogueadoId)
                        .stream()
                        .map(PartidoCerradoResponseDTO::fromEntity)
                        .toList();

        return ResponseEntity.ok(Map.of(
                "partidos_abiertos", partidosAbiertos,
                "partidos_cerrados", partidosCerrados
        ));
    }

    @Operation(summary = "Generar invitación para un partido")
    @PostMapping("/abierto/{canchaId}/{fechaPartido}/{horaPartido}/invitar")
    public ResponseEntity<?> invitarAAbierto(
            @PathVariable Long canchaId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaPartido,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime horaPartido,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String email = body != null ? body.get("email") : null;
        String token = partidoService.generarInvitacion(canchaId, fechaPartido, horaPartido, email);
        String url = "http://localhost:5173/signup?invite=" + token;
        return ResponseEntity.ok(Map.of("inviteToken", token, "url", url));
    }





}
