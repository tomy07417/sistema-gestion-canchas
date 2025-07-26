import { Redirect, Route, Switch } from "wouter";

import { LoginScreen } from "@/screens/LoginScreen";
import { MainScreen } from "@/screens/MainScreen";
import  SignupScreen  from "@/screens/SignupScreen";
import { useToken } from "@/services/TokenContext";
import { getUserRole } from "@/services/getUserRole";
import CanchasScreen from "@/screens/CrearCancha";
import { HistorialScreen } from "@/screens/HistorialScreen";
import { UserListaTorneo } from "@/screens/UserListaTorneo";
import UserEditarTorneoScreen from "./screens/UserEditarTorneoScreen";
import EditarCanchaScreen from "@/screens/EditarCanchaScreen";
import ListaPartidosAbiertos from "./screens/ListaPartidosAbiertos";
import { CrearEquipo } from "./screens/CrearEquipo";
import MisEquipos from "./screens/MisEquipos";
import { EditarEquipoScreen } from "./screens/EditarEquipoScreen";
import { ReservasScreen } from "./screens/CrearReservaScreen";
import { CrearTorneo } from "./screens/CrearTorneo";
import { AdministrarReservasScreen } from "./screens/AdministrarReservasScreen";
import RecuperarScreen from "./screens/RecuperarScreen";
import EnviaremailScreen from "./screens/EnviaremailScreen";
import MisTorneosScreen from "./screens/misTorneos";


export const Navigation = () => {
  const [tokenState] = useToken();
            
  if (tokenState.state === "LOGGED_IN") {
    const role = getUserRole(tokenState.accessToken);

    if (role === "ADMINISTRADOR") {
      return (
        <Switch>
          <Route path="/">
            <MainScreen />
          </Route>
          <Route path="/listar-partidos-abiertos">
            <ListaPartidosAbiertos />
          </Route>
          <Route path="/crear-cancha">
            <CanchasScreen />
          </Route>
          <Route path="/admin/canchas/:id">
            <EditarCanchaScreen />
          </Route>
          <Route path="/crear-reserva">
            <ReservasScreen />
          </Route>
          <Route path="/administrar-reservas">
            <AdministrarReservasScreen />
          </Route>
          <Route path="/crear-equipo">
            <CrearEquipo />
          </Route>
          <Route path="/mis-equipos">
            <MisEquipos />
          </Route>
          <Route path="/admin/equipos/:nombreEquipo">
            <EditarEquipoScreen />
          </Route>
          <Route path="/crear-torneo">
            <CrearTorneo />
          </Route>
          <Route path="/ver-historial">
            <HistorialScreen />
          </Route>
          <Route path="/listar-torneos">
            <UserListaTorneo />
          </Route>
          <Route path="/admin/torneos/:nombreTorneo">
            <UserEditarTorneoScreen />
          </Route>
          <Route path="/mis-torneos">
            <MisTorneosScreen />
          </Route>
          <Route>
            <Redirect href="/" />
          </Route>
        </Switch>
      );
    }

    if (role === "ORGANIZADOR") {
      return (
        <Switch>
          <Route path="/">
            <MainScreen />
          </Route>
          <Route path="/crear-equipo">
            <CrearEquipo />
          </Route>
          <Route path="/mis-equipos">
            <MisEquipos />
          </Route>
          <Route path="/admin/equipos/:nombreEquipo">
            <EditarEquipoScreen />
          </Route>
          <Route path="/listar-torneos">
            <UserListaTorneo />
          </Route>
          <Route path="/listar-partidos-abiertos">
            <ListaPartidosAbiertos />
          </Route>
          <Route path="/crear-reserva">
            <ReservasScreen />
          </Route>
          <Route path="/crear-torneo">
            <CrearTorneo />
          </Route>
          <Route path="/ver-historial">
            <HistorialScreen />
          </Route>
          <Route path="/mis-torneos">
            <MisTorneosScreen />
          </Route>
          <Route path="/admin/torneos/:nombreTorneo">
            <UserEditarTorneoScreen />
          </Route>
          <Route>
            <Redirect href="/" />
          </Route>
        </Switch>
      );
    }

    if (role === "JUGADOR") {
      return (
        <Switch>
          <Route path="/">
            <MainScreen />
          </Route>
          <Route path="/crear-reserva">
            <ReservasScreen />
          </Route>
          <Route path="/crear-equipo">
            <CrearEquipo />
          </Route>
          <Route path="/mis-equipos">
            <MisEquipos />
          </Route>
          <Route path="/admin/equipos/:nombreEquipo">
            <EditarEquipoScreen />
          </Route>
          <Route path="/listar-torneos">
            <UserListaTorneo />
          </Route>
          <Route path="/listar-partidos-abiertos">
            <ListaPartidosAbiertos />
          </Route>
            <Route path="/ver-historial">
                <HistorialScreen />
            </Route>

            <Route path="/mis-torneos">
                <MisTorneosScreen />
            </Route>
          <Route>
            <Redirect href="/" />
          </Route>
        </Switch>
      );
    }
  }

  return (
    <Switch>
      <Route path="/reset-password">
        <EnviaremailScreen />
      </Route>
      <Route path="/change-password/:token">
        <RecuperarScreen />
      </Route>
      <Route path="/login">
        <LoginScreen />
      </Route>
      <Route path="/signup">
        <SignupScreen />
      </Route>
      <Route>
        <Redirect href="/signup" />
      </Route>
    </Switch>
  );
};

