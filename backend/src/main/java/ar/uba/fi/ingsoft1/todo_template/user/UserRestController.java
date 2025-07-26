package ar.uba.fi.ingsoft1.todo_template.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
import ar.uba.fi.ingsoft1.todo_template.user.dtos.UserCreateDTO;

import java.util.Map;

@RestController
@RequestMapping("/users")
@Tag(name = "1 - Users")
public class UserRestController {
    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(produces = "application/json")
    @Operation(summary = "Create a new user (soporta token de invitación opcional)")
    public ResponseEntity<Map<String, String>> signUp(
            @Valid @RequestBody UserCreateDTO data,
            @RequestParam(name = "invite", required = false) String invite
    ) {
        userService.createUser(data, invite);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Usuario creado exitosamente"));
    }


    @GetMapping("/me")
    @Operation(summary = "Get current logged-in user's name and email")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal JwtUserDetails jwtUser) {
        if (jwtUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userService.obtenerUsuarioPorId(jwtUser.username());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Map<String, String> dto = Map.of(
                "nombre", user.getNombre(),
                "email", user.getEmail()
        );
        return ResponseEntity.ok(dto);
    }

}
