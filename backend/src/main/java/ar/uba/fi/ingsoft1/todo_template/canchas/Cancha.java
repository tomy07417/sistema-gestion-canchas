package ar.uba.fi.ingsoft1.todo_template.canchas;

import jakarta.persistence.*;
import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaDTO;
import ar.uba.fi.ingsoft1.todo_template.user.User;


@Entity
@Table(
    name = "canchas",
    uniqueConstraints = @UniqueConstraint(columnNames = {"nombre","zona","direccion"})
)
public class Cancha {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String tipoCesped;

    @Column(nullable = false)
    private boolean iluminacion;

    @Column(nullable = false)
    private String zona;

    @Column(nullable = false)
    private String direccion;

    @ManyToOne(optional = false)
    @JoinColumn(name = "propietario_id", referencedColumnName = "username")
    private User propietario;

    @Column(nullable = false)
    private boolean activa = true;

    public Cancha() {
        
    }

    public Cancha(String nombre, String tipoCesped, boolean iluminacion, String zona, String direccion, User propietario) {
        this.nombre = nombre;
        this.tipoCesped = tipoCesped;
        this.iluminacion = iluminacion;
        this.zona = zona;
        this.direccion = direccion;
        this.propietario = propietario;

    }


    public Long getId() { return id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getTipoCesped() { return tipoCesped; }
    public void setTipoCesped(String tipoCesped) { this.tipoCesped = tipoCesped; }

    public boolean isIluminacion() { return iluminacion; }
    public void setIluminacion(boolean iluminacion) { this.iluminacion = iluminacion; }

    public String getZona() { return zona; }
    public void setZona(String zona) { this.zona = zona; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public User getPropietario() { return propietario; }
    public void setPropietario(User propietario) { this.propietario = propietario; }

    public boolean getActiva() { return activa; }
    public void setActiva(boolean activa) { this.activa = activa; }

    public CanchaDTO toDTO() {
        return new CanchaDTO(
            this.id,
            this.nombre,
            this.tipoCesped,
            this.iluminacion,
            this.zona,
            this.direccion,
            this.propietario.getUsername(),
            this.activa
        );
    }
}
