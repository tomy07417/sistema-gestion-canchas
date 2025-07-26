package ar.uba.fi.ingsoft1.todo_template.torneo;

import jakarta.persistence.*;

import java.time.LocalDate;

import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoDTO;
import ar.uba.fi.ingsoft1.todo_template.user.User;

@Entity
@Table(name = "torneos", uniqueConstraints = @UniqueConstraint(columnNames = "nombre"))
public class Torneo {
    @Id
    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TorneoFormato formato;

    @Column(name = "cantidad_maxima_equipos", nullable = false)
    private Integer cantidadMaximaEquipos;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column
    private String premios;

    @Column(name = "costo_inscripcion")
    private Double costoInscripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTorneo estado = EstadoTorneo.ABIERTO;

    @ManyToOne(optional = false)
    @JoinColumn(name = "organizador_id", referencedColumnName = "username")
    private User organizador;

    public Torneo() {
    }

    public Torneo(String nombre,
                  LocalDate fechaInicio,
                  LocalDate fechaFin,
                  TorneoFormato formato,
                  Integer cantidadMaximaEquipos,
                  String descripcion,
                  String premios,
                  Double costoInscripcion) {
        this.nombre = nombre;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.formato = formato;
        this.cantidadMaximaEquipos = cantidadMaximaEquipos;
        this.descripcion = descripcion;
        this.premios = premios;
        this.costoInscripcion = costoInscripcion;
        this.estado = EstadoTorneo.ABIERTO;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public TorneoFormato getFormato() {
        return formato;
    }

    public void setFormato(TorneoFormato formato) {
        this.formato = formato;
    }

    public Integer getCantidadMaximaEquipos() {
        return cantidadMaximaEquipos;
    }

    public void setCantidadMaximaEquipos(Integer cantidadMaximaEquipos) {
        this.cantidadMaximaEquipos = cantidadMaximaEquipos;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getPremios() {
        return premios;
    }

    public void setPremios(String premios) {
        this.premios = premios;
    }

    public Double getCostoInscripcion() {
        return costoInscripcion;
    }

    public void setCostoInscripcion(Double costoInscripcion) {
        this.costoInscripcion = costoInscripcion;
    }

    public EstadoTorneo getEstado() {
        return estado;
    }

    public void setEstado(EstadoTorneo estado) {
        this.estado = estado;
    }

    public User getOrganizador() {
        return organizador;
    }

    public void setOrganizador(User organizador) {
        this.organizador = organizador;
    }

    public boolean isStarted() {
        return this.estado == EstadoTorneo.EN_CURSO;
    }

    public TorneoDTO toDTO() {
        return new TorneoDTO(
                nombre,
                fechaInicio,
                fechaFin,
                formato,
                cantidadMaximaEquipos,
                descripcion,
                premios,
                costoInscripcion,
                estado,
                organizador.getUsername()
        );
    }
}
