package ar.uba.fi.ingsoft1.todo_template.partido;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;

@Entity
public class Partido {

    @EmbeddedId
    private PartidoId idPartido;

    @MapsId("canchaId")
    @ManyToOne(optional = false)
    @JoinColumn(name = "cancha_id", referencedColumnName = "id")
    private Cancha cancha;

    @Column(nullable = false)
    private int cantJugadoresActuales = 0;

    @Column(nullable = false)
    private String emailOrganizador;

    @ManyToOne
    @JoinColumn(name="organizador_id", nullable = false, referencedColumnName = "username")
    private User organizador;

    @Column(nullable = true)
    private int minJugadores;

    @Column(nullable = true)
    private int maxJugadores;

    @Column(nullable = false)
    private int cuposDisponibles;

    @Column(nullable = false)
    private int duracionMinutos;

    private boolean partidoConfirmado = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "partido_abierto_inscriptos",
            joinColumns = { @JoinColumn(name = "cancha_id",referencedColumnName = "cancha_id"),
                    @JoinColumn(name = "fecha_partido", referencedColumnName = "fecha_partido"),
                    @JoinColumn(name = "hora_partido", referencedColumnName = "hora_partido") },
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> jugadores = new ArrayList<>();

    @Column(nullable = true)
    private String equipo1;

    @Column(nullable = true)
    private String equipo2;

    @Enumerated(EnumType.STRING)
    private TipoPartido tipoPartido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPartido estadoPartido = EstadoPartido.CONFIRMADO;


    public Partido() {}


    public PartidoId getIdPartido(){ return this.idPartido; }
    public void setIdPartido(PartidoId idPartido) { this.idPartido = idPartido; }

    public Cancha getCancha() { return this.cancha; }
    public void setCancha(Cancha cancha) { this.cancha = cancha; }

    public LocalDate getFechaPartido() { return idPartido != null ? idPartido.getFechaPartido() : null; }
    public LocalTime getHoraPartido() { return idPartido != null ? idPartido.getHoraPartido() : null; }

    public int getDuracionMinutos() { return duracionMinutos; }
    public void setDuracionMinutos(int duracionMinutos) { this.duracionMinutos = duracionMinutos; }

    public TipoPartido getTipoPartido() { return tipoPartido; }
    public void setTipoPartido(TipoPartido tipoPartido) { this.tipoPartido = tipoPartido; }

    public String getEquipo1() { return this.equipo1; }
    public void setEquipo1(String equipo1) { this.equipo1 = equipo1; }

    public String getEquipo2() { return this.equipo2; }
    public void setEquipo2(String equipo2) { this.equipo2 = equipo2; }

    public int getMinJugadores() { return minJugadores; }
    public void setMinJugadores(int minJugadores) { this.minJugadores = minJugadores; }

    public int getMaxJugadores() { return maxJugadores; }
    public void setMaxJugadores(int maxJugadores) { this.maxJugadores = maxJugadores; }

    public int getCuposDisponibles() { return cuposDisponibles; }
    public void setCuposDisponibles(int cuposDisponibles) { this.cuposDisponibles = cuposDisponibles; }

    public List<User> getJugadores() { return jugadores; }
    public void setJugadores(List<User> jugadores) { this.jugadores = jugadores; }

    public boolean hayCupos() { return cuposDisponibles > 0; }

    public boolean inscribirJugador(User user) {
        if (!jugadores.contains(user) && hayCupos()) {
            jugadores.add(user);
            cuposDisponibles--;
            actualizarEstado();
            return true;
        }
        return false;
    }

    public boolean desinscribirJugador(User user) {
        if (jugadores.contains(user)) {
            jugadores.remove(user);
            cuposDisponibles++;
            actualizarEstado();
            return true;
        }
        return false;
    }

    public boolean isPartidoConfirmado() { return partidoConfirmado; }
    public void setPartidoConfirmado(boolean partidoConfirmado) { this.partidoConfirmado = partidoConfirmado; }

    public int getCantJugadoresActuales() { return this.cantJugadoresActuales; }
    public void setCantJugadoresActuales(int cantJugadoresActuales) { this.cantJugadoresActuales = cantJugadoresActuales; }

    public String getEmailOrganizador() { return this.emailOrganizador; }
    public void setEmailOrganizador(String emailOrganizador) { this.emailOrganizador = emailOrganizador; }

    public User getOrganizador() { return organizador; }
    public void setOrganizador(User organizador) { this.organizador = organizador; }

    public EstadoPartido getEstadoPartido() { return estadoPartido; }
    public void setEstadoPartido(EstadoPartido estadoPartido) { this.estadoPartido = estadoPartido; }


    @Transient
    public EstadoPartido calcularEstadoPartido() {
        if (tipoPartido == TipoPartido.ABIERTO) {
            if (cuposDisponibles > 0 || jugadores.size() < minJugadores) {
                return EstadoPartido.EN_ESPERA;
            }
        }
        LocalDate hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();
        LocalDate fecha = getFechaPartido();
        LocalTime inicio = getHoraPartido();
        LocalTime fin = inicio != null ? inicio.plusMinutes(duracionMinutos) : null;

        if (fecha == null || inicio == null || fin == null) {
            return EstadoPartido.CONFIRMADO;
        }

        if (fecha.isAfter(hoy) || (fecha.isEqual(hoy) && ahora.isBefore(inicio))) {
            return EstadoPartido.CONFIRMADO;
        } else if (fecha.isEqual(hoy) && !ahora.isBefore(inicio) && ahora.isBefore(fin)) {
            return EstadoPartido.EN_CURSO;
        } else if (fecha.isBefore(hoy) || (fecha.isEqual(hoy) && !ahora.isBefore(fin))) {
            return EstadoPartido.TERMINADO;
        } else {
            return EstadoPartido.CONFIRMADO;
        }
    }

    @PrePersist @PreUpdate
    public void actualizarEstado() {
        this.estadoPartido = calcularEstadoPartido();
    }
}
