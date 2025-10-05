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

const data = [
  { mes: "Ene", verdor: 35 },
  { mes: "Feb", verdor: 60 },
  { mes: "Mar", verdor: 78 },
  { mes: "Abr", verdor: 95 },
  { mes: "May", verdor: 70 },
];

const NDVIChart = () => {
  return (
    <div className="bg-[#1b1d2a] p-4 rounded-2xl shadow-lg text-white">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d2f3b" />
          <XAxis dataKey="mes" stroke="#a0a0a0" />
          <YAxis stroke="#a0a0a0" domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2230",
              border: "none",
              fontSize: "12px",
            }}
          />
          {/* Línea histórica */}
          <Line
            type="monotone"
            dataKey="verdor"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
          />
          {/* Línea punteada predicción */}
          <Line
            type="monotone"
            dataKey="prediccion"
            stroke="#fbbf24"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
          {/* Línea vertical - fecha actual */}
          <ReferenceLine
            x="Abr"
            stroke="#60a5fa"
            strokeDasharray="3 3"
            label={{
              value: "Hoy",
              position: "top",
              fontSize: "12px",
            }}
          />
          {/* Línea vertical - pico */}
          <ReferenceLine
            x="Abr"
            stroke="#facc15"
            strokeWidth={3}
            label={{
              value: "Pico",
              position: "bottom",
              fontSize: "12px",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NDVIChart;