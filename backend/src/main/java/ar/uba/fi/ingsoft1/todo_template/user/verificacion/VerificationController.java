package ar.uba.fi.ingsoft1.todo_template.user.verificacion;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;

@RestController
public class VerificationController {

    private final VerificationTokenRepository tokenRepo;

    private final UserRepository userRepo;

    public VerificationController(VerificationTokenRepository tokenRepo, UserRepository userRepo) {
        this.tokenRepo = tokenRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        VerificationToken vt = tokenRepo.findById(token).orElse(null);

        if (vt == null) {
            return ResponseEntity.badRequest().body("Token inválido");
        }

        if (vt.isExpired()) {
            return ResponseEntity.badRequest().body("Token expirado");
        }

        User user = vt.getUser();
        user.setVerified(true);
        userRepo.save(user);
        tokenRepo.delete(vt);

        return ResponseEntity.ok("Tu cuenta ha sido activada");
    }
}