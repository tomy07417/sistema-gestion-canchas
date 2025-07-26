package ar.uba.fi.ingsoft1.todo_template.canchas.dto;

public class CanchaEditDTO {
    private String nombre;
    private String direccion;
    private String tipoCesped;
    private Boolean iluminacion;
    private String zona;
    private Boolean activa;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTipoCesped() {
        return tipoCesped;
    }

    public void setTipoCesped(String tipoCesped) {
        this.tipoCesped = tipoCesped;
    }

    public Boolean getIluminacion() {
        return iluminacion;
    }

    public void setIluminacion(Boolean iluminacion) {
        this.iluminacion = iluminacion;
    }

    public String getZona() {
        return zona;
    }

    public void setZona(String zona) {
        this.zona = zona;
    }

    public Boolean getActiva() {return activa; }

    public void setActiva(Boolean activa) { this.activa = activa; }
}
