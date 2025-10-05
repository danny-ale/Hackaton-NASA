
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
const NDVIChart = ({ feature }) => {
  // Si no hay feature, no mostrar nada
  if (!feature) return null;
  const timeSeries = feature?.properties?.time_series || [];
  // Prepara los datos para la gráfica
  const chartData = timeSeries.map(ts => ({
    date: ts.date,
    ndvi: Math.round(ts.ndvi_value * 100),
    type: ts.type
  }));
  // Separa históricos y predicciones
  const historicos = chartData.filter(d => d.type === "historical");
  const predicciones = chartData.filter(d => d.type === "predicted");
  // Para unir la línea, se concatena el último histórico con los predichos
  const prediccionLine = historicos.length > 0 ? [historicos[historicos.length-1], ...predicciones] : predicciones;

  return (
    <div className="bg-[#1b1d2a] p-4 rounded-2xl shadow-lg text-white">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d2f3b" />
          <XAxis dataKey="date" stroke="#a0a0a0" type="category" allowDuplicatedCategory={false} />
          <YAxis stroke="#a0a0a0" domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2230",
              border: "none",
              fontSize: "12px",
            }}
            formatter={(value, name) => [`${value/100}`, "NDVI"]}
          />
          {/* Línea histórica (verde) */}
          <Line
            type="monotone"
            data={historicos}
            dataKey="ndvi"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4, fill: '#22c55e' }}
            isAnimationActive={false}
          />
          {/* Línea predicción (amarillo, punteada) */}
          <Line
            type="monotone"
            data={prediccionLine}
            dataKey="ndvi"
            stroke="#fbbf24"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={{ r: 4, fill: '#fbbf24' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NDVIChart;