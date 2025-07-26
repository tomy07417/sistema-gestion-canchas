package ar.uba.fi.ingsoft1.todo_template.canchas;

import java.util.List;

import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaDTO;
import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaEditDTO;

@RestController
@RequestMapping("/canchas")
public class CanchaRestController {

    private final CanchaService canchaService;

    public CanchaRestController(CanchaService canchaService) {
        this.canchaService = canchaService;
    }

    @GetMapping
    public ResponseEntity<List<CanchaDTO>> getAllCanchas() {
        return ResponseEntity.ok(canchaService.listarCanchas());
    }

    @GetMapping("/todas")
    public ResponseEntity<List<CanchaDTO>> getMisCanchas(Authentication authentication) {
        JwtUserDetails userDetails = (JwtUserDetails) authentication.getPrincipal();
        String userId = userDetails.username();
        return ResponseEntity.ok(canchaService.listarTodasLasCanchas(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CanchaDTO> getCanchaById(@PathVariable Long id) {
        return ResponseEntity.ok(canchaService.obtenerCancha(id));
    }

    @PostMapping
    public ResponseEntity<CanchaDTO> crearCancha(@RequestBody CanchaCreateDTO dto) {
        CanchaDTO creada = canchaService.crearCancha(dto);
        return new ResponseEntity<>(creada, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CanchaDTO> editarCancha(@PathVariable Long id, @RequestBody CanchaEditDTO dto) {
        return ResponseEntity.ok(canchaService.editarCancha(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCancha(@PathVariable Long id) {
        canchaService.eliminarCancha(id);
        return ResponseEntity.noContent().build();
    }
}
