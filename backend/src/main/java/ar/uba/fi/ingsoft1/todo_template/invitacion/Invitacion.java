package ar.uba.fi.ingsoft1.todo_template.invitacion;

import ar.uba.fi.ingsoft1.todo_template.partido.Partido;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Invitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(optional = false)
    @JoinColumns({
            @JoinColumn(name = "cancha_id", referencedColumnName = "cancha_id"),
            @JoinColumn(name = "fecha_partido", referencedColumnName = "fecha_partido"),
            @JoinColumn(name = "hora_partido", referencedColumnName = "hora_partido")
    })
    private Partido partido;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private LocalDateTime fechaExpiracion;

    @Column
    private String emailInvitado;

    @Column(nullable = false)
    private boolean aceptada = false;

    public Invitacion() {}

    public Invitacion(String token, Partido partido, LocalDateTime fechaCreacion, LocalDateTime fechaExpiracion, String emailInvitado) {
        this.token = token;
        this.partido = partido;
        this.fechaCreacion = fechaCreacion;
        this.fechaExpiracion = fechaExpiracion;
        this.emailInvitado = emailInvitado;
        this.aceptada = false;
    }


    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }

    public Partido getPartido() {
        return partido;
    }
    public void setPartido(Partido partido) {
        this.partido = partido;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaExpiracion() {
        return fechaExpiracion;
    }
    public void setFechaExpiracion(LocalDateTime fechaExpiracion) {
        this.fechaExpiracion = fechaExpiracion;
    }

    public String getEmailInvitado() {
        return emailInvitado;
    }
    public void setEmailInvitado(String emailInvitado) {
        this.emailInvitado = emailInvitado;
    }

    public boolean isAceptada() {
        return aceptada;
    }
    public void setAceptada(boolean aceptada) {
        this.aceptada = aceptada;
    }
}
