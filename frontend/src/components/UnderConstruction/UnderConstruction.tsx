import "./Estadisticas.css";
// @ts-ignore
import {MiHeatmap,MiScatterChart, MiGraficoDeLineas, MiGraficoDeBarras, MiGraficoDeTorta, MiGraficoDeBarrasApiladas } from "./graficos";

export const UnderConstruction = () => {
const data = [
    { nombre: "Cancha 1", reservas: 15 },
    { nombre: "Cancha 2", reservas: 8 },
    { nombre: "Cancha 3", reservas: 21 },
    { nombre: "Cancha 4", reservas: 12 },
    { nombre: "Cancha 5", reservas: 18 },
    { nombre: "Cancha 6", reservas: 10 },
    { nombre: "Cancha 7", reservas: 25 },
    { nombre: "Cancha 8", reservas: 5 },
];

const dataMensual = [
    { mes: "Ene", reservas: 20 },
    { mes: "Feb", reservas: 35 },
    { mes: "Mar", reservas: 25 },
    { mes: "Abr", reservas: 40 },
    { mes: "May", reservas: 30 },
    { mes: "Jun", reservas: 50 },
];

const dataSemanal = [
    { dia: "Lunes", reservas: 12 },
    { dia: "Martes", reservas: 9 },
    { dia: "Miércoles", reservas: 14 },
    { dia: "Jueves", reservas: 10 },
    { dia: "Viernes", reservas: 20 },
    { dia: "Sábado", reservas: 18 },
    { dia: "Domingo", reservas: 7 },
];



const datacancha = [
  {
    cancha: "Cancha 1",
    confirmadas: 5,
    pendientes: 2,
    canceladas: 1,
    terminadas: 7,
    abiertos: 8,
    cerrados: 7,
  },
  {
    cancha: "Cancha 2",
    confirmadas: 3,
    pendientes: 4,
    canceladas: 0,
    terminadas: 10,
    abiertos: 9,
    cerrados: 8,
  },

];

return (
    <div className="fondo-negro"style={{ width: "100%", display: "flex", padding: "40px",gap: "40px",    }}>
        
        <div style={{display: "flex", flexDirection: "column", width: "50%", gap: "40px", }}>
          
            <MiGraficoDeBarras data={data} />
          
            <MiGraficoDeLineas dataMensual={dataMensual} />
        </div>

       
        <div style={{ display: "flex", flexDirection: "column", width: "50%", gap: "40px",}}>
          
            <MiGraficoDeTorta dataSemanal={dataSemanal} />
           
            <MiGraficoDeBarrasApiladas datacancha={datacancha} />
        </div>
    </div>

);
};

