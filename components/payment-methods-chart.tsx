"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface PaymentMethodsChartProps {
  data: Array<{ method: string; count: number; percentage: number }>
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border-2 border-accent/20 rounded-lg shadow-lg p-3 backdrop-blur-sm">
        <p className="text-sm font-semibold text-foreground mb-2">{payload[0].payload.method}</p>
        <div className="space-y-1">
          <p className="text-lg font-bold" style={{ color: payload[0].payload.fill }}>
            {payload[0].value} transacciones
          </p>
          <p className="text-xs text-muted-foreground">{payload[0].payload.percentage.toFixed(1)}% del total</p>
        </div>
      </div>
    )
  }
  return null
}

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  return (
    <Card className="border-2 hover:border-chart-4/30 transition-colors">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-chart-4 animate-pulse" />
          <CardTitle className="text-xl">Métodos de Pago</CardTitle>
        </div>
        <CardDescription>Distribución de métodos de pago utilizados</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ method, percentage }) => `${method}: ${percentage.toFixed(1)}%`}
              outerRadius={90}
              innerRadius={50}
              fill="#8884d8"
              dataKey="count"
              nameKey="method"
              animationDuration={1500}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((entry, index) => (
            <div key={entry.method} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-xs text-muted-foreground">{entry.method}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
