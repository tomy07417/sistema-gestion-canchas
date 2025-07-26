package ar.uba.fi.ingsoft1.todo_template.equipo;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ar.uba.fi.ingsoft1.todo_template.equipo.dtos.EquipoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.equipo.dtos.EquipoDTO;
import ar.uba.fi.ingsoft1.todo_template.equipo.dtos.EquipoUpdateDTO;

@RestController
@RequestMapping("/equipos")
public class EquipoRestController {

    private final EquipoService equipoService;

    public EquipoRestController(EquipoService equipoService) {
        this.equipoService = equipoService;
    }

    @PostMapping(produces = "application/json")
    @Operation(summary = "Crear un nuevo equipo")
    public ResponseEntity<EquipoDTO> crearEquipo(
            @Valid @NonNull @RequestBody EquipoCreateDTO equipoDTO
    ) {
        EquipoDTO equipoCreado = equipoService.crearEquipo(equipoDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(equipoCreado);
    }

    @PatchMapping(value = "/{teamName}", produces = "application/json")
    @Operation(summary = "Actualizar un equipo existente unicamente por el dueño")
    public ResponseEntity<EquipoDTO> actualizarEquipo(
            @PathVariable String teamName,
            @Valid @NonNull @RequestBody EquipoUpdateDTO equipoDTO
    ) {
        return ResponseEntity.ok(equipoService.actualizarEquipo(equipoDTO));
    }

    @GetMapping(produces = "application/json")
    @Operation(summary = "Obtener todos los equipos")
    public ResponseEntity<List<EquipoDTO>> obtenerEquipos() {
  
        return ResponseEntity.ok(equipoService.obtenerEquipos());
    }
}