import { ResponsiveContainer, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface RadarChartProps {
  data: Array<{
    category: string;
    value: number;
  }>;
}

export const RadarChart = ({ data }: RadarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadar data={data}>
        <PolarGrid stroke="#30363d" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: '#8b949e', fontSize: 12 }}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#00ffd5"
          fill="#00ffd5"
          fillOpacity={0.3}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
};