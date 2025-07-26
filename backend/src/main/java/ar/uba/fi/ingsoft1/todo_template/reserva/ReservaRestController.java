package ar.uba.fi.ingsoft1.todo_template.reserva;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaDTO;
import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaIdDTO;


@RestController
@RequestMapping("/reservas")
public class ReservaRestController {

    private final ReservaService reservaService;

    public ReservaRestController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    public ResponseEntity<String> crearReserva(@Valid @RequestBody ReservaCreateDTO dto) {
        return ResponseEntity.ok(reservaService.crearReservas(dto));
    }

    @PatchMapping()
    public ResponseEntity<ReservaDTO> actualizarReserva(@Valid @RequestBody ReservaIdDTO dto) {
        return ResponseEntity.ok(reservaService.actualizarReserva(dto));
    }

    @GetMapping
    public ResponseEntity<List<ReservaDTO>> obtenerReserva() {
        return ResponseEntity.ok(reservaService.obtenerReserva());
    }
    @GetMapping("/disponibles")
    public List<ReservaDTO> getDisponibles(
            @RequestParam LocalDate fecha,
            @RequestParam(required = false) String zona
    ) {
        return reservaService.obtenerDisponibles(fecha, zona);
    }
}
