import React from "react";
import { Link } from "wouter";
import { useToken } from "@/services/TokenContext";
import { getUserRole } from "@/services/getUserRole";
import { useCurrentUser } from "@/services/UserServices";
import styles from "./CommonLayout.module.css";

export const CommonLayout = ({ children }: React.PropsWithChildren) => {
    const [tokenState] = useToken();

    return (
        <div className={styles.mainLayout}>
            <aside className={styles.sidebar}>
                {tokenState.state === "LOGGED_IN" && <ProfileBox />}
                <ul className={styles.menu}>
                    {tokenState.state === "LOGGED_OUT" ? <LoggedOutLinks /> : <LoggedInLinks />}
                </ul>
            </aside>
            <main className={styles.mainContent}>{children}</main>
        </div>
    );
};

const ProfileBox = () => {
    const { data: user, isLoading } = useCurrentUser();

    if (isLoading) {
        return (
            <div className={styles.profile}>
                <div>Cargando...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className={styles.profile}>
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                alt="Foto de perfil"
                className={styles.avatar}
            />
            <div className={styles.name}>{user.nombre}</div>
            <div className={styles.email}>{user.email}</div>
        </div>
    );
};

const LoggedOutLinks = () => (
    <>
        <li>
            <Link href="/login">Log in</Link>
        </li>
        <li>
            <Link href="/signup">Sign Up</Link>
        </li>
         <li>
            <Link href="/reset-password">Recuperar </Link>
        </li>
    </>
);

const LoggedInLinks = () => {
    const [tokenState, setTokenState] = useToken();
    const role = tokenState.state === "LOGGED_IN" ? getUserRole(tokenState.accessToken) : null;

    const logOut = () => setTokenState({ state: "LOGGED_OUT" });

    return (
        <>
            <li>
                <Link href="/under-construction">Main Page</Link>
            </li>
            <li>
                <Link href="/crear-equipo">Crear Equipo</Link>
            </li>
            <li>
                <Link href="/mis-equipos">Mis Equipos</Link>
            </li>
            <li>
                <Link href="/listar-torneos">Torneos Disponibles</Link>
            </li>
            <li>
                <Link href="/crear-reserva">Crear reserva</Link>
            </li>
            <li>
                <Link href="/listar-partidos-abiertos">Listar partidos abiertos</Link>
            </li>
            <li>
                <Link href="/ver-historial">Mis partidos</Link>
            </li>

            {(role === "ORGANIZADOR" || role === "ADMINISTRADOR") && (
                <>
                    <li>
                        <Link href="/crear-torneo">Crear Torneo</Link>
                    </li>
                    <li>
                        <Link href="/mis-torneos">Mis Torneos</Link>
                    </li>
                </>
            )}

            {role === "ADMINISTRADOR" && (
                <>
                    <li>
                        <Link href="/ver-historial">Historial</Link>
                    </li>
                    <li>
                        <Link href="/crear-cancha">Mis canchas</Link>
                    </li>

                    <li>
                        <Link href="/administrar-reservas">Administrar reserva</Link>
                    </li>
                </>
            )}

            <li>
                <button className={styles.logoutButton} onClick={logOut}>
                    Log out
                </button>
            </li>
        </>
    );
};