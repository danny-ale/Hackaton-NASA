
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

  // Detectar años únicos
  const years = Array.from(new Set(chartData.map(d => d.date?.slice(0,4)).filter(Boolean)));
  const isSingleYear = years.length === 1;
  // Formateador de eje X
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  let yearTicks = [];
  if (!isSingleYear) {
    // Calcular los años únicos y ordenados
    yearTicks = years.map(y => parseInt(y, 10)).sort((a, b) => a - b);
  }
  const visibleYearSet = new Set();
  const formatXAxis = (tick) => {
    if (!tick) return '';
    if (isSingleYear) {
      // Mostrar mes abreviado
      const m = parseInt(tick.slice(5,7), 10);
      return monthNames[m-1] || '';
    } else {
      // Mostrar solo cada 5 años, y siempre el primero y el último
      const year = parseInt(tick.slice(0,4), 10);
      if (!yearTicks.length) return '';
      const first = yearTicks[0];
      const last = yearTicks[yearTicks.length-1];
      if (year === first || year === last || year % 5 === 0) {
        visibleYearSet.add(year);
        return String(year);
      }
      return '';
    }
  };
  // Custom dot para mostrar solo en los años visibles
  const customDot = (props) => {
    const { cx, cy, payload } = props;
    if (isSingleYear) {
      return <circle cx={cx} cy={cy} r={5} fill="#22c55e" />;
    }
    const year = parseInt(payload.date?.slice(0,4), 10);
    if (visibleYearSet.has(year)) {
      return <circle cx={cx} cy={cy} r={5} fill="#22c55e" />;
    }
    return null;
  };

  // Separa históricos y predicciones
  const historicos = chartData.filter(d => d.type === "historical");
  const predicciones = chartData.filter(d => d.type === "predicted");
  // Para unir la línea, se concatena el último histórico con los predichos
  const prediccionLine = historicos.length > 0 ? [historicos[historicos.length-1], ...predicciones] : predicciones;

  return (
    <div className="bg-[#1b1d2a] p-4 rounded-2xl shadow-lg text-white flex justify-center">
      <ResponsiveContainer width={600} height={260}>
        <LineChart margin={{ left: 30, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d2f3b" />
          <XAxis
            dataKey="date"
            stroke="#a0a0a0"
            type="category"
            allowDuplicatedCategory={false}
            tickFormatter={formatXAxis}
            padding={{ left: 30, right: 30 }}
          />
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
            dot={customDot}
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
            dot={props => {
              const { cx, cy, payload } = props;
              if (isSingleYear) return <circle cx={cx} cy={cy} r={5} fill="#fbbf24" />;
              const year = parseInt(payload.date?.slice(0,4), 10);
              if (visibleYearSet.has(year)) return <circle cx={cx} cy={cy} r={5} fill="#fbbf24" />;
              return null;
            }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NDVIChart;