package ar.uba.fi.ingsoft1.todo_template.user.recuperacion;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import ar.uba.fi.ingsoft1.todo_template.user.recuperacion.dto.ChangePasswordDTO;
import ar.uba.fi.ingsoft1.todo_template.user.recuperacion.dto.EmailDTO;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.verificacion.EmailService;

@Service
public class ResetService {
    private final ResetRepository resetRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public ResetService(ResetRepository resetRepository, UserRepository userRepository, EmailService emailService, PasswordEncoder passwordEncoder) {
        this.resetRepository = resetRepository;
        this.userRepository = userRepository;   
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public String createResetToken(EmailDTO email) {
        User user = userRepository.findByEmail(email.email())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el email: " + email.email()));

        String token = UUID.randomUUID().toString();
        var resetToken = new ResetToken();
        resetToken.setValue(token);
        resetToken.setUser(user);
        resetToken.setExpiresAt(Instant.now().plus(1, ChronoUnit.HOURS));

        resetRepository.save(resetToken);

        String resetLink = "http://localhost:5173/change-password/" + token;

        emailService.sendResetPasswordEmail(
                user.getEmail(),
                "Recuperación de contraseña",
                resetLink
        );

        return "Enlace de recuperación enviado al correo electrónico: " + user.getEmail();
    }

    public Map<String, String> changePassword(String token, ChangePasswordDTO changePasswordDTO) {
        ResetToken resetToken = resetRepository.findById(token)
                .orElseThrow(() -> new RuntimeException("Token de recuperación no encontrado"));

        if (resetToken.isExpired()) {
            throw new RuntimeException("El token de recuperación ha expirado");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(changePasswordDTO.newPassword()));

        userRepository.save(user);
        resetRepository.delete(resetToken);

        return Map.of("message", "Contraseña cambiada exitosamente");
    }

}
