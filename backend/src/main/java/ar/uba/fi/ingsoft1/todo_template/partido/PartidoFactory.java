package ar.uba.fi.ingsoft1.todo_template.partido;

import org.springframework.stereotype.Component;

import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;

import ar.uba.fi.ingsoft1.todo_template.partido.dtos.PartidoAbiertoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.partido.dtos.PartidoCerradoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.partido.dtos.PartidoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.user.User;

@Component
public class PartidoFactory {

    public Partido crearPartido(PartidoCreateDTO partidoCreateDTO, Cancha cancha, User organizador) {
        Partido partido = new Partido();
        PartidoId partidoId = new PartidoId(
                partidoCreateDTO.canchaId(),
                partidoCreateDTO.fechaPartido(),
                partidoCreateDTO.horaPartido()
        );
        partido.setIdPartido(partidoId);
        partido.setCancha(cancha);
        partido.setTipoPartido(partidoCreateDTO.tipoPartido());
        partido.setDuracionMinutos(partidoCreateDTO.duracionMinutos());


        if (partidoCreateDTO.tipoPartido() == TipoPartido.CERRADO) {
            PartidoCerradoCreateDTO partidoCerrado = (PartidoCerradoCreateDTO) partidoCreateDTO;        
            
            partido.setEquipo1(partidoCerrado.equipo1());
            partido.setEquipo2(partidoCerrado.equipo2());


        } else if (partidoCreateDTO.tipoPartido() == TipoPartido.ABIERTO) {
            PartidoAbiertoCreateDTO partidoAbierto = (PartidoAbiertoCreateDTO) partidoCreateDTO;
            partido.setMinJugadores(partidoAbierto.minJugadores());
            partido.setMaxJugadores(partidoAbierto.maxJugadores());
            partido.setCuposDisponibles(partidoAbierto.cuposDisponibles());
        } else {
            throw new IllegalArgumentException("Tipo de partido no soportado: " + partidoCreateDTO.tipoPartido());
        }
        return asignarOrganizador(partido, organizador);
    }
    private Partido asignarOrganizador(Partido partido, User organizador) {
        partido.setOrganizador(organizador);
        partido.setEmailOrganizador(organizador.getEmail());
        return partido;
    }

}
