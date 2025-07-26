package ar.uba.fi.ingsoft1.todo_template.reserva;

import ar.uba.fi.ingsoft1.todo_template.partido.Partido;
import ar.uba.fi.ingsoft1.todo_template.partido.TipoPartido;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Embeddable
public class StateReserva {
    @Column(nullable = false)
    private String state = "DISPONIBLE";

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private TipoPartido tipoPartido = null;
    
    @Column(nullable = true)
    private String emailOrganizador = null;

    public StateReserva() {}
    
    public StateReserva(TipoPartido tipo, String email) {
        this.state = "OCUPADA";
        this.tipoPartido = tipo;
        this.emailOrganizador = email;
    }

    public String getState() {
        return state;
    }   
    

    public TipoPartido getTipoPartido() {
        return tipoPartido;
    }

    public String getOrganizadorEmail() {
        return emailOrganizador;
    }

    public StateReserva changeState(Partido partido) {
        if (partido == null) {
            return new StateReserva();
        }


        TipoPartido tipo = partido.getTipoPartido();
        String email = partido.getOrganizador().getEmail();

        return new StateReserva(tipo, email);
    }
}
