
import "./Estadisticas.css";

import { ScatterChart, ResponsiveContainer, Scatter, PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid, Legend } from "recharts";

const getColor = (value) => {
  if (value > 7) return "#00429d";
  if (value > 4) return "#2a72d9";
  if (value > 1) return "#87b9ff";
  return "#e0e0e0";
};
const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const colores = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000"];
const colores_pie = ["#4caf50", "#ffeb3b", "#f44336", "#2196f3", "#ff9800", "#9c27b0", "#3f51b5", ];

export const MiGraficoDeBarras = ({data}) => {
    
    return (
        <div style={{ display: "flex", flexDirection: "column", width: "65%", gap: "40px" }}>
            <div style={{ height: 300 }}>
            <h3 style={{ textAlign: "center", marginBottom: "10px", color: "white" }}>
                Estadísticas de Reservas por Cancha
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reservas">
                    {data.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>
            </div>
    </div>
    );
};

export const MiGraficoDeLineas = ({dataMensual}) => {
    return (
        <div style={{ height: 300 }}>
            <h3 style={{ textAlign: "center", marginBottom: "10px", color: "white" }}>
                Reservas Mensuales de Canchas
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataMensual}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="reservas" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
        </div>
    );
}

export const MiGraficoDeTorta = ({dataSemanal}) => {
    return (
    <div style={{ width: "50%", height: 400 }}>
        <h3 style={{ textAlign: "center", color: "white", marginBottom: "10px" }}>
        Reservas Semanales
        </h3>
        <ResponsiveContainer width="100%" height="100%">
        <PieChart>
            <Pie
            data={dataSemanal}
            dataKey="reservas"
            nameKey="dia"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
            >
            {dataSemanal.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={colores_pie[index % colores_pie.length]} />
            ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
        </ResponsiveContainer>
    </div>
    );
}

export const MiGraficoDeBarrasApiladas = ({datacancha}) => {
    return (
        <div>
            <h3 style={{ textAlign: "center", marginBottom: "10px", color: "white" }}>
                estadísticas
            </h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={datacancha} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="cancha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="confirmadas" stackId="a" fill="#4caf50" />
                    <Bar dataKey="pendientes" stackId="a" fill="#ffeb3b" />
                    <Bar dataKey="canceladas" stackId="a" fill="#f44336" />
                    <Bar dataKey="terminadas" stackId="a" fill="#9e9e9e" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}


export const MiScatterChart = ({ data }) => {
    return (
        <div style={{ width: "100%", height: 400 }}>
            <h3 style={{ textAlign: "center", marginBottom: "10px", color: "#fff" }}>
                Reservas por Hora y Cancha
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="Hora" unit="hs" />
                    <YAxis type="number" dataKey="y" name="Cancha" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name="Reservas" data={data} fill="#8884d8" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export const MiHeatmap = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
        >
            <CartesianGrid />
            <XAxis
            type="number"
            dataKey="hour"
            name="Hora"
            domain={[0, 23]}
            tickCount={24}
            label={{ value: "Hora", position: "insideBottomRight", offset: -10 }}
            />
            <YAxis
            type="number"
            dataKey="day"
            name="Día"
            domain={[0, 6]}
            ticks={[0, 1, 2, 3, 4, 5, 6]}
            tickFormatter={(value) => days[value]}
            label={{ value: "Día de la semana", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name, props) => {
                if (name === "value") return [`${value} reservas`, "Cantidad"];
                return value;
            }}
            labelFormatter={(label) =>
                `Día: ${days[label.day]}, Hora: ${label.hour}`
            }
            />
            <Scatter data={data} fill="#8884d8">
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
            ))}
            </Scatter>
        </ScatterChart>
    </ResponsiveContainer>
    );
};

export const MiComposedChart = ({  canchas, selectedId, handleRowClick }) => {
    return (
        <>
        <h2 style={{ marginBottom: "16px" }}>Selecciona una Cancha</h2>

        <div
            style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(3, 3, 3, 0.1)",
            overflow: "hidden",
            }}
        >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Nombre</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Ubicación</th>
                </tr>
            </thead>
            <tbody>
                {canchas?.map(({ id, nombre, zona }) => (
                <tr
                    key={id}
                    onClick={() => handleRowClick(id)}
                    style={{
                    backgroundColor: selectedId === id ? "#ffe58f" : "white",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                    if (selectedId !== id) {
                        e.currentTarget.style.backgroundColor = "#fafafa";
                    }
                    }}
                    onMouseLeave={(e) => {
                    if (selectedId !== id) {
                        e.currentTarget.style.backgroundColor = "white";
                    }
                    }}
                >
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #eee" }}>{nombre}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #eee" }}>{zona}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </>
    );
    };


