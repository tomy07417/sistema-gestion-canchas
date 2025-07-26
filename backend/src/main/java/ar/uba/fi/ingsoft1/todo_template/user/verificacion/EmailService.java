package ar.uba.fi.ingsoft1.todo_template.user.verificacion;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    private final String fromEmail;

    public EmailService(@Value("${spring.mail.username}") String fromEmail, JavaMailSender mailSender) {
        this.fromEmail = fromEmail;
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String subject, String verificationLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);

            String htmlContent = "<p>Hola,</p>"
                    + "<p>Gracias por registrarte. Haz clic en el siguiente enlace para verificar tu correo:</p>"
                    + "<p><a href=\"" + verificationLink + "\">Verificar mi cuenta</a></p>"
                    + "<br><p>Este enlace expirará en 24 horas.</p>";

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("No se pudo enviar el correo de verificación", e);
        }
    }


    public void sendCreationPartido(String toEmail, String cancha, String fecha, String hora,String tipoPartido) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Confirmación de la reserva para el partido "+tipoPartido.toLowerCase());

            String htmlContent = "<p>¡Hola!</p>"
                    + "<p>Tu reserva fue confirmada con éxito. Estos son los detalles:</p>"
                    + "<p><strong>Cancha:</strong> " + cancha + "</p>"
                    + "<p><strong>Fecha:</strong> " + fecha + "</p>"
                    + "<p><strong>Hora:</strong> " + hora + "</p>"
                    + "<br><p>¡Gracias por Reserva!</p>";

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("No se pudo enviar el correo de confirmación", e);
        }
    }

    public void sendInscripcionPartido(String toEmail, String cancha, String fecha, String hora) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Inscripción confirmada a partido abierto");

            String htmlContent = "<p>¡Hola!</p>"
                    + "<p>Te has inscripto exitosamente en el partido abierto.</p>"
                    + "<p><strong>Cancha:</strong> " + cancha + "</p>"
                    + "<p><strong>Fecha:</strong> " + fecha + "</p>"
                    + "<p><strong>Hora:</strong> " + hora + "</p>"
                    + "<br><p>¡Te esperamos!</p>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("No se pudo enviar el correo de inscripción", e);
        }
    }

    public void sendDesinscripcionPartido(String toEmail, String cancha, String fecha, String hora) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Baja de partido abierto");

            String htmlContent = "<p>Hola,</p>"
                    + "<p>Te has dado de baja correctamente del partido abierto.</p>"
                    + "<p><strong>Cancha:</strong> " + cancha + "</p>"
                    + "<p><strong>Fecha:</strong> " + fecha + "</p>"
                    + "<p><strong>Hora:</strong> " + hora + "</p>"
                    + "<br><p>Esperamos verte en la próxima oportunidad.</p>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("No se pudo enviar el correo de baja", e);
        }
    }

    public void sendResetPasswordEmail(String toEmail, String subject, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);

            String htmlContent = "<p>Hola,</p>"
                    + "<p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>"
                    + "<p><a href=\"" + resetLink + "\">Restablecer mi contraseña</a></p>"
                    + "<br><p>Este enlace expirará en 24 horas.</p>";

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("No se pudo enviar el correo de restablecimiento de contraseña", e);
        }
    }

}
