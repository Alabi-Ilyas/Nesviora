import {
  LineChart as RLineChart,
  Line,
  AreaChart as RAreaChart,
  Area,
  BarChart as RBarChart,
  Bar,
  PieChart as RPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

const COLORS = [
  "#006989",
  "#0CF574",
  "#FF7D00",
  "#FFB020",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
];

interface ChartData {
  [key: string]: string | number;
}

function useChartTheme() {
  const { theme } = useTheme();
  const grid = theme === "dark" ? "#26323B" : "#E4E7EC";
  const text = theme === "dark" ? "#98A2B3" : "#667085";
  return { grid, text };
}

function CustomTooltip({
  active,
  payload,
  label,
  valuePrefix = "$",
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
  valuePrefix?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-vaulta-border bg-vaulta-surface px-3 py-2 shadow-vaulta-lg">
      {label && <p className="text-xs text-vaulta-muted mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold text-vaulta-text">
          {valuePrefix}
          {Number(entry.value).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
        </p>
      ))}
    </div>
  );
}

export function AreaChart({
  data,
  dataKey = "value",
  xKey = "time",
  height = 250,
  color = "#006989",
  valuePrefix = "$",
}: {
  data: ChartData[];
  dataKey?: string;
  xKey?: string;
  height?: number;
  color?: string;
  valuePrefix?: string;
}) {
  const { grid, text } = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RAreaChart
        data={data}
        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: text, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => {
            const d = new Date(v);
            return d.getHours !== undefined
              ? `${d.getMonth() + 1}/${d.getDate()}`
              : v;
          }}
        />
        <YAxis
          tick={{ fill: text, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) =>
            `$${Number(v).toLocaleString("en-US", { notation: "compact" })}`
          }
        />
        <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} />} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${dataKey})`}
        />
      </RAreaChart>
    </ResponsiveContainer>
  );
}

export function LineChart({
  data,
  dataKey = "value",
  xKey = "time",
  height = 250,
  color = "#006989",
  valuePrefix = "$",
}: {
  data: ChartData[];
  dataKey?: string;
  xKey?: string;
  height?: number;
  color?: string;
  valuePrefix?: string;
}) {
  const { grid, text } = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RLineChart
        data={data}
        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={grid} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: text, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
        />
        <YAxis
          tick={{ fill: text, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) =>
            `$${Number(v).toLocaleString("en-US", { notation: "compact" })}`
          }
        />
        <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} />} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </RLineChart>
    </ResponsiveContainer>
  );
}

export function BarChartComponent({
  data,
  dataKey = "value",
  xKey = "name",
  height = 250,
  color = "#006989",
  valuePrefix = "",
}: {
  data: ChartData[];
  dataKey?: string;
  xKey?: string;
  height?: number;
  color?: string;
  valuePrefix?: string;
}) {
  const { grid, text } = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart
        data={data}
        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={grid} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: text, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: text, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) =>
            valuePrefix +
            Number(v).toLocaleString("en-US", { notation: "compact" })
          }
        />
        <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} />} />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </RBarChart>
    </ResponsiveContainer>
  );
}

export function PieChartComponent({
  data,
  height = 250,
  valuePrefix = "",
}: {
  data: { name: string; value: number }[];
  height?: number;
  valuePrefix?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={50}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} />} />
      </RPieChart>
    </ResponsiveContainer>
  );
}

export function MiniSparkline({
  data,
  color = "#0CF574",
  height = 40,
  width = 100,
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width={width} height={height}>
      <RLineChart
        data={chartData}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
        />
      </RLineChart>
    </ResponsiveContainer>
  );
}
