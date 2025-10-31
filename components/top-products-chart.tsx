"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TopProductsChartProps {
  data: Array<{ name: string; total: number; quantity: number }>
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border-2 border-chart-2/20 rounded-lg shadow-lg p-3 backdrop-blur-sm">
        <p className="text-sm font-semibold text-foreground mb-2">{payload[0].payload.name}</p>
        <div className="space-y-1">
          <p className="text-lg font-bold text-chart-2">
            ${payload[0].value.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground">{payload[0].payload.quantity} unidades vendidas</p>
        </div>
      </div>
    )
  }
  return null
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  return (
    <Card className="border-2 hover:border-chart-2/30 transition-colors">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-chart-2 animate-pulse" />
          <CardTitle className="text-xl">Top 5 Productos</CardTitle>
        </div>
        <CardDescription>Productos más vendidos por ingresos totales</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={130}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--chart-2))", opacity: 0.1 }} />
            <Bar dataKey="total" fill="hsl(var(--chart-2))" radius={[0, 8, 8, 0]} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
