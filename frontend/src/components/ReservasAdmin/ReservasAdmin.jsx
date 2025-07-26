import "./ReservasAdmin.css"
export function ReservasHeader() {
    return (
        <article className="reservas-header">
            <p className="headers">Mis canchas</p>
            <p className="headers">Estado</p>
            <p className="headers">Tipo de Partido</p>
            <p className="headers">Hora</p>
            <p className="headers">Usuario</p>
            <p className="headers"></p>
        </article>
    );
}

export function InfoReserva({ nombreCancha, estado, tipo, hora, usuario }) {
    return (
        <article className="reserva-info">
            <p className="info">{nombreCancha}</p>
            <p className="info">{estado}</p>
            <p className="info">{tipo}</p>
            <p className="info">{hora}</p>
            <p className="info">{usuario}</p>
            <p className="info">---</p>
        </article>
    );
}