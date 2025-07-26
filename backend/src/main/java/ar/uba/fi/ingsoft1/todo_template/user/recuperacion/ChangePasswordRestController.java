package ar.uba.fi.ingsoft1.todo_template.user.recuperacion;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ar.uba.fi.ingsoft1.todo_template.user.recuperacion.dto.ChangePasswordDTO;
import ar.uba.fi.ingsoft1.todo_template.user.recuperacion.dto.EmailDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@RestController
@RequestMapping("/change-password")
public class ChangePasswordRestController {
    private final ResetService resetService;

    public ChangePasswordRestController(ResetService resetService) {
        this.resetService = resetService;
    }

    @PostMapping()
    public ResponseEntity<Map<String, String>> solicitarResetPassword(@RequestBody EmailDTO email) {
        String msg = resetService.createResetToken(email);
        return ResponseEntity.ok(Map.of("message", msg));
    }


    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> cambiarPassword(
            @PathVariable String token,
            @RequestBody ChangePasswordDTO changePasswordDTO) {
        Map<String, String> msg = resetService.changePassword(token, changePasswordDTO);
        return ResponseEntity.ok(msg);
    }

}
